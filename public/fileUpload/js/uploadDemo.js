$(function () {
    $("#upFile").xUpload({
        width: "100%",
        height: "100%",
        pandin: "10x",
        itemWidth: "120px",
        itemHeight: "100px",
        padding: "10px",
        url: "/manage/goods/uploadFile",
        multiple: true,
        dragDrop: true,
        del: true,
        fileType: ["jpg", "png", "bmp", "jpeg"],
        fileSize: 1024 * 1024 * 10,
        finishDel: false,
        onSelect: function (files, allFiles) {
            console.info("当前选择了以下文件：");
            console.info(files);
            console.info("之前没上传的文件：");
            console.info(allFiles);
        },
        onDelete: function (file, surplusFiles) {
            console.info("当前删除了此文件：");
            console.info(file);
            console.info("当前剩余的文件：");
            console.info(surplusFiles);
        },
        onSuccess: function (file) {
            console.info("此文件上传成功：");
            console.info(file);
        },
        onFailure: function (file) {
            console.info("此文件上传失败：");
            console.info(file);
        },
        onComplete: function (responseInfo) {
            console.info("文件上传完成");
            console.info(responseInfo);
        }
    });
});