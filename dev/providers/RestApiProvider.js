import {Router} from 'tramway-core-router';
import {Provider} from 'tramway-core-connection';
import RestAPISettingsEntity from '../entities/RestAPISettingsEntity';
import http from 'http';

export default class RestApiProvider extends Provider {
    constructor(options) {
        super();
        this.options = new RestAPISettingsEntity(options);
    }
    
    /**
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async get() {
        return await this.sendRequest("get");
    }

    /**
     * @param {number|string} id
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async getOne(id) {
        return await this.sendRequest("get", {params: {id: `${id}`}});
    }

    /**
     * @param {number[]} ids
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async getMany(ids) {
        return await this.sendRequest("get", {query: {ids: JSON.stringify(ids)}});
    }

     /**
     * @param {number|string} id
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async has(id) {
        return await this.sendRequest("head", {params: {id: `${id}`}});
    }

    /**
     * @param { string[] | number[] } ids
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async hasThese(ids) {
        return await this.sendRequest("head", {query: {ids: JSON.stringify(ids)}});
    }

    /**
     * @param {Object} item
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async create(item) {
        return await this.sendRequest("post", {body: item});
    }

    /**
     * @param {number|string} id
     * @param {Object} item
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async update(id, item) {
        return await this.sendRequest("put", {params: {id: `${id}`}, body: item});
    }

     /**
     * @param {number|string} id
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async delete(id) {
        return await this.sendRequest("delete", {params: {id: `${id}`}});
    }

    /**
     * @param { number[] | string[]} id
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async deleteMany(ids) {
        return await this.sendRequest("delete", {query: {ids: JSON.stringify(ids)}});
    }

    /**
     * @param {Object} conditions
     * @returns {Object|string}
     * @throws {Error}
     * 
     * @memberOf RestApiProvider
     */
    async find(conditions, path = '') {
        return await this.sendRequest("get", {query: conditions, params: {path: `${path}`}});
    }

    /**
     * @param {Object} params
     * @param {Object} query
     * @return {string} path
     * 
     * @memberOf RestApiProvider
     */
    preparePath(params, query) {
        let path = this.options.getPath();

        if (params) {
            let appended = [];
            for (let key in params) {
                let param = `:${key}`;

                if (-1 === path.search(param)) {
                    appended.push(params[key]);
                    continue;
                }

                path = path.replace(`:${key}`, params[key]);
            }

            path = Router.buildPath(path, ...appended);
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
     * @memberOf RestApiProvider
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
     * @returns {Promise}
     * 
     * @memberOf RestApiProvider
     */
    async sendRequest(method, req = {}) {
        let options = this.prepareOptions(this.options, method, req);
        let respondAsText = options.shouldRespondAsText();

        return await new Promise((resolve, reject) => {
            let request = http.request(options, res => {
                let response = "";

                if (200 < res.statusCode && 300 > res.statusCode) {
                    return resolve(res.headers);
                }

                if (400 <= res.statusCode) {
                    let err = new Error(response);
                    err.statusCode = res.statusCode;
                    return reject(err);
                }
                
                res.on("data", function(chunk) {
                    response += chunk;
                });
    
                res.on("end", () => {
                    let reply = respondAsText ? response : JSON.parse(response);
                    resolve(reply);
                });
            });
    
            if (req.body) {
                request.write(JSON.stringify(req.body));
            }
    
            request.on('error', function(err) {
                return reject(err);
            });
    
            request.end();
        });
    }
}