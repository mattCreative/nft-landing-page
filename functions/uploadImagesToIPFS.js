const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

const AUTH = process.env.NFTPORT_AUTH;

exports.handler = async (event, context) => {
	const imagePath = event.queryStringParameters && event.queryStringParameters.imagePath
	
	/*
	const url = "https://api.nftport.xyz/v0/files";
	const formData = new FormData();

	formData.append('file', fs.createReadStream(imagePath));

	console.log(imagePath);

	let options = {
		method: 'POST',
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: AUTH,
			'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
		}
	};

	options.body = JSON.stringify(formData);
	// { detail: 'There was an error parsing the body' }
	
	fetch(url, options)
		.then(res => {
				console.log(res)
				return res;
			}
		)
		.then(res => res.json())
		.then(json => console.log(json))
		.catch(err => console.error('error:' + err));
		
	*/
	
	/*
	
	const response = await uploadImages(imagePath)
	
	return {
		'statusCode': 200,
		'headers': {
		  'Cache-Control': 'no-cache',
		  'Content-Type': 'application/json',
		},
		'body': JSON.stringify(response)
	  }
	  */
}


const uploadImages = async (imagePath) => {
	const url = "https://api.nftport.xyz/v0/files";

	const formData = new FormData();
	const fileStream = fs.createReadStream(imagePath);
	formData.append('file', fileStream);

	const options = {
		method: 'POST',
		body: JSON.stringify(formData),
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: AUTH
			"content-type": "multipart/form-data; boundary=---011000010111000001101001",
		}
	};
	
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
}

async function fetchData(url, options) {
	console.log('fetchData');
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