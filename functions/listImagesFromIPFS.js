const fetch = require('node-fetch');

const AUTH = process.env.NFTPORT_AUTH;

exports.handler = async (event, context) => {
	const url = 'https://api.nftport.xyz/v0/me/storage';
	/*
	let options = {
		method: 'GET',
		qs: {type: ['all']},
		headers: {
			'Content-Type': 'application/json',
			Authorization: AUTH
		}
	};
	
	const query = new URLSearchParams({
		type: 'all'
	});

	fetch(url, options)
		.then(res => res.json())
		.then(json => {
				console.log(json)
				console.log(JSON.stringify(json, null, 2));
				return json;
			})
		.catch(err => console.error('error:' + err));
	*/

	let response = "test";
	
	return {
		'statusCode': 200,
		'headers': {
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify(response)
	}
  
}