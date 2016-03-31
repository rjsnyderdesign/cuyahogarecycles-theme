/*
 * Cuyahoga County Solid Waste District
 * CuyahogaRecycles.org
 *
 * Global JS
 */

;( function ( window, $ ) {

    //
    // Functions
    //

    function roundUp ( w, cols ) { return w + cols - w % cols; }

    //
    // Init
    //

    $( window.document.body ).ready( function () {

        var $grid       = $( '.grid' ),
            $gridSizer  = $('#grid-sizer'),
            shuffleOpts = {
                speed: 1,
                easing: 'ease-out',
                itemSelector: '.grid-cell',
                gutterWidth: 0,
                columnWidth: function () { return $gridSizer.width(); },
                buffer: 0.01,
                throttleTime: 250,
                sequentialFadeDelay: 150,
                supported: false
            };

        //
        // SlidePanel
        //

        var sliderPanelCalendar = $( '#panel-calendar' ).slideReveal( {
            width: 480,
            push: true,
            position: 'right',
            speed: 300,
            trigger: $( '.action-open-calendar' ),
            push: true,
            overlay: true
        } );

        var sliderPanelNewsletters = $( '#panel-newsletters' ).slideReveal( {
            width: 480,
            push: true,
            position: 'right',
            speed: 300,
            trigger: $( '.action-open-newsletters' ),
            push: true,
            overlay: true
        } );

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
        // Mega Menu + Sub Menus
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
        // New Mega Menu (Hover)
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
        // Mobile Menu + Sub Menus
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
        // Header Search
        //

        $( '.search-container label' ).on( 'click', function ( e ) {
            $( '.sb-search' ).addClass( 'sb-search-open' );
            $( '.sb-search-input' ).focus();
            e.preventDefault()
            e.stopPropagation();
        });

    } );

} )( window, jQuery );
