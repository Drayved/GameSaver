

export default async function handler(event){
  return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'This is what will be returned!'
		})
	}
}