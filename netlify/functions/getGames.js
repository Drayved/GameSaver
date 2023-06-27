import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    const { search, selectedGenre, page } = JSON.parse(event.body);
    const apiKey = process.env.VITE_RAWG_KEY;
    console.log(apiKey);

    let apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}`;

    if (search) {
      apiUrl += `&search=${search}`;
    }

    if (selectedGenre) {
      apiUrl += `&genres=${selectedGenre}`;
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
    console.log(error);

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
