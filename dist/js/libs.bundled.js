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

/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

var CustomizeTwitterWidget = function(data) {
    // ie hack, http://stackoverflow.com/a/10183573/329700
    if(!(window.console && console.log)) {
      console = {
        log: function(){},
        debug: function(){},
        info: function(){},
        warn: function(){},
        error: function(){}
      };
    }

    var notNumeric = function(n) {
        return isNaN(parseFloat(n)) && isFinite(n);
    };

    var createCssElement = function(doc, url) {
        var link = doc.createElement("link");
        link.href = url;
        link.rel = "stylesheet";
        link.type = "text/css";
        return link;
    };

    var embedCss = function(doc, url) {
        var link = createCssElement(doc, url);
        var head = doc.getElementsByTagName("head")[0];
        head.appendChild(link);
    };

    var contains = function(haystack, needle) {
        return haystack.indexOf(needle) >= 0;
    };

    var isTwitterFrame = function(frame) {
        return frame.frameElement.id.indexOf('twitter-widget') >= 0;
    }

    /**
     * The main event loop - calls itself if we haven't found all of the frames
     * yet.
     */
    var evaluate = function(framesWithStyles, widgetCount, timeoutLength) {
        for (var i = 0; i < frames.length; i++) {
            try {
                if (isTwitterFrame(frames[i]) &&
                    !contains(framesWithStyles, frames[i].name)
                ) {
                    embedCss(frames[i].document, data.url);
                    framesWithStyles.push(i);
                }
            } catch(e) {
                console.log("caught an error");
                console.log(e);
            }
        }

        if (framesWithStyles.length < widgetCount) {
            setTimeout(function() {
                evaluate(framesWithStyles);
            }, timeoutLength);
        }
    }

    if (data.url === undefined) {
        console.log("need to specify a link to your CSS file. quitting");
        return;
    }
    var widgetCount;
    if (data.widget_count === undefined || notNumeric(data.widget_count)) {
        widgetCount = 1;
    } else {
        widgetCount = data.widget_count;
    }
    var timeoutLength;
    if (data.timeout_length === undefined || notNumeric(data.timeout_length)) {
        timeoutLength = 300;
    } else {
        timeoutLength = data.timeout_length;
    }

    setTimeout(function() {
        evaluate([], widgetCount, timeoutLength);
    }, timeoutLength);
}


/*!
 * jQuery Mobile Events
 * by Ben Major (lincweb - www.lincweb.co.uk)
 *
 * Copyright 2011-2015, Ben Major
 * Licensed under the MIT License:
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

"use strict";

(function ($) {
    $.attrFn = $.attrFn || {};

    // navigator.userAgent.toLowerCase() isn't reliable for Chrome installs
    // on mobile devices. As such, we will create a boolean isChromeDesktop
    // The reason that we need to do this is because Chrome annoyingly
    // purports support for touch events even if the underlying hardware
    // does not!
    var agent = navigator.userAgent.toLowerCase(),
        isChromeDesktop = (agent.indexOf('chrome') > -1 && ((agent.indexOf('windows') > -1) || (agent.indexOf('macintosh') > -1) || (agent.indexOf('linux') > -1)) && agent.indexOf('mobile') < 0 && agent.indexOf('android') < 0),

        settings = {
            tap_pixel_range: 5,
            swipe_h_threshold: 50,
            swipe_v_threshold: 50,
            taphold_threshold: 750,
            doubletap_int: 500,

            touch_capable: ('ontouchstart' in window && !isChromeDesktop),
            orientation_support: ('orientation' in window && 'onorientationchange' in window),

            startevent:  (('ontouchstart' in window && !isChromeDesktop) ? 'touchstart' : 'mousedown'),
            endevent:    (('ontouchstart' in window && !isChromeDesktop) ? 'touchend' : 'mouseup'),
            moveevent:   (('ontouchstart' in window && !isChromeDesktop) ? 'touchmove' : 'mousemove'),
            tapevent:    ('ontouchstart' in window && !isChromeDesktop) ? 'tap' : 'click',
            scrollevent: ('ontouchstart' in window && !isChromeDesktop) ? 'touchmove' : 'scroll',

            hold_timer: null,
            tap_timer: null
        };
    
    // Convenience functions:
    $.isTouchCapable = function() { return settings.touch_capable; };
    $.getStartEvent = function() { return settings.startevent; };
    $.getEndEvent = function() { return settings.endevent; };
    $.getMoveEvent = function() { return settings.moveevent; };
    $.getTapEvent = function() { return settings.tapevent; };
    $.getScrollEvent = function() { return settings.scrollevent; };
    
    // Add Event shortcuts:
    $.each(['tapstart', 'tapend', 'tapmove', 'tap', 'tap2', 'tap3', 'tap4', 'singletap', 'doubletap', 'taphold', 'swipe', 'swipeup', 'swiperight', 'swipedown', 'swipeleft', 'swipeend', 'scrollstart', 'scrollend', 'orientationchange'], function (i, name) {
        $.fn[name] = function (fn) {
            return fn ? this.on(name, fn) : this.trigger(name);
        };

        $.attrFn[name] = true;
    });

    // tapstart Event:
    $.event.special.tapstart = {
        setup: function () {
			
            var thisObject = this,
                $this = $(thisObject);
			
            $this.on(settings.startevent, function tapStartFunc(e) {
				
                $this.data('callee', tapStartFunc);
                if (e.which && e.which !== 1) {
                    return false;
                }

                var origEvent = e.originalEvent,
                    touchData = {
                        'position': {
                            'x': ((settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX),
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                            'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        },
                        'time': Date.now(),
                        'target': e.target
                    };
				
                triggerCustomEvent(thisObject, 'tapstart', e, touchData);
                return true;
            });
        },

        remove: function () {
            $(this).off(settings.startevent, $(this).data.callee);
        }
    };
	
    // tapmove Event:
    $.event.special.tapmove = {
    	setup: function() {
            var thisObject = this,
            $this = $(thisObject);
    			
            $this.on(settings.moveevent, function tapMoveFunc(e) {
                $this.data('callee', tapMoveFunc);
    			
                var origEvent = e.originalEvent,
                    touchData = {
                        'position': {
                            'x': ((settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX),
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
							'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        },
                        'time': Date.now(),
                        'target': e.target
                    };
    				
                triggerCustomEvent(thisObject, 'tapmove', e, touchData);
                return true;
            });
        },
        remove: function() {
            $(this).off(settings.moveevent, $(this).data.callee);
        }
    };

    // tapend Event:
    $.event.special.tapend = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject);

            $this.on(settings.endevent, function tapEndFunc(e) {
                // Touch event data:
                $this.data('callee', tapEndFunc);

                var origEvent = e.originalEvent;
                var touchData = {
                    'position': {
                        'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                        'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY
                    },
                    'offset': {
                        'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                        'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                    },
                    'time': Date.now(),
                    'target': e.target
                };
                triggerCustomEvent(thisObject, 'tapend', e, touchData);
                return true;
            });
        },
        remove: function () {
            $(this).off(settings.endevent, $(this).data.callee);
        }
    };

    // taphold Event:
    $.event.special.taphold = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                origTarget,
                start_pos = {
                    x: 0,
                    y: 0
                },
                end_x = 0,
                end_y = 0;

            $this.on(settings.startevent, function tapHoldFunc1(e) {
                if (e.which && e.which !== 1) {
                    return false;
                } else {
                    $this.data('tapheld', false);
                    origTarget = e.target;

                    var origEvent = e.originalEvent;
                    var start_time = Date.now(),
                        startPosition = {
                            'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        startOffset = {
                            'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
                        };

                    start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                    start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

                    end_x = start_pos.x;
                    end_y = start_pos.y;

                    settings.hold_timer = window.setTimeout(function () {

                        var diff_x = (start_pos.x - end_x),
                            diff_y = (start_pos.y - end_y);

                        if (e.target == origTarget && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {
                            $this.data('tapheld', true);

                            var end_time = Date.now(),
                                endPosition = {
                                    'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                                    'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                                },
                                endOffset = {
                                    'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
									'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                                };
                            var duration = end_time - start_time;

                            // Build the touch data:
                            var touchData = {
                                'startTime': start_time,
                                'endTime': end_time,
                                'startPosition': startPosition,
                                'startOffset': startOffset,
                                'endPosition': endPosition,
                                'endOffset': endOffset,
                                'duration': duration,
                                'target': e.target
                            };
                            $this.data('callee1', tapHoldFunc1);
                            triggerCustomEvent(thisObject, 'taphold', e, touchData);
                        }
                    }, settings.taphold_threshold);

                    return true;
                }
            }).on(settings.endevent, function tapHoldFunc2() {
                $this.data('callee2', tapHoldFunc2);
                $this.data('tapheld', false);
                window.clearTimeout(settings.hold_timer);
            })
            .on(settings.moveevent, function tapHoldFunc3(e) {
                $this.data('callee3', tapHoldFunc3);
				
                end_x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                end_y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
            });
        },

        remove: function () {
            $(this).off(settings.startevent, $(this).data.callee1).off(settings.endevent, $(this).data.callee2).off(settings.moveevent, $(this).data.callee3);
        }
    };

    // doubletap Event:
    $.event.special.doubletap = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                origTarget,
                action,
                firstTap = null,
                origEvent,
				cooloff,
				cooling = false;

            $this.on(settings.startevent, function doubleTapFunc1(e) {
                if (e.which && e.which !== 1) {
                    return false;
                }
                $this.data('doubletapped', false);
                origTarget = e.target;
                $this.data('callee1', doubleTapFunc1);

                origEvent = e.originalEvent;
                if (!firstTap) {
                    firstTap = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                            'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        },
                        'time': Date.now(),
                        'target': e.target
                    };
                }

                return true;
            }).on(settings.endevent, function doubleTapFunc2(e) {
				
                var now = Date.now();
                var lastTouch = $this.data('lastTouch') || now + 1;
                var delta = now - lastTouch;
                window.clearTimeout(action);
                $this.data('callee2', doubleTapFunc2);

                if (delta < settings.doubletap_int && (e.target == origTarget) && delta > 100) {
                    $this.data('doubletapped', true);
                    window.clearTimeout(settings.tap_timer);

                    // Now get the current event:
                    var lastTap = {
                        'position': {
                            'x': (settings.touch_capable) ? e.originalEvent.changedTouches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? e.originalEvent.changedTouches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                            'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        },
                        'time': Date.now(),
                        'target': e.target
                    };

                    var touchData = {
                        'firstTap': firstTap,
                        'secondTap': lastTap,
                        'interval': lastTap.time - firstTap.time
                    };

                    if (!cooling) {
                    	triggerCustomEvent(thisObject, 'doubletap', e, touchData);
                        firstTap = null;
                    }
                    
                    cooling = true;
                    
                    cooloff = window.setTimeout(function () {
                    	cooling = false;
                    }, settings.doubletap_int);
					
                } else {
                    $this.data('lastTouch', now);
                    action = window.setTimeout(function () {
                        firstTap = null;
                        window.clearTimeout(action);
                    }, settings.doubletap_int, [e]);
                }
                $this.data('lastTouch', now);
            });
        },
        remove: function () {
            $(this).off(settings.startevent, $(this).data.callee1).off(settings.endevent, $(this).data.callee2);
        }
    };

    // singletap Event:
    // This is used in conjuction with doubletap when both events are needed on the same element
    $.event.special.singletap = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                origTarget = null,
                startTime = null,
                start_pos = {
                    x: 0,
                    y: 0
                };

            $this.on(settings.startevent, function singleTapFunc1(e) {
                if (e.which && e.which !== 1) {
                    return false;
                } else {
                    startTime = Date.now();
                    origTarget = e.target;
                    $this.data('callee1', singleTapFunc1);

                    // Get the start x and y position:
                    start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                    start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                    return true;
                }
            }).on(settings.endevent, function singleTapFunc2(e) {
                $this.data('callee2', singleTapFunc2);
                if (e.target == origTarget) {
                    // Get the end point:
                    var end_pos_x = (e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageX : e.pageX;
                    var end_pos_y = (e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageY : e.pageY;
                    
                    // We need to check if it was a taphold:

                    settings.tap_timer = window.setTimeout(function () {
                        if (!$this.data('doubletapped') && !$this.data('tapheld') && (start_pos.x == end_pos_x) && (start_pos.y == end_pos_y)) {
                            var origEvent = e.originalEvent;
                            var touchData = {
                                'position': {
                                    'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                                    'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY
                                },
                                'offset': {
                                    'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
									'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                                },
                                'time': Date.now(),
                                'target': e.target
                            };
                            
                            // Was it a taphold?
                            if((touchData.time - startTime) < settings.taphold_threshold)
                            {
                                triggerCustomEvent(thisObject, 'singletap', e, touchData);
                            }
                        }
                    }, settings.doubletap_int);
                }
            });
        },

        remove: function () {
            $(this).off(settings.startevent, $(this).data.callee1).off(settings.endevent, $(this).data.callee2);
        }
    };

    // tap Event:
    $.event.special.tap = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                started = false,
                origTarget = null,
                start_time,
                start_pos = {
                    x: 0,
                    y: 0
                },
                touches;

            $this.on(settings.startevent, function tapFunc1(e) {
                $this.data('callee1', tapFunc1);

                if( e.which && e.which !== 1 )
				{
                    return false;
                }
				else
				{
                    started = true;
                    start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                    start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                    start_time = Date.now();
                    origTarget = e.target;
					
                    touches = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches : [ e ];
                    return true;
                }
            }).on(settings.endevent, function tapFunc2(e) {
                $this.data('callee2', tapFunc2);

                // Only trigger if they've started, and the target matches:
                var end_x = (e.originalEvent.targetTouches) ? e.originalEvent.changedTouches[0].pageX : e.pageX,
                    end_y = (e.originalEvent.targetTouches) ? e.originalEvent.changedTouches[0].pageY : e.pageY,
                    diff_x = (start_pos.x - end_x),
                    diff_y = (start_pos.y - end_y),
                    eventName;
					
                if (origTarget == e.target && started && ((Date.now() - start_time) < settings.taphold_threshold) && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {
                    var origEvent = e.originalEvent;
                    var touchData = [ ];
					
                    for( var i = 0; i < touches.length; i++)
                    {
                        var touch = {
                            'position': {
                                'x': (settings.touch_capable) ? origEvent.changedTouches[i].screenX : e.screenX,
                                'y': (settings.touch_capable) ? origEvent.changedTouches[i].screenY : e.screenY
                            },
                            'offset': {
                                'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[i].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                                'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[i].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                            },
                            'time': Date.now(),
                            'target': e.target
                        };
                    	
                        touchData.push( touch );
                    }
                    
                    triggerCustomEvent(thisObject, 'tap', e, touchData);
                }
            });
        },

        remove: function () {
            $(this).off(settings.startevent, $(this).data.callee1).off(settings.endevent, $(this).data.callee2);
        }
    };

    // swipe Event (also handles swipeup, swiperight, swipedown and swipeleft):
    $.event.special.swipe = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                started = false,
                hasSwiped = false,
                originalCoord = {
                    x: 0,
                    y: 0
                },
                finalCoord = {
                    x: 0,
                    y: 0
                },
                startEvnt;

            // Screen touched, store the original coordinate

            function touchStart(e) {
                $this = $(e.currentTarget);
                $this.data('callee1', touchStart);
                originalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                originalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                finalCoord.x = originalCoord.x;
                finalCoord.y = originalCoord.y;
                started = true;
                var origEvent = e.originalEvent;
                // Read event data into our startEvt:
                startEvnt = {
                    'position': {
                        'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                        'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                    },
                    'offset': {
                        'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                        'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                    },
                    'time': Date.now(),
                    'target': e.target
                };
            }

            // Store coordinates as finger is swiping

            function touchMove(e) {
                $this = $(e.currentTarget);
                $this.data('callee2', touchMove);
                finalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                finalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

                var swipedir;

                // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
                var ele_x_threshold = ($this.parent().data('xthreshold')) ? $this.parent().data('xthreshold') : $this.data('xthreshold'),
                    ele_y_threshold = ($this.parent().data('ythreshold')) ? $this.parent().data('ythreshold') : $this.data('ythreshold'),
                    h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.swipe_h_threshold,
                    v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.swipe_v_threshold; 
                
                if (originalCoord.y > finalCoord.y && (originalCoord.y - finalCoord.y > v_threshold)) {
                    swipedir = 'swipeup';
                }
                if (originalCoord.x < finalCoord.x && (finalCoord.x - originalCoord.x > h_threshold)) {
                    swipedir = 'swiperight';
                }
                if (originalCoord.y < finalCoord.y && (finalCoord.y - originalCoord.y > v_threshold)) {
                    swipedir = 'swipedown';
                }
                if (originalCoord.x > finalCoord.x && (originalCoord.x - finalCoord.x > h_threshold)) {
                    swipedir = 'swipeleft';
                }
                if (swipedir != undefined && started) {
                    originalCoord.x = 0;
                    originalCoord.y = 0;
                    finalCoord.x = 0;
                    finalCoord.y = 0;
                    started = false;

                    // Read event data into our endEvnt:
                    var origEvent = e.originalEvent;
                    var endEvnt = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                            'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        },
                        'time': Date.now(),
                        'target': e.target
                    };

                    // Calculate the swipe amount (normalized):
                    var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
                        yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

                    var touchData = {
                        'startEvnt': startEvnt,
                        'endEvnt': endEvnt,
                        'direction': swipedir.replace('swipe', ''),
                        'xAmount': xAmount,
                        'yAmount': yAmount,
                        'duration': endEvnt.time - startEvnt.time
                    };
                    hasSwiped = true;
                    $this.trigger('swipe', touchData).trigger(swipedir, touchData);
                }
            }

            function touchEnd(e) {
                $this = $(e.currentTarget);
                var swipedir = "";
                $this.data('callee3', touchEnd);
                if (hasSwiped) {
                    // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
                    var ele_x_threshold = $this.data('xthreshold'),
                        ele_y_threshold = $this.data('ythreshold'),
                        h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.swipe_h_threshold,
                        v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.swipe_v_threshold;

                    var origEvent = e.originalEvent;
                    var endEvnt = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                            'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        },
                        'time': Date.now(),
                        'target': e.target
                    };

                    // Read event data into our endEvnt:
                    if (startEvnt.position.y > endEvnt.position.y && (startEvnt.position.y - endEvnt.position.y > v_threshold)) {
                        swipedir = 'swipeup';
                    }
                    if (startEvnt.position.x < endEvnt.position.x && (endEvnt.position.x - startEvnt.position.x > h_threshold)) {
                        swipedir = 'swiperight';
                    }
                    if (startEvnt.position.y < endEvnt.position.y && (endEvnt.position.y - startEvnt.position.y > v_threshold)) {
                        swipedir = 'swipedown';
                    }
                    if (startEvnt.position.x > endEvnt.position.x && (startEvnt.position.x - endEvnt.position.x > h_threshold)) {
                        swipedir = 'swipeleft';
                    }

                    // Calculate the swipe amount (normalized):
                    var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
                        yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

                    var touchData = {
                        'startEvnt': startEvnt,
                        'endEvnt': endEvnt,
                        'direction': swipedir.replace('swipe', ''),
                        'xAmount': xAmount,
                        'yAmount': yAmount,
                        'duration': endEvnt.time - startEvnt.time
                    };
                    $this.trigger('swipeend', touchData);
                }

                started = false;
                hasSwiped = false;
            }

            $this.on(settings.startevent, touchStart);
            $this.on(settings.moveevent, touchMove);
            $this.on(settings.endevent, touchEnd);
        },

        remove: function () {
            $(this).off(settings.startevent, $(this).data.callee1).off(settings.moveevent, $(this).data.callee2).off(settings.endevent, $(this).data.callee3);
        }
    };

    // scrollstart Event (also handles scrollend):
    $.event.special.scrollstart = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                scrolling,
                timer;

            function trigger(event, state) {
                scrolling = state;
                triggerCustomEvent(thisObject, scrolling ? 'scrollstart' : 'scrollend', event);
            }

            // iPhone triggers scroll after a small delay; use touchmove instead
            $this.on(settings.scrollevent, function scrollFunc(event) {
                $this.data('callee', scrollFunc);

                if (!scrolling) {
                    trigger(event, true);
                }

                clearTimeout(timer);
                timer = setTimeout(function () {
                    trigger(event, false);
                }, 50);
            });
        },

        remove: function () {
            $(this).off(settings.scrollevent, $(this).data.callee);
        }
    };

    // This is the orientation change (largely borrowed from jQuery Mobile):
    var win = $(window),
        special_event,
        get_orientation,
        last_orientation,
        initial_orientation_is_landscape,
        initial_orientation_is_default,
        portrait_map = {
            '0': true,
            '180': true
        };

    if (settings.orientation_support) {
        var ww = window.innerWidth || win.width(),
            wh = window.innerHeight || win.height(),
            landscape_threshold = 50;

        initial_orientation_is_landscape = ww > wh && (ww - wh) > landscape_threshold;
        initial_orientation_is_default = portrait_map[window.orientation];

        if ((initial_orientation_is_landscape && initial_orientation_is_default) || (!initial_orientation_is_landscape && !initial_orientation_is_default)) {
            portrait_map = {
                '-90': true,
                '90': true
            };
        }
    }

    $.event.special.orientationchange = special_event = {
        setup: function () {
            // If the event is supported natively, return false so that jQuery
            // will on to the event using DOM methods.
            if (settings.orientation_support) {
                return false;
            }

            // Get the current orientation to avoid initial double-triggering.
            last_orientation = get_orientation();

            win.on('throttledresize', handler);
            return true;
        },
        teardown: function () {
            if (settings.orientation_support) {
                return false;
            }

            win.off('throttledresize', handler);
            return true;
        },
        add: function (handleObj) {
            // Save a reference to the bound event handler.
            var old_handler = handleObj.handler;

            handleObj.handler = function (event) {
                event.orientation = get_orientation();
                return old_handler.apply(this, arguments);
            };
        }
    };

    // If the event is not supported natively, this handler will be bound to
    // the window resize event to simulate the orientationchange event.

    function handler() {
        // Get the current orientation.
        var orientation = get_orientation();

        if (orientation !== last_orientation) {
            // The orientation has changed, so trigger the orientationchange event.
            last_orientation = orientation;
            win.trigger("orientationchange");
        }
    }

    $.event.special.orientationchange.orientation = get_orientation = function () {
        var isPortrait = true,
            elem = document.documentElement;

        if (settings.orientation_support) {
            isPortrait = portrait_map[window.orientation];
        } else {
            isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
        }

        return isPortrait ? 'portrait' : 'landscape';
    };

    // throttle Handler:
    $.event.special.throttledresize = {
        setup: function () {
            $(this).on('resize', throttle_handler);
        },
        teardown: function () {
            $(this).off('resize', throttle_handler);
        }
    };

    var throttle = 250,
        throttle_handler = function () {
            curr = Date.now();
            diff = curr - lastCall;

            if (diff >= throttle) {
                lastCall = curr;
                $(this).trigger('throttledresize');

            } else {
                if (heldCall) {
                    window.clearTimeout(heldCall);
                }

                // Promise a held call will still execute
                heldCall = window.setTimeout(handler, throttle - diff);
            }
        },
        lastCall = 0,
        heldCall,
        curr,
        diff;

    // Trigger a custom event:

    function triggerCustomEvent(obj, eventType, event, touchData) {
        var originalType = event.type;
        event.type = eventType;

        $.event.dispatch.call(obj, event, touchData);
        event.type = originalType;
    }

    // Correctly on anything we've overloaded:
    $.each({
        scrollend: 'scrollstart',
        swipeup: 'swipe',
        swiperight: 'swipe',
        swipedown: 'swipe',
        swipeleft: 'swipe',
        swipeend: 'swipe',
        tap2: 'tap'
    }, function (e, srcE) {
        $.event.special[e] = {
            setup: function () {
                $(this).on(srcE, $.noop);
            }
        };
    });

}(jQuery));

jQuery.responsImg=function(e,n){var r,i,t,o,a,s,u,c,l,d,w,f,p,g,v,m,h;return i={allowDownsize:!1,elementQuery:!1,delay:200,breakpoints:null,considerDevice:!1},n&&jQuery.extend(i,n),h=jQuery(window),e=jQuery(e),g={},a=null,f=null,d=0,p=!1,l=function(){a=u(e),window.devicePixelRatio<1.5||(p=!0),g[0]=Array("IMG"===a?e.attr("src"):s(e)),h.on("resize.responsImg orientationchange.responsImg",w),o()},s=function(e){var n;return n=e.css("background-image"),n=n.replace("url(",""),n=n.replace(")","")},u=function(e){return jQuery(e).prop("tagName")},o=function(){var n,t,o,a,s,u,c,l;o=e.data(),u=/^responsimg/;for(a in o)if(l=o[a],u.test(a)){if(s=a.replace("responsimg",""),isNaN(s)){s=s.toLowerCase(),c=i.breakpoints;for(n in c)t=c[n],s===n&&(s=t)}else s=parseInt(s,10);g[s]=l.replace(" ","").split(",")}r()},w=function(){clearTimeout(f),f=setTimeout(r,i.delay)},t=function(){var n,r,t;return n=null,i.elementQuery===!0?(n=e.width(),null!=window.orientation&&i.considerDevice&&(t=h.width(),r=c(),n=Math.ceil(r*n/t))):n=null!=window.orientation&&i.considerDevice?c():h.width(),n},c=function(){var e;return e=0===window.orientation?window.screen.width:window.screen.height,navigator.userAgent.indexOf("Android")>=0&&window.devicePixelRatio&&(e/=window.devicePixelRatio),e},r=function(){var n,r,o,s,u,c;if(u=t(),n=0,d=0,r=!0,s="",u>d?d=u:i.allowDownsize===!1&&(r=!1),r===!0){for(o in g)c=g[o],parseInt(o,10)>u||parseInt(o,10)<n||(n=parseInt(o,10),s=g[n][0]);p===!0&&null!=g[n][1]&&(s=g[n][1]),"IMG"===a?m(e,s):v(e,s)}},m=function(e,n){var r;r=e.attr("src"),n!==r&&e.attr("src",n)},v=function(e,n){var r;r=s(e),n!==r&&e.css("background-image","url("+n+")")},l(),this.recheck=function(){r()},this},jQuery.fn.responsImg=function(e){return this.each(function(){var n,r;n=jQuery(this),void 0===n.data("responsImg")&&(r=new jQuery.responsImg(this,e),n.data("responsImg",r))})};
/*! slidereveal - v1.1.1 - 2016-03-04
* https://github.com/nnattawat/slidereveal
* Copyright (c) 2016 Nattawat Nonsung; Licensed MIT */
!function(a){var b=function(a,b){var c=a.css("padding-"+b);return c?+c.substring(0,c.length-2):0},c=function(a){var c=b(a,"left"),d=b(a,"right");return a.width()+c+d+"px"},d=function(b,c){var d={width:250,push:!0,position:"left",speed:300,trigger:void 0,autoEscape:!0,show:function(){},shown:function(){},hidden:function(){},hide:function(){},top:0,overlay:!1,zIndex:1049,overlayColor:"rgba(0,0,0,0.5)"};this.setting=a.extend(d,c),this.element=b,this.init()};a.extend(d.prototype,{init:function(){var b=this,d=this.setting,e=this.element,f="all ease "+d.speed+"ms";e.css({position:"fixed",width:d.width,transition:f,height:"100%",top:d.top}).css(d.position,"-"+c(e)),d.overlay&&(e.css("z-index",d.zIndex),a("body").prepend("<div class='slide-reveal-overlay'></div>"),a(".slide-reveal-overlay").hide().css({position:"fixed",top:0,left:0,height:"100%",width:"100%","z-index":d.zIndex-1,"background-color":d.overlayColor}).click(function(){b.hide()})),e.data("slide-reveal",!1),d.push&&a("body").css({position:"relative","overflow-x":"hidden",transition:f,left:"0px"}),d.trigger&&d.trigger.length>0&&d.trigger.on("click.slideReveal",function(){e.data("slide-reveal")?b.hide():b.show()}),d.autoEscape&&a(document).on("keydown.slideReveal",function(c){0===a("input:focus, textarea:focus").length&&27===c.keyCode&&e.data("slide-reveal")&&b.hide()})},show:function(b){var d=this.setting,e=this.element;(void 0===b||b)&&d.show(e),d.overlay&&a(".slide-reveal-overlay").show(),e.css(d.position,"0px"),d.push&&("left"===d.position?a("body").css("left",c(e)):a("body").css("left","-"+c(e))),e.data("slide-reveal",!0),(void 0===b||b)&&setTimeout(function(){d.shown(e)},d.speed)},hide:function(b){var d=this.setting,e=this.element;(void 0===b||b)&&d.hide(e),d.push&&a("body").css("left","0px"),e.css(d.position,"-"+c(e)),e.data("slide-reveal",!1),(void 0===b||b)&&setTimeout(function(){d.overlay&&a(".slide-reveal-overlay").hide(),d.hidden(e)},d.speed)},toggle:function(a){var b=this.element;b.data("slide-reveal")?this.hide(a):this.show(a)}}),a.fn.slideReveal=function(b,c){return void 0!==b&&"string"==typeof b?this.each(function(){var d=a(this).data("slide-reveal-model");"show"===b?d.show(c):"hide"===b?d.hide(c):"toggle"===b&&d.toggle(c)}):this.each(function(){a(this).data("slide-reveal-model")&&a(this).data("slide-reveal-model").remove(),a(this).data("slide-reveal-model",new d(a(this),b))}),this}}(jQuery);
/*!
* mqGenie v0.5.0
*
* Adjusts CSS media queries in browsers that include the scrollbar's width in the viewport width so they fire at the intended size
*
* Returns the mqGenie object containing .adjusted, .width & fontSize for use in re-calculating media queries in JavaScript with mqAdjust(string)
*
* Copyright (c) 2014 Matt Stow
*
* http://mattstow.com
*
* Licensed under the MIT license
*
* Modified for use with CuyahogaRecycles.org
*/
;(function(window, document) {
	if (!document.addEventListener) {
		window.mqGenie = {
			adjustMediaQuery: function(mediaQuery) {
				return mediaQuery;
			}
		}

		return;
	}

	function processRules(stylesheet, processor) {
		var rules = stylesheet.cssRules ? stylesheet.cssRules : stylesheet.media,
			rule,
			processed = [],
			i = 0,
			length = rules.length;

		for (i; i < length; i ++) {
			rule = rules[i];

			if (processor(rule))
				processed.push(rule);
		}

		return processed;
	}

	function getMediaQueries(stylesheet) {
		return processRules(stylesheet, function (rule) {
			return rule.constructor === CSSMediaRule;
		});
	}

	function sameOrigin(url) {
		var loc = window.location,
			a = document.createElement('a');

		a.href = url;

		return a.hostname === loc.hostname && a.protocol === loc.protocol;
	}

	function isInline(stylesheet) {
		return stylesheet.ownerNode.constructor === HTMLStyleElement;
	}

	function isValidExternal(stylesheet) {
		return stylesheet.href && sameOrigin(stylesheet.href);
	}

	function getStylesheets() {
		var sheets = document.styleSheets,
			sheet,
			length = sheets.length,
			i = 0,
			valid = [];

		for (i; i < length; i++) {
			sheet = sheets[i];

			if (isValidExternal(sheet) || isInline(sheet))
				valid.push(sheet);
		}

		return valid;
	}

	document.addEventListener('DOMContentLoaded', function() {
		window.mqGenie = (function() {
			var html = document.documentElement;

			// html.style.overflowY = 'scroll';

			var width = window.innerWidth - html.clientWidth,
				props = {
					adjusted: width > 0,
					fontSize: parseFloat(window.getComputedStyle(html).getPropertyValue('font-size')),
					width: width,
					adjustMediaQuery: function(mediaQuery) {
						if (!mqGenie.adjusted)
							return mediaQuery;

						var mq = mediaQuery.replace(/\d+px/gi, function(c) {
							return parseInt(c, 10) + mqGenie.width + 'px';
						});

						mq = mq.replace(/\d.+?em/gi, function(c) {
							return ((parseFloat(c) * mqGenie.fontSize) + mqGenie.width) / mqGenie.fontSize + 'em';
						});

						return mq;
					}
				};

			if (props.adjusted) {
				if ('WebkitAppearance' in html.style) {
					var chromeRX = /Chrome\/(\d*?\.\d*?\.\d*?\.\d*?)\s/g,
						chrome = navigator.userAgent.match(chromeRX),
						chromeVersion;

					if (chrome) {
						chrome = chrome[0].replace(chromeRX, '$1');
						chromeVersion = chrome.split('.');
						chromeVersion[0] = parseInt(chromeVersion[0]);
						chromeVersion[2] = parseInt(chromeVersion[2]);
						chromeVersion[3] = parseInt(chromeVersion[3]);

						if (chromeVersion[0] <= 29) {
							if (chromeVersion[0] === 29 && chromeVersion[2] < 1548 && chromeVersion[3] < 57) {
								props.adjusted = false;
							}
							else if (chromeVersion[0] < 29) {
								props.adjusted = false;
							}
						}
					}
					else {
						props.adjusted = false;
					}

					if (!props.adjusted)
						return props;
				}

				var stylesheets = getStylesheets(),
					stylesheetsLength = stylesheets.length,
					i = 0,
					mediaQueries,
					mediaQueriesLength;

				for (i; i < stylesheetsLength; i++) {
					mediaQueries = getMediaQueries(stylesheets[i]);
					mediaQueriesLength = mediaQueries.length;

					for (var j = 0; j < mediaQueriesLength; j++) {
						mediaQueries[j].media.mediaText = mediaQueries[j].media.mediaText.replace(/m(in|ax)-width:\s*(\d|\.)+(px|em)/gi, function(strA) {
							if (strA.match('px')) {
								return strA.replace(/\d+px/gi, function(strB) {
									return parseInt(strB, 10) + props.width + 'px';
								});
							}
							else {
								return strA.replace(/\d.+?em/gi, function(strB) {
									return ((parseFloat(strB) * props.fontSize) + props.width) / props.fontSize + 'em';
								});
							}
						});
					}
				}
			}

			return props;
		})();
	});
})(window, document);

!function(t){"use strict";var s=function(s,e){this.el=t(s),this.options=t.extend({},t.fn.typed.defaults,e),this.isInput=this.el.is("input"),this.attr=this.options.attr,this.showCursor=this.isInput?!1:this.options.showCursor,this.elContent=this.attr?this.el.attr(this.attr):this.el.text(),this.contentType=this.options.contentType,this.typeSpeed=this.options.typeSpeed,this.startDelay=this.options.startDelay,this.backSpeed=this.options.backSpeed,this.backDelay=this.options.backDelay,this.stringsElement=this.options.stringsElement,this.strings=this.options.strings,this.strPos=0,this.arrayPos=0,this.stopNum=0,this.loop=this.options.loop,this.loopCount=this.options.loopCount,this.curLoop=0,this.stop=!1,this.cursorChar=this.options.cursorChar,this.shuffle=this.options.shuffle,this.sequence=[],this.build()};s.prototype={constructor:s,init:function(){var t=this;t.timeout=setTimeout(function(){for(var s=0;s<t.strings.length;++s)t.sequence[s]=s;t.shuffle&&(t.sequence=t.shuffleArray(t.sequence)),t.typewrite(t.strings[t.sequence[t.arrayPos]],t.strPos)},t.startDelay)},build:function(){var s=this;if(this.showCursor===!0&&(this.cursor=t('<span class="typed-cursor">'+this.cursorChar+"</span>"),this.el.after(this.cursor)),this.stringsElement){s.strings=[],this.stringsElement.hide();var e=this.stringsElement.find("p");t.each(e,function(e,i){s.strings.push(t(i).html())})}this.init()},typewrite:function(t,s){if(this.stop!==!0){var e=Math.round(70*Math.random())+this.typeSpeed,i=this;i.timeout=setTimeout(function(){var e=0,r=t.substr(s);if("^"===r.charAt(0)){var o=1;/^\^\d+/.test(r)&&(r=/\d+/.exec(r)[0],o+=r.length,e=parseInt(r)),t=t.substring(0,s)+t.substring(s+o)}if("html"===i.contentType){var n=t.substr(s).charAt(0);if("<"===n||"&"===n){var a="",h="";for(h="<"===n?">":";";t.substr(s).charAt(0)!==h;)a+=t.substr(s).charAt(0),s++;s++,a+=h}}i.timeout=setTimeout(function(){if(s===t.length){if(i.options.onStringTyped(i.arrayPos),i.arrayPos===i.strings.length-1&&(i.options.callback(),i.curLoop++,i.loop===!1||i.curLoop===i.loopCount))return;i.timeout=setTimeout(function(){i.backspace(t,s)},i.backDelay)}else{0===s&&i.options.preStringTyped(i.arrayPos);var e=t.substr(0,s+1);i.attr?i.el.attr(i.attr,e):i.isInput?i.el.val(e):"html"===i.contentType?i.el.html(e):i.el.text(e),s++,i.typewrite(t,s)}},e)},e)}},backspace:function(t,s){if(this.stop!==!0){var e=Math.round(70*Math.random())+this.backSpeed,i=this;i.timeout=setTimeout(function(){if("html"===i.contentType&&">"===t.substr(s).charAt(0)){for(var e="";"<"!==t.substr(s).charAt(0);)e-=t.substr(s).charAt(0),s--;s--,e+="<"}var r=t.substr(0,s);i.attr?i.el.attr(i.attr,r):i.isInput?i.el.val(r):"html"===i.contentType?i.el.html(r):i.el.text(r),s>i.stopNum?(s--,i.backspace(t,s)):s<=i.stopNum&&(i.arrayPos++,i.arrayPos===i.strings.length?(i.arrayPos=0,i.shuffle&&(i.sequence=i.shuffleArray(i.sequence)),i.init()):i.typewrite(i.strings[i.sequence[i.arrayPos]],s))},e)}},shuffleArray:function(t){var s,e,i=t.length;if(i)for(;--i;)e=Math.floor(Math.random()*(i+1)),s=t[e],t[e]=t[i],t[i]=s;return t},reset:function(){var t=this;clearInterval(t.timeout);var s=this.el.attr("id");this.el.after('<span id="'+s+'"/>'),this.el.remove(),"undefined"!=typeof this.cursor&&this.cursor.remove(),t.options.resetCallback()}},t.fn.typed=function(e){return this.each(function(){var i=t(this),r=i.data("typed"),o="object"==typeof e&&e;r||i.data("typed",r=new s(this,o)),"string"==typeof e&&r[e]()})},t.fn.typed.defaults={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,shuffle:!1,backDelay:500,loop:!1,loopCount:!1,showCursor:!0,cursorChar:"|",attr:null,contentType:"html",callback:function(){},preStringTyped:function(){},onStringTyped:function(){},resetCallback:function(){}}}(window.jQuery);
/**
 * uisearch.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 *
 * Modified for use with CuyahogaRecycles.org
 */
;( function( window ) {

  'use strict';

  // EventListener | @jon_neal | //github.com/jonathantneal/EventListener
  !window.addEventListener && window.Element && (function () {
     function addToPrototype(name, method) {
      Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = method;
     }

     var registry = [];

     addToPrototype("addEventListener", function (type, listener) {
      var target = this;

      registry.unshift({
       __listener: function (event) {
        event.currentTarget = target;
        event.pageX = event.clientX + document.documentElement.scrollLeft;
        event.pageY = event.clientY + document.documentElement.scrollTop;
        event.preventDefault = function () { event.returnValue = false };
        event.relatedTarget = event.fromElement || null;
        event.stopPropagation = function () { event.cancelBubble = true };
        event.relatedTarget = event.fromElement || null;
        event.target = event.srcElement || target;
        event.timeStamp = +new Date;

        listener.call(target, event);
       },
       listener: listener,
       target: target,
       type: type
      });

      this.attachEvent("on" + type, registry[0].__listener);
     });

     addToPrototype("removeEventListener", function (type, listener) {
      for (var index = 0, length = registry.length; index < length; ++index) {
       if (registry[index].target == this && registry[index].type == type && registry[index].listener == listener) {
        return this.detachEvent("on" + type, registry.splice(index, 1)[0].__listener);
       }
      }
     });

     addToPrototype("dispatchEvent", function (eventObject) {
      try {
       return this.fireEvent("on" + eventObject.type, eventObject);
      } catch (error) {
       for (var index = 0, length = registry.length; index < length; ++index) {
        if (registry[index].target == this && registry[index].type == eventObject.type) {
           registry[index].call(this, eventObject);
        }
       }
      }
     });
  })();

  // http://stackoverflow.com/a/11381730/989439
  function mobilecheck() {
    var check = false;
    (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  // http://www.jonathantneal.com/blog/polyfills-and-prototypes/
  !String.prototype.trim && (String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  });

  function UISearch( el, options ) {
    this.el = el;
    this.inputEl = el.querySelector( '.form > input.sb-search-input' );
    this._initEvents();
  }

  UISearch.prototype = {
    _initEvents : function() {
      var self = this,
        initSearchFn = function( ev ) {
          ev.stopPropagation();
          // trim its value
          self.inputEl.value = self.inputEl.value.trim();

          if( !classie.has( self.el, 'sb-search-open' ) ) { // open it
            ev.preventDefault();
            self.open();
          }
          else if( classie.has( self.el, 'sb-search-open' ) && /^\s*$/.test( self.inputEl.value ) ) { // close it
            ev.preventDefault();
            self.close();
          }
        }

      this.el.addEventListener( 'click', initSearchFn );
      this.el.addEventListener( 'touchstart', initSearchFn );
      this.inputEl.addEventListener( 'click', function( ev ) { ev.stopPropagation(); });
      this.inputEl.addEventListener( 'touchstart', function( ev ) { ev.stopPropagation(); } );
    },
    open : function() {
      var self = this;
      classie.add( this.el, 'sb-search-open' );
      $('.page-header-upper-right .search-container').addClass('open');
      // focus the input
      if( !mobilecheck() ) {
        this.inputEl.focus();
      }
      // close the search input if body is clicked
      var bodyFn = function( ev ) {
        self.close();
        this.removeEventListener( 'click', bodyFn );
        this.removeEventListener( 'touchstart', bodyFn );
      };
      document.addEventListener( 'click', bodyFn );
      document.addEventListener( 'touchstart', bodyFn );
    },
    close : function() {
      this.inputEl.blur();
      classie.remove( this.el, 'sb-search-open' );
      $('.page-header-upper-right .search-container').removeClass('open');
    }
  }

  // add to global namespace
  window.UISearch = UISearch;

} )( window );
