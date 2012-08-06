;(function ($) {
    'use strict';

    // thanks to http://www.mobify.com/
    var CSS = {
        cache: {},
        has: {},
        prefixes: ['Webkit', 'Moz', 'O', 'ms', ''],

        getProperty: function (name) {
            var div, property;
            if (typeof CSS.cache[name] !== 'undefined') {
                return CSS.cache[name];
            }

            div  = document.createElement('div').style;
            for (var i = 0; i < CSS.prefixes.length; ++i) {
                if (div[CSS.prefixes[i] + name] != undefined) {
                    return CSS.cache[name] = CSS.prefixes[i] + name;
                }
            }
        }
    };

    CSS.has = {
        'transform': !! (CSS.getProperty('Transform')),
        'transform3d': !! (window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix()) 
    };

    CSS.translateX = function (element, delta) {
        var property = CSS.getProperty('Transform');
        if (typeof delta === 'number') {
            delta = delta + 'px';
        }
        if (CSS.has.transform3d) {
            element.style[property] = 'translate3d(' + delta  + ', 0, 0)';
        } else if (CSS.has.transform) {
            element.style[property] = 'translate(' + delta  + ', 0)';
        } else {
            element.style.left = delta;
        }
    };

    CSS.addClass = function () {
        $.each(arguments, function () {
            $('html').addClass((CSS.has[this] ? '' : 'no-') + this);
        });
    };

    CSS.addClass('transform', 'transform3d');

})(Zepto);



;(function ($) {
    'use strict';
    
    var defaults = {
        prev: '.prev',
        next: '.next'
    };

    $.fn.carousel = function (opts) {
        var settings = $.extend({}, defaults, opts),
            container = $(this),
            btn = { prev: $(settings.prev), next: $(settings.next) },
            doc = $(document),
            current = (function () {
                var element = container.find('.to-current'),
                    classname = 'to-prev';
                if (!element.length) {
                    element = container.children().first().addClass('to-current');
                }
                container.children().each(function () {       
                    if ($(this).hasClass('to-current')) {
                        classname = 'to-next';
                    } else {
                        $(this).addClass(classname);
                    }
                });
                return element
            })(),
            move = {
                reset: function () {
                    current.removeClass('moving');
                    CSS.translateX(current[0], 0);
                },
                next: function () {
                    var element = current.next();
                    move.reset();
                    if (element.length) {
                        btn.prev.removeClass('disable');
                        current.removeClass('to-current').addClass('to-prev');
                        element.removeClass('to-next').addClass('to-current');
                        if (!element.next().length) {
                            btn.next.addClass('disable');
                        }
                        current = element;
                    }
                },
                prev: function () {
                    var element = current.prev();
                    move.reset();
                    if (element.length) {
                        btn.next.removeClass('disable');
                        current.removeClass('to-current').addClass('to-next');
                        element.removeClass('to-prev').addClass('to-current');
                        if (!element.prev().length) {
                            btn.prev.addClass('disable');
                        }
                        current = element;
                    }
                }
            };

        // SWIPES
        container.on('touchstart', function (event) {
            var x = event.touches[0].pageX;
            current.addClass('moving');
            function animate(event) {
                CSS.translateX(current[0], event.touches[0].pageX - x);
            };
            function stop(event) {
                doc.off('touchmove', animate);
                doc.off('touchend touchcancel', stop);
                move.reset();
            };
            doc.bind('touchmove', animate);
            doc.bind('touchend touchcancel', stop);
        });
        container.on('swipeLeft', move.next);
        container.on('swipeRight', move.prev);

        // BTNS
        btn.prev.on('tap, click', move.prev);
        btn.next.on('tap, click', move.next);
        if (current.is(':first-child')) {
            btn.prev.addClass('disable');
        } else if (current.is(':last-child')) {
            btn.next.addClass('disable');
        }
    };

})(Zepto);