# Proposal: Crooke Family Heritage Site (Composer)

**Status:** Planning only — no implementation in this document  
**Stakeholder:** Jesus Crooke (Designer)  
**Requested site type:** 5th hidden, share-only experience on `arcsignco.com` (alongside GWB, Dynasty, Corderitos; NovaStage referenced in product brief — not present in repo at proposal time)  
**Author:** Cloud Agent (Composer)  
**Date:** 2026-10-11  

---

## Executive summary

Jesus envisions a private family heritage site in the spirit of noble houses and great genealogical platforms: a **crest and motto**, an **interactive family tree**, a **Book of the Crookes** in chapters, timelines, origins (Dominican **Morel** line and **Crooke** line), oral history, recipes, and a **memorial** for his late father **Charles Crooke**, with strong **privacy for living relatives** (especially **Mary Thelma Morel de Crooke**, “Mami”; sisters **Elizabeth** and **Yodernis**).

This proposal recommends **three distinct design directions**, a **tab/sitemap**, **data to collect**, a **phased build plan**, **privacy guardrails**, and **illustration workflow** (including Grok Imagine via the Build bot). **No genealogical claims are verified here** — all lineage content should be sourced and labeled by the family.

**Repo hosting pattern (for future implementation only):** Existing hidden sites use opaque path slugs (e.g. `/gwb-fe006a16/`, `/dynasty-1581d86a/`, `/guarderia-dfe200bb/`) with `noindex, nofollow` in HTML and `X-Robots-Tag` in `netlify.toml`, not linked from the public Arc site. A Crooke site would follow the same formula with a new slug such as `/crooke-<secret>/` (exact token chosen at implementation).

---

## 1. Research: ten reference sites and what to steal

Each entry: **URL**, **why it works**, **features / formulas** worth adapting for the Crooke site.

### 1. Ancestry

- **URL:** https://www.ancestry.com/ (tree: https://www.ancestry.com/c/family-tree)
- **Why it’s great:** Polished “consumer genealogy” UX; tree + records + DNA feel like one product; hints reduce blank-page anxiety for beginners.
- **Formulas:** Pedigree / extended-family tree views; per-person **LifeStory**; **Gallery** (photos, stories, audio, video); **Hints** (leaf icons) linking tree nodes to records and other members’ trees; **Face Match** and AI photo suggestions; **Stories** slideshow builder (person, photo, record, map slides); tree **privacy** and **invited collaborators**; DNA **ThruLines** / regional maps when DNA is linked.

### 2. FamilySearch

- **URL:** https://www.familysearch.org/
- **Why it’s great:** Free, global, church-backed archive scale; strong for international (including Latin American) lines; collaborative tree with memories layered on people.
- **Formulas:** **Family Tree** person pages (About, Memories, Timeline, Sources, Relationships); **Memories** gallery (upload, write story, audio, tag to people, albums, privacy per item); **Timeline + map** of life events with optional **historical events** context; **Map my ancestors**; record hints on timeline; **Family Groups** for sharing among relatives.

### 3. MyHeritage

- **URL:** https://www.myheritage.com/
- **Why it’s great:** International user base and multilingual records; standout **photo storytelling** and DNA tools; good reference for diaspora families.
- **Formulas:** Smart Matches / Record Matches across trees; **Deep Nostalgia** / photo enhancement and animation; **DeepStory**-style narrative video from stills; **Theory of Family Relativity** (DNA + records); private vs site-wide tree visibility; emphasis on **visual** preservation alongside genealogy.

### 4. Geni

- **URL:** https://www.geni.com/
- **Why it’s great:** “One big tree” collaboration model; projects and curators for quality control on shared ancestry.
- **Formulas:** Private tree that can merge into **World Family Tree**; profile-centric UX (biography, media, discussions); **Projects** to tag profiles and grant collaborator edit rights; public vs private **discussions**; living-people privacy defaults; relationship path (“how am I related to…”).

### 5. WikiTree

- **URL:** https://www.wikitree.com/
- **Why it’s great:** Gold standard for **privacy on a collaborative single tree** — trusted lists per profile, not per whole tree.
- **Formulas:** **Privacy levels** (Unlisted / Private / Public / Open) with strict rules for living people; **Trusted List** per person; invite-before-profile for most living adults; anonymous placeholders; honor code + deletion policy for sensitive leaks; single shared ancestor profiles (disagreement resolved by consensus, not duplicate trees).

### 6. Clan Donald — Armorial (noble / clan heritage)

- **URL:** https://highcouncilofclandonald.com/introduction-to-the-clan-donald-armorial/
- **Why it’s great:** Treats **heraldry as documented identity** for branches and cadets, not just decoration; educational and authoritative tone.
- **Formulas:** **Armorial** separating chief, chieftain, and cadet arms; crest badges and tartans booklet; “indeterminate cadet” honesty when lineage to chief’s line is unknown; welcomes corrections; ties **names/septs** list to belonging; maternal lines explicitly honored on main council site.

### 7. Clan Donald Society of Edinburgh — Genealogy database

- **URL:** https://www.clandonald.org.uk/genealogy.htm
- **Why it’s great:** Scholarly clan genealogy as a **queryable database** with indexes and succession charts — “big tree” without flashy UI.
- **Formulas:** Person index + surname index; **chief succession charts** by branch; founder → current representer lists; bibliographic tie to published clan histories; regional sub-sites (Australia, Canada, etc.) as parallel entry points.

### 8. The Royal Family (official)

- **URL:** https://www.royal.uk/ (e.g. monarch lists: https://www.royal.uk/united-kingdom-monarchs-1603-present)
- **Why it’s great:** State-grade **institutional storytelling**: role of the monarchy today + deep history + residences + collections + engagements.
- **Formulas:** Era-based **history chapters**; biography pages; authoritative voice; collections and places as parallel nav pillars; “about this site” transparency.

### 9. National Portrait Gallery — Kings and Queens family tree

- **URL:** https://www.npg.org.uk/collections/explore/kings-and-queens-a-family-tree
- **Why it’s great:** **Visual dynasty tree** paired with portraiture — emotion + lineage in one scroll.
- **Formulas:** Dynasty segments (Anglo-Saxons → Windsor); interactive or diagrammatic tree; portraits as human anchors; short era intros before drilling into individuals.

### 10. Historic Royal Palaces — Kings and Queens

- **URL:** https://www.hrp.org.uk/kings-and-queens-of-england-and-britain/
- **Why it’s great:** Narrative **timeline by house** with cultural context (law, architecture, conflict) — history as story, not just dates.
- **Formulas:** Period cards (Normans, Tudors, etc.); conflict and succession explained in plain language; links to physical places (palaces) as memory anchors — analogous to “places our family lived” for Crookes/Morels.

### Cross-cutting patterns (synthesis)

| Pattern | Seen on | Crooke opportunity |
|--------|---------|-------------------|
| Person-centric hub | Ancestry, FamilySearch, Geni | One page per ancestor: story, media, timeline, relationships |
| Tree as home | Ancestry, Geni, WikiTree | Landing on interactive tree with search |
| Book / chapters | Royal sites, HRP era pages | **Book of the Crookes** as primary IA |
| Heraldry portal | Clan Donald | Crest, motto, blazon, “assumed arms” disclaimer |
| Vault | FamilySearch Memories, Ancestry Gallery | Photos, scans, audio interviews |
| Migration map | FamilySearch, Ancestry DNA maps | DR → NYC / tri-state arcs (when documented) |
| Privacy tiers | WikiTree, Geni, FamilySearch | Living = hidden or first-name-only; share link ≠ public index |
| Memorial | Many (implicit) | Dedicated **Charles Crooke** chapter and gallery |

---

## 2. Crooke family site — concepts

### 2.1 Core content pillars (Jesus’s vision mapped)

| Pillar | Description | Primary family anchors |
|--------|-------------|-------------------------|
| **Identity** | Assumed arms, crest, motto, colors | Whole family; Jesus as steward |
| **Tree** | Interactive pedigree + sibling branches | Mami, Charles, Elizabeth, Yodernis, Jesus |
| **Book** | Long-form chapters, printable “volume” feel | Oral history, recipes, migration stories |
| **Timeline** | Generations + key dates (non-sensitive) | Dominican Republic ↔ United States |
| **Origins** | Two-line narrative: **Morel** (Dominican) and **Crooke** (family tradition — verify before publish) | Mami’s line; father’s line |
| **Memorial** | Charles Crooke — photos, tributes, lessons | Private tone, family-authored |
| **Vault** | Documents, audio, video | Scans from Mami, sisters |
| **Living privacy** | No DOB/address/SSN; optional password | All living Crookes/Morels |

### 2.2 Heraldry: crest and motto (honest, new arms)

**Basics (for design, not legal advice):**

- **Shield (arms):** Central symbol field; tinctures (colors) and charges (symbols) should be simple (rule of thumb: recognizable at postage-stamp size).
- **Crest:** Ornament above the helmet in full achievements; for a modern family site, a **crest badge** (crest + wreath) is enough without claiming rank.
- **Motto:** Short phrase (often Latin, Spanish, or English); appears on scroll below shield.
- **Supporters / crowns:** Avoid on an assumed American family site — they imply nobility (per American College of Heraldry guidance).

**Designing new arms honestly (U.S. context):**

- In the U.S., families may **design and adopt original arms** without a government grant; registration with a private heraldic society is optional evidence of use, not “official nobility.”
- **Do not** copy a generic “Crooke coat of arms” from a poster shop or surname-meaning site without proving descent from that armiger.
- **Do** run a good-faith uniqueness check; document meaning of charges (e.g. palm + wave for Caribbean island heritage; compass or bridge for migration; open book for the Book of the Crookes).
- **Label clearly on site:** “Assumed arms of the Crooke family, adopted [year], designed by [names]. Not a grant from a sovereign heraldic authority.”

**Motto directions (brainstorm — family chooses):**

- Spanish: *Raíces y alas* (“Roots and wings”)
- English: *From many shores, one story*
- Bilingual line under motto for Mami’s voice

**Process workshop (Phase 1):** Family votes on 2–3 charge sketches → Jesus refines → vector crest + PNG/WebP for site hero.

### 2.3 Interactive tree

**Recommended behavior (privacy-first):**

- **Public/share view:** Deceased ancestors with full names where appropriate; **living people** as “Living — Crooke” or first name only, no birth year, no locations more specific than country/region unless consented.
- **Interactions:** Pan/zoom; click node → person hub; “path between two people”; filter by line (Morel / Crooke).
- **Data model:** GEDCOM-compatible JSON in repo or edge function later; for MVP, static JSON edited by family.
- **Optional:** Link-out to FamilySearch/WikiTree **private** trees for research — site remains the “beautiful front room,” not the raw database.

### 2.4 Book of the Crookes (chapter format)

**Tone:** Family archive, not Wikipedia. Chapters with title page, epigraph, body, pull quotes, footnotes (“according to Mami, 2026 interview”).

**Suggested volumes:**

1. **Prologue** — Why this site exists; stewardship; privacy promise  
2. **Mami** — Mary Thelma Morel de Crooke (with her consent on every anecdote)  
3. **Charles** — Memorial and legacy  
4. **Sisters** — Elizabeth & Yodernis (only what they approve)  
5. **Morel roots** — Dominican stories, places, food  
6. **Crooke roots** — Stories Charles and elders told (source tags)  
7. **Migration** — Chapters as timeline entries  
8. **Kitchen** — Recipes with photos and voice notes  
9. **Gallery** — Curated albums  
10. **Appendix** — DNA summary (high level), document index, credits  

**UX formulas:** Previous/next chapter; progress bar; “read aloud” for accessibility; export PDF for family reunion (password-gated).

### 2.5 Generations timeline

- Horizontal or vertical timeline with **eras** (e.g. “Morel in [region]”, “Charles & Mary”, “Siblings in New York”).
- Pair with **map pins** only at coarse granularity (country, island, city) unless family opts in.
- Optional **historical context** cards (like FamilySearch) — Dominican history, NYC migration waves — clearly labeled “world events,” not family facts.

### 2.6 Dominican and Crooke origins

- **Two parallel “origin tracks”** on the home page merging into the current generation.
- **Do not fabricate** coats of arms for Morel or Crooke without research; use photography, maps, and oral history until verified.
- Bilingual **ES / EN** toggle (Corderitos site already models ES/EN in-repo).

### 2.7 Oral history and recipes

- **Oral history:** Short clips (1–3 min) embedded per chapter; transcript required; consent checkbox per speaker.
- **Recipes:** Recipe card layout (ingredients, steps, “who taught this”, photo of dish); tie to **Kitchen** volume.

### 2.8 Memorial — Charles Crooke

- Dedicated route/tab: photo mosaic, timeline of **non-sensitive** milestones, family letters, “what he taught us” prompts for siblings to submit.
- Soft design (candle, night palette, or Dominican memorial traditions — family choice).
- No public comments from strangers (share-only site).

### 2.9 Grok Imagine (via Build bot) — art pipeline

Use AI illustration **only where labeled** and family-approved:

| Asset | Prompt direction | Guardrails |
|-------|------------------|------------|
| Crest final color | “Heraldic shield, flat vector style, charges: [list], no crown, no supporters” | Human vector cleanup; blazon text alongside |
| Chapter opener illos | Style-locked (watercolor / linocut) per design direction | No fake “period portraits” of real ancestors unless stylized and labeled |
| Map textures | Stylized Caribbean / Atlantic migration map | No inaccurate flags or claims |
| Photo restoration companion | Use for **damaged scans** after comparing to original | Keep originals in vault |
| Motto scroll / book cover | Typography-led, minimal | Spanish diacritics correct |

**Workflow:** Jesus briefs Build bot → generates variants → family picks → export WebP to `/crooke-<secret>/assets/` at implementation time.

---

## 3. Three design directions

### Direction A — **The Great Book**

- **Metaphor:** Illuminated family codex on a wooden table.
- **Visual language:** Deep burgundy, gold foil accents, serif display (Garamond-like), page-turn transitions, chapter numbers as Roman numerals.
- **Hero:** Open book with crest embossed on cover; tree accessed via “Genealogy” ribbon bookmark.
- **Best for:** Story-first family members; reading on iPad at gatherings.
- **Risk:** Heavy aesthetic can feel “fake noble” — mitigate with honest heraldry disclaimer and warm, modern family photos.

### Direction B — **Caribbean Archive**

- **Metaphor:** Small museum in Santo Domingo + NYC apartment — bright, alive, bilingual.
- **Visual language:** Warm white walls, terracotta and palm green, sans-serif + one serif for Spanish poetry; grid galleries like NPG portraits.
- **Hero:** Split screen: Morel origins | Crooke origins converging to current generation photos.
- **Best for:** Dominican pride, Mami’s voice, recipes and music.
- **Risk:** Needs strong photography; AI art only as accent.

### Direction C — **Living Tree Portal**

- **Metaphor:** Geni/Ancestry-quality dashboard, but private and bespoke.
- **Visual language:** Dark navy UI, crest as favicon, data-dense tree, person drawer from right.
- **Hero:** Full-viewport interactive tree; Book and Memorial as secondary tabs.
- **Best for:** Power users adding data; future GEDCOM import.
- **Risk:** Can feel cold without Book chapters and memorial warmth — blend with Direction A typography in person drawers.

**Recommendation:** **Hybrid B + A** — Caribbean Archive shell with Book chapter interior pages and Direction C’s tree component for genealogy nerds.

---

## 4. Tab / sitemap (proposed IA)

| Tab / nav label | Route (example) | Contents |
|-----------------|-----------------|----------|
| Home | `/` | Welcome, crest, motto, two-line origins teaser, latest chapter |
| Tree | `/tree` | Interactive tree + search |
| Book | `/book` | Volume index + chapter reader |
| Timeline | `/timeline` | Generations + optional map |
| Crest & motto | `/heritage` | Arms, blazon, symbolism, disclaimer, downloads |
| Memorial | `/charles` | Charles Crooke tribute |
| Kitchen | `/recipes` | Recipe grid + detail |
| Vault | `/vault` | Albums, documents (may be password-gated) |
| About & privacy | `/privacy` | What we never publish; contact steward |

**Footer (all pages):** “Private family site — not indexed — do not share link publicly” + year.

**Tech notes (future):** `meta robots noindex,nofollow`; Netlify `X-Robots-Tag`; exclude from `sitemap.xml` and `llms.txt` if desired; optional Netlify **password** or **Identity** for `/vault`.

---

## 5. Data sources to collect

| Source | What to gather | Steward | Sensitivity |
|--------|----------------|---------|-------------|
| **Mami (Mary Thelma Morel de Crooke)** | Oral history sessions, names of ancestors, places, dates (deceased only in detail), photos, recipes | Jesus + sisters | High — consent per story |
| **Elizabeth & Yodernis** | Childhood photos, Charles stories, permissions | Each sister | High |
| **Jesus** | Scans, existing notes, steward workflow | Jesus | Medium |
| **Photo albums** | Labeled envelopes (“DR 1970s”, “NYC”) | Family | Medium |
| **Documents** | Birth/marriage/death certs for **deceased**; immigration papers | Vault only | High — no SSN |
| **DNA** | Ancestry / 23andMe / MyHeritage **high-level** ethnicity + match notes | Optional appendix | No raw kit IDs on web |
| **Existing genealogy** | GEDCOM exports from FamilySearch, Ancestry, WikiTree | Research copy | Keep living filtered |
| **Charles memorial** | Eulogies, funeral program, favorite music list, work history (non-sensitive) | Family | Emotional — single editorial voice |
| **Audio/video** | Phone interviews; transcode to web formats | Jesus | Consent forms |
| **Heraldry workshop** | Sketch PDF, final SVG, motto vote | Jesus + Mami | Low |

**Inventory template (spreadsheet):** `id`, `type`, `subject`, `living/deceased`, `consent_status`, `publish_ok`, `file_path`, `caption_es`, `caption_en`.

---

## 6. Phased plan (implementation — not started)

### Phase 0 — Planning (this PR)

- Approve design direction hybrid and IA.
- Choose secret path slug and whether vault requires password.
- Assign family consent process.

### Phase 1 — Content & identity

- Heraldry workshop; assume arms with disclaimer copy.
- Interview Mami (structured question list); scan 20–50 priority photos.
- Draft Charles memorial chapter.
- Grok Imagine / Build bot passes for crest and chapter art.

### Phase 2 — Static MVP (hidden deploy)

- New folder `crooke-<secret>/` mirroring `guarderia-dfe200bb` pattern.
- Pages: Home, Heritage, Memorial, Book (Prologue + 2 chapters), static tree JSON (core family only).
- `netlify.toml` noindex headers; no links from public site.

### Phase 3 — Rich experience

- Full Book volumes; timeline + map; recipe section; vault with lightbox.
- ES/EN strings; audio embeds.
- Optional Netlify Identity or site password for vault.

### Phase 4 — Maintenance

- Annual “family editor” (Jesus or delegate); add chapters at reunions.
- Review living-people redaction yearly.
- Backup: repo + offline drive for masters.

---

## 7. Privacy, security, and risks

### Never publish on a share-only family site

- Social Security numbers, government ID numbers, full birthdates of **living** people  
- Street addresses, phone numbers, children’s schools, workplace details (unless explicit opt-in)  
- Medical information, financial accounts, passwords  
- Raw DNA files or kit identifiers  
- Information about living people without **documented consent**  

### Share-only ≠ secure

- Anyone with the URL can forward it; treat as **obscurity**, not encryption.
- **Mitigations:** Long random path segment; optional site-wide or `/vault` password; no names in URL slugs; disable Open Graph images that reveal faces if link preview is a concern.

### Search engines

- Use `noindex, nofollow` + `X-Robots-Tag` (consistent with GWB/Dynasty/Corderitos).
- Do not submit URL to Google; block in `robots.txt` only if it does not leak path in comments.

### Emotional and cultural risks

- Disputed ancestry: present **sources** and “family tradition” labels.
- Sibling differences: memorial and living chapters need **per-person approval**.
- AI images: never present as historical photographs of real ancestors.

### Legal (light touch)

- Copyright on photos (who shot them).
- Music on memorial page (licensed or links only).

---

## 8. Open decisions for Jesus

1. Design direction: **A, B, C, or hybrid B+A?**  
2. Default language: **bilingual** or English-first with Spanish parallel?  
3. Password: **whole site** vs **vault only** vs **link-only**?  
4. Tree depth for MVP: how many generations back on first launch?  
5. NovaStage: confirm slug/pattern when that site lands — Crooke should not share secrets across sites.  
6. Steward list: who can approve living-person content after launch?

---

## 9. References (external)

- American Heraldry Society — *An American Heraldic Primer*: https://www.americanheraldry.org/education-resources/an-american-heraldic-primer/  
- American Heraldry Society — *Guidelines for Heraldic Practice*: https://www.americanheraldry.org/education-resources/guidelines-for-heraldic-practice/  
- American College of Heraldry — *Designing Arms*: https://americancollegeofheraldry.org/?page_id=1384  
- FamilySearch — Memories / Timeline help articles (URLs in section 1)  
- WikiTree — Living People / Privacy help (URLs in section 1)  

---

*End of proposal. Implementation requires a separate build PR after family sign-off.*
