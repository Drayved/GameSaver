import fetch from 'node-fetch'

export const handler = async (event) => {
  try {
    const { search, genres } = event.queryStringParameters;
    const apiKey = "10cab07048cb4f6591685d4bf79954bd";

    let apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

    if (search) {
      apiUrl += `&search=${search}`;
    }

    if (genres) {
      apiUrl += `&genres=${genres}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Something went wrong' }),
    };
  }
}