# freebox-node
[dev]interact with a freebox the easy way.

first draft of init/register/login mechanisms.
```

var box = require('my-freebox')

box() =>{
    params: {
        url: {
            mandatory, 
            url of the freebox you wish to communicate with. 
            protcole + (ip or host) + port,
            eg: http://10.21.25.54.12:6574
        },
        app_token: {
            optional,
            app_token of a registered app. 
            if not provided you'll just be able to use the register method.
        }
    },
    role: {
        initialisation of the module. Check if the freebox is avaible, connect to it a first time, retrieve needed informations, create the first session if app_token as been passed. If not just test and check the freebox.
    },
    return: {
        none,
        can trigger a 'error' event if :
            -url passed is wrong,
            -app_token do not permit the authentification,
            -the app do not have a granted access.
    }
}

register()=>{
    params: {
        app_id [string]: A unique app_id string,
        app_name [string]: A descriptive application name (will be displayed on lcd),
        app_version [string]: app version,
        device_name [string]: The name of the device on which the app will be used
    },
    role: {
        try to authorize the application on the freebox.
        You'll have to grant the app directly on the freebox screen.
    },
    retrun: {
        A promise.
        if success the 'then' will be as:{
            {
              "app_token": "xxxxxxxxxxxxxxxx...",
              "track_id": 42
            }
        }
        if not the catch will inform about the error.
    }

}
```
