export async function handler(event) {
  const { provider, userId, q } = event.queryStringParameters || {};
  if (!provider || !userId) {
    return { statusCode: 400, body: "provider e userId são obrigatórios." };
  }
  const supaRes = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/email_accounts?provider=eq.${provider}&user_id=eq.${userId}`,
    { headers: {
        apikey:        process.env.SUPABASE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`
      }
    }
  );
  const [row] = await supaRes.json();
  if (!row) {
    return { statusCode: 400, body: "Credencial não encontrada." };
  }
  const tokens = row.tokens;
  let messages = [];
  if (provider === "google") {
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const list = await listRes.json();
    for (const m of list.messages || []) {
      const d = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=full`,
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      ).then(r => r.json());
      const hdrs = d.payload.headers || [];
      messages.push({
        id:          m.id,
        subject:     hdrs.find(h => h.name === "Subject")?.value || "",
        snippet:     d.snippet,
        received_at: new Date(Number(d.internalDate)).toISOString()
      });
    }
  } else {
    const graphRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages?$search="${encodeURIComponent(q)}"&$top=50`,
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const graphJson = await graphRes.json();
    messages = (graphJson.value || []).map(m => ({
      id:          m.id,
      subject:     m.subject,
      snippet:     m.bodyPreview,
      received_at: m.receivedDateTime
    }));
  }
  return { statusCode: 200, body: JSON.stringify(messages) };
}