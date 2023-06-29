const handler = async (event) => {
  try {


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

module.exports = { handler };
