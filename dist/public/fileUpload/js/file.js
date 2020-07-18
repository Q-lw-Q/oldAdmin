var XFILE = {
    fileInput: null,
    uploadInput: null,
    dragDrop: null,
    url: "",
    uploadFile: [],
    lastUploadFile: [],
    perUploadFile: [],
    fileNum: 0,
    filterFile: function (files) {
        return files;
    },
    onSelect: function (selectFile, files) {},
    onDelete: function (file, files) {},
    onProgress: function (file, loaded, total) {},
    onSuccess: function (file, responseInfo) {},
    onFailure: function (file, responseInfo) {},
    onComplete: function (responseInfo) {},
    funDragHover: function (e) {
        e.stopPropagation();
        e.preventDefault();
        this[e.type === "dragover" ? "onDragOver" : "onDragLeave"].call(e.target);
        return this;
    },
    funGetFiles: function (e) {
        var self = this;
        this.funDragHover(e);
        var files = e.target.files || e.dataTransfer.files;
        self.lastUploadFile = this.uploadFile;
        this.uploadFile = this.uploadFile.concat(this.filterFile(files));
        var tmpFiles = [];
        var lArr = [];
        var uArr = [];
        $.each(self.lastUploadFile, function (k, v) {
            lArr.push(v.name);
        });
        $.each(self.uploadFile, function (k, v) {
            uArr.push(v.name);
        });
        $.each(uArr, function (k, v) {
            if ($.inArray(v, lArr) < 0) {
                tmpFiles.push(self.uploadFile[k]);
            }
        });
        this.uploadFile = tmpFiles;
        this.funDealtFiles();
        return true;
    },
    funDealtFiles: function () {
        var self = this;
        $.each(this.uploadFile, function (k, v) {
            v.index = self.fileNum;
            self.fileNum++;
        });
        var selectFile = this.uploadFile;
        this.perUploadFile = this.perUploadFile.concat(this.uploadFile);
        this.uploadFile = this.lastUploadFile.concat(this.uploadFile);
        this.onSelect(selectFile, this.uploadFile);
        console.info("继续选择");
        console.info(this.uploadFile);
        return this;
    },
    funDeleteFile: function (delFileIndex, isCb) {
        var self = this;
        var tmpFile = [];
        var delFile = this.perUploadFile[delFileIndex];
        console.info(delFile);
        $.each(this.uploadFile, function (k, v) {
            if (delFile != v) {
                tmpFile.push(v);
            } else {}
        });
        this.uploadFile = tmpFile;
        if (isCb) {
            self.onDelete(delFile, this.uploadFile);
        }
        console.info("还剩这些文件没有上传:");
        console.info(this.uploadFile);
        return true;
    },
    funUploadFiles: function () {
        var self = this;
        $.each(this.uploadFile, function (k, v) {
            self.funUploadFile(v);
        });
    },
    funUploadFile: function (file) {

        var self = this;

        var formdata = new FormData();
        formdata.append("files", file);

        console.log("字段：" + JSON.stringify(self.fields));
        for (var key in self.fields) {
            formdata.append(key, self.fields[key]);
        };

        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (e) {
            self.onProgress(file, e.loaded, e.total);
        }, false);
        xhr.addEventListener("load", function (e) {
            if (JSON.parse(xhr.responseText).retCode) {
                self.funDeleteFile(file.index, false);
                var responseText = xhr.responseText;
                file["responseText"]=xhr.responseText;
                console.log(responseText);
                self.onSuccess(file, responseText);
                if (self.uploadFile.length == 0) {
                    self.onComplete("全部完成");
                }
                //列表中删除已上传文件
                self.funDeleteFile(file.index, false);
            } else {
                // alert(file.name+"上传失败"+xhr.responseText);
                $("#uploadInf").append("<p>【" + file.name + "】上传失败。" + xhr.responseText + "</p>");
            }
        }, false);

        xhr.addEventListener("error", function (e) {
            self.onFailure(file, xhr.responseText);
        }, false);
        xhr.open("POST", self.url, true);

        // xhr.setRequestHeader("X_FILENAME", file.name);
        xhr.send(formdata);
    },
    funReturnNeedFiles: function () {
        return this.uploadFile;
    },
    init: function () {
        var self = this;
        if (this.dragDrop) {
            this.dragDrop.addEventListener("dragover", function (e) {
                self.funDragHover(e);
            }, false);
            this.dragDrop.addEventListener("dragleave", function (e) {
                self.funDragHover(e);
            }, false);
            this.dragDrop.addEventListener("drop", function (e) {
                self.funGetFiles(e);
            }, false);
        }
        if (self.fileInput) {
            this.fileInput.addEventListener("change", function (e) {
                self.funGetFiles(e);
            }, false);
        }
        if (self.uploadInput) {
            this.uploadInput.addEventListener("click", function (e) {
                self.funUploadFiles(e);
            }, false);
        }
    }
};