/*eslint-env node, es6*/
'use strict';

/*
 * needed constants
 */
exports.PORT = process.env.STATSD_PORT;
exports.HOST = process.env.STATSD_HOST;

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const TYPES = {
    keyvalue: 'kv',
    gauge: 'g',
    timer: 'h',
    counter: 'c',
    set: 's',
};

each((verb, type) => {
    // export a composite function
    exports[type] = (key, value, flag) => exports.send(format(verb, key, value, flag));

    // give the generated function a name
    Object.defineProperty(exports[type],
                          'name',
                          { value: `exports$${type}` });
}, TYPES);

/**
 * Send a request to StatsD using the UDP Socket
 *
 * @param {String} _data
 * @return {Promise}
 */
exports.send = function send(_data) {
    let data;
    if (!Buffer.isBuffer(_data)) {
        data = new Buffer(_data);
    } else {
        data = _data;
    }

    socket.send(data, 0, data.length, exports.PORT, exports.HOST)
};

/**
 * Format a message for statsd
 *
 * protocol: String
 *
 * @param {String} verb
 * @param {String} key
 * @param {String|Number} value
 * @param {String} flag
 * @return {String}
 */
function format(verb, key, value, flag) {
    let flap = '';
    if (flag) {
        flap = `|@${flag}`;
    }
    return `${key}:${value}|${verb}${flap}\n`;
}


/**
 * Set multiple properties using a single packet
 *
 * protocol: String
 *
 * @param {String} _prefix
 * @return {Object} a list of augmented methods
 */
exports.multi = function multi(_prefix) {
    const prefix = _prefix ? `${_prefix}.` : '';
    let command = '';

    const m = map((_, verb) => {
        return (key, value, flag) => {
            command += format(verb, `${prefix}${key}`, value, flag);
            return m;
        };
    }, TYPES);

    m.send = () => exports.send(command);

    return m;
};


/**
 * For Each function ... like ramda's
 *
 * @api private
 */
function each(fn, obj) {
    if (Array.isArray(obj)) {
        return obj.forEach(fn);
    }
    Object.keys(obj).forEach((key) => fn(obj[key], key));
}

/**
 * Map function ... like ramda's
 *
 * @api private
 */
function map(fn, obj) {
    if (Array.isArray(obj)) {
        return obj.map(fn);
    }

    const o = {};
    each((value, key) => {
        o[key] = fn(key, value);
    }, obj);
    return o;
}
