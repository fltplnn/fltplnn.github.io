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
        wind: /(VRB|\d{3})(\d{2})(G?\d{2,3})?(KT|MPS|KMH|KTS)/,
        visibility: /\s(\d{4}|(\d+SM))\s/,
        variableWind: /(\d{3})V(\d{3})/,
        weather: /(RE|GR|GS|SN|RA|FZ|BR|HZ|FG|TS)/,
        clouds: /(BKN|SCT|OVC|CLR|FEW)(\d{3})/g,
        temperature: /([M]?\d{2})\/([M]?\d{2})/,
        altimeter: /(Q|A)(\d{4})/
    };

    const stationMatch = metar.match(regex.station);
    const station = stationMatch ? stationMatch[1] : null;

    const timeMatch = metar.match(regex.time);
    const time = timeMatch ? timeMatch[0] : null;

    const windMatch = metar.match(regex.wind);
    const wind = windMatch ? {
        direction: windMatch[1] === 'VRB' ? 'Variable' : windMatch[1] + '&deg;',
        speed: windMatch[2] + ' knots',
        gust: windMatch[3] ? windMatch[3] + ' knots' : null
    } : null;

    const visibilityMatch = metar.match(regex.visibility);
    let visibility = null;
    if (visibilityMatch) {
        let visValue = visibilityMatch[1];
        if (visValue.includes('SM')) {
            visibility = visValue;
        } else {
            let visMeters = parseInt(visValue);
            if (visMeters >= 1609) {
                visibility = (visMeters / 1609).toFixed(1) + "SM";
            } else {
                visibility = visMeters + " meters";
            }
        }
    }

    const variableWindMatch = metar.match(regex.variableWind);
    const windVariation = variableWindMatch ? `${variableWindMatch[1]}&deg; to ${variableWindMatch[2]}&deg;` : null;

    const weatherMatch = metar.match(regex.weather);
    const weather = weatherMatch ? weatherMatch[0] : null;

    const cloudsMatch = [...metar.matchAll(regex.clouds)];
    let clouds = null;
    if (cloudsMatch.length > 0) {
        clouds = cloudsMatch.map(layer => {
            const type = layer[1];
            const height = parseInt(layer[2]) * 100;
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
    const formatTemperature = (temp) => temp.startsWith('M') ? '-' + temp.slice(1) : temp;

    const temperature = tempMatch ? formatTemperature(tempMatch[1]) + '&deg;C' : null;
    const dewPoint = tempMatch ? formatTemperature(tempMatch[2]) + '&deg;C' : null;

    const altimeterMatch = metar.match(regex.altimeter);
    let altimeter = null;
    if (altimeterMatch) {
        const type = altimeterMatch[1];
        const value = altimeterMatch[2];
        altimeter = type === 'Q' ? value + ' hPa' : (parseInt(value)) + ' inHg';
    }

    return { station, time, wind, windVariation, visibility, weather, clouds, temperature, dewPoint, altimeter };
}

function decodeAndDisplayMetar() {
    const decodedMetar = decodeMetar();
    if (!decodedMetar) return;

    let decodedMetarHtml = '';

    if (decodedMetar.station) decodedMetarHtml += `<p><strong>Station:</strong> ${decodedMetar.station}</p>`;
    if (decodedMetar.time) decodedMetarHtml += `<p><strong>Time of Observation:</strong> ${decodedMetar.time}</p>`;
    if (decodedMetar.wind) decodedMetarHtml += `<p><strong>Wind:</strong> ${decodedMetar.wind.direction} at ${decodedMetar.wind.speed}${decodedMetar.wind.gust ? ` (Gusts: ${decodedMetar.wind.gust})` : ''}</p>`;
    if (decodedMetar.windVariation) decodedMetarHtml += `<p><strong>Wind Variation:</strong> ${decodedMetar.windVariation}</p>`;
    if (decodedMetar.visibility) decodedMetarHtml += `<p><strong>Visibility:</strong> ${decodedMetar.visibility}</p>`;
    if (decodedMetar.weather) decodedMetarHtml += `<p><strong>Weather:</strong> ${decodedMetar.weather}</p>`;
    if (decodedMetar.clouds) decodedMetarHtml += `<p><strong>Clouds:</strong> ${decodedMetar.clouds}</p>`;
    if (decodedMetar.temperature) decodedMetarHtml += `<p><strong>Temperature:</strong> ${decodedMetar.temperature}</p>`;
    if (decodedMetar.dewPoint) decodedMetarHtml += `<p><strong>Dew Point:</strong> ${decodedMetar.dewPoint}</p>`;
    if (decodedMetar.altimeter) decodedMetarHtml += `<p><strong>Altimeter:</strong> ${decodedMetar.altimeter}</p>`;

    document.getElementById('decodedMetar').innerHTML = decodedMetarHtml;
}
