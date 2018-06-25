Tramway RestApiProvider is a simple Provider add-on to simplify the process of reading APIs from an external client built with Node's built-in http module.

# Installation:
1. `npm install tramway-connection-rest-api --save`

# Example project
https://gitlab.com/tramwayjs/tramway-connection-example

# Documentation

## Recommended Folder Structure in addition to Tramway
- config
- providers
- repositories
- entities

## RestApiProvider
The `RestApiProvider` is a derived `Provider` which follows the same interface.

### Configuration parameters
| Parameter | Default | Usage |
| --- | --- | --- |
| host | Uses `ServerIPResolverService` to get host machine's IP | Source of API, use it when you have a direct accessible path |
| port | `8080` | Port API is on |
| path | `"/"` | Path from host that resource is on |
| respondAsText | false | Defaults to returning an object, this override will return the response as is from the buffer |
| headers | undefined | Indicates what headers to use with the request. Note that for a standard API that will perform POST and PUT requests with a JSON object, it is recommended to use the following as part of your headers: ```{"content-type": "application/json; charset=utf-8"}```. |

## Getting started
It is recommended to make a config file with the API's core data and make an extension class to handle it before injecting that extension class into the model to work with the rest of Tramway's built-in features. The alternative to the extension class is calling the config parameters with the Repository every time the repository is used instead of just importing the provider to the repository.

In your config folder add a file after the name of your API.

yourapi.js:
```
export default {
    "host": "127.0.0.1",
    "port": 8080,
    "path": "yourresourcepath",
    "respondAsText": false,
    "headers": {"content-type": "application/json; charset=utf-8"}
};
```

Next up, the wrapper `Provider` is simple enough:

YourAPIProvider.js:
```
import RestApiProvider from 'tramway-connection-rest-api';
import options from '../config/yourapi.js';

/**
 * @export
 * @class YourAPIProvider
 * @extends {RestApiProvider}
 */
export default class YourAPIProvider extends RestApiProvider {
    constructor() {
        super(options);
    }
}
```

And then to get the most of it, pass the provider to your `Repository` class.

```
import {Repository} from 'tramway-core-connection';
import YourAPIProvider from '../connections/YourAPIProvider';

new Repository(new YourAPIProvider(options), new Factory());
```

The following can also be easily achieved with dependency injection using `tramway-core-dependency-injector`.

Note that not all of the Provider's core functions will be available at this time but here's a rundown of what you have.

## Exposed Methods with this Library

### Provider

| Function | Availability |
| ----- | ----- |
| ```getOne(id: any)``` | Available |
| ```getMany(ids: any[])``` | Available |
| ```get()``` | Available |
| ```find(conditions: string/Object)``` | To come, will convert conditions to query string |
| ```has(id: any)``` | Available, but relies on the endpoint supporting HEAD http method. |
| ```hasThese(ids : any[])``` | Available, but relies on the endpoint supporting HEAD http method. |
| ```count(conditions: any)``` | Not yet available |
| ```create(item: Entity/Object)``` | Available |
| ```update(id: any, item: Entity/Object)``` | Available |
| ```delete(id: any)``` | Available |
| ```deleteMany(ids : any[])``` | Available |
| ```query(query: string/Object, values: Object)``` | Not available, use findItems when available |

### Repository

| Function | Usaability |
| --- | --- |
| ```exists(id: any)``` | Usable as long as API utilizes HEAD method |
| ```getOne(id: any)``` | Usable |
| ```get()``` | Usable |
| ```create(entity: Entity)``` | Usable |
| ```update(entity: Entity)``` | Usable |
| ```delete(id: any)``` | Usable |
| ```find(condtions: string/Object)``` | Not yet Usable |
| ```getMany(ids: any[])``` | Usable |
| ```count(conditions)``` | Not yet Usable |

## Services
The API suite provides a new `ServerIPResolverService` to get the IP address of the host machine. 

To use it, import the class and use the static `getIp` method.

```
import {services} from 'tramway-connection-rest-api`;
let {ServerIPResolverService} = services;
```

To use it:

```
let ip = ServerIPResolverService.getIp();
```