import * as api from '../../../../../lib/api.js';

let base_url = window.base_url;
const formatUrl = (type)=>{
    let url = base_url;
    type = type.toUpperCase();
    switch(type){
        case "FETCH_USER_LIST":
            url += "admin/staff/items/";
            break;
        default:
            url = '';
            break;
    }
    return url;
}

/**
 * 列表管理员列表数据
 * @param  {Function} options.commit store对象解构出来的函数，无需手动提供
 * @param  {Object} query             参数
 * @return {Promise}                  Promise
 */
export const fetchUserList = ({ commit }, query) => {
    const url = formatUrl("FETCH_USER_LIST");
    return api._get({url, query}, commit).then((json) => {
        /* if (json.retcode === 0) {
            return commit('FETCH_USER_LIST', json);
        }
        return Promise.reject(new Error('fetchUsers failure')); */
        return commit('FETCH_USER_LIST', json);
    }).catch((error) => {
        // commit('FETCH_TOPIC_LISTS_FAILURE', topicTab, page)
        return Promise.reject(error);
    });
};


