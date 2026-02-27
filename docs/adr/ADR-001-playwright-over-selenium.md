# ADR-001: Playwright over Selenium for UI Test Automation

**Status:** Accepted | **Date:** 2026-02-26

---

## Context

This framework targets SauceDemo for UI test automation. Selenium + Java is the established enterprise standard for UI test automation. The goal was to evaluate whether Selenium is the right choice for this project or whether a modern alternative better fits the requirements: TypeScript, no explicit waits, built-in API testing capability, and fast CI feedback.

---

## Decision

Use Playwright (TypeScript) instead of Selenium (Java).

---

## Alternatives Considered

| Option | Pros | Cons | Verdict |
| ------ | ---- | ---- | ------- |
| **Playwright + TypeScript** | Auto-waits, native TS, built-in API client, storageState, trace viewer, single install | Smaller historical footprint in legacy Java shops | ✅ Chosen |
| **Selenium + Java** | Proven enterprise standard, large ecosystem, widespread tooling | Explicit waits required (`WebDriverWait`, `ExpectedConditions`), no built-in API testing, separate language stack | ❌ Requires explicit waits and separate API tooling |
| **WebdriverIO** | Cross-browser, Selenium-compatible | More config overhead, slower adoption than Playwright | ❌ No clear advantage |

---

## Key Decision Factors

**Auto-waits eliminate a whole category of test maintenance.** Selenium requires explicit wait conditions for every dynamic element. Playwright waits for elements to be actionable automatically — no `WebDriverWait`, no `ExpectedConditions`, no `Thread.sleep`. This is a framework-level design decision, not a convenience.

**TypeScript means a faster feedback loop.** Selenium tests in Java require `mvn compile` before every run. Playwright tests run directly with `npx playwright test` — TypeScript is transpiled on the fly. Playwright's API is TypeScript-native, so the IDE catches typos and wrong arguments instantly, before the test even starts.

**[`storageState`](https://playwright.dev/docs/auth) eliminates repeated login.** Playwright's `storageState` allows login to be performed once in a setup project (`auth.setup.ts`) and the resulting auth state reused across all tests. Each test runs in its own browser context (like a fresh incognito window), so auth cookies are copied in but no test can affect another's session. In Selenium, every test either logs in or shares brittle static session state.

**Built-in API testing capability.** Playwright's `request` context supports full HTTP testing, so the framework can be extended to host API tests alongside UI tests under the same runner and CI pipeline — same config, same reporting, same CI job.

---

## Code Example: Waits

```typescript
// ❌ Selenium (Java) — explicit wait required
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("[data-test='add-to-cart']")));
element.click();

// ✅ Playwright — auto-wait, no boilerplate
await page.getByTestId('add-to-cart').click();
// Note: getByTestId targets `data-test` (configured via testIdAttribute in playwright.config.ts)
```

---

## Code Example: Auth Reuse

```typescript
// auth.setup.ts — setup project runs once before all tests
setup('authenticate', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(Users.STANDARD.username);
    await page.getByPlaceholder('Password').fill(Users.STANDARD.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/inventory/);
    await page.context().storageState({ path: 'playwright/.auth/user.json' });
});

// Every test reuses the saved auth state — login runs once per suite
```

---

## Consequences

**Positive:**

- Zero explicit waits across all tests
- Login runs once per CI run via `storageState`
- TypeScript types catch errors before runtime
- Trace viewer enables step-by-step replay of any test failure in CI

**Trade-offs:**

- Smaller historical footprint in legacy Java shops
- Chromium-only in this framework (Firefox and WebKit available but not configured)
- `storageState` requires login tests to opt out explicitly — in this framework, `login.spec.ts` opts out at the `describe` block level so all login tests are covered by a single declaration

---

**References:** [Playwright Docs](https://playwright.dev) | [Playwright Library](https://playwright.dev/docs/library)

**Last Updated:** 2026-02-26
