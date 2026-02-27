# ADR-002: Native Playwright HTML Reporter over Allure

**Status:** Accepted | **Date:** 2026-02-26

---

## Context

Allure is a popular test reporter in the Java ecosystem and is widely used with Selenium and REST Assured. When choosing a reporter for this Playwright framework, Allure was the natural default. However, Playwright ships with a built-in HTML reporter that includes a trace viewer for step-level debugging. This ADR documents why the native reporter was chosen over Allure.

---

## Decision

Use Playwright's built-in HTML reporter with trace viewer. Do not add `allure-playwright`.

---

## Alternatives Considered

| Option | Pros | Cons | Verdict |
| ------ | ---- | ---- | ------- |
| **Playwright HTML + trace viewer** | Zero dependencies, ships with Playwright, trace viewer shows full DOM/network/console replay | No trend history, no categories dashboard | ✅ Chosen |
| **Allure Playwright** | Consistent with Selenium/API projects, trend graphs, management-friendly dashboard | Extra npm package, extra CI step to generate report, extra deployment complexity, no trace viewer | ❌ Added cost, no debugging advantage |

---

## Key Decision Factors

**No additional dependencies beyond Playwright itself.** The HTML reporter requires no extra packages, no extra CI steps, and no separate deployment workflow. It is enabled by default — `reporter: 'html'` in `playwright.config.ts`. Allure requires `npm install allure-playwright`, a `mvn allure:report` equivalent step in CI, and a separate artifact upload.

**The trace viewer replaces manual debugging workflows.** Allure requires a custom listener to capture screenshots or logs at each step. The Playwright trace viewer shows a full time-travel replay: DOM snapshots at every action, network waterfall, console logs, and a timeline. When a test fails in CI, the trace tells you exactly what the page looked like at every step — no local reproduction needed.

**Consistency across stacks was considered but deprioritized.** Allure is the Java ecosystem standard and is widely used with Selenium and REST Assured. However, Playwright is not the Java ecosystem — using the native tool per context avoids adding dependencies purely for uniformity.

---

## CI Configuration

```yaml
# tests.yml — simplified
- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v3
  if: success() && github.ref == 'refs/heads/main'
  with:
    path: playwright-report/

# deploy job — only runs after test job passes on main
deploy:
  needs: test
  if: github.ref == 'refs/heads/main' && needs.test.result == 'success'
```

The `test` job uploads the artifact only on success; a separate `deploy` job consumes it and publishes to Pages. The live report always reflects a green run.

**Live report:** [aslavchev.github.io/playwright-typescript-framework](https://aslavchev.github.io/playwright-typescript-framework/)

---

## Consequences

**Positive:**

- No extra dependencies to maintain
- Trace viewer available for every failed test in CI (artifact)
- Live report deployed to GitHub Pages on every green main push
- CI pipeline is simpler — no allure generation step

**Trade-offs:**

- No historical trend graphs across runs
- Less familiar to stakeholders used to Allure dashboards
- Report is overwritten on each green deployment — the live report reflects the last passing run, not the current state of main

---

**References:** [Playwright HTML Reporter](https://playwright.dev/docs/test-reporters#html-reporter) | [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)

**Last Updated:** 2026-02-26
