// netlify/functions/metarRequest.js
const fetch = require('node-fetch'); // Ensure that you have the 'node-fetch' library

exports.handler = async function(event, context) {
  const icaoCode = event.queryStringParameters.icaoCode; // Get ICAO code from query parameter
  const apiKey = process.env.API_KEY; // Get the API key from environment variables

  if (!icaoCode || icaoCode.length !== 4) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid ICAO code." }),
    };
  }

  const url = `https://api.checkwx.com/metar/${icaoCode}`;

  try {
    const response = await fetch(url, {
      headers: { "X-API-Key": apiKey },
    });

    if (!response.ok) {
      throw new Error("Invalid ICAO code or API issue.");
    }

    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ metar: data.data[0] }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No METAR data available." }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Error fetching METAR data: ${error.message}` }),
    };
  }
};
