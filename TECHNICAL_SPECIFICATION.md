# Technical Architecture & Platform Specification: Dynamic Electoral Roll & Intelligence Platform

## Executive Summary

This document specifies the technical architecture, data contracts, component decomposition, and ingestion pipeline for building a scalable, automated electoral intelligence platform. 

The goal of this platform is to take raw, multi-source election and electoral roll data stored in **Microsoft OneDrive** (Excel workbooks, CSV files, and GeoJSON shapes) and dynamically generate unified, interactive constituency dashboards identical in quality, functionality, and styling to the reference implementation (**AC17 Sanquelim Electoral Roll Dashboard**).

The design prioritizes:
1. **Zero-code constituency scaling**: Adding a new Assembly Constituency (AC) or Parliamentary Constituency (PC) requires only dropping a standardized folder of Excel/CSV files into OneDrive.
2. **Clean separation of concerns**: Pure reusable UI component engines separated from variable, constituency-specific data payloads.
3. **Direct human readability**: Plain, straightforward schemas that election data analysts, field survey managers, and software engineers can all understand without unnecessary jargon.

---

## 1. Analysis of the Live Dashboard Structure & Data Objects

The reference dashboard is an interactive, high-density analytical portal for an Assembly Constituency (AC17 - Sanquelim, Goa). It consolidates electoral rolls, historical election results (Form 20), delimitation mapping, household clustering, and field IVRS survey data into a single responsive web interface.

### 1.1 Structural Layout & Sections
The user interface is organized into a sticky navigation bar and 9 analytical sections:

1. **Letterhead & Header Meta**:
   - Constituency Number & Name (`AC17 Sanquelim`), Delimitation/Reservation status (`General`), Parliamentary Constituency segment (`North Goa PC01`), District (`North Goa`), Taluka (`Sattari`), and list of constituent Villages (9 villages).
   - High-contrast letterhead badge showcasing total registered electors (`27,265`).
2. **Constituency Overview**:
   - **Roll Progression Tracker**: Four chronological stages of the Special Intensive Revision (SIR) roll (Draft Roll Dec 2025 -> Final Draft Feb 2026 -> Supplement-2 Apr 1 -> Supplement-3 Jul 1) showing elector count progression, additions, deletions, and net elector growth (+59 electors, +0.22%).
   - **Top KPI Strip**: 6 core metrics: Total Electors (27,265), Male Electors (13,382 / 49.1%), Female Electors (13,883 / 50.9%), Sex Ratio (1,037 females per 1,000 males), Total SIR Deletions (634 / 2.3%), Total SIR Additions (693 / 2.5%).
3. **Gender & Age Composition**:
   - **Gender Split Donut Chart**: Vector SVG donut with center total and percentage split.
   - **Age Cohorts Horizontal Bar Chart**: Distribution across 7 age brackets (18-24, 25-34, 35-44, 45-54, 55-64, 65-74, 75+).
   - **Age & Gender Pyramid**: Diverging demographic pyramid showing male cohort bars on the left (blue) and female cohort bars on the right (pink).
4. **Current MLA & Elections History**:
   - **Leadership Cards**: Side-by-side profile panels for the sitting MLA (Dr. Pramod Sawant, BJP) and sitting MP (Shripad Yesso Naik, BJP), displaying photo, party emblem, winning vote share, margin of victory, age, tenure, and portfolios.
   - **Historical Election Trackers**:
     - Assembly elections track record (2008 by-election to 2022).
     - Parliamentary elections segment track record (1977 to 2024).
   - **Form 20 Booth-level Electoral Results**:
     - Election filter switcher: Overall, 2012 AE, 2014 PE, 2017 AE, 2019 PE, 2022 AE, 2024 PE.
     - Interactive Voronoi booth choropleth map: 50 booth polygons colored by electoral margin (`Safe` green >=10%, `Battle Ground` yellow -10% to +10%, `Weak` red <= -10%).
     - Stacked vote-share bars showing candidate performance.
     - Interactive Booth Modal: Historical vote share line graph (`trendChartSvg`), candidate vote breakdown table, and voter counts.
5. **Religion & Caste Category**:
   - Displays a clean data limitation notice (Indian electoral rolls do not officially record caste/religion) or surname-based estimation model where applicable.
6. **Village Map & SIR Analysis**:
   - **Village Political Lean Map**: Choropleth map of 9 village boundaries colored by political lean across past elections with continuous gradient margin legend.
   - **Interactive Village Modal**: BJP vs Opposition historical vote trend lines and booth breakdown.
   - **SIR Bar Charts**: Village-by-village deletion rates, addition rates, modification rates, and total registered voter distribution.
7. **Family & Household Groups**:
   - Searchable, paginated card directory of 6,041 households grouped by village, house number, and surname.
   - **Family Modal**: Full household roster showing all registered members, EPIC voter card IDs, age, gender, relation name, and linked survey responses.
8. **Booth Directory (Polling Stations)**:
   - Summary statistics (Total booths, average voters per booth, largest/smallest booth).
   - Comprehensive searchable table: Part number, Polling station name, Address, Village, Voter count, Added, Deleted, and Modified.
9. **Deleted / Modified / Added Voters**:
   - Tabbed view (`Deleted`, `Added`, `Modified`) with real-time search across names, EPIC IDs, and house numbers.
   - Detailed audit table with specific deletion/modification reasons (e.g. Expired, Shifted/Change of Residence, Duplicate).
10. **IVRS Call Campaign Survey**:
    - High-level KPIs: Total answered calls (5,450), Voter participation rate (25.2%), and Vulnerable voter flags.
    - Rating Comparison Trio: Donut charts comparing Government Performance, CM Performance, and MLA Performance on a 5-point scale (Excellent, Good, Fair, Unsatisfied, Cannot Say).
    - Top Local Issues: Horizontal bar chart ranking community grievances (Youth unemployment, water supply, inflation, roads, mining/pollution).
    - Multi-layer Interactive Survey Map: Booth choropleth map with switchable continuous layers for MLA Rating, Govt Rating, and Categorical Primary Issue.
    - Household Survey Detail Modal: Displays individual respondent feedback, contact phone numbers, specific voter requests, and sentiment quotes.

---

### 1.2 The Root Data Contract (`D`)
In the reference dashboard, all visual components are hydrated client-side from a single embedded JSON object (`D`). The 28 root keys and their structural types are:

| Key | Type | Description |
|---|---|---|
| `acDetails` | `Object` | Metadata: AC number, name, reservation, PC details, district, taluka, villages list, totals. |
| `map` | `Object` | SVG spatial geometry: `viewBox`, AC outer outline path, and village boundary paths. |
| `boothPoints` | `Dict[str, [x, y]]` | Normalized spatial centroid coordinates for each polling booth (1 to 50). |
| `boothTable` | `List[Object]` | Directory of all polling stations with part number, address, village, and voter stats. |
| `gender` | `Dict[str, int]` | Elector counts broken down by gender (`Female`, `Male`, `Other`). |
| `ageGroups` | `Dict[str, int]` | Elector counts partitioned into 7 age cohorts. |
| `ageByGender` | `Dict[str, Dict]` | Elector counts by age cohort partitioned by male and female. |
| `villageStats` | `Dict[str, Object]`| Per-village total electors, deletions, additions, modifications, and percentage rates. |
| `familyGroups` | `List[Object]` | Roster of household clusters (village, house number, surname, count, member list). |
| `changes` | `List[Object]` | Detailed list of deleted, modified, and added electors with EPIC, stage, and reason. |
| `assemblyHistory` | `List[Object]` | Historical Assembly Election results for the constituency (year, party, candidate, %). |
| `parliamentHistory`| `List[Object]` | Historical Lok Sabha Election results for the AC segment. |
| `mla` | `Object` | Incumbent MLA biography, party, vote share, margin, age, tenure, photo URL. |
| `mp` | `Object` | Incumbent MP biography, party, vote share, margin, age, tenure, portfolio. |
| `rollProgression` | `List[Object]` | Time-series data of voter roll stages (Draft, Final Draft, Supplement 2 & 3). |
| `boothGeocodeStatus`| `Dict[str, str]` | Audit status of booth coordinates (`exact`, `approximate`, `unmapped`). |
| `boothCells` | `Dict[str, Object]`| Voronoi polygon rings for each booth clipped to village boundaries. |
| `boothLabelPos` | `Dict[str, [x, y]]` | Optimal label anchor coordinates for booth numbers on the map. |
| `villageLabelPos` | `Dict[str, [x, y]]` | Optimal label anchor coordinates for village text badges on the map. |
| `boothElections` | `Dict[str, Dict]` | Form 20 vote returns per booth across past elections (margin, winner, party %). |
| `electionCandidates`| `Dict[str, Object]`| Candidate roster and vote counts for each election cycle. |
| `electionsOrder` | `List[str]` | Ordered list of election keys (e.g. `['2012_AE', '2014_PE', ... '2024_PE']`). |
| `electionLabels` | `Dict[str, str]` | Display titles for elections (e.g. `'2022_AE': '2022 Assembly'`). |
| `villagePerElectionCategory` | `Dict[str, Dict]` | Political lean category (`Safe`, `Battle Ground`, `Weak`) per village per election. |
| `villageMapCategory`| `Dict[str, Object]`| Overall aggregate political lean and average victory margin per village. |
| `callSurvey` | `Object` | IVRS survey aggregates: summary KPIs, rating distributions, top issues, and booth scores. |
| `boothFamilyCount` | `Dict[str, int]` | Total household count per booth. |
| `boothSections` | `Dict[str, List]` | Electoral roll section names associated with each booth. |

---

## 2. Component Breakdown: Reusable vs Variable

To build a centralized platform where any constituency can be rendered on demand, the system is separated into two clean layers:

1. **Reusable Component Framework (Frontend Engine):**
   - Letterhead and Key Metric Tiles
   - SVG Demographic Charts (Donuts, Age Bars, Diverging Pyramid)
   - Geospatial Vector Engines (Booth Voronoi Map, Village Boundary Map)
   - Searchable Data Tables (Booths, Churn Logs, Family Directory)
   - Interactive Modal Dialogs (Booth History, Household Rosters, Survey Details)

2. **Variable Constituency Data (Injected Props):**
   - Administrative Metadata (AC Number, Name, State, District, Sub-district)
   - Geographic Boundaries (Constituency outline, village/ward polygons, booth GPS coordinates)
   - Electoral Roll Records (Voter details, age/gender aggregates, household groups)
   - Election Results (Form 20 booth tallies and historical trends)
   - Incumbent Profiles (MLA/MP details, victory margins, portfolios)
   - Citizen Survey Responses (Ratings, local issue tags, voter feedback)

---

### 2.1 Reusable Components (Fixed Code & UI Templates)

These components are written once and never modified when changing constituencies:

1. **`LetterheadHeader`**:
   - Accepts metadata props; renders title, eyebrow, PC/Taluka tags, dark/light logo, and electors count badge.
2. **`StickySubnav`**:
   - Navigation bar with section anchor links and intersection observer to highlight the active section while scrolling.
3. **`RollProgressionCard`**:
   - 4-column timeline showing stage names, totals, added/deleted counts, and net percentage growth hero stat.
4. **`KPIGrid` & `KPITile`**:
   - Grid container supporting 2, 3, 4, or 6 columns.
   - Automatically formats numbers with Indian numbering commas (`toLocaleString('en-IN')`).
   - Applies semantic color coding (`good`, `warning`, `critical`).
5. **`DonutChart`**:
   - SVG vector chart that takes an array of `{ label, value, color }` and renders an SVG donut with stroke-dasharray calculations, centered text, and hover tooltips.
6. **`DistributionBar`**:
   - Horizontal percentage bar with animated width fill and value labels.
7. **`DivergingAgePyramid`**:
   - Two-sided population pyramid with central age cohort labels, left-side male bars, and right-side female bars.
8. **`LeaderCard`**:
   - Dual split profile card for legislative representatives with party accent gradient, portrait aspect ratio, victory margin gauge, and tenure statistics.
9. **`HistoricalElectionBarChart`**:
   - Displays party vote shares over consecutive election cycles with party flag colors and victory margin tags.
10. **`VoronoiBoothMapEngine`**:
    - Accepts booth points and village polygons.
    - Executes algorithmic Voronoi tessellation (`relaxSeeds`, `clipHalfPlane`).
    - Handles layer switching (Form 20 margin, IVRS MLA rating, IVRS Govt rating, primary local issue).
    - Renders interactive SVG booth badges and tooltips.
11. **`VillageChoroplethMap`**:
    - Renders village boundary polygons colored by political lean or survey metrics, with Datawrapper-style continuous gradient legends.
12. **`DataTable`**:
    - Generic table featuring client-side real-time filtering, column sorting, pagination controls, and row click callbacks.
13. **`ModalContainer`**:
    - Reusable accessible dialog overlay with background backdrop blur, escape-key listening, and modular content injection.

### 2.2 Variable Components (Data Props Injected Per Constituency)

These values change for every constituency:

1. **`constituencyId` & `meta`**: Unique slug (e.g. `goa-ac17-sanquelim`, `up-ac300-varanasi-cantt`), state name, district name, taluka, reservation type.
2. **`gisBoundaries`**: Boundary coordinates of the constituency and its inner administrative revenue villages or municipal wards.
3. **`boothDirectory`**: List of polling stations with GPS coordinates and official addresses.
4. **`voterRegistry`**: Complete active voter list, age cohorts, gender breakdown, and family clusters.
5. **`revisionAudit`**: Log of additions, deletions, and modifications across the latest revision cycle.
6. **`electionReturns`**: Polling-station-wise Form 20 vote records for past Assembly and General elections.
7. **`leadershipDossier`**: Current MLA and MP biographies, photos, vote margins, and cabinet portfolios.
8. **`surveyData`**: Telephonic or on-ground field survey records, sentiment ratings, and local issue tags.

---

## 3. Data Schema & Contracts: Mapping OneDrive Files to Components

To allow non-technical teams to maintain and scale the platform, each constituency is maintained in **Microsoft OneDrive** in a dedicated folder:

```
OneDrive/
  └── Electoral_Data_Platform/
      └── constituencies/
          └── GOA_AC17_Sanquelim/
              ├── 01_metadata.xlsx
              ├── 02_electoral_roll.csv
              ├── 03_roll_progression.xlsx
              ├── 04_booths.xlsx
              ├── 05_changes.xlsx
              ├── 06_elections_history.xlsx
              ├── 07_form20_results.xlsx
              ├── 08_leaders.xlsx
              ├── 09_survey_ivrs.xlsx
              └── spatial/
                  ├── constituency_boundary.geojson
                  └── village_boundaries.geojson
```

Below is the exact schema for each file and how it maps to the dashboard components.

---

### File 1: `01_metadata.xlsx` (Sheet: `Metadata`)
**Dashboard Destination**: `D.acDetails`, Header letterhead, Overview KPIs.

| Column Name | Data Type | Sample Value | Target Component / Key in `D` | Description |
|---|---|---|---|---|
| `ac_no` | Integer | `17` | `acDetails.acNo` | Assembly Constituency number |
| `ac_name` | String | `Sanquelim` | `acDetails.acName` | Name of constituency |
| `state` | String | `Goa` | `acDetails.state` | State name |
| `reservation` | String | `General` | `acDetails.reservation` | General, SC, or ST |
| `pc_no` | Integer | `1` | `acDetails.pcNo` | Parent Parliamentary Constituency number |
| `pc_name` | String | `North Goa` | `acDetails.pcName` | Parent Parliamentary Constituency name |
| `district` | String | `North Goa` | `acDetails.district` | District name |
| `taluka` | String | `Sattari` | `acDetails.taluka` | Revenue sub-district / Taluka |
| `total_booths`| Integer | `50` | `acDetails.totalBooths` | Total polling booths in AC |
| `total_voters`| Integer | `27265` | `acDetails.totalVoters` | Final roll registered electors count |

---

### File 2: `02_electoral_roll.csv`
**Dashboard Destination**: `D.gender`, `D.ageGroups`, `D.ageByGender`, `D.familyGroups`, `D.boothFamilyCount`, `D.boothSections`.

| Column Name | Data Type | Sample Value | Target Component / Transformation |
|---|---|---|---|
| `epic_id` | String | `REX0321679` | Voter Voter Card ID |
| `voter_name` | String | `Anil Rathod` | Voter Full Name |
| `relation_type`| String | `Father` | Father / Husband / Mother / Other |
| `relation_name`| String | `Thavarappa Rathod` | Name of relative |
| `gender` | String | `Male` | Aggregated into `D.gender` (`Male`, `Female`) |
| `age` | Integer | `45` | Aggregated into `D.ageGroups` and `D.ageByGender` |
| `house_no` | String | `64/1` | Grouped with `surname` to build `D.familyGroups` |
| `surname` | String | `Rathod` | Extracted from `voter_name` for family clustering |
| `part_no` | Integer | `1` | Polling station part number |
| `section_no` | Integer | `1` | Section within polling booth |
| `section_name`| String | `Kharekhajan, Virdi` | Captured in `D.boothSections` |
| `village` | String | `Sanquelim` | Grouped for `D.villageStats` |

*Automated Ingestion Logic*:
- **Gender & Age**: Grouped by age brackets `18-24`, `25-34`, `35-44`, `45-54`, `55-64`, `65-74`, `75+` and crossed with gender.
- **Family Clustering**: Records sharing identical `(village, house_no, surname)` are grouped into `familyGroups`. Households with >= 2 electors are indexed with member counts, age ranges, and family heads.

---

### File 3: `03_roll_progression.xlsx` (Sheet: `Progression`)
**Dashboard Destination**: `D.rollProgression`, `<RollProgressionCard />`.

| Column Name | Data Type | Sample Value | Target Component / Key in `D` |
|---|---|---|---|
| `stage_order` | Integer | `1`, `2`, `3`, `4` | Chronological sorting index |
| `stage_name` | String | `Draft Roll (Dec 2025)` | `rollProgression[].stage` |
| `total_electors` | Integer | `27206` | `rollProgression[].total` |
| `added_count` | Integer / Null| `409` | `rollProgression[].added` |
| `deleted_count` | Integer / Null| `526` | `rollProgression[].deleted` |

---

### File 4: `04_booths.xlsx` (Sheet: `Booths`)
**Dashboard Destination**: `D.boothTable`, `D.boothPoints`, `D.boothGeocodeStatus`, `<DataTable />` (Booths).

| Column Name | Data Type | Sample Value | Target Component / Key in `D` |
|---|---|---|---|
| `part_no` | Integer | `1` | `boothTable[].part` |
| `station_name` | String | `Govt. Primary School` | Display name of polling station |
| `address` | String | `Kharekhajan, Virdi` | `boothTable[].address` |
| `village` | String | `Sanquelim` | `boothTable[].village` |
| `latitude` | Float | `15.5562` | Used to compute normalized `D.boothPoints[part]` |
| `longitude` | Float | `74.0125` | Used to compute normalized `D.boothPoints[part]` |
| `geocode_status`| String | `exact` | `boothGeocodeStatus[part]` (`exact` / `approx`) |
| `voter_count` | Integer | `399` | `boothTable[].voters` |

---

### File 5: `05_changes.xlsx` (Sheet: `Changes`)
**Dashboard Destination**: `D.changes`, `D.villageStats`, `<DataTable />` (Changes).

| Column Name | Data Type | Sample Value | Target Component / Key in `D` |
|---|---|---|---|
| `epic_id` | String | `REX0321679` | `changes[].epicId` |
| `voter_name` | String | `Anil Rathod` | `changes[].name` |
| `relation_name`| String | `Thavarappa Rathod` | `changes[].relationName` |
| `part_no` | Integer | `1` | `changes[].partNo` |
| `village` | String | `Sanquelim` | `changes[].village` |
| `house_no` | String | `H.No-64/1` | `changes[].houseNumber` |
| `change_kind` | String | `deleted` | `changes[].kind` (`deleted`, `added`, `modified`)|
| `revision_stage`| String | `Final Roll` | `changes[].stage` |
| `reason` | String | `Shifted/Change of Residence`| `changes[].reason` (Expired, Shifted, Duplicate)|

---

### File 6: `06_elections_history.xlsx` (Sheets: `Assembly` & `Parliament`)
**Dashboard Destination**: `D.assemblyHistory`, `D.parliamentHistory`, Historical bar charts.

| Column Name | Data Type | Sample Value | Target Component / Key in `D` |
|---|---|---|---|
| `election_type`| String | `Assembly` | Directs to `assemblyHistory` or `parliamentHistory`|
| `year` | Integer | `2022` | `assemblyHistory[].year` |
| `winning_party`| String | `BJP` | `assemblyHistory[].party` |
| `party_full` | String | `Bharatiya Janata Party` | `assemblyHistory[].partyFull` |
| `candidate_name`| String | `Dr. Pramod Sawant` | `assemblyHistory[].candidate` |
| `vote_pct` | Float | `48.27` | `assemblyHistory[].pct` |
| `margin_pct` | Float | `2.60` | `assemblyHistory[].marginPct` |
| `is_by_election`| Boolean | `false` | `assemblyHistory[].isByElection` |
| `notes` | String | `Wikipedia-verified` | `assemblyHistory[].note` |

---

### File 7: `07_form20_results.xlsx` (Sheet: `BoothResults`)
**Dashboard Destination**: `D.boothElections`, `D.electionCandidates`, `D.villagePerElectionCategory`, Form 20 maps.

| Column Name | Data Type | Sample Value | Target Component / Key in `D` |
|---|---|---|---|
| `election_key` | String | `2022_AE` | `electionCandidates[key]` & `electionsOrder` |
| `part_no` | Integer | `1` | `boothElections[part][election_key]` |
| `bjp_votes` | Integer | `245` | Candidate vote count |
| `inc_votes` | Integer | `180` | Candidate vote count |
| `aap_votes` | Integer | `12` | Candidate vote count |
| `others_votes` | Integer | `8` | Grouped into `others` |
| `nota_votes` | Integer | `4` | `nota` |
| `total_votes` | Integer | `449` | Total valid votes cast in booth |
| `winning_party`| String | `BJP` | Booth winner |
| `margin_pct` | Float | `14.48` | `boothElections[part][election_key].margin` |
| `category` | String | `Safe` | `boothElections[part][election_key].category` |

---

### File 8: `08_leaders.xlsx` (Sheet: `Leaders`)
**Dashboard Destination**: `D.mla`, `D.mp`, `<LeaderCard />`.

| Column Name | Data Type | Sample Value | Target Component / Key in `D` |
|---|---|---|---|
| `role` | String | `MLA` / `MP` | Determines `D.mla` vs `D.mp` |
| `name` | String | `Dr. Pramod Sawant` | `mla.name` |
| `party` | String | `BJP` | `mla.party` |
| `party_full` | String | `Bharatiya Janata Party` | `mla.partyFull` |
| `vote_pct` | Float | `48.3` | `mla.pct` |
| `margin_pct` | Float | `2.6` | `mla.marginPct` |
| `margin_votes` | Integer | `668` | `mla.marginVotes` |
| `total_votes` | Integer | `12257` | `mla.votes` |
| `age` | Integer | `51` | `mla.age` |
| `age_note` | String | `Born 24 April 1973` | `mla.ageNote` |
| `since_year` | Integer | `2012` | `mla.sinceYear` |
| `photo_url` | String | `https://.../sawant.jpg` | Rendered in card image tag |
| `portfolio` | String | `Chief Minister of Goa` | `mla.portfolio` |

---

### File 9: `09_survey_ivrs.xlsx` (Sheet: `SurveyData`)
**Dashboard Destination**: `D.callSurvey`, IVRS Donut charts, Grievance bars, Sentiment map layers.

| Column Name | Data Type | Sample Value | Target Component / Key in `D` |
|---|---|---|---|
| `call_id` | String | `CALL_982360` | Unique call identifier |
| `phone_number` | String | `9823602632` | `callSurvey.byBooth[].members[].phone` |
| `part_no` | Integer | `1` | Links survey response to specific booth |
| `village` | String | `Sanquelim` | Aggregated into `callSurvey.byVillage` |
| `respondent_name`| String | `Pratish Dhawaskar` | Name of surveyed elector |
| `age` | Integer | `41` | Respondent age |
| `gender` | String | `Male` | Respondent gender |
| `call_status` | String | `Answered` | Counted in `callSurvey.summary.totalAnswered` |
| `overall_rating`| String | `Good` | `Excellent`, `Good`, `Fair`, `Unsatisfied`, `Cannot Say` |
| `cm_rating` | String | `Excellent` | Donut rating calculation |
| `mla_rating` | String | `Excellent` | Map layer continuous score & donut calculation |
| `candidate_continuation`| String | `Continue Current MLA`| `Continue Current MLA` / `Wants New Face` |
| `primary_issue`| String | `Unemployment` | Top issues aggregation |
| `vulnerability` | String | `Low` | `High`, `Medium`, `Low`, `Cannot Say` |
| `immediate_need`| String | `Better school facilities`| Verbatim quote in survey modal |
| `govt_reason` | String | `New education schemes`| Verbatim quote in survey modal |

---

### File 10: Spatial GIS Files (`constituency_boundary.geojson` & `village_boundaries.geojson`)
**Dashboard Destination**: `D.map.viewBox`, `D.map.ac17`, `D.map.villages`, `D.boothCells`, `D.villageLabelPos`.

- Standard GeoJSON files containing the EPSG:4326 polygon geometry coordinates.
- During ingestion, the geometry is projected into an optimized 2D SVG canvas (`[0, 0, 700, 760]` viewBox).
- Inner village rings are smoothed and converted to SVG `<path d="...">` strings.
- Booth Voronoi polygons are created by taking the booth GPS coordinates as seed points and computing the Voronoi partition clipped by village boundaries.

---

## 4. End-to-End Data Pipeline

The system operates as a straightforward 4-stage pipeline that converts raw files into interactive dashboard views:

### Step 1: Input Data Storage
- Each constituency has a dedicated folder containing the standardized Excel, CSV, and GeoJSON files.
- Analysts update election returns, voter roll revisions, or survey responses by saving files directly into the folder.

### Step 2: Processing & Aggregation
- An automated worker reads the raw files upon update.
- **Validation:** Checks part numbers, confirms voter counts tally, and validates candidate vote totals.
- **Calculations:** Groups voters into age brackets and family units, computes SIR addition/deletion percentages, and calculates booth victory margins.
- **Spatial Processing:** Converts boundary coordinates into web-optimized SVG paths and generates booth partition cells.
- **Output:** Produces a single, lightweight JSON payload (`constituency_data.json`) containing all computed aggregates.

### Step 3: Cloud Storage & CDN Distribution
- The compiled JSON is uploaded to cloud object storage.
- Cached globally on a Content Delivery Network (CDN) to ensure fast load times across desktop and mobile devices.

### Step 4: Dynamic Frontend Rendering
- The client-side application uses one universal dashboard layout.
- The browser URL determines which constituency data file to fetch (e.g., `/goa/ac17-sanquelim` fetches `ac17-sanquelim.json`).
- Reusable UI modules hydrate their charts, maps, and tables directly from the fetched data with zero custom coding required per seat.

---

## 5. Summary of Benefits & Implementation Milestones

| Milestone | Deliverable | Impact |
|---|---|---|
| **Phase 1: Component Library** | Modular React/TypeScript versions of the reference dashboard's cards, charts, maps, and modals. | Establishes the reusable presentation foundation. |
| **Phase 2: Ingestion Pipeline** | Python ETL service reading OneDrive sheets and producing `constituency_data.json`. | Eliminates manual HTML/JSON assembly. |
| **Phase 3: Spatial Engine** | Automated GeoJSON to SVG Voronoi partitioning module. | Automates booth-level map generation for any AC in India. |
| **Phase 4: Scaled Deployment** | Multi-constituency directory page with state and district search filters. | Full platform operational at national scale. |

By following this specification, the development team can turn what was previously a bespoke, handcrafted static dashboard into a fully automated, cloud-native political intelligence engine.
