const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

const AUTH = process.env.NFTPORT_AUTH;

exports.handler = async (event, context) => {
	const url = "https://api.nftport.xyz/v0/files";
	const imagePath = event.queryStringParameters && event.queryStringParameters.imagePath
	const formData = new FormData();

	formData.append('file', fs.createReadStream(imagePath));

	let options = {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: AUTH,
		}
	};
	
	fetch(url, options)
		.then(res => {
				console.log(res)
				return res;
			}
		)
		.then(res => res.json())
		.then(json => console.log(json))
		.catch(err => console.error('error:' + err));
}



const uploadImages = async (imagePath) => {
	const url = "https://api.nftport.xyz/v0/files?";

	const formData = new FormData();
	const fileStream = fs.createReadStream(imagePath);
	formData.append('file', fileStream);

	const options = {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: AUTH,
		}
	};
	
	try {
		const data = await fetchData(url, options)

		console.log(data);

		return {
			data: data
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
