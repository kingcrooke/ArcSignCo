/** @typedef {typeof import('./interview-config.js')} */
export const JESUS_WHATSAPP_E164 = ""; // PLACEHOLDER — set digits only (no +). Until set, the page asks them to WhatsApp whoever shared the link.

export const STORAGE_KEY = "crooke-interview-wizard-v2";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** ~90s at low bitrate; wizard stops early if blob nears 8 MB */
export const MAX_RECORD_SECONDS = 90;

export const SITE_INTERVIEW_PATH = "/crooke-7c3a9e12/interview/";
