# freebox-node
[dev]interact with a freebox the easy way.

This is a draft. login/register mechanisms are working, but use with very much caution. 

```var freebox = require('./index);```
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
