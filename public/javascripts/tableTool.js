
/**
 * @description bootstrapTable 中列的 formatter 方法
 * 將分轉換爲元顯示
 * @param {*} value  
 * @param {*} row 
 * @param {*} index 
 */
columnFormaToPrice = function (value, row, index) {
    if (!value || value == 'null') {
        return "";
    }
    value = value / 100;
    return value;
}

/**
 * @description 列編輯的url 方法
 * @param {*} params 
 */
editUrlFunction = function (params) {
    //取主鍵字段名
    var pk = $(this.parentNode.parentNode).attr('data-uniqueid');
    var postData = {};
    var uniqueId = $('#show_product').bootstrapTable('getOptions').uniqueId;
    postData[uniqueId] = pk;
    postData[params.name] = params.value;
    var msg = updateColumn(postData);
    return msg;
}