# Proposal: a Crooke family heritage site

Planning only. This document does not build a page, change the Arc Signage Co site, or deploy anything.

Prepared for Jesus Crooke, October 2026. Family facts below are what he asked to be used. They were not researched, checked against records, or expanded. Nothing in this proposal is a finding about the Morel family, the Crooke family, or anyone's birthplace, dates, or migration.

## What he asked for

A fifth hidden, noindex, share-only site on a secret `arcsignco.com` path, beside the sites already kept off the public Arc site. This one is a family book: a crest, a motto, a large tree, and a lineage you can read, in the spirit of houses that publish their arms and their story. It is for the household he named:

- His mother, Mary Thelma Morel de Crooke, called Mami
- His late father, Charles Crooke
- His sisters, Elizabeth Crooke and Yodernis Crooke
- Jesus himself

He described Dominican roots on the Morel side, and Crooke roots. That is the whole of the origin story this plan is allowed to assume.

## Where it would sit, when someone builds it

Arc publishes the repository root on Netlify. Hidden projects stay off the public nav, off `sitemap.xml`, and out of search by a hard-to-guess path plus `noindex, nofollow` in both the HTML and `netlify.toml`.

| Site | Path in this repo | What it is |
|---|---|---|
| GWB | `/gwb-fe006a16/` | League dashboard |
| Dynasty | `/dynasty-1581d86a/` | League dashboard |
| Corderitos | `/guarderia-dfe200bb/` | Day-care draft |
| NovaStage | `/novastage-2c397e45/` | LLC preview, on branch `cursor/novastage-hidden-preview-bd61`, not on `main` in the checkout this proposal was written from |

A later build would add something in that same shape, for example `/crooke-` plus random hex, with the same robot headers, no link from `index.html` or the service pages, and no sitemap entry. This proposal does not pick the hex or add the path.

Two limits of that pattern matter more here than they do for a fantasy league:

1. A secret URL is not a password. Anyone who is sent the link can open it, forward it, or screenshot it. `noindex` only asks search engines to stay away.
2. This repository is public, and Netlify publishes the repo root. `netlify.toml` 404s `/docs/*` on the live site, so this file is not a page on `arcsignco.com`. It is still on GitHub. Family photos, scans, audio, and DNA do not belong in this repository at all.

## 1. Ten sites worth learning from

Five are commercial or nonprofit genealogy products. Five are houses, clans, and family archives. Each note is what to borrow for a private family book, not a reason to put the Crookes into that product.

### 1. Ancestry

https://www.ancestry.com/

The largest commercial record desk, and the one most people mean by "family history website."

What makes it good: a private tree can stay invite-only, while a public tree still hides living people. A person page is a life, not only a box on a chart. Records, photos, and stories hang off the same profile.

Formulas to borrow:

- **Tree viewers.** Pedigree and family views, with the chart as navigation into a person.
- **Timeline.** LifeStory lays one person's events out in order and attaches photos to facts.
- **Stories and vault.** Galleries for photos and documents, plus written stories. Media is linked to a person and can be unlinked without deleting the file.
- **DNA.** AncestryDNA and ThruLines suggest how a match might connect. Useful as a private research lead. Wrong as a public page.
- **Privacy.** On a public tree, living people show as "Living," not with dates. A private tree is visible to the owner and people they invite. Searchable-private still leaks names of the dead into hints. Unsearchable-private is the setting that matches a family book.
- **Login.** Accounts, roles (owner, editor, contributor, guest), and a separate switch for who may see the living.

Do not republish Ancestry record images on the Crooke site. The scan is theirs. A family-held paper is a different object.

### 2. MyHeritage

https://www.myheritage.com/

The international cousin of Ancestry, with the most polished "make a chart you could hang on a wall" tools, and photo tools that are tempting and risky.

What makes it good: four working tree views, printable charts and books, and an online family site that can publish a chart. Photo enhancement is genuinely useful for a small, blurry print of Charles or of Mami's parents, if the family treats the result as a restoration, not as a new fact.

Formulas to borrow:

- **Tree viewers.** Family, pedigree, list, and fan. Fan view is ancestors only, 4 to 10 generations, with a color mode that is almost a poster. Printable types include close family, ancestor, descendant, fan, all-in-one, bowtie, and a circular sun chart.
- **Books.** Charts and books export to PDF. That is the commercial version of "a big book of lineage."
- **Photo tools.** Photo Enhancer upscales faces. In Color colorizes. The original file is kept. MyHeritage's own help text says enhancement is a simulation and can be wrong. Caption it that way.
- **Matching.** Smart Matches, Record Matches, and Theory of Family Relativity walk from your tree through other trees and records to a DNA match. Every hop is a guess until a person checks it.
- **Deep Nostalgia / LiveStory.** These animate a face or narrate a life in an ancestor's voice. Leave them alone for Charles unless the family has a direct conversation and still wants it. A memorial does not need a moving portrait.
- **Privacy and login.** Trees and family sites have sharing controls. A chart shared to social media is no longer private. Do not add that button.

### 3. FamilySearch

https://www.familysearch.org/

Free, run for the Church of Jesus Christ of Latter-day Saints, and built around one shared tree plus a very large scan library. The right place to *look*, the wrong place to *publish* this family without a separate decision.

What makes it good: no subscription, full-text search across transcribed records, and Memories (photos, stories, documents, audio) that can be tagged to a person. The chart is one of several doors into the same profile.

Formulas to borrow:

- **Tree viewers.** Pedigree, fan, portrait, and descendancy. Click a person, get a profile, come back to the chart.
- **Vault.** Memories is the cleanest "shoebox" in this set: a photo, a story, a PDF, a sound file, an album.
- **Sources.** A fact without a source is visibly weaker than a fact with one. Use that habit even when the source is "Mami said this on a recording."
- **Privacy.** Details of living people are not public. The collaborative tree is still a public project for the dead. Adding Charles, Mami's parents, or anyone else there is a publication decision, not a research note.
- **Login.** A free account. Collaboration is the default, which is the opposite of a share-only family book.

Later, if Jesus wants records, these are public collections. They were not searched for this proposal, and a hit would still need the family to read the image:

- FamilySearch wiki, Dominican church books: https://www.familysearch.org/es/wiki/Registros_eclesi%C3%A1sticos_de_la_Rep%C3%BAblica_Dominicana
- Library of Congress guide to Dominican civil registration: https://guides.loc.gov/dominican-republic-local-history-genealogy/civil-registration
- Ancestry's copy of the FamilySearch civil collection (licensed images, do not copy them onto the site): https://www.ancestry.com/search/collections/9832

The Library of Congress guide says civil registration in the Dominican Republic began in 1945. Collection titles that say "1801–2010" are still indexes and scans to be read, not a family history.

### 4. Geni

https://www.geni.com/

One "World Family Tree" (Geni's homepage described more than 210 million profiles when this was written), merged profiles, and a hard split between private living people and public dead people.

What makes it good: it is honest about collaboration. You are editing a shared person, not a private file. Curators exist because strangers will "help."

Formulas to borrow:

- **Tree.** One tree, click through to relatives, merge duplicates when two profiles are the same person.
- **Privacy.** Living relatives and minors start private. Geni recommends public profiles for people born more than 150 years ago, and still lets a family keep parents and grandparents private. Public search hides living non-users. That age rule is a useful default for the Crooke book: the living stay thin; Charles can be fuller because he has died and the family is writing the page.
- **Sources.** Citations are first-class. Geni also pulls MyHeritage matches, which means data moves between companies once you connect them.
- **Login.** Accounts, managers on each profile, family-group visibility.

Do not create Geni profiles for Elizabeth, Yodernis, Mami, or Jesus as part of building this site.

### 5. WikiTree

https://www.wikitree.com/

A free, sourced, single tree with an honor code. The homepage at the time of writing cited about 1.36 million members and about 45.4 million profiles, of which about 16.4 million had a DNA connection. Those counts will move.

What makes it good: the honor code is the best short privacy policy in this set. "We respect privacy. We privacy-protect anything we think our family members might not want public. If that's not enough for someone, we delete their personal information." Accuracy and sources are part of the same promise.

Formulas to borrow:

- **One profile per person**, with a biography in prose, not only vital dates. That prose is the chapter.
- **Privacy levels.** Unlisted profiles are invisible except to a trusted list, and living non-members must be Unlisted. Public and Open are not options for the living. DNA of other living people must not be posted.
- **DNA.** A link between a test and a profile, for people who opted in. Keep that idea inside a password vault or do not do it.
- **Login and trust.** A trusted list on each profile, not a single site password. Heavier than this family needs. The principle (named people, not the whole internet) is right.

### 6. Clan Donald

https://www.clandonald.org/ and https://www.clandonald.org.uk/genealogy.htm

The Clan Donald Society of Scotland, plus the Edinburgh society's genealogy database. This is the "clan site" model: a name that covers hundreds of families, a chief, a history told by era, and a crest and tartan that belong to a branch.

What makes it good: you can feel the house in the first screen. History is chapters ("up to 1899" and onward), not a dump of names. The Edinburgh database is explicit about its sources (the three-volume *Clan Donald* of 1896–1904, and later work) and shows chiefs as a succession chart you can also print.

Formulas to borrow:

- **Crest and motto** as an identity, with the warning that branches differ. A Crooke page should be even stricter: one household's emblem, not "the Crooke crest."
- **A chiefs chart** as the model for a small succession or generation strip: known people, in order, gaps left blank.
- **History chapters and maps** of where that clan held land. For the Crookes, a map waits until someone in the family names a place.
- **Membership and events.** Ignore these. This site is not a society and not a mailing list.

### 7. The World of the Habsburgs

https://www.habsburger.net/en

https://www.habsburger.net/en/world-and-worlds-habsburgs-project-schonbrunn-group

A virtual exhibition by Schloss Schönbrunn and historians at the University of Vienna. The best "big book" on the web, even though the subject is an empire.

What makes it good: three doors into the same material. Time (a timeline from 1278 to 1918), space (a map of the monarchy), and people (a genealogical table and portraits). A fourth door is a virtual reading room. Themes such as work, love, and death cut across the timeline, so a story is not trapped inside one reign. They say outright that they wanted narrative, not a lexicon, and that they included people who were not the dynasty.

Formulas to borrow, scaled to one household:

- **Three doors:** a generations timeline, a map that starts empty, a tree.
- **A reading room:** the Book of the Crookes, chapter by chapter.
- **Themes** instead of only birth-to-death: the table, the kitchen, work, grief, the two shores.
- **Portraits with a caption** that says what the picture is. They credit museums. The Crooke site credits the relative who took or kept the photo.
- **No login.** It is a public exhibition. The Crooke book is not. Borrow the structure, not the open door.

### 8. The Rothschild Archive

https://www.rothschildarchive.org/family/

https://www.rothschildarchive.org/family/genealogy

https://family.rothschildarchive.org/

A real family archive with a public layer and a research layer. The clearest model for "our name is not everyone who shares it."

What makes it good: the tree page says the archive keeps the male-line descendants of Mayer Amschel Rothschild (1744–1812), and that other families named Rothschild are not this tree. Biographies, houses, and a bibliography of books family members wrote sit beside the chart. The interactive tree lets you search or browse, then click a person and walk to relatives by a number in the lineage.

Formulas to borrow:

- **A scope sentence on every entrance.** "This is the household of Mary Thelma Morel de Crooke and Charles Crooke. It is not a directory of people named Crooke or Morel."
- **Tree plus biography.** The chart is the index. The writing is the archive.
- **A bibliography** of recipes, recordings, and documents the family actually holds, with location ("Mami has the print") instead of a fake catalog number.
- **A research boundary.** The Rothschild site tells scholars what the archive does not hold. The Crooke site should say which sentences are memory and which are a paper someone can point to.

### 9. Clan Campbell Society (North America)

https://www.ccsna.org/

A family association (founded 1929) with a chief, a crest badge, a journal, a genealogy desk, and a DNA project behind membership.

What makes it good: the crest is taught, not just displayed. Their FAQ gives the charge (a boar's head) and the motto in the strap, *Ne Obliviscaris*, "Forget Not," and says whose crest it is. Genealogy is a service with a form, a librarian, and a DNA project (Y-DNA, GEDmatch) that members opt into. The journal is a serial version of the family book.

Formulas to borrow:

- **Crest badge plus motto in one mark**, small enough to be a favicon, with a sentence that says who it belongs to.
- **A journal rhythm.** Chapters can grow. The site does not have to launch complete.
- **DNA as a members' project.** Results stay with the people who tested. The public face of the society does not paste match lists.
- **Membership login.** Too much machinery for four siblings and their mother. A single shared passphrase on the private vault is the proportionate version.

Do not borrow their motto. It is theirs.

### 10. The British Royal Family

https://www.royal.uk/

https://www.royal.uk/about-site

https://www.royal.uk/the-royal-archives

https://www.royal.uk/encyclopedia/succession

The official site of a working monarchy, written by the Royal Household. Useful as a standard for voice and for knowing what not to imitate.

What makes it good: it knows what it is. The about page promises biographies, a history of kings and queens, residences, collections, and the role of the Crown. Succession is a list with a legal basis, not a decorative tree. The Royal Archives page is explicit that it does not hold ordinary genealogy and sends readers to Ancestry, Findmypast, and the Society of Genealogists. Heraldry points at the College of Arms.

Formulas to borrow:

- **A biography voice** for Charles: dates the family wants public, offices and work in plain language, no invented titles.
- **A short line of the household** in place of a 40-person succession list.
- **A boundary statement.** "This site is not a genealogy of every Crooke. The Royal Archives are not that for Britain, and this page is not that for us."
- **Arms as a subject with a source.** They explain the Royal Arms. They do not invite the reader to adopt them.

What not to borrow: crowns, supporters, robes, and the look of a grant. Those say "the state gave us this." It did not.

### What the ten share

The sites that feel like a house, rather than a database, all do five things:

1. A mark and a sentence (crest, motto, or scope line) before any chart.
2. More than one way in: people, time, and a book or themes.
3. A person page that can hold a story, a picture, and a source, including "we do not know."
4. A rule for the living that is stricter than the rule for the dead.
5. A refusal to pretend the surname is the bloodline.

## 2. Heraldry, without pretending

### The few terms that matter

A **coat of arms** is the shield, described in a blazon so another artist can repaint it. A **crest** is the object that sits on the helmet above the shield. A **motto** is the words on the scroll. Together with helmet and mantling they are an achievement. In ordinary speech "family crest" means the whole thing. On this site, use "family emblem" and, if the picture includes a shield, say so.

The College of Arms, which grants arms for England, Wales, and Northern Ireland, states the rule that protects this project from a common scam: there is no coat of arms for a surname. Arms are granted or confirmed to one person and descend in a specific line. Many people who share a surname have no arms. Many others have different ones. A crest is not the whole achievement. Their FAQ is the source: https://www.college-of-arms.gov.uk/resources/faqs

The Society of Genealogists makes the matching point: families have long used arms that were never theirs, and paying the old armorial tax did not create a right. https://sog.org.uk/guides-and-stories/the-right-to-arms/

Shops that sell "the Crooke crest" or "the Morel crest" after you type a surname are selling a picture. Using that picture on this site would claim a right the family has not established, and might copy someone else's arms.

This proposal did not look up historic Crooke or Morel arms, and a later build should not paste one from Burke, a surname site, or image search.

### An honest mark

Design a **new emblem for this household**, and print this sentence under it, in the language of the page:

> Made for the family of Mary Thelma Morel de Crooke and Charles Crooke in [year]. This is not a grant of arms. It is not the arms of everyone named Crooke or Morel.

If, later, someone wants a legal grant, that is a petition to a heraldic authority in a jurisdiction that actually applies to them, with fees and a design the heralds control. The College of Arms describes that process for its jurisdiction: https://www.college-of-arms.gov.uk/services/granting-arms — the Kings of Arms design the arms, keep them distinct from existing grants, and prefer a simple design. This website does not start that petition and must not look as if it already happened.

Design rules for the new emblem, so it stays honest and readable:

- Two or three charges, bold enough to read at favicon size.
- Metal on color, or color on metal. Not gold on silver, not blue on black.
- Charges the family recognizes (a book, a table, a palm, a shore), not a lion copied from a kingdom.
- No crown, no coronet, no supporters, no robe of estate, no "established 1590."
- A motto the family chooses. Short enough for a scroll. Spanish, English, or both. Not a clan's motto and not a Latin line lifted from a college.

### Motto lines to accept, reject, or replace

These are drafts for Jesus and Mami. They are not historic mottoes.

1. **Lo que se cuenta, queda.** What is told, remains.
2. **Two shores, one table.**
3. **Forget nothing we were given.** Close to Campbell's "Forget Not" on purpose as a *different* sentence, in English, about gifts and memory rather than a clan. If it feels too close, drop it.

A motto is right when Mami would say it. If none of these is that sentence, the build waits.

### Three emblem studies

Studies, not finished art. Jesus is the designer. Each one matches a direction below.

**Study A, the book.** An open book on a shield, a wavy band under it for water between places, a small palm frond as the crest on the helmet. Motto on a scroll beneath. Ivory, deep green, a wine red. No gold leaf effect that tries to look like a museum grant.

**Study B, the house.** One charge only: two trunks rising into one crown of leaves, standing for Morel and Crooke at one table. The caption must say it is a symbol, not a proven pedigree. Dark ground, a single metal line. This is the study most likely to be misread as a clan. The caption does the work.

**Study C, the archive.** No shield. A monogram of an M and a C, with a key or a tied packet of letters. Quiet, typographic, closer to a bookplate than to armor. Use this if the shield studies feel like costume.

Grok Imagine can paint studies from these descriptions. It does not decide which one is true.

## 3. Three directions

All three use the same bones: secret path, noindex, the household Jesus named, a book, a tree, a timeline, a memorial for Charles, and a locked vault. They differ in what the first screen feels like.

### Direction 1 — The Book of the Crookes

The Habsburg reading room, scaled to a family bible.

The first screen is a frontispiece: emblem, motto, and one sentence of dedication to Mami and to Charles. After that, chapters, a table of contents, and page numbers. The tree is a chapter you can open, not a database home. The timeline is the running head of the generations. Recipes and oral history are chapters, set like essays, with the speaker's name at the top ("Mami").

Visual: warm paper, a text serif, one accent color, wide margins, almost no chrome. On a phone it is a single column. Jesus already designs for a phone-width Arc site. This direction should feel as considered as a printed signature, not as a template.

Best when the family wants to be read. Weak if the first year is mostly empty chapters. Empty chapters are allowed if they are labeled "not written yet," the way a book leaves a section for a person who has not spoken.

### Direction 2 — The House

Clan Donald's first impression, without the society.

The first screen is the emblem, large, and the motto in a band. Two lines are named, Morel and Crooke, as shelves, not as researched dynasties. The tree is the home page after the crest. A generation strip sits under the crest like a chiefs chart, with blanks. Charles has a memorial room. Stories are "gatherings." There is no join button and no shop.

Visual: darker, more ceremonial, the emblem doing the work of a logo. Risk: it can look like a claim of nobility. The scope sentence and the "not a grant" line have to be on the crest page, not in a footer nobody reads.

Best when Jesus wants one strong mark and a tree. Weak when the writing matters more than the mark. Direction 1 wears the mark. Direction 2 is the mark.

### Direction 3 — The Archive table

The Rothschild finding aid, with Mami's voice as the first document.

The first screen is a short scope statement and four drawers: People, Pictures, Voices, Papers. The tree is a tool in People. Every sentence has a tag: **told by**, **paper we hold**, or **not yet asked**. The map is a drawer that can be empty. The memorial is a file for Charles, with only what the family places in it. The book still exists, as "read this aloud," but the feeling is a table with envelopes, not a throne room.

Visual: cool paper, catalog labels, photographs in sleeves, type that looks like a finding aid. Warmth comes from quotations, not from gold.

Best when the family is still gathering and does not want to imply a finished lineage. Weak if it feels cold beside a father's memorial. The cure is to let Charles's page and Mami's voice break the grid: a large photograph, a long quote, then the labels resume.

### Recommendation

Build Direction 1 as the share-only site. Use Direction 3's labels on every fact, so a story never pretends to be a certificate. Use the emblem from Study A or Study C on the frontispiece. Keep Direction 2's darkness in a sketch only, unless Jesus prefers it after seeing both. The book matches what he described. The labels keep it honest. The house style is easy to overplay.

## 4. Sitemap

One secret path. Tabs, in this order:

| Tab | Who can open it | What it holds |
|---|---|---|
| Frontispiece | Anyone with the link | Emblem, motto, dedication, the scope sentence, the "not a grant" line |
| The Book | Anyone with the link | Chapters listed below |
| The Tree | Anyone with the link | The known household only. Living people as names and relationship |
| Timeline | Anyone with the link | Generations as a strip. Years only where the family has agreed to show them |
| Origins | Anyone with the link | Two short pages, Morel and Crooke, written as memory. A map with no pins until a place is named by the family |
| The table | Anyone with the link | Recipes and stories from the kitchen, in the speaker's words |
| Charles | Anyone with the link | Memorial. See below |
| Vault | Passphrase | Scans, exact dates, interview audio, DNA notes, anything a living person marked private |

No account system in the first build. No comments. No "share" buttons. No analytics unless Jesus later asks, the same rule as the Arc site's GA4 switch.

### Chapters of the book

Containers only. No life story is filled in here.

1. The emblem and the motto, including the honest caption.
2. Mami. Mary Thelma Morel de Crooke, in her own words first.
3. Charles. A pointer to the memorial, plus any story the book holds that the memorial also holds.
4. The sisters. Elizabeth and Yodernis, each only after that sister says what may be written. Until then the chapter says they are his sisters and nothing else.
5. Jesus. He writes his own page, or it stays a name on the tree.
6. The Morel side, as told. Dominican roots stated as family memory.
7. The Crooke side, as told. No country, county, or ship invented to fill the page.
8. The table. Recipes, with who cooked them.
9. How to read this book. What "told by" means, what a paper is, what the artwork is, and how to ask for a correction.

### The tree

The first tree is small on purpose.

- Charles Crooke and Mary Thelma Morel de Crooke as the couple at the center.
- Their children: Jesus, Elizabeth, and Yodernis. No other children unless Jesus adds them.
- No parents of Mami or of Charles until someone in the family speaks their names for the book.
- No spouses or further children unless that person agrees to be listed.

Interaction, borrowed from the fan and pedigree views above: tap a person, open their chapter, return to the chart. A fan of "direct ancestors" is almost empty at the start. That emptiness is the point. A family view (the couple and their children) is the right first chart. A fan can appear when there are real ancestors to show.

Living nodes show a name and a relationship. They do not show a birthdate, address, phone, email, school, or workplace. A photo of a living adult appears only with that person's yes. No photo of a minor.

Charles, having died, may show the years the family wants on a memorial. If they do not want years, the page still works: a name, a photograph they choose, and words.

### Timeline

A horizontal strip of generations, not a history of the Dominican Republic and not a history of every Crooke.

- Generation of Charles and Mami.
- Generation of their children.
- Earlier generations only as blank ticks labeled "not yet told."

Dates enter the strip only by family decision. A year of death for Charles is a memorial fact, not a default. Birth years of Elizabeth, Yodernis, Jesus, and Mami stay off the share-only strip.

### Origins

Two pages, both framed as speech, not as research.

- **Morel.** "Mami's family, as she tells it." Dominican roots, in the words she uses. No parish, no passenger list, no coat of arms of a colonial Morel.
- **Crooke.** The same discipline. If the family does not yet know the older country or town, the page says that.

The map is a later layer. Pins appear only for places a person in the family names. No arrow from "the Dominican Republic" to "New York" unless someone tells that journey in their own words. Jesus's work on Arc in the New York area is not, by itself, the family's migration story.

Public record sets listed in the FamilySearch section are optional homework for a later phase. They are not a source for copy on day one.

### Oral history and recipes

Mami is the first narrator. A recording or a careful note is better than a polished rewrite that loses her voice. Each story starts with who told it and, if they want, when.

Questions to take to her, on paper, not on the website:

- What should this site call you?
- What do you want your grandchildren's cousins to know about Charles?
- What do you want them to know about your own people?
- Which names may be written, and which stay in the family and off the page?
- A recipe you want in the book, including the part that is never written down.
- A story you tell whenever everyone is in the same room.
- Who may have the link, and what must not be on it even then.
- May a photograph of you be on the frontispiece?

Elizabeth and Yodernis get the same courtesy before their chapters exist. A sister may decline. The tree can say "a sister" or omit a requested detail. It cannot argue with the person.

Recipes name the cook. They do not need a biography.

### Memorial for Charles

A quiet page, not a social-media tribute wall.

- His name, and "father," and whatever else Mami and the children choose to say.
- One photograph if they have one they want used. If the only picture is damaged, a restored file may sit beside it, labeled as a restoration.
- No guest book, no comments, no candles animation, no AI voice.
- Stories about him are signed by the person who told them.
- Nothing about the manner of his death unless the family writes that sentence themselves and asks for it on the page.

### Art, with Grok Imagine, through a later build

This proposal does not generate images. A later build, if Jesus asks, can use Grok Imagine to make **studies** from briefs he approves. The build bot is the maker. The family is the editor.

Good jobs for it:

- Emblem studies from Study A, B, and C, several versions, flat and heraldic, not a photograph of armor.
- Chapter opener illustrations: an empty table, a closed book, a shoreline with no recognizable real house unless Jesus describes one from memory.
- A bookplate or favicon drawn from the chosen emblem.
- A decorative initial for "The Book of the Crookes."

Bad jobs for it:

- A face of an ancestor who was never photographed, presented as a portrait from life.
- "Charles as a young man" as if it were a photo.
- A copy of any existing Crooke, Morel, royal, or clan achievement.
- Crowns, castles, or a Dominican or British flag used as if the family held an office.
- Animation of Charles.

Each kept image gets a caption: "Artwork made for this site, [year]. Not a photograph. Not a grant of arms." The prompt can live in the vault so the family can regenerate a study. It does not need to be on the share-only page.

Practical brief shape, for when that work is allowed:

> A flat heraldic shield on ivory paper, an open book above a single wavy band, a small palm frond as the crest, deep green and wine red, no crown, no animals, no flags, no text except a blank scroll, not a copy of any real coat of arms, centered, plenty of margin.

Jesus edits the brief. The model does not get to add symbolism he did not ask for.

## 5. What to collect

Collect into a private folder Jesus controls (a private album or drive), not into this git repository.

| Source | Ask for | Leave out of the share-only site | Leave out of git |
|---|---|---|---|
| Photos | Prints and camera rolls of Mami, Charles, the sisters, Jesus, meals, houses | GPS, faces of people who have not agreed, minors | Originals and EXIF. Publish only a stripped, resized derivative, the way Arc already strips portfolio masters |
| Documents | Baptism, marriage, death, naturalization, letters, in family hands | Certificate numbers, full dates of the living, addresses | Scans |
| Mami's interviews | Audio or notes, her wording, her yes to each story | Anything she marks "not for the page" | The audio files |
| Sisters | A yes or a no, and any story they want in their chapter | A chapter written about them without that yes | Their messages |
| Recipes | Ingredients and the spoken method | Nothing sensitive, unless a story attached to the recipe has a private detail | Optional. A recipe text is fine in the private notes until the wording is approved |
| DNA | Only if someone has already tested and wants a private note | Ethnicity maps, match names, shared segments, raw data | Raw DNA files, screenshots of match lists |
| Public records | Optional later. FamilySearch and the Library of Congress guides above | Other people's records. Copyrighted scans | Downloads from Ancestry or FamilySearch |

A fact on the site should be one of three kinds, written where the reader can see it:

- **Told by** a named person.
- **Paper we hold**, described, not uploaded, unless it is in the vault and contains nothing that identifies a living person beyond the family's choice.
- **Artwork**, with the caption above.

"Not yet asked" is a fourth state, and it is better than a guess.

## 6. Phased plan

No site work starts from this document. Each phase is a decision Jesus can stop.

**Phase 0. This proposal.** Read it. Pick a direction, or mix them as recommended. Pick a motto or send it back. Do not merge anything until he wants a build.

**Phase 1. Consent and the shoebox.** Talk with Mami. Ask Elizabeth and Yodernis. Write down what may be said. Gather photos and papers in a private drive. Strip nothing onto GitHub.

**Phase 2. The mark.** Jesus designs the emblem, using Imagine only for studies if he wants them. The "not a grant" sentence is part of the design, not a footnote added later.

**Phase 3. The shell.** A secret path, robot headers, frontispiece, empty book, family-view tree of the people who agreed, memorial page with only approved words. No vault yet. No dates of the living. Still no merge to `main` without his approval, same as every Arc change.

**Phase 4. The book.** Chapters filled from Phase 1, in the speaker's words. Recipes. The tree links to chapters.

**Phase 5. The vault.** A passphrase in front of scans, audio, and fuller notes. The passphrase is a Netlify environment variable, not a string in the repository. It must not be site-wide Netlify password protection, because that would lock `arcsignco.com` itself. The public Arc pages stay public.

**Phase 6. Time and place.** Timeline years and map pins, only where a tag says who told it. Origins pages stay short.

**Phase 7. A printed PDF.** Optional. MyHeritage's "charts and books" idea, done by hand: the share-only book, exported for the family, with the vault left out of the file.

Stop conditions: a sister says no; Mami does not want a site; the only material on hand is sensitive. A frontispiece and a memorial can exist without a tree. A tree of names is not required to honor Charles.

## 7. Privacy and risks

### Do not put these on the share-only site

Even at a secret URL:

- Social Security numbers, identity-document numbers, passport numbers, full dates of birth of living people
- Street addresses, phone numbers, personal emails, schools, employers, medical details
- Immigration file numbers, or a combination of full name, date of birth, and place that is enough to impersonate someone
- Raw DNA, match lists, or ethnicity screenshots
- Photographs that still contain GPS, or pictures of minors
- Scans of certificates

A password is appropriate for anything in that list that the family still wants online at all. Prefer not to put it online. A private drive and a printed book solve most of the real need.

### What a secret path does and does not do

It keeps the page out of the Arc nav and, with `noindex, nofollow` and `X-Robots-Tag`, asks crawlers to skip it. The same pattern is already used for GWB, Dynasty, and Corderitos. It does not stop a person with the link. Assume the link will be forwarded in a family chat. Write the share-only pages so that a forwarded link is embarrassing at worst, not dangerous.

The vault passphrase is the control for private material. Share it with the people who should see scans, not with everyone who may see the book. Change it if the chat leaks. Do not store the passphrase in this repository.

### Other risks

- **Public GitHub.** Anything committed here can be cloned. Private media stays off the branch. This proposal is safe to commit because it contains no dates of birth, no addresses, and no documents.
- **Heraldic misunderstanding.** A screenshot of the emblem will travel without the caption. Put the "not a grant" line on the image itself, in the scroll or just under the shield, so a crop still tells the truth.
- **AI as evidence.** A restored or invented face will be believed. Restorations sit next to the original. Inventions are not used.
- **Collaborative trees.** A profile on Geni, WikiTree, or a public Ancestry tree is a publication, hard to pull back once copied. Out of scope until the family asks.
- **Copyright.** Record images from Ancestry, MyHeritage, and similar sites stay on those sites. Family photographs they took are theirs to use, with the people in the picture considered.
- **Grief.** Charles's page is for the family. It does not need to be complete to be respectful. It needs to be true to what they chose to say.
- **Minors.** None are named in this brief. If any are added later, they need a parent's decision, and the page still omits sensitive data. WikiTree's rule (a parent, and still almost nothing sensitive) is the right severity.
- **Analytics.** GoatCounter is on the league dashboards. Do not add it here by habit. A family memorial does not need a hit counter. If Jesus wants to know whether his mother could open the link, ask her.

### A password, in one paragraph

The book can be share-only, the way the other hidden sites are, provided it stays at names, stories, recipes, and a memorial the family has approved. The vault, if it exists, gets its own passphrase, checked server-side, with the secret in the Netlify UI. Living people's sensitive data does not go in either place.

## 8. What this pull request is

A single markdown file: `docs/proposals/crooke-family-site-grok.md`.

It does not add a path, a page, a header, a redirect, an image, or a function. It should not be merged as if it were a launch. A later PR, after Jesus picks a direction, would build the shell.
