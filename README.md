# playwright-typescript-framework

[![Playwright Tests](https://github.com/aslavchev/playwright-typescript-framework/actions/workflows/tests.yml/badge.svg)](https://github.com/aslavchev/playwright-typescript-framework/actions/workflows/tests.yml)

Playwright + TypeScript test framework covering two targets:

| Target | Tests | Tech |
|---|---|---|
| [SauceDemo](https://www.saucedemo.com) | 6 UI tests | Page Objects, auto-wait, no explicit waits |
| [DummyJSON](https://dummyjson.com) | 10 API tests | `request` context, schema validation |

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

```bash
cp .env.example .env
# fill in SAUCE_USERNAME, SAUCE_PASSWORD, DUMMYJSON_USERNAME, DUMMYJSON_PASSWORD
```

## Structure

```
src/
  ui/pages/        # Page Objects (LoginPage, ProductsPage, CartPage, CheckoutPage)
  ui/fixtures/     # test.extend() — injects page objects as typed parameters
  ui/data/         # users.ts, products.ts
  api/clients/     # DummyJsonClient — typed API wrapper
  api/fixtures/    # request context setup
  api/data/        # test payloads
tests/
  ui/              # login, products, cart, checkout specs
  api/             # auth, products, users specs
```
