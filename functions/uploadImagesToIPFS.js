const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

const AUTH = process.env.NFTPORT_AUTH;

exports.handler = async (event, context) => {	
	const response = await uploadImages()
	
	return {
		'statusCode': 200,
		'headers': {
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify(response)
	}
	
	/*
	const formData = new FormData();

	formData.append('file', fs.createReadStream());

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
	*/
}

const uploadImages = async () => {
	const url = "https://api.nftport.xyz/v0/files";
	const basePath = process.cwd();
	let uploads = [];
	
	fs.readdirSync(`${basePath}/images/`).
	forEach(file => async (url, uploads) => {
		const formData = new FormData();
		const fileStream = fs.createReadStream(`${basePath}/images/tokens/{$file}`);
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
			uploads.push({data: data});
		} catch(err) {
			console.log(`Catch: ${JSON.stringify(err)}`)
			uploads.push({error: err});

		}
	})

	return uploads;
	
}

async function fetchData(url, options) {
  return new Promise((resolve, reject) => {
    return fetch(url, options).then(res => {
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
