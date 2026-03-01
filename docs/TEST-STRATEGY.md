# Test Strategy: Playwright TypeScript Framework

**Version:** 1.0 | **Owner:** Alexander Slavchev | **Last Review:** 2026-03-01

---

## 1. Context and Scope

### System Under Test

This framework tests two targets from a single Playwright project:

- **SauceDemo** (UI) — demo e-commerce app by Sauce Labs with login, product catalog, cart, and checkout. Uses `data-test` attributes for stable locators.
- **DummyJSON** (API) — public REST API with JWT auth, product CRUD, search, and pagination.

**In scope:**
- UI functional testing of the full purchase flow (SauceDemo)
- API functional testing of auth and product endpoints (DummyJSON)

**Out of scope:**
- Visual regression testing (high maintenance cost for a demo app)
- Performance / load testing (different discipline, different tools)
- Cross-browser testing (Chromium-only — see Accepted Risks)
- Accessibility testing (would add for a real product)

### Quality Attributes (ranked)

1. **Reliability** — tests must be deterministic; a flaky suite is worse than no suite
2. **Speed** — CI feedback under 3 minutes for the full suite
3. **Maintainability** — a new contributor can add a test without reading the whole framework

---

## 2. Risk Assessment

### Risk Matrix (Probability × Impact)

```
              Unlikely (1)    Possible (2)    Likely (3)
Critical (3)    🟡 3            🟠 6            🔴 9
Degraded (2)    🟢 2            🟡 4            🟠 6
Minor    (1)    🟢 1            🟢 2            🟡 3
```

### Top Risks

| # | Target | Risk | P | I | Score | Action | Mitigation |
|---|--------|------|---|---|-------|--------|------------|
| 1 | SauceDemo | UI changes break locators | 2 | 3 | 6 | MITIGATE | `data-test` attributes as primary selectors via `testIdAttribute` config |
| 2 | Both | Tests pass locally, fail in CI | 2 | 3 | 6 | MITIGATE | CI-first development; all tests run headless from day 1; `workers: 1` in CI |
| 3 | SauceDemo | Auth state leaks between tests | 1 | 3 | 3 | DOCUMENT | `storageState` with isolated browser contexts; auth file is read-only |
| 4 | SauceDemo | Downtime blocks test suite | 1 | 2 | 2 | DOCUMENT | External dependency; no SLA; fail-fast on unreachable base URL |
| 5 | DummyJSON | Seed data changes | 2 | 2 | 4 | MITIGATE | `toBeTruthy()` over exact match on mutable fields; `toContain()` for error messages |
| 6 | DummyJSON | Downtime blocks API suite | 1 | 2 | 2 | DOCUMENT | External dependency; API tests are independent from UI suite |

> **P** = Probability (1 Unlikely, 2 Possible, 3 Likely) | **I** = Impact (1 Minor, 2 Degraded, 3 Critical)

### Accepted Risks

| Gap | Reason |
|-----|--------|
| Cross-browser testing | Chromium-only. SauceDemo renders identically across browsers. Adding Firefox/WebKit triples CI time for zero defect yield. |
| Performance / load testing | Different discipline, different tools. Out of scope for a functional test framework. |
| Visual regression | High maintenance cost for a demo app with no visual changes. Would add for a real product. |
| Mobile viewport testing | SauceDemo is not responsive. No mobile-specific behavior to test. |

---

## 3. Test Architecture

### Test Pyramid

```
        ╱  E2E (UI)  ╲          ← 19 tests — full user flows
       ╱───────────────╲
      ╱   Integration    ╲      ← 15 tests — API endpoint validation
     ╱─────────────────────╲
    ╱      Unit / Fast       ╲   ← 0 tests — no custom logic to unit test
   ╱───────────────────────────╲
```

| Layer | Count | What's Tested | Tools |
|-------|-------|---------------|-------|
| **E2E** | 19 | Full user flows: login → browse → cart → checkout | Playwright + Page Objects |
| **Integration** | 15 | API functional: auth (4) + products (11) | Playwright `request` fixture |
| **Unit** | 0 | No custom business logic — framework is test infrastructure | N/A |

> For a portfolio project testing third-party apps, there is no application code to unit test. The E2E layer validates UI flows against SauceDemo. The integration layer validates API endpoints against DummyJSON. Both targets are external — the value is in proving the framework handles both layers idiomatically.

### Test Level Decision Matrix

| Scenario | Target | Unit | Integration | E2E |
|----------|--------|------|-------------|-----|
| Login validation (UI form) | SauceDemo | Can't test | Can't test | **Primary** |
| Product sorting / filtering | SauceDemo | Can't test | Can't test | **Primary** |
| Cart add / remove | SauceDemo | Can't test | Can't test | **Primary** |
| Checkout form validation | SauceDemo | Can't test | Can't test | **Primary** |
| Full purchase flow | SauceDemo | Can't test | Can't test | **Primary** |
| Auth endpoints (login, refresh, me) | DummyJSON | Can't test | **Primary** | Overkill |
| Product CRUD (add, update, delete) | DummyJSON | Can't test | **Primary** | Overkill |
| Product search and pagination | DummyJSON | Can't test | **Primary** | Overkill |

**Anti-pattern avoided:** No unit tests wrapping Playwright API calls. API tests use `request` fixture directly — no browser overhead for endpoint validation.

### Test Size Definitions

| Size | Network | Filesystem | Timeout | Example |
|------|---------|-----------|---------|---------|
| **Large** | Yes (saucedemo.com) | Yes (storageState) | 30s per test | 19 UI tests |
| **Medium** | Yes (dummyjson.com) | No | 10s per test | 15 API tests |

---

## 4. Test Coverage

### Page Coverage

| Page | Tests | What's Verified |
|------|-------|-----------------|
| `/` (Login) | 3 | Valid login, locked user error, invalid credentials error |
| `/inventory` (Products) | 5 | Page load (6 items), default sort, price sort, add to cart, remove from cart |
| `/cart` (Cart) | 4 | Empty cart, item appears after add, remove item, navigate to checkout |
| `/checkout-step-one` (Checkout Info) | 4 | Valid info, missing first name, missing last name, missing postal code |
| `/checkout-step-two` (Checkout Overview) | 1 | Finish checkout → confirmation |
| `/checkout-complete` (Checkout Complete) | 1 | Back home → products page with empty cart |

**UI Total: 19 tests across 4 spec files**

### API Coverage (DummyJSON)

| Endpoint | Tests | What's Verified |
|----------|-------|-----------------|
| `POST /auth/login` | 2 | Valid login returns tokens + user data; invalid credentials return 400 |
| `GET /auth/me` | 1 | Valid token returns current user |
| `POST /auth/refresh` | 1 | Valid refresh token returns new token pair |
| `GET /products` | 4 | Default pagination (30 items); custom limit + skip (3 data-driven scenarios) |
| `GET /products/:id` | 2 | Valid ID returns product details; invalid ID returns 404 |
| `GET /products/search` | 2 | Matching query returns results; non-existent query returns empty |
| `POST /products/add` | 1 | Returns 201 with new product ID |
| `PUT /products/:id` | 1 | Returns updated product with new title |
| `DELETE /products/:id` | 1 | Returns soft-deleted product with `isDeleted: true` |

**API Total: 15 tests across 2 spec files (9 test cases, 11 executions from data-driven pagination)**

**Combined Total: 34 tests (19 UI + 15 API)**

### What's Tested

- **Happy path** — full purchase flow: login → browse → add to cart → checkout → confirmation → back home
- **Error handling** — locked user, invalid credentials, missing checkout fields (3 validation scenarios)
- **State transitions** — cart badge increment/decrement, page navigation via URL assertions

### What's NOT Tested

| Gap | Target | Reason |
|-----|--------|--------|
| Multiple items in cart | SauceDemo | Single-item flow covers the pattern; multi-item adds execution time without new coverage |
| `problem_user` / `error_user` edge cases | SauceDemo | Intentional bug users. Suite focuses on the standard purchase flow. |
| Price calculation verification | SauceDemo | Tax calculation is hardcoded; asserting it tests their math, not our framework |
| Logout flow | SauceDemo | Trivial (clear cookies); `storageState` already handles auth lifecycle |

---

## 5. Automation Strategy

### Framework Architecture

```text
playwright-typescript-framework/
├── src/
│   ├── ui/
│   │   ├── pages/         ← Page Objects (LoginPage, ProductsPage, CartPage, Checkout*)
│   │   ├── fixtures/      ← test.extend() with typed page object injection
│   │   └── data/          ← Test data constants (users, products, customers, sortOptions)
│   └── api/
│       ├── fixtures/      ← test.extend() with lazy authToken fixture
│       ├── types/         ← Response interfaces (LoginResponse, Product, etc.)
│       └── data/          ← Endpoints, test data constants, product IDs
├── tests/
│   ├── auth.setup.ts      ← Login once, save storageState for UI tests
│   ├── ui/                ← Test specs grouped by page
│   └── api/               ← Auth and product endpoint tests
├── playwright.config.ts   ← Multi-project config (browser-auth, chromium, api)
├── .github/workflows/
│   └── tests.yml          ← CI pipeline (lint → test → report → deploy)
└── docs/
    ├── adr/               ← Architecture Decision Records
    └── TEST-STRATEGY.md   ← This document
```

### Test Data Management

| Data Type | Source | Strategy |
|-----------|--------|----------|
| **UI Credentials** | `users.ts` with `process.env` fallbacks | `SAUCE_USERNAME` / `SAUCE_PASSWORD` from environment; hardcoded fallbacks for local dev |
| **UI Test users** | `users.ts` constants | `STANDARD`, `LOCKED`, `INVALID` — intent encoded in naming |
| **UI Products** | `products.ts` constants | Display names matching SauceDemo catalog |
| **UI Customers** | `customers.ts` constants | Checkout form data (`STANDARD` customer) |
| **API Credentials** | `test-data.ts` with `process.env` fallbacks | `DUMMYJSON_USERNAME` / `DUMMYJSON_PASSWORD`; defaults to `emilys` |
| **API Product IDs** | `test-data.ts` constants | `EXISTING_PRODUCT_ID` (read), `MUTABLE_PRODUCT_ID` (write), `INVALID_PRODUCT_ID` (negative) |
| **API Payloads** | `test-data.ts` constants | `NewProduct`, `UpdateProduct` — static `as const` objects |

### Flaky Test Policy

- **Detection:** CI retry count > 0 flags the test as potentially flaky
- **Budget:** 0% flake rate target — any flaky test is a bug
- **Process:** Fix immediately or quarantine with `test.skip()` + linked justification
- **Prevention:** Playwright auto-waits on every action; no `waitForTimeout` allowed; ESLint `no-wait-for-timeout` rule enforced; assertions on state not presence

---

## 6. CI/CD Integration

### Pipeline Design

```
push/PR → checkout → install → lint → install browsers → test → report artifact → deploy report
```

| Step | Tool | Fast-fail? | Notes |
|------|------|-----------|-------|
| Lint | ESLint | Yes | Runs before browser install — cheapest check first |
| Test | Playwright | Yes | Headless Chromium, 1 worker in CI |
| Report | Playwright HTML | No | Uploaded as artifact on every run |
| Deploy | GitHub Pages | No | Only on green main push |

### CI-Specific Configuration

| Setting | Local | CI |
|---------|-------|-----|
| **Workers** | Auto (CPU cores) | 1 (deterministic) |
| **Retries** | 0 | 1 |
| **Browser** | Chromium (headed available) | Chromium headless |
| **Traces** | off | on-first-retry |
| **Screenshots** | off | only-on-failure |
| **forbidOnly** | false | true (fail if `test.only()` committed) |

---

## 7. Entry and Exit Criteria

### Ready to Test

- [x] SauceDemo is accessible at `https://www.saucedemo.com`
- [x] Credentials configured (env vars or hardcoded fallbacks in `users.ts`)
- [x] CI pipeline is green on smoke tests

### Done (Definition of Done for Test Suite)

- [x] All 34 tests pass — 100% pass rate (19 UI + 15 API)
- [x] 0% flake rate across consecutive CI runs
- [x] No `test.skip()` without linked justification
- [x] No hardcoded waits (`waitForTimeout`)
- [x] TEST-STRATEGY.md documents all coverage gaps with rationale

### Gate Decision

| Decision | Criteria | Action |
|----------|----------|--------|
| **PASS** | No open risks with score >= 6. All tests green. | Ship it. |
| **CONCERNS** | High risks (score 6-8) exist but have mitigation plans. | Ship with documented risk acceptance. |
| **FAIL** | Critical risks (score = 9) open, or acceptance criteria lack test coverage. | Do not ship. Resolve blockers first. |

**Current gate status:** CONCERNS — Two risks scored 6 (locator breakage, local/CI divergence). Both have active mitigations (`data-test` selectors, CI-first config). No score-9 blockers.

---

## 8. Metrics

| Metric | Target | Current | How Measured |
|--------|--------|---------|-------------|
| **Pass rate** | 100% | 100% | CI report |
| **Flake rate** | 0% | 0% | CI history (retried tests) |
| **Execution time** | < 3 min | ~45s | CI logs |
| **Page coverage** | All SauceDemo pages exercised | 6/6 pages | This document |
| **Endpoint coverage** | All DummyJSON target endpoints exercised | 9/9 endpoints | This document |
| **Defect escape rate** | N/A | N/A | Demo app — no production defects to track |

---

**References:** [Framework repo](https://github.com/aslavchev/playwright-typescript-framework) | [Live report](https://aslavchev.github.io/playwright-typescript-framework/) | [ADRs](docs/adr/)

**Last Updated:** 2026-03-01
