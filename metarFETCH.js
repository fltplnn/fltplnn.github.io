require('dotenv').config();

async function fetchMETAR() {
    const icaoCode = document.getElementById("icaoInput").value.trim().toUpperCase();
    
    if (icaoCode.length !== 4) {
      alert("Please enter a valid 4-letter ICAO code.");
      return;
    }

    const apiKey = process.env.API_KEY;
    const url = `https://api.checkwx.com/metar/${icaoCode}`;

    try {
      const response = await fetch(url, {
        headers: { "X-API-Key": apiKey }
      });

      if (!response.ok) {
        throw new Error("Invalid ICAO code or API issue.");
      }

      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        document.getElementById("metarOutput").innerHTML = `
          <p>${data.data[0]}</p>
        `;
      } else {
        document.getElementById("metarOutput").innerHTML = "<p>No METAR data available.</p>";
      }
    } catch (error) {
      document.getElementById("metarOutput").innerHTML = `<p>Error fetching METAR data: ${error.message}</p>`;
    }
  }


// public/index.js
async function getData() {
  const response = await fetch('/api/fetchData'); // This makes a request to your serverless function
  const data = await response.json();
  console.log(data); // Handle the response data
}

getData(); // Call the function when the page loads or based on a specific event
