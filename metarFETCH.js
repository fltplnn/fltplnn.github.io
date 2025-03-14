async function fetchMETAR() {
  const icaoCode = document.getElementById("icaoInput").value.trim().toUpperCase();

  if (icaoCode.length !== 4) {
    alert("Please enter a valid 4-letter ICAO code.");
    return;
  }

  const url = `https://your-project.vercel.app/api/fetchMETAR?icao=${icaoCode}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Invalid ICAO code or API issue.");
    }

    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      document.getElementById("metarOutput").innerHTML = `<p>${data.data[0]}</p>`;
    } else {
      document.getElementById("metarOutput").innerHTML = "<p>No METAR data available.</p>";
    }
  } catch (error) {
    document.getElementById("metarOutput").innerHTML = `<p>Error fetching METAR data: ${error.message}</p>`;
  }
}
