const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

const AUTH = process.env.NFTPORT_AUTH;

exports.handler = async (event, context) => {
  const imagePath = event.queryStringParameters && event.queryStringParameters.imagePath

console.log(imagePath);

  const response = await uploadImages(imagePath)

  return {
    'statusCode': 200,
    'headers': {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify(response)
  }
}


const uploadImages = async (imagePath) => {
	const url = "https://api.nftport.xyz/v0/files";

	const form = new FormData();
	const fileStream = fs.createReadStream(imagePath);
	form.append('file', fileStream);

	const options = {
		method: 'POST',
		body: form,
		headers: {
		  Authorization: AUTH
		}
	};
	
	console.log(url);
	console.log(options);

	fetch(url, options)
	.then(response => {
		console.log(response);
		console.log(response.json());
		return response.json()
	})
	.then(responseJson => {
		// Handle the response
		console.log(responseJson);
		return responseJson;
	})
  
}