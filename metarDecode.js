function decodeMetar() {
    const metarElement = document.getElementById('metarOutput');
    const metar = metarElement.textContent.trim();

    if (!metar) {
        alert("No METAR data available to decode.");
        return null; // Return null explicitly
    }

    const regex = {
        station: /^([A-Z]{4})/,
        date: /(\d{2})/, // Fixed regex to capture the date
        time: /(\d{4}Z)/,
        wind: /\b(?<full>(?<direction>\d{3}|VRB)(?<speed>\d{2})(?<gust>G\d{2,3})?(?<units>KT|MPS|KMH|KTS))\b/,
        visibility: /\b((\d{4})|(\d+\s?\d?\/?\d?SM))\b/,
        variableWind: /(\d{3})V(\d{3})/,
        weather: /(CLR|B|BC|BL|BR|DR|DS|DU|DZ|E|FC|FG|FU|FZ|GR|GS|HZ|IC|MI|PL|PO|PR|PY|RA|SA|SG|SH|SN|SQ|SS|TS|UP|VA|VC)/,
        clouds: /(BKN|SCT|OVC|CLR|FEW)(\d{3})/g,
        temperature: /([M]?\d{2})\/([M]?\d{2})/,
        altimeter: /(Q|A)(\d{4})/
    };

    const stationMatch = metar.match(regex.station);
    const station = stationMatch ? stationMatch[1] : 'Unknown';
    
    const dateMatch = metar.match(regex.date); // Fixed to use regex.date
    let date = null;
    
    if (dateMatch) {
        const day = dateMatch[1];
        const suffix = (day === '01' || day === '21' || day === '31') ? 'st' :
                       (day === '02' || day === '22') ? 'nd' :
                       (day === '03' || day === '23') ? 'rd' : 'th';
        date = day + suffix;
    } else {
        date = 'Unknown'; // Provide a default value if no match
    }

    const timeMatch = metar.match(regex.time);
    const time = timeMatch ? timeMatch[0] : 'Unknown';

    const windMatch = metar.match(regex.wind);
    let wind = {
        direction: 'Unknown',
        speed: 'Unknown',
        gust: 'No gusts',
        units: '',
        raw: 'Unknown'
    };

    if (windMatch && windMatch.groups) {
        const { direction, speed, gust, units, full } = windMatch.groups;
        wind = {
            direction: direction === 'VRB' ? 'Variable' : direction + '&deg;',
            speed: parseInt(speed, 10) + ' ' + units,
            gust: gust ? parseInt(gust.slice(1), 10) + ' ' + units : 'No gusts',
            units,
            raw: full
        };
    }

    const visibilityMatch = metar.match(regex.visibility);
    const visibility = visibilityMatch ? visibilityMatch[1] : 'Unknown';

    const variableWindMatch = metar.match(regex.variableWind);
    const windVariation = variableWindMatch ? `${variableWindMatch[1]}&deg; to ${variableWindMatch[2]}&deg;` : 'No variable wind reported';

    const weatherMatch = metar.match(regex.weather);
    let weather = 'No weather detected';
    
    if (weatherMatch && weatherMatch[0]) {
        switch (weatherMatch[0]) {
            case 'CLR': weather = 'Clear'; break;
            case 'RA': weather = 'Rain'; break;
            // Add more cases as needed
        }
    }

    const cloudsMatch = metar.match(regex.clouds);
    let clouds = 'No clouds detected';
    if (cloudsMatch) {
        clouds = cloudsMatch.map(layer => {
            const type = layer.substring(0, 3);
            const height = parseInt(layer.substring(3)) * 100;
            switch (type) {
                case 'BKN': return `Broken ${height}ft`;
                case 'SCT': return `Scattered ${height}ft`;
                case 'OVC': return `Overcast ${height}ft`;
                case 'CLR': return `Clear`;
                case 'FEW': return `Few ${height}ft`;
                default: return '';
            }
        }).join(', ');
    }

    const tempMatch = metar.match(regex.temperature);
    const formatTemperature = (temp) => (temp[0] === 'M' ? '-' + temp.slice(1) : temp);
    const temperature = tempMatch ? formatTemperature(tempMatch[1]) + '&deg;C' : 'Unknown';
    const dewPoint = tempMatch ? formatTemperature(tempMatch[2]) + '&deg;C' : 'Unknown';

    const altimeterMatch = metar.match(regex.altimeter);
    let altimeter = 'Unknown';
    if (altimeterMatch) {
        const type = altimeterMatch[1];
        const value = altimeterMatch[2];
        altimeter = type === 'Q' ? value + ' hPa' : parseInt(value) / 100 + ' inHg';
    }

    return {
        station,
        date,
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

function decodeAndDisplayMetar() {
    const decodedMetar = decodeMetar();

    if (!decodedMetar) {
        return;
    }

    const decodedMetarHtml = `
        <p><strong>Station:</strong> ${decodedMetar.station}</p>
        <p><strong>Date:</strong> ${decodedMetar.date}</p>
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

    document.getElementById('decodedMetar').innerHTML = decodedMetarHtml;
}
