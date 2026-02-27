# ADR-003: UI Page Object Model

**Status:** Accepted | **Date:** 2026-02-26

---

## Context

SauceDemo has multiple pages: Login, Products, Cart, and a three-step Checkout flow. Without abstraction, locators would be duplicated across test files and any selector change would break multiple specs. A pattern is needed that isolates element locators from test logic and keeps tests readable as user workflows.

---

## Decision

Implement class-based Page Objects. Each page gets its own TypeScript class. Locators are declared as `private readonly` fields and resolved in the constructor. Tests never call Playwright's `page` API directly — they go through typed fixtures that inject the page objects.

---

## Alternatives Considered

| Option | Pros | Cons | Verdict |
| ------ | ---- | ---- | ------- |
| **Class-based POM with typed fixtures** | Locators in one place, tests read like user stories, TypeScript types catch misuse | More files than raw tests | ✅ Chosen |
| **Raw `page` calls in tests** | Minimal setup | Locators duplicated across files, any selector change breaks all tests | ❌ Not maintainable |
| **Screenplay Pattern** | High abstraction, actor-based | Overkill for this scope, steep learning curve | ❌ Over-engineering |
| **Page Factory (`@FindBy` style)** | Less boilerplate in Java | No equivalent in Playwright; implicit lazy init adds ambiguity | ❌ Not applicable |

---

## Key Decision Factors

**Locators declared at construction time, not per-action.** Each page class resolves all its locators in the constructor as `private readonly` fields. This means broken selectors fail at instantiation, not buried inside a test action three steps deep.

**No BasePage inheritance required.** Playwright's `Locator` API is self-contained — auto-waits are built in, so a base class would add hierarchy without benefit.

**Typed fixtures remove `new Page()` boilerplate from every test.** Playwright's `test.extend()` pattern wraps page object instantiation in fixtures. Tests receive `loginPage`, `productsPage`, and `cartPage` directly — no constructor calls, no shared state between tests. Each test destructures only the fixtures it needs, so nothing unnecessary is instantiated. Unlike `beforeEach`, fixtures can scope both setup and teardown around the `use()` call — cleanup logic stays with the resource that needs it, not in a separate hook.

**Tests read like user workflows.** The test body describes intent; the page object handles mechanics.

---

## Code Example: POM vs Raw Playwright

```typescript
// ❌ Raw Playwright in test — locator duplicated every test
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByPlaceholder('Password').fill('secret_sauce');
await page.getByRole('button', { name: 'Login' }).click();

// ✅ Page Object — test describes intent
await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
```

---

## Code Example: Class Structure

```typescript
// src/ui/pages/LoginPage.ts
export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton:   Locator;
  private readonly errorMessage:  Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
    this.errorMessage  = page.getByTestId('error');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

---

## Code Example: Typed Fixture

```typescript
// src/ui/fixtures/index.ts
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

// tests/ui/login.spec.ts — no constructor, no raw `page` API
test('standard user logs in', async ({ loginPage, page }) => {
  await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
  await expect(page).toHaveURL(/inventory/);
});
```

---

## Consequences

**Positive:**

- Selector changes isolated to a single page class
- Tests read as user workflows, not Playwright API calls
- TypeScript types catch wrong fixture usage before runtime
- No BasePage needed — Playwright auto-waits make it unnecessary

**Trade-offs:**

- Each page requires its own class file alongside the test spec
- Fixture layer adds one indirection level compared to raw tests
- API abstraction patterns are out of scope for this ADR

---

**References:** [Playwright Page Object Model](https://playwright.dev/docs/pom) | [Playwright Test Fixtures](https://playwright.dev/docs/test-fixtures)

**Last Updated:** 2026-02-26
