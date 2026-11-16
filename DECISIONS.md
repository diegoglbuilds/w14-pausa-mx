# Week 14 decisions — Pausa MX pricing

## Architecture

- Next.js App Router with React and TypeScript; `/` is the mobile-first Quick Check, `/pricing` contains tier comparison and the revenue simulator, and `/about` contains the 10:1 memo.
- Revenue and Quick Check arithmetic are deterministic client-side TypeScript. Zod validates simulator inputs and stored scenario records. No AI participates in financial calculations.
- Simulator scenarios and the safe event ledger use browser `localStorage` only. There are no account, bank, lender, retailer, or remote financial-profile integrations. No authentication is required for this local-only slice.
- Styling uses local CSS and system font fallbacks; there are no third-party font requests.

## Pricing hypotheses

- Free is MX$0 and includes the core Quick Check, the same deterministic truth and uncertainty as every tier, buyer control and guardrails, and up to three local scenarios.
- Plus at MX$59 per month is a starting pricing hypothesis, not market validated. It proposes convenience only: preferences, additional scenarios, richer exports, purchase history, and optional reminders. There is no billing or claim of paid demand in this slice.
- Partner pricing is unvalidated. The intended segment is buyer-aligned employers and financial-wellness programs. A payer cannot affect shopper recommendations.
- Revenue defaults (300 active users, 5% conversion, MX$59 price, MX$10 monthly paid-user cost, and 1% downside conversion) are clearly labeled examples/hypotheses, not observations.

## Free and paid rule

Every tier receives the same core math, uncertainty labels, buyer-controlled result, and safety/decision guardrails. A more favorable recommendation or safer financial logic cannot be a paid feature. Plus is framed as convenience only.

## Revenue formulas and rounding

- Paid users = active users × conversion percentage, rounded to the nearest whole user.
- Monthly revenue = paid users × monthly price.
- Monthly variable cost = paid users × monthly cost-to-serve.
- Monthly contribution = monthly revenue − monthly variable cost.
- Annual amounts are the respective monthly amount × 12.
- Money is rounded to two decimal places using `Math.round((value + Number.EPSILON) * 100) / 100`.
- Downside applies the user-entered lower conversion assumption independently to the same active-user count.

## Scenario storage

- Key: `pausa-mx:w14:scenarios`; values contain a generated identifier, a user-entered local name (max 40 characters), and validated simulator inputs.
- Free allows up to three entries. Users can save, load, and delete entries. Invalid JSON returns an empty list; malformed entries are skipped while valid entries are preserved. Storage errors leave the rest of the product usable.
- Data remains on the current browser/device and is not synced or remotely backed up.

## Analytics boundaries

- Event records are local only and contain the event name, timestamp, anonymous random session identifier, screen, and allowlisted categorical metadata.
- Financial assumptions, purchase details, income, expenses, names, email, and free-form comments are not accepted into metadata. The allowlist permits only tier labels, scenario counts, validity flags, and source categories.
- CTA events are intent telemetry only. They are not payment, conversion, or willingness-to-pay evidence. No payment flow exists.

## Known risks and unverified assumptions

- No observed user research or market evidence validates MX$59, conversion, cost-to-serve, segment demand, or partner pricing.
- Actual time saved, repeated use, willingness to pay, paid conversion, avoided-mistake frequency, and partner willingness to pay remain unverified. The 10:1 case is not proven.
- Static local storage can be cleared by the browser and does not synchronize across devices. This version intentionally has no billing, remote analytics, or partner reporting.
- Revenue outputs are simplified projections and exclude fixed costs, taxes, churn, refunds, payment processing, and operational variation.
- The Partner CTA is local intent telemetry only; an actual partner contact channel has not been established.
- This milestone was not manually browser-verified because no browser automation/tooling is configured in the repository.

## Week 14 synthetic persona pass

Method: source, component, copy, and state review using the synthetic Mariana persona from `docs/PACKET.md`. No browser automation tools are available in this environment, so no browser interaction or real-user evidence is claimed.

Likely confusions and hesitations logged:

- On `/`, the Quick Check asks for the installment amount and count, but a shopper who knows only the monthly payment may not know whether fees or other charges are included. The result correctly says unknown terms remain unknown, but she still has to supply the total count.
- On `/pricing`, Free is MX$0 and contains the core check, while Plus is MX$59/month. Before this pass, the reason to pay could read as paying for the arithmetic; the free-math assurance appeared only after all three tier cards.
- The revenue simulator projects Pausa MX business revenue, not Mariana's purchase cost or personal savings. Its placement on the pricing route could make it feel business-oriented or like an earnings promise, though its copy labels assumptions as hypotheses and projections as unobserved.
- The initial simulator values are examples, but precise outputs can still look more certain than the assumptions behind them.
- Plus is explicitly described as convenience only, but its hypothetical saved preferences, history, exports, and reminders may still make her wonder whether it gives a safer recommendation.
- Partner is described for organizations, and the page says payers do not direct results; the employer/wellness payer model may nevertheless raise concern about influence. Retailers are ruled out, but partner independence remains a trust question.
- Saved scenarios can be loaded and deleted with labeled controls, and are described as local to this browser. A user may still not know local means unsynced/device-bound until seeing the saved list or footer.
- English segment names and business revenue modeling amid consumer plans may make pricing feel designed for a business audience and prompt her to leave.
- The 10:1 memo openly identifies free alternatives and unverified time savings, repeat use, and willingness to pay; its effort-saving case remains a business hypothesis rather than evidence she receives ten times the price in value.

Worst confusion: MX$59/month could look like a subscription for the same math she can do in a calculator, especially because the Free-versus-Plus reassurance was separated from the tier cards.

Fix: state inside the Plus card that the calculation and same decision information are free, and that MX$59/month is only a convenience hypothesis with no active subscription. Regression coverage asserts this explanation appears inside the Plus card.

## Security status

- `.env*` files are ignored; there are no required secrets or service credentials.
- The complete dependency audit reports zero known vulnerabilities for the locked dependency tree at implementation time.
- No real PII or personal financial data is seeded or transmitted. The Quick Check values remain in the page and are never logged.
- Scenario names are user-entered local data. Users can delete scenarios; event records can be cleared through browser storage settings.

## Tomorrow / next first move

Run short usability sessions with synthetic scenarios. Measure task completion and confusion around total commitment, the Free/Plus boundary, and the distinction between click intent and actual payment evidence. Do not treat stated interest as a sale; design an ethical willingness-to-pay test before changing the price hypothesis.
