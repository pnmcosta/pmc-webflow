var Webflow = Webflow || [];
Webflow.push(function () {
    var win = $(window);

    // megaNav
    $('.meganav-col').matchHeight({ byRow: true });
    var megaNav = $('.meganav');
    megaNav.removeClass('open').height(0).css('display', 'block');
    var megaNavContainers = megaNav.children();
    var megaNavTimeout;
    var tram = $.tram;
    var nav = $('.nav-bar');
    var touch = ('ontouchstart' in window);
    var megaNavTransitions = {
        true: 'height ' + (nav.data('duration') || '200') + 'ms ' + (nav.data('easing') || 'ease'),
        false: 'height ' + (nav.data('duration') || '200') + 'ms ' + (nav.data('easing2') || 'ease')
    };
    function getMegaNav(el) {
        el = $(el);
        var id = (el.data('meganav') || '');
        if (id.length == 0)
            return $();
        var container = megaNavContainers.filter('#' + id);
        if (container.length > 0) {
            var triggers = container.data('triggers');
            if ($.inArray(el[0], triggers) === -1) {
                triggers.push(container);
                container.data('triggers', triggers);
            }
        }
        return container;
    };
    function toggleMegaNav(container, type) {
        if (typeof megaNavTimeout != 'undefined')
            clearTimeout(megaNavTimeout);
        var current = megaNavContainers.filter('.current');
        if (current.length == 0) {
            show = true;
            toggleTriggers(container);
            initMegaNavSliders(container);
            $.fn.matchHeight._update();
        } else if ((current[0] == container[0] && type == 'click')
                    || current[0] !== container[0]) {
            show = false;
            megaNav.removeClass('open');
            toggleTriggers(current);
        } else {
            return;
        }
        tram(megaNav)
                .add(megaNavTransitions[show])
                .start({ height: show ? 'auto' : 0 })
                .then(function () {
                    this.set({ height: show ? 'auto' : 0 });
                    if (!show) {
                        if (current[0] !== container[0])
                            toggleMegaNav(container, type);
                    } else {
                        megaNav.addClass('open');
                    }
                });
    };
    function closeMegaNav() {
        megaNavTimeout = setTimeout(function () {
            var current = megaNavContainers.filter('.current');
            if (current.length > 0) {
                megaNav.removeClass('open');
                toggleTriggers(current);

                tram(megaNav)
                    .add(megaNavTransitions[false])
                    .start({ height: 0 })
                    .then(function () {
                        this.set({ height: 0 });
                    });
            }
        }, 300);
    };
    function toggleTriggers(container) {
        container = $(container);
        var current = container.hasClass('current');
        $(container.data('triggers')).each(function () {
            var me = $(this);
            if (me.hasClass('nav-link-icon'))
                me.removeClass('fa-angle-up').removeClass('fa-angle-down')
                    .addClass(!current ? 'fa-angle-up' : 'fa-angle-down');
            else if (me.hasClass('nav-button-icon'))
                me.removeClass('fa-close').removeClass('fa-bars')
                    .addClass(!current ? 'fa-close' : 'fa-bars');
        });
        if(current)
            container.css('display', 'none').removeClass('current');
        else
            container.css('display', 'block').addClass('current');
    };
    function initMegaNav() {
        var current = megaNavContainers.filter('.current');
        if (current.length > 0)
            closeMegaNav();
            
        megaNavContainers.css('display', '');
        megaNavContainers.each(function () {
            var container = $(this);
            if (!container.is(':visible'))
                return true;
            // handle triggers
            var triggers = $('[data-meganav=' + this.id + ']');
            triggers.each(function () {
                var trigger = $(this);
                var type = trigger.data('meganav-type') || 'click';
                trigger.off('mouseenter.meganav');
                trigger.off('mouseleave.meganav');
                trigger.off('tap.meganav');
                if (type == 'hover') {
                    trigger.on('mouseenter.meganav', function (e) {
                        toggleMegaNav(getMegaNav(this), 'hover');
                    });
                    trigger.on('mouseleave.meganav', function (e) {
                        closeMegaNav();
                    });
                } else {
                    trigger.on('mouseenter.meganav', function (e) {
                        if (typeof megaNavTimeout != 'undefined')
                            clearTimeout(megaNavTimeout);
                    });
                }

                trigger.on('tap.meganav', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMegaNav(getMegaNav(this), 'click');
                });
            });
            container.data('triggers', triggers);
        });
        megaNavContainers.css('display', 'none');
    };
    function initMegaNavSliders(container) {
        var container = $(container);
        if (!container.hasClass('current')) return;
        // handle sliders
        var mobile = $(win).width() <= 479;
        var slides = $('.meganav-col.slider .w-slide', container);
        var slidesTriggers = $('.meganav-col.triggers .meganav-link', container).removeClass('current');
        slidesTriggers.each(function (i) {
            var me = $(this);
            var slide = $(slides.eq(i + 1)); // 0 is default slide
            if (slide.length == 0)
                return true;
            // if no links (dead end) don't show
            if ($('a', slide).length == 0) {
                me.data('slide-dot', 0);
                return true;
            }
            me.data('slide-dot', i + 1);
        });
        Webflow.require('slider').redraw();
        var sliderNav = $('.meganav-col.slider .meganav-slider-nav', container);
        var mobileSliderNav = $('.meganav-mobile-slider-nav', container);
        slidesTriggers.removeClass('current');
        slidesTriggers.each(function (i) {
            var trigger = $(this);
            var index = trigger.data('slide-dot') || 0;
            if (index > 0){
                trigger.data('slider-nav', sliderNav);
                if (mobile)
                    trigger.data('mobile-nav', mobileSliderNav);
            }
            trigger.off(mobile ? 'tap.meganav' : 'mouseenter.meganav tap.meganav');
            trigger.on(mobile ? 'tap.meganav' : 'mouseenter.meganav tap.meganav', function (e) {
                if (typeof megaNavTimeout != 'undefined')
                    clearTimeout(megaNavTimeout);
                var me = $(this);
                var sliderNav = me.data('slider-nav') || null;
                var slideDot = me.data('slide-dot') || 0;
                e.preventDefault();
                e.stopPropagation();
                if (typeof sliderNav != 'undefined' && slideDot > 0) {
                    trigger.siblings('.meganav-link').removeClass('current');
                    $(sliderNav.children().eq(slideDot)).trigger('tap');
                    me.addClass('current');
                    var mobileNav = $(this).data('mobile-nav') || null;
                    if (mobileNav != null)
                        $('.w-slider-dot:eq(1)', mobileNav).trigger('tap');
                }else{
                    location.href = me.attr('href');
                }
            });
        });
        $('.w-slider-dot:eq(0)', sliderNav).trigger('tap');
        if (mobile) {
            $('.w-slider-dot:eq(0)', mobileSliderNav).trigger('tap');
            $('.meganav-col.slider .meganav-back', container)
                .data('mobile-nav', mobileSliderNav)
                .off('tap.meganav')
                .on('tap.meganav', function (e) {
                    var mobileNav = $(this).data('mobile-nav') || null;
                    if (mobileNav != null)
                        $('.w-slider-dot:eq(0)', mobileNav).trigger('tap');
                    e.preventDefault();
                });
        }
    };
    megaNav.on('mouseenter', function (e) {
        if (typeof megaNavTimeout != 'undefined')
            clearTimeout(megaNavTimeout);
    });
    megaNav.on('mouseleave', function (e) {
        closeMegaNav();
    });
    var scrollStartPos = 0;
    megaNav.on('touchstart', function (e) {
        if (typeof megaNavTimeout != 'undefined')
            clearTimeout(megaNavTimeout);
        scrollStartPos = this.scrollTop + e.originalEvent.touches[0].pageY;
        e.preventDefault();
    });
    megaNav.on('touchmove', function (e) {
        if (typeof megaNavTimeout != 'undefined')
            clearTimeout(megaNavTimeout);
        this.scrollTop = scrollStartPos - e.originalEvent.touches[0].pageY;
        e.preventDefault();
    });
    megaNav.on('tap', function (e) {
        if (typeof megaNavTimeout != 'undefined')
            clearTimeout(megaNavTimeout);
        e.stopPropagation();
    });
    $('html').on('tap', function (e) {
        closeMegaNav();
    });
    var previousDims = [win.width(), win.height()];
    Webflow.resize.on(function () {
        win = $(window);
        if (previousDims[0] != win.width() || previousDims[1] != win.height()) {
            initMegaNav(); // will close if open
            previousDims = [win.width(), win.height()];
        }
    });
    initMegaNav();
});