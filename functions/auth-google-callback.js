export async function handler(event) {
  const { code, state } = event.queryStringParameters;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri:  `${process.env.URL_BASE}/.netlify/functions/auth-google-callback`,
      grant_type:    "authorization_code"
    })
  });
  const tokens = await tokenRes.json();
  await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/email_accounts`,
    {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        apikey:         process.env.SUPABASE_KEY,
        Authorization:  `Bearer ${process.env.SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        provider: "google",
        user_id:  decodeURIComponent(state),
        tokens,
      }),
    }
  );
  return {
    statusCode: 200,
    body:       "✅ Gmail conectado com sucesso! Pode fechar esta aba.",
  };
}