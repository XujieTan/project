/**
 * Layui图标选择器
 * @author wujiawei0926@yeah.net
 * @version 1.1
 */

layui.define(['laypage', 'form'], function (exports) {
    "use strict";

    var IconPicker =function () {
        this.v = '1.1';
    }, _MOD = 'iconPicker',
        _this = this,
        $ = layui.jquery,
        laypage = layui.laypage,
        form = layui.form,
        BODY = 'body',
        TIPS = '请选择图标';

    /**
     * 渲染组件
     */
    IconPicker.prototype.render = function(options){
        var opts = options,
            // DOM选择器
            elem = opts.elem,
            // 数据类型：fontClass/unicode
            type = opts.type == null ? 'fontClass' : opts.type,
            // 是否分页：true/false
            page = opts.page == null ? true : opts.page,
            // 每页显示数量
            limit = opts.limit == null ? 12 : opts.limit,
            // 是否开启搜索：true/false
            search = opts.search == null ? true : opts.search,
            // 每个图标格子的宽度：'43px'或'20%'
            cellWidth = opts.cellWidth,
            // 点击回调
            click = opts.click,
            // 渲染成功后的回调
            success = opts.success,
            // json数据
            data = {},
            // 唯一标识
            tmp = new Date().getTime(),
            // 是否使用的class数据
            isFontClass = opts.type === 'fontClass',
            // 初始化时input的值
            ORIGINAL_ELEM_VALUE = $(elem).val(),
            TITLE = 'layui-select-title',
            TITLE_ID = 'layui-select-title-' + tmp,
            ICON_BODY = 'layui-iconpicker-' + tmp,
            PICKER_BODY = 'layui-iconpicker-body-' + tmp,
            PAGE_ID = 'layui-iconpicker-page-' + tmp,
            LIST_BOX = 'layui-iconpicker-list-box',
            selected = 'layui-form-selected',
            unselect = 'layui-unselect';

        var a = {
            init: function () {
                data = common.getData[type]();

                a.hideElem().createSelect().createBody().toggleSelect();
                a.preventEvent().inputListen();
                common.loadCss();
                
                if (success) {
                    success(this.successHandle());
                }

                return a;
            },
            successHandle: function(){
                var d = {
                    options: opts,
                    data: data,
                    id: tmp,
                    elem: $('#' + ICON_BODY)
                };
                return d;
            },
            /**
             * 隐藏elem
             */
            hideElem: function () {
                $(elem).hide();
                return a;
            },
            /**
             * 绘制select下拉选择框
             */
            createSelect: function () {
                var oriIcon = '<i class="layui-icon">';
                
                // 默认图标
                if(ORIGINAL_ELEM_VALUE === '') {
                    if(isFontClass) {
                        // ORIGINAL_ELEM_VALUE = 'layui-icon-circle-dot';
                        ORIGINAL_ELEM_VALUE = '';
                    } else {
                        // ORIGINAL_ELEM_VALUE = '&#xe617;';
                        ORIGINAL_ELEM_VALUE = '';
                    }
                }

                if (isFontClass) {
                    oriIcon = '<i class="layui-icon '+ ORIGINAL_ELEM_VALUE +'">';
                } else {
                    oriIcon += ORIGINAL_ELEM_VALUE;
                }
                oriIcon += '</i>';

                var selectHtml = '<div class="layui-iconpicker layui-unselect layui-form-select" id="'+ ICON_BODY +'">' +
                    '<div class="'+ TITLE +'" id="'+ TITLE_ID +'">' +
                        '<div class="layui-iconpicker-item">'+
                            //输入框内的图标
                            '<span class="layui-iconpicker-icon layui-unselect">' +
                                oriIcon +
                            '</span>'+
                            // '<i class="layui-edge"></i>' +
                        '</div>'+
                    '</div>' +
                    '<div class="layui-anim layui-anim-upbit" style="">' +
                        '123' +
                    '</div>';
                $(elem).after(selectHtml);
                return a;
            },
            /**
             * 展开/折叠下拉框
             */
            toggleSelect: function () {
                var item = '#' + TITLE_ID + ' .layui-iconpicker-item,#' + TITLE_ID + ' .layui-iconpicker-item .layui-edge';
                a.event('click', item, function (e) {
                    var $icon = $('#' + ICON_BODY);
                    if ($icon.hasClass(selected)) {
                        $icon.removeClass(selected).addClass(unselect);
                    } else {
                        // 隐藏其他picker
                        $('.layui-form-select').removeClass(selected);
                        // 显示当前picker
                        $icon.addClass(selected).removeClass(unselect);
                    }
                    e.stopPropagation();
                });
                return a;
            },
            /**
             * 绘制主体部分
             */
            createBody: function () {
                // 获取数据
                var searchHtml = '';

                if (search) {
                    searchHtml = '<div class="layui-iconpicker-search">' +
                        '<input class="layui-input">' +
                        '<i class="layui-icon">&#xe615;</i>' +
                        '</div>';
                }

                // 组合dom
                var bodyHtml = '<div class="layui-iconpicker-body" id="'+ PICKER_BODY +'">' +
                    searchHtml +
                        '<div class="'+ LIST_BOX +'"></div> '+
                     '</div>';
                $('#' + ICON_BODY).find('.layui-anim').eq(0).html(bodyHtml);
                a.search().createList().check().page();

                return a;
            },
            /**
             * 绘制图标列表
             * @param text 模糊查询关键字
             * @returns {string}
             */
            createList: function (text) {
                var d = data,
                    l = d.length,
                    pageHtml = '',
                    listHtml = $('<div class="layui-iconpicker-list">')//'<div class="layui-iconpicker-list">';

                // 计算分页数据
                var _limit = limit, // 每页显示数量
                    _pages = l % _limit === 0 ? l / _limit : parseInt(l / _limit + 1), // 总计多少页
                    _id = PAGE_ID;

                // 图标列表
                var icons = [];

                for (var i = 0; i < l; i++) {
                    var obj = d[i];

                    // 判断是否模糊查询
                    if (text && obj.indexOf(text) === -1) {
                        continue;
                    }

                    // 是否自定义格子宽度
                    var style = '';
                    if (cellWidth !== null) {
                        style += ' style="width:' + cellWidth + '"';
                    }

                    // 每个图标dom
                    var icon = '<div class="layui-iconpicker-icon-item" title="'+ obj +'" '+ style +'>';
                    if (isFontClass){
                        icon += '<i class="layui-icon '+ obj +'"></i>';
                    } else {
                        icon += '<i class="layui-icon">'+ obj.replace('amp;', '') +'</i>';
                    }
                    icon += '</div>';

                    icons.push(icon);
                }

                // 查询出图标后再分页
                l = icons.length;
                _pages = l % _limit === 0 ? l / _limit : parseInt(l / _limit + 1);
                for (var i = 0; i < _pages; i++) {
                    // 按limit分块
                    var lm = $('<div class="layui-iconpicker-icon-limit" id="layui-iconpicker-icon-limit-' + tmp + (i+1) +'">');

                    for (var j = i * _limit; j < (i+1) * _limit && j < l; j++) {
                        lm.append(icons[j]);
                    }

                    listHtml.append(lm);
                }

                // 无数据
                if (l === 0) {
                    listHtml.append('<p class="layui-iconpicker-tips">无数据</p>');
                }

                // 判断是否分页
                if (page){
                    $('#' + PICKER_BODY).addClass('layui-iconpicker-body-page');
                    pageHtml = '<div class="layui-iconpicker-page" id="'+ PAGE_ID +'">' +
                        '<div class="layui-iconpicker-page-count">' +
                        '<span id="'+ PAGE_ID +'-current">1</span>/' +
                        '<span id="'+ PAGE_ID +'-pages">'+ _pages +'</span>' +
                        ' (<span id="'+ PAGE_ID +'-length">'+ l +'</span>)' +
                        '</div>' +
                        '<div class="layui-iconpicker-page-operate">' +
                        '<i class="layui-icon" id="'+ PAGE_ID +'-prev" data-index="0" prev>&#xe603;</i> ' +
                        '<i class="layui-icon" id="'+ PAGE_ID +'-next" data-index="2" next>&#xe602;</i> ' +
                        '</div>' +
                        '</div>';
                }


                $('#' + ICON_BODY).find('.layui-anim').find('.' + LIST_BOX).html('').append(listHtml).append(pageHtml);
                return a;
            },
            // 阻止Layui的一些默认事件
            preventEvent: function() {
                var item = '#' + ICON_BODY + ' .layui-anim';
                a.event('click', item, function (e) {
                    e.stopPropagation();
                });
                return a;
            },
            // 分页
            page: function () {
                var icon = '#' + PAGE_ID + ' .layui-iconpicker-page-operate .layui-icon';

                $(icon).unbind('click');
                a.event('click', icon, function (e) {
                   var elem = e.currentTarget,
                       total = parseInt($('#' +PAGE_ID + '-pages').html()),
                       isPrev = $(elem).attr('prev') !== undefined,
                       // 按钮上标的页码
                       index = parseInt($(elem).attr('data-index')),
                       $cur = $('#' +PAGE_ID + '-current'),
                       // 点击时正在显示的页码
                       current = parseInt($cur.html());

                    // 分页数据
                    if (isPrev && current > 1) {
                        current=current-1;
                        $(icon + '[prev]').attr('data-index', current);
                    } else if (!isPrev && current < total){
                        current=current+1;
                        $(icon + '[next]').attr('data-index', current);
                    }
                    $cur.html(current);

                    // 图标数据
                    $('#'+ ICON_BODY + ' .layui-iconpicker-icon-limit').hide();
                    $('#layui-iconpicker-icon-limit-' + tmp + current).show();
                    e.stopPropagation();
                });
                return a;
            },
            /**
             * 搜索
             */
            search: function () {
                var item = '#' + PICKER_BODY + ' .layui-iconpicker-search .layui-input';
                a.event('input propertychange', item, function (e) {
                    var elem = e.target,
                        t = $(elem).val();
                    a.createList(t);
                });
                return a;
            },
            /**
             * 点击选中图标
             */
            check: function () {
                var item = '#' + PICKER_BODY + ' .layui-iconpicker-icon-item';
                a.event('click', item, function (e) {
                    var el = $(e.currentTarget).find('.layui-icon'),
                        icon = '';
                    if (isFontClass) {
                        var clsArr = el.attr('class').split(/[\s\n]/),
                            cls = clsArr[1],
                            icon = cls;
                        $('#' + TITLE_ID).find('.layui-iconpicker-item .layui-icon').html('').attr('class', clsArr.join(' '));
                    } else {
                        var cls = el.html(),
                            icon = cls;
                        $('#' + TITLE_ID).find('.layui-iconpicker-item .layui-icon').html(icon);
                    }

                    $('#' + ICON_BODY).removeClass(selected).addClass(unselect);
                    $(elem).val(icon).attr('value', icon);
                    // 回调
                    if (click) {
                        click({
                            icon: icon
                        });
                    }

                });
                return a;
            },
            // 监听原始input数值改变
            inputListen: function(){
                var el = $(elem);
                a.event('change', elem, function(){
                    var value = el.val();
                })
                // el.change(function(){
                    
                // });
                return a;
            },
            event: function (evt, el, fn) {
                $(BODY).on(evt, el, fn);
            }
        };

        var common = {
            /**
             * 加载样式表
             */
            loadCss: function () {
                var css = '.layui-iconpicker {max-width: 100%;}.layui-iconpicker .layui-anim{display:none;position:absolute;left:0;top:42px;padding:5px 0;z-index:899;min-width:40%;border:1px solid #d2d2d2;overflow-y:auto;background-color:#fff;border-radius:2px;box-shadow:0 2px 4px rgba(0,0,0,.12);box-sizing:border-box;}.layui-iconpicker-item{border:1px solid #e6e6e6;width:100%;height:38px;border-radius:4px;cursor:pointer;position:relative;}.layui-iconpicker-icon{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;height:100%;float:left;margin-left:10px;background:#fff;transition:all .3s;}.layui-iconpicker-icon i{line-height:38px;font-size:18px;}.layui-iconpicker-item > .layui-edge{left:70px;}.layui-iconpicker-item:hover{border-color:#D2D2D2!important;}.layui-iconpicker-item:hover .layui-iconpicker-icon{border-color:#D2D2D2!important;}.layui-iconpicker.layui-form-selected .layui-anim{display:block;}.layui-iconpicker-body{padding:6px;}.layui-iconpicker .layui-iconpicker-list{background-color:#fff;border:1px solid #ccc;border-radius:4px;}.layui-iconpicker .layui-iconpicker-icon-item{display:inline-block;width:99px;line-height:36px;text-align:center;cursor:pointer;vertical-align:top;height:36px;margin:4px;border:1px solid #ddd;border-radius:2px;transition:300ms;}.layui-iconpicker .layui-iconpicker-icon-item i.layui-icon{font-size:17px;}.layui-iconpicker .layui-iconpicker-icon-item:hover{background-color:#eee;border-color:#ccc;-webkit-box-shadow:0 0 2px #aaa,0 0 2px #fff inset;-moz-box-shadow:0 0 2px #aaa,0 0 2px #fff inset;box-shadow:0 0 2px #aaa,0 0 2px #fff inset;text-shadow:0 0 1px #fff;}.layui-iconpicker-search{position:relative;margin:0 0 6px 0;border:1px solid #e6e6e6;border-radius:2px;transition:300ms;}.layui-iconpicker-search:hover{border-color:#D2D2D2!important;}.layui-iconpicker-search .layui-input{cursor:text;display:inline-block;width:86%;border:none;padding-right:0;margin-top:1px;}.layui-iconpicker-search .layui-icon{position:absolute;top:11px;right:4%;}.layui-iconpicker-tips{text-align:center;padding:8px 0;cursor:not-allowed;}.layui-iconpicker-page{margin-top:6px;margin-bottom:-6px;font-size:12px;padding:0 2px;}.layui-iconpicker-page-count{display:inline-block;}.layui-iconpicker-page-operate{display:inline-block;float:right;cursor:default;}.layui-iconpicker-page-operate .layui-icon{font-size:12px;cursor:pointer;}.layui-iconpicker-body-page .layui-iconpicker-icon-limit{display:none;}.layui-iconpicker-body-page .layui-iconpicker-icon-limit:first-child{display:block;}';
                var $style = $('head').find('style[iconpicker]');
                if ($style.length === 0) {
                    $('head').append('<style rel="stylesheet" iconpicker>'+css+'</style>');
                }
            },
            /**
             * 获取数据
             */
            getData: {
                fontClass: function () {
                    var arr = ['layui-icon-fa-glass', 'layui-icon-fa-music', 'layui-icon-fa-search', 'layui-icon-fa-envelope-o', 'layui-icon-fa-heart', 'layui-icon-fa-star', 'layui-icon-fa-star-o', 'layui-icon-fa-user', 'layui-icon-fa-film', 'layui-icon-fa-th-large', 'layui-icon-fa-th', 'layui-icon-fa-th-list', 'layui-icon-fa-check', 'layui-icon-fa-remove', 'layui-icon-fa-close', 'layui-icon-fa-times', 'layui-icon-fa-search-plus', 'layui-icon-fa-search-minus', 'layui-icon-fa-power-off', 'layui-icon-fa-signal', 'layui-icon-fa-gear', 'layui-icon-fa-cog', 'layui-icon-fa-trash-o', 'layui-icon-fa-home', 'layui-icon-fa-file-o', 'layui-icon-fa-clock-o', 'layui-icon-fa-road', 'layui-icon-fa-download', 'layui-icon-fa-arrow-circle-o-down', 'layui-icon-fa-arrow-circle-o-up', 'layui-icon-fa-inbox', 'layui-icon-fa-play-circle-o', 'layui-icon-fa-rotate-right', 'layui-icon-fa-repeat', 'layui-icon-fa-refresh', 'layui-icon-fa-list-alt', 'layui-icon-fa-lock', 'layui-icon-fa-flag', 'layui-icon-fa-headphones', 'layui-icon-fa-volume-off', 'layui-icon-fa-volume-down', 'layui-icon-fa-volume-up', 'layui-icon-fa-qrcode', 'layui-icon-fa-barcode', 'layui-icon-fa-tag', 'layui-icon-fa-tags', 'layui-icon-fa-book', 'layui-icon-fa-bookmark', 'layui-icon-fa-print', 'layui-icon-fa-camera', 'layui-icon-fa-font', 'layui-icon-fa-bold', 'layui-icon-fa-italic', 'layui-icon-fa-text-height', 'layui-icon-fa-text-width', 'layui-icon-fa-align-left', 'layui-icon-fa-align-center', 'layui-icon-fa-align-right', 'layui-icon-fa-align-justify', 'layui-icon-fa-list', 'layui-icon-fa-dedent', 'layui-icon-fa-outdent', 'layui-icon-fa-indent', 'layui-icon-fa-video-camera', 'layui-icon-fa-photo', 'layui-icon-fa-image', 'layui-icon-fa-picture-o', 'layui-icon-fa-pencil', 'layui-icon-fa-map-marker', 'layui-icon-fa-adjust', 'layui-icon-fa-tint', 'layui-icon-fa-edit', 'layui-icon-fa-pencil-square-o', 'layui-icon-fa-share-square-o', 'layui-icon-fa-check-square-o', 'layui-icon-fa-arrows', 'layui-icon-fa-step-backward', 'layui-icon-fa-fast-backward', 'layui-icon-fa-backward', 'layui-icon-fa-play', 'layui-icon-fa-pause', 'layui-icon-fa-stop', 'layui-icon-fa-forward', 'layui-icon-fa-fast-forward', 'layui-icon-fa-step-forward', 'layui-icon-fa-eject', 'layui-icon-fa-chevron-left', 'layui-icon-fa-chevron-right', 'layui-icon-fa-plus-circle', 'layui-icon-fa-minus-circle', 'layui-icon-fa-times-circle', 'layui-icon-fa-check-circle', 'layui-icon-fa-question-circle', 'layui-icon-fa-info-circle', 'layui-icon-fa-crosshairs', 'layui-icon-fa-times-circle-o', 'layui-icon-fa-check-circle-o', 'layui-icon-fa-ban', 'layui-icon-fa-arrow-left', 'layui-icon-fa-arrow-right', 'layui-icon-fa-arrow-up', 'layui-icon-fa-arrow-down', 'layui-icon-fa-mail-forward', 'layui-icon-fa-share', 'layui-icon-fa-expand', 'layui-icon-fa-compress', 'layui-icon-fa-plus', 'layui-icon-fa-minus', 'layui-icon-fa-asterisk', 'layui-icon-fa-exclamation-circle', 'layui-icon-fa-gift', 'layui-icon-fa-leaf', 'layui-icon-fa-fire', 'layui-icon-fa-eye', 'layui-icon-fa-eye-slash', 'layui-icon-fa-warning', 'layui-icon-fa-exclamation-triangle', 'layui-icon-fa-plane', 'layui-icon-fa-calendar', 'layui-icon-fa-random', 'layui-icon-fa-comment', 'layui-icon-fa-magnet', 'layui-icon-fa-chevron-up', 'layui-icon-fa-chevron-down', 'layui-icon-fa-retweet', 'layui-icon-fa-shopping-cart', 'layui-icon-fa-folder', 'layui-icon-fa-folder-open', 'layui-icon-fa-arrows-v', 'layui-icon-fa-arrows-h', 'layui-icon-fa-bar-chart-o', 'layui-icon-fa-bar-chart', 'layui-icon-fa-twitter-square', 'layui-icon-fa-facebook-square', 'layui-icon-fa-camera-retro', 'layui-icon-fa-key', 'layui-icon-fa-gears', 'layui-icon-fa-cogs', 'layui-icon-fa-comments', 'layui-icon-fa-thumbs-o-up', 'layui-icon-fa-thumbs-o-down', 'layui-icon-fa-star-half', 'layui-icon-fa-heart-o', 'layui-icon-fa-sign-out', 'layui-icon-fa-linkedin-square', 'layui-icon-fa-thumb-tack', 'layui-icon-fa-external-link', 'layui-icon-fa-sign-in', 'layui-icon-fa-trophy', 'layui-icon-fa-github-square', 'layui-icon-fa-upload', 'layui-icon-fa-lemon-o', 'layui-icon-fa-phone', 'layui-icon-fa-square-o', 'layui-icon-fa-bookmark-o', 'layui-icon-fa-phone-square', 'layui-icon-fa-twitter', 'layui-icon-fa-facebook-f', 'layui-icon-fa-facebook', 'layui-icon-fa-github', 'layui-icon-fa-unlock', 'layui-icon-fa-credit-card', 'layui-icon-fa-feed', 'layui-icon-fa-rss', 'layui-icon-fa-hdd-o', 'layui-icon-fa-bullhorn', 'layui-icon-fa-bell', 'layui-icon-fa-certificate', 'layui-icon-fa-hand-o-right', 'layui-icon-fa-hand-o-left', 'layui-icon-fa-hand-o-up', 'layui-icon-fa-hand-o-down', 'layui-icon-fa-arrow-circle-left', 'layui-icon-fa-arrow-circle-right', 'layui-icon-fa-arrow-circle-up', 'layui-icon-fa-arrow-circle-down', 'layui-icon-fa-globe', 'layui-icon-fa-wrench', 'layui-icon-fa-tasks', 'layui-icon-fa-filter', 'layui-icon-fa-briefcase', 'layui-icon-fa-arrows-alt', 'layui-icon-fa-group', 'layui-icon-fa-users', 'layui-icon-fa-chain', 'layui-icon-fa-link', 'layui-icon-fa-cloud', 'layui-icon-fa-flask', 'layui-icon-fa-cut', 'layui-icon-fa-scissors', 'layui-icon-fa-copy', 'layui-icon-fa-files-o', 'layui-icon-fa-paperclip', 'layui-icon-fa-save', 'layui-icon-fa-floppy-o', 'layui-icon-fa-square', 'layui-icon-fa-navicon', 'layui-icon-fa-reorder', 'layui-icon-fa-bars', 'layui-icon-fa-list-ul', 'layui-icon-fa-list-ol', 'layui-icon-fa-strikethrough', 'layui-icon-fa-underline', 'layui-icon-fa-table', 'layui-icon-fa-magic', 'layui-icon-fa-truck', 'layui-icon-fa-pinterest', 'layui-icon-fa-pinterest-square', 'layui-icon-fa-google-plus-square', 'layui-icon-fa-google-plus', 'layui-icon-fa-money', 'layui-icon-fa-caret-down', 'layui-icon-fa-caret-up', 'layui-icon-fa-caret-left', 'layui-icon-fa-caret-right', 'layui-icon-fa-columns', 'layui-icon-fa-unsorted', 'layui-icon-fa-sort', 'layui-icon-fa-sort-down', 'layui-icon-fa-sort-desc', 'layui-icon-fa-sort-up', 'layui-icon-fa-sort-asc', 'layui-icon-fa-envelope', 'layui-icon-fa-linkedin', 'layui-icon-fa-rotate-left', 'layui-icon-fa-undo', 'layui-icon-fa-legal', 'layui-icon-fa-gavel', 'layui-icon-fa-dashboard', 'layui-icon-fa-tachometer', 'layui-icon-fa-comment-o', 'layui-icon-fa-comments-o', 'layui-icon-fa-flash', 'layui-icon-fa-bolt', 'layui-icon-fa-sitemap', 'layui-icon-fa-umbrella', 'layui-icon-fa-paste', 'layui-icon-fa-clipboard', 'layui-icon-fa-lightbulb-o', 'layui-icon-fa-exchange', 'layui-icon-fa-cloud-download', 'layui-icon-fa-cloud-upload', 'layui-icon-fa-user-md', 'layui-icon-fa-stethoscope', 'layui-icon-fa-suitcase', 'layui-icon-fa-bell-o', 'layui-icon-fa-coffee', 'layui-icon-fa-cutlery', 'layui-icon-fa-file-text-o', 'layui-icon-fa-building-o', 'layui-icon-fa-hospital-o', 'layui-icon-fa-ambulance', 'layui-icon-fa-medkit', 'layui-icon-fa-fighter-jet', 'layui-icon-fa-beer', 'layui-icon-fa-h-square', 'layui-icon-fa-plus-square', 'layui-icon-fa-angle-double-left', 'layui-icon-fa-angle-double-right', 'layui-icon-fa-angle-double-up', 'layui-icon-fa-angle-double-down', 'layui-icon-fa-angle-left', 'layui-icon-fa-angle-right', 'layui-icon-fa-angle-up', 'layui-icon-fa-angle-down', 'layui-icon-fa-desktop', 'layui-icon-fa-laptop', 'layui-icon-fa-tablet', 'layui-icon-fa-mobile-phone', 'layui-icon-fa-mobile', 'layui-icon-fa-circle-o', 'layui-icon-fa-quote-left', 'layui-icon-fa-quote-right', 'layui-icon-fa-spinner', 'layui-icon-fa-circle', 'layui-icon-fa-mail-reply', 'layui-icon-fa-reply', 'layui-icon-fa-github-alt', 'layui-icon-fa-folder-o', 'layui-icon-fa-folder-open-o', 'layui-icon-fa-smile-o', 'layui-icon-fa-frown-o', 'layui-icon-fa-meh-o', 'layui-icon-fa-gamepad', 'layui-icon-fa-keyboard-o', 'layui-icon-fa-flag-o', 'layui-icon-fa-flag-checkered', 'layui-icon-fa-terminal', 'layui-icon-fa-code', 'layui-icon-fa-mail-reply-all', 'layui-icon-fa-reply-all', 'layui-icon-fa-star-half-empty', 'layui-icon-fa-star-half-full', 'layui-icon-fa-star-half-o', 'layui-icon-fa-location-arrow', 'layui-icon-fa-crop', 'layui-icon-fa-code-fork', 'layui-icon-fa-unlink', 'layui-icon-fa-chain-broken', 'layui-icon-fa-question', 'layui-icon-fa-info', 'layui-icon-fa-exclamation', 'layui-icon-fa-superscript', 'layui-icon-fa-subscript', 'layui-icon-fa-eraser', 'layui-icon-fa-puzzle-piece', 'layui-icon-fa-microphone', 'layui-icon-fa-microphone-slash', 'layui-icon-fa-shield', 'layui-icon-fa-calendar-o', 'layui-icon-fa-fire-extinguisher', 'layui-icon-fa-rocket', 'layui-icon-fa-maxcdn', 'layui-icon-fa-chevron-circle-left', 'layui-icon-fa-chevron-circle-right', 'layui-icon-fa-chevron-circle-up', 'layui-icon-fa-chevron-circle-down', 'layui-icon-fa-html5', 'layui-icon-fa-css3', 'layui-icon-fa-anchor', 'layui-icon-fa-unlock-alt', 'layui-icon-fa-bullseye', 'layui-icon-fa-ellipsis-h', 'layui-icon-fa-ellipsis-v', 'layui-icon-fa-rss-square', 'layui-icon-fa-play-circle', 'layui-icon-fa-ticket', 'layui-icon-fa-minus-square', 'layui-icon-fa-minus-square-o', 'layui-icon-fa-level-up', 'layui-icon-fa-level-down', 'layui-icon-fa-check-square', 'layui-icon-fa-pencil-square', 'layui-icon-fa-external-link-square', 'layui-icon-fa-share-square', 'layui-icon-fa-compass', 'layui-icon-fa-toggle-down', 'layui-icon-fa-caret-square-o-down', 'layui-icon-fa-toggle-up', 'layui-icon-fa-caret-square-o-up', 'layui-icon-fa-toggle-right', 'layui-icon-fa-caret-square-o-right', 'layui-icon-fa-euro', 'layui-icon-fa-eur', 'layui-icon-fa-gbp', 'layui-icon-fa-dollar', 'layui-icon-fa-usd', 'layui-icon-fa-rupee', 'layui-icon-fa-inr', 'layui-icon-fa-cny', 'layui-icon-fa-rmb', 'layui-icon-fa-yen', 'layui-icon-fa-jpy', 'layui-icon-fa-ruble', 'layui-icon-fa-rouble', 'layui-icon-fa-rub', 'layui-icon-fa-won', 'layui-icon-fa-krw', 'layui-icon-fa-bitcoin', 'layui-icon-fa-btc', 'layui-icon-fa-file', 'layui-icon-fa-file-text', 'layui-icon-fa-sort-alpha-asc', 'layui-icon-fa-sort-alpha-desc', 'layui-icon-fa-sort-amount-asc', 'layui-icon-fa-sort-amount-desc', 'layui-icon-fa-sort-numeric-asc', 'layui-icon-fa-sort-numeric-desc', 'layui-icon-fa-thumbs-up', 'layui-icon-fa-thumbs-down', 'layui-icon-fa-youtube-square', 'layui-icon-fa-youtube', 'layui-icon-fa-xing', 'layui-icon-fa-xing-square', 'layui-icon-fa-youtube-play', 'layui-icon-fa-dropbox', 'layui-icon-fa-stack-overflow', 'layui-icon-fa-instagram', 'layui-icon-fa-flickr', 'layui-icon-fa-adn', 'layui-icon-fa-bitbucket', 'layui-icon-fa-bitbucket-square', 'layui-icon-fa-tumblr', 'layui-icon-fa-tumblr-square', 'layui-icon-fa-long-arrow-down', 'layui-icon-fa-long-arrow-up', 'layui-icon-fa-long-arrow-left', 'layui-icon-fa-long-arrow-right', 'layui-icon-fa-apple', 'layui-icon-fa-windows', 'layui-icon-fa-android', 'layui-icon-fa-linux', 'layui-icon-fa-dribbble', 'layui-icon-fa-skype', 'layui-icon-fa-foursquare', 'layui-icon-fa-trello', 'layui-icon-fa-female', 'layui-icon-fa-male', 'layui-icon-fa-gittip', 'layui-icon-fa-gratipay', 'layui-icon-fa-sun-o', 'layui-icon-fa-moon-o', 'layui-icon-fa-archive', 'layui-icon-fa-bug', 'layui-icon-fa-vk', 'layui-icon-fa-weibo', 'layui-icon-fa-renren', 'layui-icon-fa-pagelines', 'layui-icon-fa-stack-exchange', 'layui-icon-fa-arrow-circle-o-right', 'layui-icon-fa-arrow-circle-o-left', 'layui-icon-fa-toggle-left', 'layui-icon-fa-caret-square-o-left', 'layui-icon-fa-dot-circle-o', 'layui-icon-fa-wheelchair', 'layui-icon-fa-vimeo-square', 'layui-icon-fa-turkish-lira', 'layui-icon-fa-try', 'layui-icon-fa-plus-square-o', 'layui-icon-fa-space-shuttle', 'layui-icon-fa-slack', 'layui-icon-fa-envelope-square', 'layui-icon-fa-wordpress', 'layui-icon-fa-openid', 'layui-icon-fa-institution', 'layui-icon-fa-bank', 'layui-icon-fa-university', 'layui-icon-fa-mortar-board', 'layui-icon-fa-graduation-cap', 'layui-icon-fa-yahoo', 'layui-icon-fa-google', 'layui-icon-fa-reddit', 'layui-icon-fa-reddit-square', 'layui-icon-fa-stumbleupon-circle', 'layui-icon-fa-stumbleupon', 'layui-icon-fa-delicious', 'layui-icon-fa-digg', 'layui-icon-fa-pied-piper-pp', 'layui-icon-fa-pied-piper-alt', 'layui-icon-fa-drupal', 'layui-icon-fa-joomla', 'layui-icon-fa-language', 'layui-icon-fa-fax', 'layui-icon-fa-building', 'layui-icon-fa-child', 'layui-icon-fa-paw', 'layui-icon-fa-spoon', 'layui-icon-fa-cube', 'layui-icon-fa-cubes', 'layui-icon-fa-behance', 'layui-icon-fa-behance-square', 'layui-icon-fa-steam', 'layui-icon-fa-steam-square', 'layui-icon-fa-recycle', 'layui-icon-fa-automobile', 'layui-icon-fa-car', 'layui-icon-fa-cab', 'layui-icon-fa-taxi', 'layui-icon-fa-tree', 'layui-icon-fa-spotify', 'layui-icon-fa-deviantart', 'layui-icon-fa-soundcloud', 'layui-icon-fa-database', 'layui-icon-fa-file-pdf-o', 'layui-icon-fa-file-word-o', 'layui-icon-fa-file-excel-o', 'layui-icon-fa-file-powerpoint-o', 'layui-icon-fa-file-photo-o', 'layui-icon-fa-file-picture-o', 'layui-icon-fa-file-image-o', 'layui-icon-fa-file-zip-o', 'layui-icon-fa-file-archive-o', 'layui-icon-fa-file-sound-o', 'layui-icon-fa-file-audio-o', 'layui-icon-fa-file-movie-o', 'layui-icon-fa-file-video-o', 'layui-icon-fa-file-code-o', 'layui-icon-fa-vine', 'layui-icon-fa-codepen', 'layui-icon-fa-jsfiddle', 'layui-icon-fa-life-bouy', 'layui-icon-fa-life-buoy', 'layui-icon-fa-life-saver', 'layui-icon-fa-support', 'layui-icon-fa-life-ring', 'layui-icon-fa-circle-o-notch', 'layui-icon-fa-ra', 'layui-icon-fa-resistance', 'layui-icon-fa-rebel', 'layui-icon-fa-ge', 'layui-icon-fa-empire', 'layui-icon-fa-git-square', 'layui-icon-fa-git', 'layui-icon-fa-y-combinator-square', 'layui-icon-fa-yc-square', 'layui-icon-fa-hacker-news', 'layui-icon-fa-tencent-weibo', 'layui-icon-fa-qq', 'layui-icon-fa-wechat', 'layui-icon-fa-weixin', 'layui-icon-fa-send', 'layui-icon-fa-paper-plane', 'layui-icon-fa-send-o', 'layui-icon-fa-paper-plane-o', 'layui-icon-fa-history', 'layui-icon-fa-circle-thin', 'layui-icon-fa-header', 'layui-icon-fa-paragraph', 'layui-icon-fa-sliders', 'layui-icon-fa-share-alt', 'layui-icon-fa-share-alt-square', 'layui-icon-fa-bomb', 'layui-icon-fa-soccer-ball-o', 'layui-icon-fa-futbol-o', 'layui-icon-fa-tty', 'layui-icon-fa-binoculars', 'layui-icon-fa-plug', 'layui-icon-fa-slideshare', 'layui-icon-fa-twitch', 'layui-icon-fa-yelp', 'layui-icon-fa-newspaper-o', 'layui-icon-fa-wifi', 'layui-icon-fa-calculator', 'layui-icon-fa-paypal', 'layui-icon-fa-google-wallet', 'layui-icon-fa-cc-visa', 'layui-icon-fa-cc-mastercard', 'layui-icon-fa-cc-discover', 'layui-icon-fa-cc-amex', 'layui-icon-fa-cc-paypal', 'layui-icon-fa-cc-stripe', 'layui-icon-fa-bell-slash', 'layui-icon-fa-bell-slash-o', 'layui-icon-fa-trash', 'layui-icon-fa-copyright', 'layui-icon-fa-at', 'layui-icon-fa-eyedropper', 'layui-icon-fa-paint-brush', 'layui-icon-fa-birthday-cake', 'layui-icon-fa-area-chart', 'layui-icon-fa-pie-chart', 'layui-icon-fa-line-chart', 'layui-icon-fa-lastfm', 'layui-icon-fa-lastfm-square', 'layui-icon-fa-toggle-off', 'layui-icon-fa-toggle-on', 'layui-icon-fa-bicycle', 'layui-icon-fa-bus', 'layui-icon-fa-ioxhost', 'layui-icon-fa-angellist', 'layui-icon-fa-cc', 'layui-icon-fa-shekel', 'layui-icon-fa-sheqel', 'layui-icon-fa-ils', 'layui-icon-fa-meanpath', 'layui-icon-fa-buysellads', 'layui-icon-fa-connectdevelop', 'layui-icon-fa-dashcube', 'layui-icon-fa-forumbee', 'layui-icon-fa-leanpub', 'layui-icon-fa-sellsy', 'layui-icon-fa-shirtsinbulk', 'layui-icon-fa-simplybuilt', 'layui-icon-fa-skyatlas', 'layui-icon-fa-cart-plus', 'layui-icon-fa-cart-arrow-down', 'layui-icon-fa-diamond', 'layui-icon-fa-ship', 'layui-icon-fa-user-secret', 'layui-icon-fa-motorcycle', 'layui-icon-fa-street-view', 'layui-icon-fa-heartbeat', 'layui-icon-fa-venus', 'layui-icon-fa-mars', 'layui-icon-fa-mercury', 'layui-icon-fa-intersex', 'layui-icon-fa-transgender', 'layui-icon-fa-transgender-alt', 'layui-icon-fa-venus-double', 'layui-icon-fa-mars-double', 'layui-icon-fa-venus-mars', 'layui-icon-fa-mars-stroke', 'layui-icon-fa-mars-stroke-v', 'layui-icon-fa-mars-stroke-h', 'layui-icon-fa-neuter', 'layui-icon-fa-genderless', 'layui-icon-fa-facebook-official', 'layui-icon-fa-pinterest-p', 'layui-icon-fa-whatsapp', 'layui-icon-fa-server', 'layui-icon-fa-user-plus', 'layui-icon-fa-user-times', 'layui-icon-fa-hotel', 'layui-icon-fa-bed', 'layui-icon-fa-viacoin', 'layui-icon-fa-train', 'layui-icon-fa-subway', 'layui-icon-fa-medium', 'layui-icon-fa-yc', 'layui-icon-fa-y-combinator', 'layui-icon-fa-optin-monster', 'layui-icon-fa-opencart', 'layui-icon-fa-expeditedssl', 'layui-icon-fa-battery-4', 'layui-icon-fa-battery', 'layui-icon-fa-battery-full', 'layui-icon-fa-battery-3', 'layui-icon-fa-battery-three-quarters', 'layui-icon-fa-battery-2', 'layui-icon-fa-battery-half', 'layui-icon-fa-battery-1', 'layui-icon-fa-battery-quarter', 'layui-icon-fa-battery-0', 'layui-icon-fa-battery-empty', 'layui-icon-fa-mouse-pointer', 'layui-icon-fa-i-cursor', 'layui-icon-fa-object-group', 'layui-icon-fa-object-ungroup', 'layui-icon-fa-sticky-note', 'layui-icon-fa-sticky-note-o', 'layui-icon-fa-cc-jcb', 'layui-icon-fa-cc-diners-club', 'layui-icon-fa-clone', 'layui-icon-fa-balance-scale', 'layui-icon-fa-hourglass-o', 'layui-icon-fa-hourglass-1', 'layui-icon-fa-hourglass-start', 'layui-icon-fa-hourglass-2', 'layui-icon-fa-hourglass-half', 'layui-icon-fa-hourglass-3', 'layui-icon-fa-hourglass-end', 'layui-icon-fa-hourglass', 'layui-icon-fa-hand-grab-o', 'layui-icon-fa-hand-rock-o', 'layui-icon-fa-hand-stop-o', 'layui-icon-fa-hand-paper-o', 'layui-icon-fa-hand-scissors-o', 'layui-icon-fa-hand-lizard-o', 'layui-icon-fa-hand-spock-o', 'layui-icon-fa-hand-pointer-o', 'layui-icon-fa-hand-peace-o', 'layui-icon-fa-trademark', 'layui-icon-fa-registered', 'layui-icon-fa-creative-commons', 'layui-icon-fa-gg', 'layui-icon-fa-gg-circle', 'layui-icon-fa-tripadvisor', 'layui-icon-fa-odnoklassniki', 'layui-icon-fa-odnoklassniki-square', 'layui-icon-fa-get-pocket', 'layui-icon-fa-wikipedia-w', 'layui-icon-fa-safari', 'layui-icon-fa-chrome', 'layui-icon-fa-firefox', 'layui-icon-fa-opera', 'layui-icon-fa-internet-explorer', 'layui-icon-fa-tv', 'layui-icon-fa-television', 'layui-icon-fa-contao', 'layui-icon-fa-500px', 'layui-icon-fa-amazon', 'layui-icon-fa-calendar-plus-o', 'layui-icon-fa-calendar-minus-o', 'layui-icon-fa-calendar-times-o', 'layui-icon-fa-calendar-check-o', 'layui-icon-fa-industry', 'layui-icon-fa-map-pin', 'layui-icon-fa-map-signs', 'layui-icon-fa-map-o', 'layui-icon-fa-map', 'layui-icon-fa-commenting', 'layui-icon-fa-commenting-o', 'layui-icon-fa-houzz', 'layui-icon-fa-vimeo', 'layui-icon-fa-black-tie', 'layui-icon-fa-fonticons', 'layui-icon-fa-reddit-alien', 'layui-icon-fa-edge', 'layui-icon-fa-credit-card-alt', 'layui-icon-fa-codiepie', 'layui-icon-fa-modx', 'layui-icon-fa-fort-awesome', 'layui-icon-fa-usb', 'layui-icon-fa-product-hunt', 'layui-icon-fa-mixcloud', 'layui-icon-fa-scribd', 'layui-icon-fa-pause-circle', 'layui-icon-fa-pause-circle-o', 'layui-icon-fa-stop-circle', 'layui-icon-fa-stop-circle-o', 'layui-icon-fa-shopping-bag', 'layui-icon-fa-shopping-basket', 'layui-icon-fa-hashtag', 'layui-icon-fa-bluetooth', 'layui-icon-fa-bluetooth-b', 'layui-icon-fa-percent', 'layui-icon-fa-gitlab', 'layui-icon-fa-wpbeginner', 'layui-icon-fa-wpforms', 'layui-icon-fa-envira', 'layui-icon-fa-universal-access', 'layui-icon-fa-wheelchair-alt', 'layui-icon-fa-question-circle-o', 'layui-icon-fa-blind', 'layui-icon-fa-audio-description', 'layui-icon-fa-volume-control-phone', 'layui-icon-fa-braille', 'layui-icon-fa-assistive-listening-systems', 'layui-icon-fa-asl-interpreting', 'layui-icon-fa-american-sign-language-interpreting', 'layui-icon-fa-deafness', 'layui-icon-fa-hard-of-hearing', 'layui-icon-fa-deaf', 'layui-icon-fa-glide', 'layui-icon-fa-glide-g', 'layui-icon-fa-signing', 'layui-icon-fa-sign-language', 'layui-icon-fa-low-vision', 'layui-icon-fa-viadeo', 'layui-icon-fa-viadeo-square', 'layui-icon-fa-snapchat', 'layui-icon-fa-snapchat-ghost', 'layui-icon-fa-snapchat-square', 'layui-icon-fa-pied-piper', 'layui-icon-fa-first-order', 'layui-icon-fa-yoast', 'layui-icon-fa-themeisle', 'layui-icon-fa-google-plus-circle', 'layui-icon-fa-google-plus-official', 'layui-icon-fa-fa', 'layui-icon-fa-font-awesome', 'layui-icon-fa-handshake-o', 'layui-icon-fa-envelope-open', 'layui-icon-fa-envelope-open-o', 'layui-icon-fa-linode', 'layui-icon-fa-address-book', 'layui-icon-fa-address-book-o', 'layui-icon-fa-vcard', 'layui-icon-fa-address-card', 'layui-icon-fa-vcard-o', 'layui-icon-fa-address-card-o', 'layui-icon-fa-user-circle', 'layui-icon-fa-user-circle-o', 'layui-icon-fa-user-o', 'layui-icon-fa-id-badge', 'layui-icon-fa-drivers-license', 'layui-icon-fa-id-card', 'layui-icon-fa-drivers-license-o', 'layui-icon-fa-id-card-o', 'layui-icon-fa-quora', 'layui-icon-fa-free-code-camp', 'layui-icon-fa-telegram', 'layui-icon-fa-thermometer-4', 'layui-icon-fa-thermometer', 'layui-icon-fa-thermometer-full', 'layui-icon-fa-thermometer-3', 'layui-icon-fa-thermometer-three-quarters', 'layui-icon-fa-thermometer-2', 'layui-icon-fa-thermometer-half', 'layui-icon-fa-thermometer-1', 'layui-icon-fa-thermometer-quarter', 'layui-icon-fa-thermometer-0', 'layui-icon-fa-thermometer-empty', 'layui-icon-fa-shower', 'layui-icon-fa-bathtub', 'layui-icon-fa-s15', 'layui-icon-fa-bath', 'layui-icon-fa-podcast', 'layui-icon-fa-window-maximize', 'layui-icon-fa-window-minimize', 'layui-icon-fa-window-restore', 'layui-icon-fa-times-rectangle', 'layui-icon-fa-window-close', 'layui-icon-fa-times-rectangle-o', 'layui-icon-fa-window-close-o', 'layui-icon-fa-bandcamp', 'layui-icon-fa-grav', 'layui-icon-fa-etsy', 'layui-icon-fa-imdb', 'layui-icon-fa-ravelry', 'layui-icon-fa-eercast', 'layui-icon-fa-microchip', 'layui-icon-fa-snowflake-o', 'layui-icon-fa-superpowers', 'layui-icon-fa-wpexplorer', 'layui-icon-fa-meetup'];
                    return arr;
                },
                unicode: function () {
                    return ['f000', 'f001', 'f002', 'f003', 'f004', 'f005', 'f006', 'f007', 'f008', 'f009', 'f00a', 'f00b', 'f00c', 'f00d', 'f00e', 'f010', 'f011', 'f012', 'f013', 'f014', 'f015', 'f016', 'f017', 'f018', 'f019', 'f01a', 'f01b', 'f01c', 'f01d', 'f01e', 'f021', 'f022', 'f023', 'f024', 'f025', 'f026', 'f027', 'f028', 'f029', 'f02a', 'f02b', 'f02c', 'f02d', 'f02e', 'f02f', 'f030', 'f031', 'f032', 'f033', 'f034', 'f035', 'f036', 'f037', 'f038', 'f039', 'f03a', 'f03b', 'f03c', 'f03d', 'f03e', 'f040', 'f041', 'f042', 'f043', 'f044', 'f045', 'f046', 'f047', 'f048', 'f049', 'f04a', 'f04b', 'f04c', 'f04d', 'f04e', 'f050', 'f051', 'f052', 'f053', 'f054', 'f055', 'f056', 'f057', 'f058', 'f059', 'f05a', 'f05b', 'f05c', 'f05d', 'f05e', 'f060', 'f061', 'f062', 'f063', 'f064', 'f065', 'f066', 'f067', 'f068', 'f069', 'f06a', 'f06b', 'f06c', 'f06d', 'f06e', 'f070', 'f071', 'f072', 'f073', 'f074', 'f075', 'f076', 'f077', 'f078', 'f079', 'f07a', 'f07b', 'f07c', 'f07d', 'f07e', 'f080', 'f081', 'f082', 'f083', 'f084', 'f085', 'f086', 'f087', 'f088', 'f089', 'f08a', 'f08b', 'f08c', 'f08d', 'f08e', 'f090', 'f091', 'f092', 'f093', 'f094', 'f095', 'f096', 'f097', 'f098', 'f099', 'f09a', 'f09b', 'f09c', 'f09d', 'f09e', 'f0a0', 'f0a1', 'f0f3', 'f0a3', 'f0a4', 'f0a5', 'f0a6', 'f0a7', 'f0a8', 'f0a9', 'f0aa', 'f0ab', 'f0ac', 'f0ad', 'f0ae', 'f0b0', 'f0b1', 'f0b2', 'f0c0', 'f0c1', 'f0c2', 'f0c3', 'f0c4', 'f0c5', 'f0c6', 'f0c7', 'f0c8', 'f0c9', 'f0ca', 'f0cb', 'f0cc', 'f0cd', 'f0ce', 'f0d0', 'f0d1', 'f0d2', 'f0d3', 'f0d4', 'f0d5', 'f0d6', 'f0d7', 'f0d8', 'f0d9', 'f0da', 'f0db', 'f0dc', 'f0dd', 'f0de', 'f0e0', 'f0e1', 'f0e2', 'f0e3', 'f0e4', 'f0e5', 'f0e6', 'f0e7', 'f0e8', 'f0e9', 'f0ea', 'f0eb', 'f0ec', 'f0ed', 'f0ee', 'f0f0', 'f0f1', 'f0f2', 'f0a2', 'f0f4', 'f0f5', 'f0f6', 'f0f7', 'f0f8', 'f0f9', 'f0fa', 'f0fb', 'f0fc', 'f0fd', 'f0fe', 'f100', 'f101', 'f102', 'f103', 'f104', 'f105', 'f106', 'f107', 'f108', 'f109', 'f10a', 'f10b', 'f10c', 'f10d', 'f10e', 'f110', 'f111', 'f112', 'f113', 'f114', 'f115', 'f118', 'f119', 'f11a', 'f11b', 'f11c', 'f11d', 'f11e', 'f120', 'f121', 'f122', 'f123', 'f124', 'f125', 'f126', 'f127', 'f128', 'f129', 'f12a', 'f12b', 'f12c', 'f12d', 'f12e', 'f130', 'f131', 'f132', 'f133', 'f134', 'f135', 'f136', 'f137', 'f138', 'f139', 'f13a', 'f13b', 'f13c', 'f13d', 'f13e', 'f140', 'f141', 'f142', 'f143', 'f144', 'f145', 'f146', 'f147', 'f148', 'f149', 'f14a', 'f14b', 'f14c', 'f14d', 'f14e', 'f150', 'f151', 'f152', 'f153', 'f154', 'f155', 'f156', 'f157', 'f158', 'f159', 'f15a', 'f15b', 'f15c', 'f15d', 'f15e', 'f160', 'f161', 'f162', 'f163', 'f164', 'f165', 'f166', 'f167', 'f168', 'f169', 'f16a', 'f16b', 'f16c', 'f16d', 'f16e', 'f170', 'f171', 'f172', 'f173', 'f174', 'f175', 'f176', 'f177', 'f178', 'f179', 'f17a', 'f17b', 'f17c', 'f17d', 'f17e', 'f180', 'f181', 'f182', 'f183', 'f184', 'f185', 'f186', 'f187', 'f188', 'f189', 'f18a', 'f18b', 'f18c', 'f18d', 'f18e', 'f190', 'f191', 'f192', 'f193', 'f194', 'f195', 'f196', 'f197', 'f198', 'f199', 'f19a', 'f19b', 'f19c', 'f19d', 'f19e', 'f1a0', 'f1a1', 'f1a2', 'f1a3', 'f1a4', 'f1a5', 'f1a6', 'f1a7', 'f1a8', 'f1a9', 'f1aa', 'f1ab', 'f1ac', 'f1ad', 'f1ae', 'f1b0', 'f1b1', 'f1b2', 'f1b3', 'f1b4', 'f1b5', 'f1b6', 'f1b7', 'f1b8', 'f1b9', 'f1ba', 'f1bb', 'f1bc', 'f1bd', 'f1be', 'f1c0', 'f1c1', 'f1c2', 'f1c3', 'f1c4', 'f1c5', 'f1c6', 'f1c7', 'f1c8', 'f1c9', 'f1ca', 'f1cb', 'f1cc', 'f1cd', 'f1ce', 'f1d0', 'f1d1', 'f1d2', 'f1d3', 'f1d4', 'f1d5', 'f1d6', 'f1d7', 'f1d8', 'f1d9', 'f1da', 'f1db', 'f1dc', 'f1dd', 'f1de', 'f1e0', 'f1e1', 'f1e2', 'f1e3', 'f1e4', 'f1e5', 'f1e6', 'f1e7', 'f1e8', 'f1e9', 'f1ea', 'f1eb', 'f1ec', 'f1ed', 'f1ee', 'f1f0', 'f1f1', 'f1f2', 'f1f3', 'f1f4', 'f1f5', 'f1f6', 'f1f7', 'f1f8', 'f1f9', 'f1fa', 'f1fb', 'f1fc', 'f1fd', 'f1fe', 'f200', 'f201', 'f202', 'f203', 'f204', 'f205', 'f206', 'f207', 'f208', 'f209', 'f20a', 'f20b', 'f20c', 'f20d', 'f20e', 'f210', 'f211', 'f212', 'f213', 'f214', 'f215', 'f216', 'f217', 'f218', 'f219', 'f21a', 'f21b', 'f21c', 'f21d', 'f21e', 'f221', 'f222', 'f223', 'f224', 'f225', 'f226', 'f227', 'f228', 'f229', 'f22a', 'f22b', 'f22c', 'f22d', 'f230', 'f231', 'f232', 'f233', 'f234', 'f235', 'f236', 'f237', 'f238', 'f239', 'f23a', 'f23b', 'f23c', 'f23d', 'f23e', 'f240', 'f241', 'f242', 'f243', 'f244', 'f245', 'f246', 'f247', 'f248', 'f249', 'f24a', 'f24b', 'f24c', 'f24d', 'f24e', 'f250', 'f251', 'f252', 'f253', 'f254', 'f255', 'f256', 'f257', 'f258', 'f259', 'f25a', 'f25b', 'f25c', 'f25d', 'f25e', 'f260', 'f261', 'f262', 'f263', 'f264', 'f265', 'f266', 'f267', 'f268', 'f269', 'f26a', 'f26b', 'f26c', 'f26d', 'f26e', 'f270', 'f271', 'f272', 'f273', 'f274', 'f275', 'f276', 'f277', 'f278', 'f279', 'f27a', 'f27b', 'f27c', 'f27d', 'f27e', 'f280', 'f281', 'f282', 'f283', 'f284', 'f285', 'f286', 'f287', 'f288', 'f289', 'f28a', 'f28b', 'f28c', 'f28d', 'f28e', 'f290', 'f291', 'f292', 'f293', 'f294', 'f295', 'f296', 'f297', 'f298', 'f299', 'f29a', 'f29b', 'f29c', 'f29d', 'f29e', 'f2a0', 'f2a1', 'f2a2', 'f2a3', 'f2a4', 'f2a5', 'f2a6', 'f2a7', 'f2a8', 'f2a9', 'f2aa', 'f2ab', 'f2ac', 'f2ad', 'f2ae', 'f2b0', 'f2b1', 'f2b2', 'f2b3', 'f2b4', 'f2b5', 'f2b6', 'f2b7', 'f2b8', 'f2b9', 'f2ba', 'f2bb', 'f2bc', 'f2bd', 'f2be', 'f2c0', 'f2c1', 'f2c2', 'f2c3', 'f2c4', 'f2c5', 'f2c6', 'f2c7', 'f2c8', 'f2c9', 'f2ca', 'f2cb', 'f2cc', 'f2cd', 'f2ce', 'f2d0', 'f2d1', 'f2d2', 'f2d3', 'f2d4', 'f2d5', 'f2d6', 'f2d7', 'f2d8', 'f2d9', 'f2da', 'f2db', 'f2dc', 'f2dd', 'f2de', 'f2e0'];
                }
            }
        };

        a.init();
        return new IconPicker();
    };

    /**
     * 选中图标
     * @param filter lay-filter
     * @param iconName 图标名称，自动识别fontClass/unicode
     */
    IconPicker.prototype.checkIcon = function (filter, iconName){
        var el = $('*[lay-filter='+ filter +']'),
            p = el.next().find('.layui-iconpicker-item .layui-icon'),
            c = iconName;

        if (c.indexOf('#xe') > 0){
            p.html(c);
        } else {
            p.html('').attr('class', 'layui-icon ' + c);
        }
        el.attr('value', c).val(c);
    };

    var iconPicker = new IconPicker();
    exports(_MOD, iconPicker);
});