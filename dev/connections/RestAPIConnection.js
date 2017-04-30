import {Router} from 'tramway-core-router';
import {Connection} from 'tramway-core-connection';
import RestAPISettingsEntity from '../entities/RestAPISettingsEntity';
import http from 'http';

export default class RestAPIConnection extends Connection {
    constructor(options) {
        super();
        this.options = new RestAPISettingsEntity(options);
    }
    
    /**
     * @param {function(Error, Object)} cb
     * 
     * @memberOf RestAPIConnection
     */
    getAllItems(cb) {
        return this.sendRequest("get", cb);
    }

    /**
     * @param {number|string} id
     * @param {function(Error, Object)} cb
     * 
     * @memberOf RestAPIConnection
     */
    getItem(id, cb) {
        return this.sendRequest("get", {params: `${id}`}, cb);
    }

     /**
     * @param {number[]} ids
     * @param {function(Error, Object[])} cb
     * 
     * @memberOf RestAPIConnection
     */
    getItems(ids, cb) {
        return this.sendRequest("get", {query: {ids: JSON.stringify(ids)}}, cb);
    }

     /**
     * @param {number|string} id
     * @param {function(Error, boolean)} cb
     * 
     * @memberOf RestAPIConnection
     */
    hasItem(id, cb) {
        return this.sendRequest("head", {params: `${id}`}, cb);
    }

    /**
     * @param { string[] | number[] } ids
     * @param {function(Error, boolean)} cb
     * 
     * @memberOf RestAPIConnection
     */
    hasItems(ids, cb) {
        return this.sendRequest("head", {query: {ids: JSON.stringify(ids)}}, cb);
    }

    /**
     * @param {Object} item
     * @param {function(Error, Object)} cb
     * 
     * @memberOf RestAPIConnection
     */
    createItem(item, cb) {
        return this.sendRequest("post", {body: item}, cb);
    }

    /**
     * @param {number|string} id
     * @param {Object} item
     * @param {function(Error, Object)} cb
     * 
     * @memberOf RestAPIConnection
     */
    updateItem(id, item, cb) {
        return this.sendRequest("put", {params: {id: `${id}`}, body: item}, cb);
    }

     /**
     * @param {number|string} id
     * @param {function(Error, Object)} cb
     * 
     * @memberOf RestAPIConnection
     */
    deleteItem(id, cb) {
        return this.sendRequest("delete", {params: {id: `${id}`}}, cb);
    }

    /**
     * @param { number[] | string[]} id
     * @param {function(Error, Object[])} cb
     * 
     * @memberOf RestAPIConnection
     */
    deleteItems(id, cb) {
        return this.sendRequest("delete", {query: {ids: JSON.stringify(ids)}}, cb);
    }

    /**
     * @param {Object} params
     * @param {Object} query
     * @return {string} path
     * 
     * @memberOf RestAPIConnection
     */
    preparePath(params, query) {
        let path = this.options.getPath();

        if (params) {
            path = Router.buildPath(path, ...Object.values(params));
        }

        if (query) {
            path += '?' + Router.buildQuery(query);
        }

        return Router.buildPath("/", path);
    }

    /**
     * @param {RestAPISettingsEntity|Object} opts
     * @param {string} method
     * @param {Object} req
     * @returns
     * 
     * @memberOf RestAPIConnection
     */
    prepareOptions(opts, method, req) {
        let options = new RestAPISettingsEntity(this.options);
        options.setMethod(method).setJson();

        let path = this.preparePath(req.params, req.query);
        options.setPath(path);
        return options;
    }
    
    /**
     * @param {string} method
     * @param {Object} req
     * @param {function(Error, Object[])} cb
     * 
     * @memberOf RestAPIConnection
     */
    sendRequest(method, req, cb) {
        if(typeof req === "function") {
            cb = req;
            req = {};
        }

        let options = this.prepareOptions(this.options, method, req);
        let respondAsText = options.shouldRespondAsText();

        let request = http.request(options, function(res) {
            var response = "";
            res.on("data", function(chunk) {
                response += chunk;
            });

            res.on("end", function() {
                if (respondAsText) {
                    cb(null, response);
                } else {
                    cb(null, JSON.parse(response));
                }
            });
        });

        if (req.body) {
            request.write(JSON.stringify(req.body));
        }

        request.on('error', function(err) {
            cb(err);
        });

        request.end();
    }
}