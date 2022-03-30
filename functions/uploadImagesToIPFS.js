const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

const AUTH = process.env.NFTPORT_AUTH;

exports.handler = async (event, context) => {
	const url = "https://api.nftport.xyz/v0/files";
	const imagePath = event.queryStringParameters && event.queryStringParameters.imagePath
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

	options.body = formData;
	
	fetch(url, options)
		.then(res => console.log(res))
		.then(res => res.json())
		.then(json => console.log(json))
		.catch(err => console.error('error:' + err));
}

function checkResponseStatus(res) {
    if(res.ok){
        return res
    } else {
        throw new Error(`The HTTP status of the reponse: ${res.status} (${res.statusText})`);
    }
}

/*
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
  return new Promise((resolve, reject) => {
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
*/