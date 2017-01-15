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
| host | `"127.0.0.1"` | Source of API |
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

## Model

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

































## Config
Here is where you can put all the parameters for express - like CORS

## Connections
Connections are your way to access data sets from a data source, be it a database or API

To create a connection, import the class and implement a derived class with the abstracted stubs to get the most out of it.
```
import {Connection} from 'tramway-core';
```

| Function | Usage |
| ----- | ----- |
| ```constructor()``` | Handles database configuration |
| ```getItem(id: any, cb: function(Error, Object))``` | Passes the item gotten from the database configuration to the res in the callback |
| ```getItems(ids: any[], cb: function(Error, Object[]))``` | Passes an array of items for an array of ids. |
| ```findItems(conditions: string/Object, cb: function(Error, Object[]))``` | Returns an array of items for a query on specific conditions. This may be done by object or query string depending on your implementation |
| ```hasItem(id: any, cb: function(Error, boolean))``` | Checks if item exists |
| ```hasItems(ids : any[], cb: function(Error, boolean))``` | Checks if a set of items exists |
| ```countItems(conditions: any, cb: function(Error, number))``` | Gets a count of items that meet the conditions. |
| ```createItem(item: Entity/Object, cb: function(Error, Object))``` | Creates an object in the database from an `Entity` or standard object |
| ```updateItem(id: any, item: Entity/Object, cb: function(Error, Object))``` | Updates the item found with the given id |
| ```deleteItem(id: any, cb: function(Error, Object))``` | Removes an item from the datastore and returns it |
| ```deleteItems(ids : any[], cb: function(Error, Object[]))``` | Removes items from the datastore and returns them |
| ```query(query: string/Object, values: Object, cb: function(Error, Object[]))``` | Meant as an override based on your datastore because we can't always rely on simple CRUD |

## Models
Models allow you to link an entity to a connection and abstract many of the common methods by using the Connection's interface. Unless you need to change logic or add extra logic, a `Model`, given an `Entity` and `Connection`, the implementation can be as simple as the following.

```
import {Model} from 'tramway-core';
import TestConnection from '../connections/TestConnection';
import TestEntity from '../entities/TestEntity';
export default class SampleModel extends Model {
    constructor(item) {
        if (!item || !item instanceof TestEntity) {
            item = new TestEntity();
        }
        super(new TestConnection(), item);
    }
    
    getId() {
        return this.entity.getId();
    }
    
    setId(id) {
        this.entity.setId(id);
        return this;
    }
```
### Summary of Model Spec

| Function | Usage |
| --- | --- |
| ```constructor(Connection, Entity)``` | Constructor takes a Connection and entity |
| ```getId()``` | Acts as an interfact to get the entity's id and needs to be implemented since it is entity-specific |
| ```setId(id)``` | Sets the id of internalized connection parameters to be for the given object |

### Exposed methods to use
All of these methods rely on the Connection's implementation and will just interact with the Connection.

| Function | Usage |
| --- | --- |
| ```updateEntity(Object)``` | Updates entity based on object given |
| ```exists(cb: function(Error, boolean))``` | Calls Connection's exist function |
| ```get(cb: function(Error, Object))``` | Gets entity with set id |
| ```getAll(cb: function(Error, Object[]))``` | Gets all objects from the entity's set |
| ```create(cb: function(Error, Object))``` | Creates an object in the entity's set and returns the persisted object |
| ```update(cb: function(Error, Object))``` | Updates the object with the set id with the updated entity |
| ```delete(cb: function(Error, Object))``` | Deletes the item with the Model's set id.|
| ```find(condtions: string/Object, cb: function(Error, Object[]))``` | Finds an object in the entity's set with given conditions - based on `Condition`'s `findItems` implementation. |
| ```getMany(ids: any[], cb: function(Error, Object[]))``` | Gets objects tied to a list of ids |
| ```count(conditions, cb: function(Error, number))``` | Gets a count of objects for given conditons |

## Entity
An entity is a simple class that contains the getters and setters for its properties. It also comes with validation and serialization.

| Function | Usage |
| --- | --- |
| ```constructor(obj: Object)``` | Converts a passed object into the proper attributes |
| ```hasAttribute(attribute: string): boolean``` | Checks if attribute is in the Entity |
| ```serialize(): string``` | Returns stringified JSON |
| ```unserialize(item): Entity``` | Sets own attributes based on serialized string |

To create an entity, extend the class.
```
import {Entity} from 'tramway-core';
```

## Routes
Routes are where you store the routes that the `Router` will take.

A typical routes file in the routes folder would import Controllers and directly assign their actions to a route. The resulting JSON would be consumed and converted by the router into a standard, secure or restful route.

Here's a sample routes file. The order of routes matters and is preserved by the router at all times.

```
import MainController from "../controllers/MainController";
import SecuredController from "../controllers/SecuredController";
import StandardAuthenticationPolicy from "../policies/StandardAuthenticationPolicy";
import TestRestController from '../controllers/TestRestController';
let standardAuthenticationStrategy = new StandardAuthenticationPolicy();
const routesValues = [
    {
        "methods": ["get"],
        "controller": MainController.index
    },
    {
        "path": "/model",
        "controllerClass": TestRestController,
        "arguments": ["id"]
    },
    {
        "path": "/hello",
        "arguments": ["name"],
        "methods": ["get"],
        "controller": MainController.sayHello
    },
    {
        "path": "/secure",
        "methods": ["get"],
        "controller": SecuredController.index,
        "policy": standardAuthenticationStrategy
    },
    {
        "arguments": ["name"],
        "methods": ["get"],
        "controller": MainController.sayHello
    },
    {
        "arguments": ["name"],
        "methods": ["post", "put"],
        "controller": MainController.postTest
    }
];
export default routesValues;
```

### Route specs
| Attribute | Expected Values | Default Values | Notes |
| --- | --- | --- | --- |
| path | Unparameterized path string | "/" | If no path is specified, the router will default to root. |
| controller | `Controller`'s action function | undefined | If no controllerClass is specified, the app will break |
| controllerClass | `RestfulController` | undefined | The controller that a restful route will use - note that controller attribute will be ignored |
| methods | ["get", "post", "put", "delete", "all"] | ["get"] | Indicates which http methods get assigned the controller. Restful routes will ignore this setting as it is automatically bound by implenentation |
| arguments | string[] | "" | An optional ordered array of arguments to add to the path. ["id", "name"] equates to "/:id/:name"
| policy | `AuthenticationStrategy` | undefined | Ignored if unpresent, applies a policy or authentication strategy before allowing the router to proceed to the controller when a request is made to the  |

## Router
The Router will be called in your main server file where you create your Express server and get the routes file. This is typically at the root of your project. Once you have a router, initializing it will set up the routes and assign them to the app and return the app to be started via listen.

Here's an example usage among parts of an express server file:
```
import express from 'express';
import {Router} from 'tramway-core';
import routes from './routes/routes.js';

const PORT = 8080;

let app = express();
let router = new Router(app, routes);
app = router.initialize();
app.listen(PORT);
```

The router also exposes some static methods which can be used across your app without making another instance.

| Function | Usage | Notes |
| --- | --- | --- |
| ```buildPath(...string): string``` | ```"a/b/c" === Router.buildPath("a", "b", "c")``` | Returns a clean path given any number of strings. |
| ```buildQuery(params: Object): string``` | ```"a=1&b=2&c=true" === Router.buildQuery({"a": 1, "b": 2, "c": true})``` | Returns a query string for any associative object |

## Controllers
Controllers link to actions from the routing and act to direct the flow of the application.

To create a controller, import the class and implement a derived class with static functions for each route.
```
import {Controller} from 'tramway-core'; 
```
*Sample Controller action signature:*
```
static index(req, res) {}
```
`req` and `res` represent the respective objects passed by your router. With Express the request and response objects are passed by default.

The Controller class also contains some helper functions that can be used by any child Controller - including RestfulController.

| Function | Usage |
| --- | --- |
| ```getRouter(): Router``` | Returns the Router class for extendability |
| ```redirect(res: Object, path: string, status: number)``` | Calls the main redirect function in Express. |

### Restful Controllers
If you're just writing a Restful API, it can rapidly become tedious and messy when you end up creating each part of the CRUD structure and register each route. 

Much of the logic behind this process can be abstracted, such that if you already have a `Connection` and a linked `Model`, all you will have to do is make a derived `RestfulController` to put it altogether.

Here's a sample `RestfulRouter` implementation.
```
import {controllers} from 'tramway-core';
import TestModel from '../models/TestModel';
let {RestfulController} = controllers;

export default class TestRestController extends RestfulController {
    static get(req, res) {
        let testModel = (new TestModel()).setId(req.params.id);
        return super.get(testModel, req, res);
    }
    static getAll(req, res) {
        let testModel = new TestModel();
        return super.getAll(testModel, req, res);
    }
    static create(req, res) {
        let testModel = new TestModel().updateEntity(req.body);
        return super.create(testModel, req, res);
    }
    static update(req, res) {
        let testModel = new TestModel().updateEntity(req.body).setId(req.params.id);
        return super.update(testModel, req, res);
    }
    static delete(req, res) {
        let testModel = new TestModel().setId(req.params.id);
        return super.delete(testModel, req, res);
    }
}
```
## Policies
Policies let you regulate routing for authentication or permissions-based reasons. This allows you to write authentication code in one place, use it in the router and not have to burden the rest of the codebase with it.

To write an authentication policy, import the class and implement the stubs.
```
import {policies} from 'tramway-core';
let {AuthenticationStrategy} = policies;
```

| Function | Usage |
| --- | --- |
| ```constructor()``` | Sets a redirect via ```super(redirectRoute: string)``` |
| ```login(cb: function(Error, any))``` | Implements and handles login criteria for the strategy |
| ```logout(cb: function(Error, any))``` | Implements and handles logout criteria for the strategy |
| ```check(cb: function(Error, any))``` | Implements and handles the check on the current status of user with regards to the policy. |

If a policy is indicated with the route, it will call the framework's internal Security service which will return a result based on the check performed by the Authentication service using the Authentication strategy - which uses strategy pattern. It's at this point where the router will redirect with a 401 to the policy's redirect route if the strategy's check criteria fails.

## Services
The services folder is to place any logic that handles specific core tasks. The framework comes with a service itself.

### Type Enforcement Service
The type enforcement service makes up for the short-comings of typing in JavaScript and lets your app cleanly enforce types if need be. The utility service comes with a few static methods to let you enforce basic types or custom classes and either throw an Error (default) or override the behavior with a less obstructive way to handle it.

To use the `TypeEnforcementService` just import it.
```
import {services} from 'tramway-core`;
let {TypeEnforcementService} = services;
```

| Function | Usage | Notes |
| --- | --- | --- |
| ```enforceTypes(value: any, types: Set<string>/string[]/string, errorHandler: function(value): value): value``` | ```TypeEnforcementService.enforceTypes(someValue, ["string", "number"]);``` | `errorHandler` is optional. Will check basic types using typeof and return value if valid or throw `WrongTypeError` |
| ```enforceInstance(value: any, expectedClass: Object, errorHandler: function(value): value): value``` | ```TypeEnforcementService.enforceTypes(someValue, SomeClass);``` | `errorHandler` is optional. Will check basic types using instanceof and return value if valid or throw `WrongTypeError` |

## Errors
All errors extend Javascript's `Error` class and naming repeated ones comes in handy when reading code and writing it quickly. The framework comes with errors which can be accessed and used.

```
import {errors} from 'tramway-core';
let {WrongTypeError, AbstractMethodError} = errors;
```

| Function | Usage | Notes |
| --- | --- | --- |
| WrongTypeError | ```new WrongTypeError(expectedType: string, gotType: string)```| Used when the wrong type is passed. |
| AbstractMethodError | ```new AbstractMethodError()``` | Used when an abstract method is made to ensure it gets overridden in a child class - there to fill a shortcoming of Javascript missing Interfaces and Abstract classes. |



