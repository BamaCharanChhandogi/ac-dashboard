# AC Dashboard — Comprehensive Technical Specification & Implementation Plan

---

### Project Overview
* **Repository:** [https://github.com/BamaCharanChhandogi/ac-dashboard](https://github.com/BamaCharanChhandogi/ac-dashboard)
* **Architecture Model:** Serverless Jamstack (Cloud Storage Ingestion -> Static JSON Compiler -> Edge CDN -> Reusable React UI)
* **Target Audience:** Engineering Leadership, Data Analysts, and Project Stakeholders

---

## 1. Executive Summary

This document serves as the **single authoritative technical specification and implementation plan** for the **AC Dashboard (Electoral Analytics & Constituency Intelligence Platform)**.

The platform provides high-density, interactive political intelligence for Indian Assembly Constituencies (AC) and Parliamentary Constituencies (PC). Rather than building separate custom websites for individual seats, the system decouples the **reusable presentation interface** from **constituency-specific datasets**. 

### Core Architectural Principle: Universal Form, Dynamic Data
The entire platform is built on the paradigm of **"same form, different answers"**:
* Every constituency uses the exact same data schema, table structures, and UI templates.
* Only the underlying values (names, numbers, booth counts, and geographic shapes) change per constituency.
* The frontend operates as a **zero-server static application**: raw files stored in cloud storage (OneDrive / Google Drive) are compiled into optimized, lightweight JSON files (< 250 KB per AC) served over a global Content Delivery Network (CDN).

---

## 2. Business Rules & Technical Directives

The following core rules are established to handle real-world electoral roll edge cases across all Indian states:

### 2.1 Auxiliary Polling Station Aggregation
In high-density voting centers, the Election Commission splits polling booths into auxiliary stations (e.g., `Booth 22` and `Booth 22A`).
* **Rule:** All auxiliary polling stations are **clubbed into a single parent booth**:  
  **Booth 22 = (22 + 22A)**
* Voter counts, additions, deletions, and vote tallies are mathematically summed together.
* This maintains a 1:1 match between the booth data table and the geographic map boundary polygons.

### 2.2 Standardized Demographic & Gender Categorization
* Electoral roll records are categorized strictly into: **`Male`**, **`Female`**, and **`Third Gender`**.
* Any illegible, unparseable, or missing scan entries are tagged as **`Unknown`**.
* The system handles `Unknown` gracefully without failing schema validation or dropping voters from the total count.

### 2.3 Mixed Urban-Rural Support
Constituencies across India are rarely 100% rural or 100% urban; most are a blend (e.g., 30% Urban municipal wards + 70% Rural gram panchayats).
* Replaces rigid `village` terms with universal columns: `area_name` and `area_type` (*Ward*, *Village*, *Borough*, *Gram Panchayat*).
* Tracks the constituency's overall urban-rural percentage split dynamically.

### 2.4 Normalized Multi-Party Results Model
To prevent hardcoded columns that break across different state elections (e.g., BJP/INC in Goa vs. TMC/BJP/CPM in West Bengal vs. DMK/AIADMK in Tamil Nadu):
* Booth-level results are stored as **normalized rows**:  
  `(part_no, candidate_name, party_code, votes)`
* The frontend dynamically parses the top candidates, computes margins, and renders party color tags regardless of which parties are competing.

### 2.5 Adaptive Map Viewport (Auto-Framing)
Constituencies vary dramatically in physical shape (e.g., Porvorim is tall/vertical, Aldona is wide/horizontal).
* The SVG map container dynamically reads the `viewBox` dimensions from each constituency's dataset.
* Acts like an auto-adjusting camera frame: renders maps without distortion, stretching, or clipped edges.

### 2.6 Survey Segment (Pending Data State)
* The IVRS Citizen Survey module is a permanent component of the dashboard design.
* For constituencies where survey calls have not yet been fielded (e.g., Aldona AC10), the module displays a clean "Survey Pending / In Progress" card rather than omitting the section or breaking the sticky navigation.

### 2.7 Privacy by Design
* Personal mobile numbers are excluded from voter roll processing for this milestone to streamline data ingestion and protect citizen privacy.

---

## 3. Structural Breakdown: Reusable UI Component Library

The frontend is built from modular, reusable UI components organized into 9 analytical segments:

```
+───────────────────────────────────────────────────────────────────────────+
|                       REUSABLE FRONTEND ENGINE (REACT)                    |
|                                                                           |
|  1. Constituency Header & Meta Letterhead                                 |
|  2. Roll Progression 4-Stage Timeline (Draft -> Final -> Supplements)     |
|  3. Demographic Charts (Gender Donut, Age Bars, Diverging Pyramid)        |
|  4. Elected Representative Dossier (MLA & MP Profile Cards)               |
|  5. Historical Election Trackers (Assembly & Lok Sabha Trend Bars)        |
|  6. Spatial Vector Maps (Booth Margin Voronoi & Village Political Lean)   |
|  7. Searchable Directory Tables (Booths, Voter Churn, Household Clusters) |
|  8. Citizen Sentiment & Local Grievance Analytics (IVRS Survey)           |
+───────────────────────────────────────────────────────────────────────────+
                                      ▲
                                      │ Injects Data Props
+───────────────────────────────────────────────────────────────────────────+
|               VARIABLE CONSTITUENCY DATA PAYLOAD (STATIC JSON)             |
|                                                                           |
|  * /data/goa/ac09-porvorim.json   * /data/goa/ac10-aldona.json            |
|  * /data/goa/ac17-sanquelim.json  * /data/wb/ac159-bhabanipur.json        |
+───────────────────────────────────────────────────────────────────────────+
```

### Component Inventory:
1. **`LetterheadHeader`**: Administrative title banner displaying constituency identifier, reservation classification, district, sub-district, constituent areas, and total active registered electors badge.
2. **`RollProgressionCard`**: 4-stage chronological timeline tracking voter list updates (Draft Roll -> Final Draft -> Supplement 2 -> Supplement 3) with additions, deletions, and net elector growth.
3. **`KPIGrid` & `KPITile`**: Metric cards (Male %, Female %, Sex Ratio, Deletion Rate, Addition Rate) formatted with Indian numbering (`en-IN`).
4. **`DonutChart` & `DivergingAgePyramid`**: Vector SVG donut for gender split and mirrored demographic pyramid comparing male (left, blue) and female (right, pink) distribution across 7 age cohorts (`18-24`, `25-34`, `35-44`, `45-54`, `55-64`, `65-74`, `75+`).
5. **`LeaderCard`**: Side-by-side profile panels for sitting MLA and MP (photo, winning vote share, victory margin gauge, party emblem, age, tenure, and cabinet portfolio).
6. **`HistoricalElectionBarChart`**: Party performance comparison across consecutive state assembly (e.g., 2008–2022) and parliamentary elections (1977–2024).
7. **`VoronoiBoothMap`**: SVG vector map displaying all polling station cells colored by political margin (`Safe` green >=10%, `Battleground` yellow -10% to +10%, `Weak` red <= -10%) with multi-cycle election dropdown filters.
8. **`SubConstituencyAreaMap`**: Boundary choropleth map showing political lean across constituent administrative villages or municipal wards.
9. **`DataTable`**: High-performance searchable, paginated table with real-time text search and status badges (used for Polling Booths, Voter Churn Audit, and Household Groups).
10. **`SurveyModule`**: Performance ratings comparison (Govt vs. CM vs. MLA) and top local community grievances horizontal bar chart (roads, water, employment, inflation, healthcare).

---

## 4. Universal Data Contract: Mapping Raw Files to Dashboard

Each constituency is maintained in cloud storage with standardized file names and column schemas:

### File 1: `01_metadata.xlsx` (Constituency Master)
| Column Name | Data Type | Sample Value | Target UI Component |
|---|---|---|---|
| `ac_no` | Integer | `9` | Header banner & AC tag |
| `ac_name` | String | `Porvorim` | Title banner |
| `state` | String | `Goa` | Top breadcrumb |
| `reservation` | String | `General` | Reservation badge (`General`, `SC`, `ST`) |
| `pc_no` | Integer | `1` | Parliamentary segment identifier |
| `pc_name` | String | `North Goa` | MP constituency badge |
| `district` | String | `North Goa` | Administrative location tag |
| `sub_district_name`| String | `Bardez` | Taluka / Block / Tehsil name |
| `total_booths`| Integer | `39` | Summary KPI |
| `total_voters`| Integer | `23947` | Hero total electors badge |

### File 2: `02_electoral_roll.xlsx` (Booth Voter Rosters)
Contains individual booth workbooks (`Part 1` to `Part N`).
* **`Booth_Header` Sheet:** Station address, area name, sub-district, sections list.
* **`QA_Summary` Sheet:** Verified voter counts, male/female totals, additions, and deletions.
* **`Voters` Sheet:** Granular voter records:
  - `epic_id`: Voter photo identity card number
  - `voter_name`: Full name
  - `relation_name`: Relative name
  - `gender`: `Male`, `Female`, `Third Gender`, or `Unknown`
  - `age`: Elector age (partitioned into 7 age brackets)
  - `house_no`: Residential address (clustered with surname to identify household units)
  - `part_no`: Polling station allocation (auxiliaries like `22A` clubbed into `22`)
  - `area_name`: Village or municipal ward name

### File 3: `03_roll_progression.xlsx` (Revision Progression)
| Column Name | Data Type | Sample Value | Description |
|---|---|---|---|
| `stage_order` | Integer | `1`, `2`, `3`, `4` | Chronological sort index |
| `stage_name` | String | `Final Draft (Feb 2026)` | Timeline step title |
| `total_electors` | Integer | `23947` | Active registered voters at stage |
| `added_count` | Integer / Null | `270` | New additions since previous stage |
| `deleted_count` | Integer / Null | `1405` | Removed electors since previous stage |

### File 4: `04_booths.xlsx` (Polling Station Directory)
| Column Name | Data Type | Sample Value | Description |
|---|---|---|---|
| `part_no` | String | `1` | Consolidated booth number |
| `station_name` | String | `Govt. Primary School` | Facility name |
| `address` | String | `Socorro, Bardez` | Physical location |
| `area_name` | String | `Socorro` | Village / Ward name |
| `latitude` | Float | `15.5412` | Coordinate for spatial seeding |
| `longitude` | Float | `73.8341` | Coordinate for spatial seeding |
| `voter_count` | Integer | `680` | Consolidated active voters |

### File 5: `05_changes.xlsx` (Roll Churn Log)
| Column Name | Data Type | Sample Value | Description |
|---|---|---|---|
| `epic_id` | String | `REX0321679` | Voter card ID |
| `voter_name` | String | `Anil Rathod` | Voter name |
| `part_no` | String | `1` | Polling station part number |
| `change_kind` | String | `deleted` | `deleted`, `added`, or `modified` |
| `revision_stage`| String | `Final Roll` | Revision milestone |
| `reason` | String | `Shifted/Change of Residence` | Official reason (Expired, Shifted, Form 7/8) |

### File 6: `06_elections_history.xlsx` (Historical Returns)
| Column Name | Data Type | Sample Value | Description |
|---|---|---|---|
| `election_type` | String | `Assembly` | `Assembly` or `Parliament` |
| `year` | Integer | `2022` | Election cycle year |
| `winning_party` | String | `BJP` | Victorious party code |
| `candidate_name`| String | `Rohan Khaunte` | Winning candidate |
| `vote_pct` | Float | `55.16` | Vote share percentage |
| `margin_pct` | Float | `37.44` | Victory gap over runner-up |

### File 7: `07_form20_results.xlsx` (Normalized Booth Votes)
| Column Name | Data Type | Sample Value | Description |
|---|---|---|---|
| `election_key` | String | `2022_AE` | Cycle identifier |
| `part_no` | String | `1` | Polling station part number |
| `candidate_name`| String | `Rohan Khaunte` | Candidate name |
| `party_code` | String | `BJP` | Party abbreviation |
| `votes` | Integer | `380` | Actual votes recorded in booth |

### File 8: `08_leaders.xlsx` (Representative Profiles)
| Column Name | Data Type | Sample Value | Description |
|---|---|---|---|
| `role` | String | `MLA` | `MLA` or `MP` |
| `name` | String | `Rohan Khaunte` | Incumbent full name |
| `party` | String | `BJP` | Party code |
| `vote_pct` | Float | `55.16` | Winning vote share % |
| `margin_votes` | Integer | `7950` | Absolute victory margin in votes |
| `portfolio` | String | `Cabinet Minister for Tourism & IT` | Government office held |
| `photo_url` | String | `https://.../khaunte.jpg` | Official portrait URL |

### File 9: `09_survey_ivrs.xlsx` (Citizen Feedback — Optional)
| Column Name | Data Type | Sample Value | Description |
|---|---|---|---|
| `call_id` | String | `CALL_10928` | Unique call identifier |
| `part_no` | String | `1` | Polling booth link |
| `overall_rating`| String | `Good` | 5-point scale rating |
| `mla_rating` | String | `Excellent` | 5-point scale rating |
| `primary_issue` | String | `Roads & Drainage` | Local grievance tag |

### File 10: Spatial GIS Files (`spatial/*.geojson`)
* Boundary shapefiles for the outer constituency perimeter and constituent villages/wards.
* Converted during ingestion into clean SVG vector path strings.

---

## 5. End-to-End System Pipeline

```
+───────────────────────────────────────────────────────────────────────────+
| 1. RAW DATA INGESTION (OneDrive / Google Drive)                           |
|    - Structured constituency folders with standard Excel & CSV files      |
+───────────────────────────────────────────────────────────────────────────+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────+
| 2. AUTOMATED COMPILER SCRIPT (Python CLI)                                 |
|    - Reconciles auxiliary booths: Booth 22 = (22 + 22A)                   |
|    - Normalizes gender categories (Male, Female, Third Gender, Unknown)   |
|    - Aggregates age cohorts, household clusters, and Form 20 vote tallies |
|    - Generates pre-computed SVG Voronoi cells with adaptive viewBox       |
|    - Produces a single minified static JSON (< 250 KB per AC)             |
+───────────────────────────────────────────────────────────────────────────+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────+
| 3. CLOUD STORAGE & GLOBAL CDN (Cloudflare R2 / Pages)                     |
|    - /data/directory.json            (National & State constituency index)|
|    - /data/goa/ac09-porvorim.json    (Compiled Porvorim payload)          |
|    - /data/goa/ac10-aldona.json      (Compiled Aldona payload)            |
|    - /data/goa/ac17-sanquelim.json   (Compiled Sanquelim payload)         |
+───────────────────────────────────────────────────────────────────────────+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────+
| 4. REUSABLE CLIENT APPLICATION (React + Vite + Tailwind)                  |
|    - Client-side static rendering (zero server management, zero downtime) |
|    - URL route / dropdown loads corresponding static JSON from CDN        |
|    - Instant in-browser search, map filtering, and modal interactions     |
+───────────────────────────────────────────────────────────────────────────+
```

---

## 6. Verified Multi-Constituency Data Reference

Our inspection of the real data across North Goa constituencies confirms full compatibility:

| Metric / Attribute | AC09 — Porvorim | AC10 — Aldona | AC17 — Sanquelim | Unified Handling |
|---|---|---|---|---|
| **Total Registered Voters** | 23,947 | 25,541 | 27,265 | Standardized KPI badge |
| **Total Polling Booths** | 39 booths | 41 booths | 50 booths | 1 Excel file per booth |
| **Constituent Areas** | 3 areas *(Socorro, Salvador do Mundo, Penha-de-Franca)* | 10 areas *(Moira, Bastora, Aldona, etc.)* | 9 areas | Dynamic area roster |
| **Sitting MLA** | Rohan Khaunte (BJP, +37.4%) | Carlos Alvares Ferreira (INC, +8.1%) | Dr. Pramod Sawant (BJP, +2.6%) | Reusable profile card |
| **Sitting MP** | Shripad Yesso Naik (BJP) | Shripad Yesso Naik (BJP) | Shripad Yesso Naik (BJP) | Shared across North Goa |
| **Survey Data Status** | Present (4,990 calls) | Absent (No survey fielded) | Present (5,450 calls) | Renders "Pending" state on AC10 |
| **Map Viewport Dimensions** | `1186 × 1220.7` (Portrait) | `1186 × 760` (Landscape) | `1186 × 920` (Square) | Dynamic SVG auto-framing |

---

## 7. Phased Implementation Roadmap

### Phase 1: Ingestion Script & Data Compilation
* Build `scripts/compile_constituency.py` to ingest booth Excel workbooks and election tables.
* Output validated static JSON files: `ac09-porvorim.json`, `ac10-aldona.json`, and `ac17-sanquelim.json`.

### Phase 2: Universal Component Library Setup
* Scaffold the React + Vite + Tailwind static application in `ac-dashboard`.
* Implement the top constituency switcher (`[ Porvorim (AC09) | Aldona (AC10) | Sanquelim (AC17) ]`).

### Phase 3: Segment-by-Segment Construction
* Build header banner, electors badge, and 4-stage revision timeline.
* Build SVG gender donut and diverging age pyramid.
* Build MLA/MP profile panels and historical election comparison bars.
* Implement the SVG map engine with Voronoi booth cells and adaptive viewport framing.
* Implement virtualized, searchable tables for Booths, Voter Churn, and Household Clusters.
* Implement the Survey module with graceful empty/pending states.

### Phase 4: CDN Deployment & Launch
* Deploy the static web bundle and compiled data files to Cloudflare Pages / CDN.
* Verify mobile load performance and cross-constituency responsiveness.
