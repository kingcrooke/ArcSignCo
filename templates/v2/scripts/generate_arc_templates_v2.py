#!/usr/bin/env python3
"""Arc Signage Co LLC - blank Estimate/Proposal + Invoice templates (v2).

Builds two matching DOCX templates (python-docx), then PDF previews via
LibreOffice headless and a page-1 PNG preview via pdftoppm.

Branding follows the existing Arc proposal standard (navy #0B1D33 / gold #D4A843,
see /workspace/arc-signage/pm-templates/arc-proposal-template/). One font (Arial)
throughout. Placeholders are in [BRACKETS] and colored amber so they stand out.

Usage:  python3 generate_arc_templates_v2.py
Outputs (same folder): Arc_Estimate_Template_v2.docx/.pdf/.png,
                       Arc_Invoice_Template_v2.docx/.pdf/.png
"""
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

from lib_paths import LOGO, OUT

OUT.mkdir(parents=True, exist_ok=True)

FONT = "Arial"
NAVY = RGBColor(0x0B, 0x1D, 0x33)
GOLD = RGBColor(0xD4, 0xA8, 0x43)
DARK = RGBColor(0x1F, 0x29, 0x37)
GRAY = RGBColor(0x6B, 0x72, 0x80)
PH = RGBColor(0xB4, 0x5F, 0x06)  # placeholder amber
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
NAVY_HEX, GOLD_HEX, LIGHT_HEX, RULE_HEX = "0B1D33", "D4A843", "F4F5F7", "D9DDE3"

COMPANY = [
    ("Arc Signage Co LLC", True),
    ("1974 Crotona Ave, Bronx, NY 10457", False),
    ("(347) 450-2110 (call or text)", False),
    ("jc@arcsignco.com", False),
    ("arcsignco.com", False),
]

LINE_ITEMS = [
    ("Design", "Design / artwork adaptation, layout, and proofs for client approval. [DETAILS]"),
    ("Engineering drawings", "Shop / fabrication drawings. PE-stamped drawings, if required, are provided by a third-party licensed Professional Engineer. [DETAILS]"),
    ("Fabrication", "[SIGN TYPE · SIZE · MATERIALS · FINISH · ILLUMINATION]"),
    ("Installation", "Delivery and installation within New York / tri-state. [SITE CONDITIONS · ACCESS · EQUIPMENT]"),
    ("Permit coordination", "Coordination and document support for permit applications filed by the responsible licensed party. Agency and filing fees not included. [DETAILS]"),
]
BLANK_ROWS = 1

EXCLUSIONS = [
    "Electrical work by the project's licensed electrician; Arc is not an electrical contractor.",
    "PE-stamped engineering drawings, when required, are provided by a third-party licensed Professional Engineer.",
    "Permit, filing, and agency fees (e.g., LPC / DOB), unless listed above as a line item.",
    "Structural, masonry, or wall repair and painting.",
    "Rush premium beyond the stated lead time (available on request).",
]
NOTES = [
    "Client provides final artwork / logo files (vector preferred).",
    "Final artwork and shop drawings are subject to client sign-off before production.",
    "Standard installation conditions assumed; unusual substrates or site conditions may require a change order.",
    "1-year warranty on Arc-supplied fabrication and installation workmanship.",
    "Sales tax (8.875%) applies unless the client provides a valid sales tax exemption or resale certificate before invoicing.",
]


# ---------------------------------------------------------------- helpers
def shade(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)


def cell_borders(cell, **edges):
    """edges: top/bottom/left/right = (size_eighths, hex) or None for nil."""
    tcPr = cell._tc.get_or_add_tcPr()
    b = tcPr.find(qn("w:tcBorders"))
    if b is None:
        b = OxmlElement("w:tcBorders")
        tcPr.append(b)
    for edge in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{edge}")
        spec = edges.get(edge)
        if spec is None:
            el.set(qn("w:val"), "nil")
        else:
            el.set(qn("w:val"), "single")
            el.set(qn("w:sz"), str(spec[0]))
            el.set(qn("w:color"), spec[1])
        b.append(el)


def no_borders(table):
    for row in table.rows:
        for c in row.cells:
            cell_borders(c)


def cell_margins(table, top=40, bottom=40, left=80, right=80):
    tblPr = table._tbl.tblPr
    m = OxmlElement("w:tblCellMar")
    for k, v in (("top", top), ("left", left), ("bottom", bottom), ("right", right)):
        e = OxmlElement(f"w:{k}")
        e.set(qn("w:w"), str(v))
        e.set(qn("w:type"), "dxa")
        m.append(e)
    tblPr.append(m)


def set_widths(table, widths):
    table.autofit = False
    tblPr = table._tbl.tblPr
    layout = OxmlElement("w:tblLayout")
    layout.set(qn("w:type"), "fixed")
    tblPr.append(layout)
    for row in table.rows:
        for i, w in enumerate(widths):
            row.cells[i].width = Inches(w)
    grid = table._tbl.tblGrid
    for i, gc in enumerate(grid.findall(qn("w:gridCol"))):
        gc.set(qn("w:w"), str(int(widths[i] * 1440)))


def para_fmt(p, before=0, after=0, align=None, line=1.0):
    pf = p.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    pf.line_spacing = line
    if align is not None:
        p.alignment = align


def add_text(p, text, size=8.5, bold=False, color=DARK, italic=False, caps=False):
    """Adds text; any [BRACKETED] span is rendered as an amber placeholder."""
    import re
    parts = re.split(r"(\[[^\]]+\])", text)
    for part in parts:
        if not part:
            continue
        r = p.add_run(part)
        r.font.name = FONT
        r._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
        r.font.size = Pt(size)
        r.font.italic = italic
        r.font.all_caps = caps
        if part.startswith("[") and part.endswith("]"):
            r.font.bold = True
            r.font.color.rgb = PH
        else:
            r.font.bold = bold
            r.font.color.rgb = color
    return p


def cell_text(cell, text, size=8.5, bold=False, color=DARK, align=None, first=True, before=0, after=0, caps=False):
    p = cell.paragraphs[0] if first and not cell.paragraphs[0].runs and cell.paragraphs[0].text == "" else cell.add_paragraph()
    para_fmt(p, before=before, after=after, align=align)
    add_text(p, text, size=size, bold=bold, color=color, caps=caps)
    return p


def section_label(cell_or_doc, text, table_cell=True):
    tgt = cell_or_doc
    p = tgt.paragraphs[0] if table_cell and tgt.paragraphs[0].text == "" and not tgt.paragraphs[0].runs else tgt.add_paragraph()
    para_fmt(p, before=0, after=2)
    add_text(p, text, size=7.5, bold=True, color=NAVY, caps=True)
    # gold underline
    pPr = p._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    bot = OxmlElement("w:bottom")
    bot.set(qn("w:val"), "single"); bot.set(qn("w:sz"), "8"); bot.set(qn("w:space"), "1"); bot.set(qn("w:color"), GOLD_HEX)
    bdr.append(bot); pPr.append(bdr)
    return p


def bullets(cell, items, size=7.5):
    for it in items:
        p = cell.add_paragraph()
        para_fmt(p, before=0, after=0.5)
        p.paragraph_format.left_indent = Inches(0.12)
        p.paragraph_format.first_line_indent = Inches(-0.12)
        r = p.add_run("•  ")
        r.font.name = FONT; r.font.size = Pt(size); r.font.color.rgb = GOLD; r.font.bold = True
        add_text(p, it, size=size)


def gold_rule(doc, before=2, after=6, size=12):
    p = doc.add_paragraph()
    para_fmt(p, before=before, after=after)
    pPr = p._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    bot = OxmlElement("w:bottom")
    bot.set(qn("w:val"), "single"); bot.set(qn("w:sz"), str(size)); bot.set(qn("w:space"), "1"); bot.set(qn("w:color"), GOLD_HEX)
    bdr.append(bot); pPr.append(bdr)
    r = p.add_run(""); r.font.size = Pt(2)
    return p


def spacer(doc, pts=4):
    p = doc.add_paragraph()
    para_fmt(p)
    r = p.add_run(""); r.font.size = Pt(pts)
    p.paragraph_format.line_spacing = Pt(pts)


def add_page_field(p, size=7):
    for instr in ("PAGE",):
        r = p.add_run(); r.font.name = FONT; r.font.size = Pt(size); r.font.color.rgb = GRAY
        f1 = OxmlElement("w:fldChar"); f1.set(qn("w:fldCharType"), "begin")
        it = OxmlElement("w:instrText"); it.set(qn("xml:space"), "preserve"); it.text = instr
        f2 = OxmlElement("w:fldChar"); f2.set(qn("w:fldCharType"), "end")
        r._r.append(f1); r._r.append(it); r._r.append(f2)


# ---------------------------------------------------------------- builder
def build(kind, logo_path: Path | None = None, suffix: str = "", logo_width_inches: float = 2.2):
    est = kind == "estimate"
    doc = Document()
    st = doc.styles["Normal"]
    st.font.name = FONT
    st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    st.font.size = Pt(8.5)
    st.font.color.rgb = DARK

    sec = doc.sections[0]
    sec.page_width, sec.page_height = Inches(8.5), Inches(11)
    sec.left_margin = sec.right_margin = Inches(0.6)
    sec.top_margin = Inches(0.35)
    sec.bottom_margin = Inches(0.5)
    sec.footer_distance = Inches(0.25)
    sec.header_distance = Inches(0.25)
    CW = 7.3

    # footer
    fp = sec.footer.paragraphs[0]
    para_fmt(fp, align=WD_ALIGN_PARAGRAPH.CENTER)
    pPr = fp._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr"); top = OxmlElement("w:top")
    top.set(qn("w:val"), "single"); top.set(qn("w:sz"), "6"); top.set(qn("w:space"), "4"); top.set(qn("w:color"), GOLD_HEX)
    bdr.append(top); pPr.append(bdr)
    add_text(fp, "Arc Signage Co LLC  ·  1974 Crotona Ave, Bronx, NY 10457  ·  (347) 450-2110  ·  jc@arcsignco.com  ·  arcsignco.com  ·  Page ",
             size=7, color=GRAY)
    add_page_field(fp)

    # ---- header: logo | company block | title + meta
    ht = doc.add_table(rows=1, cols=3)
    no_borders(ht); cell_margins(ht, 0, 0, 0, 0)
    set_widths(ht, [2.35, 2.05, 2.9])
    lc, cc, rc = ht.rows[0].cells
    lp = lc.paragraphs[0]; para_fmt(lp, before=2)
    lp.add_run().add_picture(str(logo_path or LOGO), width=Inches(logo_width_inches))
    cc.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
    for i, (line, b) in enumerate(COMPANY):
        cell_text(cc, line, size=8.5 if b else 7.5, bold=b, color=NAVY if b else DARK, first=(i == 0), after=0.5)
    for p in cc.paragraphs:
        p.paragraph_format.left_indent = Inches(0.12)
    tp = rc.paragraphs[0]; para_fmt(tp, after=4, align=WD_ALIGN_PARAGRAPH.RIGHT)
    add_text(tp, "ESTIMATE / PROPOSAL" if est else "INVOICE", size=15 if est else 20, bold=True, color=NAVY)
    if est:
        meta = [("Estimate No.", "ARC-[YYYY]-[MMDD]-[XXX]"),
                ("Date", "[DATE]"),
                ("Valid until", "[DATE + 30 DAYS]"),
                ("Prepared by", "Jesus Crooke")]
    else:
        meta = [("Invoice No.", "INV-[YYYY]-[MMDD]-[XXX]"),
                ("Invoice date", "[DATE]"),
                ("Due date", "[DUE DATE]"),
                ("Estimate ref.", "ARC-[YYYY]-[MMDD]-[XXX]")]
    mt = rc.add_table(rows=len(meta), cols=2)
    no_borders(mt); cell_margins(mt, 25, 25, 60, 60)
    mt.alignment = WD_TABLE_ALIGNMENT.RIGHT
    set_widths(mt, [0.95, 1.95])
    for i, (k, v) in enumerate(meta):
        a, b = mt.rows[i].cells
        shade(a, LIGHT_HEX); shade(b, LIGHT_HEX)
        cell_borders(a, bottom=(4, "FFFFFF")); cell_borders(b, bottom=(4, "FFFFFF"))
        cell_text(a, k, size=7.5, bold=True, color=GRAY, caps=True)
        cell_text(b, v, size=8.5, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.RIGHT)

    gold_rule(doc, before=2, after=4, size=16)

    # ---- client / project
    ct = doc.add_table(rows=1, cols=2)
    no_borders(ct); cell_margins(ct, 30, 30, 100, 100)
    set_widths(ct, [3.6, 3.7])
    a, b = ct.rows[0].cells
    shade(a, LIGHT_HEX); shade(b, LIGHT_HEX)
    cell_borders(a, left=(18, NAVY_HEX)); cell_borders(b, left=(18, NAVY_HEX))
    section_label(a, "Bill to / Client")
    for k, v in [("Client name", "[CLIENT NAME]"), ("Company", "[COMPANY]"), ("Contact", "[CONTACT NAME / TITLE]"),
                 ("Phone", "[PHONE]"), ("Email", "[EMAIL]"), ("Billing address", "[BILLING ADDRESS]")]:
        p = a.add_paragraph(); para_fmt(p, after=1)
        add_text(p, f"{k}:  ", size=8, bold=True, color=GRAY); add_text(p, v, size=8)
    section_label(b, "Project")
    for k, v in [("Project name", "[PROJECT NAME]"), ("Site address", "[SITE ADDRESS]"),
                 ("GC / Owner", "[GC / OWNER — if applicable]"), ("GC / Owner contact", "[NAME · PHONE · EMAIL — if applicable]"),
                 ("Scope summary", "[ONE-LINE SCOPE SUMMARY]")]:
        p = b.add_paragraph(); para_fmt(p, after=1)
        add_text(p, f"{k}:  ", size=8, bold=True, color=GRAY); add_text(p, v, size=8)

    spacer(doc, 4)

    # ---- line items
    widths = [0.35, 3.75, 0.55, 0.6, 0.95, 1.1]
    n = len(LINE_ITEMS) + BLANK_ROWS
    lt = doc.add_table(rows=1 + n, cols=6)
    no_borders(lt); cell_margins(lt, 16, 16, 70, 70)
    set_widths(lt, widths)
    hdr = ["#", "Description", "Qty", "Unit", "Rate", "Amount"]
    for i, h in enumerate(hdr):
        c = lt.rows[0].cells[i]; shade(c, NAVY_HEX)
        cell_text(c, h, size=7.5, bold=True, color=WHITE, caps=True,
                  align=WD_ALIGN_PARAGRAPH.RIGHT if i >= 2 else WD_ALIGN_PARAGRAPH.LEFT)
    rows = LINE_ITEMS + [("[ADDITIONAL ITEM]", "[DESCRIPTION]")] * BLANK_ROWS
    for r, (title, detail) in enumerate(rows, start=1):
        cells = lt.rows[r].cells
        for c in cells:
            cell_borders(c, bottom=(4, RULE_HEX))
            c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
            if r % 2 == 0:
                shade(c, "FAFBFC")
        cell_text(cells[0], f"{r:02d}", size=8, bold=True, color=GOLD)
        cell_text(cells[1], title, size=8.5, bold=True, color=NAVY)
        cell_text(cells[1], detail, size=7.5, color=GRAY, first=False)
        for i, v in zip(range(2, 6), ["[QTY]", "[UNIT]", "[RATE]", "[AMOUNT]"]):
            cell_text(cells[i], v, size=7.5, align=WD_ALIGN_PARAGRAPH.RIGHT)

    spacer(doc, 3)

    # ---- totals (right) + short note (left)
    tt = doc.add_table(rows=1, cols=2)
    no_borders(tt); cell_margins(tt, 0, 0, 0, 0)
    set_widths(tt, [3.9, 3.4])
    left, right = tt.rows[0].cells
    if est:
        section_label(left, "Lead time & validity")
        p = left.add_paragraph(); para_fmt(p, after=2)
        add_text(p, "Lead time: ", size=8, bold=True, color=NAVY)
        add_text(p, "approximately 6 weeks after written approval, deposit, and final artwork approval.", size=8)
        p = left.add_paragraph(); para_fmt(p, after=2)
        add_text(p, "Validity: ", size=8, bold=True, color=NAVY)
        add_text(p, "this estimate is valid for 30 days from the date above.", size=8)
    else:
        section_label(left, "Payment terms")
        bullets(left, [
            "50% deposit due before any work starts; work is scheduled once the deposit is received.",
            "25% due when production is confirmed, before install.",
            "Final 25% plus any additional costs due Net 30.",
        ])
    tot_rows = [
        ("Subtotal", "[SUBTOTAL]", False),
        ("Sales tax (8.875%)", "[TAX]", False),
        ("Total", "[TOTAL]", True),
        ("Deposit (50%)", "[DEPOSIT]", False),
        ("Production (25%)", "[PRODUCTION]", False),
        ("Final (25%) + additional costs", "[FINAL]", False),
        ("Amount paid", "[AMOUNT PAID]", False),
        ("Balance due", "[BALANCE DUE]", True),
    ]
    tot = right.add_table(rows=len(tot_rows), cols=2) if right.paragraphs[0].text == "" else None
    # python-docx places nested table after the first (empty) paragraph; fine.
    no_borders(tot); cell_margins(tot, 22, 22, 80, 80)
    tot.alignment = WD_TABLE_ALIGNMENT.RIGHT
    set_widths(tot, [2.05, 1.35])
    for i, (k, v, strong) in enumerate(tot_rows):
        a, b = tot.rows[i].cells
        if strong:
            shade(a, NAVY_HEX); shade(b, NAVY_HEX)
            cell_text(a, k, size=9, bold=True, color=WHITE, caps=True)
            p = cell_text(b, "", size=9, align=WD_ALIGN_PARAGRAPH.RIGHT)
            r = p.add_run(v); r.font.name = FONT; r.font.size = Pt(9); r.font.bold = True; r.font.color.rgb = GOLD
        else:
            cell_borders(a, bottom=(4, RULE_HEX)); cell_borders(b, bottom=(4, RULE_HEX))
            cell_text(a, k, size=8, color=DARK)
            cell_text(b, v, size=8, align=WD_ALIGN_PARAGRAPH.RIGHT)
    # remove the empty leading paragraph in the right cell spacing
    para_fmt(right.paragraphs[0])

    spacer(doc, 4)

    # ---- terms grid
    g = doc.add_table(rows=1, cols=2)
    no_borders(g); cell_margins(g, 0, 0, 0, 100)
    set_widths(g, [3.65, 3.65])
    gl, gr = g.rows[0].cells
    if est:
        section_label(gl, "Payment terms")
        bullets(gl, [
            "50% deposit due before any work starts; work is scheduled once the deposit is received.",
            "25% due when production is confirmed, before install.",
            "Final 25% plus any additional costs due Net 30.",
        ])
    else:
        section_label(gl, "Lead time")
        p = gl.add_paragraph(); para_fmt(p, after=2)
        add_text(p, "Approximately 6 weeks after written approval, deposit, and final artwork approval.", size=8)
    section_label(gl, "Payment methods")
    bullets(gl, [
        "ACH, check, or wire. Checks payable to Arc Signage Co LLC.",
        "Credit card by online payment link; a 3.5% processing fee applies.",
        ("Please include the invoice number in the payment memo." if not est else "Payment details are provided on the invoice."),
        "Our banking details never change by email. Call (347) 450-2110 to verify before sending payment.",
    ])
    section_label(gr, "Exclusions")
    bullets(gr, EXCLUSIONS)
    section_label(gr, "Notes & assumptions")
    bullets(gr, NOTES)

    spacer(doc, 4)

    if est:
        # ---- acceptance / signature
        section_label(doc, "Acceptance", table_cell=False)
        p = doc.add_paragraph(); para_fmt(p, after=2)
        add_text(p, "By signing below, the client accepts the scope, pricing, and terms of this estimate and authorizes Arc Signage Co LLC to proceed upon receipt of the deposit.", size=8)
        st_ = doc.add_table(rows=1, cols=2)
        no_borders(st_); cell_margins(st_, 0, 0, 0, 200)
        set_widths(st_, [3.65, 3.65])
        a, b = st_.rows[0].cells
        cell_text(a, "ACCEPTED BY CLIENT", size=7.5, bold=True, color=NAVY)
        cell_text(b, "FOR ARC SIGNAGE CO LLC", size=7.5, bold=True, color=NAVY)
        for c, lines in ((a, ["Client name", "Signature", "Date"]), (b, ["Jesus Crooke, Principal", "Signature", "Date"])):
            for ln in lines:
                p = c.add_paragraph(); para_fmt(p, before=3, after=0)
                pPr = p._p.get_or_add_pPr()
                bdr = OxmlElement("w:pBdr"); bot = OxmlElement("w:bottom")
                bot.set(qn("w:val"), "single"); bot.set(qn("w:sz"), "6"); bot.set(qn("w:space"), "1"); bot.set(qn("w:color"), "9CA3AF")
                bdr.append(bot); pPr.append(bdr)
                add_text(p, " ", size=8)
                q = c.add_paragraph(); para_fmt(q, after=0)
                add_text(q, ln, size=7, color=GRAY)
    else:
        # ---- remittance + thank you
        section_label(doc, "Remit payment to", table_cell=False)
        rt = doc.add_table(rows=1, cols=2)
        no_borders(rt); cell_margins(rt, 50, 50, 100, 100)
        set_widths(rt, [3.65, 3.65])
        a, b = rt.rows[0].cells
        shade(a, LIGHT_HEX); shade(b, LIGHT_HEX)
        for c, rows_ in ((a, [("Payee", "Arc Signage Co LLC"), ("Checks payable to", "Arc Signage Co LLC"),
                              ("Mail checks to", "83 Post Avenue, Apt 34, New York, NY 10034"), ("Card", "[ONLINE PAYMENT LINK]")]),
                         (b, [("Bank", "[BANK NAME]"), ("ACH routing", "[ACH ROUTING NO.]"), ("Wire routing", "[WIRE ROUTING NO.]"),
                              ("Account no.", "[ACCOUNT NO.]"), ("SWIFT (intl.)", "[SWIFT CODE]")])):
            for k, v in rows_:
                p = c.add_paragraph() if c.paragraphs[0].runs else c.paragraphs[0]
                para_fmt(p, after=1)
                add_text(p, f"{k}:  ", size=8, bold=True, color=GRAY); add_text(p, v, size=8)
        spacer(doc, 6)
        p = doc.add_paragraph(); para_fmt(p, after=0, align=WD_ALIGN_PARAGRAPH.CENTER)
        add_text(p, "Thank you for your business!", size=11, bold=True, color=NAVY)
        p = doc.add_paragraph(); para_fmt(p, after=0, align=WD_ALIGN_PARAGRAPH.CENTER)
        add_text(p, "Questions about this invoice? Call or text (347) 450-2110 or email jc@arcsignco.com.", size=8, color=GRAY)

    base = "Arc_Estimate_Template_v2" if est else "Arc_Invoice_Template_v2"
    name = f"{base}{suffix}"
    core = doc.core_properties
    core.author = "Arc Signage Co LLC"
    core.title = ("Arc Signage Co LLC — Estimate / Proposal Template v2" if est
                  else "Arc Signage Co LLC — Invoice Template v2")
    path = OUT / f"{name}.docx"
    doc.save(path)
    return path


if __name__ == "__main__":
    from convert_docx import convert_docx

    for k in ("estimate", "invoice"):
        d = build(k)
        pdf, png = convert_docx(d, OUT)
        print(d, pdf, png)
