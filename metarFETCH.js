async function fetchMETAR() {
  const icaoCode = document.getElementById("icaoInput").value.trim().toUpperCase();

  if (icaoCode.length !== 4) {
    alert("Please enter a valid 4-letter ICAO code.");
    return;
  }

  const url = `https://fltplnn-github.io.vercel.app/api/fetchMETAR?icao=${icaoCode}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.data && data.data.length > 0) {
      const metarText = data.data[0]; // This is the METAR data

      // Display only the METAR data, without the ICAO code
      document.getElementById("metarOutput").innerHTML = `
        <pre>${metarText}</pre>
      `;
    } else {
      document.getElementById("metarOutput").innerHTML = "<p>No METAR data available.</p>";
    }
  } catch (error) {
    document.getElementById("metarOutput").innerHTML = `<p>Error fetching METAR data: ${error.message}</p>`;
  }
}
