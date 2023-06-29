const handler = function (event) {
  try {
    const { search, genres } = event.queryStringParameters;
    const apiKey = process.env.VITE_RAWG_KEY

    let apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

    if (search) {
      apiUrl += `&search=${search}`;
    }

    if (genres) {
      apiUrl += `&genres=${genres}`;
    }

    const response = fetch(apiUrl);
    const data = response.json();

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
};

export { handler };
