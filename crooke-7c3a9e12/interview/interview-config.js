/** @typedef {typeof import('./interview-config.js')} */

/**
 * WhatsApp voice-note button.
 * Set digits only, no + or spaces, for example "18095551212".
 * Leave this empty to hide the button. The interview then points people
 * at the audio upload instead of opening a chat with nobody.
 */
export const WHATSAPP_NUMBER = "";

export const STORAGE_KEY = "crooke-interview-wizard-v2";

export const MEDIA_DB_NAME = "crooke-interview-media";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Room left under Netlify's about-8 MB submission cap for multipart framing. */
export const FORM_HEADROOM_BYTES = 64 * 1024;

/** Show a size warning once the whole interview reaches this total. */
export const SIZE_WARN_BYTES = 6 * 1024 * 1024;

/** Recorder target. ~90s stays far under one submission. */
export const AUDIO_BITS_PER_SECOND = 32000;

/** ~90s at low bitrate; wizard stops early if a take nears 8 MB */
export const MAX_RECORD_SECONDS = 90;

export const SITE_INTERVIEW_PATH = "/crooke-7c3a9e12/interview/";
