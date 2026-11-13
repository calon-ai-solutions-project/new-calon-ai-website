---
title: How to Write Better AI Prompts: A Practical Guide with Templates
seoTitle: How to Write Better AI Prompts (Templates & Examples) | Calon AI
description: A practical prompt guide for ChatGPT, Claude and Gemini: a simple five-part structure, before-and-after examples and copy-ready business templates.
category: chatgpt-guides
kind: Tutorial
tags: [Prompt engineering, ChatGPT, Claude, Productivity]
date: 2026-11-13
author: calon-team
editorsPick: true
coverAlt: A prompt being built from five labelled blocks: role, context, task, constraints and format
related: [how-to-use-chatgpt, how-to-use-claude, claude-vs-chatgpt]
takeaways:
  - A good prompt has five parts. Context, task, source material, constraints and output format.
  - Give examples of what good looks like. One example is often worth a paragraph of instructions.
  - Ask the model to work in steps and to say when it is unsure. It reduces confident mistakes.
  - Save prompts that work as templates and reuse them, ideally in a Project or custom GPT.
sources:
  - Anthropic documentation: Prompt engineering overview | https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview
  - OpenAI Help Center: ChatGPT capabilities overview | https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview
faq:
  - q: What is prompt engineering?
    a: It is the practice of writing instructions to an AI model so that it reliably produces the output you want. For most business users that simply means giving clear context, a specific task, the right source material and a defined format.
  - q: Do prompts work the same in ChatGPT, Claude and Gemini?
    a: The same principles work across all of them. Each model has its own strengths and quirks, so test an important prompt in the tool you will actually use, but a well-structured prompt transfers well.
  - q: How long should a prompt be?
    a: As long as it needs to be. A one-line question is fine for simple tasks. For anything you want done to a standard, a structured prompt of 100 to 300 words plus the source material usually beats a short one.
---

> **Quick answer:** Tell the AI who it is helping and why (context), exactly what to produce (task), what to base it on (source material), the rules to follow (constraints) and how to lay out the answer (format). Add an example of a good result if you have one. Those five parts fix most generic or off-target answers.

The difference between a useless AI answer and a brilliant one is usually the request, not the model. You do not need technical knowledge to write good prompts. You need to give the AI the same information you would give a capable new colleague on their first day.

## The five-part prompt structure

### 1. Context: who, what and why

Explain the situation. Who are you, who is the output for and what is it for?

*"I run the office for a 14-person solar installation company in South Wales. This email goes to homeowners who requested a quote but have not replied in three weeks."*

### 2. Task: the specific job

Use a clear verb and a defined deliverable. "Help with" is vague; "write", "summarise", "compare", "extract", "rewrite" and "list" are not.

*"Write a short follow-up email."*

### 3. Source material: what to work from

Paste the relevant text or upload the file. AI assistants are far more accurate when they work from material you provide than when they rely on general knowledge. Put long material in clearly marked sections:

```text
<quote_details>
...paste here...
</quote_details>
```

Labels like that help the model keep instructions and material separate. Anthropic's prompting documentation recommends this kind of structure for longer prompts.

### 4. Constraints: the rules

Length, tone, things to include and things to avoid.

*"Under 120 words. Friendly but not pushy. Mention the 0% VAT on residential solar. Do not offer a discount. UK spelling."*

### 5. Format: how the answer should look

*"Give me a subject line, then the email body. Then two alternative subject lines."*

## Before and after

**Before:**

```text
Write a follow-up email for a solar quote.
```

**After:**

```text
I manage the office for a 14-person solar installer in South
Wales. Write a follow-up email to a homeowner who requested a
quote three weeks ago and has not replied.

Quote details:
- 4.2 kWp system with 5 kWh battery
- Quoted £8,950, valid until 30 November

Rules: under 120 words, friendly and not pushy, UK spelling,
no discounts, end with a simple yes/no question.

Format: subject line, then email body, then two alternative
subject lines.
```

The second version takes 60 seconds longer to write and saves several rounds of editing.

## Techniques that make a real difference

### Show an example of good output

If you have a previous email, report or description you liked, include it and say "match the style and length of this example". Examples communicate tone and structure more precisely than adjectives like "professional" or "punchy".

### Ask it to think in steps

For analysis, ask the model to work through the problem before giving a conclusion: "First list the relevant figures, then calculate the margin, then give your recommendation." Modern models reason well, but asking for the steps makes their working visible so you can spot errors.

### Give it permission to say "I don't know"

Add: *"If the information is not in the material I provided, say so instead of guessing."* This one line noticeably reduces made-up answers when you are working from documents.

### Ask for options, then choose

"Give me three versions: one formal, one friendly, one very short." Choosing between options is faster than describing what is wrong with a single draft.

### Iterate in the same chat

Treat the first answer as a draft. Follow up with specific edits: "Shorter", "Remove the second paragraph", "Make the call to action clearer". The model keeps the context, so small instructions go a long way.

### Ask it to critique its own work

"Review your answer against my rules and list anything you missed." This catches ignored constraints, such as word limits, surprisingly often.

## Copy-ready templates for business tasks

**Summarise a document**

```text
Summarise the attached [document type] for [audience].
Focus on: [what matters, e.g. costs, deadlines, risks].
Format: 5 bullet points, then a one-line recommendation.
Quote the exact wording for any figures or deadlines.
If something important is unclear, list it as an open question.
```

**Reply to a customer**

```text
Context: [your business, your role].
Customer message: <message>...</message>
Our position: [what you can and cannot offer].
Write a reply that [goal, e.g. keeps the customer, sets a new date].
Tone: [tone]. Length: under [N] words. UK spelling.
```

**Turn notes into actions**

```text
From the meeting notes below, list every decision and action.
Table columns: Action | Owner | Deadline | Notes.
If an owner or deadline was not stated, write "Not agreed".
<notes>...</notes>
```

**Compare options**

```text
I need to choose between [A], [B] and [C] for [purpose].
Our situation: [team size, budget, tools we already use].
Compare them on: cost, ease of setup, integrations with [tools],
and limits. Use a table, then recommend one and explain why.
Flag anything I should verify on the vendor's website.
```

## Save and reuse what works

When a prompt reliably gives good results, save it. In ChatGPT, put it in a **Project** or build a **custom GPT**. In Claude, add it to a **Project's instructions**. A shared library of team prompts is one of the cheapest productivity improvements a small business can make.

## When prompts are not enough

Prompting improves individual tasks. If you find yourself running the same prompt dozens of times a week, copying data in and out of other systems, the next step is automation: a workflow that pulls the data, runs the AI step and pushes the result back into your CRM, inbox or spreadsheet without anyone pasting anything. Read [how to automate repetitive business tasks](/resources/automate-repetitive-business-tasks) to see how that works.
