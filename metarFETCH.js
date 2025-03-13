async function fetchMETAR() {
  const icaoCode = document.getElementById("icaoInput").value.trim().toUpperCase();
  
  if (icaoCode.length !== 4) {
    alert("Please enter a valid 4-letter ICAO code.");
    return;
  }

  const url = `/.netlify/functions/metarRequest?icaoCode=${icaoCode}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Error fetching METAR data.");
    }
    
    const data = await response.json();
    
    if (data && data.metar) {
      document.getElementById("metarOutput").innerHTML = `
        <p>${data.metar}</p>
      `;
    } else {
      document.getElementById("metarOutput").innerHTML = "<p>No METAR data available.</p>";
    }
  } catch (error) {
    document.getElementById("metarOutput").innerHTML = `<p>Error fetching METAR data: ${error.message}</p>`;
  }
}
