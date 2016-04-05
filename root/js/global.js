/*
 * Cuyahoga County Solid Waste District
 * CuyahogaRecycles.org
 *
 * Global JS
 */

;( function ( window, $ ) {

    //
    // Init
    //

    $( window.document.body ).ready( function () {

        //
        // SlidePanel
        //

        var panelMenu,
            panelMenuBtn;

        var sliderPanelMenu = $( '#panel-menu' ).slideReveal( {
            width: 300,
            position: 'right',
            speed: 300,
            trigger: $( '.action-open-menu' ),
            push: true,
            overlay: true,
            hidden: function ( slider, trigger ) {
                // Close Sub Menu's when menu is hidden
                $( '#panel-menu .dropdown' ).find( '.trigger' ).removeClass( 'selected' );
                $( '#panel-menu .dropdown' ).find( '.sub-menu' ).hide();
                },
            hide: function ( slider, trigger ) {
                $( '#panel-community' ).slideReveal( 'hide' );
            }
        } );

        if ( window.innerWidth > 767 ) {
            var sliderPanelCommunity = $( '#panel-community' ).slideReveal( {
                width: 300,
                position: 'right',
                speed: 300,
                trigger: $( '.action-open-community' ),
                push: true,
                overlay: true
            } );
        }
        else {
            var sliderPanelMenu = $( '#panel-community' ).slideReveal( {
                width: 300,
                position: 'right',
                speed: 300,
                trigger: $( '.action-open-community' ),
                push: false,
                overlay: false
            } );
        }

        // Remove extra overlays
        while ( $( '.slide-reveal-overlay' ).length > 1 ) {
            $( '.slide-reveal-overlay' ).eq( 0 ).remove();
        }

        //
        // What Do I Do With?
        //

        $( '.wdidw-show' ).on( 'click', function () {
            $( '.wdidw-search-bar' ).addClass( 'active' );
        } );

        $( '.wdidw-hide' ).on( 'click', function () {
            $( '.wdidw-search-bar' ).removeClass( 'active' );
        } );

        // Letter typing animation
        $( '.wdidw-animated-term' ).typed( {
            backDelay: 800,
            backSpeed: 50,
            loop: true,
            showCursor: false,
            startDelay: 800,
            strings: [
                'Cans',
                'Cartons',
                'Glass',
                'Paper',
                'Plastic'
            ],
            typeSpeed: 100
        } );

        //
        // Mega menu + Sub menus
        //

        $( '.mega-menu .dropdown-menu a.trigger' ).on( 'click' , function ( e ) {
            var current = $( this ).next();
            var grandparent = $( this ).parent().parent();
            if ( $( this ).hasClass( 'selected' ) ) {
                $( this ).removeClass( 'selected' );
                grandparent.find( 'li > a.trigger' ).removeClass( 'selected' );
            }
            else {
                grandparent.find( 'li > a.trigger' ).removeClass( 'selected' );
                $( this ).addClass( 'selected' );
            }
            grandparent.find( '.sub-menu:visible' ).not( current ).hide();
            current.toggle();
            e.preventDefault()
            e.stopPropagation();
        } );

        $( '.mega-menu .dropdown-menu > li > a:not(.trigger)' ).on( 'click', function () {
            var root = $( this ).closest( '.dropdown' );
            $( '.trigger' ).removeClass( 'selected' );
            root.find( '.sub-menu:not(.first)' ).hide();
        });

        //
        // New mega menu (hover)
        //

        var $mainMenu = $( '.mega-menu' ),
            submenuEnterSpeed = 400,
            submenuExitSpeed  = submenuEnterSpeed / 2;

        var megaMenu = {
            init: function () {
                var that = this;
                $( '.navbar-primary li a' ).hover(
                    function () { that.enter( this ); },
                    function () { that.exit( this ); }
                );
            },
            menu: $mainMenu,
            currentItem: null,
            nextItem: null,
            enter: function ( elem ) {
                var $elem = $( elem ),
                    subMenuKey = $elem.data( 'dropdown-controls' ),
                    $subMenu = $( '[data-dropdown="' + subMenuKey + '"]' );
                $elem.parent().addClass( 'selected' );
                $mainMenu.addClass( 'open' );
                $subMenu.addClass( 'open' );
                $subMenu.hover(
                    function () {
                        var $this = $( this );
                        $this.addClass( 'open' );
                        $mainMenu.addClass( 'open' );
                    },
                    function () {
                        var $this = $( this );
                        $this.removeClass( 'open' );
                        $mainMenu.removeClass( 'open' );
                        $this.find( '.sub-menu:not(.first)' ).hide();
                        $this.find( 'li > a.trigger' ).removeClass( 'selected' );
                    }
                );
            },
            exit: function ( elem ) {
                var $elem = $( elem ),
                    subMenuKey = $elem.data( 'dropdown-controls' ),
                    $subMenu = $( '[data-dropdown="' + subMenuKey + '"]' );
                $elem.parent().removeClass( 'selected' );
                $mainMenu.removeClass( 'open' );
                $subMenu.removeClass( 'open' );
                $subMenu.find( '.sub-menu:not(.first)' ).hide();
                $subMenu.find( 'li > a.trigger' ).removeClass( 'selected' );
            }
        };

        megaMenu.init();

        //
        // Mobile menu + Sub menus
        //

        $("#panel-menu .dropdown a.trigger").on("click",function(e){
            var current = $(this).next();
            var grandparent = $(this).parent().parent();

            if($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                if($(this).parent().hasClass('dropdown')) {
                  grandparent = $(this).parent();
                }
                grandparent.find('li > a.trigger').removeClass('selected');
                grandparent.find(".sub-menu:visible").not(current).slideUp(400);
                current.slideUp(400);
            }
            else {
                $(this).addClass('selected');
                current.slideDown(400);
            }

            e.preventDefault()
            e.stopPropagation();
        });
        $(".dropdown-menu > li > a:not(.trigger)").on("click",function(){
            var root=$(this).closest('.dropdown');
            $('.trigger').removeClass('selected');
            root.find('.sub-menu:not(.first)').slideUp(400);
        });

        var closeMobileDropdown = function() {
            $("#panel-menu .dropdown").find('.trigger').removeClass('selected');
            $("#panel-menu .dropdown").find('.sub-menu').hide();
        };

        //
        // Header search
        //

        $( '.search-container label' ).on( 'click', function ( e ) {
            $( '.sb-search' ).addClass( 'sb-search-open' );
            $( '.sb-search-input' ).focus();
            e.preventDefault()
            e.stopPropagation();
        });

        // Site Search
        new UISearch( document.getElementById( 'sb-search' ) );

        //
        // Item basics
        //

        $( '.item-basics' ).each( function ( i, elem ) {

            var $elem = $( elem );

            // Add roles to sections
            $elem
                .find( '.item-basics-cat' )
                .attr( 'role', 'tabpanel' );

            // Add roles to list
            $elem
                .find( '.item-cat-selector' )
                .attr( 'role', 'tablist' );

            // Add click events to links
            $elem
                .find( '.item-cat-selector-opt' )
                .attr( 'role', 'tab' )
                .each( function () {
                    var $this = $( this );
                    $this.attr(
                        'aria-controls',
                        $this.attr( 'href' ).substring( 1 )
                    );
                } )
                .on( 'click', function () {
                    var $this = $( this ),
                        itemKey = $this.data( 'item-key' );
                    $elem
                        .find( '.item-cat-selector-opt' )
                        .removeClass( 'active' )
                        .attr( 'aria-selected', 'false' )
                        .attr( 'tabindex', '0' );
                    $elem
                        .find( '.item-basics-cat' )
                        .removeClass( 'active' )
                        .attr( 'aria-hidden', 'true' );
                    $( this )
                        .addClass( 'active' )
                        .attr( 'aria-selected', 'true' )
                        .attr( 'tabindex', '0' );
                    $elem
                        .find(
                            '.item-basics-cat[data-item-cat="' + itemKey + '"]'
                        )
                        .addClass( 'active' )
                        .attr( 'aria-hidden', 'false' );
                } );

            // Select first tab by default
            $elem
                .find( '.item-cat-selector-opt' ).eq( 0 )
                .trigger( 'click' );

        } );

        //
        // Responsive images
        //

        $( '.responsive-image.img-tile' ).responsImg( {
            elementQuery: true,
            breakpoints: {
                brk400: 400,
                brk800: 800
            }
        } );

        $( '.responsive-image.img-event' ).responsImg( {
            elementQuery: false,
            breakpoints: {
                brk400: 400,
                brk800: 800,
                brk1200: 1200
            }
        } );

    } );

} )( window, jQuery );

//
// Custom YouTube Play functionality
//

;( function () {

    var player;

    function onYouTubePlayerAPIReady () {
      // create the global player from the specific iframe (#youtube-video)
      player = new YT.Player( 'youtube-video', {
        events: { onReady: onPlayerReady }
      } );
    }

    function onPlayerReady ( e ) { // bind events
      $( '.youtube-video-play-button' ).on( 'click', function () {
        player.playVideo();
        $( this ).addClass( 'video-playing' );
      } );
    }

    window.onYouTubePlayerAPIReady = onYouTubePlayerAPIReady;

} )();
