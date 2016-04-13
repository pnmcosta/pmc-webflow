
var Webflow = Webflow || [];
Webflow.push(function () {
    var win = $(window);

    // Configure matchHeight
    $('.col-matchheight').matchHeight({byRow: true});

    // Configure external links
    $('a[rel="external"]').click( function() {window.open( $(this).attr('href') ); return false;});

    // Set current links in nav to go to top instead
    $(".nav-bar .w--current").each(function(){
        $(this).attr('href', '#top');
    });
    
    // handle mediaelements by default
    $("video.mejs").each(function(){
        var me = $(this);
        me.mediaelementplayer({
            enableAutosize: true,
            iPadUseNativeControls: false,
            iPhoneUseNativeControls: false,
            AndroidUseNativeControls: false,
            /**/
            pluginPath: '/',
            loop: me.data('loop') == '1' ? true : false,
            success: function (media, node, player) {
                // Controls
                if (me.data('show-controls') == '0') {
                    player.container.find('.mejs-overlay-play, .mejs-controls').remove();
                }

                // Mute
                if (me.data('mute') == '1') {
                    media.setMuted(true);
                }

                // Autoplay
                if (me.data('autoplay') == '1') {
                    media.play();
                }

                if (media.pluginType != 'native') {
                    $(window).resize();
                }
            }
        });
    });
});