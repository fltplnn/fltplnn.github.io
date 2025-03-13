// apiRequest.js
const axios = require('axios'); // Use Axios or any HTTP client to make the API call

exports.handler = async function(event, context) {
    const API_KEY = process.env.API_KEY; // This will read the API key from environment variables

    try {
        const response = await axios.get('https://api.example.com/data', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching data' }),
        };
    }
};
