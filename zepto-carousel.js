;(function($) {
    'use strict';

    var defaults = {
        prev: '.prev',
        next: '.next'
    }

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
                    current[0].style['-webkit-transform'] = 'translate3d(0, 0, 0)';
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
                //event.preventDefault();
                current[0].style['-webkit-transform'] = 'translate3d(' + (event.touches[0].pageX - x) + 'px, 0, 0)';
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
    }

})(Zepto);