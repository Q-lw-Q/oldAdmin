dateFormat = function (s, format) {
    var date = s ? new Date(s) : new Date();
    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
}

/**
 * Required:是否必填，
 * type: 'number'
 */
myValidate = function (object) {
    var msg = '';
    if (object.Required) {
        if (!object.value || $.trim(object.value) == '') {
            return '不能為空!';
        }
    }
    if (object.type && object.type == 'number') {
        var patrn = /^(-)?\d+(\.\d+)?$/;
        if (patrn.exec(object.value) == null || object.value == "") {
            return '請輸入有效的數字';
        }
    }

}

/**
 * 更新URL參數
 * @param {*} url 
 * @param {*} param 参數鍵
 * @param {*} paramVal 参數值
 */
function updateURLParameter(url, param, paramVal) {
    var newSearchParam = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var searchParam = tempArray[1];
    var temp = "";
    if (searchParam) {
        tempArray = searchParam.split("&"); //分割各個參數
        for (var i = 0; i < tempArray.length; i++) {
            newSearchParam += temp;
            temp = "&";
            if (tempArray[i].split('=')[0] == param) { //找到匹配参數替換
                newSearchParam += (param + "=" + encodeURIComponent(paramVal));
                param = ''; //已找到匹配参數，則置空標記爲非新增参數
                continue;
            }
            //拼接參數
            newSearchParam += tempArray[i];
        }

    }
    if (param) { //如非空則表示還沒找到匹配参數
        newSearchParam += (temp + param + "=" + encodeURIComponent(paramVal));
    }
    var newUrl = baseURL + "?" + newSearchParam;
    window.history.pushState({}, 0, newUrl);
    // window.history.pushState({path:newUrl},'',newUrl);
}

/**
 * 取bootstrapTable表格数据
 * @param {*} param {type:方法類型(post|get),dataType:dataType,url:url,data:parameter,}
 */
bootstrapTableAjax = function (param) {

    $.ajax({
        //几个参數需要註意一下
        type: param.type,//方法類型
        dataType: param.dataType,//预期服務器返回的數據類型
        url: param.url,
        data: param.data,
        success: function (result) {
            // console.log(result);
            if (result.retCode == 200) {
                param.success({
                    total: result.retEntity.totalCount,
                    rows: result.retEntity.content,
                    result: result,
                })
            } else if (result.retCode == 211) {
                console.log(param.url + ':' + result.retMsg);
                // this.formatLoadingMessage='1111';
                // param.error({

                //   })

            } else if (result.retCode) {
                toastr.warning(result.retMsg);
            } else {
                toastr.error(JSON.stringify(result));
            }
        },
        error: function (e) {
            if (e.status != 0) {
                console.log("異常!bootstrapTableAjax");
                console.log(JSON.stringify(param));
                console.log("異常!" + JSON.stringify(e));
                alert("異常！" + JSON.stringify(e.responseText));
            }
        }
    });
}

/**
 * @param {*} param 通用ajax 請求
 *  {type:方法類型(post|get),dataType:dataType,url:url,data:parameter,callback:回調方法}
 */
chartAjax = function (param) {
    $.ajax({
        //几个参數需要註意一下
        type: param.type,//方法類型
        dataType: param.dataType || 'JSON',//预期服務器返回的數據類型
        url: param.url,
        data: param.data,
        success: function (result) {
            // console.log(result);
            if (result.retCode == 200) {
                if (param.type.toUpperCase() == "GET") {
                    param.callback(result.retEntity);
                } else {
                    param.callback(result);
                }

            } else if (param.type.toUpperCase() == "GET" && result.retCode == 211) {
                if(param.isManual){
                    toastr.warning(result.retMsg);
                }else{
                     //非手動 get 請求的無權限消息不提示
                    console.log(param.url + ':' + JSON.stringify(result))
                }
               
            } else if (result.retCode) {
                toastr.warning(result.retMsg);
            } else {
                toastr.error(JSON.stringify(result));
            }
        },
        error: function (e) {
            if (e.status != 0) {
                console.log("異常!chartAjax");
                console.log(JSON.stringify(param));
                console.log("異常!" + JSON.stringify(e));
                alert("異常！" + JSON.stringify(e.responseText));
            }
        }
    });
}



/**
 * 保留指定位数小数(不路补0),整数倍分用千分位表示
 * @param {number} value 数值
 * @param {number} Places 要保留的小数位数
 * @param {boolean} flag  是否四舍五入
 */
function toMyFixedLocaleString(value, Places, flag = false) {
    var fixedValue = value;
    if (flag) {
        fixedValue = fixedValue.toFixed(Places); //保留3位小数,以防出现0.99四舍五入为1.00的情况
    }
    fixedValue = String(fixedValue).substring(0, String(fixedValue).split('.')[0].length + (Places + 1));//不四舍五入保留Places位小数

    if (Math.round(fixedValue) == fixedValue) {
        var strValue = Number(fixedValue).toLocaleString('en-US') + '.'
        //整数
        for (var i = 0; i < Places; i++) {
            strValue += '0';
        }
        return strValue;
    } else {
        var spt = fixedValue.split(".");

        //整数部分按千分位
        var intStr = spt[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        var strValue = intStr + '.' + spt[1];

        for (var i = spt[1].length; i < Places; i++) {
            strValue = strValue.toString() + "0";
        }
        return strValue;
    }
}
