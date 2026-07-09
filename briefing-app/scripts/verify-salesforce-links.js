import { execFile } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { loadBriefingCompanies } from './extract-briefing-companies.js';
import {
  buildCompanyKey,
  buildSalesforceAccountUrl,
  extractNameAliases,
  normalizeDomain,
  scoreAccountMatch,
  shouldDisplaySalesforceLink,
} from './salesforce-link-utils.js';

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ORG_ALIAS = 'nvcrm-dev';
const BRIEFINGS_DIR = join(__dirname, '../../briefings');
const CACHE_PATH = join(__dirname, '../src/data/salesforce-account-links.json');
const REVIEW_PATH = join(__dirname, '../src/data/salesforce-link-review.md');

const ACCOUNT_BASE_FIELDS = ['Id', 'Name'];
const ACCOUNT_OPTIONAL_FIELDS = ['Website', 'AccountTags__c'];
const INCEPTION_BASE_FIELDS = ['Id', 'Company_Name__c', 'Membership_Status__c', 'Account__c'];

export function escapeSoqlString(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function runSf(args) {
  try {
    const { stdout } = await execFileAsync('sf', args, {
      maxBuffer: 1024 * 1024 * 20,
    });
    const parsed = JSON.parse(stdout);
    if (parsed.status && parsed.status !== 0) {
      const message = parsed.message ?? parsed.name ?? 'Salesforce CLI returned an error';
      throw new Error(`${parsed.status} ${parsed.name ?? 'SalesforceError'}: ${message}`);
    }
    return parsed;
  } catch (error) {
    if (error.stdout) {
      try {
        const parsed = JSON.parse(error.stdout);
        const message = parsed.message ?? parsed.name ?? error.message;
        throw new Error(`${parsed.status ?? 'unknown'} ${parsed.name ?? 'SalesforceError'}: ${message}`);
      } catch (parseError) {
        if (parseError.message.includes('SalesforceError')) throw parseError;
      }
    }
    const stderr = error.stderr ? ` stderr: ${error.stderr}` : '';
    throw new Error(`${error.message}${stderr}`);
  }
}

export async function runSfQuery(soql) {
  const parsed = await runSf([
    'data',
    'query',
    '--json',
    '-o',
    ORG_ALIAS,
    '--query',
    soql,
  ]);
  return parsed.result?.records ?? [];
}

export async function describeObject(objectName) {
  const parsed = await runSf([
    'sobject',
    'describe',
    '--sobject',
    objectName,
    '-o',
    ORG_ALIAS,
    '--json',
  ]);
  return parsed.result;
}

function getFieldNames(describeResult) {
  return new Set((describeResult?.fields ?? []).map(field => field.name));
}

export async function discoverSchema() {
  const [accountDescribe, inceptionDescribe] = await Promise.all([
    describeObject('Account'),
    describeObject('Inception_Connect_Profile__c'),
  ]);
  const accountFields = getFieldNames(accountDescribe);
  const inceptionFields = getFieldNames(inceptionDescribe);

  const requiredAccount = ACCOUNT_BASE_FIELDS.filter(field => !accountFields.has(field));
  const requiredInception = INCEPTION_BASE_FIELDS.filter(field => !inceptionFields.has(field));
  if (requiredAccount.length || requiredInception.length) {
    throw new Error(`Missing required Salesforce fields: ${[...requiredAccount, ...requiredInception].join(', ')}`);
  }

  return {
    accountFields: [...ACCOUNT_BASE_FIELDS, ...ACCOUNT_OPTIONAL_FIELDS.filter(field => accountFields.has(field))],
    inceptionFields: INCEPTION_BASE_FIELDS.filter(field => inceptionFields.has(field)),
    hasAccountWebsite: accountFields.has('Website'),
    hasAccountTags: accountFields.has('AccountTags__c'),
  };
}

function accountSelect(schema) {
  return schema?.accountFields?.join(', ') ?? 'Id, Name, Website, AccountTags__c';
}

function inceptionSelect(schema) {
  return schema?.inceptionFields?.join(', ') ?? 'Id, Company_Name__c, Membership_Status__c, Account__c';
}

function shortestSafeAlias(company) {
  return (company.aliases ?? extractNameAliases(company.name))
    .filter(alias => alias.length >= 4)
    .sort((a, b) => a.length - b.length)[0] ?? null;
}

function uniqueById(records) {
  const map = new Map();
  for (const record of records) {
    if (record?.Id && !map.has(record.Id)) map.set(record.Id, record);
  }
  return [...map.values()];
}

function buildCandidateQueries(company, schema) {
  const queries = [];
  const accountFields = accountSelect(schema);
  const inceptionFields = inceptionSelect(schema);
  const aliases = company.aliases?.length ? company.aliases : extractNameAliases(company.name);

  if (company.markdownSalesforceAccountId) {
    queries.push({
      kind: 'existingAccount',
      soql: `SELECT ${accountFields} FROM Account WHERE Id = '${escapeSoqlString(company.markdownSalesforceAccountId)}'`,
    });
  }

  for (const alias of aliases) {
    queries.push({
      kind: 'accountCandidates',
      soql: `SELECT ${accountFields} FROM Account WHERE Name = '${escapeSoqlString(alias)}' LIMIT 20`,
    });
  }

  const coreAlias = shortestSafeAlias(company);
  if (coreAlias) {
    queries.push({
      kind: 'accountCandidates',
      soql: `SELECT ${accountFields} FROM Account WHERE Name LIKE '%${escapeSoqlString(coreAlias)}%' LIMIT 20`,
    });
  }

  if (company.websiteDomain && schema?.hasAccountWebsite !== false) {
    queries.push({
      kind: 'accountCandidates',
      soql: `SELECT ${accountFields} FROM Account WHERE Website LIKE '%${escapeSoqlString(company.websiteDomain)}%' LIMIT 20`,
    });
  }

  for (const alias of aliases) {
    queries.push({
      kind: 'inceptionProfiles',
      soql: `SELECT ${inceptionFields} FROM Inception_Connect_Profile__c WHERE Company_Name__c LIKE '%${escapeSoqlString(alias)}%' LIMIT 20`,
    });
  }

  return queries;
}

export async function findCandidateAccounts(company, schema) {
  const result = {
    company,
    existingAccount: null,
    accountCandidates: [],
    inceptionProfiles: [],
    profileAccounts: [],
    queryErrors: [],
  };

  for (const query of buildCandidateQueries(company, schema)) {
    try {
      const records = await runSfQuery(query.soql);
      if (query.kind === 'existingAccount') {
        result.existingAccount = records[0] ?? null;
        if (records[0]) result.accountCandidates.push(records[0]);
      } else {
        result[query.kind].push(...records);
      }
    } catch (error) {
      result.queryErrors.push({ soql: query.soql, message: error.message });
      throw error;
    }
  }

  const profileAccountIds = [...new Set(
    result.inceptionProfiles
      .map(profile => profile.Account__c)
      .filter(Boolean),
  )];
  if (profileAccountIds.length > 0) {
    const quotedIds = profileAccountIds.map(id => `'${escapeSoqlString(id)}'`).join(', ');
    const records = await runSfQuery(`SELECT ${accountSelect(schema)} FROM Account WHERE Id IN (${quotedIds})`);
    result.profileAccounts.push(...records);
    result.accountCandidates.push(...records);
  }

  result.accountCandidates = uniqueById(result.accountCandidates);
  result.profileAccounts = uniqueById(result.profileAccounts);
  return result;
}

function linkedProfileForAccount(profiles, account) {
  return profiles.find(profile => profile.Account__c === account.Id) ?? null;
}

export function selectBestAccount(candidateResult) {
  const scoredCandidates = candidateResult.accountCandidates.map(account => {
    const linkedProfile = linkedProfileForAccount(candidateResult.inceptionProfiles, account);
    const score = scoreAccountMatch(candidateResult.company, account, linkedProfile);
    return { account, linkedProfile, ...score };
  });

  const high = scoredCandidates.filter(candidate => candidate.confidence === 'high');
  const medium = scoredCandidates.filter(candidate => candidate.confidence === 'medium');
  const low = scoredCandidates.filter(candidate => candidate.confidence === 'low');
  const rejected = scoredCandidates.filter(candidate => candidate.confidence === 'reject');

  let selected = null;
  let matchConfidence = 'missing';
  let reviewStatus = 'not_found';
  let matchEvidence = [];
  let rejectionReasons = [];

  if (high.length === 1) {
    selected = high[0];
    matchConfidence = 'high';
    reviewStatus = 'auto_verified';
    matchEvidence = selected.evidence;
  } else if (high.length > 1) {
    matchConfidence = 'ambiguous';
    reviewStatus = 'needs_review';
    rejectionReasons = ['multiple high-confidence account candidates'];
  } else if (medium.length === 1) {
    selected = medium[0];
    matchConfidence = 'medium';
    reviewStatus = 'needs_review';
    matchEvidence = selected.evidence;
  } else if (medium.length > 1 || low.length > 0) {
    matchConfidence = medium.length > 1 ? 'ambiguous' : 'low';
    reviewStatus = 'needs_review';
    rejectionReasons = medium.length > 1
      ? ['multiple medium-confidence account candidates']
      : ['only low-confidence account candidates found'];
  } else if (rejected.length > 0) {
    matchConfidence = 'reject';
    reviewStatus = 'rejected';
    rejectionReasons = [...new Set(rejected.flatMap(candidate => candidate.rejectionReasons))];
  }

  const source = candidateResult.company;
  const account = selected?.account ?? null;
  const linkedProfile = selected?.linkedProfile ?? null;
  const record = {
    companyKey: source.companyKey,
    briefingDates: source.briefingDates ?? [source.briefingDate].filter(Boolean),
    sourceName: source.name,
    sourceWebsiteUrl: source.websiteUrl,
    sourceWebsiteDomain: source.websiteDomain,
    sourceDescription: source.description,
    salesforceAccountId: account?.Id ?? null,
    salesforceAccountUrl: account?.Id ? buildSalesforceAccountUrl(account.Id) : null,
    salesforceAccountName: account?.Name ?? null,
    salesforceWebsite: account?.Website ?? null,
    salesforceWebsiteDomain: normalizeDomain(account?.Website),
    salesforceAccountTags: account?.AccountTags__c ?? null,
    inceptionProfileId: linkedProfile?.Id ?? null,
    inceptionStatus: linkedProfile?.Membership_Status__c ?? source.inceptionStatus ?? null,
    opportunityCount: null,
    matchConfidence,
    matchEvidence,
    rejectionReasons,
    reviewStatus,
    candidateAccounts: scoredCandidates.map(candidate => ({
      id: candidate.account.Id,
      name: candidate.account.Name,
      website: candidate.account.Website ?? null,
      accountTags: candidate.account.AccountTags__c ?? null,
      confidence: candidate.confidence,
      evidence: candidate.evidence,
      rejectionReasons: candidate.rejectionReasons,
    })),
    verifiedAt: new Date().toISOString(),
  };

  return record;
}

async function addOpportunityCount(record) {
  if (!shouldDisplaySalesforceLink(record)) return record;
  const rows = await runSfQuery(`SELECT COUNT(Id) opps FROM Opportunity WHERE AccountId = '${escapeSoqlString(record.salesforceAccountId)}'`);
  const aggregate = rows[0] ?? {};
  return {
    ...record,
    opportunityCount: aggregate.opps ?? aggregate.expr0 ?? aggregate.Expr0 ?? null,
  };
}

function mergeCompanies(companies) {
  const map = new Map();
  for (const company of companies) {
    const key = company.companyKey;
    if (!map.has(key)) {
      map.set(key, {
        ...company,
        briefingDates: [company.briefingDate],
      });
      continue;
    }
    const existing = map.get(key);
    existing.briefingDates = [...new Set([...existing.briefingDates, company.briefingDate])];
    existing.markdownSalesforceAccountId ??= company.markdownSalesforceAccountId;
    existing.markdownSalesforceUrl ??= company.markdownSalesforceUrl;
    existing.websiteUrl ??= company.websiteUrl;
    existing.websiteDomain ??= company.websiteDomain;
  }
  return [...map.values()];
}

export function writeVerificationCache(records) {
  const cache = {
    generatedAt: new Date().toISOString(),
    sourceOrg: ORG_ALIAS,
    records: records.sort((a, b) => a.companyKey.localeCompare(b.companyKey)),
  };
  writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
}

function sectionRows(records) {
  if (records.length === 0) return '_None._\n';
  return records.map(record => {
    const candidates = record.candidateAccounts?.map(candidate => (
      `${candidate.id} ${candidate.name}${candidate.website ? ` (${candidate.website})` : ''} [${candidate.confidence}]`
    )).join('; ') || 'None';
    const evidence = record.matchEvidence?.join('; ') || 'None';
    const reasons = record.rejectionReasons?.join('; ') || 'None';
    return [
      `- **${record.sourceName}** (${record.sourceWebsiteDomain ?? 'no website'})`,
      `  - Dates: ${(record.briefingDates ?? []).join(', ') || 'unknown'}`,
      `  - Selected Account: ${record.salesforceAccountId ?? 'None'}`,
      `  - Confidence: ${record.matchConfidence}; Review: ${record.reviewStatus}`,
      `  - Evidence: ${evidence}`,
      `  - Rejection reasons: ${reasons}`,
      `  - Candidates: ${candidates}`,
    ].join('\n');
  }).join('\n\n') + '\n';
}

export function writeReviewReport(records) {
  const groups = {
    'Needs Review': records.filter(record => record.reviewStatus === 'needs_review'),
    'Not Found': records.filter(record => record.reviewStatus === 'not_found'),
    Rejected: records.filter(record => record.reviewStatus === 'rejected' || record.reviewStatus === 'error'),
    'Auto Verified': records.filter(record => record.reviewStatus === 'auto_verified' || record.reviewStatus === 'reviewed_verified'),
  };

  const lines = [
    '# Salesforce Link Review',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    ...Object.entries(groups).flatMap(([title, group]) => [
      `## ${title}`,
      '',
      sectionRows(group),
    ]),
  ];

  writeFileSync(REVIEW_PATH, `${lines.join('\n')}\n`);
}

function printDescribe(schema) {
  console.log(`Account fields: ${schema.accountFields.join(', ')}`);
  console.log(`Inception fields: ${schema.inceptionFields.join(', ')}`);
  if (!schema.hasAccountWebsite) {
    console.warn('Warning: Account.Website is unavailable; domain matching will be disabled.');
  }
}

async function verifyCompanies(companies, { dryRun = false, schema = null } = {}) {
  if (dryRun) {
    for (const company of companies) {
      console.log(`# ${company.name} (${company.websiteUrl ?? 'no website'})`);
      for (const query of buildCandidateQueries(company, schema)) {
        console.log(query.soql);
      }
    }
    return [];
  }

  const records = [];
  for (const company of companies) {
    console.log(`Verifying ${company.name}...`);
    const candidateResult = await findCandidateAccounts(company, schema);
    let record = selectBestAccount(candidateResult);
    record = await addOpportunityCount(record);
    records.push(record);
  }
  return records;
}

function companyFromArgs(args) {
  const companyIndex = args.indexOf('--company');
  const websiteIndex = args.indexOf('--website');
  if (companyIndex === -1 || !args[companyIndex + 1]) return null;
  const name = args[companyIndex + 1];
  const websiteUrl = websiteIndex !== -1 ? args[websiteIndex + 1] : null;
  return {
    companyKey: buildCompanyKey(name, websiteUrl),
    briefingDate: null,
    briefingDates: [],
    rank: 0,
    name,
    aliases: extractNameAliases(name),
    websiteUrl,
    websiteDomain: normalizeDomain(websiteUrl),
    description: '',
    articleUrl: null,
    vertical: '',
    stage: '',
    totalRaisedDisplay: '',
    investors: [],
    inceptionStatus: '',
    markdownSalesforceAccountId: null,
    markdownSalesforceUrl: null,
  };
}

export async function main(args = process.argv.slice(2)) {
  const describeOnly = args.includes('--describe-only');
  const dryRun = args.includes('--dry-run');
  const argCompany = companyFromArgs(args);

  const schema = dryRun && !describeOnly ? {
    accountFields: [...ACCOUNT_BASE_FIELDS, ...ACCOUNT_OPTIONAL_FIELDS],
    inceptionFields: INCEPTION_BASE_FIELDS,
    hasAccountWebsite: true,
    hasAccountTags: true,
  } : await discoverSchema();

  if (describeOnly) {
    printDescribe(schema);
    return;
  }

  const companies = argCompany ? [argCompany] : mergeCompanies(loadBriefingCompanies(BRIEFINGS_DIR));
  const records = await verifyCompanies(companies, { dryRun, schema });
  if (dryRun) return;

  writeVerificationCache(records);
  writeReviewReport(records);
  console.log(`Verified ${records.length} companies.`);
  console.log(`Wrote ${CACHE_PATH}`);
  console.log(`Wrote ${REVIEW_PATH}`);
}

function isCliEntrypoint() {
  return process.argv[1] === fileURLToPath(import.meta.url);
}

if (isCliEntrypoint()) {
  main().catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}

