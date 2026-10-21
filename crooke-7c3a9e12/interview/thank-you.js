import { SITE_INTERVIEW_PATH } from "./interview-config.js";

const interviewUrl = new URL(SITE_INTERVIEW_PATH, location.origin).href;
const para = new URLSearchParams(location.search).get("para");
const linkWithPara = para
  ? `${interviewUrl}?para=${encodeURIComponent(para.trim().slice(0, 120))}`
  : interviewUrl;

const shareText =
  `Hola — te invito a compartir recuerdos para el libro de la familia (paso a paso, en español o inglés). Solo tu nombre es obligatorio.\n\n` +
  `Hi — I'm inviting you to share memories for the family book (step by step, Spanish or English). Only your name is required.\n\n` +
  linkWithPara;

const waShare = document.getElementById("wa-share");
if (waShare) {
  waShare.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
}
