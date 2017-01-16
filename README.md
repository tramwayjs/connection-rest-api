Tramway RestAPIConnection is a simple Connection add-on to simplify the process of reading APIs from an external client built with Node's built-in http module.

# Installation:
1. `npm install tramway-connection-rest-api --save`

# Example project
https://gitlab.com/tramwayjs/tramway-connections-example

# Documentation

## Recommended Folder Structure in addition to Tramway
- config
- connections
- models

## RestAPIConnection
The `RestAPIConnection` is a derived `Connection` which follows the same interface.

### Configuration parameters
| Parameter | Default | Usage |
| --- | --- | --- |
| host | Uses `ServerIPResolverService` to get host machine's IP | Source of API, use it when you have a direct accessible path |
| port | `8080` | Port API is on |
| path | `"/"` | Path from host that resource is on |
| respondAsText | false | Defaults to returning an object, this override will return the response as is from the buffer |

## Getting started
It is recommended to make a config file with the API's core data and make an extension class to handle it before injecting that extension class into the model to work with the rest of Tramway's built-in features. The alternative to the extension class is calling the config parameters with the model every time the model is used instead of just importing the wrapper connection to the model.

In your config folder add a file after the name of your API.

yourapi.js:
```
export default {
    "host": "127.0.0.1",
    "port": 8080,
    "path": "yourresourcepath",
    "respondAsText": false
};
```

Next up, the wrapper `Connection` is simple enough:

YourAPIWrapperConnection.js:
```
import RestAPIConnection from 'tramway-connection-rest-api';
import options from '../config/yourapi.js';

/**
 * @export
 * @class YourAPIWrapperConnection
 * @extends {RestAPIConnection}
 */
export default class YourAPIWrapperConnection extends RestAPIConnection {
    constructor() {
        super(options);
    }
}
```

And then to get the most of it, make the `Model` class. Make sure you have an entity as well.

YourAPIModel.js:
```
import {Model} from 'tramway-core';
import ExampleAPIWrapperConnection from '../connections/ExampleAPIWrapperConnection';
import TestEntity from '../entities/TestEntity';

export default class TestModel extends Model {

    /**
     * Creates an instance of TestModel.
     * 
     * @param {TestEntity} item
     * 
     * @memberOf TestModel
     */
    constructor(item) {
        if (!item || !item instanceof TestEntity) {
            item = new TestEntity();
        }
        super(new ExampleAPIWrapperConnection(), item);
    }

    /**
     * @returns {Number} id
     * 
     * @memberOf TestModel
     */
    getId() {
        return this.entity.getId();
    }

    /**
     * @param {Number} id
     * @returns {Model}
     * 
     * @memberOf TestModel
     */
    setId(id) {
        this.entity.setId(id);
        return this;
    }
}
```

In terms of set up, that's it. You can now use your Model in the Controller just as you would with any connection and get the same experience as with other connections.

Note that not all of the Connection's core functions will be available at this time but here's a rundown of what you have.

## Exposed Methods with this Library

### Connection

| Function | Availability |
| ----- | ----- |
| ```getItem(id: any, cb: function(Error, Object))``` | Available |
| ```getItems(ids: any[], cb: function(Error, Object[]))``` | Available |
| ```findItems(conditions: string/Object, cb: function(Error, Object[]))``` | To come, will convert conditions to query string |
| ```hasItem(id: any, cb: function(Error, boolean))``` | Available, but relies on the endpoint supporting HEAD http method. |
| ```hasItems(ids : any[], cb: function(Error, boolean))``` | Available, but relies on the endpoint supporting HEAD http method. |
| ```countItems(conditions: any, cb: function(Error, number))``` | Not yet available |
| ```createItem(item: Entity/Object, cb: function(Error, Object))``` | Available |
| ```updateItem(id: any, item: Entity/Object, cb: function(Error, Object))``` | Available |
| ```deleteItem(id: any, cb: function(Error, Object))``` | Available |
| ```deleteItems(ids : any[], cb: function(Error, Object[]))``` | Available |
| ```query(query: string/Object, values: Object, cb: function(Error, Object[]))``` | Not available, use findItems when available |

### Model

| Function | Usaability |
| --- | --- |
| ```updateEntity(Object)``` | Usable |
| ```exists(cb: function(Error, boolean))``` | Usable as long as API utilizes HEAD method |
| ```get(cb: function(Error, Object))``` | Usable |
| ```getAll(cb: function(Error, Object[]))``` | Usable |
| ```create(cb: function(Error, Object))``` | Usable |
| ```update(cb: function(Error, Object))``` | Usable |
| ```delete(cb: function(Error, Object))``` | Usable |
| ```find(condtions: string/Object, cb: function(Error, Object[]))``` | Not yet Usable |
| ```getMany(ids: any[], cb: function(Error, Object[]))``` | Usable |
| ```count(conditions, cb: function(Error, number))``` | Not yet Usable |

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