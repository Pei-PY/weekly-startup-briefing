import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  buildSalesforceAccountUrl,
  extractSalesforceAccountId,
  isValidSalesforceAccountId,
  shouldDisplaySalesforceLink,
} from './salesforce-link-utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CACHE_PATH = join(__dirname, '../src/data/salesforce-account-links.json');
const DEFAULT_BRIEFINGS_PATH = join(__dirname, '../src/data/briefings.json');

const VALID_CONFIDENCE = new Set(['high', 'medium', 'low', 'ambiguous', 'reject', 'missing', 'error']);
const VALID_REVIEW_STATUS = new Set([
  'auto_verified',
  'reviewed_verified',
  'needs_review',
  'not_found',
  'rejected',
  'error',
]);

export function validateCache(cache) {
  const errors = [];
  const warnings = [];

  if (!cache || typeof cache !== 'object' || Array.isArray(cache)) {
    return { errors: ['cache must be a JSON object'], warnings };
  }

  if (!Array.isArray(cache.records)) {
    return { errors: ['cache.records must be an array'], warnings };
  }

  for (const [index, record] of cache.records.entries()) {
    const label = `records[${index}]`;
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      errors.push(`${label} must be an object`);
      continue;
    }

    if (!record.companyKey || typeof record.companyKey !== 'string') {
      errors.push(`${label}.companyKey must be a non-empty string`);
    }

    if (!VALID_CONFIDENCE.has(record.matchConfidence)) {
      errors.push(`${label}.matchConfidence must be one of ${[...VALID_CONFIDENCE].join(', ')}`);
    }

    if (!VALID_REVIEW_STATUS.has(record.reviewStatus)) {
      errors.push(`${label}.reviewStatus must be one of ${[...VALID_REVIEW_STATUS].join(', ')}`);
    }

    if (record.salesforceAccountId != null && !isValidSalesforceAccountId(record.salesforceAccountId)) {
      errors.push(`${label}.salesforceAccountId is not a valid Account ID`);
    }

    if (record.salesforceAccountUrl != null) {
      if (!record.salesforceAccountId) {
        errors.push(`${label}.salesforceAccountUrl is present without salesforceAccountId`);
      } else {
        const expectedUrl = buildSalesforceAccountUrl(record.salesforceAccountId);
        if (record.salesforceAccountUrl !== expectedUrl) {
          errors.push(`${label}.salesforceAccountUrl must equal ${expectedUrl}`);
        }
      }
    }

    if (shouldDisplaySalesforceLink(record)) {
      if (!Array.isArray(record.matchEvidence) || record.matchEvidence.length === 0) {
        errors.push(`${label} is display-approved but has no matchEvidence`);
      }
    }

    if (record.reviewStatus === 'needs_review') {
      warnings.push(`${label} needs manual review`);
    }
    if (record.reviewStatus === 'not_found') {
      warnings.push(`${label} has no Salesforce account`);
    }
  }

  return { errors, warnings };
}

export function validateBriefingsData(briefingsData, cache) {
  const errors = [];
  const warnings = [];
  const approvedAccountIds = new Set(
    cache.records
      .filter(record => shouldDisplaySalesforceLink(record))
      .map(record => record.salesforceAccountId),
  );

  for (const briefing of briefingsData?.briefings ?? []) {
    for (const company of briefing.companies ?? []) {
      const label = `${briefing.date} ${company.name}`;
      if (!company.websiteUrl) {
        warnings.push(`${label} has no website URL`);
      }
      if (!company.salesforceUrl) continue;

      const accountId = extractSalesforceAccountId(company.salesforceUrl);
      if (!accountId) {
        errors.push(`${label} has malformed Salesforce Account URL`);
        continue;
      }
      if (!approvedAccountIds.has(accountId)) {
        errors.push(`${label} Salesforce Account ${accountId} is not display-approved in cache`);
      }
    }
  }

  return { errors, warnings };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function runValidation({ cachePath = DEFAULT_CACHE_PATH, briefingsPath = DEFAULT_BRIEFINGS_PATH, includeBriefings = false } = {}) {
  const cache = readJson(cachePath);
  const cacheResult = validateCache(cache);
  const errors = [...cacheResult.errors];
  const warnings = [...cacheResult.warnings];

  if (includeBriefings) {
    const briefingsData = readJson(briefingsPath);
    const briefingsResult = validateBriefingsData(briefingsData, cache);
    errors.push(...briefingsResult.errors);
    warnings.push(...briefingsResult.warnings);
  }

  return { errors, warnings };
}

function isCliEntrypoint() {
  return process.argv[1] === fileURLToPath(import.meta.url);
}

if (isCliEntrypoint()) {
  const includeBriefings = process.argv.includes('--briefings');
  try {
    const { errors, warnings } = runValidation({ includeBriefings });
    for (const warning of warnings) {
      console.warn(`Warning: ${warning}`);
    }
    if (errors.length > 0) {
      for (const error of errors) {
        console.error(`Error: ${error}`);
      }
      process.exit(1);
    }
    console.log(`Salesforce link cache validation passed${includeBriefings ? ' with app data' : ''}.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

