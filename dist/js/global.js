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

    var SCROLLBAR_WIDTH = window.innerWidth - window.document.documentElement.clientWidth;

    var KEYBOARD = {
        BACKSPACE: 8, TAB: 9, ENTER: 13, ESCAPE: 27, SPACE: 32,
        LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40
    };

    var $window = $( window ),
        $html   = $( window.document.documentElement ),
        $body   = $( window.document.body );

    //
    // Check if Typekit is loaded
    //

    var typekitTimeout;

    function onTypekitLoaded () {
        console.log( 'Typekit loaded succesfully.' );
    };

    function checkIfTypekitLoaded () {
        if ( window.isTypekitLoaded ) {
            onTypekitLoaded();
        }
        else {
            console.log( 'Waiting for Typekit fonts.' );
            typekitTimeout = window.setTimeout( checkIfTypekitLoaded, 100 );
        }
    }

    typekitTimeout = window.setTimeout( checkIfTypekitLoaded, 100 );

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

    $body.ready( function () {

        //
        // No scroll offset
        //

        $body.append( $( '<style/>' ).attr( 'type', 'text/css' ).text(
            '.noscroll.noscroll-v{padding-right:' + SCROLLBAR_WIDTH + 'px;}' +
            '.noscroll.noscroll-h{padding-bottom:' + SCROLLBAR_WIDTH + 'px;}'
        ) );

        //
        // SlideReveal panels
        //

        ( function () {

            var slideRevealTransitionSpeed = 400,
                $pageScrollFreezable = $( '.page-scroll-freezable' ),
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
                $pageScrollFreezable.addClass( 'noscroll noscroll-v' );
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
                    $pageScrollFreezable.removeClass( 'noscroll noscroll-v' );
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
                    $( '#panel-menu .dropdown' ).find( '.trigger' ).removeClass( 'open' );
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

            var $wdidwSearchBar = $( '.wdidw-search-bar' ),
                $wdidwSearchField = $( '#wdidw-search-field' ),
                $wdidwSearchResultsList = $( '#wdidw-search-results-list' ),
                $wdidwSearchResultsListLinks;

            //
            // Show and hide
            //

            $( '.wdidw-show' ).on( 'click', function () {
                $wdidwSearchBar.addClass( 'active' );
            } );

            $( '.wdidw-hide' ).on( 'click', function () {
                $wdidwSearchBar.removeClass( 'active' );
            } );

            //
            // Letter typing animation
            //

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
            // Autocomplete suggestions list
            //

            function getResultsLinks () {
                return $wdidwSearchResultsList.find( '> li > a' );
            }

            $wdidwSearchField.on( 'keydown', function ( e ) {
                var $this = $( this );
                if ( $this.val() && $wdidwSearchResultsList.children().length ) {
                    $wdidwSearchResultsList.addClass( 'active' );
                }
                else {
                    $wdidwSearchResultsList.removeClass( 'active' );
                }
                if ( e.which === KEYBOARD.UP || e.which === KEYBOARD.DOWN ) {
                    e.preventDefault();
                    if ( e.which === KEYBOARD.DOWN ) {
                        getResultsLinks().eq( 0 ).focus();
                    }
                }
            } );

            getResultsLinks().on( 'keydown', function ( e ) {
                var $this = $( this ),
                    $li = $this.parent();
                if ( e.which === KEYBOARD.UP || e.which === KEYBOARD.DOWN ) {
                    e.preventDefault();
                    if ( e.which === KEYBOARD.UP ) {
                        if ( $li.prev().length ) {
                            $li.prev().find( '> a' ).focus();
                        }
                        else {
                            $wdidwSearchField.focus();
                        }
                    }
                    else {
                        $li.next().find( '> a' ).focus();
                    }
                }
            } );

        } )();

        //
        // Header sticky
        //

        ( function () {

            var $pageHeader = $( '.page-header' ),
                $pageHeaderParent = $pageHeader.parent(),
                $pageHeaderUpper = $pageHeader.find( '.page-header-upper' ),
                scrollTopBefore = $window.scrollTop(),
                needsUpdateOffset = true;

            function setTopOffset () {
                var pageHeaderOffset = $pageHeader.height();
                if ( !$pageHeaderUpper.is( ':visible' ) ) {
                    pageHeaderOffset += $pageHeaderUpper.height();
                }
                $pageHeaderParent.css( 'padding-top', pageHeaderOffset );
                needsUpdateOffset = false;
            }

            setTopOffset();

            $pageHeader.addClass( 'header-sticky' );

            $window.on( 'scroll', function () {

                var scrollTopAfter = $window.scrollTop(),
                    headerTop = $pageHeader.offset().top,
                    pageHeaderHeight = $pageHeader.height(),
                    isScrollTopAboveHeaderBottom = headerTop + pageHeaderHeight > scrollTopAfter,
                    isScrollTopAboveHeaderTop = headerTop >= scrollTopAfter;

                if ( scrollTopAfter > pageHeaderHeight ) {
                    $pageHeader.addClass( 'header-sticky-detached' );
                }
                else {
                    $pageHeader.removeClass( 'header-sticky-detached' );
                    if ( needsUpdateOffset ) {
                        setTopOffset();
                    }
                }

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
                setTopOffset();
                needsUpdateOffset = true;
            } );

        } )();

        //
        // Mega menu + Sub menus
        //

        ( function () {

            function expand ( e ) {
                var $this        = $( this ),
                    $current     = $this.next(),
                    $grandparent = $this.parent().parent();
                $grandparent.find( 'li > a.trigger' ).not( $this ).removeClass( 'open' );
                $this.addClass( 'open' );
                $grandparent.find( '.sub-menu:visible' ).not( $current ).hide();
                $current.show();
                e.preventDefault();
                e.stopPropagation();
            }

            function collapse ( e ) {
                var $this        = $( this ),
                    $grandparent = $this.parent().parent();
                $grandparent.find( 'li > a.trigger' ).removeClass( 'open' );
                // $grandparent.find( '.sub-menu' ).hide();
            }

            $( '.mega-menu .dropdown-menu a.trigger' )
                .on( 'mouseover', expand )
                .on( 'focus', expand );

            $( '.mega-menu .dropdown-menu a:not(.trigger)' )
                .on( 'mouseover', collapse )
                .on( 'focus', collapse );

        } )();

        //
        // Desktop mega menu
        //

        ( function () {

            var $mainMenu = $( '.mega-menu' ),
                onExit    = null;

            function getSubMenu ( $elem ) {
                var subMenuKey = $elem.data( 'dropdown-controls' );
                return $( '[data-dropdown="' + subMenuKey + '"]' );
            }

            function openMenu ( $subMenu ) {
                $mainMenu.addClass( 'open' );
                $subMenu.addClass( 'open' );
            }

            function closeMenu ( $subMenu ) {
                $mainMenu.removeClass( 'open' );
                $subMenu.removeClass( 'open' );
                $subMenu.find( '.sub-menu:not(.first)' ).hide();
                $subMenu.find( 'li > a.trigger' ).removeClass( 'open' );
            }

            function enter ( $elem ) {
                var $subMenu = getSubMenu( $elem );
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

            function exit ( $elem ) {
                var $subMenu = getSubMenu( $elem );
                onExit = closeMenu;
                window.setTimeout( function () {
                    if ( typeof onExit === 'function' ) {
                        onExit( $subMenu );
                    }
                }, 0 );
            }

            function init () {

                $( '.navbar-primary li a' )
                    .hover(
                        function () { enter( $( this ) ); },
                        function () { exit( $( this ) ); }
                    )
                    .focus(
                        function () { openMenu( getSubMenu( $( this ) ) ); }
                    )
                    .blur(
                        function () { closeMenu( getSubMenu( $( this ) ) ); }
                    );

                $mainMenu
                    .find( 'a' )
                    .focus( function () {
                        onExit = null;
                        openMenu( $( this ).closest( '.main-menu-dropdown' ) );
                    } )
                    .blur( function () {
                        closeMenu( $( this ).closest( '.main-menu-dropdown' ) );
                    } );
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
            if ( $this.hasClass( 'open' ) ) {
                $this.removeClass( 'open' );
                if ( $this.parent().hasClass( 'dropdown' ) ) {
                    $grandparent = $this.parent();
                }
                $grandparent.find( 'li > a.trigger' ).removeClass( 'open' );
                $grandparent.find( '.sub-menu:visible' ).not( $current ).slideUp( 400 );
                $current.slideUp( 400 );
            }
            else {
                $this.addClass( 'open' );
                $current.slideDown( 400 );
            }
            e.preventDefault()
            e.stopPropagation();
        });

        $( '.dropdown-menu > li > a:not(.trigger)' ).on( 'click', function () {
            var $root = $( this ).closest( '.dropdown' );
            $( '.trigger' ).removeClass( 'open' );
            $root.find( '.sub-menu:not(.first)' ).slideUp( 400 );
        });

        var closeMobileDropdown = function () {
            $( '#panel-menu .dropdown' ).find( '.trigger' ).removeClass( 'open' );
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

            var slideShowLength = 3,
                slideShowInterval = 8000,
                slideShowTimeout = null,
                swapTimeout = null,
                flipTimeout = null,
                isSwapping = false,
                currentSlide;

            function start () {
                slideShowTimeout = window.setTimeout( next, slideShowInterval );
            }

            function stop () { window.clearTimeout( slideShowTimeout ); }

            function next () {
                var nextSlide = currentSlide + 1;
                if ( nextSlide >= slideShowLength ) { nextSlide = 0; }
                flipTo( $itemCatSelectorOpts.eq( nextSlide ) );
                start();
            }

            function flipTo ( $elem ) {

                var itemKey = $elem.data( 'item-key' ),
                    $itemBasicsCat = $itemBasics.find( '.item-basics-cat[data-item-cat="' + itemKey + '"]' );

                if ( currentSlide === $itemBasicsCat.index() && !isSwapping ) {
                    return;
                }

                isSwapping = true;

                // flip
                $itemCoins
                    .addClass( 'item-coin-flip' );

                window.clearTimeout( swapTimeout );
                window.clearTimeout( flipTimeout );

                swapTimeout = window.setTimeout( function () {

                    // swap button states
                    $itemCatSelectorOpts
                        .removeClass( 'active' )
                        .attr( 'aria-selected', 'false' )
                        .attr( 'tabindex', '0' );
                    $elem
                        .addClass( 'active' )
                        .attr( 'aria-selected', 'true' )
                        .attr( 'tabindex', '0' );

                    // swap slides
                    $itemBasicsCats
                        .removeClass( 'active' )
                        .attr( 'aria-hidden', 'true' );
                    $itemBasicsCat
                        .addClass( 'active' )
                        .attr( 'aria-hidden', 'false' );

                    isSwapping = false;

                    // unflip
                    flipTimeout = window.setTimeout( function () {
                        $itemCoins.removeClass( 'item-coin-flip' );
                        currentSlide = $itemBasicsCat.index();
                    }, flipInterval );

                }, flipDelay );
            }

            // Add ARIA roles
            $itemBasicsCats.attr( 'role', 'tabpanel' );
            $itemCatSelectors.attr( 'role', 'tablist' );
            $itemCatSelectorOpts.attr( 'role', 'tab' );

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
                    var $this = $( this );
                    $itemCatSelectorOpts
                        .removeClass( 'active' )
                        .attr( 'aria-selected', 'false' )
                        .attr( 'tabindex', '0' );
                    $this
                        .addClass( 'active' )
                        .attr( 'aria-selected', 'true' )
                        .attr( 'tabindex', '0' );
                    flipTo( $this );
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

            start();

        } )();

        //
        // Responsive images
        //

        ( function () {

            var BREAKPOINTS = {
                    brk400: 400,
                    brk800: 800,
                    brk1200: 1200
                };

            $( '.responsive-image.img-tile' ).responsImg( {
                elementQuery: true,
                breakpoints: BREAKPOINTS
            } );

            $( '.responsive-image.img-event' ).responsImg( {
                elementQuery: false,
                breakpoints: BREAKPOINTS
            } );

            $( '.responsive-image.img-banner' ).responsImg( {
                elementQuery: false,
                breakpoints: BREAKPOINTS
            } );

        } )();

    } );

} )( window, jQuery );
