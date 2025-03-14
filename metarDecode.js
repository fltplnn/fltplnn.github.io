function decodeMetar() {
    const metarElement = document.getElementById('metarOutput');
    const metar = metarElement.textContent.trim();

    if (!metar) {
        alert("No METAR data available to decode.");
        return;
    }

    const regex = {
        station: /^([A-Z]{4})/,
        time: /\d{6}Z/,
        wind: /(\d{3})(\d{2})(G?\d{2,3})?(KT|MPS|KMH|KTS|VRB)/,
        visibility: /\s(\d{4})\s/,
        variableWind: /(\d{3})V(\d{3})/,
        weather: /(RE|GR|GS|SN|RA|FZ|BR|HZ|FG|TS)/,
        clouds: /(BKN|SCT|OVC|CLR|FEW)(\d{3})/g,
        temperature: /([M]?\d{2})\/([M]?\d{2})/,
        altimeter: /(Q|A)(\d{4})/
    };

    const stationMatch = metar.match(regex.station);
    const station = stationMatch ? stationMatch[1] : 'Unknown';

    const timeMatch = metar.match(regex.time);
    const time = timeMatch ? timeMatch[0] : 'Unknown';

    const windMatch = metar.match(regex.wind);
    const wind = windMatch ? {
        direction: windMatch[1] === 'VRB' ? 'Variable' : windMatch[1] + '&deg;',
        speed: windMatch[2] + ' knots',
        gust: windMatch[3] ? windMatch[3] + ' knots' : 'No gusts'
    } : { direction: 'Unknown', speed: 'Unknown', gust: 'No gusts' };

    const visibilityMatch = metar.match(regex.visibility);
    const visibility = visibilityMatch ? visibilityMatch[1] + ' meters' : 'Unknown';

    const variableWindMatch = metar.match(regex.variableWind);
    const windVariation = variableWindMatch ? `${variableWindMatch[1]}&deg; to ${variableWindMatch[2]}&deg;` : 'No variable wind reported';

    const weatherMatch = metar.match(regex.weather);
    const weather = weatherMatch ? weatherMatch[0] : 'Clear';

    const cloudsMatch = metar.match(regex.clouds);
    let clouds = 'No clouds';
    if (cloudsMatch) {
        clouds = cloudsMatch.map(layer => {
            const type = layer.substring(0, 3);
            const height = parseInt(layer.substring(3)) * 100;
            let cloudType = '';
            switch (type) {
                case 'BKN': cloudType = `Broken ${height}ft`; break;
                case 'SCT': cloudType = `Scattered ${height}ft`; break;
                case 'OVC': cloudType = `Overcast ${height}ft`; break;
                case 'CLR': cloudType = `Clear`; break;
                case 'FEW': cloudType = `Few ${height}ft`; break;
            }
            return cloudType;
        }).join(', ');
    }

    const tempMatch = metar.match(regex.temperature);

    const formatTemperature = (temp) => {
        if (temp[0] === 'M') {
            return '-' + temp.slice(1);
        }
        return temp;
    };

    const temperature = tempMatch ? formatTemperature(tempMatch[1]) + '&deg;C' : 'Unknown';
    const dewPoint = tempMatch ? formatTemperature(tempMatch[2]) + '&deg;C' : 'Unknown';

    const altimeterMatch = metar.match(regex.altimeter);
    let altimeter = 'Unknown';
    if (altimeterMatch) {
        const type = altimeterMatch[1];
        const value = altimeterMatch[2];
        if (type === 'Q') {
            altimeter = value + ' hPa';
        } else if (type === 'A') {
            const inHg = (parseInt(value))
            altimeter = `${inHg} inHg`;
        }
    }

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

function decodeAndDisplayMetar() {
    const decodedMetar = decodeMetar();

    if (!decodedMetar) {
        return;
    }

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

    document.getElementById('decodedMetar').innerHTML = decodedMetarHtml;
}
