/** Read env in Netlify Functions and in Node tests (process.env fallback). */
export function env(name) {
  if (typeof Netlify !== "undefined" && Netlify.env?.get) return Netlify.env.get(name);
  return process.env[name];
}
