# playwright-typescript-framework

[![Playwright Tests](https://github.com/aslavchev/playwright-typescript-framework/actions/workflows/tests.yml/badge.svg)](https://github.com/aslavchev/playwright-typescript-framework/actions/workflows/tests.yml)
[![HTML Report](https://img.shields.io/badge/report-github--pages-blue)](https://aslavchev.github.io/playwright-typescript-framework/)

Playwright + TypeScript test framework covering two targets:

| Target | Tests | Tech |
| --- | --- | --- |
| [SauceDemo](https://www.saucedemo.com) | Login · Products · Cart · Checkout | Page Objects, storageState (bypass login per test), auto-wait |
| [DummyJSON](https://dummyjson.com) | Auth (login, me, refresh) · Products (CRUD, search, pagination) | `request` fixture, typed responses, data-driven |

## Why Playwright

Playwright eliminates the explicit-wait boilerplate required in Selenium (`WebDriverWait`, `ExpectedConditions`). It waits for elements to be actionable automatically — no `waitFor`, no `sleep`.

## Run locally

```bash
npm ci
npx playwright install chromium
npx playwright test          # all tests
npx playwright test tests/ui/  # UI only
npx playwright test tests/api/ # API only
npx playwright show-report     # open HTML report
```

## Setup

No setup required — both targets use public demo credentials with hardcoded fallbacks.

To override credentials (e.g. for CI), copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

## Structure

```text
src/
  ui/pages/        # Page Objects (LoginPage, ProductsPage, CartPage, CheckoutPage)
  ui/fixtures/     # test.extend() — injects page objects as typed parameters
  ui/data/         # users.ts, products.ts
  api/fixtures/    # test.extend() — lazy authToken fixture
  api/types/       # response interfaces (LoginResponse, Product, etc.)
  api/data/        # endpoints, credentials, test payloads
tests/
  ui/              # login, products, cart, checkout specs
  api/             # auth, products specs
```
