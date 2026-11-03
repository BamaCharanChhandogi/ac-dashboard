# AC Dashboard — Electoral Analytics & Constituency Intelligence Platform
## Component Architecture & System Design

---

### Repository & Implementation
* **GitHub Repository:** [https://github.com/BamaCharanChhandogi/ac-dashboard](https://github.com/BamaCharanChhandogi/ac-dashboard)
* **Status:** Frontend Component Architecture & UI Arsenal Development

---

### 1. Executive Summary

This document outlines the architectural blueprint for an enterprise-grade Electoral Analytics and Constituency Intelligence Platform. 

The primary objective is to establish a modular, scalable system that decouples the **presentation framework** from **constituency-specific datasets**. By standardizing reusable interface components following a **"universal form, variable inputs"** paradigm, the platform dynamically ingests and renders data for any assembly or parliamentary constituency across any Indian state without code modifications.

---

### 2. Core Architectural Principle: Universal Form, Dynamic Data

The platform architecture is divided into two distinct layers:

1. **Presentation Layer (Reusable Components):** Standardized user interface modules—including data cards, demographic charts, geographic maps, and virtualized tables—built once and utilized across all constituencies.
2. **Data Layer (Variable Inputs):** Standardized datasets specific to each constituency injected into the presentation layer at runtime.

#### The "Universal Form" Paradigm
Every constituency follows identical column definitions and file structures regardless of state, while local values differ dynamically:

* **Rural & Urban Geographic Normalization:** Uses generalized `area_name` and `area_type` (e.g., *Village*, *Ward*, *Borough*, *Gram Panchayat*) to seamlessly support both rural assembly seats and metropolitan urban constituencies.
* **Normalized Multi-Party Model:** Avoids hardcoded party columns. Vote tallies are structured as normalized rows (`part_no`, `candidate_name`, `party_code`, `votes`), ensuring full native compatibility with multi-party landscapes across all states (e.g., BJP/INC in Goa, TMC/CPI(M)/BJP in West Bengal, DMK/AIADMK in Tamil Nadu).

---

### 3. Reusable UI Components

The dashboard interface consists of eight standardized component groups:

#### 3.1 Constituency Header & Key Metrics
* **Administrative Banner:** Displays constituency name, identifier, administrative district, parent parliamentary constituency, and reservation classification.
* **Electors KPI Badge:** Highlights total active registered voters with localized numerical formatting.

#### 3.2 Electoral Roll Revision Tracker
* **Revision Timeline:** Tracks voter roll updates across official revision stages (Draft Roll to Final Roll).
* **Net Elector Trend:** Calculates additions, deletions, and net elector changes over time.

#### 3.3 Demographic Distribution Modules
* **Gender Ratio Module:** Visualizes male, female, and third-gender elector distributions.
* **Age Cohort Distribution:** Displays voter population across standard age brackets (18–24, 25–34, 35–44, 45–54, 55–64, 65–74, 75+).
* **Diverging Demographic Pyramid:** Compares male and female distributions across age brackets.

#### 3.4 Legislative Leadership Dossier
* **Elected Representative Panels:** Displays incumbent Member of Legislative Assembly (MLA) and Member of Parliament (MP) profiles, including vote shares, victory margins, party affiliations, and tenures.

#### 3.5 Historical Election Trackers
* **Multi-Cycle Result Comparisons:** Compares party performance, candidate votes, and margin trends across consecutive state assembly and national parliamentary elections.

#### 3.6 Spatial Mapping & Geospatial Visualization
* **Polling Booth Margin Map:** Renders polling station areas colored by electoral margin categories (Stronghold, Competitive, Vulnerable).
* **Sub-Constituency Area Map:** Illustrates aggregate political trends across administrative village or municipal ward boundaries.
* **Sentiment Thematic Map:** Displays localized voter sentiment and priority issues per polling station.

#### 3.7 Searchable Directory Tables
* **Polling Station Directory:** Searchable, paginated registry containing booth numbers (including auxiliary parts e.g., 12A), facility locations, addresses, and registered voter counts.
* **Voter Churn Audit:** Tracks elector modifications, deletions (e.g., deceased, shifted), and new registrations.
* **Household Clusters:** Groups registered electors by residential address to provide household-level insights.

#### 3.8 Citizen Sentiment & Issue Analytics
* **Governance Performance Ratings:** Aggregates voter satisfaction metrics across government and local representation.
* **Community Issue Priority:** Ranks pressing local concerns (e.g., infrastructure, water supply, employment, healthcare) based on survey responses.

---

### 4. Universal Constituency Data Contract

To deploy any constituency onto the platform, the following standardized data entities are provided:

| Data Entity | Standardized Schema / Contract | Universal State Support |
| :--- | :--- | :--- |
| **Constituency Metadata** | `ac_no`, `ac_name`, `state`, `reservation`, `pc_name`, `district`, `sub_district_name` | Supports all state & UT administrative structures |
| **Electoral Roll Master** | `epic_id`, `voter_name`, `gender`, `age`, `house_no`, `surname`, `part_no`, `area_name`, `area_type` | UTF-8 encoded; supports both urban wards & rural villages |
| **Roll Revisions Log** | `epic_id`, `voter_name`, `change_kind`, `revision_stage`, `reason` | Form 7/8 audit tracking (Deceased, Shifted, Modified) |
| **Polling Station Master** | `part_no` (alphanumeric), `station_name`, `address`, `area_name`, `latitude`, `longitude` | Native support for auxiliary booths (e.g., 12A, 14/1) |
| **Election Results (Form 20)**| `part_no`, `candidate_name`, `party_code`, `votes`, `election_key` | Normalized row model; adapts to any state party matrix |
| **Leadership Profiles** | `role`, `name`, `party`, `vote_pct`, `margin_votes`, `tenure`, `photo_url` | Incumbent executive profiles |
| **Citizen Survey Records** | `call_id`, `part_no`, `ratings` (1–5 scale), `primary_issue`, `feedback_notes` | Localized grievance analytics |
| **Geospatial Boundaries** | GeoJSON vector boundaries with 3-tier fallback (Exact Wards to Boundary Voronoi to Grid) | Resilient to missing ward-level GIS shapefiles |

---

### 5. Deployment Roadmap

1. **Phase 1: Component Library Development:** Build and test standardized UI modules, charts, and table components in the Git repository.
2. **Phase 2: Universal Data Schema Standardization:** Finalize standardized data contracts for constituency ingestion.
3. **Phase 3: Integration & Geospatial Optimization:** Connect geospatial mapping modules with 3-tier boundary fallbacks.
4. **Phase 4: Multi-Constituency Scalability & Domain Launch:** Deploy the centralized directory supporting rapid onboarding of new constituencies once the domain is provisioned.
