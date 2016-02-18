/**
	This is nothing but a draft. 
	More tests than code.
	So just don't use it for now :)
*/

'use strict';
var request = require('request');
var crypto = require('crypto');

var apiUrl, apiUid, appToken, appId, granted;

/*HELPERS*/
var stripTrailingSlash = (str) => {
    if(str.substr(-1) === '/')
        return str.substr(0, str.length - 1);
    return str;
}


/*END HELPERS*/


//url: the main url of your freebox (usually something like 12.123.42.56:34033)
var init = (url, apiUid, appToken, appId, granted)=>{
	apiUid =  apiUid; appToken =  appToken; appId =  appId; granted =  granted; //stupid stuff, I just needed to put all thoses vars in a git ignored file..
	apiUrl = 'http://' + stripTrailingSlash(url);
	//get version api, and check given url is right.
	return new Promise((ful, rej)=>{
		request(apiUrl + '/api_version', (err, res, body)=>{
			if(err){
				console.log(err);
				rej(err);
			}else{
				var intel = JSON.parse(body);
				apiUid = intel.uid;
				apiUrl = apiUrl + intel.api_base_url + 'v' + intel.api_version.charAt(0);
				ful(intel);
			}
		});
	});
};


/**
app = {
	app_id: 'string', !mandatory
	app_name: 'string', !mandatory
	app_version: 'string' default: 0.4.2
	}
**/
var authorize = (app, device)=>{
	var postForm = {
		'app_id': app.app_id,
		'app_name': app.app_name,
		'app_version': (app.app_version || '0.4.2'),
		'device_name': device
	};
	appId = app.app_id;
	console.log(postForm);
	var urlPost = apiUrl + '/login/authorize';
	console.log(urlPost);
	return new Promise((ful, rej)=>{
		request.post({url: urlPost, form: JSON.stringify(postForm)}, (err, res, body)=>{
			if(err){
				console.log(err);
				rej(err);
			}else{
				var intel = JSON.parse(body);
				ful(intel);
			}
		});
	});
};

var authorized = (track_id)=>{
	var url = apiUrl + '/login/authorize/' + track_id;
	return new Promise((ful, rej)=>{
		request(url, (err, res, body)=>{
			if(err){
				rej(err);
			}else{
				var intel = JSON.parse(body);
				if(intel.result.status && intel.result.status == 'granted')
					granted = true;
				ful(intel);
			}
		});
	});
};

var getSessionToken = (app_token, challenge)=>{
	challenge = challenge.replace(/\\/g, '');
	app_token = app_token.replace(/\\/g, '');
	console.log('getSessionToken');
	console.log(challenge);
	console.log(app_token);
	var hash = crypto.createHmac('sha1', app_token).update(challenge).digest('hex');
	console.log(hash);
	return new Promise((ful, rej)=>{
		request.post({url: apiUrl + '/login/session/', form: JSON.stringify({'app_id': appId, 'password': hash})}, (err, res, body)=>{
			if(err){
				rej(err);
			}else{
				var intel = JSON.parse(body);
				ful(intel);
			}
		});
	});
}

var login = (app_token)=>{
	var urlChallenge = apiUrl + '/login';
	request(urlChallenge, (err, res, body)=>{
		if(err){
			console.log(err);
		}else{
			var intel = JSON.parse(body);
			if(!intel.result.logged_in){
				var challenge = intel.result.challenge;
				getSessionToken(app_token, challenge).then((intel)=>{
					console.log(intel);
				});
			}
		}
	});
};

module.exports = {
	init: init,
	authorize: authorize,
	authorized: authorized,
	login: login
};