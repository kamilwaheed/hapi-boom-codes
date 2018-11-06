# hapi-boom-codes 

You do:

```javascript
var hapiRouteController = (request, h) => {
  return Boom.badRequest('The email address looks funny.', { code: 'InvalidEmail' });
}
```

You get:

```
{
  statusCode: 400, // thanks to boom
  error: 'Bad Request', // thanks to boom
  message: 'The email address looks funny.', // thanks to boom
  code: 'InvalidEmail' // thanks to hapi-boom-codes
}
```


## Install

```bash
$ npm install --save hapi-boom-codes
```


## API

First, [register](http://hapijs.com/api#serverregisterplugins-options-callback) the plugin.

Then, put a `code` property on the `data` param when calling any of the Boom methods.

```javascript
Boom.badRequest([message], { code: 'SomethingBadHappened' });
Boom.forbidden([message], { code: 'NoDirtyBusiness' });
```


## Release History

### v1.0.0 (13/10/2015)

 - Initial commit

### v2.0.0 (06/11/2018)

 - Hapi 17 support

## License

Copyright (c) 2015 Kamil Waheed. Licensed under the MIT license.