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

## Week 15 distribution decisions

- **Audience:** Mexican online shoppers considering installment purchases at or near checkout. The moment is seeing a monthly payment that looks manageable before reconstructing its overlap with other commitments.
- **Positioning:** Pausa MX is a pre-checkout decision tool for Mexican online shoppers considering installment purchases.
- **Promise:** “See the consequence before checkout.” This means showing the entered installment total and known/unknown boundaries; it does not decide whether to buy.
- **Forbidden promise:** Pausa MX does not prevent debt, guarantee affordability, save a specific amount, or make the correct purchase decision.
- **Brand rules:** concrete, calm, bounded; navy/purple with neutral surfaces; no red fear styling. Repeatable layout: purchase situation, visible number/consequence, missing question, Pausa MX check, bounded CTA.
- **Creative system:** Series A “Antes de comprar” (A1 square finished, A2 vertical sketch); B “Lo que falta en checkout” (B1 three-panel vertical finished, B2 comparison sketch); C “Haz la cuenta conmigo” (C1 interactive block finished, C2 side-by-side sketch). Finished pieces link into Quick Check.
- **Current product boundary:** Quick Check calculates entered installment amount × count and compares with cash price. It does not analyze overlap with other payment dates or commitments; campaign copy states this limitation.
- **Creative process:** research → writing → visual production → evidence/claim check → style review → human approval → publish/share → observe response → revise. Publication requires human approval; no AI auto-publishing.
- **Analytics:** separate browser-local ledger with only the four campaign event names, allowlisted series A/B/C, finished asset A1/B1/C1, route, timestamp, and anonymous session ID. Asset-view events require viewport visibility where IntersectionObserver is available. Quick Check start records the CTA navigation initiation; it does not assert that the destination loaded, the calculator was completed, or any adoption occurred. No finance or identity data. A click is not adoption, conversion, demand, or engagement proof.
- **Distribution test:** pending. No audience test has occurred; all reach, clicks, Quick Check starts, replies, results, and keep/change fields remain explicitly not tested.
- **Safety:** no shame, false urgency/countdowns, invented testimonials, debt-prevention or fabricated-savings claims, or partner control of the message. Uncertainty remains visible and action remains buyer-controlled.

### Week 15 synthetic persona pass — Mariana

Synthetic review only; this is not real audience evidence. Mariana recognizes the installment-at-checkout moment in the MX$999 × 12 hook. The concrete question feels more useful than generic budgeting advice and the CTA names the next step. The invented scenario is explicitly labeled. The navy/purple visual hierarchy is calm and avoids dramatic financial-ad styling. Potential confusion: English hook/promise mixed with Spanish explanatory text, whether a “Quick Check” also sees other commitments, whether the examples are live calculations, and whether Plans/pricing distracts from the shopper task.

Worst reproduced confusion: the current Quick Check does not compare timing or other obligations, despite the campaign moment describing overlap. Fixed by adding an explicit “Alcance actual” statement to the route: it totals entered installments versus cash price, does not compare payment dates/other commitments, and leaves unentered charges unknown. Added regression coverage. This boundary should remain visible until the product supports overlap analysis.

### Week 15 mechanical pass

Mechanical review was run with the Week 14 regression suite retained. No pre-existing mechanical bug was identified. Campaign analytics validation, route, asset copy, CTA destination, approval gate, and pending-results state have dedicated tests. After the simulation-driven copy change, the full suite passed: 7 test files, 25 tests. The production build completed successfully with all application routes statically generated.

**Next first move:** conduct a permission-based test with actual opted-in shoppers; record only observable results, keep all fields pending until then, and separately test whether the stated Quick Check scope matches the intended overlap moment.

### Week 15 AI-simulated audience testing — A1 vs B1

**Method and evidence boundary:** AI-simulated audience testing walked two research-grounded synthetic personas through the finished A1 square card and B1 vertical three-panel story, considering interpretation, product understanding, likely reaction/objection/click rationale, confusion, easier next step, and trust risks. These are reasoned synthetic reactions, not real people, observed behavior, reach, clicks, conversions, or engagement metrics. Real distribution fields remain pending and have no prefilled numeric results.

**Expected result:** hypothesis from the packet was that a concrete installment example would earn more useful attention than generic financial-wellness language. The simulation supports the relative clarity of A1's concrete purchase moment, while surfacing a shared product-scope and next-step problem in both pieces. This is not a measured performance result.

- **Mariana (27):** A1's MX$999 × 12 recognizes her shopping moment and feels more useful than generic budgeting language. She may mistake “what else falls that month?” for a promise to gather/compare other commitments; “Haz el Quick Check” does not say how much work is involved. B1 signals checkout context, but “lo que falta” and dates/charges feel vague; “Ver el ejemplo” sounds like a preview while routing to the calculator. Three inputs and explicit scope would make either action easier. Dramatic fear, a full-budget workflow, or implied automatic detection would undermine trust.
- **Luis (32):** A1's amount/installment example is immediately recognizable, but its “what else falls” question implies analysis of other commitments. The generic CTA hides the immediate value. B1 identifies checkout but leaves “what is missing” unclear and can imply date/charge analysis. He would need to see the bounded, fast calculation before committing; homework, generic advice, or unsupported detection claims would reduce trust.
- **A1 vs B1:** A1 creates the clearer initial path because the number and purchase moment are specific. B1 better names checkout, but its headline and original “Ver el ejemplo” CTA obscure what happens next. Both require a clear statement of what the current check needs and does.
- **Strongest shared friction:** the assets can be read as promising a full budget or comparison of other payments/dates, while the Quick Check is only a short calculation from three purchase inputs. The old CTA did not make the next action or effort clear.
- **Exact fix:** on `/launch`, explain that Quick Check uses three inputs (cash price, payment amount, number of payments), does not require rebuilding a full budget, and leaves dates/other commitments for the shopper to review separately. Change B1's CTA from “Ver el ejemplo” to “Revisa tu compra en 3 datos.” Keep the explicit limitation that Quick Check does not compare payment-date overlap. No financial calculations changed.
- **Remaining uncertainty:** no real shopper has validated this interpretation or action. It remains unknown whether the CTA feels low effort, whether the three inputs are obvious, which asset leads to real action, and whether the product's calculation is useful at checkout. No real distribution test or audience metrics are claimed.

**Next first move:** conduct a permission-based test with opted-in shoppers using A1 and B1, ask what they expect the click to do, then record only observable real distribution results separately from this AI-simulated audience testing.
