// Function to decode the METAR string
function decodeMetar() {
    const metarElement = document.getElementById('metarOutput');
    const metar = metarElement.textContent.trim(); // Get the METAR string from the div and clean up any extra spaces

    if (!metar) {
        alert("No METAR data available to decode.");
        return;
    }

    const regex = {
        station: /^([A-Z]{4})/, // ICAO code for station (e.g., EGLL)
        time: /\d{6}Z/, // Time of observation (e.g., 131020Z)
        wind: /(\d{3})(\d{2})(G?\d{2,3})?(KT|MPS|KMH|KTS)/, // Wind direction, speed, and gusts
        visibility: /\s(\d{4})\s/,  // Correct visibility regex (e.g., 9999, 3000)
        variableWind: /(\d{3})V(\d{3})/, // For variable wind (e.g., 300V050)
        weather: /(RE|GR|GS|SN|RA|FZ|BR|HZ|FG|TS)/, // Weather phenomena
        clouds: /(BKN|SCT|OVC|CLR)(\d{3})/,  // Cloud type and height (e.g., BKN017)
        temperature: /(\d{2})\/(\d{2})/, // Temperature and dew point (e.g., 05/01)
        altimeter: /Q(\d{4})/ // Altimeter pressure in hPa (e.g., Q1004)
    };

    // Parsing the station (ICAO code)
    const stationMatch = metar.match(regex.station);
    const station = stationMatch ? stationMatch[1] : 'Unknown';

    // Parsing the time of observation
    const timeMatch = metar.match(regex.time);
    const time = timeMatch ? timeMatch[0] : 'Unknown';

    // Parsing wind data (e.g., 35005KT)
    const windMatch = metar.match(regex.wind);
    const wind = windMatch ? {
        direction: windMatch[1] + '&deg;', // Use HTML entity for the degree symbol
        speed: windMatch[2] + ' knots',
        gust: windMatch[3] ? windMatch[3] + ' knots' : 'No gusts'
    } : { direction: 'Unknown', speed: 'Unknown', gust: 'No gusts' };

    // Parsing visibility (e.g., 9999 meters or 3000 meters)
    const visibilityMatch = metar.match(regex.visibility);
    const visibility = visibilityMatch ? visibilityMatch[1] + ' meters' : 'Unknown';

    // Parsing variable wind (e.g., 300V050)
    const variableWindMatch = metar.match(regex.variableWind);
    const windVariation = variableWindMatch ? `${variableWindMatch[1]}&deg; to ${variableWindMatch[2]}&deg;` : 'No variable wind reported';

    // Parsing weather conditions (e.g., SN for snow)
    const weatherMatch = metar.match(regex.weather);
    const weather = weatherMatch ? weatherMatch[0] : 'Clear';

    // Parsing cloud data and converting cloud height to feet
    const cloudsMatch = metar.match(regex.clouds);
    const clouds = cloudsMatch ? `${cloudsMatch[1]} at ${parseInt(cloudsMatch[2]) * 100} feet` : 'No clouds';

    // Parsing temperature and dew point (e.g., 05/01)
    const tempMatch = metar.match(regex.temperature);
    const temperature = tempMatch ? tempMatch[1] + '&deg;C' : 'Unknown'; // Use HTML entity for the degree symbol
    const dewPoint = tempMatch ? tempMatch[2] + '&deg;C' : 'Unknown';

    // Parsing altimeter pressure (e.g., Q1004)
    const altimeterMatch = metar.match(regex.altimeter);
    const altimeter = altimeterMatch ? altimeterMatch[1] + ' hPa' : 'Unknown';

    // Returning the decoded METAR data as an object
    return {
        station,
        time,
        wind,
        windVariation,
        visibility,
        weather,
        clouds,
        temperature,
        dewPoint,
        altimeter
    };
}

// Function to decode the METAR string and display it in the decodedMetar div
function decodeAndDisplayMetar() {
    const decodedMetar = decodeMetar();  // Now, decodeMetar() gets the METAR directly from the DOM

    if (!decodedMetar) {
        return; // If no METAR was decoded, stop execution
    }

    // Create a human-readable string from the decoded METAR data
    const decodedMetarHtml = `
        <p><strong>Station:</strong> ${decodedMetar.station}</p>
        <p><strong>Time of Observation:</strong> ${decodedMetar.time}</p>
        <p><strong>Wind:</strong> ${decodedMetar.wind.direction} at ${decodedMetar.wind.speed} (${decodedMetar.wind.gust})</p>
        <p><strong>Wind Variation:</strong> ${decodedMetar.windVariation}</p>
        <p><strong>Visibility:</strong> ${decodedMetar.visibility}</p>
        <p><strong>Weather:</strong> ${decodedMetar.weather}</p>
        <p><strong>Clouds:</strong> ${decodedMetar.clouds}</p>
        <p><strong>Temperature:</strong> ${decodedMetar.temperature}</p>
        <p><strong>Dew Point:</strong> ${decodedMetar.dewPoint}</p>
        <p><strong>Altimeter:</strong> ${decodedMetar.altimeter}</p>
    `;

    // Display the decoded METAR in the decodedMetar div
    document.getElementById('decodedMetar').innerHTML = decodedMetarHtml;
}
