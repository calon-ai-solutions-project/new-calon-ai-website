---
title: "Claude Fable 5.2 and Mythos 5.2: What Anthropic Announced and What It Means"
seoTitle: "Claude Fable 5.2 & Mythos 5.2: What's New and Pricing | Calon AI"
description: Anthropic released Claude Fable 5.2 and Mythos 5.2 on 9 November 2026. What changed, who can use each model, API pricing and what it means for businesses.
category: ai-news
kind: News analysis
tags: [Anthropic, Claude, AI news, Claude Fable, Claude Mythos, AI models]
date: 2026-11-13
author: calon-team
featured: false
editorsPick: false
trending: true
coverAlt: A news-style graphic announcing Claude Fable 5.2 and Claude Mythos 5.2 with a release date of 9 November 2026
related: [how-to-use-claude, claude-code-getting-started, claude-vs-chatgpt]
takeaways:
  - "On 9 November 2026 Anthropic released Claude Fable 5.2, available to everyone, and Claude Mythos 5.2, the same model without some safeguards and restricted to vetted organisations."
  - Anthropic says outputs are up to 30% faster than the 5.1 versions. API pricing is $8 per million input tokens and $40 per million output tokens.
  - Anthropic still recommends Claude Opus 5.5 as the default everyday model, with Fable for the most demanding work.
  - For most businesses this changes little day to day. It matters most for complex coding, research and long-running agent tasks.
sources:
  - "Anthropic: Introducing Claude Fable 5.2 and Claude Mythos 5.2 (9 November 2026) | https://www.anthropic.com/claude-fable-and-mythos-5-2"
  - "Anthropic: Introducing Claude Haiku 5.5 (7 October 2026) | https://www.anthropic.com/claude-haiku-5-5"
  - Anthropic newsroom | https://www.anthropic.com/news
  - Claude plans and pricing | https://claude.com/pricing
faq:
  - q: What is the difference between Claude Fable 5.2 and Claude Mythos 5.2?
    a: Anthropic describes them as the same underlying model. Fable 5.2 includes strong safeguards against misuse in cybersecurity and biology and is available to all users. Mythos 5.2 does not have those safeguards, so access is limited to vetted organisations through Anthropic's Cyber Verification and Life Sciences Verification programmes.
  - q: Can I use Claude Fable 5.2 on a Claude Pro plan?
    a: According to Anthropic's announcement, Fable is included for up to 50% of weekly usage limits on Pro plans and standard Team seats. The pricing page also lists Fable via usage credits on Pro and included on Max. Check claude.com/pricing for the current terms.
  - q: How much does Claude Fable 5.2 cost on the API?
    a: Anthropic lists $8 per million input tokens and $40 per million output tokens. An optional fast mode, which Anthropic says speeds up generation by up to 2.5 times, costs $16 per million input tokens and $80 per million output tokens.
  - q: Should my business switch to Claude Fable 5.2?
    a: Not automatically. Anthropic itself recommends Opus 5.5 as the default daily model. Fable is worth testing for your hardest tasks, such as complex coding or long research, where better results justify the higher cost.
---

> **In short:** On **9 November 2026**, Anthropic announced **Claude Fable 5.2** and **Claude Mythos 5.2**. Fable 5.2 is available to everyone, with safeguards against cybersecurity and biology misuse. Mythos 5.2 is the same model without those safeguards and is limited to vetted security and life-sciences organisations. Anthropic reports faster output and higher benchmark scores than the 5.1 versions. For most businesses, Opus 5.5 remains the recommended everyday model.

*This article is based on Anthropic's [official announcement](https://www.anthropic.com/claude-fable-and-mythos-5-2). Benchmark results are Anthropic's own reported figures and have not been independently verified by us.*

## What was announced

Anthropic released upgrades to its two most capable models, which it says are built for the most demanding technical work:

- **Claude Fable 5.2:** available on all Claude platforms and through the API (model ID `claude-fable-5-2`), including via Amazon Web Services, Google Cloud and Microsoft Azure. It includes strong safeguards designed to block high-risk cybersecurity and biology requests.
- **Claude Mythos 5.2:** the same underlying model without those safeguards. Because of the misuse risk in those dual-use areas, it is only available to cybersecurity professionals through Anthropic's Cyber Verification Program and life-sciences researchers through its Life Sciences Verification Program. Claude Enterprise customers can also use Claude Security, which runs on Mythos 5.2.

## What is new, according to Anthropic

### Speed and efficiency

- Outputs are **up to 30% faster** than Fable 5.1 and Mythos 5.1.
- Fable 5.2 uses **fewer tokens** than Fable 5.1 at Medium effort, which affects cost.
- An optional **fast mode** speeds up generation by up to 2.5 times at a higher price.

### Reported benchmark results

| Benchmark (as reported by Anthropic) | Result |
|---|---|
| FrontierCode 2.0, Fable 5.2 at Xhigh effort | 49.1%, which Anthropic says is the highest of any released model it tested |
| FrontierCode 2.0, Fable 5.2 at High effort | 45.3%, against 45.5% for Opus 5.5 at about half the cost per task |
| Humanity's Last Exam (with tools) | 74.2% |
| CVE Rediscovery (internal), Mythos 5.2 | 10.2% more vulnerabilities found than Opus 5.5 |

Vendor benchmarks are useful signals, but they rarely match your own workload exactly. Test on your real tasks before drawing conclusions.

### Safety measures

Anthropic reports that blocked high-risk requests now fall back to other models rather than simply failing, with about 55% fewer blocks than Fable 5.1. It also reports pre-release testing by the UK AI Security Institute and METR, and an alignment assessment that rates the risk of high-stakes misaligned behaviour as low. Anthropic notes the model sometimes says it suspects it is being evaluated, which makes evaluations harder to interpret.

## Pricing and availability

| | Price per million tokens |
|---|---|
| Standard input | $8 |
| Standard output | $40 |
| Fast mode input | $16 |
| Fast mode output | $80 |

For subscribers, Anthropic says Fable is included for up to 50% of weekly usage limits on Pro plans and standard Team seats, and eligible paid plans received extra Fable usage in launch week. The [Claude pricing page](https://claude.com/pricing) lists Fable on Pro via usage credits and included on Max, so check there for how it applies to your plan.

## How it fits with the rest of the Claude line-up

Anthropic's current models, from its announcements and pricing page:

- **Fable and Mythos 5.2:** the most capable, for the most ambitious work.
- **Opus 5.5:** Anthropic's recommended default for everyday work.
- **Sonnet 5.5:** a balance of capability and cost.
- **Haiku 5.5:** released on 7 October 2026 for high-volume, cost-sensitive tasks such as classification and summaries. Anthropic lists API prices from $0.10 per million input tokens and $0.50 per million output tokens for prompts up to 100,000 tokens.

## What it means for businesses

- **Everyday chat users:** little changes. Opus 5.5 remains the recommended default, and Fable is there when you hit a genuinely hard problem.
- **Software teams:** worth testing Fable 5.2 in [Claude Code](/resources/claude-code-getting-started) on complex, multi-file work, and comparing the cost per completed task, not just the price per token.
- **Automation and AI agents:** the most capable model is rarely the right one for every step. Most automated workflows run best with fast, cheap models such as Haiku 5.5 for routine steps, and a more capable model only where judgement is needed.
- **Security teams:** if your organisation does defensive security work, Anthropic's Cyber Verification Program is the route to Mythos 5.2.

## Our take

Model releases now arrive every few weeks from Anthropic, OpenAI and Google. Chasing every release is rarely worth it. A better approach is to design your AI systems so the model behind each step can be swapped and tested easily, then upgrade when a new model clearly improves your results or cuts your costs. That is how we build systems at Calon AI. If you want help choosing models for a real workflow, [talk to our team](/contact).

*Published 13 November 2026. We will update this article if Anthropic changes availability or pricing.*
