# freebox-node
[dev]interact with a freebox the easy way.

This is a draft. login/register mechanisms are working, but use with very much caution. 

```javascript
var freebox = require('./index');
```
## Register your app:
_First declare your app_

```javascript
/*
id: A unique app_id string
name: A descriptive application name (will be displayed on lcd)
version app version
device_name string
*/
freebox.getBox(id, name, version, device, ip, function(response){/* */});
```

_Then register it:_

```javascript
freebox.authorize(function(){/* */});
``` 
 **you will have to accept the app on the LCD screen at this point!**

_finally you can login_ 
> Note: if your app is already registered and you already have the app_token you Should skip the register part. 

```javascript
freebox.login(app_token, function(){/* */});
``` 
# Methods: 

```javascript
//list files for a given path.
freebox.lsFiles(path, function(files){/* */})

//streamFile directly from freebox
freebox.streamFile(b64Path)
.on('data', (data)=>{/* */})
.on('end', (end)=>{/* */});
```

##TODO

 * add the app_token in getBox, for app already registered.
 * transform the getBow into constructor.
