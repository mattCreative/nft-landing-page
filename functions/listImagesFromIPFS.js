const fetch = require('node-fetch');

const AUTH = process.env.NFTPORT_AUTH;

exports.handler = async (event, context) => {
	const url = 'https://api.nftport.xyz/v0/me/storage';

	let options = {
		method: 'GET',
		qs: {type: 'all'},
		headers: {
			'Content-Type': 'application/json',
			Authorization: AUTH
		}
	};

	fetch(url, options)
		.then(res => res.json())
		.then(json => console.log(json))
		.catch(err => {
				console.log(JSON.stringify(err))
				return err;
			}
		);
  
}