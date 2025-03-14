export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { icao } = req.query;
  
  // Debugging: Check ICAO code and its validity
  console.log("Received ICAO code:", icao); // Log ICAO code received
  if (!icao || icao.length !== 4) {
    console.error("Invalid ICAO code:", icao); // Log invalid ICAO code
    return res.status(400).json({ error: "Invalid ICAO code" });
  }

  const apiKey = process.env.API_KEY;  
  if (!apiKey) {
    console.error("API Key is missing."); // Log if API key is missing
    return res.status(500).json({ error: "API Key missing." });
  }

  const url = `https://api.checkwx.com/metar/${icao}`;
  console.log("Fetching from URL:", url); // Log the URL being requested

  try {
    const response = await fetch(url, {
      headers: { "X-API-Key": apiKey }
    });

    console.log("API Response Status:", response.status); // Log status code of API response

    if (!response.ok) {
      throw new Error("Invalid ICAO code or API issue.");
    }

    const data = await response.json();
    console.log("API Data:", data); // Log the full response data
    res.status(200).json(data);
  } catch (error) {
    console.error("Error Fetching METAR:", error.message); // Log error message
    res.status(500).json({ error: error.message });
  }
}
