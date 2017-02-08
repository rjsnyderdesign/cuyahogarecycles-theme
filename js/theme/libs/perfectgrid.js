/*!
 * PerfectGrid
 * Author: Ken Sugiura
 * Version: 0.1
 * License: MIT
 *
 * Copyright (c) 2017 TRAIT
 *
 * This is a jQuery plugin for creating responsive grid layouts
 * based on a predefined set of grid units.
 */

;( function ( $ ) {

    var debugModeOn = false;

    var $window = $( window );

    var defaults = {
        itemSelector: '',        // selector
        placeholderSelector: '', // selector
        columns:      1,         // int|array
        cellRatio:    1          // float
    };

    /**
     * @class PerfectGrid
     */

    function PerfectGrid ( container, options ) {

        options = $.extend( {}, defaults, options );

        this.$container = $( container );

        this.$placeholders = this.$container
            .find( options.placeholderSelector )
            .remove();

        this.$elements = this.$container
            .find( options.itemSelector );

        this.columns = options.columns;
        if ( this.columns instanceof Array ) {
            this.columns = this.columns.sort( function ( a, b ) {
                return a[ 0 ] - b[ 0 ];
            } );
        } else {
            this.columns = parseInt( this.columns );
        }

        this.cellRatio = parseInt( options.cellRatio );

        if ( typeof options.getBlockSize === 'function' ) {
            this.getBlockSize = options.getBlockSize;
        }

        this.cols              = 1;
        this.cellWidth         = 1;
        this.cellHeight        = 1;
        this.colIntervals      = [];
        this.matrix            = [];
        this.blocks            = [];
        this.placeholderBlocks = [];

        $window.on( 'resize', this.reset.bind( this ) );
        this.reset();

    }

    PerfectGrid.prototype.getCols = function () {

        /**
         * Since `this.columns` may be an integer or an array of
         * responsive column-breakpoint pairs, this function will
         * always return a valid integer column count.
         */

        var width, result, i;

        if ( this.columns instanceof Array ) {
            width = window.innerWidth;
            for ( i = 0; i < this.columns.length; i++ ) {
                result = this.columns[ i ][ 1 ];
                if ( this.columns[ i + 1 ] && width < this.columns[ i + 1 ][ 0 ] ) {
                    break;
                }
            }
            return result;
        } else {
            return this.columns;
        }

    };

    PerfectGrid.prototype.getBlockSize = function ( $element ) {
        // This method should be overridden in the settings.
        $element = $( $element );
        return {
            cols: parseInt( $element.data( 'bw' ), 10 ) || 1,
            rows: parseInt( $element.data( 'bh' ), 10 ) || 1
        };
    };

    PerfectGrid.prototype.createBlocks = function ( $elements ) {
        var blocks = [],
            $element,
            blockSize;
        for ( i = 0; i < $elements.length; i++ ) {
            element = $elements[ i ];
            blockSize = this.getBlockSize( element );
            blocks.push(
                new Block( {
                    element: element,
                    cols: blockSize.cols,
                    rows: blockSize.rows
                } )
            );
        }
        return blocks;
    };

    PerfectGrid.prototype.resetGrid = function () {

        var cols = this.getCols(),
            i;

        this.cols         = cols;
        this.cellWidth    = Math.round( this.$container.width() / this.cols );
        this.cellHeight   = Math.round( this.cellWidth / this.cellRatio );

        /**
         * In order to circumvent rounding errors caused by the
         * browser, column positions are rounded and cached to an
         * array instead of being calculated based on cell size.
         */

        this.colIntervals = [];
        for ( i = 0; i < this.cols; i++ ) {
            this.colIntervals.push( i * this.cellWidth );
        }
        this.colIntervals.push( this.$container.width() );

        this.matrix = new Matrix( this.cols, 1 );

    };

    PerfectGrid.prototype.resetBlocks = function () {
        this.blocks = this.createBlocks( this.$elements );
        this.placeholderBlocks = this.createBlocks( this.$placeholders );
    };

    PerfectGrid.prototype.isSpaceAvailable = function ( x, y, cols, rows ) {
        var matrix = this.matrix,
            i, j;
        for ( i = 0; i < rows; i++ ) {
            if ( matrix.existsRow( y + i ) ) {
                for ( j = 0; j < cols; j++ ) {
                    if ( matrix.exists( x + j, y + i ) ) {
                        if ( matrix.get( x + j, y + i ) ) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return true;
    };

    PerfectGrid.prototype.findSpace = function ( block ) {

        /**
         * Find an open space where a block can be placed.
         */

        var matrix = this.matrix,
            result = false,
            i, j, k, row;

        if ( block.cols > this.cols ) {
            throw new Error( 'Block does not fit inside of grid.' );
        }

        for ( k = 0; k < block.rows; k++ ) {
            matrix.pushRow();
        }

        i = 0;
        while ( ! result ) {
            for ( j = 0; j < matrix.cols; j++ ) {
                if ( this.isSpaceAvailable( j, i, block.cols, block.rows ) ) {
                    result = { x: j, y: i };
                    break;
                }
            }
            i++;
        }

        return result;

    };

    PerfectGrid.prototype.hasHoles = function () {
        var matrixValues = this.matrix.values,
            i, j;
        for ( i = 0; i < matrixValues.length; i++ ) {
            for ( j = 0; j < matrixValues[ i ].length; j++ ) {
                if ( ! matrixValues[ i ][ j ] ) {
                    return true;
                }
            }
        }
        return false;
    };

    PerfectGrid.prototype.append = function ( x, y, block ) {
        this.$container.append( block.$element );
        block.append( x, y );
        this.matrix.setMultiple( x, y, block.cols, block.rows, true );
    };

    PerfectGrid.prototype.remove = function ( block ) {
        block.$element.remove();
        block.remove();
        this.matrix.setMultiple( block.x, block.y, block.cols, block.rows, null );
    };

    PerfectGrid.prototype.placeBlock = function ( block ) {
        var pos = this.findSpace( block );
        if ( pos ) {
            this.append( pos.x, pos.y, block );
            this.trimMatrix();
        }
        // console.log( 'Matrix:' );
        // console.log( this.printMatrix() );
    };

    PerfectGrid.prototype.fillHoles = function () {
        /**
         * Add placeholder blocks if empty spaces are found
         * within the grid.
         */
        var blocks = this.placeholderBlocks.slice();
        while ( blocks.length && this.hasHoles() ) {
            this.placeBlock( blocks.shift() );
        }
    };

    PerfectGrid.prototype.placeBlocks = function ( blocks ) {
        blocks = blocks.slice();
        while ( blocks.length ) {
            this.placeBlock( blocks.shift() );
        }
    };

    PerfectGrid.prototype.removeBlocks = function ( blocks ) {
        var i;
        for ( i = 0; i < blocks.length; i++ ) {
            this.remove( blocks[ i ] );
        }
    };

    PerfectGrid.prototype.draw = function () {

        var blocks = this.blocks.concat( this.placeholderBlocks ),
            i, block, bx, by, bw, bh;

        this.$container.css( {
            height: this.matrix.rows * this.cellHeight + 'px',
            position: 'relative'
        } );

        for ( i = 0; i < blocks.length; i++ ) {
            block = blocks[ i ];
            bx = this.colIntervals[ block.x ];
            by = block.y * this.cellHeight;
            bw = this.colIntervals[ block.x + block.cols ] - bx;
            bh = this.cellHeight * block.rows;
            block.$element.css( {
                width: bw + 'px',
                height: bh + 'px',
                position: 'absolute',
                top: by + 'px',
                left: bx + 'px'
            } );
        }

    };

    PerfectGrid.prototype.reset = function () {
        this.resetGrid();
        this.resetBlocks();
        this.removeBlocks( this.blocks );
        this.removeBlocks( this.placeholderBlocks );
        this.placeBlocks( this.blocks );
        this.fillHoles();
        this.draw();
    };

    PerfectGrid.prototype.isRowEmpty = function ( row ) {
        var j = row.length;
        if ( j ) {
            while ( j-- ) {
                if ( row[ j ] ) {
                    return false;
                }
            }
        }
        return true;
    };

    PerfectGrid.prototype.trimMatrix = function () {
        var matrix = this.matrix,
            i = matrix.values.length;
        if ( i ) {
            while ( i-- ) {
                if ( this.isRowEmpty( matrix.values[ i ] ) ) {
                    matrix.popRow();
                } else {
                    break;
                }
            }
        }
    };

    PerfectGrid.prototype.printMatrix = function () {
        var matrix = this.matrix,
            result = '',
            i, j, row;
        for ( i = 0; i < matrix.rows; i++ ) {
            row = '';
            for ( j = 0; j < matrix.cols; j++ ) {
                row += ( matrix.values[ i ][ j ] ) ? '*' : '-';
            }
            result += row + '\n';
        }
        return result;
    };

    /**
     * @class Block
     *
     * Each block has size and position measured in grid units.
     */

    function Block ( options ) {
        this.$element = $( options.element );
        this.cols = options.cols;
        this.rows = options.rows;
        this.x = null;
        this.y = null;
    }

    Block.prototype.append = function ( x, y ) {
        this.x = x;
        this.y = y;
    };

    Block.prototype.remove = function () {
        this.x = null;
        this.y = null;
    };

    /**
     * @class Matrix
     *
     * Matrix is used to keep track of occupied and open spaces
     * within the grid.
     */

    function Matrix ( cols, rows ) {
        var i;
        rows = parseInt( rows );
        this.cols = parseInt( cols );
        this.rows = 0;
        this.values = [];
        for ( i = 0; i < rows; i++ ) {
            this.pushRow();
        }
    }

    Matrix.prototype.pushRow = function () {
        var row = [], j;
        for ( j = 0; j < this.cols; j++ ) {
            row.push( null );
        }
        this.values.push( row );
        this.rows += 1;
    };

    Matrix.prototype.popRow = function () {
        this.rows -= 1;
        return this.values.pop();
    };

    Matrix.prototype.existsRow = function ( y ) {
        return this.values[ y ] instanceof Array;
    };

    Matrix.prototype.exists = function ( x, y ) {
        return (
            this.existsRow( y ) &&
            x === parseInt( x, 10 ) &&
            x >= 0 &&
            x < this.cols
        );
    };

    Matrix.prototype.get = function ( x, y ) {
        return this.values[ y ][ x ];
    };

    Matrix.prototype.set = function ( x, y, value ) {
        if ( this.exists( x, y ) ) {
            return this.values[ y ][ x ] = value;
        }
    };

    Matrix.prototype.setMultiple = function ( x, y, cols, rows, value ) {
        var i, j;
        for ( i = 0; i < rows; i++ ) {
            for ( j = 0; j < cols; j++ ) {
                this.set( x + j, y + i, value );
            }
        }
    };

    //
    // Export
    //

    $.fn.perfectgrid = function ( options ) {
        this.each( function () {
            var perfectGrid = new PerfectGrid( this, options );
        } );
    };

} )( jQuery );
