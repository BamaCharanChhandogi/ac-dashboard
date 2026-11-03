# Electoral Analytics & Constituency Intelligence Platform

Frontend component library and architecture for scalable electoral roll analytics and constituency dashboards.

## Architecture & Documentation
- **Full Architecture & Technical Specification:** [`TECHNICAL_SPECIFICATION.md`](./TECHNICAL_SPECIFICATION.md)
- **Google Doc Architectural Blueprint:** [https://docs.google.com/document/d/1ZnRWRI4-_9XS_VavXqz9G2ow6NI9cVB4fcBnwuDXUNs/edit](https://docs.google.com/document/d/1ZnRWRI4-_9XS_VavXqz9G2ow6NI9cVB4fcBnwuDXUNs/edit)

## UI Component Segments
1. **Constituency Header & Electors Badge** (`/src/components/header`)
2. **Roll Revision Progress Tracker** (`/src/components/revision-tracker`)
3. **Demographic Distribution Modules** (`/src/components/demographics`)
   - Gender Split Donut Chart
   - Age Cohort Bars
   - Diverging Age & Gender Population Pyramid
4. **Legislative Leadership Dossier (MLA & MP)** (`/src/components/leadership`)
5. **Historical Election Trackers** (`/src/components/elections-history`)
6. **Spatial Geospatial Mapping** (`/src/components/maps`)
   - Form 20 Polling Booth Margin Map
   - Village Political Lean Map
   - Citizen Survey Thematic Map
7. **Searchable Directory Tables** (`/src/components/tables`)
   - Polling Station Directory
   - Voter Churn Audit (Deletions, Additions, Modifications)
   - Household Clusters
8. **Citizen Sentiment & Issue Analytics** (`/src/components/survey`)
