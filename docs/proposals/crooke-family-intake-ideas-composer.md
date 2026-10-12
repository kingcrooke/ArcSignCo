# Crooke family intake — ideas only

Planning note for Jesus Crooke. This file does not add a page, a form, or a deploy. The interview itself is a separate build: a bilingual “Share your story” Netlify Form, with an optional voice upload or an emailed voice note, answers emailed to Jesus, and nothing published on its own.

The heritage site already lives at the hidden, noindex path `/crooke-7c3a9e12/`. Chapters, the tree, and the vault are shells. Facts on that site already carry a source label (`Told by`, `Paper we hold`, `Not yet asked`). `crooke-7c3a9e12/CONTENT-POLICY.md` already keeps photo scans, document scans, and interview audio out of this public git repository.

## Goal

One link, sent to every relative. Most of them are older Spanish speakers on a phone, and the message will travel in WhatsApp. The interview should collect a story, a name, and maybe a picture of an old picture, in a few minutes, with as little typing as possible.

## How to read this list

Impact means “more family history actually comes back.” Effort means work for relatives first, and work for a later build second. The three marked **Do first** are the ones to shape the form around. The review desk and the privacy line ship with those three. They are how the form stays safe, not a later phase.

| Order | Idea | Impact | Effort | Do first |
| --- | --- | --- | --- | --- |
| 1 | Six short steps, Spanish first, one link | High | Low | Yes |
| 2 | One WhatsApp message he can forward | High | Low | Yes |
| 3 | Speak each answer, or send a voice note | High | Medium | Yes |
| 4 | Thank-you page that passes the same link on | Medium | Low | |
| 5 | Photo of an old picture, not a document | High | Medium | |
| 6 | Questions aimed at the empty chapters | High | Low | |
| 7 | “Add a relative” in their own words | High | Low | |
| 8 | Privacy line on the first screen and before send | High for safety | Low | |
| 9 | Save on this phone until they send | Medium | Low | |
| 10 | A transcript for Jesus, after the story is sent | Medium | Medium to high | |
| 11 | Personal links only if the one link stalls | Low until then | Medium | |
| 12 | Jesus’s review desk | High | Low | Ships with 1–3 |

## Do first

### 1. Six short steps, Spanish first, one link

One screen, one job, big type, one large button. Spanish is the language on screen when the link opens. English is a second large button, not a small toggle.

Suggested order:

1. What should we call you, and whose child, sibling, or cousin are you? (Their words. No account.)
2. Who do you most want the family to remember? Tell one story the way you would tell it at the table.
3. What did people call them at home? What town or country was home? A recipe, song, or saying, if one comes to mind.
4. If an old picture is nearby, take a photo of it and say who is in it. This step can be skipped.
5. Add one relative: name, how they are related, living or remembered, one sentence. This step can be skipped.
6. Thank-you (idea 4).

A line at the top says “2 of 6” so the end is visible. Each step can be skipped except the name. A relative who only tells one story has still finished.

This fits a static page plus a Netlify Form, the same kind of form the public quote form already uses. No database.

### 2. One WhatsApp message he can forward

Jesus sends one note, in Spanish, with the single link. Relatives forward that same note. The message says it takes a few minutes, they can talk instead of type, and Jesus reads it before anything appears on the family site.

WhatsApp’s built-in browser often blocks the microphone, the camera, and saved drafts. The note asks them to open the link in Safari or Chrome if the mic button does nothing. A `wa.me` link with the text already filled in needs no WhatsApp Business account.

When the link is pasted, WhatsApp should show a plain title in Spanish and a one-line description. The preview image stays a generic card. Family photos do not go in that preview.

The heritage footer already says the URL is not for the public. Forwarding it inside the family is the point of this project. The form shows no one else’s answers. The public Arc pages stay unlinked to it.

### 3. Speak each answer, or send a voice note

On each story step, a large **Hablar** button records, plays back, and then moves on. A text box stays on the same screen (“o escríbelo”) for anyone who would rather type, and for the person helping a relative.

If the microphone does not start, the screen tells them to reply in the WhatsApp chat with a voice note and the question number. That path uses an app they already know. The form can still send their name and which question they were on. Jesus gets the voice note in the chat where he sent the link.

Keep each clip to about a minute. Netlify Forms accepts one file per field, an 8 MB request, and a 30-second upload. A short voice clip fits. A long recording or an uncompressed camera photo does not.

The site today sends `Permissions-Policy: camera=(), microphone=()` on every path, including `/crooke-7c3a9e12/`. A later build has to allow the mic and camera on the intake path only. Until that change, the in-page recorder will be blocked and the WhatsApp voice note is the path that works.

## Next, still small

### 4. Thank-you page that passes the same link on

After a successful send, a page under the same hidden path (not the public quote `/thank-you`) says Jesus will read this before anything appears. It lists what they sent: a story, a photo, a name. One button opens WhatsApp with the same link and a short Spanish note, so they can hand it to the person who knows the next story.

### 5. Photo of an old picture, not a document

One optional step: photograph a picture that is already in the house, then say who is in it. The phone should shrink the image before upload so it fits the 8 MB form limit. Shrinking it also drops the location hidden inside a phone photo.

The screen says a family picture is welcome. A passport, cédula, or a letter that shows an address is not. The file stays with the form submission. It is not committed to this repository, which `CONTENT-POLICY.md` already forbids.

### 6. Questions aimed at the empty chapters

The prompts ask. They do not supply facts. The site already marks these chapters “Not yet asked”: Mary Thelma Morel de Crooke (Mami), Charles Crooke, siblings Elizabeth and Yodernis, Morel roots, Crooke roots, migration, and kitchen. A story can land in one of those later, after Jesus approves it. The form does not write the chapter.

Useful prompts, Spanish on screen:

- What should we call you, and how are you family?
- Who should the family remember?
- Tell one story from the table.
- What name did you use for them at home?
- What town or country was home?
- What recipe, song, or saying should not be lost?
- Who else should we ask?

### 7. “Add a relative” in their own words

Name, “I am their ___”, living or remembered, and one sentence. For someone alive, the form does not ask for a full birthdate. Town or country is enough. No street.

These names arrive as pending. They do not change the tree. The live tree already uses placeholders above Charles and Mami. A real name replaces a placeholder only after review.

### 8. Privacy line on the first screen and before send

Stories and names are what the form wants. The first screen and the send button both say, in Spanish and English, to leave out:

- Social Security numbers
- passport, cédula, or other ID numbers
- immigration numbers
- bank information
- a full birthdate of a living person
- a home address

If a story mentions a full date for someone alive, Jesus keeps it in the private email and drops the day and month before any page shows it. Shareable pages already omit birthdates, street addresses, document numbers, and DNA. A honeypot field matches the quote form. A CAPTCHA waits until spam actually arrives. A puzzle on the first screen will stop the relatives this link is for.

### 9. Save on this phone until they send

The short interview is meant to finish in one sitting. If a call interrupts it, the answers can sit in the browser on that phone until they press send.

The screen says the save stays on this phone and this browser. It does not follow them to another phone. WhatsApp’s in-app browser may throw that save away, which is another reason idea 2 asks them to open Safari or Chrome.

Continuing later from a different phone needs a server draft (a function plus Netlify Database or Blobs). That spends compute credits. Skip it unless people start abandoning the six steps.

### 10. A transcript for Jesus, after the story is sent

The relative is done when they press send. A transcript is for Jesus, so he can read instead of only listen.

The browser’s built-in speech recognition is free and often wrong for older voices and Caribbean Spanish. If it is offered, it is a draft he corrects, and the audio remains the record.

Turning the uploaded file into a transcript needs a speech service. The price for that service is unknown. This project’s Netlify AI Gateway notes cover chat and image models, not a speech-to-text price. Listening to a family-sized pile of one-minute clips is realistic without that service.

### 11. Personal links only if the one link stalls

The single link asks their name, so each email already says who answered. A separate link per person fights the goal of one message in the family chat.

If Jesus later wants a link that greets one person, the same page can read a first name he types into the address. That is still a static page, with no accounts. A roster of who has not replied, logins, or magic links needs a database. Wait until the family chat goes quiet.

### 12. Jesus’s review desk

This ships with the first three ideas.

- The form emails Jesus the written answers. Recordings and photos stay on that same submission; he opens them in Netlify’s form inbox. The email is the alert. Publishing is a separate, later edit.
- Nothing is written into the heritage pages by the form.
- Before he adds a line to the site, he removes ID numbers, bank details, addresses, and full birthdates of living people. For someone who has died, a year is enough if he chooses to show a date at all.
- Approved words go on the site in a later change, with the source label the pages already use (`Told by` and the relative’s name). Photos, if he later shows any, come from private storage, not from a file committed here.

## What a free static site can do

Verified from Netlify’s docs (see Sources):

- On **credit-based** plans, form submissions are free and unlimited, including the Free plan at **$0/month** with **300 credits/month**. Past that, the Free plan pauses the site until the next month. It does not charge.
- A production deploy costs **15 credits**. Bandwidth is **20 credits per GB**. Function compute is **10 credits per GB-hour**. Web requests are **2 credits per 10,000**. AI inference is **180 credits per $1** of model use.
- Personal is **$9/month** (1,000 credits). Pro **starts at $20/month**.
- File uploads on a form: **one file per field**, **8 MB** per request, **30-second** timeout.
- On **legacy** plans, the free Forms level is **100 submissions per site per month** and **10 MB** of uploads per month. Going past a paid legacy level can raise the bill. Whether this site is on a credit-based plan or a legacy plan is unknown. Jesus can see that under the team’s billing page.

A static interview, a WhatsApp share link, browser recording, on-phone image shrinking, a thank-you page, and email notification sit inside that free form path, as long as the site’s plan still accepts form posts and the upload stays under 8 MB.

A server that stores drafts, transcribes audio, or tracks who has not replied also needs functions. On credit-based plans those functions spend compute credits. There is no separate free function allowance on those plans. The dollar cost of a specific speech-to-text or WhatsApp Business API is unknown, and this plan does not need either one for the first version.

## Leave for later

- Accounts, passwords, and a “who has not replied” tracker.
- Automatic publishing onto the tree, the book, or the vault.
- Putting scans or audio in this git repository.
- A CAPTCHA in front of relatives who have not caused a spam problem.
- Transcription as a requirement before the thank-you page.

## Sources

- Netlify, [Forms usage and billing](https://docs.netlify.com/manage/forms/usage-and-billing/) — forms free and unlimited on credit-based plans; legacy plans metered.
- Netlify, [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/) — credit rates for deploys, bandwidth, compute, requests, and AI.
- Netlify, [Credit-based pricing plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) — Free $0 / 300 credits, Personal $9, Pro from $20.
- Netlify, [Pricing updates, 14 April 2026](https://www.netlify.com/changelog/2026-04-14-pricing-updates-april-2026/) — form submissions made free on credit plans.
- Netlify, [Forms setup](https://docs.netlify.com/manage/forms/setup/) — 8 MB, one file per field, 30-second upload timeout.
- Netlify, [Billing FAQ for legacy plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-legacy-plans/billing-faq-for-legacy-plans/) — legacy free level of 100 submissions and 10 MB of uploads.
- This repo: `crooke-7c3a9e12/CONTENT-POLICY.md`, and the site-wide `Permissions-Policy` in `netlify.toml`.
