// Clone nav
	var $subnav = $(".subnav");
	var $header = $("body > header");
	var $offset = '-123px';
	var $fixednav = $(".nav-bar").clone(true,true).removeClass('home').addClass('fixed-nav').prependTo( "body" );
	$fixednav = $fixednav.css({
		opacity : 0,
		top : $offset
	});

	var Webflow = Webflow || [];
	Webflow.push(function () {
		var win = $(window);

		// Configure matchHeight
      	$('.sectors-section .w-row .w-col, .col-matchheight').matchHeight({byRow: true});

		// Configure external links
		$('a[rel="external"]').click( function() {window.open( $(this).attr('href') ); return false;});

		// Set current links in nav to go to top instead
		$(".nav-bar .w--current").each(function(){
			$(this).attr('href', '#top');
		});

		
		// Animate fixed nav
		Webflow.scroll.on(function () {
			var scrolltop = $(win).scrollTop();
			var headerHeight = $header.outerHeight();
			var currentTop = $fixednav.css('top');

			if(scrolltop >= headerHeight && currentTop == $offset){
				$fixednav.animate({
					top: 0
				}, 200).animate({
					opacity: 1
				},100, function() {
					$subnav.fadeIn();
				}).dequeue();
			}else if(scrolltop < headerHeight && currentTop == '0px'){
				$fixednav.animate({
					top: $offset
				}, 200).animate({
					opacity: 0
				},100, function() {
					$subnav.fadeOut();
				}).dequeue();
			}
		});
	});