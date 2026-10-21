// The site-wide Permissions-Policy disables the microphone. That header is shared
// with every other path, and Netlify combines duplicate header names, so this
// interview document replaces it with microphone=(self) after the file is served.
// Camera stays off. Other pages are not matched.

const INTERVIEW_POLICY =
  "camera=(), microphone=(self), geolocation=(), payment=(), usb=(), browsing-topics=()";

export default async (_request, context) => {
  const response = await context.next();
  response.headers.set("Permissions-Policy", INTERVIEW_POLICY);
  return response;
};

export const config = {
  path: [
    "/crooke-7c3a9e12/interview",
    "/crooke-7c3a9e12/interview/",
    "/crooke-7c3a9e12/interview/index.html",
  ],
  onError: "bypass",
};
