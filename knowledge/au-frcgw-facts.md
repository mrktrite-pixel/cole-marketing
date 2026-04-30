# AU FRCGW Facts — Verified Reference

> **Status:** STUB — facts marked `[VERIFY: ...]` require confirmation against ato.gov.au before content using them ships.
> **Last verified:** April 2026 (operator-confirmed values from `cole/config/au-19-frcgw-clearance-certificate.ts` only — `[VERIFY]` items not yet checked).
> **Source of truth:** ato.gov.au. All `[VERIFY]` items must be confirmed against the official ATO page before removing the tag.

> **How to use:** Content bees (G3 Copywriter, G5 Story Writer, G6 Article Builder, G7 Email Writer, G8 Video Scripter) read this file in Step 0c and use ONLY values shown without a `[VERIFY]` tag. If a needed fact carries a `[VERIFY]` tag, the bee writes `[FACT NEEDED: <description>]` in the output. G4 Content Manager fails any content containing `[FACT NEEDED]`.

---

## The Rule

- **Name:** Foreign Resident Capital Gains Withholding
- **Short form:** FRCGW
- **Authority:** Australian Taxation Office (ATO)
- **Authority URL:** https://www.ato.gov.au
- **Legislation:** Taxation Administration Act 1953, Schedule 1, Subdivision 14-D — Foreign Resident Capital Gains Withholding Payments
- **Specific section reference within Subdivision 14-D:** [VERIFY: confirm exact section numbers — config references "Subdivision 14-D" but does not state e.g. s14-200, s14-205, s14-210]
- **Enacting amendment (1 Jan 2025 changes):** Treasury Laws Amendment (Foreign Resident Capital Gains Withholding) Act 2024
- **Royal Assent of amending act:** [VERIFY: config lawBarSummary states 21 November 2024 — confirm against ATO/Parliament source]

---

## The Threshold (current rule)

- **Effective from:** 1 January 2025
- **Threshold:** $0 (every Australian property sale is in scope)
- **Withholding rate:** 15%
- **Base of withholding:** Sale price (not capital gain, not profit, not net of costs)

## The Threshold (previous rule, expired 31 Dec 2024)

- **Threshold:** $750,000
- **Withholding rate:** 12.5%
- **Status:** Expired 31 December 2024 — does not apply to settlements from 1 Jan 2025 onwards

---

## The Fear Number (Gary's product, AU-19)

Withholding is **15% of the sale price**, calculated at settlement.

| Sale price | Withholding (15%) |
|---|---|
| $300,000 | $45,000 |
| $450,000 | $67,500 |
| $500,000 | $75,000 |
| $650,000 | $97,500 |
| **$900,000** | **$135,000** ← Gary's headline number (config-confirmed) |
| $1,000,000 | $150,000 |
| $1,200,000 | $180,000 |
| $1,500,000 | $225,000 |
| $5,000,000 | $750,000 |

These are arithmetic calculations of the confirmed 15% rate × sale price; values are correct so long as the rate stays at 15%.

---

## Who It Applies To

- **All sellers of Australian real property from 1 January 2025 onwards** — both Australian tax residents and foreign residents.
- **Australian tax residents:** Apply for a standard clearance certificate. The certificate confirms residency status, allowing the buyer to release full proceeds at settlement.
- **Foreign residents:** No automatic exemption. Must apply for a variation certificate under the exemption provisions (separate, longer process — for example, former Australian residents now living overseas, or short-term working visa holders returning home).
- **The buyer cannot assess the seller's residency** — the law does not allow them to. Without a certificate, the buyer's solicitor must withhold regardless of the seller's actual residency.

---

## The Clearance Certificate

- **Issuer:** ATO (Australian Taxation Office)
- **Cost:** No fee
- **Form name / official application name:** [VERIFY: config does not state the exact form name — confirm on ato.gov.au, e.g. "Online clearance certificate application for Australian residents"]
- **Apply via:** [VERIFY: confirm the exact ATO online portal URL for the clearance certificate application]
- **Processing time:** 1–4 weeks (typical; varies with ATO workload and application complexity)
- **Validity period:** [VERIFY: confirm whether the certificate has a fixed validity period such as 12 months from issue, or is single-transaction]
- **Must be provided:** To the buyer's solicitor BEFORE settlement closes. The certificate cannot be applied retrospectively.
- **Recommended lead time:** 4–6 weeks before settlement (provides margin against processing variability)

---

## The Consequence (without certificate)

- **At settlement:** Buyer's solicitor must withhold 15% of the sale price from the seller's proceeds.
- **Where the cash goes:** Held by the buyer's solicitor, then remitted to the ATO as withholding. [VERIFY: confirm exact remittance mechanism — does the buyer's solicitor remit directly to the ATO, or is it the buyer's tax obligation that the solicitor administers?]
- **Recovery for Australian residents:** Through the income tax system in the following financial year — typically refunded as part of the seller's tax return.
- **Recovery for foreign residents:** Through the income tax system, but the timeline is different and may be conditional on the variation outcome. [VERIFY: confirm the foreign-resident refund pathway and typical timing]
- **Cash locked-up period:** 6–18 months (pending tax-return processing for Australian residents)

---

## The Deadline

- **Hard deadline:** Certificate must be in the buyer's solicitor's possession BEFORE settlement closes (i.e., before the funds change hands on settlement day).
- **Operator phrasing in product config:** "BEFORE 9 am on settlement day." [VERIFY: confirm whether 9 am is an ATO-stated deadline or operator shorthand for "before settlement morning" — the official rule is "before settlement closes"]
- **Application deadline:** No formal deadline, but the ATO's 1–4 week processing window means applications submitted later than 4 weeks before settlement carry escalating risk.
- **Settlement extension:** Possible only with buyer agreement; rare in practice.

---

## The Legislation (full citation)

- **Primary act:** Taxation Administration Act 1953 (Cth)
- **Subdivision:** Schedule 1, Subdivision 14-D — Foreign Resident Capital Gains Withholding Payments
- **Specific sections:** [VERIFY: confirm sections within Subdivision 14-D — likely includes s14-200 (withholding obligation), s14-205 (clearance certificate), s14-210 (variations); verify exact numbering]
- **Amending act (1 Jan 2025 changes):** Treasury Laws Amendment (Foreign Resident Capital Gains Withholding) Act 2024
- **Royal Assent of amending act:** [VERIFY: 21 November 2024 per config; confirm via Parliament/ATO]
- **Commencement of changed rule:** 1 January 2025
- **Note:** Config lists this product under "TAA 1953 Schedule 1 Subdivision 14-D"; user request mentioned "Income Tax Assessment Act 1936" — those are **different acts**. The TAA 1953 reference in the config is operator-confirmed; ITAA 1936 is **not** the FRCGW source. Do not mix the two.

---

## Common Misconceptions (config-confirmed AI corrections)

These are the four AI-correction pairs already published on the AU-19 product page (`page.tsx` Section 8) and validated by the operator:

1. **Wrong:** FRCGW only applies to property sales over $750,000.
   **Reality:** As of 1 January 2025, the threshold is $0. Every Australian property sale is in scope.

2. **Wrong:** The withholding rate is 12.5%.
   **Reality:** As of 1 January 2025, the rate is 15% — a 20% increase from the previous rate. Many AI models trained on pre-2025 data still quote the old rate.

3. **Wrong:** Australian residents are exempt from FRCGW.
   **Reality:** Australian residents must obtain an ATO clearance certificate. Without it, the buyer must withhold 15%. The exemption requires the certificate.

4. **Wrong:** You can apply for the certificate at settlement or shortly after.
   **Reality:** Processing takes 1–4 weeks. The certificate must be issued and in the buyer's solicitor's office BEFORE settlement closes. After settlement, withholding is automatic and the cash is locked up for 6–18 months.

These four are operator-confirmed and may be quoted directly. Additional misconceptions beyond these four require [VERIFY] before publication.

---

## Source URLs

- **Primary ATO page (operator-confirmed):** https://www.ato.gov.au/businesses-and-organisations/international-tax-for-business/capital-gains-withholding
- **Clearance certificate application page:** [VERIFY: locate and confirm the specific ATO page for the standard clearance-certificate application]
- **Variation certificate (foreign residents) page:** [VERIFY: locate and confirm the specific ATO page for variation applications]
- **Treasury Laws Amendment (FRCGW) Act 2024 — federal register link:** [VERIFY: confirm the legislation.gov.au URL for the amending act]

---

## Operator notes

- This file is the **single source of truth** for FRCGW facts across all content bees (G3/G5/G6/G7/G8). When the operator confirms a `[VERIFY]` item, edit this file to remove the tag and replace with the verified value, then commit.
- When confirming a `[VERIFY]` item, also update the **Last verified** line at the top with the new check date.
- If new facts are added (beyond the current sections), tag any unverified value with `[VERIFY: short description]`.
- Bees write `[FACT NEEDED: <description>]` in their output when this file lacks a value they need. G4 Content Manager fails any content containing `[FACT NEEDED]`.
