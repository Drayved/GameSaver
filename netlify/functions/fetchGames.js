

export const handler = async (event) => {
 
    const { search, genres } = event.queryStringParameters;
    const apiKey = process.env.VITE_RAWG_KEY;

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
 

}