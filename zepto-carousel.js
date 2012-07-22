;(function($){
    'use strict';

    var defaults = {
        prev: '.prev',
        next: '.next'
    }

    $.fn.carousel = function(opts) {
        var settings = $.extend({}, defaults, opts),
            container = $(this),
            current = container.find('.to-current'),
            btn = { prev: $(settings.prev), next: $(settings.next) },
            doc = $(document),
            move;

        if (!current.length) {
            current = container.children().first().addClass('to-current');
        }

        move = {
            reset: function() {
                current.removeClass('moving');
                current[0].style.left = 0;
            },
            next: function() {
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
            prev: function() {
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
        container.on('touchstart', function(event) {
            var x = event.touches[0].pageX;
            current.addClass('moving');
            function fn(event) {
                event.preventDefault();
                current[0].style.left = (event.touches[0].pageX - x) + 'px';
            };
            doc.bind('touchmove', fn).one('touchend', function() {
                doc.off('touchmove', fn);
                move.reset();
            });
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