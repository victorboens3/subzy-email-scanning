export async function handler(event) {
  const { code, state } = event.queryStringParameters;
  const tokenRes = await fetch(
    `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     process.env.AZURE_CLIENT_ID,
        client_secret: process.env.AZURE_CLIENT_SECRET,
        code,
        grant_type:    "authorization_code",
        redirect_uri:  `${process.env.URL_BASE}/.netlify/functions/auth-microsoft-callback`
      })
    }
  );
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
        provider: "microsoft",
        user_id:  decodeURIComponent(state),
        tokens,
      }),
    }
  );
  return {
    statusCode: 200,
    body:       "✅ Outlook conectado com sucesso! Pode fechar esta aba.",
  };
}