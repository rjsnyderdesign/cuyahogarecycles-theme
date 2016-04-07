/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2016 [object Object]
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
  }
}(jQuery);

/*
 * Cuyahoga County Solid Waste District
 * CuyahogaRecycles.org
 *
 * Global JS
 */

;( function ( window, $, undefined ) {

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

    //
    // Init
    //

    var $window = $( window ),
        $body   = $( window.document.body );

    $body.ready( function () {

        //
        // SlideReveal panels
        //

        ( function () {

            var slideRevealTransitionSpeed = 400,
                $panelMenu = $( '#panel-menu' ),
                $panelCommunity = $( '#panel-community' ),
                $slideRevealShroud = $( '<div/>' ).addClass( 'slidereveal-shroud' ),
                openedPanels = [],
                windowSizeBefore = window.innerWidth;

            function pushShroud ( $slider, $trigger ) {
                if ( $slider ) {
                    $slideRevealShroud.css(
                        'z-index',
                        $slider.css( 'z-index' ) - 1
                    );
                }
            }

            function onShow ( $slider, $trigger ) {
                $body.addClass( 'noscroll' );
                $slideRevealShroud.addClass( 'active' );
                pushShroud( $slider, $trigger );
                $slider.addClass( 'active' );
            }

            function onShown ( $slider, $trigger ) {
                openedPanels.push( $slider );
            }

            function onHide ( $slider, $trigger ) {
                if ( openedPanels.length === 1 ) {
                    $slideRevealShroud.removeClass( 'active' );
                }
                pushShroud( openedPanels[ openedPanels.length - 2 ], $trigger );
            }

            function onHidden ( $slider, $trigger ) {
                $slider.removeClass( 'active' );
                openedPanels.splice( $.inArray( $slider, openedPanels ), 1 );
                if ( openedPanels.length === 0 ) {
                    $body.removeClass( 'noscroll' );
                }
            }

            $panelMenu.slideReveal( {
                width: 320,
                position: 'right',
                speed: slideRevealTransitionSpeed,
                trigger: $( '.action-open-menu' ),
                push: false,
                overlay: false,
                show: onShow,
                shown: onShown,
                hide: onHide,
                hidden: function ( $slider, $trigger ) {
                    // Close Sub Menu's when menu is hidden
                    $( '#panel-menu .dropdown' ).find( '.trigger' ).removeClass( 'selected' );
                    $( '#panel-menu .dropdown' ).find( '.sub-menu' ).hide();
                    onHidden( $slider, $trigger );
                }
            } );

            $panelCommunity.slideReveal( {
                width: 300,
                position: 'right',
                speed: slideRevealTransitionSpeed,
                trigger: $( '.action-open-community' ),
                push: false,
                overlay: false,
                show: onShow,
                shown: onShown,
                hide: onHide,
                hidden: onHidden
            } );

            // Close panel
            $( '.slidereveal-panel' )
                .find( '.btn-panel-close' )
                .on( 'click', function () {
                    $( this ).parents( '.slidereveal-panel' ).slideReveal( 'hide' );
                } );

            // Add custom overlay
            $body.append( $slideRevealShroud );
            $slideRevealShroud.on( 'click', function ( e ) {
                var $panel = openedPanels[ openedPanels.length - 1 ];
                if ( $panel ) {
                    $panel.slideReveal( 'hide' );
                }
            } );

            // Window resize event
            $window.on( 'resize', function () {
                var windowSizeAfter = window.innerWidth;
                if ( windowSizeBefore < 768 && windowSizeAfter >= 768 ) {
                    $panelMenu.slideReveal( 'hide' );
                }
                windowSizeBefore = windowSizeAfter;
            } );

        } )();

        //
        // What Do I Do With?
        //

        ( function () {

            var $wdidwSearchBar = $( '.wdidw-search-bar' );

            $( '.wdidw-show' ).on( 'click', function () {
                $wdidwSearchBar.addClass( 'active' );
            } );

            $( '.wdidw-hide' ).on( 'click', function () {
                $wdidwSearchBar.removeClass( 'active' );
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

        } )();

        //
        // Header sticky
        //

        ( function () {

            var $pageHeader = $( '.page-header' ),
                $pageHeaderParent = $pageHeader.parent(),
                pageHeaderHeight = $pageHeader.height(),
                scrollTopBefore = $window.scrollTop();

            $pageHeader.addClass( 'header-sticky' );
            $pageHeaderParent.css( 'padding-top', pageHeaderHeight );

            $window.on( 'scroll', function () {

                var scrollTopAfter = $window.scrollTop(),
                    headerTop = $pageHeader.offset().top,
                    isScrollTopAboveHeaderBottom = headerTop + pageHeaderHeight > scrollTopAfter,
                    isScrollTopAboveHeaderTop = headerTop >= scrollTopAfter;

                if ( scrollTopAfter < scrollTopBefore ) { // on scroll up
                    if ( isScrollTopAboveHeaderBottom ) {
                        if ( isScrollTopAboveHeaderTop ) {
                            $pageHeader.addClass( 'header-sticky-fixed' );
                            $pageHeader.css( 'top', '' );
                        }
                    }
                    else {
                        $pageHeader.removeClass( 'header-sticky-fixed' );
                        $pageHeader.css( 'top', scrollTopAfter - pageHeaderHeight );
                    }

                }
                else {  // on scroll down
                    if ( isScrollTopAboveHeaderBottom ) {
                        if ( $pageHeader.hasClass( 'header-sticky-fixed' ) ) {
                            $pageHeader.removeClass( 'header-sticky-fixed' );
                            $pageHeader.css( 'top', scrollTopAfter );
                        }
                    }
                }

                scrollTopBefore = scrollTopAfter;

            } );

            $window.on( 'resize', function () {
                pageHeaderHeight = $pageHeader.height();
                $pageHeaderParent.css( 'padding-top', pageHeaderHeight );
            } );

        } )();

        //
        // Mega menu + Sub menus
        //

        $( '.mega-menu .dropdown-menu a.trigger' ).on( 'click' , function ( e ) {
            var $this        = $( this ),
                $current     = $this.next(),
                $grandparent = $this.parent().parent();
            if ( $this.hasClass( 'selected' ) ) {
                $this.removeClass( 'selected' );
                $grandparent.find( 'li > a.trigger' ).removeClass( 'selected' );
            }
            else {
                $grandparent.find( 'li > a.trigger' ).removeClass( 'selected' );
                $this.addClass( 'selected' );
            }
            $grandparent.find( '.sub-menu:visible' ).not( $current ).hide();
            $current.toggle();
            e.preventDefault()
            e.stopPropagation();
        } );

        $( '.mega-menu .dropdown-menu > li > a:not(.trigger)' ).on( 'click', function () {
            var $root = $( this ).closest( '.dropdown' );
            $( '.trigger' ).removeClass( 'selected' );
            $root.find( '.sub-menu:not(.first)' ).hide();
        });

        //
        // Desktop mega menu
        //

        ( function () {

            var $mainMenu = $( '.mega-menu' ),
                onExit    = null;

            function openMenu ( $subMenu ) {
                $mainMenu.addClass( 'open' );
                $subMenu.addClass( 'open' );
            }

            function closeMenu ( $subMenu ) {
                $mainMenu.removeClass( 'open' );
                $subMenu.removeClass( 'open' );
                $subMenu.find( '.sub-menu:not(.first)' ).hide();
                $subMenu.find( 'li > a.trigger' ).removeClass( 'selected' );
            }

            function enter ( elem ) {
                var $elem = $( elem ),
                    subMenuKey = $elem.data( 'dropdown-controls' ),
                    $subMenu = $( '[data-dropdown="' + subMenuKey + '"]' );
                $elem.parent().addClass( 'selected' );
                openMenu( $subMenu );
                $subMenu.hover(
                    function () {
                        // Ensures smooth transition when moving from link
                        // to submenu
                        onExit = null;
                        openMenu( $( this ) );
                    },
                    function () {
                        closeMenu( $( this ) );
                    }
                );
            }

            function exit ( elem ) {
                var $elem = $( elem ),
                    subMenuKey = $elem.data( 'dropdown-controls' ),
                    $subMenu = $( '[data-dropdown="' + subMenuKey + '"]' );
                $elem.parent().removeClass( 'selected' );
                onExit = closeMenu;
                window.setTimeout( function () {
                    if ( typeof onExit === 'function' ) {
                        onExit( $subMenu );
                    }
                }, 0 );
            }

            function init () {
                $( '.navbar-primary li a' ).hover(
                    function () { enter( this ); },
                    function () { exit( this ); }
                );
            }

            init();

        } )();

        //
        // Mobile menu
        //

        $( '#panel-menu .dropdown a.trigger' ).on( 'click', function ( e ) {
            var $this        = $( this ),
                $current     = $this.next(),
                $grandparent = $this.parent().parent();
            if ( $this.hasClass( 'selected' ) ) {
                $this.removeClass( 'selected' );
                if ( $this.parent().hasClass( 'dropdown' ) ) {
                    $grandparent = $this.parent();
                }
                $grandparent.find( 'li > a.trigger' ).removeClass( 'selected' );
                $grandparent.find( '.sub-menu:visible' ).not( $current ).slideUp( 400 );
                $current.slideUp( 400 );
            }
            else {
                $this.addClass( 'selected' );
                $current.slideDown( 400 );
            }
            e.preventDefault()
            e.stopPropagation();
        });

        $( '.dropdown-menu > li > a:not(.trigger)' ).on( 'click', function () {
            var $root = $( this ).closest( '.dropdown' );
            $( '.trigger' ).removeClass( 'selected' );
            $root.find( '.sub-menu:not(.first)' ).slideUp( 400 );
        });

        var closeMobileDropdown = function () {
            $( '#panel-menu .dropdown' ).find( '.trigger' ).removeClass( 'selected' );
            $( '#panel-menu .dropdown' ).find( '.sub-menu' ).hide();
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
        new UISearch( window.document.getElementById( 'sb-search' ) );

        //
        // Item basics
        //

        ( function () {

            //
            // Slideshow select funcitonality
            //

            var $itemBasics = $( '.item-basics' ),
                $itemBasicsCats = $itemBasics.find( '.item-basics-cat' ),
                $itemCatSelectors = $itemBasics.find( '.item-cat-selector' ),
                $itemCatSelectorOpts = $itemBasics.find( '.item-cat-selector-opt' ),
                $itemFigures = $itemBasics.find( '.item-figure' ),
                $itemCoins = $itemFigures.addClass( 'item-coin' );

            var flipInterval = 100,
                flipDelay = flipInterval * 5;

            // Add ARIA roles
            $itemBasicsCats.attr( 'role', 'tabpanel' );
            $itemCatSelectors.attr( 'role', 'tablist' );
            $itemCatSelectorOpts.attr( 'role', 'tab' );

            function flipNext ( $elem ) {

                var itemKey = $elem.data( 'item-key' ),
                    $itemBasicsCat = $itemBasics.find( '.item-basics-cat[data-item-cat="' + itemKey + '"]' );

                // flip
                $itemCoins
                    .addClass( 'item-coin-flip' );

                window.setTimeout( function () {

                    // hide
                    $itemCatSelectorOpts
                        .removeClass( 'active' )
                        .attr( 'aria-selected', 'false' )
                        .attr( 'tabindex', '0' );
                    $itemBasicsCats
                        .removeClass( 'active' )
                        .attr( 'aria-hidden', 'true' );

                    // show
                    $elem
                        .addClass( 'active' )
                        .attr( 'aria-selected', 'true' )
                        .attr( 'tabindex', '0' );
                    $itemBasicsCat
                        .addClass( 'active' )
                        .attr( 'aria-hidden', 'false' );

                    // unflip
                    window.setTimeout( function () {
                        $itemCoins.removeClass( 'item-coin-flip' );
                    }, flipInterval );

                }, flipDelay );
            }

            // Add events to links
            $itemCatSelectorOpts
                .each( function () {
                    var $this = $( this );
                    $this.attr(
                        'aria-controls',
                        $this.attr( 'href' ).substring( 1 )
                    );
                } )
                .on( 'click', function ( e ) {
                    flipNext( $( this ) );
                    stop();
                    e.preventDefault();
                } )
                .on( 'blur', function ( e ) {
                    start();
                } );

            // Select first tab by default
            $itemCatSelectorOpts.eq( 0 ).trigger( 'click' );

            //
            // Automatic slideshow
            //

            var currentSlide = 0,
                slideShowLength = 3,
                slideShowInteval = 5000,
                slideShowTimeout = null;

            function start () {
                slideShowTimeout = window.setTimeout( next, slideShowInteval );
            }

            function stop () { window.clearTimeout( slideShowTimeout ); }

            function next () {
                currentSlide += 1;
                if ( currentSlide >= slideShowLength ) { currentSlide = 0; }
                flipNext( $itemCatSelectorOpts.eq( currentSlide ) );
                start();
            }

            start();

        } )();

        //
        // Item coin flip animations
        //

        1;

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

        $( '.responsive-image.img-banner' ).responsImg( {
            elementQuery: false,
            breakpoints: {
                brk400: 400,
                brk800: 800,
                brk1200: 1200
            }
        } );

    } );

} )( window, jQuery );
