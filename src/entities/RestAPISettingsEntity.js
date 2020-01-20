import {services} from 'tramway-core';
import {Entity} from 'tramway-core-connection';
import ServerIPResolverService from '../services/ServerIPResolverService';
let {TypeEnforcementService} = services;

const DEFAULT_PORT = 8080;
const DEFAULT_PATH = '';
const DEFAULT_RESPOND_AS_TEXT = false;

/**
 * @export
 * @class RestAPISettingsEntity
 * @extends {Entity}
 */
export default class RestAPISettingsEntity extends Entity {
    /**
     * Creates an instance of RestAPISettingsEntity.
     * 
     * @param {Object} settings
     * 
     * @memberOf RestAPISettingsEntity
     */
    constructor(settings) {
        super();
        let {host, port, path, respondAsText, headers} = settings || {};
        this.setHost(host)
            .setPort(port)
            .setPath(path)
            .setRespondAsText(respondAsText)
            .setHeaders(headers);
    }

    /**
     * @returns {string}
     * 
     * @memberOf RestAPISettingsEntity
     */
    getHost() {
        return this.host;
    }

    /**
     * @param {string} host
     * @returns
     * 
     * @memberOf RestAPISettingsEntity
     */
    setHost(host) {
        this.host = TypeEnforcementService.enforceTypes(host, 'string', function(value) {
            return ServerIPResolverService.getIp();
        });
        return this;
    }

    /**
     * @returns {number}
     * 
     * @memberOf RestAPISettingsEntity
     */
    getPort() {
        return this.port;
    }

    /**
     * @param {number} port
     * @returns
     * 
     * @memberOf RestAPISettingsEntity
     */
    setPort(port) {
        this.port = TypeEnforcementService.enforceTypes(port, 'number', function(value) {
            return DEFAULT_PORT;
        });
        return this;
    }

    /**
     * @returns {string}
     * 
     * @memberOf RestAPISettingsEntity
     */
    getPath() {
        return this.path;
    }

    /**
     * @param {string} path
     * @returns
     * 
     * @memberOf RestAPISettingsEntity
     */
    setPath(path) {
        this.path = TypeEnforcementService.enforceTypes(path, 'string', function(value) {
            return DEFAULT_PATH;
        }); 
        return this;
    }

    /**
     * @returns {boolean}
     * 
     * @memberOf RestAPISettingsEntity
     */
    shouldRespondAsText() {
        return this.respondAsText;
    }

    /**
     * @param {boolean} value
     * @returns
     * 
     * @memberOf RestAPISettingsEntity
     */
    setRespondAsText(value = DEFAULT_RESPOND_AS_TEXT) {
        this.respondAsText = value;
        return this;
    }

    /**
     * @returns {string}
     * 
     * @memberOf RestAPISettingsEntity
     */
    getMethod() {
        return this.method;
    }

    /**
     * @param {string} method
     * @returns
     * 
     * @memberOf RestAPISettingsEntity
     */
    setMethod(method) {
        method = TypeEnforcementService.enforceTypes(method, 'string', function() {
            return null;
        });

        if (null !== method) {
            this.method = method.toUpperCase();
        }

        return this;
    }

    /**
     * @returns {boolean}
     * 
     * @memberOf RestAPISettingsEntity
     */
    isJson() {
        return this.json;
    }

    /**
     * @param {boolean} value
     * 
     * @memberOf RestAPISettingsEntity
     */
    setJson(value = true) {
        this.json = value;
        return this;
    }

    /**
     * @returns {Object}
     * 
     * @memberOf RestAPISettingsEntity
     */
    getHeaders() {
        if ("headers" in this) {
            return this.headers;
        }

        return null;
    }

    /**
     * @param {Object} headers
     * @returns
     * 
     * @memberOf RestAPISettingsEntity
     */
    setHeaders(headers) {
        if (headers) {
            this.headers = headers;
        }
        return this;
    }

}