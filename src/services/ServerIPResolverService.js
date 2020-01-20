import os from 'os';

const DEFAULT_LOCAL_HOST = '127.0.0.1';

/**
 * @export
 * @class ServerIPResolverService
 */
export default class ServerIPResolverService {
    /**
     * @static
     * @returns {string} ip
     * 
     * @memberOf ServerIPResolverService
     */
    static getIp() {
        let networkInterfaces = os.networkInterfaces();
        let values = Object.keys(networkInterfaces)
            .map(key => networkInterfaces[key])
            .filter(function(ip) {
                return ip.family == 'IPv4' && ip.internal == false;
            });
        return values.length ? values[0].address : DEFAULT_LOCAL_HOST;
    }
}