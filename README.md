# AC Dashboard

An enterprise-grade, serverless Electoral Analytics and Constituency Intelligence Platform.

## Master Documentation & Specifications
All technical specifications, universal data schemas, business rules, and implementation roadmaps are consolidated into a single master document:
* 📘 **Technical Specification & Implementation Plan:** [`TECHNICAL_SPECIFICATION.md`](./TECHNICAL_SPECIFICATION.md)
* 📄 **Google Doc Architecture Document:** [https://docs.google.com/document/d/1ZnRWRI4-_9XS_VavXqz9G2ow6NI9cVB4fcBnwuDXUNs/edit](https://docs.google.com/document/d/1ZnRWRI4-_9XS_VavXqz9G2ow6NI9cVB4fcBnwuDXUNs/edit)

## Core Architecture
* **Ingestion:** Raw Excel/CSV files in Cloud Storage (OneDrive / Drive) -> Automated Python compiler
* **Delivery:** Static JSON datasets (< 250 KB per AC) served over Global Edge CDN
* **Frontend:** Reusable, zero-server React + Vite + Tailwind client application

## Standardized Constituencies Supported
* **AC09 — Porvorim** (39 Polling Booths, 23,947 Electors)
* **AC10 — Aldona** (41 Polling Booths, 25,541 Electors)
* **AC17 — Sanquelim** (50 Polling Booths, 27,265 Electors)
