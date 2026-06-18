# Brand guidelines overview

_Started 2026-06-17 17:58 UTC_

---

## User

Brand. Use the attached logo and brand colours. Dark navy background (#0A1428), white text, cyan accents (#7EC4F0). Keep it white text on dark navy throughout. Match the typography feel of the logo screenshot.
Content. Use the full landing page plan I've shared in this conversation, all 12 sections, exact copy, do not rewrite anything. Casual tone in case studies and testimonials. Auto-scrolling carousels for both.
Header navigation. Logo top left (logo clicks back to home, no separate Home button). Centre: Who We Help · Proof · About Us. Right: Start the conversation CTA button in cyan.
Under the logo. Rotating strapline cycles every second on infinite loop. Three states fading in and out: We integrate. → We don't force. → We adapt at every step.

Style. Calm, confident, founder-led. Generous dark space. Mobile-first responsive. Subtle fade-and-lift on scroll. Nothing flashy.
Do not use AI agency cliches. No robots, no neural meshes, no glowing particles, no rainbow gradients, no wireframe meshes behind text. No em dashes anywhere in the copy.

## Assistant

Let me look at the brand assets and design system first.

_[tool: view_image]_

_[tool: view_image]_

_[tool: list_files]_

_[tool: image_metadata]_

Design system is empty, but the brief is fully specified (brand, copy, nav, animations). I'll copy the logo in and build the full landing page as a single streaming Design Component.

_[tool: copy_files]_

_[tool: update_todos]_

_[tool: set_project_title]_

_[tool: dc_write]_

## User

Address these comments from my teammates:

**Mahbubul** (on `Calon Landing.dc.html` at `#top >section:nth-child(2)`):
<teammate-comment>in here should be thsoe 1 sec line we dont force etc one in smell like you know modern website donse no tin header</teammate-comment>

## User

Copy and paste this:

Replace the current "How It Works" section in this design (the 6-card 2x3 grid shown in the screenshot) with the HTML in the attached file. Keep everything else on the page exactly as it is. Make sure the new vertical journey timeline flows visually with the sections above and below it on both desktop and mobile, and inherits the same fonts and brand colours as the rest of the page.

## Assistant

Let me check the current state of the file, since my earlier write was interrupted.

_[tool: list_files]_

_[tool: read_file]_

The full landing page is intact. Two things to do: (1) Mahbubul's note — move the rotating strapline up under the logo in the header (1-second cadence) and drop the separate band; (2) replace the 6-card grid with the attached vertical timeline, adapted to the page's fonts and brand palette.

_[tool: dc_html_str_replace]_

Now the header logo + strapline:

_[tool: dc_html_str_replace]_

Now remove the separate strapline band section:

_[tool: dc_html_str_replace]_

Now replace the 6-card grid with the timeline:

_[tool: dc_html_str_replace]_

Now wire up the scroll-reveal and progress line in the logic class:

_[tool: dc_js_str_replace]_

_[tool: show_html]_

Header strapline moved under the logo (1s cadence), separate band removed, and the 6-card grid is now a vertical journey timeline with a scroll-drawn progress line, numbered nodes that light as you reach them, alternating cards (single rail on mobile), and a pulsing heart at the end — all on the page's Sora/system-ui type and brand palette. I dropped the source file's flowing glow particles to stay within the "nothing flashy / no glowing particles" brand rule.

_[tool: ready_for_verification]_

Done. Both changes are in: the strapline now rotates under the logo every second, and How It Works is a vertical journey timeline matching the page's type and colours.

## User

in beetween redbox ara her add thi sone but need monbile frnedly  ,,, in hero sections coorecet the lien ,, ''You built this (add Busines ) 
Let's get more from it.

## Assistant

Two changes: fix the hero line, and insert the "Your AI Agent" convergence visual between the hero and the trust bar (mobile-friendly, on brand palette and Sora type).

First the hero line:

_[tool: dc_html_str_replace]_

Now add the convergence CSS to the helmet (before the `@supports` block):

_[tool: dc_html_str_replace]_

Now insert the convergence section before the trust bar:

_[tool: dc_html_str_replace]_

_[tool: screenshot]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

All edits are live. Let me look at the convergence band:

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

Capture renders from the top, but the DOM confirms everything is in place. Handing to the verifier, which can scroll and probe the band.

Hero line now reads "You built this business." and the "Your AI Agent" convergence visual (leaks flowing into a single pulsing heart hub) sits between the hero and trust bar, stacking to a clean single column on mobile with the flow diagram hidden.

_[tool: ready_for_verification]_

Done. Hero now reads "You built this business." and the "Your AI Agent" convergence band sits between the hero and trust bar, collapsing to a single column (flow diagram hidden) on mobile.

## User

need better wording here '' ''From first call to practical improvement to match  ai race ,,,

## Assistant

_[tool: dc_html_str_replace]_

Updated the heading to "From first call to a real edge in the AI race." It keeps the calm, confident tone while tying the journey to staying ahead.

## User

we need to rmeove thso esnetece from header and ad dthem here in small line but anaimated ,,''thise im taking abaoyt mm'' we ntrgrate , we adaapt ,, thsoe 3

## Assistant

Removing the rotating line from the header and placing it as a small animated eyebrow above the hero headline.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Done. The header is back to just the logo, and the three lines (We integrate → We don't force → We adapt at every step) now rotate as a small animated eyebrow above the hero headline, cycling once per second.

## User

but i need animated tetx like writing someone somthing like that and make it 2 sec each but litil nicer animation

## Assistant

Let me make it a typewriter ("writing") effect instead, ~2s per phrase, with a blinking caret.

First, the caret blink keyframe:

_[tool: dc_html_str_replace]_

Now swap the eyebrow markup for the typewriter element:

_[tool: dc_html_str_replace]_

Now the typewriter logic:

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

The typewriter is animating (caret blinking, phrases typing and clearing). It cycles through "We integrate." → "We don't force." → "We adapt at every step." with a writing/deleting effect and a blinking cursor.

_[tool: ready_for_verification]_

Done. The three lines now type out one at a time above the hero headline with a blinking cursor, holding about two seconds each before the next.

## User

say in dahs and coundaon and sam liek writeing stsyle here an dgo big to small ,, sector served 7 , 173 bsuienss work with ,, 1.367k workflwo built i dont undernst whta us other one fill it with number bigger

## Assistant

Making the numbers count up when they scroll into view, updating the values, and ordering them big → small.

_[tool: dc_html_str_replace]_

Now the count-up logic:

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

The numbers now count up when scrolled into view, ordered big → small: 26,400+ hours given back · 1,367 workflows built · 173 founder-led businesses worked with · 7 sectors served.

_[tool: ready_for_verification]_

Done — flagging one thing: I invented the fourth stat ("26,400+ hours given back to founders") since you asked me to fill it with a bigger number. Swap in your real figure/label whenever you have it.

## User

add one bmore boxx asay othe bsusine s s,, thats not miena we only wok them speak to us now ,,, alos sexonc imag eovwerlall- the tetx

## Assistant

Two fixes: add a fifth "speak to us" box in Who We Help, and stop the giant numbers from overlapping.

_[tool: dc_html_str_replace]_

Now fix the overlapping numbers — smaller font, no-wrap, wider tracks:

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: save_screenshot]_

Capture renders from the top. Let me verify the numbers no longer overlap by measuring their geometry:

_[tool: eval_js]_

No overlap now, and each number fits its column. Both changes are in.

Added a fifth "Not on this list? Speak to us now" card in Who We Help, and fixed the stats overlap (smaller no-wrap numbers in wider tracks).

_[tool: ready_for_verification]_

Done. Who We Help now has a fifth "Not on this list? Speak to us now" card, and the numbers no longer overlap.

