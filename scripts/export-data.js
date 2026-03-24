const { Client } = require("@notionhq/client");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const SUMMARY_DB_ID = "20684728-2c35-40c8-96fc-53683437b91a";
const CLAIMS_DB_ID = "251f980c-a56a-492d-915b-7314a40806e3";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function fetchAllPages(databaseId) {
  const pages = [];
  let cursor = undefined;
  let page = 0;

  while (true) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });

    pages.push(...response.results);
    page++;
    console.log(`  Page ${page}: ${response.results.length} results (total: ${pages.length})`);

    if (!response.has_more) break;
    cursor = response.next_cursor;
  }

  return pages;
}

function plainText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray) || richTextArray.length === 0) return "";
  return richTextArray.map((rt) => rt.plain_text).join("");
}

function selectValue(prop) {
  return prop?.select?.name ?? null;
}

function numberValue(prop) {
  return prop?.number ?? null;
}

function urlValue(prop) {
  return prop?.url ?? null;
}

function titleValue(prop) {
  if (!prop?.title) return "";
  return plainText(prop.title);
}

function richTextValue(prop) {
  if (!prop?.rich_text) return "";
  return plainText(prop.rich_text);
}

function relationIds(prop) {
  if (!prop?.relation) return [];
  return prop.relation.map((r) => r.id);
}

function parseSummary(page) {
  const p = page.properties;
  return {
    id: page.id,
    name: titleValue(p["Theory of Change"]),
    domain: selectValue(p["Domain"]),
    type: selectValue(p["Type"]),
    impactScale: selectValue(p["Impact Scale"]),
    impactEstimate: richTextValue(p["Impact Estimate"]),
    weakestEvidenceLevel: selectValue(p["Weakest Evidence Level"]),
    investmentLevel: selectValue(p["Investment Level"]),
    investmentCase: richTextValue(p["Investment Case"]),
    achievableImpactScale: selectValue(p["Achievable Impact Scale"]),
    primaryGapType: selectValue(p["Primary Gap Type"]),
    investableInsight: richTextValue(p["Investable Insight"]),
    chainNarrative: richTextValue(p["Chain Narrative"]),
    keyConfounders: richTextValue(p["Key Confounders"]),
    timeHorizon: selectValue(p["Time Horizon"]),
    numberOfSteps: numberValue(p["Number of Steps"]),
    numberOfGaps: numberValue(p["Number of Gaps"]),
    dagPage: urlValue(p["DAG Page"]),
    claims: [],
  };
}

function parseClaim(page) {
  const p = page.properties;
  const gapType = selectValue(p["Gap Type"]);
  return {
    id: page.id,
    step: numberValue(p["Step"]),
    name: titleValue(p["Causal Claim"]),
    evidenceLevel: selectValue(p["Evidence Level"]),
    investmentLevel: selectValue(p["Investment Level"]),
    impactScale: selectValue(p["Impact Scale"]),
    valueIfWeStopHere: selectValue(p["Value if we stop here"]),
    gapType: gapType,
    isGap: gapType !== null && gapType !== "" && gapType !== "Not a Gap",
    timeHorizon: selectValue(p["Time Horizon"]),
    keyEvidence: richTextValue(p["Key Evidence"]),
    investmentNotes: richTextValue(p["Investment Notes"]),
    source: urlValue(p["Source"]),
    notes: richTextValue(p["Notes"]),
    _parentIds: relationIds(p["ToC Summary"]),
  };
}

async function main() {
  if (!process.env.NOTION_TOKEN) {
    console.error("Error: NOTION_TOKEN not set in .env");
    console.error("1. Create an integration at https://www.notion.so/my-integrations");
    console.error("2. Add NOTION_TOKEN=secret_... to your .env file");
    console.error("3. Share both databases with the integration in Notion");
    process.exit(1);
  }

  console.log("Fetching Summary DB:", SUMMARY_DB_ID);
  const summaryPages = await fetchAllPages(SUMMARY_DB_ID);
  console.log(`  Total summaries: ${summaryPages.length}`);

  if (summaryPages.length === 0) {
    console.error("Error: 0 summaries returned. Check that the database is shared with your integration.");
    process.exit(1);
  }

  console.log("\nFetching Claims DB:", CLAIMS_DB_ID);
  const claimPages = await fetchAllPages(CLAIMS_DB_ID);
  console.log(`  Total claims: ${claimPages.length}`);

  if (claimPages.length === 0) {
    console.error("Error: 0 claims returned. Check that the database is shared with your integration.");
    process.exit(1);
  }

  // Parse summaries into a map
  const theoriesMap = new Map();
  for (const page of summaryPages) {
    const theory = parseSummary(page);
    theoriesMap.set(theory.id, theory);
  }

  // Parse claims and nest under parent theories
  let orphanCount = 0;
  for (const page of claimPages) {
    const claim = parseClaim(page);
    const parentIds = claim._parentIds;
    delete claim._parentIds;

    if (parentIds.length === 0) {
      orphanCount++;
      continue;
    }

    for (const parentId of parentIds) {
      const theory = theoriesMap.get(parentId);
      if (theory) {
        theory.claims.push(claim);
      } else {
        orphanCount++;
      }
    }
  }

  if (orphanCount > 0) {
    console.log(`\nWarning: ${orphanCount} claims had no matching parent ToC`);
  }

  // Sort claims by step within each theory
  for (const theory of theoriesMap.values()) {
    theory.claims.sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
  }

  const theories = Array.from(theoriesMap.values());
  const totalClaims = theories.reduce((sum, t) => sum + t.claims.length, 0);

  const output = {
    meta: {
      exportedAt: new Date().toISOString(),
      tocCount: theories.length,
      claimCount: totalClaims,
    },
    domains: [
      "Healthcare",
      "Education",
      "Climate/Energy",
      "Scientific Research",
      "Labor/Employment",
      "Cross-Domain",
    ],
    theories,
  };

  const outPath = path.join(__dirname, "..", "public", "data.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\nExported to ${outPath}`);
  console.log(`  ${theories.length} theories of change`);
  console.log(`  ${totalClaims} claims`);
}

main().catch((err) => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
