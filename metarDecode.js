function decodeMetar() {
    const metarElement = document.getElementById('metarOutput');
    const metar = metarElement.textContent.trim();

    if (!metar) {
        alert("No METAR data available to decode.");
        return null;
    }

    const regex = {
        station: /^([A-Z]{4})/,
        date: /(\d{2})/,
        time: /(\d{4}Z)/,
        wind: /\b(?<full>(?<direction>\d{3}|VRB)(?<speed>\d{2})(?<gust>G\d{2,3})?(?<units>KT|MPS|KMH|KTS))\b/,
        visibility: /\b((\d{4})|(\d+\s?\d?\/?\d?SM))\b/,
        variableWind: /(\d{3})V(\d{3})/,
        weather: /(?:\s|^)([+-]?(?:TS|SH|FZ|BL|DR|MI|BC|PR)?(?:RA|DZ|SN|SG|IC|PL|GR|GS|UP|BR|FG|FU|VA|DU|SA|HZ|PY|PO|SQ|FC|SS|DS))(?=\s|$)/g,
        clouds: /(BKN|SCT|OVC|CLR|FEW)(\d{3})/g,
        temperature: /([M]?\d{2})\/([M]?\d{2})/,
        altimeter: /(Q|A)(\d{4})/
    };

    const stationMatch = metar.match(regex.station);
    const station = stationMatch ? stationMatch[1] : 'Unknown';
    
    const dateMatch = metar.match(regex.date);
    let date = null;
    
    if (dateMatch) {
        const day = dateMatch[1];
        const suffix = (day === '01' || day === '21' || day === '31') ? 'st' :
                       (day === '02' || day === '22') ? 'nd' :
                       (day === '03' || day === '23') ? 'rd' : 'th';
        date = day + suffix;
    } else {
        date = 'Unknown';
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

const descriptors = {
    SH: "Showers",
    TS: "Thunderstorms",
    FZ: "Freezing",
    BL: "Blowing",
    DR: "Low Drifting",
    MI: "Shallow",
    BC: "Patches",
    PR: "Partial",
};

const phenomena = {
    RA: "Rain",
    DZ: "Drizzle",
    SN: "Snow",
    SG: "Snow Grains",
    IC: "Ice Crystals",
    PL: "Ice Pellets",
    GR: "Hail",
    GS: "Small Hail",
    UP: "Unknown Precipitation",
    BR: "Mist",
    FG: "Fog",
    FU: "Smoke",
    VA: "Volcanic Ash",
    DU: "Dust",
    SA: "Sand",
    HZ: "Haze",
    PY: "Spray",
    PO: "Dust/Sand Whirls",
    SQ: "Squalls",
    FC: "Funnel Cloud",
    SS: "Sandstorm",
    DS: "Duststorm",
};

const weatherMatches = metar.match(regex.weather)

let weather = "No weather reported";

if (weatherMatches && weatherMatches.length > 0) {
    const descriptions = [];

    for (let raw of weatherMatches) {
        let code = raw.trim();
        let intensity = "";

        if (code.startsWith("-")) {
            intensity = "Light ";
            code = code.slice(1);
        } else if (code.startsWith("+")) {
            intensity = "Heavy ";
            code = code.slice(1);
        }

        let desc = "";
        let phen = "";

        let descriptorMatch = false;
        for (let d of Object.keys(descriptors).sort((a, b) => b.length - a.length)) {
            if (code.startsWith(d)) {
                desc = descriptors[d];
                phen = phenomena[code.slice(d.length)] || code.slice(d.length);
                descriptorMatch = true;
                break;
            }
        }

        if (!descriptorMatch) {
            phen = phenomena[code] || code;
        }

        const final = `${intensity}${desc ? desc + " with " : ""}${phen}`;
        descriptions.push(final);
    }

    weather = descriptions.join(", ");
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
