(function ($, undefined) {

    $.fn.xUpload = function (options, param) {


        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == 'string') {
            var fn = this[0][options];
            if ($.isFunction(fn)) {
                return fn.apply(this, otherArgs);
            } else {
                throw ("没有找到方法: " + options);
            }
        }
        return this.each(function () {
            var para = {};
            var self = this;
            var defaults = {
                width: "700px",
                height: "400px",
                itemWidth: "140px",
                itemHeight: "120px",
                url: "/upload/UploadAction",
                multiple: true,
                dragDrop: true,
                del: true,
                finishDel: false,
                onSelect: function (selectFiles, files) {},
                onDelete: function (file, files) {},
                onSuccess: function (file) {},
                onFailure: function (file) {},
                onComplete: function (responseInfo) {},
            };
            para = $.extend(defaults, options);
            this.init = function () {
                this.createHtml();
                this.createCorePlug();
            };
            this.createHtml = function () {
                var multiple = "";
                para.multiple ? multiple = "multiple" : multiple = "";
                var html = '';
                if (para.dragDrop) {
                    html += '<form id="uploadForm" action="' + para.url + '" method="post" enctype="multipart/form-data">';
                    html += '	<div class="upload_box">';
                    html += '		<div class="upload_main">';
                    html += '			<div class="upload_choose">';
                    html += '				<div class="convent_choice">';
                    html += '					<div class="andArea">';
                    html += '						<div class="filePicker">点击选择文件</div>';
                    html += '						<input id="fileImage" type="file" size="30" name="fileselect[]" ' + multiple + '>';
                    html += '					</div>';
                    html += '				</div>';
                    html += '				<span id="fileDragArea" class="upload_drag_area">或者将文件拖到此处</span>';
                    html += '			</div>';
                    html += '			<div class="status_bar">';
                    html += '				<div id="status_info" class="info">选中0张文件，共0B。</div>';
                    html += '				<div class="btns">';
                    html += '					<div class="webuploader_pick">继续选择</div>';
                    html += '					<div class="upload_btn">开始上传</div>';
                    html += '				</div>';
                    html += '			</div>';
                    html += '			<div id="preview" class="upload_preview"></div>';
                    html += '		</div>';
                    html += '		<div class="upload_submit">';
                    html += '			<button type="button" id="fileSubmit" class="upload_submit_btn">确认上传文件</button>';
                    html += '		</div>';
                    html += '		<div id="uploadInf" class="upload_inf"></div>';
                    html += '	</div>';
                    html += '</form>';
                } else {
                    var imgWidth = parseInt(para.itemWidth.replace("px", "")) - 15;
                    html += '<form id="uploadForm" action="' + para.url + '" method="post" enctype="multipart/form-data">';
                    html += '	<div class="upload_box">';
                    html += '		<div class="upload_main single_main">';
                    html += '			<div class="status_bar">';
                    html += '				<div id="status_info" class="info">选中0张文件，共0B。</div>';
                    html += '				<div class="btns">';
                    html += '					<input id="fileImage" type="file" size="30" name="fileselect[]" ' + multiple + '>';
                    html += '					<div class="webuploader_pick">选择文件</div>';
                    html += '					<div class="upload_btn">开始上传</div>';
                    html += '				</div>';
                    html += '			</div>';
                    html += '			<div id="preview" class="upload_preview">';
                    html += '				<div class="add_upload">';
                    html += '					<a style="height:' + para.itemHeight + ';width:' + para.itemWidth + ';" title="点击添加文件" id="rapidAddImg" class="add_imgBox" href="javascript:void(0)">';
                    html += '						<div class="uploadImg" style="width:' + imgWidth + 'px">';
                    html += '							<img class="upload_image" src="control/images/add_img.png" style="width:expression(this.width > ' + imgWidth + ' ? ' + imgWidth + 'px : this.width)" />';
                    html += '						</div>';
                    html += '					</a>';
                    html += '				</div>';
                    html += '			</div>';
                    html += '		</div>';
                    html += '		<div class="upload_submit">';
                    html += '			<button type="button" id="fileSubmit" class="upload_submit_btn">确认上传文件</button>';
                    html += '		</div>';
                    html += '		<div id="uploadInf" class="upload_inf"></div>';
                    html += '	</div>';
                    html += '</form>';
                }
                $(self).append(html).css({
                    "width": para.width,
                    "height": para.height,
                    'padding': para.padding,
                });
                this.addEvent();
            };
            this.funSetStatusInfo = function (files) {
                var size = 0;
                var num = files.length;
                $.each(files, function (k, v) {
                    size += v.size;
                });
                if (size > 1024 * 1024) {
                    size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                } else {
                    size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
                }
                $("#status_info").html("选中" + num + "张文件，共" + size + "。");
            };
            this.funFilterEligibleFile = function (files) {
                var arrFiles = [];
                for (var i = 0, file; file = files[i]; i++) {

                    //检查文件类型与大小
                    var newStr = file.name.split("").reverse().join("");
                    console.log("文件类型: " + newStr);
                    if (newStr.split(".")[0] != null) {
                        var type = newStr.split(".")[0].split("").reverse().join("");
                        console.log(type + "===type===");
                        if (jQuery.inArray(type, defaults.fileType) > -1) {
                            if (file.size >= defaults.fileSize) {
                                // alert(file.size);
                                alert('您这个"' + file.name + '"文件大小过大');
                            } else {
                                arrFiles.push(file);
                            }
                        } else {
                            alert('您这个"' + file.name + '"上传类型不符合');
                        }
                    } else {
                        alert('您这个"' + file.name + '"没有类型, 无法识别');
                    }

                    // if (file.size >= 51200000) {
                    //     alert('您这个"' + file.name + '"文件大小过大');
                    // } else {
                    //     arrFiles.push(file);
                    // }
                }
                return arrFiles;
            };
            this.funDisposePreviewHtml = function (file, e) {
                var html = "";
                var imgWidth = parseInt(para.itemWidth.replace("px", "")) - 15;
                var delHtml = "";
                if (para.del) {
                    delHtml = '<span class="file_del" data-index="' + file.index + '" title="删除"></span>';
                }
                var fileImgSrc = "control/images/fileType/";
                if (file.type.indexOf("rar") > 0) {
                    fileImgSrc = fileImgSrc + "rar.png";
                } else if (file.type.indexOf("zip") > 0) {
                    fileImgSrc = fileImgSrc + "zip.png";
                } else if (file.type.indexOf("text") > 0) {
                    fileImgSrc = fileImgSrc + "txt.png";
                } else {
                    fileImgSrc = fileImgSrc + "file.png";
                }
                if (file.type.indexOf("image") == 0) {
                    html += '<div id="uploadList_' + file.index + '" class="upload_append_list">';
                    html += '	<div class="file_bar">';
                    html += '		<div style="padding:5px;">';
                    html += '			<p class="file_name">' + file.name + '</p>';
                    html += delHtml;
                    html += '		</div>';
                    html += '	</div>';
                    html += '	<a style="height:' + para.itemHeight + ';width:' + para.itemWidth + ';" href="#" class="imgBox">';
                    html += '		<div class="uploadImg" style="width:' + imgWidth + 'px">';
                    html += '			<img id="uploadImage_' + file.index + '" class="upload_image" src="' + e.target.result + '" style="width:expression(this.width > ' + imgWidth + ' ? ' + imgWidth + 'px : this.width)" />';
                    html += '		</div>';
                    html += '	</a>';
                    html += '	<p id="uploadProgress_' + file.index + '" class="file_progress"></p>';
                    html += '	<p id="uploadFailure_' + file.index + '" class="file_failure">上传失败，请重试</p>';
                    html += '	<p id="uploadSuccess_' + file.index + '" class="file_success"></p>';
                    html += '</div>';
                } else {
                    html += '<div id="uploadList_' + file.index + '" class="upload_append_list">';
                    html += '	<div class="file_bar">';
                    html += '		<div style="padding:5px;">';
                    html += '			<p class="file_name">' + file.name + '</p>';
                    html += delHtml;
                    html += '		</div>';
                    html += '	</div>';
                    html += '	<a style="height:' + para.itemHeight + ';width:' + para.itemWidth + ';" href="#" class="imgBox">';
                    html += '		<div class="uploadImg" style="width:' + imgWidth + 'px">';
                    html += '			<img id="uploadImage_' + file.index + '" class="upload_image" src="' + fileImgSrc + '" style="width:expression(this.width > ' + imgWidth + ' ? ' + imgWidth + 'px : this.width)" />';
                    html += '		</div>';
                    html += '	</a>';
                    html += '	<p id="uploadProgress_' + file.index + '" class="file_progress"></p>';
                    html += '	<p id="uploadFailure_' + file.index + '" class="file_failure">上传失败，请重试</p>';
                    html += '	<p id="uploadSuccess_' + file.index + '" class="file_success"></p>';
                    html += '</div>';
                }
                return html;
            };
            this.createCorePlug = function () {
                var params = {
                    fileInput: $("#fileImage").get(0),
                    uploadInput: $("#fileSubmit").get(0),
                    dragDrop: $("#fileDragArea").get(0),
                    url: $("#uploadForm").attr("action"),
                    fields: para.fields, //传入的字段参数
                    filterFile: function (files) {
                        return self.funFilterEligibleFile(files);
                    },
                    onSelect: function (selectFiles, allFiles) {
                        para.onSelect(selectFiles, allFiles);
                        self.funSetStatusInfo(XFILE.funReturnNeedFiles());
                        var html = '',
                            i = 0;
                        var funDealtPreviewHtml = function () {
                            file = selectFiles[i];
                            if (file) {
                                var reader = new FileReader()
                                reader.onload = function (e) {
                                    html += self.funDisposePreviewHtml(file, e);
                                    i++;
                                    funDealtPreviewHtml();
                                }
                                reader.readAsDataURL(file);
                            } else {
                                funAppendPreviewHtml(html);
                            }
                        };
                        var funAppendPreviewHtml = function (html) {
                            if (para.dragDrop) {
                                $("#preview").append(html);
                            } else {
                                $(".add_upload").before(html);
                            }
                            funBindDelEvent();
                            funBindHoverEvent();
                        };
                        var funBindDelEvent = function () {
                            if ($(".file_del").length > 0) {
                                $(".file_del").click(function () {
                                    XFILE.funDeleteFile(parseInt($(this).attr("data-index")), true);
                                    return false;
                                });
                            }
                            if ($(".file_edit").length > 0) {
                                $(".file_edit").click(function () {
                                    return false;
                                });
                            }
                        };
                        var funBindHoverEvent = function () {
                            $(".upload_append_list").hover(function (e) {
                                $(this).find(".file_bar").addClass("file_hover");
                            }, function (e) {
                                $(this).find(".file_bar").removeClass("file_hover");
                            });
                        };
                        funDealtPreviewHtml();
                    },
                    onDelete: function (file, files) {
                        $("#uploadList_" + file.index).fadeOut();
                        self.funSetStatusInfo(files);
                        console.info("剩下的文件");
                        console.info(files);
                    },
                    onProgress: function (file, loaded, total) {
                        var eleProgress = $("#uploadProgress_" + file.index),
                            percent = (loaded / total * 100).toFixed(2) + '%';
                        if (eleProgress.is(":hidden")) {
                            eleProgress.show();
                        }
                        eleProgress.css("width", percent);
                    },
                    onSuccess: function (file, response) {
                        // console.log(response);
                        $("#uploadProgress_" + file.index).hide();
                        $("#uploadSuccess_" + file.index).show();
                        $("#uploadInf").append("<p>【" + file.name + "】上传成功</p>" + response);
                        if (para.finishDel) {
                            $("#uploadList_" + file.index).fadeOut();
                            self.funSetStatusInfo(XFILE.funReturnNeedFiles());
                        }
                        
                        //回调客户方法
                        if (para.onSuccess) {
                            para.onSuccess(file, response);
                        }
                    },
                    onFailure: function (file) {
                        $("#uploadProgress_" + file.index).hide();
                        $("#uploadSuccess_" + file.index).show();
                        $("#uploadInf").append("<p>文件" + file.name + "上传失败！</p>");
                    },
                    onComplete: function (response) {
                        console.info(response);
                    },
                    onDragOver: function () {
                        $(this).addClass("upload_drag_hover");
                    },
                    onDragLeave: function () {
                        $(this).removeClass("upload_drag_hover");
                    }
                };
                XFILE = $.extend(XFILE, params);
                XFILE.init();
            };
            this.addEvent = function () {
                if ($(".filePicker").length > 0) {
                    $(".filePicker").bind("click", function (e) {
                        $("#fileImage").click();
                    });
                }
                $(".webuploader_pick").bind("click", function (e) {
                    $("#fileImage").click();
                });
                $(".upload_btn").bind("click", function (e) {
                    if (XFILE.funReturnNeedFiles().length > 0) {
                        $("#fileSubmit").click();
                    } else {
                        alert("请先选中文件再点击上传");
                    }
                });
                if ($("#rapidAddImg").length > 0) {
                    $("#rapidAddImg").bind("click", function (e) {
                        $("#fileImage").click();
                    });
                }
            };
            this.init();
        });
    };
})(jQuery);