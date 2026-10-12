# Getting the stories: intake ideas

Ideas only. Nothing here is a build, and nothing here should be merged as a launch.

The family book is already at `/crooke-7c3a9e12/`. A separate pass is adding a bilingual “Share your story” form: a Netlify Form, a voice upload or an emailed voice note, answers mailed to Jesus, and nothing posted to the book by itself. These notes are about how that one link should behave for older relatives who live on a phone and in WhatsApp, many of them in Spanish.

Goal: Jesus sends **one link**. A relative can leave a name, a story, a voice, a photo of an old picture, and maybe one more person, without making an account or filling out a genealogy worksheet.

## Do these three first

1. **A WhatsApp message that opens the page in Spanish.** The link is the whole product. Jesus pastes one short message in the family chat. The address ends so the page starts in Spanish (`?lang=es` is enough). The message is written the way he talks: who it is for, that it takes a few minutes, that he reads it before it goes in the book. English stays one tap away for relatives who want it. The site today opens in English. For this invite, Spanish is the front door.
2. **One question on the screen.** Seven short steps, not one long form. Large type. One big “Siguiente” button. A line that says “3 de 7”. Each question is a sentence a person can answer out loud. A long page of empty boxes is where older relatives stop.
3. **A mic on that question, and WhatsApp if the mic fails.** The button says “Hablar”. She speaks, hears it once, then goes on. If the phone will not record in the browser, the same screen opens a WhatsApp chat to Jesus with that question already written, so she sends a nota de voz the way she already does. Typing stays available and is never required.

Those three decide whether Mami, Elizabeth, Yodernis, and the older cousins actually leave something. Everything else improves the pile after it arrives.

## The other ideas, in order

Ranked by how much family history they bring in, then by how little they ask of the relative and of a free static site.

| Rank | Idea | Impact | Effort | Why this place in line |
|---|---|---|---|---|
| 4 | **Photograph the picture on the wall.** Its own step: “Toma una foto del retrato.” The camera opens. The next step asks who is in it, by voice. A phone photo of a framed picture is the archive. | High | Low | Easy once the steps exist. Does less than a voice story, and more than a typed name. |
| 5 | **Questions a person can answer without preparing.** See the list below. No spreadsheet of dates. | High | Low | Copy, not a feature. Bad questions waste the good form. |
| 6 | **Thank-you page that tells the truth.** “Jesus lo lee primero. No sale en la página hasta que la familia lo apruebe.” A button to send one more story later. | High | Low | Relatives talk more when they know it is not published live. |
| 7 | **Jesus approves every line.** The email names who it was for and which step. He marks each one: into the book, ask again, or keep private. He writes the approved words into the site himself. | High | Low | Process. The form already refuses to auto-publish. This is how the book stays accurate. |
| 8 | **Ask for a decade, never a birthday.** “¿Más o menos en qué años?” No date field, no address field, no ID field. A line at the start: do not send a cédula, a Social Security number, a street address, or the full birthdate of someone who is living. If a story arrives with one of those, Jesus removes it before he files the note. | High | Low | Keeps the share link safe after it is forwarded. |
| 9 | **“Add someone” is three small cards, not a tree.** Name, how you know them (“mi mamá”, “hermano de Charles”), and one sentence. Stop at three. Jesus turns the cards into tree notes after he reads them. | Medium | Low | Names enter the book without a chart editor. |
| 10 | **This phone remembers the place.** Each answer stays on that phone until she sends or finishes. Say so: “Este teléfono guarda tus respuestas.” Another phone starts over. | Medium | Low | Free, and it covers the coffee break. A login that follows her to a second phone is a different project. |
| 11 | **The same link, with her name on it.** `?para=elizabeth` makes the first screen say her name and labels Jesus’s email. One page for the whole family. The extra word is a label, not a lock. Anyone with the link can still open it. | Medium | Low | Jesus can see who he invited. He should not build accounts to get that. |
| 12 | **A WhatsApp preview that looks like the family.** The pasted link should show a Spanish title and one sentence: this is the family book, and Jesus reads what you send. The page stays noindex. | Medium | Low | People open links that look like a person, and ignore links that look like a company. |
| 13 | **Seven steps, then stop.** The thank-you page invites another story tomorrow. An endless form feels like homework. | Medium | Low | Protects the first sitting. |
| 14 | **Transcription is a later pass, by ear first.** Jesus listens and types the line he wants in the book. A machine transcript can wait until there are many recordings, and it should be labeled as a machine’s draft until he corrects it. | Later | Paid service | Do not make a relative wait on a transcript, and do not put an uncorrected one in the book. |
| 15 | **Emailing a voice note is the third door.** Keep it for the relative who lives in email. Lead with the mic and with WhatsApp. An email app is one more lock on the phone. | Low as a primary path | Already in the form plan | Useful backup. A weak front door. |

## Questions worth asking

Spanish first. English under it, smaller. Each one is a single screen.

1. ¿Cómo te llamas, y de quién eres en la familia?
2. Cuenta una historia de Mami o de Charles que quieres que se quede.
3. Di un nombre de los viejos que debemos escribir, y cómo era esa persona.
4. ¿Qué comida se hacía en la casa, y quién la cocinaba?
5. Si tienes un retrato cerca, tómale una foto.
6. ¿A quién más debe escribirle Jesus?
7. ¿Qué no debe salir en la página?

That is a chapter, a recipe, a name for the tree, a picture, a next person, and a privacy line. It is enough for one night.

## What Jesus does with what arrives

- The notification email is the inbox. Same habit as the quote form: he reads it. Nothing on `/crooke-7c3a9e12/` changes because a relative pressed send.
- He keeps a private note with three marks: **into the book**, **ask again**, **private**.
- “Into the book” means he copies the approved sentence into the site, with the archive label the site already uses (“Told by …”).
- Voice files and photos stay in the form inbox until he downloads them to a private drive. They do not go into this public repository. The site’s own content policy already forbids family photos, scans, and interview audio in git.
- He strips, before filing, any cédula, Social Security number, street address, or full birthdate of a living person, even if someone said it warmly in a story.

## What a free static Netlify site can do

Realistic now, with the form that is already being built:

- One HTML form, a honeypot, Spanish and English, several screens in the browser, one send at the end.
- The phone remembering answers locally.
- A name on the link (`?lang=es&para=…`).
- A `wa.me` message Jesus can paste, and a button that opens WhatsApp with the current question filled in.
- One photo field and one audio field. Netlify’s current form docs cap **each upload request at 8 MB and 30 seconds**, and allow **one file per field**. A long voice note and a photo should travel as separate sends so they do not share that 8 MB.
- An email to Jesus, set in the Netlify UI. The thank-you page can be a static page on the same hidden path.
- The page stays `noindex`.

On current credit-based Netlify plans, form submissions are unlimited and free (that change is from April 2026). Older “legacy” plans metered forms, and the free level was 100 submissions and 10 MB of uploads a month, with overage moving the site onto a paid forms tier. Jesus should look at the Arc team’s plan before a big family weekend of photos. The 8 MB / 30 second cap applies either way.

Leave these for a paid service, or do not do them:

- Automatic transcription. That is a speech API, billed per minute. Listening is the right tool at this size.
- An account, a code by email, or save-and-continue across two phones.
- A password on the whole Netlify site. That is a paid feature, and it would lock the public Arc site along with the family book.
- Putting originals in git. The form inbox is the temporary holding place. A private drive is the filing cabinet.

## Privacy, in the form itself

The share link will be forwarded. Write the pages so a forwarded link is only a story, a first name, a relationship, a recipe, and a photo the sender chose.

The form does not ask for, and has no box for:

- Social Security numbers or other government ID numbers
- Street addresses
- Full birthdates of living people

Living people appear as a name and how they are related, unless that person has agreed to more. Charles’s memorial can hold what the family already chose to say about him. A story about someone else who is living waits for that person’s yes, which is the same rule already written for Elizabeth and Yodernis.
