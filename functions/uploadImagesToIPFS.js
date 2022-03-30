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
			"Content-Type": "multipart/form-data",
			"content-type": "multipart/form-data; boundary=---011000010111000001101001",
			Authorization: AUTH
		}
	};
	
	console.log(url);
	console.log(options);

	try {
		const data = await fetchData(url, options)

		console.log(data);

		return {
			data
		}
	} catch(err) {
		console.log(`Catch: ${JSON.stringify(err)}`)
		return {
			error: err
		}
	}

/*
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
*/
  
}

async function fetchData(url, options) {
	console.log('fetchData called');
  return new Promise((resolve, reject) => {
	  console.log('Promise');
    return fetch(url, options).then(res => {
		console.log(res);
      const status = res.status;            

      if(status === 200) {
        return resolve(res.json());
      } else {
        console.log(`Fetch failed with status ${status}`);
        return reject(res.json());
      }        
    }).catch(function (error) { 
      reject(error)
    });
  });
}
