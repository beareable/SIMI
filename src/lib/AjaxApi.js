import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;
//Vue.http.headers.common['X-CSRF-TOKEN'] = "YXBpOnBhc3N3b3Jk";//$('meta[name="csrf-token"]').attr('content');

/**
 * 通过VueResource异步get数据
 * @param url           请求地址
 * @param params        请求参数
 * @param callback      回调函数
 * @returns void
 */
export function ajaxGet(url,params,callback){
	params = 
	{
		params: params,
		timeout: 12000
    };
	return _ajaxApi('get',url,params,callback);
}
/**
 * 通过VueResource异步post数据
 * @param url           请求地址
 * @param params        请求参数
 * @param callback      回调函数
 * @returns void
 */
export function ajaxPost(url,params,callback){
    if(window._token && !params[window._token['name']]){
        params[window._token['name']] = window._token.value;
    }
    return _ajaxApi('post',url,params,callback);
}
/**
 * 通过axios异步
 * @param method        请求类型: get、post
 * @param url           请求地址
 * @param params        请求参数
 * @param callback      回调函数
 * @returns void
 */
export function _ajaxApi(method,url,params,callback){
	var options = {timeout:12000};
	return Vue.http[method](url, params,options).then(function (response) {
        if(response.body.token){
            window._token = response.body.token;
        }
		if(typeof callback == 'function'){
			if(response.body.retcode == 1004){
				alert(response.body.msg || '有错误信息！');
				return;
			}
			callback(response);
		}
	}, function (response) {
		// handle error
		response.body = {
			retcode:-200,//状态-200表示查询超时或接口异常
			data:'',
			msg:'查询超时或接口异常'
		};
		if(typeof callback == 'function')callback(response);
	});
}