export default async function handler(req, res) {
  const mid = req.query.mid || "35719";
  const page = req.query.page || "1";
  const max = req.query.max || "20";

  const clientId = process.env.LINKSHARE_CLIENT_ID;
  const clientSecret = process.env.LINKSHARE_CLIENT_SECRET;

  const tokenResponse = await fetch("https://api.linksynergy.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return res.status(500).json({ error: "Token alınamadı", response: tokenData });
  }

  const token = tokenData.access_token;

  const productResponse = await fetch(
    `https://api.linksynergy.com/productsearch/1.0?mid=${mid}&pagenumber=${page}&max=${max}&language=en_US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/xml",
      },
    }
  );

  const productXml = await productResponse.text();
  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(productXml);
}
