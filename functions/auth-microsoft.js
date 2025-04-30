export async function handler(event) {
  const userId = event.queryStringParameters.userId || "";
  const params = new URLSearchParams({
    client_id:     process.env.AZURE_CLIENT_ID,
    response_type: "code",
    redirect_uri:  `${process.env.URL_BASE}/.netlify/functions/auth-microsoft-callback`,
    response_mode: "query",
    scope:         "https://graph.microsoft.com/Mail.Read",
    state:         encodeURIComponent(userId),
  });
  return {
    statusCode: 302,
    headers: {
      Location: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize?${params}`
    },
  };
}