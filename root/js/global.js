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
        // Events
        //

        $( window ).resize( function () {
            // var cols;
            // if ( true ) {
            //     cols = 3;
            // } else if ( true ) {
            //     cols = 2;
            // } else {
            //     cols = 1;
            // }
            // $grid.width( roundUp ( $grid.width(), cols ) );
        } );

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
            position: 'left',
            speed: 300,
            trigger: $( '.action-open-menu' ),
            push: true,
            overlay: true,
						hidden: function(slider, trigger){
							// Close Sub Menu's when menu is hidden
							$("#panel-menu .dropdown").find('.trigger').removeClass('selected');
							$("#panel-menu .dropdown").find('.sub-menu').hide();
						  }
        } );

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

    } );

} )( window, jQuery );
