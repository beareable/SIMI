import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

/**
 * get请求
 * @param  {String} options.url   api地址
 * @param  {String} options.query query参数
 * @return {Promise}               Promise
 */
export const _get = ({ url, query }, commit) => {
    if (commit){
        commit('START_LOADING');
    }
    return Vue.http.get(url,{params:query}).then((res) => {
        if (commit){
            commit('FINISH_LOADING');
        }
        if (res.status >= 200 && res.status < 300) {
            return res.data;
        }
        return Promise.reject(new Error(res.status));
    });
}

/**
 * post请求
 * @param  {String} options.url   api地址
 * @param  {String} options.query query参数
 * @return {Promise}               Promise
 */
export const _post = ({ url, query }, commit) => {
    if (commit){
        commit('START_LOADING');
    }
    return vue.http.post(url,query).then((res) => {
            if (commit){
                commit('FINISH_LOADING');
            }
            if (res.status >= 200 && res.status < 300) {
        return res.data;
    }
    return Promise.reject(new Error(res.status));
});
}
