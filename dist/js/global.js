/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2017 [object Object]
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

    var MQ_xs = 480,
        MQ_sm = 768,
        MQ_md = 992,
        MQ_lg = 1200;

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
        $window.trigger( 'resize' );
        $window.trigger( 'scroll' );
    };

    function checkIfTypekitLoaded () {
        if ( window.isTypekitLoaded ) {
            console.log( 'Typekit fonts loaded successfully.' );
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
            '.noscroll.noscroll-h{padding-bottom:' + SCROLLBAR_WIDTH + 'px;}' +
            '.slidereveal-shroud{border-right-width:' + SCROLLBAR_WIDTH + 'px;}'
        ) );

        //
        // Focusable targets
        //

        var $pageFirst = $( '<a/>' ),
            $pageLast = $( '<a/>' );
        $pageFirst.attr( { 'tabindex': '-1', 'href': '#' } ).hide();
        $pageLast.attr( { 'tabindex': '-1', 'href': '#' } ).hide();
        $body.prepend( $pageFirst );
        $body.append( $pageLast );

        //
        // SlideReveal panels
        //

        ( function () {

            var slideRevealTransitionSpeed = 400,
                $pageScrollFreezable = $( '.page-scroll-freezable' ),
                $panelMenu = $( '#panel-menu' ),
                $panelCommunity = $( '#panel-community' ),
                $panelItemFilter = $( '#panel-item-filter' ),
                $itemFilterMenuDk = $( '#item-filter-menu-dk' ),
                $itemFilterMenuMb = $( '#item-filter-menu-mb' ),
                $itemFilterMenu   = $( '#item-filter-menu' ),
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
                openedPanels.push( $slider );
            }

            function onShown ( $slider, $trigger ) {
                $slider.find( 'a, input' ).attr( 'tabindex', '0' );
            }

            function onHide ( $slider, $trigger ) {
                if ( openedPanels.length === 1 ) {
                    $slideRevealShroud.removeClass( 'active' );
                }
                pushShroud( openedPanels[ openedPanels.length - 2 ], $trigger );
                $slider.removeClass( 'active' );
                openedPanels.splice( $.inArray( $slider, openedPanels ), 1 );
            }

            function onHidden ( $slider, $trigger ) {
                if ( openedPanels.length === 0 ) {
                    $pageScrollFreezable.removeClass( 'noscroll noscroll-v' );
                }
                $slider.find( 'a, input' ).attr( 'tabindex', '-1' );
                $pageFirst.focus().blur();
            }

            if ( $panelMenu ) {
                $panelMenu.slideReveal( {
                    width: 320,
                    position: 'right',
                    speed: slideRevealTransitionSpeed,
                    trigger: $( '[data-action="panel-menu-open"]' ),
                    push: false,
                    overlay: false,
                    show: onShow,
                    shown: onShown,
                    hide: onHide,
                    hidden: function ( $slider, $trigger ) {
                        // Close Sub Menu's when menu is hidden
                        $( '#panel-menu .dropdown' ).find( '[data-action="sub-menu-toggle"]' ).removeClass( 'open' );
                        $( '#panel-menu .dropdown' ).find( '.sub-menu' ).hide();
                        onHidden( $slider, $trigger );
                    }
                } );
                $panelMenu.css( 'right', -320 );
            }

            if ( $panelCommunity ) {
                $panelCommunity.slideReveal( {
                    width: 300,
                    position: 'right',
                    speed: slideRevealTransitionSpeed,
                    trigger: $( '[data-action="panel-community-open"]' ),
                    push: false,
                    overlay: false,
                    show: onShow,
                    shown: onShown,
                    hide: onHide,
                    hidden: onHidden
                } );
                $panelCommunity.css( 'right', -300 );
            }

            if ( $panelItemFilter ) {
                $panelItemFilter.slideReveal( {
                    width: 320,
                    position: 'left',
                    speed: slideRevealTransitionSpeed,
                    trigger: $( '[data-action="panel-item-filter-open"]' ),
                    push: false,
                    overlay: false,
                    show: function ( $slider, $trigger ) {
                        onShow( $slider, $trigger );
                        $itemFilterMenuMb.append( $itemFilterMenu );
                    },
                    shown: onShown,
                    hide: onHide,
                    hidden: onHidden
                } );
                $panelItemFilter.css( 'left', -320 );
            }

            // Override default open actions
            $( '[data-action^="panel"][data-action$="open"]' ).click(
                function () { return false; }
            );

            // Add close buttons
            $( '.slidereveal-panel' )
                .find( '[data-action="panel-close"]' )
                .on( 'click', function () {
                    $( this ).parents( '.slidereveal-panel' ).slideReveal( 'hide' );
                    return false;
                } );

            // Add custom overlay
            $body.append( $slideRevealShroud );
            $slideRevealShroud.on( 'click', function ( e ) {
                var $panel = openedPanels[ openedPanels.length - 1 ];
                if ( $panel ) {
                    $panel.slideReveal( 'hide' );
                }
            } );

            // Tabindex focus
            $panelMenu.find( 'a, input' ).attr( 'tabindex', '-1' );
            $panelCommunity.find( 'a, input' ).attr( 'tabindex', '-1' );

            // Window resize event
            $window.on( 'resize', function () {
                var windowSizeAfter = window.innerWidth;
                if ( windowSizeBefore < MQ_md && windowSizeAfter >= MQ_md && $panelItemFilter ) {
                    $panelItemFilter.slideReveal( 'hide' );
                    $itemFilterMenuDk.append( $itemFilterMenu );
                }
                windowSizeBefore = windowSizeAfter;
            } );

        } )();

        //
        // What Do I Do With?
        //

        ( function () {

            var $wdidwCol = $( '.wdidw-col' ),
                $wdidwBtn = $( '.wdidw-btn' ),
                $wdidwSearchBar = $( '.wdidw-search-bar' ),
                $wdidwSearchFormInputs = $( '.btn, .form-control', '.wdidw-search-form' ),
                $wdidwSearchField = $( '#wdidwsearchfield' ),
                $wdidwSearchResults = $( '#wdidw-search-results' ),
                $wdidwSearchResultsList = $( '#wdidw-search-results-list' ),
                $wdidwSearchQuickLinksList = $( '#wdidw-search-quick-links-list' ),
                $wdidwSearchResultsListLinks,
                $wdidwSearchQuickLinksListLinks;

            //
            // Show and hide
            //

            $( '[data-action="wdidw-show"]' ).on( 'click', function () {
                $wdidwSearchBar.addClass( 'active' );
                $wdidwBtn.attr( 'tabindex', '-1' );
                $wdidwSearchFormInputs.attr( 'tabindex', '0' );
                return false;
            } );

            $( '[data-action="wdidw-hide"]' ).on( 'click', function () {
                $wdidwSearchBar.removeClass( 'active' );
                $wdidwSearchResults.removeClass( 'active' );
                $wdidwBtn.attr( 'tabindex', '0' );
                $wdidwSearchFormInputs.attr( 'tabindex', '-1' );
                return false;
            } );

            $wdidwCol
                // .on( 'mouseleave', function () {
                //     $wdidwSearchResults.removeClass( 'active' );
                // } )
                .on( 'blur', function () {
                    $wdidwSearchResults.removeClass( 'active' );
                } );

            $body.on( 'click', function ( e ) {
                if ( $( e.target ).closest( '.wdidw-col' ).length === 0 ) {
                    $wdidwSearchResults.removeClass( 'active' );
                }
            } );

            //
            // Letter typing animation
            //

            $( '.wdidw-animated-term' ).typed( {
                backDelay: 5000,
                backSpeed: 100,
                loop: true,
                showCursor: false,
                startDelay: 1000,
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

            function getQuickLinks () {
                return $wdidwSearchQuickLinksList.find( '> li > a' );
            }

            $wdidwSearchField.on( 'keydown', function ( e ) {
                var $this = $( this );
                if ( $this.val() ) {
                    $wdidwSearchResults.addClass( 'active' );
                }
                else {
                    $wdidwSearchResults.removeClass( 'active' );
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
                        if ( $li.next().length ) {
                            $li.next().find( '> a' ).focus();
                        }
                        else {
                            getQuickLinks().eq( 0 ).focus();
                        }
                    }
                }
            } );

            getQuickLinks().on( 'keydown', function ( e ) {
                var $this = $( this ),
                    $li = $this.parent();
                if ( e.which === KEYBOARD.UP || e.which === KEYBOARD.DOWN ) {
                    e.preventDefault();
                    if ( e.which === KEYBOARD.UP ) {
                        if ( $li.prev().length ) {
                            $li.prev().find( '> a' ).focus();
                        }
                        else {
                            getResultsLinks().last().focus();
                        }
                    }
                    else {
                        $li.next().find( '> a' ).focus();
                    }
                }
            } );

        } )();

        //
        // Header sticky & Goto top link
        //

        ( function () {

            var $pageHeader = $( '.page-header' ),
                $pageHeaderParent = $pageHeader.parent(),
                $pageHeaderUpper = $pageHeader.find( '.page-header-upper' ),
                $pageHeaderNavbar1 = $pageHeader.find( '.navbar.navbar-default' ).eq( 0 ).find( '.container-fluid' ),
                $pageHeaderNavbar2 = $pageHeader.find( '.navbar.navbar-default' ).eq( 1 ),
                $pageBreadcrumbs = $( 'main .block-breadcrumbs' ),
                $htmlBody = $( 'html, body' ),
                $gotoTopWrapper = $( '.goto-top-wrapper' ),
                pageHeaderTopOffset;

            function getTopOffset () {
                var isDetached = $pageHeader.hasClass( 'header-sticky-detached' ),
                    h = 0;
                $pageHeader.removeClass( 'header-sticky-detached' );
                if ( $pageHeaderUpper.is( ':visible' ) ) {
                    h += $pageHeaderUpper.outerHeight();
                }
                if ( $pageHeaderNavbar1.is( ':visible' ) ) {
                    h += $pageHeaderNavbar1.outerHeight();
                }
                if ( $pageHeaderNavbar2.is( ':visible' ) ) {
                    h += $pageHeaderNavbar2.outerHeight();
                }
                if ( isDetached ) {
                    $pageHeader.addClass( 'header-sticky-detached' );
                }
                return h;
            }

            function setTopOffset () {
                pageHeaderTopOffset = getTopOffset();
                $pageHeaderParent.css( 'padding-top', pageHeaderTopOffset );
            }

            $window.on( 'scroll', function () {

                // Check against negative scroll positions because Safari
                var scrollTopPos = $window.scrollTop(),
                    breadcrumbsOffset = 0;

                if ( scrollTopPos < 0 ) { scrollTopPos = 0; }
                if ( $pageBreadcrumbs && $pageBreadcrumbs.is( ':visible' ) ) {
                    breadcrumbsOffset = $pageBreadcrumbs.outerHeight();
                }

                if ( scrollTopPos > pageHeaderTopOffset + breadcrumbsOffset ) {
                    if ( !$pageHeader.hasClass( 'header-sticky-detached' ) ) {
                        $pageHeader
                            .css( { 'top': '-100%' } )
                            .animate( { 'top': '0' }, 500, function () {
                                $pageHeader.css( { 'top': '' } );
                            } );
                    }
                    $pageHeader.addClass( 'header-sticky-detached' );
                    $gotoTopWrapper.show().removeClass( 'goto-top-hidden' );
                }
                else {
                    $pageHeader.removeClass( 'header-sticky-detached' );
                    $gotoTopWrapper.show().addClass( 'goto-top-hidden' );
                }

            } );

            $window.on( 'resize', setTopOffset );

            $( '[data-action="goto-top"]' ).on( 'click', function ( e ) {
                $this = $( this );
                $htmlBody.animate( { scrollTop: 0 }, 'slow', function () {
                    $this.blur();
                    $pageFirst.focus().blur();
                } );
                e.preventDefault();
                return false;
            } );

            // Init
            $pageHeader.addClass( 'header-sticky' );
            setTopOffset();
            if ( $window.scrollTop() <= pageHeaderTopOffset ) {
                $gotoTopWrapper.hide();
            }

        } )();

        //
        // Mega menu + Sub menus
        //

        ( function () {

            var $mainMenu = $( '.mega-menu' ),
                $callOuts = $mainMenu.find( '.call-out' ),
                $prevLink = null,
                onExit    = null;

            function hoverTrigger ( e ) {
                var $this        = $( this ),
                    $current     = $this.next(),
                    $grandparent = $this.parent().parent(),
                    depth        = $current.parents( '.sub-menu' ).length;
                if ( depth >= 1 ) {
                    $callOuts.addClass( 'call-out-hidden' );
                }
                else {
                    $callOuts.removeClass( 'call-out-hidden' );
                }
                $grandparent.find( 'li > a[data-action="sub-menu-toggle"]' ).not( $this ).removeClass( 'open' );
                $this.addClass( 'open' );
                $grandparent.find( '.sub-menu:visible' ).not( $current ).hide();
                $current.show();
                e.preventDefault();
                e.stopPropagation();
            }

            function hoverDefault ( e ) {
                var $this        = $( this ),
                    $grandparent = $this.parent().parent();
                $grandparent.find( 'li > a[data-action="sub-menu-toggle"]' ).removeClass( 'open' );
                $grandparent.find( '.dropdown-menu' ).hide();
            }

            $mainMenu.find( '.dropdown-menu a[data-action="sub-menu-toggle"]' )
                .on( 'mouseover', hoverTrigger )
                .on( 'focus', hoverTrigger );

            $mainMenu.find( '.dropdown-menu a:not([data-action="sub-menu-toggle"])' )
                .on( 'mouseover', hoverDefault )
                .on( 'focus', hoverDefault );

            //
            // Desktop mega menu
            //

            function getSubMenu ( $elem ) {
                var subMenuKey = $elem.data( 'dropdown-controls' );
                return $( '[data-dropdown="' + subMenuKey + '"]' );
            }

            function closeSubMenu ( $subMenu ) {
                $subMenu.removeClass( 'open' );
                $subMenu.find( '.sub-menu:not(.first)' ).hide();
                $subMenu.find( 'li > a[data-action="sub-menu-toggle"]' ).removeClass( 'open' );
                $callOuts.removeClass( 'call-out-hidden' );
            }

            function openMenu ( $subMenu ) {
                $mainMenu.addClass( 'open' );
                $subMenu.addClass( 'open' );
            }

            function closeMenu ( $subMenu ) {
                $mainMenu.removeClass( 'open' );
                closeSubMenu( $subMenu );
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
                    );

                $mainMenu
                    .find( 'a' )
                    .focus( function () {
                        var $this = $( this ),
                            $subMenu = $this.closest( '.main-menu-dropdown' ),
                            $prevSubMenu;
                        onExit = null;
                        openMenu( $subMenu );
                        if ( $prevLink ) {
                            $prevSubMenu = $prevLink.closest( '.main-menu-dropdown' );
                            if ( $prevSubMenu.data( 'dropdown' ) !== $subMenu.data( 'dropdown' ) ) {
                                closeSubMenu( $prevSubMenu );
                            }
                        }
                        $prevLink = $this;
                    } );

            }

            init();

        } )();

        //
        // Mobile menu
        //

        $( '#panel-menu .dropdown a[data-action="sub-menu-toggle"]' ).on( 'click', function ( e ) {
            var $this        = $( this ),
                $current     = $this.parent().find( '> .dropdown-menu' ),
                $grandparent = $this.parent().parent();
            if ( $this.hasClass( 'open' ) ) {
                $this.removeClass( 'open' );
                if ( $this.parent().hasClass( 'dropdown' ) ) {
                    $grandparent = $this.parent();
                }
                $grandparent.find( 'li > a[data-action="sub-menu-toggle"]' ).removeClass( 'open' );
                $grandparent.find( '.sub-menu:visible' ).not( $current ).slideUp( 400 );
                $current.slideUp( 400 );
            }
            else {
                $this.addClass( 'open' );
                $current.slideDown( 400 );
            }
            e.preventDefault();
            e.stopPropagation();
        });

        //
        // Header search
        //

        $( '[data-action="sb-toggle"]' ).on( 'click', function ( e ) {
            $( '.sb-search' ).addClass( 'sb-search-open' );
            $( '.sb-search-input' ).focus();
            e.preventDefault()
            e.stopPropagation();
        });

        // Site Search
        new UISearch( window.document.getElementById( 'pnlsitesearch' ) );

        //
        // Item basics
        //

        ( function () {

            //
            // Slideshow select functionality
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
                window.clearTimeout( slideShowTimeout );
                slideShowTimeout = window.setTimeout( next, slideShowInterval );
            }

            function stop () { window.clearTimeout( slideShowTimeout ); }

            function next () {
                var nextSlide = currentSlide + 1;
                if ( nextSlide >= slideShowLength ) { nextSlide = 0; }
                flipTo( $itemCatSelectorOpts.eq( nextSlide ) );
                start();
            }

            function flipTo ( $elem, isManual ) {

                var itemKey = $elem.data( 'item-key' ),
                    $itemBasicsCat = $itemBasics.find(
                        '.item-basics-cat[data-item-cat="' + itemKey + '"]'
                    );

                if ( currentSlide === $itemBasicsCat.index() && !isSwapping ) {
                    return;
                }

                isSwapping = true;

                // flip
                $itemCoins
                    .addClass( 'item-coin-flip' );

                window.clearTimeout( swapTimeout );
                if ( !isManual ) window.clearTimeout( flipTimeout );

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
                    window.clearTimeout( flipTimeout );
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
                    flipTo( $this, true );
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
                    brk320:  320,
                    brk400:  400,
                    brk480:  480,
                    brk800:  800,
                    brk768:  768,
                    brk992:  992,
                    brk1200: 1200
                };

            $( '.brand-logo-main' ).responsImg( {
                elementQuery: false,
                breakpoints: BREAKPOINTS
            } );

            $( '.brand-district-logo' ).responsImg( {
                elementQuery: false,
                breakpoints: BREAKPOINTS
            } );

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

        //
        // Lightbox
        //

        ( function () {

            var $lightbox    = $( '#lightbox' ),
                $lightboxImg = $lightbox.find( 'img' ),
                margin       = ( 40 + 15 ) * 2;

            function resizeLightboxImg () {
                $lightboxImg.css( {
                    'maxWidth'  : $window.width() - margin,
                    'maxHeight' : $window.height() - margin
                } );
            }

            $( '[data-target="#lightbox"]' ).on( 'click' , function ( e ) {
                var $targetImg = $( this ).find( 'img' );
                $lightboxImg.attr( {
                    'alt'   : $targetImg.attr( 'alt' )   || '',
                    'src'   : $targetImg.attr( 'src' )   || '',
                    'title' : $targetImg.attr( 'title' ) || ''
                } );
                resizeLightboxImg();
            } );

            $( '[data-action="lightbox-close"]' ).on( 'click' , function ( e ) {
                $lightbox.modal( 'hide' );
                return false;
            } );

            $window.resize( resizeLightboxImg );

        } )();

        //
        // Tile grid touch events
        //

        ( function () {

            var $staffTiles = $( '.tile-grid.tile-grid-staff > .grid-cell a' );

            $staffTiles.each( function () {
                $( this ).data( 'touch-count', 0 );
            } );

            $staffTiles.on( 'tapstart', function ( e ) {
                var $this = $( this );
                $staffTiles.not( $this ).each( function () {
                    $( this ).data( 'touch-count', 0 );
                } );
            } );

            $staffTiles.on( 'tap', function ( e ) {
                var $this = $( this );
                $this.data( 'touch-count', $this.data( 'touch-count' ) + 1 );
                if ( $this.data( 'touch-count' ) === 1 ) {
                    $this.focus();
                    return false;
                }
                else if ( $this.data( 'touch-count' ) === 2 ) {
                    return true;
                }
            } );

            $staffTiles.blur( function ( e ) {
                $( this ).data( 'touch-count', 0 );
            } );

        } )();

        //
        // Override default Bootstrap behavior
        //

        $( '.locations-toggle' ).on( 'click', function ( e ) {
            e.preventDefault();
        } );

        //
        // Twitter feed embed
        //

        ( function () {

            CustomizeTwitterWidget( {
                url: '../dist/css/social-hub-tw.min.css'
            } );

        } )();

    } );

} )( window, jQuery );
