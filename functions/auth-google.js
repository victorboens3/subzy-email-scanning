export async function handler(event) {
  const userId = event.queryStringParameters.userId || "";
  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    redirect_uri:  `${process.env.URL_BASE}/.netlify/functions/auth-google-callback`,
    response_type: "code",
    scope:         "https://www.googleapis.com/auth/gmail.readonly",
    access_type:   "offline",
    state:         encodeURIComponent(userId),
    prompt:        "consent",
  });
  return {
    statusCode: 302,
    headers: {
      Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    }
  };
}