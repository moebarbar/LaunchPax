# LaunchPax MVP Scope

This document defines the minimum feature set required for a stable, demo-ready LaunchPax release.

## Core Flow (End-to-End)
1. **Create a project**
2. **Generate a brand kit**
3. **Generate a website**
4. **Preview or export a website**

## Required Capabilities
- **Authentication:** Users can sign in and access only their projects.
- **Project Lifecycle:** Create, list, update, and delete projects.
- **Brand Kit Generation:** Produce a palette + typography with saved results per project.
- **Website Generation:** Produce a multi-section website draft per project.
- **Preview Experience:** A URL or in-app preview for generated websites.
- **Basic Error Handling:** User-facing errors for failed AI or workflow steps.

## Quality Gates
- **API Health Check:** `/api/health` returns a 200 with uptime and timestamp.
- **Smoke Test:** A script validates the health check and (optionally) a basic project flow.

## Out of Scope (for MVP)
- Payments and subscription enforcement
- Team collaboration
- Advanced analytics
- Multi-brand workspaces

