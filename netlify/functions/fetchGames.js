

export const handler = async (event) => {
 
    
    const apiKey = "10cab07048cb4f6591685d4bf79954bd";

    const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;



    const response = await fetch(apiUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      
      body: JSON.stringify({data}),
    };
  
}