export function getSession(key){
	return JSON.parse(sessionStorage.getItem(key));
}

export function setSession(key,value){
	sessionStorage.setItem(key, JSON.stringify(value));
}

export function changeHtmlTitle(title){
    document.title = title;
    let iframe = document.createElement("iframe");
    iframe.setAttribute("src", "/favicon.ico");
    iframe.style.display = 'none';
    //iframe.setAttribute("id", "iframe");
    iframe.addEventListener('load', function() {
    	setTimeout(function(){
    		iframe.removeEventListener('load',function(){},false);
            document.body.removeChild(iframe);
    	},0);
    },false);
    let body = document.getElementsByTagName('body')[0];
    document.body.appendChild(iframe);
}

//获取前进、后退日期，根据diffDay变量而定
export function getDay(diffDay,fmt,defautlTime){
	const date = defautlTime || new Date();
	if(diffDay){
		date.setDate(date.getDate()+diffDay);//获取diffDay天后的日期
	}
	if(fmt){
		return formatDate(date,fmt);
	}
	return date;
}

//日期格式化
export function formatDate(strTime,fmt){
	let date = new Date();
	if(strTime){
		date = new Date(strTime);
	}
	if(!fmt){
		fmt = "yyyy-MM-dd";
	}
	const o = {
	    "y+": date.getFullYear(),
	    "M+": date.getMonth() + 1,                 //月份
	    "d+": date.getDate(),                    //日
	    "h+": date.getHours(),                   //小时
	    "m+": date.getMinutes(),                 //分
	    "s+": date.getSeconds(),                 //秒
	    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
	    "S+": date.getMilliseconds()             //毫秒
	};
	for (let k in o) {
	    if (new RegExp("(" + k + ")").test(fmt)){
	    	if(k == "y+"){
	        	fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
	      	}else if(k=="S+"){
	        	let lens = RegExp.$1.length;
	        	lens = lens==1?3:lens;
	        	fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
	        }else{
	        	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	        }
	    }
	}
	return fmt;
}

/**
 * 大数组数据进行分页显示
 */
export function pagination(pageNo, pageSize, data){
    let offset = (pageNo - 1) * pageSize;  
    return (offset + pageSize >= data.length) ? data.slice(offset, data.length) : data.slice(offset, offset + pageSize);  
}

/**
 * 数据导出到excel
 * @param object jsonData     源数据
 * @param array  headerList    第一行标题
 * @param string fileName     导出文件名（不带后缀）
 */
export function jsonToExcel(jsonData, headerList, fileName) {
    fileName = fileName || Date.parse(new Date());
    //先转化json 
    let arrData = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData; 
    let excel = '<table>'; 
    //生成表头 
    let row = "<tr>"; 
    for (let i = 0; i < headerList.length; i++) { 
        row += "<td>" + headerList[i] + '</td>'; 
    } 
    excel += row + "</tr>"; 
    //循环生成表身 
    for (let i = 0; i < arrData.length; i++) { 
        let row1 = "<tr>";
        for (let j in arrData[i]) {
            // let name = arrData[i][index].name === "." ? "" : arrData[i][index].name;
            row1 += '<td>' + arrData[i][j] + '</td>';
        }
        excel += row1 + "</tr>";
    }
    excel += "</table>";
    let excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " + "xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "sheet";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";
    let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
    let link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
/**
 * 计算字符串长度
 */
export function getStringLength(str){
    var realLength = 0, len = str.length, charCode = -1;  
    for (var i = 0; i < len; i++) {  
        charCode = str.charCodeAt(i);  
        if (charCode >= 0 && charCode <= 128) realLength += 1;  
        else realLength += 2;  
    }  
    return realLength;  
}
//数字格式化 eg:使数字1111111变成11,111,111。
export function formatterNumber(number) {
    if(typeof number !== 'number') number = parseInt(number);
    // number = number.replace(/\,/g, "");
    if(isNaN(number) || number == "")return "";
    number = Math.round(number * 100) / 100;
    if (number < 0)
        return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
    else{
        return outputdollars(Math.floor(number - 0) + '');
        // return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
    }
} 
//格式化金额
function outputdollars(number) {
    if (number.length <= 3)
        return (number == '' ? '0' : number);
    else {
        let mod = number.length % 3;
        let output = (mod == 0 ? '' : (number.substring(0, mod)));
        for (let i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0)){
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            else{
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
                
            }
        }
        return output;
    }
}
/**
 * 拼接对象为请求字符串
 * @param {formdata}  - 待拼接的对象
 * @param {numeric_prefix}  - 参数数字前缀
 * @param {arg_separator}  - 分割符 默认&
 */
export function http_build_query(formdata, numeric_prefix, arg_separator){
    var value, key, tmp = [], that = this;

    var _http_build_query_helper = function (key, val, arg_separator) {
        var k, tmp = [];
        if (val === true) {
            val = "1";
        } else if (val === false) {
            val = "0";
        }
        if (val !== null && typeof(val) === "object") {
            for (k in val) {
                if (val[k] !== null) {
                    tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
                }
            }
            return tmp.join(arg_separator);
        } else if (typeof(val) !== "function") {
            return encodeURI(key) + "=" + encodeURI(val);
        } else if (typeof(val) == "function") {
            return '';
        } else {
            throw new Error('There was an error processing for http_build_query().');
        }
    };

    if (!arg_separator) {
        arg_separator = "&";
    }
    for (key in formdata) {
        value = formdata[key];
        if (numeric_prefix && !isNaN(key)) {
            key = String(numeric_prefix) + key;
        }
        tmp.push(_http_build_query_helper(key, value, arg_separator));
    }

    return tmp.join(arg_separator);
};

/**
 * 解析url参数为json数组
 * @param string url url地址
 * @param array del_keys 要删除的参数key
 * @return json
 */
export function url_parser_json(url,del_keys){
	let params = '';
	if(url.indexOf('?')!=-1){
		params = url.substring(url.indexOf('?')+1);
	}
	if(!params)return [];
	params = decodeURIComponent(params);
	let paramsArr = params.split('&');
	let args = {},param,name,value;
	for(let i=0;i<paramsArr.length;i++){
		param = paramsArr[i].split('=');
		name = param[0];
		value = param[1];
		if(name == ""){
			name = "unkown";
		}
		if(name.indexOf("[]") != -1){
			name = name.replace("[]",'');//去掉参数变量的中括号
		}
		if(typeof args[name] == "undefined"){
			//参数尚不存在
			args[name] = value;
		}else if(typeof args[name] == "string"){
			//参数已经存在则保存为数组
			args[name] = [args[name]];
			args[name] . push(value);
		}else{
			//已经是数组的
			args[name].push(value);
		}
	}
	//删除指定参数
	for(let index in del_keys){
		if(args[del_keys[index]]){
			delete args[del_keys[index]];
		}
	}
	return args; //以json格式返回获取的所有参数
}

/**
 * json数组解析为url参数
 * @param json paramJson json数组
 * @param string url     url地址，不为空时，重新根据paramJson信息组织get参数
 * @return string
 */
export function json_parser_url(paramJson,url) {
	if (url && url.indexOf('?') != -1) {
		url = url.substring(0, url.indexOf('?'));
	}
	var paramStr = "";
	for (let index in paramJson) {
		if (paramStr) {
			paramStr += "&";
		}
		paramStr += index + "=" + paramJson[index];
	}
	if (url) {
		return url + (paramStr ? "?" + paramStr:'')+location.hash;
	}
	return paramStr;
}

export function parseJsonForUrl(param, key){
    let paramStr = "";
    if(typeof param != 'object'){
    	return paramStr += key + "=" + encodeURIComponent(param);
    }else{
    	for(let i in param){
			let k = key == null?i:key+(param instanceof Array?"["+i+"]":"["+i+"]");
			paramStr += '&' + parseJsonForUrl(param[i], k);
		}
	}
	return paramStr.substr(1);
}

