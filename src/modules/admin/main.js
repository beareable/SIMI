import Vue from 'vue';
import router from './router';
import store from './store';
import { sync } from 'vuex-router-sync';
import * as filters from '../../util/Filters';
import VueCookie from '../../plugin/VueCookie';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas,far)

import 'vue2-animate/dist/vue2-animate.min.css'

import VueBus from 'vue-bus';
Vue.use(VueBus);

import './errorLog'// error log
import ElementUI from 'element-ui';

Vue.use(ElementUI);
Vue.prototype.$ELEMENT = { size: 'small' };
Vue.use(VueCookie);

Vue.config.productionTip = true

import App from './App';
//sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router);

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

//兼容IE下不支持数组find函数问题
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
    
            var o = Object(this);
    
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
    
            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
    
            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];
    
            // 5. Let k be 0.
            var k = 0;
    
            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }
    
            // 7. Return undefined.
            return undefined;
        }
    });
}
//兼容IE、andriod下不支持Object.assign问题
if (typeof Object.assign != 'function') {
	Object.assign = function(target) {
		'use strict';
	    if (target == null) {
	      throw new TypeError('Cannot convert undefined or null to object');
	    }
	    target = Object(target);
	    for (var index = 1; index < arguments.length; index++) {
	    	var source = arguments[index];
	    	if (source != null) {
	    		for (var key in source) {
	    			if (Object.prototype.hasOwnProperty.call(source, key)) {
	    				target[key] = source[key];
	    			}
	    		}
	    	}
	    }
	    return target;
	};
}

/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
