const SALESFORCE_HOST = 'nvcrm.lightning.force.com';
const SALESFORCE_ACCOUNT_ID_RE = /^001[a-zA-Z0-9]{12}([a-zA-Z0-9]{3})?$/;
const LEGAL_SUFFIXES = new Set([
  'inc',
  'llc',
  'ltd',
  'limited',
  'corp',
  'corporation',
  'gmbh',
  'sas',
  'pbc',
]);
const RELATIONSHIP_TERMS = [
  'ventures',
  'capital',
  'university',
  'government',
  'customer',
  'partner',
  'reseller',
  'distributor',
];

export function normalizeCompanyName(name) {
  if (!name) return '';
  let normalized = String(name)
    .replace(/\([^)]*\)/g, ' ')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const parts = normalized.split(' ').filter(Boolean);
  while (parts.length > 1 && LEGAL_SUFFIXES.has(parts[parts.length - 1])) {
    parts.pop();
  }
  normalized = parts.join(' ');
  return normalized;
}

export function extractNameAliases(name) {
  const aliases = [];
  const primary = normalizeCompanyName(name);
  if (primary) aliases.push(primary);

  const raw = String(name ?? '');
  const aliasMatches = raw.matchAll(/\(([^)]+)\)/g);
  for (const match of aliasMatches) {
    const alias = normalizeCompanyName(match[1]);
    if (alias) aliases.push(alias);
  }

  return [...new Set(aliases)];
}

export function normalizeDomain(urlOrDomain) {
  if (!urlOrDomain) return null;
  const raw = String(urlOrDomain).trim();
  if (!raw) return null;

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    try {
      parsed = new URL(`https://${raw}`);
    } catch {
      return null;
    }
  }

  return parsed.hostname
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/\.$/, '') || null;
}

export function isValidSalesforceAccountId(accountId) {
  return SALESFORCE_ACCOUNT_ID_RE.test(String(accountId ?? ''));
}

export function extractSalesforceAccountId(url) {
  if (!url) return null;
  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    return null;
  }

  if (parsed.hostname !== SALESFORCE_HOST) return null;
  const match = parsed.pathname.match(/^\/lightning\/r\/Account\/([^/]+)\/view$/);
  if (!match) return null;

  const accountId = match[1];
  return isValidSalesforceAccountId(accountId) ? accountId : null;
}

export function buildSalesforceAccountUrl(accountId) {
  if (!isValidSalesforceAccountId(accountId)) {
    throw new Error(`Invalid Salesforce Account ID: ${accountId}`);
  }
  return `https://${SALESFORCE_HOST}/lightning/r/Account/${accountId}/view`;
}

export function buildCompanyKey(name, websiteUrl) {
  const normalizedName = normalizeCompanyName(name);
  const domain = normalizeDomain(websiteUrl) ?? 'no-domain';
  return `${normalizedName}|${domain}`;
}

function accountNameHasRelationshipTerm(sourceAliases, accountName) {
  const normalizedAccount = normalizeCompanyName(accountName);
  return RELATIONSHIP_TERMS.some(term => (
    normalizedAccount.split(' ').includes(term) &&
    !sourceAliases.some(alias => alias.split(' ').includes(term))
  ));
}

function namesExactlyMatch(sourceAliases, accountName) {
  const normalizedAccount = normalizeCompanyName(accountName);
  return sourceAliases.includes(normalizedAccount);
}

function namesPartiallyMatch(sourceAliases, accountName) {
  const normalizedAccount = normalizeCompanyName(accountName);
  if (!normalizedAccount) return false;
  return sourceAliases.some(alias => (
    alias.length >= 4 &&
    normalizedAccount.length >= 4 &&
    (normalizedAccount.includes(alias) || alias.includes(normalizedAccount))
  ));
}

function profileMatches(sourceAliases, candidateAccount, linkedProfile) {
  if (!linkedProfile || !candidateAccount?.Id) return false;
  if (linkedProfile.Account__c !== candidateAccount.Id) return false;
  const profileName = normalizeCompanyName(linkedProfile.Company_Name__c);
  return sourceAliases.includes(profileName);
}

export function scoreAccountMatch(sourceCompany, candidateAccount, linkedProfile = null) {
  const evidence = [];
  const rejectionReasons = [];
  const accountId = candidateAccount?.Id;

  if (!isValidSalesforceAccountId(accountId)) {
    rejectionReasons.push('candidate account id is missing or invalid');
    return { confidence: 'reject', evidence, rejectionReasons };
  }

  const sourceAliases = sourceCompany?.aliases?.length
    ? sourceCompany.aliases
    : extractNameAliases(sourceCompany?.name);
  const sourceDomain = normalizeDomain(sourceCompany?.websiteUrl ?? sourceCompany?.websiteDomain);
  const accountDomain = normalizeDomain(candidateAccount?.Website);
  const exactName = namesExactlyMatch(sourceAliases, candidateAccount?.Name);
  const partialName = namesPartiallyMatch(sourceAliases, candidateAccount?.Name);
  const linkedProfileMatch = profileMatches(sourceAliases, candidateAccount, linkedProfile);

  if (accountNameHasRelationshipTerm(sourceAliases, candidateAccount?.Name)) {
    rejectionReasons.push('account name contains relationship term not present in source company name');
    return { confidence: 'reject', evidence, rejectionReasons };
  }

  if (sourceDomain && accountDomain && sourceDomain !== accountDomain) {
    rejectionReasons.push(`account website domain ${accountDomain} conflicts with source domain ${sourceDomain}`);
    return { confidence: 'reject', evidence, rejectionReasons };
  }

  if (sourceDomain && accountDomain && sourceDomain === accountDomain) {
    evidence.push('exact website domain match');
    if (exactName) evidence.push('exact normalized name match');
    return { confidence: 'high', evidence, rejectionReasons };
  }

  if (linkedProfileMatch && (exactName || partialName || accountDomain === sourceDomain)) {
    evidence.push('linked inception profile account match');
    if (exactName) evidence.push('exact normalized name match');
    if (partialName && !exactName) evidence.push('partial normalized name match');
    return { confidence: 'high', evidence, rejectionReasons };
  }

  if (exactName) {
    evidence.push('exact normalized name match');
    return { confidence: 'medium', evidence, rejectionReasons };
  }

  if (partialName) {
    evidence.push('partial normalized name match');
    return { confidence: 'low', evidence, rejectionReasons };
  }

  rejectionReasons.push('no name, domain, or profile evidence matched');
  return { confidence: 'reject', evidence, rejectionReasons };
}

export function shouldDisplaySalesforceLink(record) {
  if (!record?.salesforceAccountId || !isValidSalesforceAccountId(record.salesforceAccountId)) {
    return false;
  }
  if (record.reviewStatus === 'reviewed_verified') return true;
  return record.matchConfidence === 'high' && record.reviewStatus === 'auto_verified';
}

