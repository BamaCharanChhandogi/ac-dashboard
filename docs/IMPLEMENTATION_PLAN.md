# Implementation Plan: Serverless CDN-Driven AC Dashboard & Ingestion Architecture

## Goal Description
Build an enterprise-grade, scalable Electoral Analytics & Constituency Intelligence Dashboard (**AC Dashboard**) from scratch. 
The system operates as a **serverless Jamstack platform**:
1. **Raw Source:** Raw constituency Excel workbooks, voter roll CSVs, and spatial GeoJSON files reside in cloud storage (OneDrive / Google Drive).
2. **Zero-Server Runtime (Static CDN Architecture):** No traditional backend server or database is maintained at runtime. Instead, an automated compilation pipeline processes the raw sheets into lightweight, optimized static JSON payloads per constituency (e.g. `ac09-porvorim.json`, `ac10-aldona.json`, `ac17-sanquelim.json`), deployed directly to Cloudflare Pages / CDN.
3. **Universal Frontend Presentation:** A modular, component-driven client-side application built with modern web technologies that dynamically loads and hydrates any constituency by URL slug or dropdown selector.

---

## Architecture: From Cloud Storage to CDN & Frontend

```
+───────────────────────────────────────────────────────────────────────────+
| 1. RAW DATA STORAGE (OneDrive / Google Drive)                             |
|    - 01_metadata.xlsx           (Names, AC/PC, District, Sub-district)    |
|    - 02_electoral_roll.xlsx     (Booth-wise voter rosters: Parts 1 to N)  |
|    - 03_roll_progression.xlsx   (Draft Roll -> Final Roll timeline)       |
|    - 04_booths.xlsx             (Polling Stations, Addresses, Lat/Long)   |
|    - 05_changes.xlsx            (Deletions, Additions, Modifications)     |
|    - 06_elections_history.xlsx  (Past Assembly & Lok Sabha results)       |
|    - 07_form20_results.xlsx     (Normalized booth vote tallies)           |
|    - 08_leaders.xlsx            (MLA & MP biographical profiles)          |
|    - 09_survey_ivrs.xlsx        (Citizen call ratings & top local issues) |
|    - spatial/*.geojson          (Area boundaries & polling booth points)  |
+───────────────────────────────────────────────────────────────────────────+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────+
| 2. AUTOMATED COMPILER & INGESTION PIPELINE (Python CLI)                  |
|    - Schema Validation & Normalization                                    |
|    - Demographic & Family Clustering Aggregation                          |
|    - Form 20 Vote Tally & Margin Analysis                                 |
|    - Spatial SVG & Voronoi Polygon Generation                             |
|    - Generates Minified Static JSON Payloads (< 250 KB per AC)            |
+───────────────────────────────────────────────────────────────────────────+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────+
| 3. GLOBAL CDN DISTRIBUTION (Cloudflare R2 / Pages / Edge)                 |
|    - /data/directory.json       (Index of all available constituencies)   |
|    - /data/goa/ac09-porvorim.json                                         |
|    - /data/goa/ac10-aldona.json                                           |
|    - /data/goa/ac17-sanquelim.json                                        |
+───────────────────────────────────────────────────────────────────────────+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────+
| 4. REUSABLE FRONTEND APPLICATION (Vanilla JS / Tailwind / Vite)           |
|    - Top Constituency Selector Dropdown & Header Banner                   |
|    - SIR Roll Revision 4-Stage Progress Tracker                           |
|    - Demographic Gender Donut Chart & Diverging Age Pyramid               |
|    - MLA & MP Executive Leadership Profile Cards                          |
|    - Multi-Cycle Historical Election Trend Trackers                       |
|    - Interactive SVG Voronoi Booth & Village Political Lean Maps          |
|    - Searchable Virtualized Directory Tables (Booths, Churn, Families)    |
|    - Conditional Citizen Survey & Local Grievance Analytics               |
+───────────────────────────────────────────────────────────────────────────+
```

---

## Edge Cases Handled in this Plan

1. **Missing Survey Data (e.g., Aldona AC10):**
   - The UI conditionally checks `if (data.callSurvey)`. If absent, Section 10 is omitted and "Survey" is automatically removed from the top navigation.
2. **Gender Classification Variations:**
   - Standardizes `"Unknown"` (seen in AC09) and `"Other"` into a unified category without throwing validation errors.
3. **Auxiliary Polling Stations (`Part 12A`, `Part 14/1`):**
   - Part numbers are strictly typed as alphanumeric strings to prevent parsing crashes.
4. **Varying Map Coordinate Spaces:**
   - SVG maps dynamically read `viewBox` dimensions from each constituency's payload (`1186x1220.7` for Porvorim, `1186x760` for Aldona, `1186x920` for Sanquelim).
5. **Urban vs Rural Labels:**
   - Sub-constituency labels dynamically switch between "Villages" and "Wards/Municipalities" depending on `area_type`.
6. **Mobile Performance Optimization (Tiered Data Loading):**
   - Summary statistics and map geometries load instantly (< 250 KB). Heavy individual voter lists load lazily on page demand.

---

## Phased Implementation Roadmap

### Phase 1: Ingestion Script & Data Compilation
- Implement `scripts/compile_constituency.py` to convert raw booth Excel workbooks and election tables into verified, standardized JSON files (`ac09-porvorim.json`, `ac10-aldona.json`, `ac17-sanquelim.json`).
- Verify data sums: Active voters, additions, deletions, age brackets, and election returns.

### Phase 2: Frontend Foundation & Design System
- Setup the static web application framework with modular JavaScript and responsive styling.
- Create core utility helpers: Indian numeral formatting (`toLocaleString('en-IN')`), percentage calculation, and color palettes.
- Implement the sticky top navigation with constituency switcher dropdown.

### Phase 3: Segment-by-Segment Component Construction
- **Segment 1 & 2:** Header banner, total elector badge, and SIR Roll Progression timeline.
- **Segment 3:** Demographic SVG Donut (Gender) and diverging population pyramid (Age).
- **Segment 4 & 5:** MLA/MP dossier cards and multi-cycle election comparison charts.
- **Segment 6:** Interactive SVG map engine supporting booth-level Voronoi choropleths and village political lean.
- **Segment 7 & 8:** Searchable, virtualized tables for Booths, Voter Churn, and Household Clusters.
- **Segment 9:** Conditional IVRS Citizen Survey analytics.

### Phase 4: Git Sync & Documentation Update
- Push `IMPLEMENTATION_PLAN.md` to GitHub.
- Update Google Doc with the serverless CDN architecture summary and roadmap.
