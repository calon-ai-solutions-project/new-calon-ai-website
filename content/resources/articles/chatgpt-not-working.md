---
title: ChatGPT Not Working? How to Fix the Most Common Errors
seoTitle: ChatGPT Not Working? How to Fix Common Errors (2026) | Calon AI
description: Fix "Something went wrong", network errors, login loops and slow or missing replies in ChatGPT. Step-by-step checks in the order most likely to work.
category: chatgpt-guides
kind: Troubleshooting
tags: [ChatGPT, Troubleshooting, Errors, OpenAI]
date: 2026-11-13
author: calon-team
featured: true
trending: true
coverAlt: A ChatGPT-style chat window showing a "Something went wrong" error with a troubleshooting checklist beside it
related: [how-to-use-chatgpt, claude-errors-fixes, prompt-engineering-guide]
takeaways:
  - Check status.openai.com first. If there is an outage, nothing on your side will fix it.
  - Most "Something went wrong" and network errors come from the connection, a VPN, a browser extension or a stale login session.
  - Work through the fixes in order: refresh, new chat, log out and in, different network, private window, different browser or the app.
  - Very long chats can slow down or fail. Start a new chat and paste in a short summary to carry on.
sources:
  - OpenAI Help Center: Finding and fixing ChatGPT errors | https://help.openai.com/en/articles/7996703-finding-and-fixing-chatgpt-errors
  - OpenAI system status | https://status.openai.com
  - OpenAI Help Center: ChatGPT capabilities overview | https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview
faq:
  - q: Why does ChatGPT keep saying "Something went wrong"?
    a: It is a general error. OpenAI says it can come from a temporary problem on their servers or from your own setup. Refresh, start a new chat and check status.openai.com. If it keeps happening, turn off any VPN, try a different network and log out and back in.
  - q: Is ChatGPT down right now?
    a: Check status.openai.com, which is OpenAI's official status page. Status pages can take a few minutes to catch up, so if lots of people are reporting problems at once it may be an outage that has not been posted yet.
  - q: Will logging out of ChatGPT delete my chats?
    a: No. Your conversation history is stored in your account, not in the browser, so logging out and back in does not remove it.
  - q: Why does ChatGPT not work on my work network?
    a: Some company and school networks block AI services or interfere with the connection ChatGPT uses. Try your phone's mobile data. If that works, ask your IT team whether ChatGPT is allowed.
---

> **Quick answer:** First check [status.openai.com](https://status.openai.com). If ChatGPT is up, refresh the page and start a new chat. Still broken? Turn off your VPN, log out and back in, then try a different network, a private window or the ChatGPT app. Those steps fix the large majority of "Something went wrong" and network errors.

ChatGPT errors are frustrating because the messages rarely tell you what is actually wrong. The good news is that most problems fall into a handful of causes, and you can rule them out in a few minutes. This guide walks through the fixes in the order most likely to work, then explains the specific error messages you might see.

## Step 1: Check whether ChatGPT is down

Before changing anything on your side, open [status.openai.com](https://status.openai.com). It shows live incidents for ChatGPT, the API and other OpenAI services.

- **If there is an incident** for ChatGPT, wait. Nothing you do locally will fix a server-side outage. Keep a copy of anything important you were writing.
- **If everything is green** but ChatGPT still fails, the cause is probably on your side or limited to your account. Carry on with the steps below.

Status pages are updated by people, so a brand-new outage can take a few minutes to appear. If a colleague on a different network has the same problem at the same moment, treat it as an outage.

## Step 2: Refresh and start a new chat

It sounds too simple, but it works more often than anything else.

1. Refresh the page (Ctrl+R on Windows, Cmd+R on Mac).
2. Click **New chat** and try a short message such as "Hello".
3. If the new chat works, the problem was that particular conversation.

Very long conversations are a common culprit. Every reply has to take the earlier conversation into account, so a chat with hours of back-and-forth, large pasted documents or many file uploads can become slow or fail. If you need the context, ask ChatGPT in the old chat for a short summary (or write one yourself), then paste that into a fresh chat.

## Step 3: Turn off your VPN or proxy

OpenAI's own troubleshooting advice lists VPNs and secure DNS tools as a common cause of errors. Shared VPN addresses can be flagged by bot protection, and some VPNs drop the long-lived connection ChatGPT uses to stream replies.

Turn the VPN off, refresh and try again. If you must use a VPN for work, try a different server location.

## Step 4: Log out and log back in

A stale or corrupted login session causes login loops, repeated "Something went wrong" messages and chats that will not load.

1. Click your profile picture and choose **Log out**.
2. Close every ChatGPT tab.
3. Wait a minute, then sign in again.

Logging out does not delete your chats. Your history is stored in your account.

## Step 5: Try a different network

"A network error occurred" and similar connection messages usually mean your device cannot keep a reliable connection to OpenAI's servers. The quickest test is to switch networks: turn off Wi-Fi on your phone and use mobile data, or tether your laptop to your phone.

- **Works on mobile data but not on the office network?** Your company firewall or web filter may block or interfere with ChatGPT. Ask IT whether it is permitted.
- **Fails everywhere?** Move on to the browser checks.

## Step 6: Rule out browser extensions and cache

Ad blockers, privacy extensions, script blockers and some password managers can break the ChatGPT interface.

1. Open a private or incognito window and sign in there. Extensions are usually disabled in private windows.
2. If ChatGPT works in private mode, disable your extensions one at a time in the normal window to find the culprit.
3. If it still fails, clear the cache and cookies for chatgpt.com and sign in again.

## Step 7: Try another browser or the app

If one browser fails, try another (Chrome, Edge, Safari or Firefox) or the official ChatGPT app for desktop, iPhone or Android. This separates "my browser setup is broken" from "my account or network is the problem". On mobile, OpenAI recommends relaunching the app first and reinstalling it if crashes continue.

## Step 8: Check your date, time and device

Secure connections depend on your device clock. If your computer's date or time is wrong, sign-in and connection errors can follow. Set the clock to update automatically, restart the device and make sure your browser is up to date.

## What specific ChatGPT error messages mean

| Error message | Most likely cause | What to try |
|---|---|---|
| "Something went wrong" | General error: server issue or local setup | Refresh, new chat, check status page, turn off VPN |
| "A network error occurred" | Unstable connection or a long reply timing out | Different network, shorter request, new chat |
| "Error in message stream" | The reply was interrupted mid-stream | Click regenerate, then try a new chat |
| Login loops or "Too many redirects" | Stale session or blocked cookies | Log out everywhere, clear cookies for the site, allow cookies |
| Usage or message cap messages | You have reached your plan's limit for a model or feature | Wait for the reset time shown, or switch model |
| File upload fails | File too large, unsupported type or an extension blocking it | Smaller file, different format, private window |

Plan limits and the exact wording of messages change over time. If you see a message that is not listed here, OpenAI's [error troubleshooting article](https://help.openai.com/en/articles/7996703-finding-and-fixing-chatgpt-errors) is the most reliable reference.

## When ChatGPT works but the answers are poor

Sometimes ChatGPT "works" but does not do what you need: it ignores instructions, invents details or gives generic answers. That is a different problem with different fixes:

- **Be specific about the task, audience and format.** Our [prompt writing guide](/resources/prompt-engineering-guide) shows a simple structure that fixes most vague answers.
- **Give it the source material.** Paste the document or data rather than asking it to recall facts.
- **Ask it to check itself.** "List any claims in your answer that you are not certain about" is a useful follow-up.
- **Verify anything important.** AI assistants can state wrong information confidently, so check figures, quotes and legal or financial points against the original source.

## When to contact OpenAI support

If you have worked through every step, the status page is clear and the problem follows you across networks, browsers and devices, it is probably account-specific (for example a billing or verification issue). Use the help widget at [help.openai.com](https://help.openai.com) and include the exact error text, what you have already tried and roughly when it started.

## Making ChatGPT part of your business processes

If ChatGPT is becoming important to how your team works, an outage or a change in plan limits can stop work. Businesses that rely on AI day to day usually move the important tasks into proper workflows: connected to their CRM and inbox, using the API with error handling and a fallback model. That is the kind of system we build at Calon AI. See how an [AI enquiry-handling workflow](/work/fire-security-enquiry-ai) cut first-response time from 24 to 48 hours down to under 30 minutes for a fire and security business.
