// api/fetchData.js
export default async function handler(req, res) {
  // Use environment variables for sensitive information like API keys
  const apiKey = process.env.MY_API_KEY; // Vercel environment variable

  const response = await fetch(`https://example.com/api/data?apiKey=${apiKey}`);
  const data = await response.json();

  res.status(200).json(data); // Return the fetched data to the frontend
}
