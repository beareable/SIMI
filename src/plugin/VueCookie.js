/**
 * vue cookie plugin
 * 调用demo:
// Setting the cookie Domain
this.$cookie.set('test', 'Random value', {expires: 1, domain: 'localhost'});

// As this cookie is set with a domain then if you wish to delete it you have to provide the domain when calling delete
this.$cookie.delete('test', {domain: 'localhost'});

// Customizing expires
var date = new Date;
date.setDate(date.getDate() + 21);

this.$cookie.set('dateObject', 'A date object', { expires: date });
this.$cookie.set('dateString', 'A parsable date string', { expires: date.toGMTString() });
this.$cookie.set('integer', 'Seven days later', { expires: 7 });
this.$cookie.set('stringSuffixY', 'One year later', { expires: '1Y' });
this.$cookie.set('stringSuffixM', 'One month later', { expires: '1M' });
this.$cookie.set('stringSuffixD', 'One day later', { expires: '1D' });
this.$cookie.set('stringSuffixh', 'One hour later', { expires: '1h' });
this.$cookie.set('stringSuffixm', 'Ten minutes later', { expires: '10m' });
this.$cookie.set('stringSuffixs', 'Thirty seconds later', { expires: '30s' });
this.$cookie.get('stringSuffixs');
 */

    Number.isInteger = Number.isInteger || function (value) {
        return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value;
    };
    // Escape special characters.
    function escapeRe(str) {
        return str.replace(/[.*+?^$|[\](){}\\-]/g, '\\$&');
    }
    // Return a future date by the given string.
    function computeExpires(str) {
        var expires = new Date();
        var lastCh = str.charAt(str.length - 1);
        var value = parseInt(str, 10);
        switch (lastCh) {
            case 'Y': expires.setFullYear(expires.getFullYear() + value); break;
            case 'M': expires.setMonth(expires.getMonth() + value); break;
            case 'D': expires.setDate(expires.getDate() + value); break;
            case 'h': expires.setHours(expires.getHours() + value); break;
            case 'm': expires.setMinutes(expires.getMinutes() + value); break;
            case 's': expires.setSeconds(expires.getSeconds() + value); break;
            default: expires = new Date(str);
        }
        return expires;
    }
    // Convert an object to a cookie option string.
    function convert(opts) {
        var res = '';
        for (var p in opts) {
            if (opts.hasOwnProperty(p)) {
                if (p === 'expires') {
                    var expires = opts[p];
                    if (typeof expires !== 'object') {
                        expires += typeof expires === 'number' ? 'D' : '';
                        expires = computeExpires(expires);
                    }
                    opts[p] = expires.toUTCString();
                }
                if (p === 'secure') {
                    if (opts[p]) {
                        res += ';' + p;
                    }
                    continue;
                }
                res += ';' + p + '=' + opts[p];
            }
        }
        if (!opts.hasOwnProperty('path')) {
            res += ';path=/';
        }
        return res;
    }
    const VueCookie = {
        install: function (Vue) {
            Vue.prototype.$cookie = this;
        },
        set: function (key, value, opts) {
            if(Number.isInteger(opts)) {
                opts = {expires: opts};
            }
            opts = opts ? convert(opts) : convert({});
            var cookie = key + '=' + encodeURIComponent(value) + opts;
            document.cookie = cookie;
        },
        get: function (key, raw) {
            if (typeof key !== 'string' || !key) return null;
            key = '(?:^|; )' + escapeRe(key) + '(?:=([^;]*?))?(?:;|$)';
            var reKey = new RegExp(key);
            var res = reKey.exec(document.cookie);
            return res !== null ? (raw ? res[1] : decodeURIComponent(res[1])) : null;
        },
        delete: function (key, options) {
            var opts = {expires: -1};
            if(options !== undefined) {
                opts = Object.assign(options, opts);
            }
            this.set(key, '', opts);
        }
    };
    export default VueCookie;
