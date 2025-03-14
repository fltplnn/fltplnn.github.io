export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { icao } = req.query;

  if (!icao || icao.length !== 4) {
    return res.status(400).json({ error: "Invalid ICAO code" });
  }

  const apiKey = process.env.API_KEY;
  const url = `https://api.checkwx.com/metar/${icao}`;

  try {
    const response = await fetch(url, {
      headers: { "X-API-Key": apiKey }
    });

    if (!response.ok) {
      throw new Error("Invalid ICAO code or API issue.");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
