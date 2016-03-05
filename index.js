/**
	This is nothing but a draft.
	More tests than code.
	So just don't use it for now :)
*/

'use strict';
var request = require('request');
var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter;

var box = {
    ip: '',
    url: '',
    token : '',
    challenge: '',
    status: '',
    uid: '',
    version: '',
    base: ''
};

var app = {
    token: '',
    version: '',
    name: '',
    id: '',
    device: '',
    track: '',
    password: ''
};

var getBox = (id, name, version, device, ip, cb)=>{
    app.id = id;
    app.name = name;
    app.version = version;
    app.device = device;
    box.ip = ip;
    box.url = 'http://' + box.ip;

    var endpoint = box.url + '/api_version';
    request(endpoint, (err, res, body)=>{
        if(!err){
            body = JSON.parse(body);
            box.version = body.api_version.charAt(0);
            box.uid = body.uid;
            box.base = body.api_base_url;
            box.url = box.url + box.base + 'v' + box.version + '/';
            cb(body);
        }
    });
};

var isAuthorized = (track, cb)=>{
    app.track = track;
    var endpoint = box.url + 'login/authorize/' + app.track;
    request(endpoint, (err, res, body)=>{
        body = JSON.parse(body);
        box.status = body.result.status;
        box.challenge = body.result.challenge;
        if(box.status == 'granted') cb(true);
        else cb(false);
    });
};
var authorize = (cb)=>{
    var endpoint = box.url + 'login/authorize';
    var options = {
		url    : endpoint,
		method : 'POST',
		json   : {
			   "app_id"      : app.id,
			   "app_name"    : app.name,
			   "app_version" : app.version,
			   "device_name" : app.device
			},
		encode : 'utf-8'
	};
    request(options, (err, res, body)=>{
        if(!err){
            // body = JSON.parse(body);
            app.token = body.result.app_token;
			app.track = body.result.track_id;
            cb(app);
        }
    });
};

var getChalllenge = (cb)=>{
    var endpoint = box.url + 'login';
    request(endpoint, (err, res, body)=>{
        body = JSON.parse(body);
        box.challenge = body.result.challenge;
        cb();
    });
};

var login = (token, cb)=>{
    getChalllenge(()=>{
        var endpoint = box.url + 'login/session';
        app.token = token;
        app.password = crypto.createHmac('sha1', app.token).update(box.challenge).digest('hex');
        var options = {
            url    : endpoint,
    		method : 'POST',
    		json   : {
    			   "app_id" : app.id,
    			   "password" : app.password
    			},
    		encode : 'utf-8'
        };
        request(options, (err, res, body)=>{
            if(!err){
                if(body.success){
                    box.token = body.result.session_token;
                    cb(true);
                }else cb(false);
            }
        });
    });
};

var lsFiles = (path, cb)=>{
    path = new Buffer(path).toString('base64');
    var endpoint = box.url + 'fs/ls/' + path;
    var options = {
        url : endpoint,
        headers : { 'X-Fbx-App-Auth' : box.token },
        method : 'GET',
        encode: 'utf-8'
	};
    request(options, (err, res, body)=>{
        if(!err){
            body = JSON.parse(body);
            cb(body.result);
        }
    });
};

var b64lsFiles = (path, cb)=>{
    var endpoint = box.url + 'fs/ls/' + path;
    var options = {
        url : endpoint,
        headers : { 'X-Fbx-App-Auth' : box.token },
        method : 'GET',
        encode: 'utf-8'
    };
    request(options, (err, res, body)=>{
        if(!err){
            body = JSON.parse(body);
            cb(body.result);
        }
    });
};

var streamFile = (path)=>{
    var evt     = new EventEmitter(),
    endpoint    = box.url + 'dl/' + path,
    options     = {
        url : endpoint,
        headers : { 'X-Fbx-App-Auth' : box.token },
        method : 'GET',
        encode: 'utf-8'
    };
    return (
        request(options).on('data', (chunk)=>{
            evt.emit('data', chunk);
        }).on('end', (end)=>{
            evt.emit('end', end);
        })
    );
};

module.exports = {
    getBox: getBox,
    authorize: authorize,
    isAuthorized: isAuthorized,
    login: login,
    lsFiles: lsFiles,
    streamFile: streamFile,
    b64lsFiles: b64lsFiles
};
