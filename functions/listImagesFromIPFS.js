const fetch = require('node-fetch');

const AUTH = process.env.NFTPORT_AUTH;

exports.handler = async (event, context) => {
	const response = await getListOfImages()
	
	return {
		'statusCode': 200,
		'headers': {
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify(response)
	}
  
}

const getListOfImages = async () => {
	const url = 'https://api.nftport.xyz/v0/me/storage?';
  
	const options = {
	method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: AUTH
		}
	};
  
	const query = new URLSearchParams({
		type: 'all'
	});
	
	try {
		const data = await fetchData(url + query, options)

		return {
			data: data,
		}
	} catch(err) {
		console.log(err);
		console.log(`Catch: ${JSON.stringify(err)}`)
		return {
			error: err
		}
	}

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