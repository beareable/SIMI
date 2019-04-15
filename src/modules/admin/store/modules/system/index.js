/**
 * 这里定义了mutation-types、state、getters、mutations
 * actions则单独一个文件管理
 */
import * as actions from './actions';
/*--------------------------------------------------------------------*/

/**
 * 定义mutation-types
 */
const FETCH_USER_LIST = 'FETCH_USER_LIST';

/*--------------------------------------------------------------------*/

/**
 * 定义state
 */
const state = {
		userListData:[],
};
/*--------------------------------------------------------------------*/

/**
 * 定义getters
 */
const getters = {
		userListData: state => state.userListData
}
/*--------------------------------------------------------------------*/

/**
 * 定义mutations
 */
const mutations = {
		// 获取管理员列表数据
	    [FETCH_USER_LIST] (state, data) {
	        state.userListData = data
	    }
}
/*--------------------------------------------------------------------*/


export default{
    state,
    actions,
    mutations,
    getters
};