
(function ($) {
    $.fn.fboxy = function (options) {
        // default variables
        options = options || {};
        var defaults = {
            showClose: true, // close button
            showTitle: true, // title from the <a> tag
            closeEsc: true, // close the boxy by pressing esc
            closeBg: true, // close the boxy by clicking on the bg
            iframe: false, // in case of a link, load the content in an iframe
            zindex: 1000
        }
        options = $.extend(defaults, options);

        // append required elements into the dom
        var fboxy_bg = $('<div id="fboxy-bg"></div>');
        if (!$("#fboxy-bg").length) {
            $(fboxy_bg).appendTo("body");
            $(fboxy_bg).css("z-index", options.zindex);
        }

        $($(this).filter("a")).each(function () {
            $(this).click(function () {
                opt = {}
                strtitle = ($(this).attr("title")) ? $(this).attr("title") : '&nbsp;';
                opt = $.extend(options, {title: strtitle, initiator: $(this)});
                objBoxy = new classBoxy(opt);
                objBoxy.open($(this).attr("href"));

                return false;
            });
        });

    }
}(jQuery));

function classBoxy(options) {

    this.wrapper = $('<div class="fboxy-wrapper"><div class="fboxy-title"><h3></h3><a href="#" class="fboxy-close"></a></div><div class="fboxy-body">Body</div></div>');
    this.loading = '<div class="fboxy-loading"></div>';
    this.instance = null;
    this.options = options;
    this.loaded = false;
    this.error = false;
    self = this;

    this.open = function (url) {
        if (url.substr(0, 1) == '#' && url.length > 1) {
            if ($(url).length)
                html = $(url).html();
        } else {
            url += (url.indexOf("?") > 0) ? "&modal=true" : "?modal=true";
            if (this.options.iframe) {
                html = this.loading + '<iframe class="fboxy-iframe" border="0" frameborder="0" height="100%" width="100%" src=' + url + '>Your browser is too old to support iFrames, please upgrade.</iframe>';
            } else {
                html = this.loading;
                obj = $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'html',
                    cache: false,
                    success: function (html) {
                        self.load(html);
                    },
                    error: function () {
                        alert("There was an unexpected error! Sorry for the inconvenience.");
                        self.error = 1;
                    }
                });
            }
        }
        if (!this.loaded && !self.error)
            this.load(html)
    }

    this.load = function (html) {

        var self = this;
        var self = this;

        if (!this.instance) {
            this.instance = this.wrapper.appendTo("body").css("z-index", ++this.options.zindex);
            this.instance.addClass("loaded");
        }

        this.instance.find(".fboxy-body").html(html);
        this.loaded = true;
        this.instance.find(".fboxy-close, a[rel=fboxy-close]").click(function () {
            self.unload();
            return false;
        });

        if (!this.options.showClose)
            this.instance.find(".fboxy-title .fboxy-close").hide();


        if (this.options.showTitle)
            this.instance.find(".fboxy-title h3").html(this.options.title);
        else
            this.instance.find(".fboxy-title h3").html('&nbsp;');

        if (this.options.closeBg)
            $("#fboxy-bg").click(function () {
                self.unload();
            })

        if (this.options.closeEsc)
            $(document).bind('keydown', function (evt) {
                var key = evt.which || evt.keyCode;
                if (key == 27) {
                    self.unload();
                    $(document).unbind('keydown');
                }
            });

        if (html.toString().indexOf("fboxy-iframe") > 0) {
            this.instance.find(".fboxy-body").addClass("fboxy-body-iframe");
            this.instance.find("iframe").bind("load", function () {
                self.instance.find("iframe").show();
                self.instance.find(".fboxy-loading").remove();
            });
        }

        this.loadBG();
    }

    this.unload = function () {
        this.instance.remove();
        if (!$(".fboxy-wrapper").length)
            this.unloadBG();
    }

    this.loadBG = function () {
        $("#fboxy-bg").css("visibility", "visible").animate({opacity: 1}, 400);
    }
    this.unloadBG = function () {
        $("#fboxy-bg").animate({opacity: 0}, 400, function () {
            $(this).css("visibility", "hidden");
        });
    }

}
