// Calon AI — Case Studies data + selection helpers (ES module)
export const STUDIES = [
  {
    slug: 'volt-secure-operational-platform',
    name: 'Volt Secure — Operational Platform & CRM Replacement',
    subtitle: 'A Welsh fire and security installer was running quotes, jobs and customers across five disconnected tools. We replaced the lot with one purpose-built operational platform.',
    industry: 'Fire & Security', service: 'Operational Platform Automation', client: 'Volt Secure — Cai Llewellyn', named: true,
    stats: [{ n: '£180/mo', l: 'CRM subscription eliminated' }, { n: '6–8 hrs/wk', l: 'director time recovered' }, { n: '1 platform', l: 'replacing 5 disconnected tools' }],
    overview: 'Volt Secure is a Wales-based fire and security installer working across domestic and commercial sites in South Wales and the South West. Like most growing trade businesses, the operational tooling had grown organically and was no longer fit for purpose.',
    challenge: ['Quotes, jobs, customer notes and engineer schedules were spread across spreadsheets, WhatsApp threads, a paid CRM subscription that no one fully used, and the director\u2019s personal ChatGPT account. Nothing reconciled cleanly.', 'Around 8 to 10 hours of director time was disappearing into admin reconciliation every week. Quote follow-ups were slipping through the gaps, costing an estimated £4,000 to £6,000 per month in unconverted enquiries. The CRM subscription itself was generating less value than the founder\u2019s personal AI tools.'],
    solution: ['Calon AI built a purpose-built operational platform replacing the previous CRM entirely. The platform consolidates quotes, jobs, customers, sites and engineer activity into a single advisory queue that surfaces what needs attention, in priority order, at the start of every day.', 'Customer and site management runs alongside quote creation, version control and approval thresholds. Internal notes carry role-based access for office and field staff. Every action across the business funnels into one source of truth for the director.'],
    results: ['£180 per month CRM subscription cancelled within the first month', '6 to 8 hours per week of director time returned to fee-earning work', 'Quote follow-up moved from "checked when I remember" to a daily worked queue', 'Single source of truth across office, field and director-level reporting', 'Platform foundation now ready for Phase 2 Quote Studio with live margin visibility'],
    quote: 'Calon built us a platform that does what five different tools were failing to do, and we cancelled them all in the first month. I got my evenings back and I finally see what is actually happening in my business every morning.', qa: 'Cai Llewellyn, Volt Secure'
  },
  {
    slug: 'volt-secure-timesheet-payroll',
    name: 'Volt Secure — Timesheet Verification & Payroll Workflow',
    subtitle: 'Engineer timesheets were costing a full Monday morning every week and triggering payroll disputes. We built a verification workflow that finalises the week automatically.',
    industry: 'Fire & Security', service: 'Payroll & Timesheet Automation', client: 'Volt Secure — Cai Llewellyn', named: true,
    stats: [{ n: '4–6 hrs/wk', l: 'office admin time recovered' }, { n: '90%+', l: 'reduction in payroll disputes' }, { n: '5–8%', l: 'recovery on under-recorded billable hours' }],
    overview: 'Volt Secure runs a team of field engineers across multiple sites every week. Timesheets, mileage and expenses are the backbone of both payroll and customer billing, and they were costing the business more than they should have.',
    challenge: ['Engineers were submitting timesheets manually, often days late, with mileage, expenses and site visits captured across paper notes, photos and verbal handovers. The office team was reconstructing every week before payroll.', 'Disputes between engineers and office over hours, sites and expenses were eating Monday mornings. An estimated 5 to 8 percent of billable engineer hours were going unrecorded or under-recorded with no audit trail to challenge or correct it.'],
    solution: ['Calon AI built a per-site clock-in and clock-out workflow with a verification layer running against the existing RAM data. Verification acts as a confidence signal rather than a gate. Engineers are never blocked from being paid, but every record is independently checkable.', 'Mileage is calculated automatically from site visit data. Expenses are captured with photo upload and categorised at point of submission. A Sunday cron auto-finalises the week, producing three clean output values per engineer ready for Xero processing.'],
    results: ['Payroll week reduced from a full Monday morning to a 30-minute review', '4 to 6 hours per week of office admin time recovered', 'Estimated 5 to 8 percent recovery on previously under-recorded billable hours', 'Payroll disputes between engineers and office reduced by 90 percent or more', 'Full audit trail per engineer, per site, per week, ready for accountant'],
    quote: 'Monday mornings used to be a fight. Now payroll is a 30-minute review and the numbers actually match what happened on site. The engineers stopped arguing because the data is clear.', qa: 'Cai Llewellyn, Volt Secure'
  },
  {
    slug: 'heatglow-lead-vetting',
    name: 'HeatGlow — AI Lead Vetting & Qualification Flow',
    subtitle: 'A Cardiff heating installer was treating every website enquiry the same way. Serious customers were waiting 48 hours while the team chased time-wasters. We built the AI filter that changed that.',
    industry: 'Heating & Renewables', service: 'Lead Qualification Automation', client: 'HeatGlow — Gareth Jones', named: true,
    stats: [{ n: '2.5x', l: 'increase in booked quote visits per week' }, { n: '48 → 2 hrs', l: 'first-response time on qualified leads' }, { n: '40%', l: 'reduction in time on unqualified enquiries' }],
    overview: 'HeatGlow is a Cardiff-based heating, boiler and renewable installation business. Their website was generating consistent enquiry volume, but the quality was uneven and the team was paying the price.',
    challenge: ['Every website enquiry was landing in a shared inbox and being treated equally. The sales team was spending equal time on serious quote requests and on enquiries with no postcode, no fuel type and no budget.', 'Serious enquiries were waiting 48 hours or more for a first response while the team worked through the backlog. Two competitors in the same area were quoting same-day. An estimated 40 percent of enquiry-handling time was being spent on leads that would never convert.'],
    solution: ['Calon AI built a multi-step vetting and qualification flow on the website that captures the data needed to score every enquiry before it reaches the inbox. Qualified leads route straight to the sales pipeline with full context attached.', 'Unqualified leads receive an automated, helpful response with the data they need to come back properly. The sales team only ever sees enquiries worth their time, and the director gets a daily lead quality report.'],
    results: ['First-response time on qualified leads dropped from 48 hours to under 2 hours', 'Approximately 2.5x increase in booked quote visits per week', '40 percent reduction in time spent on unqualified enquiries', 'Sales team now working a pipeline of real opportunities, not a backlog of noise', 'Full visibility for the director on lead quality trends by source'],
    quote: 'We were losing serious customers to competitors who responded faster, while my team was busy with people who were never going to buy. Calon AI built the filter that fixed it. We now respond in under two hours to the leads that matter.', qa: 'Gareth Jones, HeatGlow'
  },
  {
    slug: 'heatglow-reactivation-campaign',
    name: 'HeatGlow — AI Customer Reactivation Campaign Manager',
    subtitle: 'Years of dormant customer data was sitting in the CRM untouched. We built the AI campaign manager that turned it into £18k of recovered revenue in 90 days.',
    industry: 'Heating & Renewables', service: 'Customer Reactivation Automation', client: 'HeatGlow — Gareth Jones', named: true,
    stats: [{ n: '12%', l: 'reactivation rate on first campaign' }, { n: '£18k', l: 'recovered revenue in first 90 days' }, { n: 'Zero', l: 'manual effort once live' }],
    overview: 'HeatGlow had years of historical customer data sitting in their CRM. Service-due reminders, annual safety checks and upgrade opportunities were going unsent because no one had time to run the campaigns manually.',
    challenge: ['The marketing budget was being spent on new lead generation while a warm, dormant base was being ignored. An estimated 1,400 dormant customers had a service or upgrade opportunity attached to them.', 'Even a conservative 5 percent reactivation rate represented £40,000 to £60,000 of recoverable revenue per year that was simply not being asked for.'],
    solution: ['Calon AI built a campaign manager wired into the existing customer database. Dormant customers are segmented automatically by install date, fuel type, service history and upgrade eligibility.', 'Reactivation campaigns run automatically across SMS and email with pre-built sequences for boiler service, safety check and renewable upgrade. Responses route into the same sales pipeline as new leads. Suppression logic prevents customers being contacted across overlapping campaigns.'],
    results: ['Approximately 12 percent reactivation rate on the first dormant-customer campaign', '£18,000 of additional revenue recovered in the first 90 days', 'Zero ongoing manual effort to run subsequent campaigns', 'Reactivated customers feed the same pipeline as new leads, with full attribution', 'Marketing spend on cold acquisition reduced as warm reactivation became the priority'],
    quote: 'I had thousands of old customers sitting in the database doing nothing. Calon AI turned them into a revenue engine that runs on its own. The first campaign paid for the whole project.', qa: 'Gareth Jones, HeatGlow'
  },
  {
    slug: 'construction-skills-wales-onboarding',
    name: 'Construction Skills Wales — Fully Automated Learner Onboarding',
    subtitle: 'Learner onboarding was a three-day manual process and one in four learners started with incomplete files. We automated the entire intake.',
    industry: 'Construction Training', service: 'Learner Onboarding Automation', client: 'Construction Skills Wales Ltd', named: true,
    stats: [{ n: '3 days → 30 min', l: 'onboarding time for clean cases' }, { n: '80%', l: 'reduction in onboarding admin per cohort' }, { n: '25% → <5%', l: 'incomplete-file rate at course start' }],
    overview: 'Construction Skills Wales delivers accredited construction training programmes across Wales. With a small team handling everything from enrolment to compliance, onboarding admin was creating real operational drag.',
    challenge: ['Learner onboarding was a three-day manual process. Forms were emailed, printed, scanned and re-keyed. ID verification, sponsor documents, course enrolment and funding eligibility were chased one at a time, often by phone.', 'Cohort start dates were being missed because paperwork was incomplete. Around 1 in 4 learners were starting their course with incomplete files, creating compliance risk and audit exposure. An estimated 10 to 12 hours of admin time per cohort was being spent on onboarding.'],
    solution: ['Calon AI built a fully automated onboarding workflow that takes the learner from enquiry to confirmed start in under 30 minutes, with no admin intervention required for clean cases.', 'The system handles ID upload, sponsor capture, enrolment, funding eligibility checks and induction scheduling end to end. The admin team now handles exceptions, which is where their judgement actually adds value.'],
    results: ['Learner onboarding reduced from 3 days to under 30 minutes for clean cases', 'Approximately 80 percent reduction in onboarding admin time per cohort', 'Incomplete-file rate at course start reduced from around 25 percent to under 5 percent', 'Funding eligibility checked at point of enrolment, not after the fact', 'Compliance and audit position materially strengthened'],
    quote: 'Onboarding used to eat the start of every cohort. Now the system handles it and we focus on the learners who actually need our help. The compliance position has never been stronger.', qa: 'Construction Skills Wales Ltd'
  },
  {
    slug: 'construction-skills-wales-documents',
    name: 'Construction Skills Wales — AI Document Chasing & Compliance',
    subtitle: 'The team was spending more time chasing paperwork than processing it. We built an automated chase workflow that protects the audit position and frees up the admin team.',
    industry: 'Construction Training', service: 'Document Management Automation', client: 'Construction Skills Wales Ltd', named: true,
    stats: [{ n: '65%', l: 'reduction in incomplete learner files' }, { n: '6–8 hrs/wk', l: 'admin time recovered' }, { n: 'Faster', l: 'funded place claim processing' }],
    overview: 'Across the construction training learner journey, documents are constantly required: right to work, ID, sponsor approvals, completion certificates, employer feedback. Every missing document was being chased by hand.',
    challenge: ['Around 6 to 8 hours per week of admin time was being spent on document chasing alone. Every missing document was an email written by hand.', 'Compliance gaps were appearing in audit because documents were arriving weeks late or not at all. Funded place claims were being held up by missing employer or sponsor confirmations.'],
    solution: ['Calon AI built an automated document chasing workflow that tracks every required document per learner. Progressive reminders go to the right person (learner, employer, sponsor, internal admin) with the right tone.', 'Escalation to a human happens only when the automated chase has exhausted its sequence. Director-level visibility shows aged document gaps across all live cohorts in one place.'],
    results: ['Approximately 65 percent reduction in incomplete learner files at audit point', '6 to 8 hours per week of admin time returned to higher-value work', 'Funded place claims processed faster as supporting documents arrive on time', 'Compliance gaps visible to leadership in real time, not at end of cohort', 'Learner experience improved with clear, polite reminders instead of last-minute phone calls'],
    quote: 'We were spending more time chasing paperwork than running the training. Calon AI took that off our plate completely. The admin team is finally doing the work they were hired to do.', qa: 'Construction Skills Wales Ltd'
  },
  {
    slug: 'fire-security-engineer-app',
    name: 'UK Fire & Security Installer — Engineer Job Management & Evidence Capture App',
    subtitle: 'Field engineers were finishing jobs without consistent evidence capture. Photos were on phones, signatures on paper, and the post-job admin was a guessing game. We built the mobile app that fixed it.',
    industry: 'Fire & Security', service: 'Field Engineer Workflow Automation', client: 'UK Fire & Security Installer', named: false,
    stats: [{ n: '30%', l: 'faster job sign-off per engineer per day' }, { n: '30% → <5%', l: 'incomplete-evidence rate at sign-off' }, { n: 'Real time', l: 'evidence pack built on site' }],
    overview: 'A UK fire and security installer working across commercial and residential sites. Engineers were producing strong work but the evidence trail behind that work was fragmented and untraceable.',
    challenge: ['Photos lived in personal phones, signatures were on paper job sheets, and post-job admin was rebuilding the evidence pack from memory days later. When customers queried completion or insurers asked for proof, the pack was incomplete.', 'Around 30 percent of jobs had at least one piece of missing evidence at sign-off. Disputes over completion were costing an estimated 2 to 3 days per month of director time. Insurance claims on completed work were being weakened by gaps in the trail.'],
    solution: ['Calon AI built a mobile-first engineer app that runs the engineer through a job-type-specific checklist on site, captures photo and signature evidence at the point of completion, and auto-builds the evidence pack against the job record before the engineer leaves the site.', 'Office-side, a review queue surfaces any incomplete sign-offs before invoicing. The evidence trail is now built in real time, not reconstructed afterwards.'],
    results: ['Approximately 30 percent faster job sign-off per engineer per day', 'Incomplete-evidence rate at sign-off reduced from around 30 percent to under 5 percent', 'Disputes over completion materially reduced', 'Insurance and compliance position strengthened on every completed job', 'Customers receive a complete handover pack as the engineer leaves site'],
    quote: 'My engineers used to leave site with the job done and no proof of it. Now the evidence pack is built before they get back in the van. Disputes are a thing of the past.', qa: 'UK Fire & Security Installer'
  },
  {
    slug: 'heating-pipeline-dashboard',
    name: 'UK Heating Business — Pipeline & Commercial Reporting Dashboard',
    subtitle: 'The director was running commercial decisions off a weekly spreadsheet and instinct. We built the live dashboard that put margin and pipeline in front of him every morning.',
    industry: 'Heating & Renewables', service: 'Commercial Reporting Automation', client: 'UK Heating Business', named: false,
    stats: [{ n: '4 hrs/wk', l: 'office reporting time eliminated' }, { n: 'Daily', l: 'margin visibility per quote and job' }, { n: 'Live', l: 'pipeline weighting by close rate' }],
    overview: 'A UK heating, boiler and renewables installer running a strong field operation but weak on commercial visibility. The director was making pricing and marketing decisions on data that was always at least a week old.',
    challenge: ['Margin, conversion rate, average job value and pipeline weight were either out of date or being calculated by hand. Around 4 hours of office manager time per week was being spent assembling the commercial report.', 'By the time the director saw the numbers, they were already a week old. Pricing decisions were being made on assumed margins rather than measured ones, and marketing spend was being allocated by gut.'],
    solution: ['Calon AI built a live commercial reporting dashboard pulling quote, job and invoice data into a single director-level view. Margin per job type, conversion rate by lead source and weighted pipeline value all update in real time.', 'Average job value trends across rolling 30, 60 and 90-day windows. A director-only KPI summary lands every Monday morning. The director moved from monthly intuition to daily measurement.'],
    results: ['4 hours per week of office manager reporting time eliminated', 'Margin per quote visible at point of decision, not weeks later', 'Marketing spend rebalanced based on margin-by-source data', 'Director time on the business (rather than in it) materially increased', 'Foundation in place for further automation on quote pricing'],
    quote: 'I was making decisions on a spreadsheet that was always out of date. Now the dashboard tells me what is happening today, and my marketing spend goes where the margin actually is.', qa: 'UK Heating Business'
  },
  {
    slug: 'training-provider-ops-dashboard',
    name: 'UK Construction Training Provider — Centralised Admin & Operations Dashboard',
    subtitle: 'Cohort tracking and funding claims were spread across seven spreadsheets owned by different team members. We unified everything into a single MD-level view.',
    industry: 'Construction Training', service: 'Operations Dashboard Automation', client: 'UK Construction Training Provider', named: false,
    stats: [{ n: '6 hrs/wk', l: 'admin reconciliation eliminated' }, { n: '7–10 days', l: 'faster funding claim cycle' }, { n: '1 view', l: 'replacing 7 spreadsheets' }],
    overview: 'A UK construction training and qualifications provider working across multiple cohorts, funders and tutors. The team had grown into the systems they had, and the systems had stopped scaling.',
    challenge: ['Cohort tracking, funding claims, learner status and tutor allocations were all held in separate spreadsheets owned by different members of the admin team. When the MD asked "where are we", the answer was a 90-minute exercise.', 'An estimated 6 hours per week of admin time was being spent reconciling spreadsheets across the team. Decisions about resourcing, cohort sizing and funding draw-down were being delayed because the underlying data was never current.'],
    solution: ['Calon AI built a centralised admin and operations dashboard consolidating every live cohort, learner, document gap, funding milestone and tutor allocation into a single MD-level view, with role-specific drill-downs for each admin team member.', 'The MD now opens one screen instead of seven. Risk flags appear the day they happen, not the week the spreadsheet is updated.'],
    results: ['6 hours per week of admin time on spreadsheet reconciliation eliminated', 'Cohort risk visible in real time, not at end of month', 'Funding claim cycle accelerated by an estimated 7 to 10 days on average', 'Tutor utilisation visible 12 weeks ahead, supporting resourcing decisions', 'MD-level visibility shifted from monthly to live'],
    quote: 'My team had seven spreadsheets and no two of them agreed with each other. Now there is one screen, one source of truth, and we close out funding claims faster than ever.', qa: 'UK Construction Training Provider'
  },
  {
    slug: 'renewables-partner-platform',
    name: 'UK Renewables Installer — Partner Network Platform',
    subtitle: 'Leads were being distributed to regional partners by WhatsApp and forgotten about. We built the partner platform that put SLAs, visibility and revenue share on a single rail.',
    industry: 'Renewables & Solar', service: 'Partner Network Automation', client: 'UK Renewables Installer', named: false,
    stats: [{ n: '48 → <4 hrs', l: 'partner first-response time' }, { n: '35%', l: 'uplift in network-wide conversion' }, { n: 'Zero', l: 'manual revenue-share reconciliation' }],
    overview: 'A UK renewable energy installer working with a network of regional partner installers across solar and battery storage. Central marketing was generating leads. Partner conversion was a mystery.',
    challenge: ['The lead installer was generating leads centrally and distributing them to regional partners by email and WhatsApp. There was no visibility on what each partner did with the lead.', 'An estimated 30 percent of distributed leads were not being followed up within 48 hours by the receiving partner. Lead-share revenue was being undercounted because there was no shared record of outcomes. The central team was repeatedly resending leads that had already been actioned.'],
    solution: ['Calon AI built a partner platform that distributes leads to regional installers with a defined SLA, tracks every status update against the lead, and gives both the central team and the partner full visibility on conversion, value and revenue share.', 'Partner-side workspaces handle quoting, scheduling and outcome recording. Revenue-share reconciliation runs automatically at month end.'],
    results: ['Partner first-response time reduced from an estimated 48 hours to under 4 hours', 'Lead-to-quote conversion across the partner network up an estimated 35 percent', 'Revenue-share reconciliation effort reduced to near zero', 'Central team focus shifted from chasing partners to onboarding new ones', 'Foundation in place for white-label productisation of the platform'],
    quote: 'My partners were sitting on leads for days and we had no idea. Now everyone is on the same rail, response times are tight, and the revenue share reconciles itself.', qa: 'UK Renewables Installer'
  },
  {
    slug: 'renewables-quote-pipeline',
    name: 'UK Solar Installer — AI Quote & Sales Pipeline Workflow',
    subtitle: 'A single estimator was bottlenecking the entire business. Quotes took five to seven days while competitors quoted same-day. We rebuilt the workflow around a configurable pricing engine.',
    industry: 'Renewables & Solar', service: 'Quote Generation Automation', client: 'UK Solar Installer', named: false,
    stats: [{ n: '5–7 days → same day', l: 'quote turnaround' }, { n: '6–8 pts', l: 'uplift in close rate' }, { n: '5+ hrs/wk', l: 'estimator overtime eliminated' }],
    overview: 'A UK solar and battery installer with a strong reputation but a quoting bottleneck. The estimator was working evenings and weekends, and customers were drifting to faster competitors before the quote even arrived.',
    challenge: ['Quotes were being produced in a long-form PDF by a single estimator who became the bottleneck for the entire business. Customers waited 5 to 7 days for a quote.', 'Close rate had drifted to around 22 percent, well below the team\u2019s historical baseline. The estimator was working evenings and weekends to keep up and was considering leaving.'],
    solution: ['Calon AI built a guided quoting workflow that captures the customer brief once at first contact, generates a fully costed proposal against a configurable pricing engine, and delivers it to the customer within hours.', 'Live margin floors and director-approval thresholds keep pricing disciplined. The estimator\u2019s role shifted from producing quotes to reviewing edge cases.'],
    results: ['Quote turnaround reduced from 5 to 7 days to same-day for standard configurations', 'Close rate uplift of an estimated 6 to 8 percentage points', 'Estimator workload reduced from 5+ extra hours per week to zero', 'Pricing decisions now traceable, auditable and consistent', 'Pipeline visibility moved from spreadsheet to live dashboard'],
    quote: 'My estimator was about to quit and we were losing deals to slower companies that just happened to quote first. Now we quote same-day with proper margin discipline and our close rate is back where it should be.', qa: 'UK Solar Installer'
  },
  {
    slug: 'renewables-white-label-platform',
    name: 'UK Renewables Sector — White-Label Platform Productisation',
    subtitle: 'An internal operational platform had crossed the threshold from "tool" to "potential product". We built the architecture that turned it into recurring revenue.',
    industry: 'Renewables & Solar', service: 'SaaS Productisation', client: 'UK Renewables Installer', named: false,
    stats: [{ n: '3 partners', l: 'onboarded in first 4 months' }, { n: '£15k–£25k', l: 'ARR per reseller' }, { n: 'New', l: 'recurring revenue line on the P&L' }],
    overview: 'A UK renewables installer had built a strong internal operational platform for itself. Several regional installers had asked to use it. The answer had been "we don\u2019t know how to do that yet."',
    challenge: ['At least three identified reseller opportunities were sitting unactioned. Each represented an estimated £15,000 to £25,000 of annual recurring revenue.', 'The internal platform had crossed the threshold from tool to potential product, but had not been productised. The original installer business was at risk of disruption if the architecture was rushed.'],
    solution: ['Calon AI built a two-track commercialisation pathway that keeps the internal platform stable for its primary user while spinning out a tenant-isolated, brandable version for resellers.', 'Reseller deployments share the engine but maintain their own data, branding, pricing rules and user accounts. Centralised platform updates propagate to all tenants without breaking customisation.'],
    results: ['3 reseller partners onboarded in the first 4 months', 'Annual recurring revenue from the platform now a meaningful line on the P&L', 'Internal team workload increased only modestly per added tenant', 'Foundation in place for further commercialisation across the sector', 'Original installer business operationally unaffected by reseller traffic'],
    quote: 'We had built something other installers kept asking to use, and we had no idea how to sell it to them. Calon AI gave us the architecture and now the platform is its own revenue line.', qa: 'UK Renewables Installer'
  },
  {
    slug: 'fire-security-enquiry-ai',
    name: 'UK Fire & Security Business — AI Enquiry Handling & Response Workflow',
    subtitle: 'One in five enquiries was getting no response within 48 hours. Competitors were responding within the hour. We built the AI workflow that closed the gap.',
    industry: 'Fire & Security', service: 'Enquiry Response Automation', client: 'UK Fire & Security Business', named: false,
    stats: [{ n: '24–48 → <30 min', l: 'first-response time' }, { n: '100%', l: 'enquiry coverage across all channels' }, { n: '30–45%', l: 'uplift in enquiry-to-call conversion' }],
    overview: 'A UK fire and security business with strong word-of-mouth but a leaky enquiry handling process. Multiple channels, no clear ownership, and enquiries going cold while the team was on site.',
    challenge: ['Enquiries were arriving across the website contact form, the main info inbox and a sales mobile number. No one owned the inbox during busy periods. Competitors were responding within the hour.', 'An estimated 1 in 5 enquiries received no response within 48 hours. At an average enquiry value of around £1,800, missed and slow-response enquiries represented an estimated £12,000 to £18,000 per month of pipeline leakage.'],
    solution: ['Calon AI built an AI-assisted enquiry handling workflow that monitors all enquiry sources, drafts a contextual first response within minutes, routes the enquiry to the right team member based on type and value, and surfaces any enquiry not responded to within a defined SLA.', 'A human review-and-send model preserves voice and judgement. The AI handles the first draft, not the relationship.'],
    results: ['First-response time reduced from 24 to 48 hours down to under 30 minutes', '100 percent enquiry coverage across all channels, no silent drops', 'Estimated 30 to 45 percent uplift in enquiry-to-booked-call conversion', 'Team workload reduced because the AI handles the first draft, not the relationship', 'Director-level visibility on enquiry volume and response performance'],
    quote: 'We were losing business to faster competitors and we did not even know it was happening. Now every enquiry gets a response inside thirty minutes and the team is calmer because the AI has the first draft ready.', qa: 'UK Fire & Security Business'
  },
  {
    slug: 'smart-security-mvp',
    name: 'UK Smart Security Firm — Enquiry-to-Job Workflow MVP',
    subtitle: 'The founders had a clear vision but no working system to back it. We built a 7-screen MVP in three weeks that unlocked their investor and franchisee conversations.',
    industry: 'Smart Security & IoT', service: 'Workflow MVP Build', client: 'UK Smart Security Firm', named: false,
    stats: [{ n: '3 weeks', l: 'MVP delivered against fixed scope' }, { n: '7 screens', l: 'covering enquiry to job sign-off' }, { n: '10+ hrs/wk', l: 'founder time recovered per person' }],
    overview: 'A UK smart security firm operating in domestic and small commercial markets. The founders had a clear vision for an end-to-end digital workflow, but everything was still living in WhatsApp and a notes app.',
    challenge: ['Every quote, job and engineer assignment was being held together by founder attention. The founders estimated 10+ hours per week per founder was being spent on operational admin that should have been systemised.', 'More importantly, the lack of a working prototype was blocking conversations with investors and prospective franchisees. The vision was strong, but there was nothing to show.'],
    solution: ['Calon AI built a 7-screen MVP that takes a customer from enquiry through quote, scheduling, engineer assignment, on-site work and sign-off. Deliberately scoped tight to validate the workflow, not to be a finished product.', 'Built in three weeks against a fixed scope and price. The founders had something working to show investors and franchisees within a month of starting.'],
    results: ['MVP delivered in 3 weeks against fixed scope and price', '7 core screens covering the full enquiry-to-job workflow', '10+ hours per week per founder returned to growth work', 'Investor and franchisee conversations now backed by a live, demonstrable system', 'Foundation for a productised platform if growth conversations succeed'],
    quote: 'We had spent months trying to explain what we were building. Calon AI gave us something to show in three weeks and our investor conversations changed overnight.', qa: 'UK Smart Security Firm'
  },
  {
    slug: 'health-safety-training-automation',
    name: 'UK Health & Safety Training Provider — Sales & Onboarding Automation',
    subtitle: 'The whole business was capped by the owner\u2019s calendar. We built the sales and onboarding automation that let the business run even when he was teaching.',
    industry: 'Health & Safety Training', service: 'Sales & Onboarding Automation', client: 'UK Health & Safety Training Provider', named: false,
    stats: [{ n: '5–7 hrs/wk', l: 'owner time recovered' }, { n: '25%', l: 'uplift in quote-to-book conversion' }, { n: '40%', l: 'faster enrolment processing' }],
    overview: 'A UK health and safety training provider delivering accredited courses to trade businesses and individual learners. Strong demand, but the owner was the bottleneck for every step from enquiry to enrolment.',
    challenge: ['Course enquiries were coming in steadily, but every step from first contact to learner enrolment was being handled manually by the owner. Quote-to-book conversion was strong when the owner had time, weak when he didn\u2019t.', 'The business was capped by his calendar. An estimated 5 to 7 hours per week of owner time was being spent on enquiries that a systemised workflow could handle without him.'],
    solution: ['Calon AI built a GoHighLevel-based sales and onboarding automation handling enquiry capture, automated nurturing, booking, payment and learner onboarding without the owner needing to be the bottleneck.', 'The owner now intervenes only on complex commercial enquiries. Pre-course materials and induction scheduling run automatically once a learner books.'],
    results: ['5 to 7 hours per week of owner time returned', 'Quote-to-book conversion stabilised and lifted by an estimated 25 percent', 'Enrolment processing time reduced by approximately 40 percent', 'Owner now intervenes on commercial decisions only, not admin', 'Foundation in place for a second trainer or franchise model'],
    quote: 'When I was teaching, the business was effectively closed. Calon AI built me a system that keeps it running whether I am in front of a class or not. I finally feel like I own a business, not a calendar.', qa: 'UK Health & Safety Training Provider'
  }
];

export function getBySlug(slug) {
  return STUDIES.find(s => s.slug === slug) || STUDIES[0];
}

export function getRelated(slug, count = 3) {
  const current = getBySlug(slug);
  const sameSector = STUDIES.filter(s => s.slug !== current.slug && s.industry === current.industry);
  const others = STUDIES.filter(s => s.slug !== current.slug && s.industry !== current.industry);
  return [...sameSector, ...others].slice(0, count);
}
