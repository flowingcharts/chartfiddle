/*! flowingcharts v0.1.0 2016-04-05 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Canvas} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          canvas/Canvas 
 * @requires        utils/util
 * @requires        utils/canvas
 * @requires        utils/dom
 * @requires        utils/svg
 */

// Required modules.
var util       = require('../utils/util');
var canvasUtil = require('../utils/canvas');
var svgUtil    = require('../utils/svg');
var dom        = require('../utils/dom');

/** 
 * @classdesc Class for graphics libraries.
 *
 * @class
 * @alias Canvas
 * @since 0.1.0
 * @constructor
 *
 * @param {string}                      renderer    The renderer 'svg' or 'canvas'.
 * @param {CartesianCoords|PolarCoords} coords      The coordinate system. 
 */
function Canvas (renderer, coords)
{
    // Private instance members.  
    this._coords    = coords;
    this._items     = [];

    // Choose which canvas functions to use.
    if (renderer === 'svg') this._g = svgUtil;
    else                    this._g = canvasUtil;

    // Get the actual drawing canvas.
    this.canvas = this._g.getCanvas();
}

/** 
 * Appends the canvas to a html element.
 *
 * @since 0.1.0
 *
 * @return {HTMLElement} container The html element.
 */
Canvas.prototype.appendTo = function (container)
{
    container.appendChild(this.canvas);
};

// Geometry.

/** 
 * Get the width of the canvas.
 *
 * @since 0.1.0
 *
 * @return {number} The width.
 */
Canvas.prototype.width = function ()
{
    return parseInt(this.canvas.getAttribute('width'));
};

/** 
 * Get the height of the canvas.
 *
 * @since 0.1.0
 *
 * @return {number} The height.
 */
Canvas.prototype.height = function ()
{
    return parseInt(this.canvas.getAttribute('height'));
};

/** 
 * Set the size of the canvas.
 *
 * @since 0.1.0
 *
 * @param {number} w The width.
 * @param {number} h The height.
 */
Canvas.prototype.setSize = function (w, h)
{
    //<validation>
    if (!util.isNumber(w))  throw new Error('Canvas.setSize(w): w must be a number.');
    if (w < 0)              throw new Error('Canvas.setSize(w): w must be >= 0.');
    if (!util.isNumber(h))  throw new Error('Canvas.setSize(h): h must be a number.');
    if (h < 0)              throw new Error('Canvas.setSize(h): h must be >= 0.');
    //</validation>

    // Canvas size.
    if (w !== this.width() || h !== this.height()) dom.attr(this.canvas, {width:w, height:h});
};

// Create canvas items.

/** 
 * Creates a marker.
 *
 * @since 0.1.0
 *
 * @param {string} type     The marker type.
 * @param {number} [cx]     The x position of the center of the marker (data units).
 * @param {number} [cy]     The y position of the center of the marker (data units).
 * @param {number} [size]   The size of the marker (pixel units).
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.marker = function (type, cx, cy, size)
{
    var item = this.getItem(type, {cx:cx, cy:cy, size:size, units:'data'});
    item.marker = true;
    return item;
};

/** 
 * Creates a shape.
 *
 * @since 0.1.0
 *
 * @param {string} type The shape type.
 * @param {number} [x]  The x position of the top left corner (data units).
 * @param {number} [y]  The y position of the top left corner (data units).
 * @param {number} [w]  The width (data units).
 * @param {number} [h]  The height (data units).
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.shape = function (type, x, y, w, h)
{
    var item = this.getItem(type, {x:x, y:y, width:w, height:h, units:'data'});
    item.shape = true;
    return item;
};

/** 
 * Creates a circle.
 *
 * @since 0.1.0
 *
 * @param {number} [cx]             The x position of the center of the circle.
 * @param {number} [cy]             The y position of the center of the circle
 * @param {number} [r]              The radius of the circle.
 * @param {number} [units = pixel]  The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.circle = function (cx, cy, r, units)
{
    return this.getItem('circle', {cx:cx, cy:cy, r:r, units:units});
};

/** 
 * Creates an ellipse.
 *
 * @since 0.1.0
 *
 * @param {number} [cx]             The x position of the center of the ellipse.
 * @param {number} [cy]             The y position of the center of the ellipse
 * @param {number} [rx]             The x radius of the ellipse.
 * @param {number} [ry]             The y radius of the ellipse.
 * @param {number} [units = pixel]  The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.ellipse = function (cx, cy, rx, ry, units)
{
    return this.getItem('ellipse', {cx:cx, cy:cy, rx:rx, ry:ry, units:units});
};

/** 
 * Creates a rectangle.
 *
 * @since 0.1.0
 *
 * @param {number} [x]              The x position of the top left corner.
 * @param {number} [y]              The y position of the top left corner.
 * @param {number} [w]              The width.
 * @param {number} [h]              The height.
 * @param {number} [units = pixel]  The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.rect = function (x, y, w, h, units)
{
    return this.getItem('rect', {x:x, y:y, width:w, height:h, units:units});
};

/** 
 * Creates a line.
 *
 * @since 0.1.0
 *
 * @param {number} [x1]             The x position of point 1.
 * @param {number} [y1]             The y position of point 1.
 * @param {number} [x2]             The x position of point 2.
 * @param {number} [y2]             The y position of point 2.
 * @param {number} [units = pixel]  The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.line = function (x1, y1, x2, y2, units)
{
    return this.getItem('line', {x1:x1, y1:y1, x2:x2, y2:y2, units:units});
};

/** 
 * Creates a polyline.
 *
 * @since 0.1.0
 *
 * @param {number[]}    arrCoords       An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {number}      [units = pixel] The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.polyline = function (arrCoords, units)
{
    return this.getItem('polyline', {points:arrCoords, units:units});
};

/** 
 * Creates a polygon.
 *
 * @since 0.1.0
 *
 * @param {number[]}    arrCoords       An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {number}      [units = pixel] The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.polygon = function (arrCoords, units)
{
    return this.getItem('polygon', {points:arrCoords, units:units});
};

// Drawing.

/** 
 * Empties the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.empty = function ()
{
    this._items = [];
    this._g.empty(this.canvas);
};

/** 
 * Renders the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.render = function ()
{
    this._g.clear(this.canvas);
    
    var n = this._items.length;
    for (var i = 0; i < n; i++)  
    {
        var item = this._items[i];
        this.drawItem(item);
    }
};

/** 
 * Draws an item.
 *
 * @since 0.1.0
 *
 * @param {Object} item A canvas item.
 */
Canvas.prototype.drawItem = function (item)
{
    var p;
    if (this._coords !== undefined && item.coords.units === 'data') p = this.getPixelUnits(item);   // Canvas using data units.
    else                                                            p = item.coords;                // Canvas using pixel units.

    if (item.marker) 
    {
        // coords{cx, cy, size}
        var r = p.size / 2;
        switch(item.type)
        {
            case 'circle'   : this._g.circle(item.context, p.cx, p.cy, r, item.style); break;
            case 'ellipse'  : this._g.ellipse(item.context, p.cx, p.cy, r, r, item.style); break;
            case 'rect'     : this._g.rect(item.context, p.cx-r, p.cy-r, p.size, p.size, item.style); break;
        }
    } 
    else if (item.shape) 
    {
        // coords{x, y, width, height}
        switch(item.type)
        {
            case 'rect'     : this._g.rect(item.context, p.x, p.y, p.width, p.height, item.style); break;
            case 'ellipse'  : this._g.ellipse(item.context, p.x+(p.width/2), p.y+(p.height/2), p.width/2, p.height/2, item.style); break;
        }
    }
    else
    {
        switch(item.type)
        {
            case 'circle'   : this._g.circle(item.context, p.cx, p.cy, p.r, item.style); break;
            case 'ellipse'  : this._g.ellipse(item.context, p.cx, p.cy, p.rx, p.ry, item.style); break;
            case 'rect'     : this._g.rect(item.context, p.x, p.y, p.width, p.height, item.style);  break;
            case 'line'     : this._g.line(item.context, p.x1, p.y1, p.x2, p.y2, item.style); break;
            case 'polygon'  : this._g.polygon(item.context, p.points, item.style); break;
            case 'polyline' : this._g.polyline(item.context, p.points, item.style); break;
        }
    }
};

/** 
 * Adds an item.
 *
 * @since 0.1.0
 *
 * @param {Object} item A canvas item.
 *
 * @return {Object} The canvas item.
 */
Canvas.prototype.addItem = function (item)
{
    item.context = this._g.getContext(this.canvas, item.type);
    this._items.push(item);
    return item;
};

/** 
 * Returns a canvas item.
 *
 * @since 0.1.0
 * @private
 *
 * @param {string} type     The shape type.
 * @param {Object} coords   The coords.
 *
 * @return {Object} The canvas item.
 */
Canvas.prototype.getItem = function (type, coords)
{
    return this.addItem({type:type, coords:coords});
};

/** 
 * Returns a hit event for the nearest item.
 *
 * @since 0.1.0
 *
 * @param {number} x The x pixel coord.
 * @param {number} y The y pixel coord.
 *
 * @return {Object} The canvas item.
 */
Canvas.prototype.hitEvent = function (x, y)
{
    var items = [];
    var shortestDistance = Infinity;

    var n = this._items.length;
    for (var i = 0; i < n; i++)  
    {
        var item = this._items[i];
        var p    = this.getPixelUnits(item);
        var dx   = x - p.cx;
        var dy   = y - p.cy;
        var dp   = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (dp === shortestDistance) 
        {
            items.push(item);
        }
        else if (dp < shortestDistance) 
        {
            items = [];
            items.push(item);
            shortestDistance = dp;
        }
    }

    if (items.length > 0)
    {
        var d = this.getPixelUnits(items[0]);
        return {
            items    : items, 
            distance : shortestDistance, 
            pixelX   : d.cx, 
            pixelY   : d.cy
        };
    }
    else return undefined;
};

/** 
 * Gets the pixel units for an item.
 *
 * @since 0.1.0
 *
 * @param {Object}                      item    The canvas item.
 * @param {CartesianCoords|PolarCoords} coords  The coordinate system 
 */
Canvas.prototype.getPixelUnits = function (item)
{
    var pixelUnits = {};

    if (item.marker) 
    {
        // coords{cx, cy, size}
        pixelUnits.cx   = this._coords.getPixelX(item.coords.cx);
        pixelUnits.cy   = this._coords.getPixelY(item.coords.cy); 
        pixelUnits.size = item.coords.size; 
    } 
    else if (item.shape) 
    {
        // coords{x, y, width, height}
        pixelUnits.x      = this._coords.getPixelX(item.coords.x);
        pixelUnits.y      = this._coords.getPixelY(item.coords.y); 
        pixelUnits.width  = this._coords.getPixelDimensionX(item.coords.width);
        pixelUnits.height = this._coords.getPixelDimensionY(item.coords.height); 
    }
    else
    {
        switch(item.type)
        {
            // coords{cx, cy, r}
            case 'circle':      
                pixelUnits.cx = this._coords.getPixelX(item.coords.cx);
                pixelUnits.cy = this._coords.getPixelY(item.coords.cy); 
                pixelUnits.r  = item.coords.r; 
            break;
            // coords{cx, cy, rx, ry}
            case 'ellipse':     
                pixelUnits.cx = this._coords.getPixelX(item.coords.cx);
                pixelUnits.cy = this._coords.getPixelY(item.coords.cy); 
                pixelUnits.rx = this._coords.getPixelDimensionX(item.coords.rx);
                pixelUnits.ry = this._coords.getPixelDimensionY(item.coords.ry); 
            break;
            // coords{x, y, width, height}  
            case 'rect':        
                pixelUnits.x      = this._coords.getPixelX(item.coords.x);
                pixelUnits.y      = this._coords.getPixelY(item.coords.y); 
                pixelUnits.width  = this._coords.getPixelDimensionX(item.coords.width);
                pixelUnits.height = this._coords.getPixelDimensionY(item.coords.height); 
            break;
            // coords{x1, y1, x2, y2}
            case 'line':          
                pixelUnits.x1 = this._coords.getPixelX(item.coords.x1);
                pixelUnits.y1 = this._coords.getPixelY(item.coords.y1); 
                pixelUnits.x2 = this._coords.getPixelX(item.coords.x2);
                pixelUnits.y2 = this._coords.getPixelY(item.coords.y2); 
            break;
            // coords{points}
            case 'polyline':    
                pixelUnits.points = this._coords.getPixelArray(item.coords.points);
            break;
            // coords{points} 
            case 'polygon':      
                pixelUnits.points = this._coords.getPixelArray(item.coords.points);
            break;
        }
    }

    return pixelUnits;
};

module.exports = Canvas;
},{"../utils/canvas":13,"../utils/dom":15,"../utils/svg":16,"../utils/util":17}],2:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Chart} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          charts/Chart 
 * @requires        charts/EventHandler
 * @requires        charts/datatip
 * @requires        series/Series
 * @requires        canvas/Canvas
 * @requires        geom/CartesianCoords
 * @requires        geom/PolarCoords
 * @requires        utils/util
 * @requires        utils/dom
 * @requires        utils/svg
 * @requires        utils/color
 */

// Required modules.
var EventHandler        = require('./EventHandler');
var Datatip             = require('./Datatip');
var Canvas              = require('../canvas/Canvas');
var CartesianCoords     = require('../geom/CartesianCoords');
var PolarCoords         = require('../geom/PolarCoords');
var Series              = require('../series/Series');
var util                = require('../utils/util');
var dom                 = require('../utils/dom');
var colorUtil           = require('../utils/color');

/** 
 * @classdesc A base class for charts.
 *
 * @class
 * @alias Chart
 * @since 0.1.0
 * @constructor
 *
 * @param {Object}      options                                 The chart options.
 * @param {HTMLElement} options.container                       The html element that will contain the chart.
 * @param {string}      [options.coordinateSystem = cartesian]  The coordinate system. Possible values are 'cartesian' or 'polar'.
 * @param {string}      [options.renderer = svg]                The graphics renderer. Possible values are 'canvas' or 'svg'.
 * @param {string}      [options.refreshRate = 250]              The rate in ms that graphics are rendered when the chart is resized.
 * @param {number}      [options.padding = 20]                  The chart padding.
 * @param {number}      [options.paddingTop]                    The chart top padding.
 * @param {number}      [options.paddingRight]                  The chart right padding.
 * @param {number}      [options.paddingBottom]                 The chart bottom padding.
 * @param {number}      [options.paddingLeft]                   The chart left padding.
 * @param {number}      [options.border]                        The chart border.
 * @param {number}      [options.borderTop]                     The chart top border.
 * @param {number}      [options.borderRight]                   The chart right border.
 * @param {number}      [options.borderBottom]                  The chart bottom border.
 * @param {number}      [options.borderLeft]                    The chart left border.
 * @param {number}      [options.background]                    The chart background.
 */
function Chart (options)
{
    // Parent html element.
    var container = options.chart.container;
    dom.empty(container);

    // Resize the chart to fit the container when the window resizes.
    var me = this;
    var resizeTimeout;
    dom.on(window, 'resize', function (event)
    {
        // Add a resizeTimeout to stop multiple calls to setSize().
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function ()
        { 
            var bounds = dom.bounds(me._canvasContainer);       
            me.setSize(bounds.width, bounds.height);
        }, me._options.refreshRate);
    });

    this.options(options); 
}

/** 
 * Get or set the options for the chart.
 *
 * @since 0.1.0
 *
 * @param {Object}      options                                 The chart options.
 * @param {HTMLElement} options.container                       The html element that will contain the chart.
 * @param {string}      [options.coordinateSystem = cartesian]  The coordinate system. Possible values are 'cartesian' or 'polar'.
 * @param {string}      [options.renderer = svg]                The graphics renderer. Possible values are 'canvas' or 'svg'.
 * @param {string}      [options.refreshRate = 250]             The rate in ms that graphics are refreshed when the chart is resized.
 * @param {number}      [options.padding = 20]                  The chart padding.
 * @param {number}      [options.paddingTop]                    The chart top padding.
 * @param {number}      [options.paddingRight]                  The chart right padding.
 * @param {number}      [options.paddingBottom]                 The chart bottom padding.
 * @param {number}      [options.paddingLeft]                   The chart left padding.
 * @param {number}      [options.border]                        The chart border.
 * @param {number}      [options.borderTop]                     The chart top border.
 * @param {number}      [options.borderRight]                   The chart right border.
 * @param {number}      [options.borderBottom]                  The chart bottom border.
 * @param {number}      [options.borderLeft]                    The chart left border.
 * @param {number}      [options.background]                    The chart background.
 *
 * @return {Object|Chart}                                       The options if no arguments are supplied, otherwise <code>this</code>.
 */
Chart.prototype.options = function(options)
{
    if (arguments.length > 0)
    {
        this._options = // Default chart options.
        {
            container           : undefined,
            coordinateSystem    : 'cartesian',
            renderer            : 'svg',
            refreshRate         : 250,
            padding             : 20,
            paddingTop          : undefined,
            paddingRight        : undefined,
            paddingBottom       : undefined,
            paddingLeft         : undefined,
            border              : {lineColor : '#cccccc'},
            borderTop           : {lineWidth : 0},
            borderRight         : {lineWidth : 0},
            borderBottom        : {lineWidth : 1},
            borderLeft          : {lineWidth : 1},
            background          : undefined
        };

        // Extend default options with passed in options.
        if (options.chart.border !== undefined) util.extendObject(options.chart.border, this._options.border, false);
        util.extendObject(this._options, options.chart);

        // Holds the canvases.
        this._arrCanvas = [];

        // Get the coords object for the given coordinate system.
        if (this._options.coordinateSystem === 'polar') this._coords = new PolarCoords();     // Polar.
        else                                            this._coords = new CartesianCoords(); // Cartesian.    

        // Container for holding the drawing canvases. We need a relative positioned container so we can stack canvases inside it using absolute positioning.
        this._canvasContainer  = dom.createElement('div');
        dom.style(this._canvasContainer , {position : 'relative', width:'100%', height:'100%'});
        dom.appendChild(this._options.container, this._canvasContainer);

        // Chart formatting.
        this.addChartFormatting(this._options);

        // Series.
        this._series = [];
        if (options.series)
        {
            for (var i = 0; i < options.series.length; i++)  
            {
                // Create a canvas for the series.
                var seriesCanvas = this.addCanvas();

                // Create the series.
                var s = new Series(seriesCanvas, options.series[i]);
                this._series.push(s);                    
            }
        }

        // Interaction canvas.
        this._uiCanvas = this.addCanvas();

        // Event handler.
        this.addEventHandler(this._options);

        // Set charts size to that of the container - it will subsequently be rendered.
        var bounds = dom.bounds(this._canvasContainer);       
        this.setSize(bounds.width, bounds.height);

        this._datatip = new Datatip(this._canvasContainer);

        return this;
    }
    else return this._options;
};

/** 
 * Add a canvas.
 *
 * @since 0.1.0
 * @private
 *
 * @return {Canvas} The added canvas.
 */
Chart.prototype.addCanvas = function()
{
    var canvas = new Canvas(this._options.renderer, this._coords);
    canvas.appendTo(this._canvasContainer);   
    this._arrCanvas.push(canvas);
    return canvas;
};

/** 
 * Add chart formatting.
 *
 * @since 0.1.0
 * @private
 */
Chart.prototype.addChartFormatting = function (options)
{
    // Background canvas.
    this._backgroundCanvas = this.addCanvas();

    // Background elements.
    if (options.background !== undefined) 
    {
        this._background = this._backgroundCanvas.rect();
        this._background.style = options.background;
    }

    // Border elements.
    util.extendObject(options.borderTop,    options.border, false);
    util.extendObject(options.borderRight,  options.border, false);
    util.extendObject(options.borderBottom, options.border, false);
    util.extendObject(options.borderLeft,   options.border, false);
    this._borderTop           = this._backgroundCanvas.line();
    this._borderRight         = this._backgroundCanvas.line();
    this._borderBottom        = this._backgroundCanvas.line();
    this._borderLeft          = this._backgroundCanvas.line();
    this._borderTop.style     = options.borderTop;
    this._borderRight.style   = options.borderRight;
    this._borderBottom.style  = options.borderBottom;
    this._borderLeft.style    = options.borderLeft;

    // Padding elements.
    options.paddingTop    = options.paddingTop !== undefined ? options.paddingTop : options.padding;
    options.paddingRight  = options.paddingRight !== undefined ? options.paddingRight : options.padding;
    options.paddingBottom = options.paddingBottom !== undefined ? options.paddingBottom : options.padding;
    options.paddingLeft   = options.paddingTop !== undefined ? options.paddingTop : options.padding;
};

/** 
 * Add the event handler.
 *
 * @since 0.1.0
 * @private
 */
Chart.prototype.addEventHandler = function (options)
{
    var me = this;

    // Event handler
    var eventHandler = new EventHandler(
    {
        element : this._canvasContainer,
        coords  : this._coords,
        mouseclick : function (event)
        {

        },
        mousedown : function (event)
        {

        },
        mouseup : function (event)
        {

        },
        mousemove : function (event)
        {
            updateTip(event);
            me._datatip.show();
        },
        mouseover : function (event)
        {

        },
        mouseout : function (event)
        {
            me._datatip.fadeOut();    
            me._uiCanvas.empty();
            me.hitX = undefined;
            me.hitY = undefined;
        },
        mousedragstart : function (event)
        {
            me._datatip.hide();
            me._uiCanvas.empty();
            me.hitX = undefined;
            me.hitY = undefined;
        },
        mousedrag : function (event)
        {

        },
        mousedragend : function (event)
        {   

        },
        touchdown : function (event)
        {

        },
        touchdownoutside : function (event)
        {
            me._datatip.fadeOut();    
            me._uiCanvas.empty();
            me.hitX = undefined;
            me.hitY = undefined;
        },
        touchdragstart : function (event)
        {
            me._datatip.hide();
            me._uiCanvas.empty();
            me.hitX = undefined;
            me.hitY = undefined;
        },
        touchup : function (event)
        {
            updateTip(event);
            me._datatip.show();
        }
    });

    function updateTip(event)
    { 
        var hitEvent = me.hitEvent(event.pixelX, event.pixelY);
        if (hitEvent !== undefined && (hitEvent.pixelX !== me.hitX || hitEvent.pixelY !== me.hitY))
        {
            me._uiCanvas.empty();
            me.hitX = hitEvent.pixelX;
            me.hitY = hitEvent.pixelY;



            var highlightItem = util.cloneObject(hitEvent.items[0]);
            me._uiCanvas.addItem(highlightItem);

            if (highlightItem.marker === true)
            {
                highlightItem.style.fillOpacity = 0.3;
                highlightItem.style.lineColor   = highlightItem.style.fillColor;
                highlightItem.coords.size       = highlightItem.coords.size * 2;
            }
            else if (highlightItem.shape === true)
            {

            }

            //me._datatip.html('1')
           //me._datatip.html(highlightItem.coords.cx+' '+highlightItem.coords.cy)
            me._datatip.options({borderColor : highlightItem.style.fillColor, position: 'top'})
            .html('Tooltip that should always be visible in viewport X and its just too long: '+highlightItem.coords.cx+ 
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+highlightItem.coords.cy+
                ' <br/> Tooltip that should always be visible in viewport X and its just too long: '+highlightItem.coords.cx+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+highlightItem.coords.cy+
                ' <br/> Tooltip that should always be visible in viewport X and its just too long: '+highlightItem.coords.cx+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+highlightItem.coords.cy)
            .position(hitEvent.pixelX, hitEvent.pixelY);

            me._uiCanvas.render();
        }

            /*me._datatip.html('Tooltip that should always be visible in viewport X and its just too long: '+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+
                ' <br/> Tooltip that should always be visible in viewport X and its just too long: '+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+
                ' <br/> Tooltip that should always be visible in viewport X and its just too long: '+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: ');
            me._datatip.position(event.pixelX, event.pixelY, 'top');*/

    }
};

/** 
 * Returns a hit event for the nearest item.
 *
 * @since 0.1.0
 *
 * @param {number} x The x pixel coord.
 * @param {number} y The y pixel coord.
 *
 * @return {CanvasItem} The canvas item.
 */
Chart.prototype.hitEvent = function(x, y)
{
    var nearestEvent;
    var shortestDistance = Infinity;
    for (var i = 0; i < this._series.length; i++)  
    {
        var s = this._series[i];
        var event = s.hitEvent(x, y);
        if (event.distance < shortestDistance) 
        {
            nearestEvent = event; 
            shortestDistance = event.distance;
        }
    }
    return nearestEvent;
};

/** 
 * Set the size of the canvas.
 *
 * @since 0.1.0
 * @private
 *
 * @param {number} w The width.
 * @param {number} h The height.
 */
Chart.prototype.setSize = function (w, h)
{
    //<validation>
    if (!util.isNumber(w))  throw new Error('Chart.setSize(w): w must be a number.');
    if (w < 0)              throw new Error('Chart.setSize(w): w must be >= 0.');
    if (!util.isNumber(h))  throw new Error('Chart.setSize(h): h must be a number.');
    if (h < 0)              throw new Error('Chart.setSize(h): h must be >= 0.');
    //</validation>

    // Set the viewPort.
    var x1Chart = this._options.paddingLeft;
    var y1Chart = this._options.paddingTop;
    var x2Chart = w - this._options.paddingRight;
    var y2Chart = h - this._options.paddingBottom;
    var wChart  = x2Chart - x1Chart;
    var hChart  = y2Chart - y1Chart;
    this._coords.viewPort(x1Chart, y1Chart, wChart, hChart);

    // Set the coords for the background and border elements.
    if (this._background !== undefined)     this._background.coords    = {x:x1Chart,  y:y1Chart, width:wChart, height:hChart};
    if (this._borderTop !== undefined)      this._borderTop.coords     = {x1:x1Chart, y1:y1Chart, x2:x2Chart, y2:y1Chart};
    if (this._borderRight !== undefined)    this._borderRight.coords   = {x1:x2Chart, y1:y1Chart, x2:x2Chart, y2:y2Chart};
    if (this._borderBottom !== undefined)   this._borderBottom.coords  = {x1:x1Chart, y1:y2Chart, x2:x2Chart, y2:y2Chart};
    if (this._borderLeft !== undefined)     this._borderLeft.coords    = {x1:x1Chart, y1:y1Chart, x2:x1Chart, y2:y2Chart};

    // Set the canvas sizes.
    for (var i = 0; i < this._arrCanvas.length; i++)  {this._arrCanvas[i].setSize(w, h);}

    this.render();
};

/** 
 * Renders the graphics.
 *
 * @since 0.1.0
 */
Chart.prototype.render = function()
{
    window.console.log("render");

    // Set the viewbox.
    var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    var n = this._series.length;
    for (var i = 0; i < n; i++)  
    {
        var s = this._series[i];
        xMin = Math.min(xMin, s.xMin);
        xMax = Math.max(xMax, s.xMax);
        yMin = Math.min(yMin, s.yMin);
        yMax = Math.max(yMax, s.yMax);
    }
    this._coords.viewBox(xMin, yMin, xMax, yMax);

    // Render the canvases.
    for (var j = 0; j < this._arrCanvas.length; j++)  
    {
        this._arrCanvas[j].render();
    }
};

module.exports = Chart;
},{"../canvas/Canvas":1,"../geom/CartesianCoords":5,"../geom/PolarCoords":7,"../series/Series":12,"../utils/color":14,"../utils/dom":15,"../utils/util":17,"./Datatip":3,"./EventHandler":4}],3:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Datatip} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          datatip 
 * @requires        utils/dom
 * @requires        utils/color
 * @requires        utils/util
 */

// Required modules.
var dom       = require('../utils/dom');
var util      = require('../utils/util');

/** 
 * @classdesc Class for creating a data tip.
 *
 * @class
 * @alias Canvas
 * @since 0.1.0
 * @constructor
 *
 * @param {HTMLElement} container                           The html element that will contain the tip.
 * @param {Object}      [options]                           The tip options.
 * @param {number}      [options.viewportMargin  = 10]      Margin around the viewport edge that the tip isnt allowed to overlap.
 * @param {string}      [options.position        = top]     The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right.
 * @param {number}      [options.padding         = 7]       Padding.
 * @param {string}      [options.fontFamily      = arial]   Font family. 
 * @param {number}      [options.fontSize        = 12]      Font size. 
 * @param {string}      [options.fontColor       = #666666] Font color. 
 * @param {string}      [options.backgroundColor = #fafafa] Background color.
 * @param {string}      [options.borderStyle     = solid]   Border style.
 * @param {string}      [options.borderColor     = #666666] Border color.
 * @param {number}      [options.borderWidth     = 1]       Border width.
 * @param {number}      [options.borderRadius    = 2]       Border radius.
 * @param {number}      [options.shadowSize      = 1]       Shadow size.
 * @param {boolean}     [options.hideShadow      = false]   Hide shadow.
 * @param {number}      [options.notchSize       = 8]       Notch size.
 * @param {number}      [options.notchPadding    = 5]       Padding between notch and edge of tip.
 * @param {boolean}     [options.hideNotch       = false]   Hide notch.
 * @param {boolean}     [options.followMouse     = false]   Should the tip follow the mouse.
 * @param {boolean}     [options.useAnimation    = true]    Should the tip movement be animated.
 * @param {number}      [options.speed           = 0.01]    The speed of the animation. A value between 0 and 1 that controls the speed of the animation.
 * @param {number}      [options.speedIncr       = 0.05]    Increases the animation speed so that it remains more constant and smooth as gaps between start and end points get smaller.
 * @param {number}      [options.snapDistance    = 5]       The distance away from a given xy position at which the tip will snap to a point.
 */
function Datatip (container, options)
{
    // Default options.
    this._options = 
    {
        viewportMargin          : 10,
        position                : 'top',
        padding                 : 7,
        fontFamily              : 'arial',
        fontSize                : 12,
        fontColor               : '#666666',
        backgroundColor         : '#fafafa',
        borderStyle             : 'solid',
        borderColor             : '#666666',
        borderWidth             : 1,
        borderRadius            : 2,
        shadowSize              : 1,
        hideShadow              : false,
        notchSize               : 8,
        notchPadding            : 5,
        hideNotch               : false,
        followMouse             : false,
        useAnimation            : true,
        speed                   : 0.01,
        speedIncr               : 0.05,
        snapDistance            : 5
    };   

    // Tip.
    this._container             = container;    // Tip container.
    this._tipOpacity            = 1;            // Tip opacity.

    // Fade in / out.
    this._fadeOutInterval       = null;         // The id of the setInterval() function that fades out the tip.
    this._fadeOutDelay          = null;         // The id of the setTimeout() function that provides a delay before the tip fades out.

    // Animation.
    this._animationId           = null;         // The id of the requestAnimation() function that moves the tip. 
    this._xTipStart             = 0;            // The starting x position for the tip when its position is changed using animation.
    this._yTipStart             = 0;            // The starting y position for the tip when its position is changed using animation.
    this._xTipEnd               = 0;            // The end x position for the tip when its position is changed using animation.
    this._yTipEnd               = 0;            // The end y position for the tip when its position is changed using animation.
    this._xNotchStart           = 0;            // The starting x position for the notch when its position is changed using animation.
    this._yNotchStart           = 0;            // The starting y position for the notch when its position is changed using animation.
    this._xNotchEnd             = 0;            // The end x position for the notch when its position is changed using animation.
    this._yNotchEnd             = 0;            // The end y position for the notch when its position is changed using animation.

    // Create the data tip.
    this._tip = dom.createElement('div');
    dom.style(this._tip, 
    {
        position                : 'absolute', 
        pointerEvents           : 'none',
        cursor                  : 'default'
    });
    dom.appendChild(this._container, this._tip);

    // Create the data tip text.
    this._tipText = dom.createElement('div'); 
    dom.style(this._tipText, 
    {
        pointerEvents           : 'none',
        overflow                : 'hidden', 
        whiteSpace              : 'nowrap',
        '-webkitTouchCallout'   : 'none',
        '-webkitUserSelect'     : 'none',
        '-khtmlUserSelect'      : 'none',
        '-mozUserSelect'        : 'none',
        '-msUserSelect'         : 'none',
        userSelect              : 'none'
    });
    dom.appendChild(this._tip, this._tipText);

    // Create the notch border.
    this._notchBorder = dom.createElement('div'); 
    dom.style(this._notchBorder, 
    {
        position                : 'absolute',
        pointerEvents           : 'none'
    });
    dom.appendChild(this._tip, this._notchBorder);

    // Create the notch fill.
    this._notchFill = dom.createElement('div');
    dom.style(this._notchFill, 
    {
        position                : 'absolute',
        pointerEvents           : 'none'
    });
    dom.appendChild(this._tip, this._notchFill);

    // Hide the tip.
    this.hide();

    // Apply the options.
    this.options(options);
}

/** 
 * Get or set the options for the data tip.
 *
 * @since 0.1.0
 *
 * @param {Object}      [options]                           The tip options.
 * @param {number}      [options.viewportMargin  = 10]      Margin around the viewport edge that the tip isnt allowed to overlap.
 * @param {string}      [options.position        = top]     The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right.
 * @param {number}      [options.padding         = 7]       Padding.
 * @param {string}      [options.fontFamily      = arial]   Font family. 
 * @param {number}      [options.fontSize        = 12]      Font size. 
 * @param {string}      [options.fontColor       = #666666] Font color. 
 * @param {string}      [options.backgroundColor = #fafafa] Background color.
 * @param {string}      [options.borderStyle     = solid]   Border style.
 * @param {string}      [options.borderColor     = #666666] Border color.
 * @param {number}      [options.borderWidth     = 1]       Border width.
 * @param {number}      [options.borderRadius    = 2]       Border radius.
 * @param {number}      [options.shadowSize      = 1]       Shadow size.
 * @param {boolean}     [options.hideShadow      = false]   Hide shadow.
 * @param {number}      [options.notchSize       = 8]       Notch size.
 * @param {number}      [options.notchPadding    = 5]       Padding between notch and edge of tip.
 * @param {boolean}     [options.hideNotch       = false]   Hide notch.
 * @param {boolean}     [options.followMouse     = false]   Should the tip follow the mouse.
 * @param {boolean}     [options.useAnimation    = true]    Should the tip movement be animated.
 * @param {number}      [options.speed           = 0.01]    The speed of the animation. A value between 0 and 1 that controls the speed of the animation.
 * @param {number}      [options.speedIncr       = 0.05]    Increases the animation speed so that it remains more constant and smooth as gaps between start and end points get smaller.
 * @param {number}      [options.snapDistance    = 5]       The distance away from a given xy position at which the tip will snap to a point.
 *
 * @return {Object|Datatip} The options if no arguments are supplied, otherwise <code>this</code>.
 */
Datatip.prototype.options = function(options)
{
    if (arguments.length > 0)
    {
        // Extend default options with passed in options.
        util.extendObject(this._options, options);

        // Style the data tip.
        dom.style(this._tip, 
        {
            position        : 'absolute', 
            pointerEvents   : 'none',
            cursor          : 'default',
            borderStyle     : this._options.borderStyle,
            borderWidth     : this._options.borderWidth+'px',
            borderColor     : this._options.borderColor, 
            borderRadius    : this._options.borderRadius+'px', 
            fontFamily      : this._options.fontFamily, 
            fontSize        : this._options.fontSize+'px', 
            color           : this._options.fontColor, 
            padding         : this._options.padding+'px',
            background      : this._options.backgroundColor,     
            boxShadow       : this._options.hideShadow === true ? '' : this._options.shadowSize+'px '+this._options.shadowSize+'px '+this._options.shadowSize+'px 0px rgba(200,200,200,1)'
        });

        return this;
    }
    else return this._options;
};

/** 
 * Position the data tip using absolute positioning.
 *
 * @since 0.1.0
 *
 * @param {number} x The absolute x position of the data tip relative to its container.
 * @param {number} y The absolute y position of the data tip relative to its container.
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.position = function (x, y)
{
    var position = this._options.position;

    // Get the tip dimensions relative to the viewport.
    var bContainer = dom.bounds(this._container);
    var bTip       = dom.bounds(this._tip);

    // Style the notch so we can get use its dimensions for calculations.
    var bNotch = {};
    bNotch.width = 0;
    bNotch.height = 0;
    if (this._options.hideNotch === false) bNotch = this._styleNotch(position, this._options.notchSize, this._options.borderWidth, this._options.borderColor, this._options.backgroundColor, bTip.width, bTip.height);

    // Change the position if the tip cant be drawn sensibly using the defined position.
    var xDistFromNotchToEdge, yDistFromNotchToEdge, tipOverlapTopEdge, tipOverlapBottomEdge, tipOverlapLeftEdge, tipOverlapRightEdge;
    if (position === 'top' || position === 'bottom')
    {
        xDistFromNotchToEdge        = (bNotch.width / 2) + this._options.notchPadding + this._options.borderWidth + this._options.viewportMargin;
        var totalTipHeight          = bNotch.height + bTip.height + this._options.viewportMargin;

        var notchOverlapLeftEdge    = xDistFromNotchToEdge - (bContainer.left + x);
        var notchOverlapRightEdge   = (bContainer.left + x) - (dom.viewportWidth() - xDistFromNotchToEdge);

        if      (notchOverlapLeftEdge > 0)  position = 'right';    // x is in the left viewport margin.
        else if (notchOverlapRightEdge > 0) position = 'left';     // x is in the right viewport margin. 
        else if (totalTipHeight > (dom.viewportHeight() / 2))      // Tooltip is too high for both top and bottom so pick side of y with most space.
        {
            if ((bContainer.top + y) < (dom.viewportHeight() / 2)) position = 'bottom';
            else                                                   position = 'top';
        }
        else
        {
            tipOverlapTopEdge      = totalTipHeight - (bContainer.top + y);
            tipOverlapBottomEdge   = (bContainer.top + y) - (dom.viewportHeight() - totalTipHeight);

            if (tipOverlapTopEdge > 0)    position = 'bottom';     // The tip is overlapping the top viewport margin.
            if (tipOverlapBottomEdge > 0) position = 'top';        // The tip is overlapping the bottom viewport margin.
        }
    }
    else if (position === 'left' || position === 'right')
    {
        yDistFromNotchToEdge        = (bNotch.height / 2) + this._options.notchPadding + this._options.borderWidth + this._options.viewportMargin;
        var totalTipWidth           = bNotch.width + bTip.width + this._options.viewportMargin;

        var notchOverlapTopEdge     = yDistFromNotchToEdge - (bContainer.top + y);
        var notchOverlapBottomEdge  = (bContainer.top + y) - (dom.viewportHeight() - yDistFromNotchToEdge);

        if      (notchOverlapTopEdge > 0)    position = 'bottom';  // y is in the top viewport margin.
        else if (notchOverlapBottomEdge > 0) position = 'top';     // y is in the bottom viewport margin. 
        else if (totalTipWidth > (dom.viewportWidth() / 2))        // Tooltip is too wide for both left and right so pick side of x with most space.
        {
            if ((bContainer.left + x) < (dom.viewportWidth() / 2)) position = 'right';
            else                                                   position = 'left';
        }
        else
        {
            tipOverlapLeftEdge      = totalTipWidth - (bContainer.left + x);
            tipOverlapRightEdge     = (bContainer.left + x) - (dom.viewportWidth() - totalTipWidth);

            if (tipOverlapLeftEdge > 0)  position = 'right';       // The tip is overlapping the left viewport margin.
            if (tipOverlapRightEdge > 0) position = 'left';        // The tip is overlapping the right viewport margin.
        }
    }

    // Style the notch a second time as its position may well have changed due to above code.
    if (this._options.hideNotch === false) bNotch = this._styleNotch(position, this._options.notchSize, this._options.borderWidth, this._options.borderColor, this._options.backgroundColor, bTip.width, bTip.height);

    // Adjust the tip bubble so that its centered on the notch.
    var xTip, yTip;
    if (position === 'top')   
    {
        xTip = x - (bTip.width / 2);
        yTip = y - (bTip.height + bNotch.height);
    } 
    else if (position === 'bottom')   
    {
        xTip = x - (bTip.width / 2);
        yTip = y + bNotch.height;
    }
    else if (position === 'left')   
    {
        xTip = x - (bTip.width + bNotch.width);
        yTip = y - (bTip.height / 2);
    }
    else if (position === 'right')   
    {
        xTip = x + bNotch.width;
        yTip = y - (bTip.height / 2);
    }

    // Adjust the tip bubble if its overlapping the viewport margin.
    if (position === 'top' || position === 'bottom')
    {
        // The tip width is greater than viewport width so just anchor the tip to the side that the notch is on.
        if (bTip.width > dom.viewportWidth()) 
        {
            if ((bContainer.left + x) < (dom.viewportWidth() / 2)) xTip = this._options.viewportMargin - bContainer.left;
            else                                                   xTip = dom.viewportWidth() - bContainer.left - this._options.viewportMargin - bTip.width;
        }
        else
        {
            tipOverlapRightEdge = (bContainer.left + xTip + bTip.width) - (dom.viewportWidth() - this._options.viewportMargin);
            tipOverlapLeftEdge  = this._options.viewportMargin - (bContainer.left + xTip);

            if      (tipOverlapRightEdge > 0) xTip -= tipOverlapRightEdge;  // The tip is overlapping the right viewport margin.
            else if (tipOverlapLeftEdge > 0)  xTip += tipOverlapLeftEdge;   // The tip is overlapping the left viewport margin.
        }
    }
    else if (position === 'left' || position === 'right')
    {
        // The tip is height is greater than viewport height so just anchor the tip to the side that the notch is on.
        if (bTip.height > dom.viewportHeight()) 
        {
            if ((bContainer.top + y) < (dom.viewportHeight() / 2)) yTip = this._options.viewportMargin - bContainer.top;
            else                                                   yTip = dom.viewportHeight() - bContainer.top - this._options.viewportMargin - bTip.height;
        } 
        else
        {
            tipOverlapBottomEdge = (bContainer.top + yTip + bTip.height) - (dom.viewportHeight() - this._options.viewportMargin);
            tipOverlapTopEdge    = this._options.viewportMargin - (bContainer.top + yTip);

            if      (tipOverlapBottomEdge > 0) yTip -= tipOverlapBottomEdge; // The tip is overlapping the bottom viewport margin.
            else if (tipOverlapTopEdge > 0)    yTip += tipOverlapTopEdge;    // The tip is overlapping the top viewport margin.
        }
    } 

    // Position the tip and notch.
    this._xTipEnd   = xTip;
    this._yTipEnd   = yTip;
    this._xNotchEnd = x - xTip;
    this._yNotchEnd = y - yTip;

    // Hide notch if its strayed beyond the edge of the tip ie when the xy coords are in the corners of the viewport.
    if (position === 'top' || position === 'bottom')
    {
        xDistFromNotchToEdge = (bNotch.width / 2) + this._options.borderWidth;
        if ((this._xNotchEnd < xDistFromNotchToEdge) || (this._xNotchEnd > (bTip.width - xDistFromNotchToEdge))) this._hideNotch();
    }
    else if (position === 'left' || position === 'right')
    {
        yDistFromNotchToEdge  = (bNotch.height / 2) + this._options.borderWidth;
        if ((this._yNotchEnd < yDistFromNotchToEdge) || (this._yNotchEnd > (bTip.height - yDistFromNotchToEdge))) this._hideNotch();
    } 

    dom.cancelAnimation(this._animationId);

    if (this._options.useAnimation) this._animateTip(this._options.speed, position);
    else
    {
        this._positionTip(this._xTipEnd, this._yTipEnd);
        this._positionNotch(this._xNotchEnd, this._yNotchEnd, position);
    }

    return this;
};

/** 
 * Moves the tip using animation.
 * 
 * @since 0.1.0
 * @private
 *
 * @param {number} speed    A value between 0 and 1 that controls the speed of the animation.
 * @param {string} position The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right.
 */
Datatip.prototype._animateTip = function (speed, position)
{
    // Flag to indicate whether animation is complete.
    // Tests for completion of both tip and notch animations.
    var continueAnimation = false;

    // Position the tip. Test for within snapDistance of end point.
    if ((Math.abs(this._xTipEnd - this._xTipStart) < this._options.snapDistance) && (Math.abs(this._yTipEnd - this._yTipStart) < this._options.snapDistance))
    {
        this._xTipStart = this._xTipEnd;
        this._yTipStart = this._yTipEnd;
    }
    else
    {
        this._xTipStart += (this._xTipEnd - this._xTipStart) * speed;
        this._yTipStart += (this._yTipEnd - this._yTipStart) * speed;
        continueAnimation = true;
    }
    this._positionTip(this._xTipStart, this._yTipStart);

    // Position the notch. Test for within snapDistance of end point.
    if ((Math.abs(this._xNotchEnd - this._xNotchStart) < this._options.snapDistance) && (Math.abs(this._yNotchEnd - this._yNotchStart) < this._options.snapDistance))
    {
        this._xNotchStart = this._xNotchEnd;
        this._yNotchStart = this._yNotchEnd;
    }
    else
    {
        this._xNotchStart += (this._xNotchEnd - this._xNotchStart) * speed;
        this._yNotchStart += (this._yNotchEnd - this._yNotchStart) * speed;
        continueAnimation = true;
    }
    this._positionNotch(this._xNotchStart, this._yNotchStart, position);
        
    // Continue animation until both tip and notch are within one pixel of end point.
    if (continueAnimation) 
    {
        var me = this;
        this._animationId = dom.requestAnimation(function () {me._animateTip(speed += me._options.speedIncr, position);});
    }
};

/** 
 * Positions the tip.
 * 
 * @since 0.1.0
 * @private
 * 
 * @param {number} x The x position.
 * @param {number} y The y position.
 */
Datatip.prototype._positionTip = function (x, y)
{
    dom.style(this._tip, {left:x+'px', top:y+'px'});
};

/** 
 * Positions the notch.
 * 
 * @since 0.1.0
 * @private
 * 
 * @param {number} x            The x position of the notch.
 * @param {number} y            The y position of the notch.
 * @param {string} position     The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right.
 */
Datatip.prototype._positionNotch = function (x, y, position)
{
    var bNotch      = dom.bounds(this._notchBorder);
    var borderWidth = this._options.borderWidth;
    var nx, ny;
    if (position === 'top')
    {
        nx = x - (bNotch.width / 2) - borderWidth;
        ny = bNotch.height * -1;
        dom.style(this._notchBorder, {left:nx+'px', bottom:(ny-borderWidth)+'px', top:'',    right:''});
        dom.style(this._notchFill,   {left:nx+'px', bottom:(ny+1)+'px',           top:'',    right:''});
    } 
    else if (position === 'bottom')
    {
        nx = x - (bNotch.width / 2) - borderWidth;
        ny = bNotch.height * -1;
        dom.style(this._notchBorder, {left:nx+'px', top:(ny-borderWidth)+'px',    bottom:'', right:''});
        dom.style(this._notchFill,   {left:nx+'px', top:(ny+1)+'px',              bottom:'', right:''});
    }
    else if (position === 'left')
    {
        ny = y - (bNotch.height / 2) - borderWidth;
        nx = bNotch.width * -1;
        dom.style(this._notchBorder, {top:ny+'px',  right:(nx-borderWidth)+'px',  bottom:'', left:''});
        dom.style(this._notchFill,   {top:ny+'px',  right:(nx+1)+'px',            bottom:'', left:''});
    }
    else if (position === 'right')
    {
        ny = y - (bNotch.height / 2) - borderWidth;
        nx = bNotch.width * -1;
        dom.style(this._notchBorder, {top:ny+'px',  left:(nx-borderWidth)+'px',   bottom:'', right:''});
        dom.style(this._notchFill,   {top:ny+'px',  left:(nx+1)+'px',             bottom:'', right:''});
    }
};

/** 
 * Styles the notch.
 * 
 * @since 0.1.0
 * @private
 *
 * @param {string} position         The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right.
 * @param {number} size             The notch size.
 * @param {number} borderWidth      The border width.
 * @param {string} borderColor      The border color.
 * @param {string} backgroundColor  The background color.
 * @param {number} tipWidth         The tip width.
 * @param {number} tipHeight        The tip height.
 *
 * @return {DOMRect} The size of the notch and its position relative to the viewport.
 */
Datatip.prototype._styleNotch = function (position, size, borderWidth, borderColor, backgroundColor, tipWidth, tipHeight)
{
    // Notch style uses css border trick.
    var nSize   = Math.max(size, borderWidth);
    var nBorder = nSize+'px solid '+borderColor;
    var nFill   = nSize+'px solid '+backgroundColor;
    var nTrans  = nSize+'px solid transparent';

    if (position === 'top')
    {
        dom.style(this._notchBorder, {borderTop:nBorder,    borderRight:nTrans, borderLeft:nTrans,   borderBottom:'0px'});
        dom.style(this._notchFill,   {borderTop:nFill,      borderRight:nTrans, borderLeft:nTrans,   borderBottom:'0px'});
    }
    else if (position === 'bottom')
    {
        dom.style(this._notchBorder, {borderBottom:nBorder, borderRight:nTrans, borderLeft:nTrans,   borderTop:'0px'});
        dom.style(this._notchFill,   {borderBottom:nFill,   borderRight:nTrans, borderLeft:nTrans,   borderTop:'0px'});
    }
    else if (position === 'left')
    {
        dom.style(this._notchBorder, {borderLeft:nBorder,   borderTop:nTrans,   borderBottom:nTrans, borderRight:'0px'});
        dom.style(this._notchFill,   {borderLeft:nFill,     borderTop:nTrans,   borderBottom:nTrans, borderRight:'0px'});
    }
    else if (position === 'right')
    {
        dom.style(this._notchBorder, {borderRight:nBorder,  borderTop:nTrans,   borderBottom:nTrans, borderLeft:'0px'});
        dom.style(this._notchFill,   {borderRight:nFill,    borderTop:nTrans,   borderBottom:nTrans, borderLeft:'0px'});
    }

    // Hide notch if its bigger than the tip.
    var bNotch = dom.bounds(this._notchBorder);
    if  (((position === 'left' || position === 'right') && ((bNotch.height + (this._options.notchPadding * 2) + (this._options.borderWidth * 2)) > tipHeight)) || 
         ((position === 'top' || position === 'bottom') && ((bNotch.width + (this._options.notchPadding * 2) + (this._options.borderWidth * 2))  > tipWidth)))
    {
        this._hideNotch();
    }

    return bNotch;
};

/** 
 * Hide the notch.
 * 
 * @since 0.1.0
 * @private
 */
Datatip.prototype._hideNotch = function ()
{
    dom.style(this._notchBorder, {borderTop:'0px', borderRight:'0px', borderBottom:'0px', borderLeft:'0px'});
    dom.style(this._notchFill,   {borderTop:'0px', borderRight:'0px', borderBottom:'0px', borderLeft:'0px'});
};

/** 
 * Sets the html for the data tip.
 * 
 * @since 0.1.0
 * 
 * @param {string} html The html.
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.html = function (text)
{
    dom.html(this._tipText, text);
    return this;
};

/** 
 * Shows the data tip.
 * 
 * @since 0.1.0
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.show = function ()
{ 
    if (this._tipOpacity !== 1)
    {
        clearTimeout(this._fadeOutDelay);
        clearInterval(this._fadeOutInterval);
        dom.show(this._tip);
        dom.opacity(this._tip, 1);
        this._tipOpacity = 1;
    }
    return this;
};

/** 
 * Hides the data tip.
 * 
 * @since 0.1.0
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.hide = function ()
{
    if (this._tipOpacity !== 0)
    {
        clearTimeout(this._fadeOutDelay);
        clearInterval(this._fadeOutInterval);
        dom.hide(this._tip);
        dom.opacity(this._tip, 0);
        this._tipOpacity = 0;
    }
    return this;
};

/** 
 * Fade out the  data tip.
 * 
 * @since 0.1.0
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.fadeOut = function ()
{
    var me = this;

    clearTimeout(this._fadeOutDelay);
    this._fadeOutDelay = setTimeout(function ()
    {
        clearInterval(me._fadeOutInterval);
        me._fadeOutInterval = setInterval(function () 
        {
            if (me._tipOpacity <= 0.1) me.hide();
            dom.opacity(me._tip, me._tipOpacity);
            me._tipOpacity -= me._tipOpacity * 0.1;
        }, 20);
    }, 700);
    return this;
};

module.exports = Datatip;
},{"../utils/dom":15,"../utils/util":17}],4:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link EventHandler} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          charts/EventHandler 
 * @requires        utils/dom
 */

// Required modules.
var dom = require('../utils/dom');

/** 
 * @classdesc Event handler class.
 *
 * @class
 * @alias EventHandler
 * @since 0.1.0
 * @constructor
 *
 * @param {CartesianCoords|PolarCoords} coords  The coordinate system. 
 */
function EventHandler (options)
{
    // TODO Chrome, FF and Opera dont dispatch a mouseout event if you leave the browser window whilst hovering an svg element.

    var element         = options.element;
    var coords          = options.coords;
    var delta           = 0;
    var isOver          = false;
    var isDragging      = false;
    var isDown          = false;
    var isDownOver      = false;
    var downX           = 0;
    var downY           = 0;
    var dispatchedOver  = false;
    var elementPosition;
    var pointerPosition;
    var viewportWidth;
    var viewportHeight;

    // Mouse event handler
    function mouseEventHandler (event)
    {
        var clientX = event.clientX;
        var clientY = event.clientY;
        pointerPosition = getPointerPosition(clientX, clientY);
        isPointerOverChart(clientX, clientY);

        var dx   = pointerPosition.x - downX;
        var dy   = pointerPosition.y - downY;
        var diff = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        switch (event.type)
        {
            case 'mousemove' : 
                if (isDragging) 
                {
                    dispatch('mousedrag', event, pointerPosition);
                }  
                else if (isDownOver && (diff > 5)) 
                {
                    isDragging = true;
                    dispatch('mousedragstart', event, {x:downX, y:downY});
                }
                else if (isOver && !isDown && (downX !== pointerPosition.x || downY !== pointerPosition.y)) 
                {
                    dispatch('mousemove', event, pointerPosition);
                }

                if (isOver && !dispatchedOver)
                {
                    dispatchedOver = true;
                    dispatch('mouseover', event, pointerPosition);
                }
                else if (!isOver && dispatchedOver)
                {
                    dispatchedOver = false;
                    dispatch('mouseout', event, pointerPosition);
                }
            break;

            case 'mousedown' : 
                if (isOver)
                {
                    isDownOver = true; 
                    dispatch('mousedown', event, pointerPosition);
                    downX = pointerPosition.x;
                    downY = pointerPosition.y;
                } 
                else dispatch('mousedownoutside', event, pointerPosition); 
                isDown = true; 
            break;

            case 'mouseup' : 
                if (isDragging)    
                {
                    dispatch('mousedragend', event, pointerPosition);
                }
                else if (isDownOver)      
                {  
                    dispatch('mouseup', event, pointerPosition);    
                    dispatch('mouseclick', event, pointerPosition); 
                }
                isDragging = false;
                isDown     = false; 
                isDownOver = false;
            break;

            case 'mousewheel' : 
            case 'DOMMouseScroll' :  
                delta = (event.detail < 0 || event.wheelDelta > 0) ? 1 : -1;
                dispatch('mousewheel', event, pointerPosition);    
            break;

            // For cases when the mouse moves outside the browser window whilst over the charts viewport.
            case 'mouseout' : 
                if (event.toElement === null && event.relatedTarget === null) 
                {
                    if (isOver && dispatchedOver)
                    {
                        dispatchedOver = false;
                        dispatch('mouseout', event, pointerPosition);
                    }
                }
            break;
        }

        // Prevent default mouse functionality.
        if (isOver || isDragging) event.preventDefault();
    }

    // Touch event handler
    function touchEventHandler (event)
    {
        /*
        For a single click the order of events is:

        1. touchstart
        2. touchmove
        3. touchend
        4. mouseover
        5. mousemove
        6. mousedown
        7. mouseup
        8. click

        Use preventDefault() inside touch event handlers, so the default mouse-emulation handling doesn’t occur.
        http://www.html5rocks.com/en/mobile/touchandmouse/

        But weve attached handlers to the window rather than the element so only call preventDefault() if were
        dragging or over the chart viewport so we dont break default window touch events when not over the chart.

        touches         : a list of all fingers currently on the screen.
        targetTouches   : a list of fingers on the current DOM element.
        changedTouches  : a list of fingers involved in the current event. For example, in a touchend event, this will be the finger that was removed.
        */
        if (event.targetTouches && event.targetTouches.length === 2)
        {
            var t1 = event.targetTouches[0];
            var clientX1 = t1.clientX;
            var clientY1 = t1.clientY;
            pointerPosition = getPointerPosition(clientX1, clientY1);

            var t2 = event.targetTouches[1];
            var clientX2 = t2.clientX;
            var clientY2 = t2.clientY;
            pointerPosition = getPointerPosition(clientX2, clientY2);
        }
        else if (event.changedTouches && event.changedTouches.length === 1)
        {
            var t = event.changedTouches[0];
            var clientX = t.clientX;
            var clientY = t.clientY;
            pointerPosition = getPointerPosition(clientX, clientY);
            isPointerOverChart(clientX, clientY);

            var dx   = pointerPosition.x - downX;
            var dy   = pointerPosition.y - downY;
            var diff = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            switch (event.type)
            {
                case 'touchmove' : 

                    if (isDragging) 
                    {
                        dispatch('touchdrag', event, pointerPosition);
                    }  
                    else if (isDownOver && (diff > 10)) 
                    {
                        isDragging = true;
                        dispatch('touchdragstart', event, {x:downX, y:downY});
                    }

                    if (isOver && !dispatchedOver)
                    {
                        dispatchedOver = true;
                        dispatch('touchover', event, pointerPosition);
                    }
                    else if (!isOver && dispatchedOver)
                    {
                        dispatchedOver = false;
                        dispatch('touchout', event, pointerPosition);
                    }
                break;

                case 'touchstart' : 
                    if (isOver)
                    {
                        isDownOver = true; 
                        dispatch('touchdown', event, pointerPosition);
                        downX = pointerPosition.x;
                        downY = pointerPosition.y;
                    } 
                    else dispatch('touchdownoutside', event, pointerPosition); 
                    isDown = true;
                break;

                case 'touchcancel' : 
                case 'touchend' : 
                    if (isDragging)    
                    {
                        dispatch('touchdragend', event, pointerPosition);
                    }
                    else if (isDownOver)      
                    {  
                        dispatch('touchup', event, pointerPosition);    
                        dispatch('touchclick', event, pointerPosition); 
                    }
                    isDragging = false;
                    isDown     = false; 
                    isDownOver = false;
                break;
            }

            // Prevent default touch functionality.
            if (isOver || isDragging) event.preventDefault();
        }
    }

    // Event dispatcher.
    function dispatch (eventType, event, pointerPosition)
    {
        //window.console.log(eventType);
        if (options[eventType] !== undefined) 
        {
            options[eventType](
            {
                originalEvent : event,
                delta         : delta,
                isOver        : isOver,
                isDragging    : isDragging,
                isDown        : isDown,
                dataX         : coords.getDataX(pointerPosition.x),
                dataY         : coords.getDataY(pointerPosition.y),
                pixelX        : pointerPosition.x,
                pixelY        : pointerPosition.y
            });
        }
    }

    // Update the position of the element within the browser viewport and 
    // the viewport width and height when the window size changes ie resized or scrolled.
    function updateElementPosition () 
    {
        viewportWidth   = dom.viewportWidth();
        viewportHeight  = dom.viewportHeight();
        elementPosition = dom.bounds(element);
    }
    updateElementPosition();

    // Return the position of the pointer within the element.
    function getPointerPosition (clientX, clientY) 
    {
        var x = clientX - elementPosition.left;
        var y = clientY - elementPosition.top;
        return {x:x, y:y};
    }

    // Check if the pointer is over the charts viewport.
    function isPointerOverChart (clientX, clientY)
    {
        // Prevent pointer events being dispatched when the pointer is outside the element or over scrollbars in FF and IE.
        if (clientX < 0 || clientX > viewportWidth || clientY < 0 || clientY > viewportHeight) 
        {
            isOver = false;
        }
        // Check if pointer is over the chart viewport.
        else if (pointerPosition.x >= coords.viewPort().x() && (pointerPosition.x - coords.viewPort().x()) <= coords.viewPort().width() && 
                 pointerPosition.y >= coords.viewPort().y() && (pointerPosition.y - coords.viewPort().y()) <= coords.viewPort().height())  
        {
            isOver = true;
        }    
        else 
        {
            isOver = false;
        }
    }

    var win = dom.getWindowForElement(element);

    // Monitor changes to to browser window.
    dom.on(win, 'scroll resize', updateElementPosition);

    // Mouse events.
    dom.on(win, 'mousemove mouseup mousedown', mouseEventHandler);
    dom.on(element, 'mouseout mousewheel DOMMouseScroll', mouseEventHandler);

    // Touch events.
    if ('ontouchstart' in window) dom.on(win, 'touchstart touchmove touchend touchcancel', touchEventHandler);
}

module.exports = EventHandler;
},{"../utils/dom":15}],5:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link CartesianCoords} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          geom/CartesianCoords 
 * @requires        utils/util
 * @requires        geom/ViewBox
 * @requires        geom/Rectangle
 * @requires        geom/Point
 */

// Required modules.
var ViewBox    = require('./ViewBox');
var Rectangle  = require('./Rectangle');
var Point      = require('./Point');
var util       = require('../utils/util');

/** 
 * @classdesc Maps a data space to a pixel space and vice versa.
 *
 * @class
 * @alias CartesianCoords
 * @since 0.1.0
 * @constructor
 *
 * @param {Object}      [options]           The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 */
function CartesianCoords ()
{
    // Private instance members.    
    this._viewPort  = new Rectangle();  // The rectangle defining the pixel coords.
    this._viewBox   = new ViewBox();    // The viewBox defining the data coords.

    /** 
     * If set to <code>true</code> the viewBox is adjusted to maintain the aspect ratio.
     * If set to <code>false</code> the viewBox stretches to fill the viewPort.
     * 
     * @since 0.1.0
     * @type boolean
     * @default false
     */
    this.preserveAspectRatio = false;
}

/** 
 * A rectangle that defines the drawing area (in pixels) within the coordinate space.
 *
 * @since 0.1.0
 *
 * @param {number} [x = 0]          The x coord of the top left corner.
 * @param {number} [y = 0]          The y coord of the top left corner.
 * @param {number} [width = 100]    The width.
 * @param {number} [height = 100]   The height.
 *
 * @return {Rectangle|CartesianCoords} A Rectangle that defineds the viewPort if no arguments are supplied, otherwise <code>this</code>.
 */
CartesianCoords.prototype.viewPort = function (x, y, width, height)
{
    if (arguments.length > 0)
    {
        this._viewPort.setDimensions(x, y, width, height);
        if (this.preserveAspectRatio) this.fitViewBoxToViewPort(this._viewBox, this._viewPort);
        return this;
    }
    else return this._viewPort;
};

/** 
 * The value of the viewBox specifies a rectangle in user space which is mapped to the bounds of the coordinate space. 
 * The viewBox has its origin at the bottom left corner of the coordinate space with the 
 * positive x-axis pointing towards the right, the positive y-axis pointing up.
 *
 * @since 0.1.0
 *
 * @param {number} [xMin = 0]   The x coord of the bottom left corner.
 * @param {number} [yMin = 0]   The y coord of the bottom left corner.
 * @param {number} [xMax = 100] The x coord of the top right corner.
 * @param {number} [yMax = 100] The y coord of the top right corner.
 *
 * @return {ViewBox|CartesianCoords} The ViewBox if no arguments are supplied, otherwise <code>this</code>.
 */
CartesianCoords.prototype.viewBox = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        this._viewBox.setCoords(xMin, yMin, xMax, yMax);
        if (this.preserveAspectRatio) this.fitViewBoxToViewPort(this._viewBox, this._viewPort);
        return this;
    }
    else return this._viewBox;
};


/** 
 * Converts a point from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {Point} dataPoint A point (data units).
 *
 * @return {Point} A point (pixel units).
 */
CartesianCoords.prototype.getPixelPoint = function (dataPoint)
{
    var x = this.getPixelX(dataPoint.x());
    var y = this.getPixelY(dataPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a bounding box (data units) to a rectangle (pixel units).
 * 
 * @since 0.1.0
 *
 * @param {ViewBox} viewBox A bounding box (data units).
 *
 * @return {Rectangle} A rectangle (pixel units).
 */
CartesianCoords.prototype.getPixelRect = function (viewBox)
{
    var x = this.getPixelX(viewBox.xMin());
    var y = this.getPixelY(viewBox.yMax());
    var w = this.getPixelDimensionX(viewBox.width());
    var h = this.getPixelDimensionY(viewBox.height());
    return new Rectangle(x, y, w, h);
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number[]} arrData An array of coords (data units).
 *
 * @return {number[]} An array of coords (pixel units).
 */
CartesianCoords.prototype.getPixelArray = function (arrData)
{
    var me = this;
    var arrPixel = arrData.map(function(num , index)
    {
        if (index % 2)  return me.getPixelY(num);
        else            return me.getPixelX(num);
    });
    return arrPixel;
};

/** 
 * Converts an x coord from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number} dataX An x coord (data units).
 *
 * @return {number} An x coord (pixel units).
 */
CartesianCoords.prototype.getPixelX = function (dataX)
{
    //<validation>
    if (!util.isNumber(dataX)) throw new Error('CartesianCoords.getPixelX(dataX): dataX must be a number.');
    //</validation>
    var px = this._viewPort.x() + this.getPixelDimensionX(dataX - this._viewBox.xMin());
    return px;
};

/** 
 * Converts a y coord from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number} dataY A y coord (data units).
 *
 * @return {number} A y coord (pixel units).
 */
CartesianCoords.prototype.getPixelY = function (dataY)
{
    //<validation>
    if (!util.isNumber(dataY)) throw new Error('CartesianCoords.getPixelY(dataY): dataY must be a number.');
    //</validation>
    var py =  this._viewPort.y() + this._viewPort.height() - this.getPixelDimensionY(dataY - this._viewBox.yMin());
    return py;
};

/** 
 * Converts an x dimension from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number} dataDimensionX An x dimension (data units).
 *
 * @return {number} An x dimension (pixel units).
 */
CartesianCoords.prototype.getPixelDimensionX = function (dataDimensionX)
{
    //<validation>
    if (!util.isNumber(dataDimensionX)) throw new Error('CartesianCoords.getPixelDimensionX(dataDimensionY): dataDimensionX must be a number.');
    //</validation>
    if (dataDimensionX === 0) return 0;
    var pixelDimensionX  = (dataDimensionX / this._viewBox.width()) * this._viewPort.width();
    return pixelDimensionX;
};

/** 
 * Converts a y dimension from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number} dataDimensionY A y dimension (data units).
 *
 * @return {number} A y dimension (pixel units).
 */
CartesianCoords.prototype.getPixelDimensionY = function (dataDimensionY)
{
    //<validation>
    if (!util.isNumber(dataDimensionY)) throw new Error('CartesianCoords.getPixelDimensionY(dataDimensionY): dataDimensionY must be a number.');
    //</validation>
    if (dataDimensionY === 0) return 0;
    var pixelDimensionY = (dataDimensionY / this._viewBox.height()) * this._viewPort.height();
    return pixelDimensionY;
};

/** 
 * Converts a point from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {Point} pixelPoint A point (pixel units).
 *
 * @return {Point} A point (data units).
 */
CartesianCoords.prototype.getDataPoint = function (pixelPoint)
{
    var x = this.getDataX(pixelPoint.x());
    var y = this.getDataY(pixelPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a rectangle (pixel units) to a viewBox (data units).
 * 
 * @since 0.1.0
 *
 * @param {Rectangle} pixelCoords A rectangle (pixel units).
 *
 * @return {ViewBox} A viewBox (data units).
 */
CartesianCoords.prototype.getDataCoords = function (pixelCoords)
{
    var xMin = this.getDataX(pixelCoords.x());
    var yMax = this.getDataY(pixelCoords.y());
    var xMax = xMin + this.getDataDimensionX(pixelCoords.width());
    var yMin = yMax - this.getPDataHeight(pixelCoords.height());
    return new ViewBox(xMin, yMin, xMax, yMax);
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number[]} arrPixel An array of coords (pixel units).
 *
 * @return {number[]} An array of coords (data units).
 */
CartesianCoords.prototype.getDataArray = function (arrPixel)
{
    var me = this;
    var arrData = arrPixel.map(function(num , index)
    {
        if (index % 2)  return me.getDataY(num);
        else            return me.getDataX(num);
    });
    return arrData;
};

/** 
 * Converts an x coord from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number} pixelX An x coord (pixel units).
 *
 * @return {number} An x coord (data units).
 */
CartesianCoords.prototype.getDataX = function (pixelX)
{
    //<validation>
    if (!util.isNumber(pixelX)) throw new Error('CartesianCoords.getDataX(pixelX): pixelX must be a number.');
    //</validation>
    var px = pixelX - this._viewPort.x();
    var dataX = this._viewBox.xMin() + this.getDataDimensionX(px);
    return dataX;
};

/** 
 * Converts a y coord from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number} pixelY A y coord (pixel units).
 *
 * @return {number} A y coord (data units).
 */
CartesianCoords.prototype.getDataY = function (pixelY)
{
    //<validation>
    if (!util.isNumber(pixelY)) throw new Error('CartesianCoords.getDataY(pixelY): pixelY must be a number.');
    //</validation>
    var py = pixelY - this._viewPort.y();
    var dataY = this._viewBox.yMin() + this.getDataDimensionY(this._viewPort.height() - py);
    return dataY;
};

/** 
 * Converts an x dimension from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number} pixelDimensionX An x dimension (pixel units).
 *
 * @return {number} An x dimension (data units).
 */
CartesianCoords.prototype.getDataDimensionX = function (pixelDimensionX)
{
    //<validation>
    if (!util.isNumber(pixelDimensionX)) throw new Error('CartesianCoords.getDataDimensionX(pixelDimensionX): pixelDimensionX must be a number.');
    //</validation>
    if (pixelDimensionX === 0) return 0;
    var dataDimensionX = (pixelDimensionX / this._viewPort.width()) * this._viewBox.width();
    return dataDimensionX;
};

/** 
 * Converts a y dimension from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number} pixelDimensionY A y dimension (pixel units).
 *
 * @return {number} A y dimension (data units).
 */
CartesianCoords.prototype.getDataDimensionY = function (pixelDimensionY)
{
    //<validation>
    if (!util.isNumber(pixelDimensionY)) throw new Error('CartesianCoords.getDataDimensionY(pixelDimensionY): pixelDimensionY must be a number.');
    //</validation>
    if (pixelDimensionY === 0) return 0;
    var dataDimensionY = (pixelDimensionY / this._viewPort.height()) * this._viewBox.height();
    return dataDimensionY;
};

/** 
 * Adjusts a bounding box to fit a rectangle in order to maintain the aspect ratio.
 * 
 * @since 0.1.0
 * @private
 *
 * @param {ViewBox} viewBox A bounding box.
 *
 * @param {Rectangle} rect A rectangle.
 */
CartesianCoords.prototype.fitViewBoxToViewPort = function (viewBox, rect)
{
    var sy = viewBox.height() / rect.height();
    var sx = viewBox.height() / rect.width();

    var sBBoxX, sBBoxY, sBBoxW, sBBoxH; 

    if (sy > sx)
    {
        sBBoxY = viewBox.yMin();
        sBBoxH = viewBox.height();
        sBBoxW = (rect.width() / rect.height()) * sBBoxH;
        sBBoxX = viewBox.xMin() - ((sBBoxW - viewBox.width()) / 2);
    }
    else if (sx > sy)
    {
        sBBoxX = viewBox.xMin();
        sBBoxW = viewBox.width();
        sBBoxH = (rect.height() / rect.width()) * sBBoxW;
        sBBoxY = viewBox.yMin() - ((sBBoxH - viewBox.height()) / 2);
    }
    else
    {
        sBBoxX = viewBox.xMin();
        sBBoxY = viewBox.yMin();
        sBBoxW = viewBox.width();
        sBBoxH = viewBox.height();
    }

    viewBox.xMin(sBBoxX).yMin(sBBoxY).width(sBBoxW).height(sBBoxH);
};

module.exports = CartesianCoords;
},{"../utils/util":17,"./Point":6,"./Rectangle":8,"./ViewBox":9}],6:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Point} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          geom/Point 
 * @requires        utils/util
 */

// Required modules.
var util = require('../utils/util');

/** 
 * @classdesc A Point defined by its <code>x</code> and <code>y</code> 
 * 
 * @class
 * @alias Point
 * @since 0.1.0
 * @constructor
 *
 * @param {number} [x = 0] The x coord.
 * @param {number} [y = 0] The y coord.
 */
function Point (x, y)
{
    // Private instance members.
    this._x = null; // The x coord.
    this._y = null; // The y coord.

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    this.setCoords(x, y);
}

/** 
 * Set the coordinates.
 *
 * @since 0.1.0
 *
 * @param {number} [x] The x coord.
 * @param {number} [y] The y coord.
 *
 * @return {Point}     <code>this</code>.
 */
Point.prototype.setCoords = function (x, y)
{
    if (arguments.length > 0)
    {
        if (x !== undefined) this.x(x);
        if (y !== undefined) this.y(y);
    }
    return this;
};

/** 
 * Get or set the x coord of the left edge.
 *
 * @since 0.1.0
 *
 * @param {number} [coord] The coordinate.
 *
 * @return {number|Point} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Point.prototype.x = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(coord)) throw new Error('Point.x(coord): coord must be a number.');
        //</validation>
        this._x = coord;
        return this;
    }
    else return this._x;
};

/** 
 * Get or set the y coord of the top edge.
 *
 * @since 0.1.0
 *
 * @param {number} [coord] The coordinate.
 *
 * @return {number|Point} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Point.prototype.y = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(coord)) throw new Error('Point.y(coord): coord must be a number.');
        //</validation>
        this._y = coord;
        return this;
    }
    else return this._y;
};

/** 
 * Returns a clone of this Point.        
 * 
 * @since 0.1.0
 *
 * @return {Point} The Point.   
 */
Point.prototype.clone = function ()
{
    return new Point(this._x, this._y);
};

module.exports = Point;
},{"../utils/util":17}],7:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link PolarCoords} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          geom/PolarCoords 
 */

// Required modules.

/** 
 * @classdesc Maps a data space to a pixel space and vice versa.
 *
 * @class
 * @alias PolarCoords
 * @since 0.1.0
 * @constructor
 *
 * @param {Object}      [options] The options.
 */
function PolarCoords ()
{

}

module.exports = PolarCoords;
},{}],8:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Rectangle} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/Rectangle 
 * @requires utils/util
 */

// Required modules.
var util = require('../utils/util');

/** 
 * @classdesc A rectangle defined by its <code>x</code>, <code>y</code> 
 * <code>width</code> and <code>height</code>.
 * 
 * @class
 * @alias Rectangle
 * @since 0.1.0
 * @constructor
 *
 * @param {number} [x = 0]          The x coord of the top left corner.
 * @param {number} [y = 0]          The y coord of the top left corner.
 * @param {number} [width = 100]    The width.
 * @param {number} [height = 100]   The height.
 */
function Rectangle (x, y, width, height)
{
    // Private instance members.
    this._x = null; // The x coord of the top left corner.
    this._y = null; // The y coord of the top left corner.
    this._w = null; // The width.
    this._h = null; // The height.

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    width = width !== undefined ? width : 100;
    height = height !== undefined ? height : 100;
    this.setDimensions(x, y, width, height);
}

/** 
 * Set the dimensions.
 *
 * @since 0.1.0
 *
 * @param {number} [x] The x coord of the top left corner.
 * @param {number} [y] The y coord of the top left corner.
 * @param {number} [w] The width.
 * @param {number} [h] The height.
 *
 * @return {Rectangle} <code>this</code>.
 */
Rectangle.prototype.setDimensions = function (x, y, w, h)
{
    if (arguments.length > 0)
    {
        if (x !== undefined) this.x(x);
        if (y !== undefined) this.y(y);
        if (w !== undefined) this.width(w);
        if (h !== undefined) this.height(h);
    }
    return this;
};

/** 
 * Get or set the x coord of the top left corner.
 *
 * @since 0.1.0
 *
 * @param {number} [coord] The coordinate.
 *
 * @return {number|Rectangle} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Rectangle.prototype.x = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(coord)) throw new Error('Rectangle.x(coord): coord must be a number.');
        //</validation>
        this._x = coord;
        return this;
    }
    else return this._x;
};

/** 
 * Get or set the y coord of the top left corner.
 *
 * @since 0.1.0
 *
 * @param {number} [coord] The coordinate.
 *
 * @return {number|Rectangle} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Rectangle.prototype.y = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(coord)) throw new Error('Rectangle.y(coord): coord must be a number.');
        //</validation>
        this._y = coord;
        return this;
    }
    else return this._y;
};

/** 
 * Get or set the width.
 *
 * @since 0.1.0
 *
 * @param {number} [w] The width.
 *
 * @return {number|Rectangle} The width if no arguments are supplied, otherwise <code>this</code>.
 */
Rectangle.prototype.width = function (w)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(w))  throw new Error('Rectangle.width(w): w must be a number.');
        if (w < 0)              throw new Error('Rectangle.width(w): w must be >= 0.');
        //</validation>
        this._w = w;
        return this;
    }
    else return this._w;
};

/** 
 * Get or set the height.
 *
 * @since 0.1.0
 *
 * @param {number} [h] The height.
 *
 * @return {number|Rectangle} The height if no arguments are supplied, otherwise <code>this</code>.
 */
Rectangle.prototype.height = function (h)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(h))  throw new Error('Rectangle.height(h): h must be a number.');
        if (h < 0)              throw new Error('Rectangle.height(h): h must be >= 0.');
        //</validation>
        this._h = h;
        return this;
    }
    else return this._h;
};

/** 
 * Returns a clone of this rectangle.        
 * 
 * @since 0.1.0
 *
 * @return {Rectangle} The rectangle.   
 */
Rectangle.prototype.clone = function ()
{
    return new Rectangle(this._x, this._y, this._w, this._h);
};

module.exports = Rectangle;
},{"../utils/util":17}],9:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link ViewBox} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          geom/ViewBox 
 * @requires        utils/util
 */

// Required modules.
var util = require('../utils/util');

/** 
 * @classdesc An area defined by its position, as indicated 
 * by its bottom-left corner point (<code>xMin</code>, <code>yMin</code>) 
 * and top-right corner point (<code>xMax</code>, <code>yMax</code>).
 * 
 * @class
 * @alias ViewBox
 * @since 0.1.0
 * @constructor
 *
 * @param {number} [xMin = 0]   The x coord of the bottom left corner.
 * @param {number} [yMin = 0]   The y coord of the bottom left corner.
 * @param {number} [xMax = 100] The x coord of the top right corner.
 * @param {number} [yMax = 100] The y coord of the top right corner.
 */
function ViewBox (xMin, yMin, xMax, yMax)
{
    // Private instance members.
    this._xMin      = null; // The x coord of the bottom left corner.
    this._xMax      = null; // The x coord of the top right corner.
    this._xCenter   = null; // The x coord of the center.
    this._width     = null; // The width.
    this._yMin      = null; // The y coord of the bottom left corner.
    this._yMax      = null; // The y coord of the top right corner.
    this._yCenter   = null; // The y coord of the center.
    this._height    = null; // The height.

    xMin = xMin !== undefined ? xMin : 0;
    yMin = yMin !== undefined ? yMin : 0;
    xMax = xMax !== undefined ? xMax : 100;
    yMax = yMax !== undefined ? yMax : 100;
    this.setCoords(xMin, yMin, xMax, yMax);
}

/** 
 * Set the dimensions.
 *
 * @since 0.1.0
 *
 * @param {number} [xMin] The x coord of the bottom left corner.
 * @param {number} [yMin] The y coord of the bottom left corner.
 * @param {number} [xMax] The x coord of the top right corner.
 * @param {number} [yMax] The y coord of the top right corner.
 *
 * @return {ViewBox}      <code>this</code>.
 */
ViewBox.prototype.setCoords = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        if (xMin !== undefined) this.xMin(xMin);
        if (yMin !== undefined) this.yMin(yMin);
        if (xMax !== undefined) this.xMax(xMax);
        if (yMax !== undefined) this.yMax(yMax);
    }
    return this;
};

/** 
 * Get or set the x coord of the bottom left corner.
 *
 * @since 0.1.0
 *
 * @param {number} [x] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.xMin = function (x)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(x)) throw new Error('ViewBox.xMin(x): x must be a number.');
        //</validation>
        this._xMin = x;
        this._width = Math.abs(this._xMax - this._xMin);
        this._xCenter = this._xMin + (this._width / 2); 
        return this;
    }
    else return this._xMin;
};

/** 
 * Get or set the x coord of the top right corner.
 *
 * @since 0.1.0
 *
 * @param {number} [x] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.xMax = function (x)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(x)) throw new Error('ViewBox.xMax(x): x must be a number.');
        //</validation>
        this._xMax = x;
        this._width = Math.abs(this._xMax - this._xMin);
        this._xCenter = this._xMin + (this._width / 2);
        return this;
    }
    else return this._xMax;
};


/** 
 * Get or set the x coord of the center.
 *
 * @since 0.1.0
 *
 * @param {number} [x] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.xCenter = function (x)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(x)) throw new Error('ViewBox.xCenter(x): x must be a number.');
        //</validation>
        this._xCenter = x;
        this._xMin  = this._xCenter - (this._width / 2);
        this._xMax  = this._xCenter + (this._width / 2);
        return this;
    }
    else return this._xCenter;
};


/** 
 * Get or set the width.
 *
 * @since 0.1.0
 *
 * @param {number} [w] The width.
 *
 * @return {number|ViewBox} The width if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.width = function (w)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(w))  throw new Error('ViewBox.width(w): w must be a number.');
        if (w < 0)         throw new Error('ViewBox.width(w): w must be >= 0.');
        //</validation>
        this._width = w;
        this._xMax = this._xMin + this._width;
        this._xCenter = this._xMin + (this._width / 2);
        return this;
    }
    else return this._width;
};

/** 
 * Get or set the y coord of the bottom left corner.
 *
 * @since 0.1.0
 *
 * @param {number} [y] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.yMin = function (y)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(y)) throw new Error('ViewBox.yMin(y): y must be a number.');
        //</validation>
        this._yMin = y;
        this._height = Math.abs(this._yMax - this._yMin);
        this._yCenter = this._yMin + (this._height / 2);
        return this;
    }
    else return this._yMin;
};

/** 
 * Get or set the y coord of the top right corner.
 *
 * @since 0.1.0
 *
 * @param {number} [y] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.yMax = function (y)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(y)) throw new Error('ViewBox.yMax(y): y must be a number.');
        //</validation>
        this._yMax = y;
        this._height = Math.abs(this._yMax - this._yMin);
        this._yCenter = this._yMin + (this._height / 2);
        return this;
    }
    else return this._yMax;
};

/** 
 * Get or set the y coord of the center.
 *
 * @since 0.1.0
 *
 * @param {number} [y] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.yCenter = function (y)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(y)) throw new Error('ViewBox.yCenter(y): y must be a number.');
        //</validation>
        this._yCenter = y;
        this._yMin  = this._yCenter - (this._height / 2);
        this._yMax  = this._yCenter + (this._height / 2);
        return this;
    }
    else return this._yCenter;
};

/** 
 * Get or set the height.
 *
 * @since 0.1.0
 *
 * @param {number} [h] The height.
 *
 * @return {number|ViewBox} The height if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.height = function (h)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(h)) throw new Error('ViewBox.height(h): h must be a number.');
        if (h < 0)        throw new Error('ViewBox.height(h): h must be >= 0.');
        //</validation>
        this._height = h;
        this._yMax = this._yMin + this._height;
        this._yCenter = this._yMin + (this._height / 2);
        return this;
    }
    else return this._height;
};

/** 
 * Returns a clone of this ViewBox.        
 * 
 * @since 0.1.0
 *
 * @return {ViewBox} The ViewBox.   
 */
ViewBox.prototype.clone = function ()
{
    return new ViewBox(this._xMin, this._yMin, this._xMax, this._yMax);
};

/** 
 * Returns true if a ViewBox equals to this one.
 * 
 * @since 0.1.0
 *
 * @param {ViewBox} vb The ViewBox.
 *
 * @return {boolean} true, if the ViewBox is equal to this one, otherwise false.
 */
ViewBox.prototype.equals = function (vb)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!(vb instanceof ViewBox)) throw new Error('ViewBox.equals(vb): vb must be a ViewBox.');
        //</validation>
        if (vb.getXMin() !== this._xMin) return false;
        if (vb.getYMin() !== this._yMin) return false;
        if (vb.getXMax() !== this._xMax) return false;
        if (vb.getYMax() !== this._yMax) return false;
        return true;
    }
    else throw new Error('ViewBox.equals(vb): vb has not been defined.');
};

/** 
 * Returns true if a ViewBox intersects this one.
 * 
 * @since 0.1.0
 *
 * @param {ViewBox} vb The ViewBox.
 *
 * @return {boolean} true, if the ViewBox intercepts this one, otherwise false.
 */
ViewBox.prototype.intersects = function (vb)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!(vb instanceof ViewBox)) throw new Error('ViewBox.intersects(vb): vb must be a ViewBox.');
        //</validation>
        if (vb.getXMin() > this._xMax) return false;
        if (vb.getXMax() < this._xMin) return false;
        if (vb.getYMin() > this._yMax) return false;
        if (vb.getYMax() < this._yMin) return false;
        return true;
    }
    else throw new Error('ViewBox.intersects(vb): vb has not been defined.');
};

/** 
 * Returns true if a ViewBox is contained within this one.
 * 
 * @since 0.1.0
 *
 * @param {ViewBox} vb The ViewBox.
 *
 * @return {boolean} true, if the ViewBox is contained within this one, otherwise false.
 */
ViewBox.prototype.contains = function (vb)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!(vb instanceof ViewBox)) throw new Error('ViewBox.contains(vb): vb must be a ViewBox.');
        //</validation>
        if (vb.getXMin() < this._xMin) return false;
        if (vb.getXMax() > this._xMax) return false;
        if (vb.getYMin() < this._yMin) return false;
        if (vb.getYMax() > this._yMax) return false;
        return true;
    }
    else throw new Error('ViewBox.contains(vb): vb has not been defined.');
};

module.exports = ViewBox;
},{"../utils/util":17}],10:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

// Grab an existing namespace object, or create a blank object if it doesn't exist.
// Add the modules.
// Only need to require the top-level modules, browserify
// will walk the dependency graph and load everything correctly.
var flowingcharts = window.flowingcharts ||
{
    canvas : require('./canvas/Canvas')
};

require('./plugins/jqueryplugin');

// Replace/Create the global namespace
window.flowingcharts = flowingcharts;
},{"./canvas/Canvas":1,"./plugins/jqueryplugin":11}],11:[function(require,module,exports){
(function (global){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

var $     = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var Chart = require('../charts/Chart');

if ($ !== undefined)
{
    $.fn.flowingcharts = function (options) 
    {   
        options.chart.container = this[0];
        var chart = new Chart(options);
        return this;
    };
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../charts/Chart":2}],12:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Series} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          charts/Series 
 * @requires        utils/util
 */

// Required modules.
var util = require('../utils/util');

/** 
 * @classdesc A base class for series.
 *
 * @class
 * @alias Series
 * @since 0.1.0
 * @constructor
 *
 * @param {Canvas} The drawing canvas.
 * @param {Object} [options]                        The series options.
 * @param {string} [options.data = []]              The data - an array of the form [{x:10, y:20}, {x:10, y:20}, {x:10, y:20}, ...].
 * @param {string} [options.idField = id]           The data property that contains the id value.
 * @param {string} [options.nameField = name]       The data property that contains the  name value.
 * @param {string} [options.xField = x]             The data property that contains the x value.
 * @param {string} [options.yField = y]             The data property that contains the y value.
 * @param {string} [options.sizeField = size]       The data property that contains the size value.
 * @param {string} [options.colorField = color]     The data property that contains the color value.
 * @param {string} [options.shapeField = shape]     The data property that contains the shape value.
 * @param {string} [options.imageField = image]     The data property that contains the image value.
 * @param {string} [options.shape = circle]         The shape to use for rendering.
 * @param {string} [options.image]                  The image to use for rendering.
 * @param {string} [options.markerSize = 8]         The marker size.
 * @param {string} [options.fillColor = #ffffff]    The fill color.
 * @param {number} [options.fillOpacity = 1]        The fill opacity.
 * @param {string} [options.lineColor = #000000]    The line color.
 * @param {number} [options.lineWidth = 0]          The line width.
 * @param {string} [options.lineJoin = round]       The line join, one of "bevel", "round", "miter".
 * @param {string} [options.lineCap = butt]         The line cap, one of "butt", "round", "square".
 * @param {number} [options.lineOpacity = 1]        The line opacity.
 */
function Series (canvas, options)
{
    // Private instance members.  
    this._items = []; // The list of items belonging to the series.

    // Public instance members.  

    /** 
     * The minimum x value.
     * 
     * @since 0.1.0
     * @type number
     * @default 0
     */
    this.xMin = 0;

    /** 
     * The maximum x value.
     * 
     * @since 0.1.0
     * @type number
     * @default 100
     */
    this.xMax = 100;
    
    /** 
     * The minimum x value.
     * 
     * @since 0.1.0
     * @type number
     * @default 0
     */
    this.yMin = 0;
    
    /** 
     * The maximum y value.
     * 
     * @since 0.1.0
     * @type number
     * @default 100
     */
    this.yMax = 100;
    
    /** 
     * The drawing canvas.
     * 
     * @since 0.1.0
     * @type Canvas
     * @default null
     */
    this.canvas = canvas;

    this.options(options);
}

/** 
 * Get or set the options for the series.
 *
 * @since 0.1.0
 *
 * @param {Object} [options]                        The series options.
 * @param {string} [options.data = []]              The data - an array of the form [{x:10, y:20}, {x:10, y:20}, {x:10, y:20}, ...].
 * @param {string} [options.idField = id]           The data property that contains the id value.
 * @param {string} [options.nameField = name]       The data property that contains the  name value.
 * @param {string} [options.xField = x]             The data property that contains the x value.
 * @param {string} [options.yField = y]             The data property that contains the y value.
 * @param {string} [options.sizeField = size]       The data property that contains the size value.
 * @param {string} [options.colorField = color]     The data property that contains the color value.
 * @param {string} [options.shapeField = shape]     The data property that contains the shape value.
 * @param {string} [options.imageField = image]     The data property that contains the image value.
 * @param {string} [options.shape = circle]         The shape to use for rendering.
 * @param {string} [options.image = ]               The image to use for rendering.
 * @param {string} [options.markerSize = 8]         The marker size.
 * @param {string} [options.fillColor]              The fill color.
 * @param {number} [options.fillOpacity = 1]        The fill opacity.
 * @param {string} [options.lineColor]              The line color.
 * @param {number} [options.lineWidth = 1]          The line width.
 * @param {string} [options.lineJoin = round]       The line join, one of "bevel", "round", "miter".
 * @param {string} [options.lineCap = butt]         The line cap, one of "butt", "round", "square".
 * @param {number} [options.lineOpacity = 1]        The line opacity.
 *
 * @return {Object|Series}                          The options if no arguments are supplied, otherwise <code>this</code>.
 */
Series.prototype.options = function(options)
{
    if (arguments.length > 0)
    {
        this._options = // Default options.
        {
            data        : [],
            idField     : 'id',
            nameField   : 'name',
            xField      : 'x',
            yField      : 'y',
            sizeField   : 'size',
            colorField  : 'color',
            shapeField  : 'shape',
            imageField  : 'image',
            shape       : 'circle',
            image       : undefined,
            markerSize  : 8,
            fillColor   : undefined, 
            fillOpacity : undefined,
            lineColor   : undefined,  
            lineWidth   : undefined, 
            lineJoin    : undefined, 
            lineCap     : undefined, 
            lineOpacity : undefined
        };   

        // Extend default options with passed in options.
        util.extendObject(this._options, options);

        // Process the data.
        this.update();

        return this;
    }
    else return this._options;
};

/** 
 * Updates the series.
 *
 * @since 0.1.0
 *
 * @return {Series} <code>this</code>.
 */
Series.prototype.update = function()
{
    this._items = [];

    this.xMin = Infinity;
    this.xMax = -Infinity;
    this.yMin = Infinity;
    this.yMax = -Infinity;

    var n = this._options.data.length;
    for (var i = 0; i < n; i++)  
    {
        var dataItem = this._options.data[i];

        // Add a new series item for each data item.
        var x           = dataItem[this._options.xField];
        var y           = dataItem[this._options.yField];
        var id          = dataItem[this._options.idField]    !== undefined ? dataItem[this._options.idField]    : i;
        var name        = dataItem[this._options.nameField]  !== undefined ? dataItem[this._options.nameField]  : i;
        var markerSize  = dataItem[this._options.sizeField]  !== undefined ? dataItem[this._options.sizeField]  : this._options.markerSize;
        var shape       = dataItem[this._options.shapeField] !== undefined ? dataItem[this._options.shapeField] : this._options.shape;

        if (util.isNumber(x) && util.isNumber(y))
        {
            var item = this.canvas.marker(shape, x, y, markerSize);
            //var item = this.canvas.shape(shape, x, y, markerSize, markerSize);
            item.style = 
            {
                fillColor   : dataItem[this._options.colorField] !== undefined ? dataItem[this._options.colorField] : this._options.fillColor,
                fillOpacity : this._options.fillOpacity,
                lineColor   : this._options.lineColor,
                lineWidth   : this._options.lineWidth,
                lineJoin    : this._options.lineJoin,
                lineCap     : this._options.lineCap,
                lineOpacity : this._options.lineOpacity
            };

            this._items.push(item);

            // Get the min and max values in the data.
            this.xMin = Math.min(this.xMin, x);
            this.xMax = Math.max(this.xMax, x);
            this.yMin = Math.min(this.yMin, y);
            this.yMax = Math.max(this.yMax, y);
        }
    }
    return this;
};

/** 
 * Renders the graphics.
 *
 * @since 0.1.0
 *
 * @return {Series} <code>this</code>.
 */
Series.prototype.render = function()
{
    this.canvas.render();
};

/** 
 * Returns a hit event for the nearest item.
 *
 * @since 0.1.0
 *
 * @param {number} x The x pixel coord.
 * @param {number} y The y pixel coord.
 *
 * @return {CanvasItem} The canvas item.
 */
Series.prototype.hitEvent = function(x, y)
{
    return this.canvas.hitEvent(x, y);
};

module.exports = Series;
},{"../utils/util":17}],13:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains canvas drawing routines.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          canvas 
 * @requires        utils/dom
 * @requires        utils/color
 */

// Required modules.
var dom       = require('../utils/dom');
var colorUtil = require('../utils/color');

/** 
 * Checks for canvas support.
 *
 * @since 0.1.0
 *
 * @return {boolean} true if the browser supports the graphics library, otherwise false.
 */
var isSupported = function ()
{
    return !!dom.createElement('canvas').getContext('2d');
};

/** 
 * Returns an absolutely positioned canvas that can be stacked in a relative container.
 *
 * @since 0.1.0
 *
 * @return {HtmlCanvas} A canvas.
 */
var getCanvas = function ()
{
    var canvas = dom.createElement('canvas'); 
    dom.style(canvas, {position:'absolute', left:0, right:0});
    return canvas;
};

/** 
 * Returns a drawing context.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvas}  canvas The canvas.
 * @param {string}      type   The element type.
 *
 * @return {HtmlCanvasContext} A canvas context.
 */
var getContext = function (canvas, type)
{
    return canvas.getContext('2d');
};

/** 
 * Clears the canvas.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvas} canvas The canvas.
 */
var clear = function (canvas)
{
    empty(canvas);
};

/** 
 * Empties the canvas.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvas} canvas The canvas.
 */
var empty = function (canvas)
{
    getContext(canvas).clearRect(0, 0, canvas.width, canvas.height);
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number}              cx                  The x position of the center of the circle.
 * @param {number}              cy                  The y position of the center of the circle.
 * @param {number}              r                   The circle radius.
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var circle = function (ctx, cx, cy, r, style)
{
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
    draw(ctx, style);
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number}              cx                  The x position of the center of the ellipse.
 * @param {number}              cy                  The y position of the center of the ellipse
 * @param {number}              rx                  The x radius of the ellipse.
 * @param {number}              ry                  The y radius of the ellipse.
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var ellipse = function (ctx, cx, cy, rx, ry, style)
{
    var kappa = 0.5522848,
    x  = cx - rx,       // x-start.
    y  = cy - ry,       // y-start.
    xe = cx + rx,       // x-end.
    ye = cy + ry,       // y-end.
    ox = rx * kappa,    // Control point offset horizontal.
    oy = ry * kappa;    // Control point offset vertical.

    ctx.beginPath();
    ctx.moveTo(x, cy);
    ctx.bezierCurveTo(x, cy - oy, cx - ox, y, cx, y);
    ctx.bezierCurveTo(cx + ox, y, xe, cy - oy, xe, cy);
    ctx.bezierCurveTo(xe, cy + oy, cx + ox, ye, cx, ye);
    ctx.bezierCurveTo(cx - ox, ye, x, cy + oy, x, cy);
    draw(ctx, style);
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number}              x                   The x position of the top left corner.
 * @param {number}              y                   The y position of the top left corner.
 * @param {number}              w                   The width.
 * @param {number}              h                   The height.
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var rect = function (ctx, x, y, w, h, style)
{
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    draw(ctx, style);
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number}              x1                  The x position of point 1.
 * @param {number}              y1                  The y position of point 1.
 * @param {number}              x2                  The x position of point 2.
 * @param {number}              y2                  The y position of point 2.
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var line = function (ctx, x1, y1, x2, y2, style)
{
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    draw(ctx, style);
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number[]}            arrCoords           An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var polyline = function (ctx, arrCoords, style)
{
    ctx.beginPath();
    var n = arrCoords.length;
    for (var i = 0; i < n; i+=2)
    {
        var x = arrCoords[i];
        var y = arrCoords[i+1];
        if (i === 0) ctx.moveTo(x, y);
        else         ctx.lineTo(x, y);
    }
    draw(ctx, style);
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number[]}            arrCoords           An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var polygon = function (ctx, arrCoords, style)
{
    polyline(arrCoords);
    ctx.closePath();
    draw(ctx, style);
};

/** 
 * Provides the fill drawing routine.
 *
 * @since 0.1.0
 * @private
 *
 * @param {HtmlCanvasContext}   ctx                         The canvas context to draw to.
 * @param {Object}              [style]                     The style properties.
 * @param {string}              [style.fillColor]           The fill color.
 * @param {number}              [style.fillOpacity = 1]     The fill opacity.
 * @param {string}              [style.lineColor]           The line color.
 * @param {number}              [style.lineWidth = 1]       The line width.
 * @param {string}              [style.lineJoin = round]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap = butt]      The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity = 1]     The line opacity. Overrides any alpha value on the fill color.
 */
function draw (ctx, style)
{
    // Fill.
    if (style.fillColor !== undefined)
    {
        ctx.fillStyle   = style.fillOpacity !== undefined ? colorUtil.toRGBA(style.fillColor, style.fillOpacity) : colorUtil.toRGBA(style.fillColor);
        ctx.fill();
    }

    // Stroke.
    if (style.lineColor !== undefined && style.lineWidth !== 0)
    {
        ctx.lineWidth   = style.lineWidth   !== undefined ? style.lineWidth : 1;
        ctx.lineJoin    = style.lineJoin    !== undefined ? style.lineJoin  : 'round';
        ctx.lineCap     = style.lineCap     !== undefined ? style.lineCap   : 'butt';
        ctx.strokeStyle = style.lineOpacity !== undefined ? colorUtil.toRGBA(style.lineColor, style.lineOpacity) : colorUtil.toRGBA(style.lineColor);
        ctx.stroke();
    }
}

module.exports = 
{
    isSupported : isSupported,
    getCanvas   : getCanvas,
    getContext  : getContext,
    clear       : clear,
    empty       : empty,
    draw        : draw,
    circle      : circle,
    ellipse     : ellipse,
    rect        : rect,
    line        : line,
    polyline    : polyline,
    polygon     : polygon
};
},{"../utils/color":14,"../utils/dom":15}],14:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains color functions.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          color 
 */

// List of valid color names.
var colorNames = 
{
    'aliceblue':'#f0f8ff','antiquewhite':'#faebd7','aqua':'#00ffff','aquamarine':'#7fffd4','azure':'#f0ffff',
    'beige':'#f5f5dc','bisque':'#ffe4c4','black':'#000000','blanchedalmond':'#ffebcd','blue':'#0000ff','blueviolet':'#8a2be2','brown':'#a52a2a','burlywood':'#deb887',
    'cadetblue':'#5f9ea0','chartreuse':'#7fff00','chocolate':'#d2691e','coral':'#ff7f50','cornflowerblue':'#6495ed','cornsilk':'#fff8dc','crimson':'#dc143c','cyan':'#00ffff',
    'darkblue':'#00008b','darkcyan':'#008b8b','darkgoldenrod':'#b8860b','darkgray':'#a9a9a9','darkgreen':'#006400','darkkhaki':'#bdb76b','darkmagenta':'#8b008b','darkolivegreen':'#556b2f',
    'darkorange':'#ff8c00','darkorchid':'#9932cc','darkred':'#8b0000','darksalmon':'#e9967a','darkseagreen':'#8fbc8f','darkslateblue':'#483d8b','darkslategray':'#2f4f4f','darkturquoise':'#00ced1',
    'darkviolet':'#9400d3','deeppink':'#ff1493','deepskyblue':'#00bfff','dimgray':'#696969','dodgerblue':'#1e90ff',
    'firebrick':'#b22222','floralwhite':'#fffaf0','forestgreen':'#228b22','fuchsia':'#ff00ff',
    'gainsboro':'#dcdcdc','ghostwhite':'#f8f8ff','gold':'#ffd700','goldenrod':'#daa520','gray':'#808080','green':'#008000','greenyellow':'#adff2f',
    'honeydew':'#f0fff0','hotpink':'#ff69b4',
    'indianred ':'#cd5c5c','indigo':'#4b0082','ivory':'#fffff0','khaki':'#f0e68c',
    'lavender':'#e6e6fa','lavenderblush':'#fff0f5','lawngreen':'#7cfc00','lemonchiffon':'#fffacd','lightblue':'#add8e6','lightcoral':'#f08080','lightcyan':'#e0ffff','lightgoldenrodyellow':'#fafad2',
    'lightgrey':'#d3d3d3','lightgreen':'#90ee90','lightpink':'#ffb6c1','lightsalmon':'#ffa07a','lightseagreen':'#20b2aa','lightskyblue':'#87cefa','lightslategray':'#778899','lightsteelblue':'#b0c4de',
    'lightyellow':'#ffffe0','lime':'#00ff00','limegreen':'#32cd32','linen':'#faf0e6',
    'magenta':'#ff00ff','maroon':'#800000','mediumaquamarine':'#66cdaa','mediumblue':'#0000cd','mediumorchid':'#ba55d3','mediumpurple':'#9370d8','mediumseagreen':'#3cb371','mediumslateblue':'#7b68ee',
    'mediumspringgreen':'#00fa9a','mediumturquoise':'#48d1cc','mediumvioletred':'#c71585','midnightblue':'#191970','mintcream':'#f5fffa','mistyrose':'#ffe4e1','moccasin':'#ffe4b5',
    'navajowhite':'#ffdead','navy':'#000080',
    'oldlace':'#fdf5e6','olive':'#808000','olivedrab':'#6b8e23','orange':'#ffa500','orangered':'#ff4500','orchid':'#da70d6',
    'palegoldenrod':'#eee8aa','palegreen':'#98fb98','paleturquoise':'#afeeee','palevioletred':'#d87093','papayawhip':'#ffefd5','peachpuff':'#ffdab9','peru':'#cd853f','pink':'#ffc0cb','plum':'#dda0dd','powderblue':'#b0e0e6','purple':'#800080',
    'red':'#ff0000','rosybrown':'#bc8f8f','royalblue':'#4169e1',
    'saddlebrown':'#8b4513','salmon':'#fa8072','sandybrown':'#f4a460','seagreen':'#2e8b57','seashell':'#fff5ee','sienna':'#a0522d','silver':'#c0c0c0','skyblue':'#87ceeb','slateblue':'#6a5acd','slategray':'#708090','snow':'#fffafa','springgreen':'#00ff7f','steelblue':'#4682b4',
    'tan':'#d2b48c','teal':'#008080','thistle':'#d8bfd8','tomato':'#ff6347','turquoise':'#40e0d0',
    'violet':'#ee82ee',
    'wheat':'#f5deb3','white':'#ffffff','whitesmoke':'#f5f5f5',
    'yellow':'#ffff00','yellowgreen':'#9acd32'
};

/** 
 * Check if c is a valid color.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is a number, otherwise false.
 */
var isColor = function (c)
{
    if (isHex(c))       return true;
    if (isRGB(c))       return true;
    if (isColorName(c)) return true;
    return false;
};

/** 
 * Check if c is a valid rgb color.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is an rgb color, otherwise false.
 */
var isRGB = function(c)
{
    return (c.indexOf('rgb') != -1);
};

/** 
 * Check if c is a valid rgba color.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is an rgba color, otherwise false.
 */
var isRGBA = function(c)
{
    return (c.indexOf('rgba') != -1);
};

/** 
 * Check if c is a valid hex color.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is a hexadecimal color, otherwise false.
 */
var isHex = function (c)
{
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(c);
};

/** 
 * Check if c is a valid color name.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is a color name, otherwise false.
 */
var isColorName = function (c)
{
    if (colorNames[c.toLowerCase()] !== undefined) return true;
    return false;
};

/** 
 * Converts rgb to hex.
 *
 * @since 0.1.0
 *
 * @param {number} r The red component.
 * @param {number} g The green component.
 * @param {number} b The blue component.
 *
 * @return {string} The hexadecimal value.
 */
var RGBToHex = function (r, g, b)
{
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/** 
 * Converts hex to rgb.
 *
 * @since 0.1.0
 *
 * @param {string} hex The hexadecimal value.
 *
 * @return {Object} An object containing the rgb color values {r:255, g:255, b:255}.
 */
var hexToRGB = function (hex)
{
    // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) 
    {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
    {
        r : parseInt(result[1], 16), 
        g : parseInt(result[2], 16), 
        b : parseInt(result[3], 16)
    } : null;
};

/** 
 * Converts a color name to hex.
 *
 * @since 0.1.0
 *
 * @param {string} c The color name.
 *
 * @return {string} The hexadecimal value.
 */
var colorNameToHex = function (c)
{
    return colorNames[c.toLowerCase()];
};

/** 
 * Get the components colors for an rgba color string.
 *
 * @since 0.1.0
 *
 * @param {string} rgba The rgb(a) color string 'rgba(255, 255, 255, 0.5)'.
 *
 * @return {Object} An object containing the component colors {r:255, g:255, b:255, a:0.5}.
 */
var componentColors = function(rgba)
{
    var arr = rgba.match(/\d+/g);
    var o = 
    {
        r : Math.floor(arr[0]), 
        g : Math.floor(arr[1]), 
        b : Math.floor(arr[2])
    };
    return  o;
};

/**
 * Converts a color to an rgba string.
 *
 * @since 0.1.0
 *
 * @param {string} c        The color.
 * @param {number} opacity  The opacity value 0 to 1.
 *
 * @return {string} An rgba color string 'rgba(255, 255, 255, 0.5)' or undefined if not a valid color.
 */
var toRGBA = function(c, opacity)
{
    var o;
    if (isRGBA(c) && opacity === undefined)
        return c; 
    else if (isRGB(c))
        o = componentColors(c); 
    else if (isHex(c))       
        o = hexToRGB(c);
    else if (isColorName(c))
    {
        var hex = colorNameToHex(c);
        o = hexToRGB(hex);
    }   
    else return undefined;
    
    o.a = opacity !== undefined ? opacity : 1;  
    return 'rgba('+o.r+','+o.g+','+o.b+','+o.a+')';
};

module.exports = 
{
    isColor         : isColor,
    isHex           : isHex,
    isRGB           : isRGB,
    isRGBA          : isRGBA,
    toRGBA          : toRGBA
};
},{}],15:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains functions for manipulating the dom.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          dom 
 */

// Animation polyfill.
var lastTime = 0;
var vendors  = ['ms', 'moz', 'webkit', 'o'];
var raf      = window.requestAnimationFrame;
var caf      = window.cancelAnimationFrame;
for (var x = 0; x < vendors.length && !raf; ++x) 
{
    raf = window[vendors[x]+'RequestAnimationFrame'];
    caf = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}
if (!raf)
{
    raf = function (callback, element) 
    {
        var currTime   = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id         = window.setTimeout(function () {callback(currTime + timeToCall);}, timeToCall);
        lastTime       = currTime + timeToCall;
        return id;
    };
}
if (!caf)
{
    caf = function (id) {clearTimeout(id);};
}

/** 
 * Request animation.
 *
 * @since 0.1.0
 *
 * @param {Function} callback Function to call when it's time to update your animation for the next repaint
 *
 * @return {number} The request id, that uniquely identifies the entry in the callback list.
 */
var requestAnimation = function (callback)
{
    return raf(callback);
};

/** 
 * Cancel animation.
 *
 * @since 0.1.0
 *
 * @param {number} id The id value returned by the call to requestAnimation() that requested the callback.
 */
var cancelAnimation = function (id)
{
    caf(id);
};

/** 
 * Check for support of a feature.
 *
 * @since 0.1.0
 *
 * @param {string} The feature name.
 * @param {string} The version of the specification defining the feature.
 *
 * @return {boolean} true if the browser supports the functionality, otherwise false.
 */
var isSupported = function (feature, version)
{
    return document.implementation.hasFeature(feature, version);
};

/** 
 * Appends the child element to the parent.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} parentElement   The parent element.
 * @param {HTMLElement} childElement    The child element.
 */
var appendChild = function (parentElement, childElement)
{
    parentElement.appendChild(childElement);
};

/** 
 * Appends text to the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * @param {string}      text    The text to add.
 */
var appendText = function (element, text)
{
    var textNode = document.createTextNode(text);                       
    appendChild(element, textNode);
};

/** 
 * Appends html to the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * @param {string}      html    The html to add.
 */
var html = function (element, html)
{
    element.innerHTML = html;
};

/** 
 * Removes an element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The element to remove.
 */
var remove = function (element)
{
    element.parentElement.removeChild(element);
};

/** 
 * Empties the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 */
var empty = function (element)
{
    while (element.firstChild) 
    {
        element.removeChild(element.firstChild);
    }
};

/** 
 * Sets the attributes for the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The target element.
 * @param {object}      attributes  The list of attributes.
 */
var attr = function (element, attributes)
{
    for (var property in attributes) 
    {
        if (attributes.hasOwnProperty(property))  
        {
            element.setAttribute(property, attributes[property]);
        }
    }
};

/** 
 * Removes the attributes from the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The target element.
 * @param {string[]}    attributes  The list of attributes to remove.
 */
var removeAttr = function (element, attributes)
{
    for (var i = 0; i < attributes.length; i++)  
    {
        element.removeAttribute(attributes[i]);
    }
};

/** 
 * Sets the style for the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The target element.
 * @param {object}      styles      The list of style attributes.
 */
var style = function (element, styles)
{
    for (var property in styles) 
    {
        if (styles.hasOwnProperty(property))  
        {
            element.style[property] = styles[property];
        }
    }
};

/** 
 * Creates a html element with the given attributes.
 * 
 * @since 0.1.0
 * 
 * @param {string} type         The element type.
 * @param {object} attributes   The list of attributes.
 * 
 * @return {HTMLElement}        The html element.
 */
var createElement = function (type, attributes)
{
    var htmlElement = document.createElement(type);
    attr(htmlElement, attributes);
    return htmlElement;
};

/** 
 * Creates an svg element with the given attributes.
 * 
 * @since 0.1.0
 * 
 * @param {string} type         The element type.
 * @param {object} attributes   The list of attributes.
 * 
 * @return {HTMLElement}        The html element.
 */
var createSVGElement = function (type, attributes)
{
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', type);
    attr(svgElement, attributes);
    return svgElement;
};

/** 
 * Hides the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 */
var hide = function (element)
{
    element.style.visibility = 'hidden';
};

/** 
 * Shows the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 */
var show = function (element)
{
    element.style.visibility = 'visible';
};

/**
 * Set the opacity of an element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement}  element The target element.
 * @param {HTMLElement}  alpha   The alpha value 0 - 1.
 * 
 */
var opacity = function(element, alpha) 
{
    style(element, {opacity:alpha, filter:'alpha(opacity=' + alpha * 100 + ')'});
};

/** 
 * Check if an element is visible.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * 
 * @return {Boolean} true if visible, otherwise false.
 */
var isVisible = function (element) 
{
    if (element.style.visibility === 'hidden')  return false;
    else                                        return true;
};

/** 
 * Add event listeners to the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element  The target element.
 * @param {string}      types    A space separated string of event types.
 * @param {Function}    listener The function that receives a notification when an event of the specified type occurs.
 */
var on = function (element, types, listener)
{
    var arrTypes = types.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        element.addEventListener(type, listener);
    }
};

/** 
 * Remove event listeners from the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element  The target element.
 * @param {string}      types    A space separated string of event types.
 * @param {Function}    listener The function to remove from the event target.
 */
var off = function (element, types, listener)
{
    var arrTypes = types.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        element.removeEventListener(type, listener);
    }
};

/** 
 * Return the bounds of the target element relative to the viewport.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * 
 * @return {DOMRect} The size of the element and its position relative to the viewport.
 */
var bounds = function (element) 
{
    return element.getBoundingClientRect();
};

/** 
 * Check if a rect is fully contained within the viewport.
 * 
 * @since 0.1.0
 * 
 * @param {Object} rect         The rectangle to test - coords should be relative to the viewport.
 * @param {number} rect.top     The top value.
 * @param {number} rect.right   The right value.
 * @param {number} rect.bottom  The bottom value.
 * @param {number} rect.left    The left value.
 * @param {number} [margin = 0] An optional margin that is applied to the rect.
 * 
 * @return {object} A rectangle that contains the amount of overlap for each edge rect{top:0, right:0, bottom:0, left:0}.
 */
var isRectInViewport = function (rect, margin) 
{
    var w = viewportWidth();
    var h = viewportHeight();
    margin = margin !== undefined ? margin : 0;
    return {
        top     : rect.top  - margin < 0   ? (rect.top - margin) * -1  : 0,
        right   : rect.right + margin > w  ? rect.right + margin - w   : 0,
        bottom  : rect.bottom + margin > h ? rect.bottom + margin - h  : 0,
        left    : rect.left - margin < 0   ? (rect.left - margin) * -1 : 0
    };
};

/** 
 * Get the viewport width.
 * 
 * @since 0.1.0
 * 
 * @return {number} The viewport width.
 */
var viewportWidth = function () 
{
    return document.documentElement.clientWidth;
};

/** 
 * Get the viewport height.
 * 
 * @since 0.1.0
 * 
 * @return {number} The viewport height.
 */
var viewportHeight = function () 
{
    return document.documentElement.clientHeight;
};

/** 
 * Return the page offset (the amount the page is scrolled).
 * 
 * @since 0.1.0
 * 
 * @return {Object} {x:number, y:number}.
 */
var pageOffset = function () 
{
    var doc = document.documentElement;
    return {
        x : (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
        y : (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
    };
};

/**
 * Get the window object of an element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement}  element The target element.
 * 
 * @returns {DocumentView|Window} The window.
 */
var getWindowForElement = function(element) 
{
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
};

module.exports = 
{
    isSupported             : isSupported,
    appendChild             : appendChild,
    appendText              : appendText,
    html                    : html,
    remove                  : remove,
    empty                   : empty,
    attr                    : attr,
    removeAttr              : removeAttr,
    style                   : style,
    createElement           : createElement,
    createSVGElement        : createSVGElement,
    on                      : on,
    off                     : off,
    hide                    : hide,
    show                    : show,
    opacity                 : opacity,
    isVisible               : isVisible,
    bounds                  : bounds,
    isRectInViewport        : isRectInViewport,
    viewportWidth           : viewportWidth,
    viewportHeight          : viewportHeight,
    pageOffset              : pageOffset,
    requestAnimation        : requestAnimation,
    cancelAnimation         : cancelAnimation,
    getWindowForElement     : getWindowForElement
};
},{}],16:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains functions for manipulating svg.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          svg 
 * @requires        utils/dom
 * @requires        utils/color
 */

// Required modules.
var dom       = require('../utils/dom');
var colorUtil = require('../utils/color');

/** 
 * Creates an svg element with the given attributes.
 *
 * @since 0.1.0
 *
 * @param {string} type The svg element type.
 *
 * @return {object} attributes The list of attributes.
 */
var createElement = function (type, attributes)
{
    return dom.createSVGElement(type, attributes);
};

/** 
 * Checks for svg support.
 *
 * @since 0.1.0
 *
 * @return {boolean} true if the browser supports the graphics library, otherwise false.
 */
var isSupported = function ()
{
    return dom.isSupported('http://www.w3.org/TR/SVG11/feature#Shape', '1.0');
};

/** 
 * Returns a drawing canvas.
 *
 * @since 0.1.0
 *
 * @return {SVGElement} An svg element.
 */
var getCanvas = function ()
{
    var canvas = createElement('svg'); 
    dom.style(canvas, {position:'absolute', left:0, right:0});
    return canvas;
};

/** 
 * Returns an svg element of the given type.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  parentElement   The parent element.
 * @param {string}      type            The element type.
 *
 * @return {SVGElement} An svg element.
 */
var getContext = function (parentElement, type)
{
    var element = createElement(type);
    dom.appendChild(parentElement, element);
    return element;
};

/** 
 * Clears the element.
 *
 * @since 0.1.0
 *
 * @param {SVGElement} element The svg element.
 */
var clear = function (element)
{

};

/** 
 * Empties the element.
 *
 * @since 0.1.0
 *
 * @param {SVGElement} element The svg element.
 */
var empty = function (element)
{
    dom.empty(element);
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number}      cx                  The x position of the center of the circle.
 * @param {number}      cy                  The y position of the center of the circle.
 * @param {number}      r                   The circle radius.
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var circle = function (element, cx, cy, r, style)
{
    dom.attr(element, {cx:cx, cy:cy, r:r});
    draw(element, style);
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number}      cx                  The x position of the center of the ellipse.
 * @param {number}      cy                  The y position of the center of the ellipse
 * @param {number}      rx                  The x radius of the ellipse.
 * @param {number}      ry                  The y radius of the ellipse.
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var ellipse = function (element, cx, cy, rx, ry, style)
{
    dom.attr(element, {cx:cx, cy:cy, rx:rx, ry:ry});
    draw(element, style);
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number}      x                   The x position of the top left corner.
 * @param {number}      y                   The y position of the top left corner.
 * @param {number}      w                   The width.
 * @param {number}      h                   The height.
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var rect = function (element, x, y, w, h, style)
{
    dom.attr(element, {x:x, y:y, width:w, height:h});
    draw(element, style);
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number}      x1                  The x position of point 1.
 * @param {number}      y1                  The y position of point 1.
 * @param {number}      x2                  The x position of point 2.
 * @param {number}      y2                  The y position of point 2.
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var line = function (element, x1, y1, x2, y2, style)
{
    dom.attr(element, {x1:x1, y1:y1, x2:x2, y2:y2});
    draw(element, style);
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number[]}    arrCoords           An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var polyline = function (element, arrCoords, style)
{
    dom.attr(element, {points:getCoordsAsString(arrCoords)});
    draw(element, style);
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number[]}    arrCoords           An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var polygon = function (element, arrCoords, style)
{
    dom.attr(element, {points:getCoordsAsString(arrCoords)});
    draw(element, style);
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] 
 * to a comma separated string of coords 'x1 y1, x2 y2, x3 y3, x4 y4, ...'.
 * 
 * @since 0.1.0
 * @private
 * 
 * @param {number[]} arrCoords The list of coords.
 * 
 * @return {string} A string containing the list of coords.
 */
function getCoordsAsString (arrCoords)
{
    var n = arrCoords.length;
    var strPoints = '';
    for (var i = 0; i < n; i+=2)
    {
        if (i !== 0) strPoints += ',';
        strPoints += '' + arrCoords[i] + ' ' + arrCoords[i+1];
    }
    return strPoints;
}

/** 
 * Provides the fill drawing routine.
 *
 * @since 0.1.0
 * @private
 *
 * @param {SVGElement}  element                     The svg element.
 * @param {Object}      [style]                     The style properties.
 * @param {string}      [style.fillColor = none]    The fill color.
 * @param {number}      [style.fillOpacity = 1]     The fill opacity. .
 * @param {string}      [style.lineColor = none]    The line color.
 * @param {number}      [style.lineWidth = 1]       The line width.
 * @param {string}      [style.lineJoin = round]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap = butt]      The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity = 1]     The line opacity. Overrides any alpha value on the fill color.
 */
function draw(element, style)
{
    // Fill.
    var fillColor = style.fillColor !== undefined ? colorUtil.toRGBA(style.fillColor) : 'none';
    if (fillColor != 'none' && style.fillOpacity !== undefined) fillColor = colorUtil.toRGBA(fillColor, style.fillOpacity);

    // Stroke.
    var lineWidth   = style.lineWidth !== undefined ? style.lineWidth : 1;
    var lineJoin    = style.lineJoin  !== undefined ? style.lineJoin  : 'round';
    var lineCap     = style.lineCap   !== undefined ? style.lineCap   : 'butt';
    var lineColor   = style.lineColor !== undefined ? colorUtil.toRGBA(style.lineColor) : 'none';
    if (lineColor != 'none' && style.lineOpacity !== undefined) lineColor = colorUtil.toRGBA(lineColor, style.lineOpacity);

    dom.attr(element, 
    {
        'fill'            : fillColor,
        'stroke'          : lineColor,
        'stroke-width'    : lineWidth,
        'stroke-linejoin' : lineJoin,
        'stroke-linecap'  : lineCap,
    });
}

module.exports = 
{
    createElement : createElement,
    isSupported   : isSupported,
    getCanvas     : getCanvas,
    getContext  : getContext,
    clear         : clear,
    empty         : empty,
    circle        : circle,
    ellipse       : ellipse,
    rect          : rect,
    line          : line,
    polyline      : polyline,
    polygon       : polygon
};
},{"../utils/color":14,"../utils/dom":15}],17:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains utility functions.
 * @author          Jonathan Clare 
 * @copyright   FlowingCharts 2015
 * @module      util 
 */

/** 
 * Check if n is a valid number. Returns false if n is equal to NaN, Infinity, -Infinity or a string eg '10'.
 *
 * @since 0.1.0
 *
 * @param {*} n The number to test.
 *
 * @return {boolean} true, if n is a number, otherwise false.
 */
var isNumber = function (n)
{
    // (typeof n == 'number')   Reject objects that arent number types eg numbers stored as strings such as '10'.
    //                          NaN, Infinity and -Infinity are number types so will pass this test.
    // isFinite(n)              Reject infinite numbers.
    // !isNaN(n))               Reject NaN.
    return (typeof n == 'number') && isFinite(n) && !isNaN(n);
};

/** 
 * Clone an object literal.
 *
 * @since 0.1.0
 *
 * @param {Object} obj The object to be cloned.
 *
 * @return {Object} A clone of the object.
 */
var cloneObject = function (obj) 
{
    var copy = {};

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) 
    {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) 
    {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) 
        {
            copy[i] = cloneObject(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) 
    {
        copy = {};
        for (var attr in obj) 
        {
            if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr]);
        }
        return copy;
    }
};

/** 
 * Extend an object objA with the properties of object objB.
 *
 * @since 0.1.0
 *
 * @param {Object}  objA                            The object to be extended.
 * @param {Object}  objB                            The object whose properties will be added to objA.
 * @param {Boolean} [overwriteProperties = true]    Should objA properties be overwritten if they already exist.
 */
var extendObject = function (objA, objB, overwriteProperties)
{
    for (var key in objB)
    {
         if (objB.hasOwnProperty(key))
         {
            if (overwriteProperties === false)
            {
                if (objA[key] === undefined) objA[key] = objB[key];
            } 
            else objA[key] = objB[key];
         }
    }
};

/** 
 * A function used to extend one class with another.
 *
 * @since 0.1.0
 *
 * @param {Object} baseClass    The class from which to inherit.
 * @param {Object} subClass     The inheriting class, or subclass.
 */
var extendClass = function(baseClass, subClass)
{
    function Inheritance() {}
    Inheritance.prototype = baseClass.prototype;
    subClass.prototype = new Inheritance();
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
};

module.exports = 
{
    isNumber        : isNumber,
    cloneObject     : cloneObject,
    extendObject    : extendObject,
    extendClass     : extendClass
};
},{}]},{},[10])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FudmFzL0NhbnZhcy5qcyIsInNyYy9jaGFydHMvQ2hhcnQuanMiLCJzcmMvY2hhcnRzL0RhdGF0aXAuanMiLCJzcmMvY2hhcnRzL0V2ZW50SGFuZGxlci5qcyIsInNyYy9nZW9tL0NhcnRlc2lhbkNvb3Jkcy5qcyIsInNyYy9nZW9tL1BvaW50LmpzIiwic3JjL2dlb20vUG9sYXJDb29yZHMuanMiLCJzcmMvZ2VvbS9SZWN0YW5nbGUuanMiLCJzcmMvZ2VvbS9WaWV3Qm94LmpzIiwic3JjL21haW4uanMiLCJzcmMvcGx1Z2lucy9qcXVlcnlwbHVnaW4uanMiLCJzcmMvc2VyaWVzL1Nlcmllcy5qcyIsInNyYy91dGlscy9jYW52YXMuanMiLCJzcmMvdXRpbHMvY29sb3IuanMiLCJzcmMvdXRpbHMvZG9tLmpzIiwic3JjL3V0aWxzL3N2Zy5qcyIsInNyYy91dGlscy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzljQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9iQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuLyogZ2xvYmFscyBERUJVRyAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQGZpbGVvdmVydmlldyAgICBFeHBvcnRzIHRoZSB7QGxpbmsgQ2FudmFzfSBjbGFzcy5cclxuICogQGF1dGhvciAgICAgICAgICBKb25hdGhhbiBDbGFyZSBcclxuICogQGNvcHlyaWdodCAgICAgICBGbG93aW5nQ2hhcnRzIDIwMTVcclxuICogQG1vZHVsZSAgICAgICAgICBjYW52YXMvQ2FudmFzIFxyXG4gKiBAcmVxdWlyZXMgICAgICAgIHV0aWxzL3V0aWxcclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9jYW52YXNcclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9kb21cclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9zdmdcclxuICovXHJcblxyXG4vLyBSZXF1aXJlZCBtb2R1bGVzLlxyXG52YXIgdXRpbCAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWwnKTtcclxudmFyIGNhbnZhc1V0aWwgPSByZXF1aXJlKCcuLi91dGlscy9jYW52YXMnKTtcclxudmFyIHN2Z1V0aWwgICAgPSByZXF1aXJlKCcuLi91dGlscy9zdmcnKTtcclxudmFyIGRvbSAgICAgICAgPSByZXF1aXJlKCcuLi91dGlscy9kb20nKTtcclxuXHJcbi8qKiBcclxuICogQGNsYXNzZGVzYyBDbGFzcyBmb3IgZ3JhcGhpY3MgbGlicmFyaWVzLlxyXG4gKlxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIENhbnZhc1xyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlciAgICBUaGUgcmVuZGVyZXIgJ3N2Zycgb3IgJ2NhbnZhcycuXHJcbiAqIEBwYXJhbSB7Q2FydGVzaWFuQ29vcmRzfFBvbGFyQ29vcmRzfSBjb29yZHMgICAgICBUaGUgY29vcmRpbmF0ZSBzeXN0ZW0uIFxyXG4gKi9cclxuZnVuY3Rpb24gQ2FudmFzIChyZW5kZXJlciwgY29vcmRzKVxyXG57XHJcbiAgICAvLyBQcml2YXRlIGluc3RhbmNlIG1lbWJlcnMuICBcclxuICAgIHRoaXMuX2Nvb3JkcyAgICA9IGNvb3JkcztcclxuICAgIHRoaXMuX2l0ZW1zICAgICA9IFtdO1xyXG5cclxuICAgIC8vIENob29zZSB3aGljaCBjYW52YXMgZnVuY3Rpb25zIHRvIHVzZS5cclxuICAgIGlmIChyZW5kZXJlciA9PT0gJ3N2ZycpIHRoaXMuX2cgPSBzdmdVdGlsO1xyXG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgdGhpcy5fZyA9IGNhbnZhc1V0aWw7XHJcblxyXG4gICAgLy8gR2V0IHRoZSBhY3R1YWwgZHJhd2luZyBjYW52YXMuXHJcbiAgICB0aGlzLmNhbnZhcyA9IHRoaXMuX2cuZ2V0Q2FudmFzKCk7XHJcbn1cclxuXHJcbi8qKiBcclxuICogQXBwZW5kcyB0aGUgY2FudmFzIHRvIGEgaHRtbCBlbGVtZW50LlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciBUaGUgaHRtbCBlbGVtZW50LlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uIChjb250YWluZXIpXHJcbntcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbn07XHJcblxyXG4vLyBHZW9tZXRyeS5cclxuXHJcbi8qKiBcclxuICogR2V0IHRoZSB3aWR0aCBvZiB0aGUgY2FudmFzLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgd2lkdGguXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLndpZHRoID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuY2FudmFzLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCB0aGUgaGVpZ2h0IG9mIHRoZSBjYW52YXMuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBoZWlnaHQuXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmhlaWdodCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICAgIHJldHVybiBwYXJzZUludCh0aGlzLmNhbnZhcy5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogU2V0IHRoZSBzaXplIG9mIHRoZSBjYW52YXMuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdyBUaGUgd2lkdGguXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBoIFRoZSBoZWlnaHQuXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbiAodywgaClcclxue1xyXG4gICAgLy88dmFsaWRhdGlvbj5cclxuICAgIGlmICghdXRpbC5pc051bWJlcih3KSkgIHRocm93IG5ldyBFcnJvcignQ2FudmFzLnNldFNpemUodyk6IHcgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgIGlmICh3IDwgMCkgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzLnNldFNpemUodyk6IHcgbXVzdCBiZSA+PSAwLicpO1xyXG4gICAgaWYgKCF1dGlsLmlzTnVtYmVyKGgpKSAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMuc2V0U2l6ZShoKTogaCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgaWYgKGggPCAwKSAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMuc2V0U2l6ZShoKTogaCBtdXN0IGJlID49IDAuJyk7XHJcbiAgICAvLzwvdmFsaWRhdGlvbj5cclxuXHJcbiAgICAvLyBDYW52YXMgc2l6ZS5cclxuICAgIGlmICh3ICE9PSB0aGlzLndpZHRoKCkgfHwgaCAhPT0gdGhpcy5oZWlnaHQoKSkgZG9tLmF0dHIodGhpcy5jYW52YXMsIHt3aWR0aDp3LCBoZWlnaHQ6aH0pO1xyXG59O1xyXG5cclxuLy8gQ3JlYXRlIGNhbnZhcyBpdGVtcy5cclxuXHJcbi8qKiBcclxuICogQ3JlYXRlcyBhIG1hcmtlci5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlICAgICBUaGUgbWFya2VyIHR5cGUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY3hdICAgICBUaGUgeCBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoZSBtYXJrZXIgKGRhdGEgdW5pdHMpLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2N5XSAgICAgVGhlIHkgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgbWFya2VyIChkYXRhIHVuaXRzKS5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtzaXplXSAgIFRoZSBzaXplIG9mIHRoZSBtYXJrZXIgKHBpeGVsIHVuaXRzKS5cclxuICpcclxuICogQHJldHVybiB7T2JqZWN0fSBBIGNhbnZhcyBpdGVtLlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5tYXJrZXIgPSBmdW5jdGlvbiAodHlwZSwgY3gsIGN5LCBzaXplKVxyXG57XHJcbiAgICB2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbSh0eXBlLCB7Y3g6Y3gsIGN5OmN5LCBzaXplOnNpemUsIHVuaXRzOidkYXRhJ30pO1xyXG4gICAgaXRlbS5tYXJrZXIgPSB0cnVlO1xyXG4gICAgcmV0dXJuIGl0ZW07XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENyZWF0ZXMgYSBzaGFwZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSBzaGFwZSB0eXBlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hdICBUaGUgeCBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyIChkYXRhIHVuaXRzKS5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt5XSAgVGhlIHkgcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciAoZGF0YSB1bml0cykuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbd10gIFRoZSB3aWR0aCAoZGF0YSB1bml0cykuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaF0gIFRoZSBoZWlnaHQgKGRhdGEgdW5pdHMpLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IEEgY2FudmFzIGl0ZW0uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLnNoYXBlID0gZnVuY3Rpb24gKHR5cGUsIHgsIHksIHcsIGgpXHJcbntcclxuICAgIHZhciBpdGVtID0gdGhpcy5nZXRJdGVtKHR5cGUsIHt4OngsIHk6eSwgd2lkdGg6dywgaGVpZ2h0OmgsIHVuaXRzOidkYXRhJ30pO1xyXG4gICAgaXRlbS5zaGFwZSA9IHRydWU7XHJcbiAgICByZXR1cm4gaXRlbTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ3JlYXRlcyBhIGNpcmNsZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY3hdICAgICAgICAgICAgIFRoZSB4IHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtjeV0gICAgICAgICAgICAgVGhlIHkgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbcl0gICAgICAgICAgICAgIFRoZSByYWRpdXMgb2YgdGhlIGNpcmNsZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt1bml0cyA9IHBpeGVsXSAgVGhlIHVuaXRzIC0gJ3BpeGVsJyBvciAnZGF0YScuXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdH0gQSBjYW52YXMgaXRlbS5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuY2lyY2xlID0gZnVuY3Rpb24gKGN4LCBjeSwgciwgdW5pdHMpXHJcbntcclxuICAgIHJldHVybiB0aGlzLmdldEl0ZW0oJ2NpcmNsZScsIHtjeDpjeCwgY3k6Y3ksIHI6ciwgdW5pdHM6dW5pdHN9KTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ3JlYXRlcyBhbiBlbGxpcHNlLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFtjeF0gICAgICAgICAgICAgVGhlIHggcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgZWxsaXBzZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtjeV0gICAgICAgICAgICAgVGhlIHkgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgZWxsaXBzZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3J4XSAgICAgICAgICAgICBUaGUgeCByYWRpdXMgb2YgdGhlIGVsbGlwc2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbcnldICAgICAgICAgICAgIFRoZSB5IHJhZGl1cyBvZiB0aGUgZWxsaXBzZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt1bml0cyA9IHBpeGVsXSAgVGhlIHVuaXRzIC0gJ3BpeGVsJyBvciAnZGF0YScuXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdH0gQSBjYW52YXMgaXRlbS5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZWxsaXBzZSA9IGZ1bmN0aW9uIChjeCwgY3ksIHJ4LCByeSwgdW5pdHMpXHJcbntcclxuICAgIHJldHVybiB0aGlzLmdldEl0ZW0oJ2VsbGlwc2UnLCB7Y3g6Y3gsIGN5OmN5LCByeDpyeCwgcnk6cnksIHVuaXRzOnVuaXRzfSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENyZWF0ZXMgYSByZWN0YW5nbGUuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hdICAgICAgICAgICAgICBUaGUgeCBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3ldICAgICAgICAgICAgICBUaGUgeSBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3ddICAgICAgICAgICAgICBUaGUgd2lkdGguXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaF0gICAgICAgICAgICAgIFRoZSBoZWlnaHQuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbdW5pdHMgPSBwaXhlbF0gIFRoZSB1bml0cyAtICdwaXhlbCcgb3IgJ2RhdGEnLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IEEgY2FudmFzIGl0ZW0uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLnJlY3QgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCwgdW5pdHMpXHJcbntcclxuICAgIHJldHVybiB0aGlzLmdldEl0ZW0oJ3JlY3QnLCB7eDp4LCB5OnksIHdpZHRoOncsIGhlaWdodDpoLCB1bml0czp1bml0c30pO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDcmVhdGVzIGEgbGluZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeDFdICAgICAgICAgICAgIFRoZSB4IHBvc2l0aW9uIG9mIHBvaW50IDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeTFdICAgICAgICAgICAgIFRoZSB5IHBvc2l0aW9uIG9mIHBvaW50IDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeDJdICAgICAgICAgICAgIFRoZSB4IHBvc2l0aW9uIG9mIHBvaW50IDIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeTJdICAgICAgICAgICAgIFRoZSB5IHBvc2l0aW9uIG9mIHBvaW50IDIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbdW5pdHMgPSBwaXhlbF0gIFRoZSB1bml0cyAtICdwaXhlbCcgb3IgJ2RhdGEnLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IEEgY2FudmFzIGl0ZW0uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmxpbmUgPSBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIsIHVuaXRzKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5nZXRJdGVtKCdsaW5lJywge3gxOngxLCB5MTp5MSwgeDI6eDIsIHkyOnkyLCB1bml0czp1bml0c30pO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDcmVhdGVzIGEgcG9seWxpbmUuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcltdfSAgICBhcnJDb29yZHMgICAgICAgQW4gYXJyYXkgb2YgeHkgcG9zaXRpb25zIG9mIHRoZSBmb3JtIFt4MSwgeTEsIHgyLCB5MiwgeDMsIHkzLCB4NCwgeTQuLi5dLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbdW5pdHMgPSBwaXhlbF0gVGhlIHVuaXRzIC0gJ3BpeGVsJyBvciAnZGF0YScuXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdH0gQSBjYW52YXMgaXRlbS5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUucG9seWxpbmUgPSBmdW5jdGlvbiAoYXJyQ29vcmRzLCB1bml0cylcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbSgncG9seWxpbmUnLCB7cG9pbnRzOmFyckNvb3JkcywgdW5pdHM6dW5pdHN9KTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ3JlYXRlcyBhIHBvbHlnb24uXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcltdfSAgICBhcnJDb29yZHMgICAgICAgQW4gYXJyYXkgb2YgeHkgcG9zaXRpb25zIG9mIHRoZSBmb3JtIFt4MSwgeTEsIHgyLCB5MiwgeDMsIHkzLCB4NCwgeTQuLi5dLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbdW5pdHMgPSBwaXhlbF0gVGhlIHVuaXRzIC0gJ3BpeGVsJyBvciAnZGF0YScuXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdH0gQSBjYW52YXMgaXRlbS5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUucG9seWdvbiA9IGZ1bmN0aW9uIChhcnJDb29yZHMsIHVuaXRzKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5nZXRJdGVtKCdwb2x5Z29uJywge3BvaW50czphcnJDb29yZHMsIHVuaXRzOnVuaXRzfSk7XHJcbn07XHJcblxyXG4vLyBEcmF3aW5nLlxyXG5cclxuLyoqIFxyXG4gKiBFbXB0aWVzIHRoZSBjYW52YXMuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICAgIHRoaXMuX2l0ZW1zID0gW107XHJcbiAgICB0aGlzLl9nLmVtcHR5KHRoaXMuY2FudmFzKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmVuZGVycyB0aGUgY2FudmFzLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgdGhpcy5fZy5jbGVhcih0aGlzLmNhbnZhcyk7XHJcbiAgICBcclxuICAgIHZhciBuID0gdGhpcy5faXRlbXMubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspICBcclxuICAgIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2l0ZW1zW2ldO1xyXG4gICAgICAgIHRoaXMuZHJhd0l0ZW0oaXRlbSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIERyYXdzIGFuIGl0ZW0uXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSBBIGNhbnZhcyBpdGVtLlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5kcmF3SXRlbSA9IGZ1bmN0aW9uIChpdGVtKVxyXG57XHJcbiAgICB2YXIgcDtcclxuICAgIGlmICh0aGlzLl9jb29yZHMgIT09IHVuZGVmaW5lZCAmJiBpdGVtLmNvb3Jkcy51bml0cyA9PT0gJ2RhdGEnKSBwID0gdGhpcy5nZXRQaXhlbFVuaXRzKGl0ZW0pOyAgIC8vIENhbnZhcyB1c2luZyBkYXRhIHVuaXRzLlxyXG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAgPSBpdGVtLmNvb3JkczsgICAgICAgICAgICAgICAgLy8gQ2FudmFzIHVzaW5nIHBpeGVsIHVuaXRzLlxyXG5cclxuICAgIGlmIChpdGVtLm1hcmtlcikgXHJcbiAgICB7XHJcbiAgICAgICAgLy8gY29vcmRze2N4LCBjeSwgc2l6ZX1cclxuICAgICAgICB2YXIgciA9IHAuc2l6ZSAvIDI7XHJcbiAgICAgICAgc3dpdGNoKGl0ZW0udHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NpcmNsZScgICA6IHRoaXMuX2cuY2lyY2xlKGl0ZW0uY29udGV4dCwgcC5jeCwgcC5jeSwgciwgaXRlbS5zdHlsZSk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdlbGxpcHNlJyAgOiB0aGlzLl9nLmVsbGlwc2UoaXRlbS5jb250ZXh0LCBwLmN4LCBwLmN5LCByLCByLCBpdGVtLnN0eWxlKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JlY3QnICAgICA6IHRoaXMuX2cucmVjdChpdGVtLmNvbnRleHQsIHAuY3gtciwgcC5jeS1yLCBwLnNpemUsIHAuc2l6ZSwgaXRlbS5zdHlsZSk7IGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0gXHJcbiAgICBlbHNlIGlmIChpdGVtLnNoYXBlKSBcclxuICAgIHtcclxuICAgICAgICAvLyBjb29yZHN7eCwgeSwgd2lkdGgsIGhlaWdodH1cclxuICAgICAgICBzd2l0Y2goaXRlbS50eXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAncmVjdCcgICAgIDogdGhpcy5fZy5yZWN0KGl0ZW0uY29udGV4dCwgcC54LCBwLnksIHAud2lkdGgsIHAuaGVpZ2h0LCBpdGVtLnN0eWxlKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2VsbGlwc2UnICA6IHRoaXMuX2cuZWxsaXBzZShpdGVtLmNvbnRleHQsIHAueCsocC53aWR0aC8yKSwgcC55KyhwLmhlaWdodC8yKSwgcC53aWR0aC8yLCBwLmhlaWdodC8yLCBpdGVtLnN0eWxlKTsgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaChpdGVtLnR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdjaXJjbGUnICAgOiB0aGlzLl9nLmNpcmNsZShpdGVtLmNvbnRleHQsIHAuY3gsIHAuY3ksIHAuciwgaXRlbS5zdHlsZSk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdlbGxpcHNlJyAgOiB0aGlzLl9nLmVsbGlwc2UoaXRlbS5jb250ZXh0LCBwLmN4LCBwLmN5LCBwLnJ4LCBwLnJ5LCBpdGVtLnN0eWxlKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JlY3QnICAgICA6IHRoaXMuX2cucmVjdChpdGVtLmNvbnRleHQsIHAueCwgcC55LCBwLndpZHRoLCBwLmhlaWdodCwgaXRlbS5zdHlsZSk7ICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbGluZScgICAgIDogdGhpcy5fZy5saW5lKGl0ZW0uY29udGV4dCwgcC54MSwgcC55MSwgcC54MiwgcC55MiwgaXRlbS5zdHlsZSk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdwb2x5Z29uJyAgOiB0aGlzLl9nLnBvbHlnb24oaXRlbS5jb250ZXh0LCBwLnBvaW50cywgaXRlbS5zdHlsZSk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdwb2x5bGluZScgOiB0aGlzLl9nLnBvbHlsaW5lKGl0ZW0uY29udGV4dCwgcC5wb2ludHMsIGl0ZW0uc3R5bGUpOyBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEFkZHMgYW4gaXRlbS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIEEgY2FudmFzIGl0ZW0uXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNhbnZhcyBpdGVtLlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5hZGRJdGVtID0gZnVuY3Rpb24gKGl0ZW0pXHJcbntcclxuICAgIGl0ZW0uY29udGV4dCA9IHRoaXMuX2cuZ2V0Q29udGV4dCh0aGlzLmNhbnZhcywgaXRlbS50eXBlKTtcclxuICAgIHRoaXMuX2l0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICByZXR1cm4gaXRlbTtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJucyBhIGNhbnZhcyBpdGVtLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHByaXZhdGVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgICAgIFRoZSBzaGFwZSB0eXBlLlxyXG4gKiBAcGFyYW0ge09iamVjdH0gY29vcmRzICAgVGhlIGNvb3Jkcy5cclxuICpcclxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgY2FudmFzIGl0ZW0uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmdldEl0ZW0gPSBmdW5jdGlvbiAodHlwZSwgY29vcmRzKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5hZGRJdGVtKHt0eXBlOnR5cGUsIGNvb3Jkczpjb29yZHN9KTtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJucyBhIGhpdCBldmVudCBmb3IgdGhlIG5lYXJlc3QgaXRlbS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB4IHBpeGVsIGNvb3JkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geSBUaGUgeSBwaXhlbCBjb29yZC5cclxuICpcclxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgY2FudmFzIGl0ZW0uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmhpdEV2ZW50ID0gZnVuY3Rpb24gKHgsIHkpXHJcbntcclxuICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgdmFyIHNob3J0ZXN0RGlzdGFuY2UgPSBJbmZpbml0eTtcclxuXHJcbiAgICB2YXIgbiA9IHRoaXMuX2l0ZW1zLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSAgXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9pdGVtc1tpXTtcclxuICAgICAgICB2YXIgcCAgICA9IHRoaXMuZ2V0UGl4ZWxVbml0cyhpdGVtKTtcclxuICAgICAgICB2YXIgZHggICA9IHggLSBwLmN4O1xyXG4gICAgICAgIHZhciBkeSAgID0geSAtIHAuY3k7XHJcbiAgICAgICAgdmFyIGRwICAgPSBNYXRoLnNxcnQoTWF0aC5wb3coZHgsIDIpICsgTWF0aC5wb3coZHksIDIpKTtcclxuXHJcbiAgICAgICAgaWYgKGRwID09PSBzaG9ydGVzdERpc3RhbmNlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGRwIDwgc2hvcnRlc3REaXN0YW5jZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICBzaG9ydGVzdERpc3RhbmNlID0gZHA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtcy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBkID0gdGhpcy5nZXRQaXhlbFVuaXRzKGl0ZW1zWzBdKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpdGVtcyAgICA6IGl0ZW1zLCBcclxuICAgICAgICAgICAgZGlzdGFuY2UgOiBzaG9ydGVzdERpc3RhbmNlLCBcclxuICAgICAgICAgICAgcGl4ZWxYICAgOiBkLmN4LCBcclxuICAgICAgICAgICAgcGl4ZWxZICAgOiBkLmN5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHVuZGVmaW5lZDtcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0cyB0aGUgcGl4ZWwgdW5pdHMgZm9yIGFuIGl0ZW0uXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgaXRlbSAgICBUaGUgY2FudmFzIGl0ZW0uXHJcbiAqIEBwYXJhbSB7Q2FydGVzaWFuQ29vcmRzfFBvbGFyQ29vcmRzfSBjb29yZHMgIFRoZSBjb29yZGluYXRlIHN5c3RlbSBcclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZ2V0UGl4ZWxVbml0cyA9IGZ1bmN0aW9uIChpdGVtKVxyXG57XHJcbiAgICB2YXIgcGl4ZWxVbml0cyA9IHt9O1xyXG5cclxuICAgIGlmIChpdGVtLm1hcmtlcikgXHJcbiAgICB7XHJcbiAgICAgICAgLy8gY29vcmRze2N4LCBjeSwgc2l6ZX1cclxuICAgICAgICBwaXhlbFVuaXRzLmN4ICAgPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxYKGl0ZW0uY29vcmRzLmN4KTtcclxuICAgICAgICBwaXhlbFVuaXRzLmN5ICAgPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxZKGl0ZW0uY29vcmRzLmN5KTsgXHJcbiAgICAgICAgcGl4ZWxVbml0cy5zaXplID0gaXRlbS5jb29yZHMuc2l6ZTsgXHJcbiAgICB9IFxyXG4gICAgZWxzZSBpZiAoaXRlbS5zaGFwZSkgXHJcbiAgICB7XHJcbiAgICAgICAgLy8gY29vcmRze3gsIHksIHdpZHRoLCBoZWlnaHR9XHJcbiAgICAgICAgcGl4ZWxVbml0cy54ICAgICAgPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxYKGl0ZW0uY29vcmRzLngpO1xyXG4gICAgICAgIHBpeGVsVW5pdHMueSAgICAgID0gdGhpcy5fY29vcmRzLmdldFBpeGVsWShpdGVtLmNvb3Jkcy55KTsgXHJcbiAgICAgICAgcGl4ZWxVbml0cy53aWR0aCAgPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxEaW1lbnNpb25YKGl0ZW0uY29vcmRzLndpZHRoKTtcclxuICAgICAgICBwaXhlbFVuaXRzLmhlaWdodCA9IHRoaXMuX2Nvb3Jkcy5nZXRQaXhlbERpbWVuc2lvblkoaXRlbS5jb29yZHMuaGVpZ2h0KTsgXHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoKGl0ZW0udHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIGNvb3Jkc3tjeCwgY3ksIHJ9XHJcbiAgICAgICAgICAgIGNhc2UgJ2NpcmNsZSc6ICAgICAgXHJcbiAgICAgICAgICAgICAgICBwaXhlbFVuaXRzLmN4ID0gdGhpcy5fY29vcmRzLmdldFBpeGVsWChpdGVtLmNvb3Jkcy5jeCk7XHJcbiAgICAgICAgICAgICAgICBwaXhlbFVuaXRzLmN5ID0gdGhpcy5fY29vcmRzLmdldFBpeGVsWShpdGVtLmNvb3Jkcy5jeSk7IFxyXG4gICAgICAgICAgICAgICAgcGl4ZWxVbml0cy5yICA9IGl0ZW0uY29vcmRzLnI7IFxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgLy8gY29vcmRze2N4LCBjeSwgcngsIHJ5fVxyXG4gICAgICAgICAgICBjYXNlICdlbGxpcHNlJzogICAgIFxyXG4gICAgICAgICAgICAgICAgcGl4ZWxVbml0cy5jeCA9IHRoaXMuX2Nvb3Jkcy5nZXRQaXhlbFgoaXRlbS5jb29yZHMuY3gpO1xyXG4gICAgICAgICAgICAgICAgcGl4ZWxVbml0cy5jeSA9IHRoaXMuX2Nvb3Jkcy5nZXRQaXhlbFkoaXRlbS5jb29yZHMuY3kpOyBcclxuICAgICAgICAgICAgICAgIHBpeGVsVW5pdHMucnggPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxEaW1lbnNpb25YKGl0ZW0uY29vcmRzLnJ4KTtcclxuICAgICAgICAgICAgICAgIHBpeGVsVW5pdHMucnkgPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxEaW1lbnNpb25ZKGl0ZW0uY29vcmRzLnJ5KTsgXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyBjb29yZHN7eCwgeSwgd2lkdGgsIGhlaWdodH0gIFxyXG4gICAgICAgICAgICBjYXNlICdyZWN0JzogICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcGl4ZWxVbml0cy54ICAgICAgPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxYKGl0ZW0uY29vcmRzLngpO1xyXG4gICAgICAgICAgICAgICAgcGl4ZWxVbml0cy55ICAgICAgPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxZKGl0ZW0uY29vcmRzLnkpOyBcclxuICAgICAgICAgICAgICAgIHBpeGVsVW5pdHMud2lkdGggID0gdGhpcy5fY29vcmRzLmdldFBpeGVsRGltZW5zaW9uWChpdGVtLmNvb3Jkcy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICBwaXhlbFVuaXRzLmhlaWdodCA9IHRoaXMuX2Nvb3Jkcy5nZXRQaXhlbERpbWVuc2lvblkoaXRlbS5jb29yZHMuaGVpZ2h0KTsgXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyBjb29yZHN7eDEsIHkxLCB4MiwgeTJ9XHJcbiAgICAgICAgICAgIGNhc2UgJ2xpbmUnOiAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHBpeGVsVW5pdHMueDEgPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxYKGl0ZW0uY29vcmRzLngxKTtcclxuICAgICAgICAgICAgICAgIHBpeGVsVW5pdHMueTEgPSB0aGlzLl9jb29yZHMuZ2V0UGl4ZWxZKGl0ZW0uY29vcmRzLnkxKTsgXHJcbiAgICAgICAgICAgICAgICBwaXhlbFVuaXRzLngyID0gdGhpcy5fY29vcmRzLmdldFBpeGVsWChpdGVtLmNvb3Jkcy54Mik7XHJcbiAgICAgICAgICAgICAgICBwaXhlbFVuaXRzLnkyID0gdGhpcy5fY29vcmRzLmdldFBpeGVsWShpdGVtLmNvb3Jkcy55Mik7IFxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgLy8gY29vcmRze3BvaW50c31cclxuICAgICAgICAgICAgY2FzZSAncG9seWxpbmUnOiAgICBcclxuICAgICAgICAgICAgICAgIHBpeGVsVW5pdHMucG9pbnRzID0gdGhpcy5fY29vcmRzLmdldFBpeGVsQXJyYXkoaXRlbS5jb29yZHMucG9pbnRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vIGNvb3Jkc3twb2ludHN9IFxyXG4gICAgICAgICAgICBjYXNlICdwb2x5Z29uJzogICAgICBcclxuICAgICAgICAgICAgICAgIHBpeGVsVW5pdHMucG9pbnRzID0gdGhpcy5fY29vcmRzLmdldFBpeGVsQXJyYXkoaXRlbS5jb29yZHMucG9pbnRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwaXhlbFVuaXRzO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7IiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuLyogZ2xvYmFscyBERUJVRyAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQGZpbGVvdmVydmlldyAgICBFeHBvcnRzIHRoZSB7QGxpbmsgQ2hhcnR9IGNsYXNzLlxyXG4gKiBAYXV0aG9yICAgICAgICAgIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0ICAgICAgIEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlICAgICAgICAgIGNoYXJ0cy9DaGFydCBcclxuICogQHJlcXVpcmVzICAgICAgICBjaGFydHMvRXZlbnRIYW5kbGVyXHJcbiAqIEByZXF1aXJlcyAgICAgICAgY2hhcnRzL2RhdGF0aXBcclxuICogQHJlcXVpcmVzICAgICAgICBzZXJpZXMvU2VyaWVzXHJcbiAqIEByZXF1aXJlcyAgICAgICAgY2FudmFzL0NhbnZhc1xyXG4gKiBAcmVxdWlyZXMgICAgICAgIGdlb20vQ2FydGVzaWFuQ29vcmRzXHJcbiAqIEByZXF1aXJlcyAgICAgICAgZ2VvbS9Qb2xhckNvb3Jkc1xyXG4gKiBAcmVxdWlyZXMgICAgICAgIHV0aWxzL3V0aWxcclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9kb21cclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9zdmdcclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9jb2xvclxyXG4gKi9cclxuXHJcbi8vIFJlcXVpcmVkIG1vZHVsZXMuXHJcbnZhciBFdmVudEhhbmRsZXIgICAgICAgID0gcmVxdWlyZSgnLi9FdmVudEhhbmRsZXInKTtcclxudmFyIERhdGF0aXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL0RhdGF0aXAnKTtcclxudmFyIENhbnZhcyAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLi9jYW52YXMvQ2FudmFzJyk7XHJcbnZhciBDYXJ0ZXNpYW5Db29yZHMgICAgID0gcmVxdWlyZSgnLi4vZ2VvbS9DYXJ0ZXNpYW5Db29yZHMnKTtcclxudmFyIFBvbGFyQ29vcmRzICAgICAgICAgPSByZXF1aXJlKCcuLi9nZW9tL1BvbGFyQ29vcmRzJyk7XHJcbnZhciBTZXJpZXMgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vc2VyaWVzL1NlcmllcycpO1xyXG52YXIgdXRpbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWwnKTtcclxudmFyIGRvbSAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlscy9kb20nKTtcclxudmFyIGNvbG9yVXRpbCAgICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlscy9jb2xvcicpO1xyXG5cclxuLyoqIFxyXG4gKiBAY2xhc3NkZXNjIEEgYmFzZSBjbGFzcyBmb3IgY2hhcnRzLlxyXG4gKlxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIENoYXJ0XHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgb3B0aW9ucyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjaGFydCBvcHRpb25zLlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvcHRpb25zLmNvbnRhaW5lciAgICAgICAgICAgICAgICAgICAgICAgVGhlIGh0bWwgZWxlbWVudCB0aGF0IHdpbGwgY29udGFpbiB0aGUgY2hhcnQuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtvcHRpb25zLmNvb3JkaW5hdGVTeXN0ZW0gPSBjYXJ0ZXNpYW5dICBUaGUgY29vcmRpbmF0ZSBzeXN0ZW0uIFBvc3NpYmxlIHZhbHVlcyBhcmUgJ2NhcnRlc2lhbicgb3IgJ3BvbGFyJy5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW29wdGlvbnMucmVuZGVyZXIgPSBzdmddICAgICAgICAgICAgICAgIFRoZSBncmFwaGljcyByZW5kZXJlci4gUG9zc2libGUgdmFsdWVzIGFyZSAnY2FudmFzJyBvciAnc3ZnJy5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW29wdGlvbnMucmVmcmVzaFJhdGUgPSAyNTBdICAgICAgICAgICAgICBUaGUgcmF0ZSBpbiBtcyB0aGF0IGdyYXBoaWNzIGFyZSByZW5kZXJlZCB3aGVuIHRoZSBjaGFydCBpcyByZXNpemVkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5wYWRkaW5nID0gMjBdICAgICAgICAgICAgICAgICAgVGhlIGNoYXJ0IHBhZGRpbmcuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLnBhZGRpbmdUb3BdICAgICAgICAgICAgICAgICAgICBUaGUgY2hhcnQgdG9wIHBhZGRpbmcuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLnBhZGRpbmdSaWdodF0gICAgICAgICAgICAgICAgICBUaGUgY2hhcnQgcmlnaHQgcGFkZGluZy5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW29wdGlvbnMucGFkZGluZ0JvdHRvbV0gICAgICAgICAgICAgICAgIFRoZSBjaGFydCBib3R0b20gcGFkZGluZy5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW29wdGlvbnMucGFkZGluZ0xlZnRdICAgICAgICAgICAgICAgICAgIFRoZSBjaGFydCBsZWZ0IHBhZGRpbmcuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLmJvcmRlcl0gICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2hhcnQgYm9yZGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5ib3JkZXJUb3BdICAgICAgICAgICAgICAgICAgICAgVGhlIGNoYXJ0IHRvcCBib3JkZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLmJvcmRlclJpZ2h0XSAgICAgICAgICAgICAgICAgICBUaGUgY2hhcnQgcmlnaHQgYm9yZGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5ib3JkZXJCb3R0b21dICAgICAgICAgICAgICAgICAgVGhlIGNoYXJ0IGJvdHRvbSBib3JkZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLmJvcmRlckxlZnRdICAgICAgICAgICAgICAgICAgICBUaGUgY2hhcnQgbGVmdCBib3JkZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLmJhY2tncm91bmRdICAgICAgICAgICAgICAgICAgICBUaGUgY2hhcnQgYmFja2dyb3VuZC5cclxuICovXHJcbmZ1bmN0aW9uIENoYXJ0IChvcHRpb25zKVxyXG57XHJcbiAgICAvLyBQYXJlbnQgaHRtbCBlbGVtZW50LlxyXG4gICAgdmFyIGNvbnRhaW5lciA9IG9wdGlvbnMuY2hhcnQuY29udGFpbmVyO1xyXG4gICAgZG9tLmVtcHR5KGNvbnRhaW5lcik7XHJcblxyXG4gICAgLy8gUmVzaXplIHRoZSBjaGFydCB0byBmaXQgdGhlIGNvbnRhaW5lciB3aGVuIHRoZSB3aW5kb3cgcmVzaXplcy5cclxuICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICB2YXIgcmVzaXplVGltZW91dDtcclxuICAgIGRvbS5vbih3aW5kb3csICdyZXNpemUnLCBmdW5jdGlvbiAoZXZlbnQpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gQWRkIGEgcmVzaXplVGltZW91dCB0byBzdG9wIG11bHRpcGxlIGNhbGxzIHRvIHNldFNpemUoKS5cclxuICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplVGltZW91dCk7XHJcbiAgICAgICAgcmVzaXplVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKClcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICB2YXIgYm91bmRzID0gZG9tLmJvdW5kcyhtZS5fY2FudmFzQ29udGFpbmVyKTsgICAgICAgXHJcbiAgICAgICAgICAgIG1lLnNldFNpemUoYm91bmRzLndpZHRoLCBib3VuZHMuaGVpZ2h0KTtcclxuICAgICAgICB9LCBtZS5fb3B0aW9ucy5yZWZyZXNoUmF0ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMob3B0aW9ucyk7IFxyXG59XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIG9wdGlvbnMgZm9yIHRoZSBjaGFydC5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIG9wdGlvbnMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2hhcnQgb3B0aW9ucy5cclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb3B0aW9ucy5jb250YWluZXIgICAgICAgICAgICAgICAgICAgICAgIFRoZSBodG1sIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGNoYXJ0LlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbb3B0aW9ucy5jb29yZGluYXRlU3lzdGVtID0gY2FydGVzaWFuXSAgVGhlIGNvb3JkaW5hdGUgc3lzdGVtLiBQb3NzaWJsZSB2YWx1ZXMgYXJlICdjYXJ0ZXNpYW4nIG9yICdwb2xhcicuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtvcHRpb25zLnJlbmRlcmVyID0gc3ZnXSAgICAgICAgICAgICAgICBUaGUgZ3JhcGhpY3MgcmVuZGVyZXIuIFBvc3NpYmxlIHZhbHVlcyBhcmUgJ2NhbnZhcycgb3IgJ3N2ZycuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtvcHRpb25zLnJlZnJlc2hSYXRlID0gMjUwXSAgICAgICAgICAgICBUaGUgcmF0ZSBpbiBtcyB0aGF0IGdyYXBoaWNzIGFyZSByZWZyZXNoZWQgd2hlbiB0aGUgY2hhcnQgaXMgcmVzaXplZC5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW29wdGlvbnMucGFkZGluZyA9IDIwXSAgICAgICAgICAgICAgICAgIFRoZSBjaGFydCBwYWRkaW5nLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5wYWRkaW5nVG9wXSAgICAgICAgICAgICAgICAgICAgVGhlIGNoYXJ0IHRvcCBwYWRkaW5nLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5wYWRkaW5nUmlnaHRdICAgICAgICAgICAgICAgICAgVGhlIGNoYXJ0IHJpZ2h0IHBhZGRpbmcuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLnBhZGRpbmdCb3R0b21dICAgICAgICAgICAgICAgICBUaGUgY2hhcnQgYm90dG9tIHBhZGRpbmcuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLnBhZGRpbmdMZWZ0XSAgICAgICAgICAgICAgICAgICBUaGUgY2hhcnQgbGVmdCBwYWRkaW5nLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5ib3JkZXJdICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNoYXJ0IGJvcmRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW29wdGlvbnMuYm9yZGVyVG9wXSAgICAgICAgICAgICAgICAgICAgIFRoZSBjaGFydCB0b3AgYm9yZGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5ib3JkZXJSaWdodF0gICAgICAgICAgICAgICAgICAgVGhlIGNoYXJ0IHJpZ2h0IGJvcmRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW29wdGlvbnMuYm9yZGVyQm90dG9tXSAgICAgICAgICAgICAgICAgIFRoZSBjaGFydCBib3R0b20gYm9yZGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5ib3JkZXJMZWZ0XSAgICAgICAgICAgICAgICAgICAgVGhlIGNoYXJ0IGxlZnQgYm9yZGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5iYWNrZ3JvdW5kXSAgICAgICAgICAgICAgICAgICAgVGhlIGNoYXJ0IGJhY2tncm91bmQuXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdHxDaGFydH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgb3B0aW9ucyBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5DaGFydC5wcm90b3R5cGUub3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9vcHRpb25zID0gLy8gRGVmYXVsdCBjaGFydCBvcHRpb25zLlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29udGFpbmVyICAgICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgY29vcmRpbmF0ZVN5c3RlbSAgICA6ICdjYXJ0ZXNpYW4nLFxyXG4gICAgICAgICAgICByZW5kZXJlciAgICAgICAgICAgIDogJ3N2ZycsXHJcbiAgICAgICAgICAgIHJlZnJlc2hSYXRlICAgICAgICAgOiAyNTAsXHJcbiAgICAgICAgICAgIHBhZGRpbmcgICAgICAgICAgICAgOiAyMCxcclxuICAgICAgICAgICAgcGFkZGluZ1RvcCAgICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgcGFkZGluZ1JpZ2h0ICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgcGFkZGluZ0JvdHRvbSAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgcGFkZGluZ0xlZnQgICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgYm9yZGVyICAgICAgICAgICAgICA6IHtsaW5lQ29sb3IgOiAnI2NjY2NjYyd9LFxyXG4gICAgICAgICAgICBib3JkZXJUb3AgICAgICAgICAgIDoge2xpbmVXaWR0aCA6IDB9LFxyXG4gICAgICAgICAgICBib3JkZXJSaWdodCAgICAgICAgIDoge2xpbmVXaWR0aCA6IDB9LFxyXG4gICAgICAgICAgICBib3JkZXJCb3R0b20gICAgICAgIDoge2xpbmVXaWR0aCA6IDF9LFxyXG4gICAgICAgICAgICBib3JkZXJMZWZ0ICAgICAgICAgIDoge2xpbmVXaWR0aCA6IDF9LFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kICAgICAgICAgIDogdW5kZWZpbmVkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHBhc3NlZCBpbiBvcHRpb25zLlxyXG4gICAgICAgIGlmIChvcHRpb25zLmNoYXJ0LmJvcmRlciAhPT0gdW5kZWZpbmVkKSB1dGlsLmV4dGVuZE9iamVjdChvcHRpb25zLmNoYXJ0LmJvcmRlciwgdGhpcy5fb3B0aW9ucy5ib3JkZXIsIGZhbHNlKTtcclxuICAgICAgICB1dGlsLmV4dGVuZE9iamVjdCh0aGlzLl9vcHRpb25zLCBvcHRpb25zLmNoYXJ0KTtcclxuXHJcbiAgICAgICAgLy8gSG9sZHMgdGhlIGNhbnZhc2VzLlxyXG4gICAgICAgIHRoaXMuX2FyckNhbnZhcyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGNvb3JkcyBvYmplY3QgZm9yIHRoZSBnaXZlbiBjb29yZGluYXRlIHN5c3RlbS5cclxuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5jb29yZGluYXRlU3lzdGVtID09PSAncG9sYXInKSB0aGlzLl9jb29yZHMgPSBuZXcgUG9sYXJDb29yZHMoKTsgICAgIC8vIFBvbGFyLlxyXG4gICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nvb3JkcyA9IG5ldyBDYXJ0ZXNpYW5Db29yZHMoKTsgLy8gQ2FydGVzaWFuLiAgICBcclxuXHJcbiAgICAgICAgLy8gQ29udGFpbmVyIGZvciBob2xkaW5nIHRoZSBkcmF3aW5nIGNhbnZhc2VzLiBXZSBuZWVkIGEgcmVsYXRpdmUgcG9zaXRpb25lZCBjb250YWluZXIgc28gd2UgY2FuIHN0YWNrIGNhbnZhc2VzIGluc2lkZSBpdCB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbmluZy5cclxuICAgICAgICB0aGlzLl9jYW52YXNDb250YWluZXIgID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRvbS5zdHlsZSh0aGlzLl9jYW52YXNDb250YWluZXIgLCB7cG9zaXRpb24gOiAncmVsYXRpdmUnLCB3aWR0aDonMTAwJScsIGhlaWdodDonMTAwJSd9KTtcclxuICAgICAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5fb3B0aW9ucy5jb250YWluZXIsIHRoaXMuX2NhbnZhc0NvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIC8vIENoYXJ0IGZvcm1hdHRpbmcuXHJcbiAgICAgICAgdGhpcy5hZGRDaGFydEZvcm1hdHRpbmcodGhpcy5fb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIFNlcmllcy5cclxuICAgICAgICB0aGlzLl9zZXJpZXMgPSBbXTtcclxuICAgICAgICBpZiAob3B0aW9ucy5zZXJpZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMuc2VyaWVzLmxlbmd0aDsgaSsrKSAgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIGNhbnZhcyBmb3IgdGhlIHNlcmllcy5cclxuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNDYW52YXMgPSB0aGlzLmFkZENhbnZhcygpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgc2VyaWVzLlxyXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBuZXcgU2VyaWVzKHNlcmllc0NhbnZhcywgb3B0aW9ucy5zZXJpZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VyaWVzLnB1c2gocyk7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSW50ZXJhY3Rpb24gY2FudmFzLlxyXG4gICAgICAgIHRoaXMuX3VpQ2FudmFzID0gdGhpcy5hZGRDYW52YXMoKTtcclxuXHJcbiAgICAgICAgLy8gRXZlbnQgaGFuZGxlci5cclxuICAgICAgICB0aGlzLmFkZEV2ZW50SGFuZGxlcih0aGlzLl9vcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IGNoYXJ0cyBzaXplIHRvIHRoYXQgb2YgdGhlIGNvbnRhaW5lciAtIGl0IHdpbGwgc3Vic2VxdWVudGx5IGJlIHJlbmRlcmVkLlxyXG4gICAgICAgIHZhciBib3VuZHMgPSBkb20uYm91bmRzKHRoaXMuX2NhbnZhc0NvbnRhaW5lcik7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0U2l6ZShib3VuZHMud2lkdGgsIGJvdW5kcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICB0aGlzLl9kYXRhdGlwID0gbmV3IERhdGF0aXAodGhpcy5fY2FudmFzQ29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBBZGQgYSBjYW52YXMuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcHJpdmF0ZVxyXG4gKlxyXG4gKiBAcmV0dXJuIHtDYW52YXN9IFRoZSBhZGRlZCBjYW52YXMuXHJcbiAqL1xyXG5DaGFydC5wcm90b3R5cGUuYWRkQ2FudmFzID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB2YXIgY2FudmFzID0gbmV3IENhbnZhcyh0aGlzLl9vcHRpb25zLnJlbmRlcmVyLCB0aGlzLl9jb29yZHMpO1xyXG4gICAgY2FudmFzLmFwcGVuZFRvKHRoaXMuX2NhbnZhc0NvbnRhaW5lcik7ICAgXHJcbiAgICB0aGlzLl9hcnJDYW52YXMucHVzaChjYW52YXMpO1xyXG4gICAgcmV0dXJuIGNhbnZhcztcclxufTtcclxuXHJcbi8qKiBcclxuICogQWRkIGNoYXJ0IGZvcm1hdHRpbmcuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuQ2hhcnQucHJvdG90eXBlLmFkZENoYXJ0Rm9ybWF0dGluZyA9IGZ1bmN0aW9uIChvcHRpb25zKVxyXG57XHJcbiAgICAvLyBCYWNrZ3JvdW5kIGNhbnZhcy5cclxuICAgIHRoaXMuX2JhY2tncm91bmRDYW52YXMgPSB0aGlzLmFkZENhbnZhcygpO1xyXG5cclxuICAgIC8vIEJhY2tncm91bmQgZWxlbWVudHMuXHJcbiAgICBpZiAob3B0aW9ucy5iYWNrZ3JvdW5kICE9PSB1bmRlZmluZWQpIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2JhY2tncm91bmQgPSB0aGlzLl9iYWNrZ3JvdW5kQ2FudmFzLnJlY3QoKTtcclxuICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLnN0eWxlID0gb3B0aW9ucy5iYWNrZ3JvdW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEJvcmRlciBlbGVtZW50cy5cclxuICAgIHV0aWwuZXh0ZW5kT2JqZWN0KG9wdGlvbnMuYm9yZGVyVG9wLCAgICBvcHRpb25zLmJvcmRlciwgZmFsc2UpO1xyXG4gICAgdXRpbC5leHRlbmRPYmplY3Qob3B0aW9ucy5ib3JkZXJSaWdodCwgIG9wdGlvbnMuYm9yZGVyLCBmYWxzZSk7XHJcbiAgICB1dGlsLmV4dGVuZE9iamVjdChvcHRpb25zLmJvcmRlckJvdHRvbSwgb3B0aW9ucy5ib3JkZXIsIGZhbHNlKTtcclxuICAgIHV0aWwuZXh0ZW5kT2JqZWN0KG9wdGlvbnMuYm9yZGVyTGVmdCwgICBvcHRpb25zLmJvcmRlciwgZmFsc2UpO1xyXG4gICAgdGhpcy5fYm9yZGVyVG9wICAgICAgICAgICA9IHRoaXMuX2JhY2tncm91bmRDYW52YXMubGluZSgpO1xyXG4gICAgdGhpcy5fYm9yZGVyUmlnaHQgICAgICAgICA9IHRoaXMuX2JhY2tncm91bmRDYW52YXMubGluZSgpO1xyXG4gICAgdGhpcy5fYm9yZGVyQm90dG9tICAgICAgICA9IHRoaXMuX2JhY2tncm91bmRDYW52YXMubGluZSgpO1xyXG4gICAgdGhpcy5fYm9yZGVyTGVmdCAgICAgICAgICA9IHRoaXMuX2JhY2tncm91bmRDYW52YXMubGluZSgpO1xyXG4gICAgdGhpcy5fYm9yZGVyVG9wLnN0eWxlICAgICA9IG9wdGlvbnMuYm9yZGVyVG9wO1xyXG4gICAgdGhpcy5fYm9yZGVyUmlnaHQuc3R5bGUgICA9IG9wdGlvbnMuYm9yZGVyUmlnaHQ7XHJcbiAgICB0aGlzLl9ib3JkZXJCb3R0b20uc3R5bGUgID0gb3B0aW9ucy5ib3JkZXJCb3R0b207XHJcbiAgICB0aGlzLl9ib3JkZXJMZWZ0LnN0eWxlICAgID0gb3B0aW9ucy5ib3JkZXJMZWZ0O1xyXG5cclxuICAgIC8vIFBhZGRpbmcgZWxlbWVudHMuXHJcbiAgICBvcHRpb25zLnBhZGRpbmdUb3AgICAgPSBvcHRpb25zLnBhZGRpbmdUb3AgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMucGFkZGluZ1RvcCA6IG9wdGlvbnMucGFkZGluZztcclxuICAgIG9wdGlvbnMucGFkZGluZ1JpZ2h0ICA9IG9wdGlvbnMucGFkZGluZ1JpZ2h0ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnBhZGRpbmdSaWdodCA6IG9wdGlvbnMucGFkZGluZztcclxuICAgIG9wdGlvbnMucGFkZGluZ0JvdHRvbSA9IG9wdGlvbnMucGFkZGluZ0JvdHRvbSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5wYWRkaW5nQm90dG9tIDogb3B0aW9ucy5wYWRkaW5nO1xyXG4gICAgb3B0aW9ucy5wYWRkaW5nTGVmdCAgID0gb3B0aW9ucy5wYWRkaW5nVG9wICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnBhZGRpbmdUb3AgOiBvcHRpb25zLnBhZGRpbmc7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEFkZCB0aGUgZXZlbnQgaGFuZGxlci5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5DaGFydC5wcm90b3R5cGUuYWRkRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpXHJcbntcclxuICAgIHZhciBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy8gRXZlbnQgaGFuZGxlclxyXG4gICAgdmFyIGV2ZW50SGFuZGxlciA9IG5ldyBFdmVudEhhbmRsZXIoXHJcbiAgICB7XHJcbiAgICAgICAgZWxlbWVudCA6IHRoaXMuX2NhbnZhc0NvbnRhaW5lcixcclxuICAgICAgICBjb29yZHMgIDogdGhpcy5fY29vcmRzLFxyXG4gICAgICAgIG1vdXNlY2xpY2sgOiBmdW5jdGlvbiAoZXZlbnQpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIG1vdXNlZG93biA6IGZ1bmN0aW9uIChldmVudClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW91c2V1cCA6IGZ1bmN0aW9uIChldmVudClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW91c2Vtb3ZlIDogZnVuY3Rpb24gKGV2ZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdXBkYXRlVGlwKGV2ZW50KTtcclxuICAgICAgICAgICAgbWUuX2RhdGF0aXAuc2hvdygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW91c2VvdmVyIDogZnVuY3Rpb24gKGV2ZW50KVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtb3VzZW91dCA6IGZ1bmN0aW9uIChldmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG1lLl9kYXRhdGlwLmZhZGVPdXQoKTsgICAgXHJcbiAgICAgICAgICAgIG1lLl91aUNhbnZhcy5lbXB0eSgpO1xyXG4gICAgICAgICAgICBtZS5oaXRYID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBtZS5oaXRZID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW91c2VkcmFnc3RhcnQgOiBmdW5jdGlvbiAoZXZlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBtZS5fZGF0YXRpcC5oaWRlKCk7XHJcbiAgICAgICAgICAgIG1lLl91aUNhbnZhcy5lbXB0eSgpO1xyXG4gICAgICAgICAgICBtZS5oaXRYID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBtZS5oaXRZID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW91c2VkcmFnIDogZnVuY3Rpb24gKGV2ZW50KVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtb3VzZWRyYWdlbmQgOiBmdW5jdGlvbiAoZXZlbnQpXHJcbiAgICAgICAgeyAgIFxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvdWNoZG93biA6IGZ1bmN0aW9uIChldmVudClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG91Y2hkb3dub3V0c2lkZSA6IGZ1bmN0aW9uIChldmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG1lLl9kYXRhdGlwLmZhZGVPdXQoKTsgICAgXHJcbiAgICAgICAgICAgIG1lLl91aUNhbnZhcy5lbXB0eSgpO1xyXG4gICAgICAgICAgICBtZS5oaXRYID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBtZS5oaXRZID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG91Y2hkcmFnc3RhcnQgOiBmdW5jdGlvbiAoZXZlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBtZS5fZGF0YXRpcC5oaWRlKCk7XHJcbiAgICAgICAgICAgIG1lLl91aUNhbnZhcy5lbXB0eSgpO1xyXG4gICAgICAgICAgICBtZS5oaXRYID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBtZS5oaXRZID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG91Y2h1cCA6IGZ1bmN0aW9uIChldmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVRpcChldmVudCk7XHJcbiAgICAgICAgICAgIG1lLl9kYXRhdGlwLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVUaXAoZXZlbnQpXHJcbiAgICB7IFxyXG4gICAgICAgIHZhciBoaXRFdmVudCA9IG1lLmhpdEV2ZW50KGV2ZW50LnBpeGVsWCwgZXZlbnQucGl4ZWxZKTtcclxuICAgICAgICBpZiAoaGl0RXZlbnQgIT09IHVuZGVmaW5lZCAmJiAoaGl0RXZlbnQucGl4ZWxYICE9PSBtZS5oaXRYIHx8IGhpdEV2ZW50LnBpeGVsWSAhPT0gbWUuaGl0WSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBtZS5fdWlDYW52YXMuZW1wdHkoKTtcclxuICAgICAgICAgICAgbWUuaGl0WCA9IGhpdEV2ZW50LnBpeGVsWDtcclxuICAgICAgICAgICAgbWUuaGl0WSA9IGhpdEV2ZW50LnBpeGVsWTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodEl0ZW0gPSB1dGlsLmNsb25lT2JqZWN0KGhpdEV2ZW50Lml0ZW1zWzBdKTtcclxuICAgICAgICAgICAgbWUuX3VpQ2FudmFzLmFkZEl0ZW0oaGlnaGxpZ2h0SXRlbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0SXRlbS5tYXJrZXIgPT09IHRydWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodEl0ZW0uc3R5bGUuZmlsbE9wYWNpdHkgPSAwLjM7XHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRJdGVtLnN0eWxlLmxpbmVDb2xvciAgID0gaGlnaGxpZ2h0SXRlbS5zdHlsZS5maWxsQ29sb3I7XHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRJdGVtLmNvb3Jkcy5zaXplICAgICAgID0gaGlnaGxpZ2h0SXRlbS5jb29yZHMuc2l6ZSAqIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaGlnaGxpZ2h0SXRlbS5zaGFwZSA9PT0gdHJ1ZSlcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9tZS5fZGF0YXRpcC5odG1sKCcxJylcclxuICAgICAgICAgICAvL21lLl9kYXRhdGlwLmh0bWwoaGlnaGxpZ2h0SXRlbS5jb29yZHMuY3grJyAnK2hpZ2hsaWdodEl0ZW0uY29vcmRzLmN5KVxyXG4gICAgICAgICAgICBtZS5fZGF0YXRpcC5vcHRpb25zKHtib3JkZXJDb2xvciA6IGhpZ2hsaWdodEl0ZW0uc3R5bGUuZmlsbENvbG9yLCBwb3NpdGlvbjogJ3RvcCd9KVxyXG4gICAgICAgICAgICAuaHRtbCgnVG9vbHRpcCB0aGF0IHNob3VsZCBhbHdheXMgYmUgdmlzaWJsZSBpbiB2aWV3cG9ydCBYIGFuZCBpdHMganVzdCB0b28gbG9uZzogJytoaWdobGlnaHRJdGVtLmNvb3Jkcy5jeCsgXHJcbiAgICAgICAgICAgICAgICAnIDxici8+IFRvb2x0aXAgdGhhdCBzaG91bGQgYWx3YXlzIGJlIHZpc2libGUgaW4gdmlld3BvcnQgWSBhbmQgaXRzIGp1c3QgcmVhbGx5IGxvbmc6ICcraGlnaGxpZ2h0SXRlbS5jb29yZHMuY3krXHJcbiAgICAgICAgICAgICAgICAnIDxici8+IFRvb2x0aXAgdGhhdCBzaG91bGQgYWx3YXlzIGJlIHZpc2libGUgaW4gdmlld3BvcnQgWCBhbmQgaXRzIGp1c3QgdG9vIGxvbmc6ICcraGlnaGxpZ2h0SXRlbS5jb29yZHMuY3grXHJcbiAgICAgICAgICAgICAgICAnIDxici8+IFRvb2x0aXAgdGhhdCBzaG91bGQgYWx3YXlzIGJlIHZpc2libGUgaW4gdmlld3BvcnQgWSBhbmQgaXRzIGp1c3QgcmVhbGx5IGxvbmc6ICcraGlnaGxpZ2h0SXRlbS5jb29yZHMuY3krXHJcbiAgICAgICAgICAgICAgICAnIDxici8+IFRvb2x0aXAgdGhhdCBzaG91bGQgYWx3YXlzIGJlIHZpc2libGUgaW4gdmlld3BvcnQgWCBhbmQgaXRzIGp1c3QgdG9vIGxvbmc6ICcraGlnaGxpZ2h0SXRlbS5jb29yZHMuY3grXHJcbiAgICAgICAgICAgICAgICAnIDxici8+IFRvb2x0aXAgdGhhdCBzaG91bGQgYWx3YXlzIGJlIHZpc2libGUgaW4gdmlld3BvcnQgWSBhbmQgaXRzIGp1c3QgcmVhbGx5IGxvbmc6ICcraGlnaGxpZ2h0SXRlbS5jb29yZHMuY3kpXHJcbiAgICAgICAgICAgIC5wb3NpdGlvbihoaXRFdmVudC5waXhlbFgsIGhpdEV2ZW50LnBpeGVsWSk7XHJcblxyXG4gICAgICAgICAgICBtZS5fdWlDYW52YXMucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyptZS5fZGF0YXRpcC5odG1sKCdUb29sdGlwIHRoYXQgc2hvdWxkIGFsd2F5cyBiZSB2aXNpYmxlIGluIHZpZXdwb3J0IFggYW5kIGl0cyBqdXN0IHRvbyBsb25nOiAnK1xyXG4gICAgICAgICAgICAgICAgJyA8YnIvPiBUb29sdGlwIHRoYXQgc2hvdWxkIGFsd2F5cyBiZSB2aXNpYmxlIGluIHZpZXdwb3J0IFkgYW5kIGl0cyBqdXN0IHJlYWxseSBsb25nOiAnK1xyXG4gICAgICAgICAgICAgICAgJyA8YnIvPiBUb29sdGlwIHRoYXQgc2hvdWxkIGFsd2F5cyBiZSB2aXNpYmxlIGluIHZpZXdwb3J0IFggYW5kIGl0cyBqdXN0IHRvbyBsb25nOiAnK1xyXG4gICAgICAgICAgICAgICAgJyA8YnIvPiBUb29sdGlwIHRoYXQgc2hvdWxkIGFsd2F5cyBiZSB2aXNpYmxlIGluIHZpZXdwb3J0IFkgYW5kIGl0cyBqdXN0IHJlYWxseSBsb25nOiAnK1xyXG4gICAgICAgICAgICAgICAgJyA8YnIvPiBUb29sdGlwIHRoYXQgc2hvdWxkIGFsd2F5cyBiZSB2aXNpYmxlIGluIHZpZXdwb3J0IFggYW5kIGl0cyBqdXN0IHRvbyBsb25nOiAnK1xyXG4gICAgICAgICAgICAgICAgJyA8YnIvPiBUb29sdGlwIHRoYXQgc2hvdWxkIGFsd2F5cyBiZSB2aXNpYmxlIGluIHZpZXdwb3J0IFkgYW5kIGl0cyBqdXN0IHJlYWxseSBsb25nOiAnKTtcclxuICAgICAgICAgICAgbWUuX2RhdGF0aXAucG9zaXRpb24oZXZlbnQucGl4ZWxYLCBldmVudC5waXhlbFksICd0b3AnKTsqL1xyXG5cclxuICAgIH1cclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJucyBhIGhpdCBldmVudCBmb3IgdGhlIG5lYXJlc3QgaXRlbS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB4IHBpeGVsIGNvb3JkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geSBUaGUgeSBwaXhlbCBjb29yZC5cclxuICpcclxuICogQHJldHVybiB7Q2FudmFzSXRlbX0gVGhlIGNhbnZhcyBpdGVtLlxyXG4gKi9cclxuQ2hhcnQucHJvdG90eXBlLmhpdEV2ZW50ID0gZnVuY3Rpb24oeCwgeSlcclxue1xyXG4gICAgdmFyIG5lYXJlc3RFdmVudDtcclxuICAgIHZhciBzaG9ydGVzdERpc3RhbmNlID0gSW5maW5pdHk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3Nlcmllcy5sZW5ndGg7IGkrKykgIFxyXG4gICAge1xyXG4gICAgICAgIHZhciBzID0gdGhpcy5fc2VyaWVzW2ldO1xyXG4gICAgICAgIHZhciBldmVudCA9IHMuaGl0RXZlbnQoeCwgeSk7XHJcbiAgICAgICAgaWYgKGV2ZW50LmRpc3RhbmNlIDwgc2hvcnRlc3REaXN0YW5jZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZWFyZXN0RXZlbnQgPSBldmVudDsgXHJcbiAgICAgICAgICAgIHNob3J0ZXN0RGlzdGFuY2UgPSBldmVudC5kaXN0YW5jZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmVhcmVzdEV2ZW50O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBTZXQgdGhlIHNpemUgb2YgdGhlIGNhbnZhcy5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwcml2YXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB3IFRoZSB3aWR0aC5cclxuICogQHBhcmFtIHtudW1iZXJ9IGggVGhlIGhlaWdodC5cclxuICovXHJcbkNoYXJ0LnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24gKHcsIGgpXHJcbntcclxuICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICBpZiAoIXV0aWwuaXNOdW1iZXIodykpICB0aHJvdyBuZXcgRXJyb3IoJ0NoYXJ0LnNldFNpemUodyk6IHcgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgIGlmICh3IDwgMCkgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhcnQuc2V0U2l6ZSh3KTogdyBtdXN0IGJlID49IDAuJyk7XHJcbiAgICBpZiAoIXV0aWwuaXNOdW1iZXIoaCkpICB0aHJvdyBuZXcgRXJyb3IoJ0NoYXJ0LnNldFNpemUoaCk6IGggbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgIGlmIChoIDwgMCkgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhcnQuc2V0U2l6ZShoKTogaCBtdXN0IGJlID49IDAuJyk7XHJcbiAgICAvLzwvdmFsaWRhdGlvbj5cclxuXHJcbiAgICAvLyBTZXQgdGhlIHZpZXdQb3J0LlxyXG4gICAgdmFyIHgxQ2hhcnQgPSB0aGlzLl9vcHRpb25zLnBhZGRpbmdMZWZ0O1xyXG4gICAgdmFyIHkxQ2hhcnQgPSB0aGlzLl9vcHRpb25zLnBhZGRpbmdUb3A7XHJcbiAgICB2YXIgeDJDaGFydCA9IHcgLSB0aGlzLl9vcHRpb25zLnBhZGRpbmdSaWdodDtcclxuICAgIHZhciB5MkNoYXJ0ID0gaCAtIHRoaXMuX29wdGlvbnMucGFkZGluZ0JvdHRvbTtcclxuICAgIHZhciB3Q2hhcnQgID0geDJDaGFydCAtIHgxQ2hhcnQ7XHJcbiAgICB2YXIgaENoYXJ0ICA9IHkyQ2hhcnQgLSB5MUNoYXJ0O1xyXG4gICAgdGhpcy5fY29vcmRzLnZpZXdQb3J0KHgxQ2hhcnQsIHkxQ2hhcnQsIHdDaGFydCwgaENoYXJ0KTtcclxuXHJcbiAgICAvLyBTZXQgdGhlIGNvb3JkcyBmb3IgdGhlIGJhY2tncm91bmQgYW5kIGJvcmRlciBlbGVtZW50cy5cclxuICAgIGlmICh0aGlzLl9iYWNrZ3JvdW5kICE9PSB1bmRlZmluZWQpICAgICB0aGlzLl9iYWNrZ3JvdW5kLmNvb3JkcyAgICA9IHt4OngxQ2hhcnQsICB5OnkxQ2hhcnQsIHdpZHRoOndDaGFydCwgaGVpZ2h0OmhDaGFydH07XHJcbiAgICBpZiAodGhpcy5fYm9yZGVyVG9wICE9PSB1bmRlZmluZWQpICAgICAgdGhpcy5fYm9yZGVyVG9wLmNvb3JkcyAgICAgPSB7eDE6eDFDaGFydCwgeTE6eTFDaGFydCwgeDI6eDJDaGFydCwgeTI6eTFDaGFydH07XHJcbiAgICBpZiAodGhpcy5fYm9yZGVyUmlnaHQgIT09IHVuZGVmaW5lZCkgICAgdGhpcy5fYm9yZGVyUmlnaHQuY29vcmRzICAgPSB7eDE6eDJDaGFydCwgeTE6eTFDaGFydCwgeDI6eDJDaGFydCwgeTI6eTJDaGFydH07XHJcbiAgICBpZiAodGhpcy5fYm9yZGVyQm90dG9tICE9PSB1bmRlZmluZWQpICAgdGhpcy5fYm9yZGVyQm90dG9tLmNvb3JkcyAgPSB7eDE6eDFDaGFydCwgeTE6eTJDaGFydCwgeDI6eDJDaGFydCwgeTI6eTJDaGFydH07XHJcbiAgICBpZiAodGhpcy5fYm9yZGVyTGVmdCAhPT0gdW5kZWZpbmVkKSAgICAgdGhpcy5fYm9yZGVyTGVmdC5jb29yZHMgICAgPSB7eDE6eDFDaGFydCwgeTE6eTFDaGFydCwgeDI6eDFDaGFydCwgeTI6eTJDaGFydH07XHJcblxyXG4gICAgLy8gU2V0IHRoZSBjYW52YXMgc2l6ZXMuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FyckNhbnZhcy5sZW5ndGg7IGkrKykgIHt0aGlzLl9hcnJDYW52YXNbaV0uc2V0U2l6ZSh3LCBoKTt9XHJcblxyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmVuZGVycyB0aGUgZ3JhcGhpY3MuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKi9cclxuQ2hhcnQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKFwicmVuZGVyXCIpO1xyXG5cclxuICAgIC8vIFNldCB0aGUgdmlld2JveC5cclxuICAgIHZhciB4TWluID0gSW5maW5pdHksIHhNYXggPSAtSW5maW5pdHksIHlNaW4gPSBJbmZpbml0eSwgeU1heCA9IC1JbmZpbml0eTtcclxuICAgIHZhciBuID0gdGhpcy5fc2VyaWVzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSAgXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHMgPSB0aGlzLl9zZXJpZXNbaV07XHJcbiAgICAgICAgeE1pbiA9IE1hdGgubWluKHhNaW4sIHMueE1pbik7XHJcbiAgICAgICAgeE1heCA9IE1hdGgubWF4KHhNYXgsIHMueE1heCk7XHJcbiAgICAgICAgeU1pbiA9IE1hdGgubWluKHlNaW4sIHMueU1pbik7XHJcbiAgICAgICAgeU1heCA9IE1hdGgubWF4KHlNYXgsIHMueU1heCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9jb29yZHMudmlld0JveCh4TWluLCB5TWluLCB4TWF4LCB5TWF4KTtcclxuXHJcbiAgICAvLyBSZW5kZXIgdGhlIGNhbnZhc2VzLlxyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9hcnJDYW52YXMubGVuZ3RoOyBqKyspICBcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9hcnJDYW52YXNbal0ucmVuZGVyKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0OyIsIi8qIGpzaGludCBicm93c2VyaWZ5OiB0cnVlICovXHJcbi8qIGdsb2JhbHMgREVCVUcgKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgICAgRXhwb3J0cyB0aGUge0BsaW5rIERhdGF0aXB9IGNsYXNzLlxyXG4gKiBAYXV0aG9yICAgICAgICAgIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0ICAgICAgIEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlICAgICAgICAgIGRhdGF0aXAgXHJcbiAqIEByZXF1aXJlcyAgICAgICAgdXRpbHMvZG9tXHJcbiAqIEByZXF1aXJlcyAgICAgICAgdXRpbHMvY29sb3JcclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy91dGlsXHJcbiAqL1xyXG5cclxuLy8gUmVxdWlyZWQgbW9kdWxlcy5cclxudmFyIGRvbSAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWxzL2RvbScpO1xyXG52YXIgdXRpbCAgICAgID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbCcpO1xyXG5cclxuLyoqIFxyXG4gKiBAY2xhc3NkZXNjIENsYXNzIGZvciBjcmVhdGluZyBhIGRhdGEgdGlwLlxyXG4gKlxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIENhbnZhc1xyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBodG1sIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIHRpcC5cclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgW29wdGlvbnNdICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHRpcCBvcHRpb25zLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy52aWV3cG9ydE1hcmdpbiAgPSAxMF0gICAgICBNYXJnaW4gYXJvdW5kIHRoZSB2aWV3cG9ydCBlZGdlIHRoYXQgdGhlIHRpcCBpc250IGFsbG93ZWQgdG8gb3ZlcmxhcC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW29wdGlvbnMucG9zaXRpb24gICAgICAgID0gdG9wXSAgICAgVGhlIHByZWZlcnJlZCBwb3NpdGlvbiBvZiB0aGUgZGF0YSB0aXAgcmVsYXRpdmUgdG8gdGhlIHggYW5kIHkgY29vcmRzIC0gb25lIG9mIHRvcCwgYm90dG9tLCBsZWZ0IG9yIHJpZ2h0LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5wYWRkaW5nICAgICAgICAgPSA3XSAgICAgICBQYWRkaW5nLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbb3B0aW9ucy5mb250RmFtaWx5ICAgICAgPSBhcmlhbF0gICBGb250IGZhbWlseS4gXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLmZvbnRTaXplICAgICAgICA9IDEyXSAgICAgIEZvbnQgc2l6ZS4gXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtvcHRpb25zLmZvbnRDb2xvciAgICAgICA9ICM2NjY2NjZdIEZvbnQgY29sb3IuIFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPSAjZmFmYWZhXSBCYWNrZ3JvdW5kIGNvbG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbb3B0aW9ucy5ib3JkZXJTdHlsZSAgICAgPSBzb2xpZF0gICBCb3JkZXIgc3R5bGUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtvcHRpb25zLmJvcmRlckNvbG9yICAgICA9ICM2NjY2NjZdIEJvcmRlciBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW29wdGlvbnMuYm9yZGVyV2lkdGggICAgID0gMV0gICAgICAgQm9yZGVyIHdpZHRoLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5ib3JkZXJSYWRpdXMgICAgPSAyXSAgICAgICBCb3JkZXIgcmFkaXVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5zaGFkb3dTaXplICAgICAgPSAxXSAgICAgICBTaGFkb3cgc2l6ZS5cclxuICogQHBhcmFtIHtib29sZWFufSAgICAgW29wdGlvbnMuaGlkZVNoYWRvdyAgICAgID0gZmFsc2VdICAgSGlkZSBzaGFkb3cuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLm5vdGNoU2l6ZSAgICAgICA9IDhdICAgICAgIE5vdGNoIHNpemUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLm5vdGNoUGFkZGluZyAgICA9IDVdICAgICAgIFBhZGRpbmcgYmV0d2VlbiBub3RjaCBhbmQgZWRnZSBvZiB0aXAuXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gICAgIFtvcHRpb25zLmhpZGVOb3RjaCAgICAgICA9IGZhbHNlXSAgIEhpZGUgbm90Y2guXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gICAgIFtvcHRpb25zLmZvbGxvd01vdXNlICAgICA9IGZhbHNlXSAgIFNob3VsZCB0aGUgdGlwIGZvbGxvdyB0aGUgbW91c2UuXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gICAgIFtvcHRpb25zLnVzZUFuaW1hdGlvbiAgICA9IHRydWVdICAgIFNob3VsZCB0aGUgdGlwIG1vdmVtZW50IGJlIGFuaW1hdGVkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5zcGVlZCAgICAgICAgICAgPSAwLjAxXSAgICBUaGUgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbi4gQSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEgdGhhdCBjb250cm9scyB0aGUgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbi5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW29wdGlvbnMuc3BlZWRJbmNyICAgICAgID0gMC4wNV0gICAgSW5jcmVhc2VzIHRoZSBhbmltYXRpb24gc3BlZWQgc28gdGhhdCBpdCByZW1haW5zIG1vcmUgY29uc3RhbnQgYW5kIHNtb290aCBhcyBnYXBzIGJldHdlZW4gc3RhcnQgYW5kIGVuZCBwb2ludHMgZ2V0IHNtYWxsZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLnNuYXBEaXN0YW5jZSAgICA9IDVdICAgICAgIFRoZSBkaXN0YW5jZSBhd2F5IGZyb20gYSBnaXZlbiB4eSBwb3NpdGlvbiBhdCB3aGljaCB0aGUgdGlwIHdpbGwgc25hcCB0byBhIHBvaW50LlxyXG4gKi9cclxuZnVuY3Rpb24gRGF0YXRpcCAoY29udGFpbmVyLCBvcHRpb25zKVxyXG57XHJcbiAgICAvLyBEZWZhdWx0IG9wdGlvbnMuXHJcbiAgICB0aGlzLl9vcHRpb25zID0gXHJcbiAgICB7XHJcbiAgICAgICAgdmlld3BvcnRNYXJnaW4gICAgICAgICAgOiAxMCxcclxuICAgICAgICBwb3NpdGlvbiAgICAgICAgICAgICAgICA6ICd0b3AnLFxyXG4gICAgICAgIHBhZGRpbmcgICAgICAgICAgICAgICAgIDogNyxcclxuICAgICAgICBmb250RmFtaWx5ICAgICAgICAgICAgICA6ICdhcmlhbCcsXHJcbiAgICAgICAgZm9udFNpemUgICAgICAgICAgICAgICAgOiAxMixcclxuICAgICAgICBmb250Q29sb3IgICAgICAgICAgICAgICA6ICcjNjY2NjY2JyxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgICAgICAgICA6ICcjZmFmYWZhJyxcclxuICAgICAgICBib3JkZXJTdHlsZSAgICAgICAgICAgICA6ICdzb2xpZCcsXHJcbiAgICAgICAgYm9yZGVyQ29sb3IgICAgICAgICAgICAgOiAnIzY2NjY2NicsXHJcbiAgICAgICAgYm9yZGVyV2lkdGggICAgICAgICAgICAgOiAxLFxyXG4gICAgICAgIGJvcmRlclJhZGl1cyAgICAgICAgICAgIDogMixcclxuICAgICAgICBzaGFkb3dTaXplICAgICAgICAgICAgICA6IDEsXHJcbiAgICAgICAgaGlkZVNoYWRvdyAgICAgICAgICAgICAgOiBmYWxzZSxcclxuICAgICAgICBub3RjaFNpemUgICAgICAgICAgICAgICA6IDgsXHJcbiAgICAgICAgbm90Y2hQYWRkaW5nICAgICAgICAgICAgOiA1LFxyXG4gICAgICAgIGhpZGVOb3RjaCAgICAgICAgICAgICAgIDogZmFsc2UsXHJcbiAgICAgICAgZm9sbG93TW91c2UgICAgICAgICAgICAgOiBmYWxzZSxcclxuICAgICAgICB1c2VBbmltYXRpb24gICAgICAgICAgICA6IHRydWUsXHJcbiAgICAgICAgc3BlZWQgICAgICAgICAgICAgICAgICAgOiAwLjAxLFxyXG4gICAgICAgIHNwZWVkSW5jciAgICAgICAgICAgICAgIDogMC4wNSxcclxuICAgICAgICBzbmFwRGlzdGFuY2UgICAgICAgICAgICA6IDVcclxuICAgIH07ICAgXHJcblxyXG4gICAgLy8gVGlwLlxyXG4gICAgdGhpcy5fY29udGFpbmVyICAgICAgICAgICAgID0gY29udGFpbmVyOyAgICAvLyBUaXAgY29udGFpbmVyLlxyXG4gICAgdGhpcy5fdGlwT3BhY2l0eSAgICAgICAgICAgID0gMTsgICAgICAgICAgICAvLyBUaXAgb3BhY2l0eS5cclxuXHJcbiAgICAvLyBGYWRlIGluIC8gb3V0LlxyXG4gICAgdGhpcy5fZmFkZU91dEludGVydmFsICAgICAgID0gbnVsbDsgICAgICAgICAvLyBUaGUgaWQgb2YgdGhlIHNldEludGVydmFsKCkgZnVuY3Rpb24gdGhhdCBmYWRlcyBvdXQgdGhlIHRpcC5cclxuICAgIHRoaXMuX2ZhZGVPdXREZWxheSAgICAgICAgICA9IG51bGw7ICAgICAgICAgLy8gVGhlIGlkIG9mIHRoZSBzZXRUaW1lb3V0KCkgZnVuY3Rpb24gdGhhdCBwcm92aWRlcyBhIGRlbGF5IGJlZm9yZSB0aGUgdGlwIGZhZGVzIG91dC5cclxuXHJcbiAgICAvLyBBbmltYXRpb24uXHJcbiAgICB0aGlzLl9hbmltYXRpb25JZCAgICAgICAgICAgPSBudWxsOyAgICAgICAgIC8vIFRoZSBpZCBvZiB0aGUgcmVxdWVzdEFuaW1hdGlvbigpIGZ1bmN0aW9uIHRoYXQgbW92ZXMgdGhlIHRpcC4gXHJcbiAgICB0aGlzLl94VGlwU3RhcnQgICAgICAgICAgICAgPSAwOyAgICAgICAgICAgIC8vIFRoZSBzdGFydGluZyB4IHBvc2l0aW9uIGZvciB0aGUgdGlwIHdoZW4gaXRzIHBvc2l0aW9uIGlzIGNoYW5nZWQgdXNpbmcgYW5pbWF0aW9uLlxyXG4gICAgdGhpcy5feVRpcFN0YXJ0ICAgICAgICAgICAgID0gMDsgICAgICAgICAgICAvLyBUaGUgc3RhcnRpbmcgeSBwb3NpdGlvbiBmb3IgdGhlIHRpcCB3aGVuIGl0cyBwb3NpdGlvbiBpcyBjaGFuZ2VkIHVzaW5nIGFuaW1hdGlvbi5cclxuICAgIHRoaXMuX3hUaXBFbmQgICAgICAgICAgICAgICA9IDA7ICAgICAgICAgICAgLy8gVGhlIGVuZCB4IHBvc2l0aW9uIGZvciB0aGUgdGlwIHdoZW4gaXRzIHBvc2l0aW9uIGlzIGNoYW5nZWQgdXNpbmcgYW5pbWF0aW9uLlxyXG4gICAgdGhpcy5feVRpcEVuZCAgICAgICAgICAgICAgID0gMDsgICAgICAgICAgICAvLyBUaGUgZW5kIHkgcG9zaXRpb24gZm9yIHRoZSB0aXAgd2hlbiBpdHMgcG9zaXRpb24gaXMgY2hhbmdlZCB1c2luZyBhbmltYXRpb24uXHJcbiAgICB0aGlzLl94Tm90Y2hTdGFydCAgICAgICAgICAgPSAwOyAgICAgICAgICAgIC8vIFRoZSBzdGFydGluZyB4IHBvc2l0aW9uIGZvciB0aGUgbm90Y2ggd2hlbiBpdHMgcG9zaXRpb24gaXMgY2hhbmdlZCB1c2luZyBhbmltYXRpb24uXHJcbiAgICB0aGlzLl95Tm90Y2hTdGFydCAgICAgICAgICAgPSAwOyAgICAgICAgICAgIC8vIFRoZSBzdGFydGluZyB5IHBvc2l0aW9uIGZvciB0aGUgbm90Y2ggd2hlbiBpdHMgcG9zaXRpb24gaXMgY2hhbmdlZCB1c2luZyBhbmltYXRpb24uXHJcbiAgICB0aGlzLl94Tm90Y2hFbmQgICAgICAgICAgICAgPSAwOyAgICAgICAgICAgIC8vIFRoZSBlbmQgeCBwb3NpdGlvbiBmb3IgdGhlIG5vdGNoIHdoZW4gaXRzIHBvc2l0aW9uIGlzIGNoYW5nZWQgdXNpbmcgYW5pbWF0aW9uLlxyXG4gICAgdGhpcy5feU5vdGNoRW5kICAgICAgICAgICAgID0gMDsgICAgICAgICAgICAvLyBUaGUgZW5kIHkgcG9zaXRpb24gZm9yIHRoZSBub3RjaCB3aGVuIGl0cyBwb3NpdGlvbiBpcyBjaGFuZ2VkIHVzaW5nIGFuaW1hdGlvbi5cclxuXHJcbiAgICAvLyBDcmVhdGUgdGhlIGRhdGEgdGlwLlxyXG4gICAgdGhpcy5fdGlwID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZG9tLnN0eWxlKHRoaXMuX3RpcCwgXHJcbiAgICB7XHJcbiAgICAgICAgcG9zaXRpb24gICAgICAgICAgICAgICAgOiAnYWJzb2x1dGUnLCBcclxuICAgICAgICBwb2ludGVyRXZlbnRzICAgICAgICAgICA6ICdub25lJyxcclxuICAgICAgICBjdXJzb3IgICAgICAgICAgICAgICAgICA6ICdkZWZhdWx0J1xyXG4gICAgfSk7XHJcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5fY29udGFpbmVyLCB0aGlzLl90aXApO1xyXG5cclxuICAgIC8vIENyZWF0ZSB0aGUgZGF0YSB0aXAgdGV4dC5cclxuICAgIHRoaXMuX3RpcFRleHQgPSBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jyk7IFxyXG4gICAgZG9tLnN0eWxlKHRoaXMuX3RpcFRleHQsIFxyXG4gICAge1xyXG4gICAgICAgIHBvaW50ZXJFdmVudHMgICAgICAgICAgIDogJ25vbmUnLFxyXG4gICAgICAgIG92ZXJmbG93ICAgICAgICAgICAgICAgIDogJ2hpZGRlbicsIFxyXG4gICAgICAgIHdoaXRlU3BhY2UgICAgICAgICAgICAgIDogJ25vd3JhcCcsXHJcbiAgICAgICAgJy13ZWJraXRUb3VjaENhbGxvdXQnICAgOiAnbm9uZScsXHJcbiAgICAgICAgJy13ZWJraXRVc2VyU2VsZWN0JyAgICAgOiAnbm9uZScsXHJcbiAgICAgICAgJy1raHRtbFVzZXJTZWxlY3QnICAgICAgOiAnbm9uZScsXHJcbiAgICAgICAgJy1tb3pVc2VyU2VsZWN0JyAgICAgICAgOiAnbm9uZScsXHJcbiAgICAgICAgJy1tc1VzZXJTZWxlY3QnICAgICAgICAgOiAnbm9uZScsXHJcbiAgICAgICAgdXNlclNlbGVjdCAgICAgICAgICAgICAgOiAnbm9uZSdcclxuICAgIH0pO1xyXG4gICAgZG9tLmFwcGVuZENoaWxkKHRoaXMuX3RpcCwgdGhpcy5fdGlwVGV4dCk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSBub3RjaCBib3JkZXIuXHJcbiAgICB0aGlzLl9ub3RjaEJvcmRlciA9IGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnKTsgXHJcbiAgICBkb20uc3R5bGUodGhpcy5fbm90Y2hCb3JkZXIsIFxyXG4gICAge1xyXG4gICAgICAgIHBvc2l0aW9uICAgICAgICAgICAgICAgIDogJ2Fic29sdXRlJyxcclxuICAgICAgICBwb2ludGVyRXZlbnRzICAgICAgICAgICA6ICdub25lJ1xyXG4gICAgfSk7XHJcbiAgICBkb20uYXBwZW5kQ2hpbGQodGhpcy5fdGlwLCB0aGlzLl9ub3RjaEJvcmRlcik7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSBub3RjaCBmaWxsLlxyXG4gICAgdGhpcy5fbm90Y2hGaWxsID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZG9tLnN0eWxlKHRoaXMuX25vdGNoRmlsbCwgXHJcbiAgICB7XHJcbiAgICAgICAgcG9zaXRpb24gICAgICAgICAgICAgICAgOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgIHBvaW50ZXJFdmVudHMgICAgICAgICAgIDogJ25vbmUnXHJcbiAgICB9KTtcclxuICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLl90aXAsIHRoaXMuX25vdGNoRmlsbCk7XHJcblxyXG4gICAgLy8gSGlkZSB0aGUgdGlwLlxyXG4gICAgdGhpcy5oaWRlKCk7XHJcblxyXG4gICAgLy8gQXBwbHkgdGhlIG9wdGlvbnMuXHJcbiAgICB0aGlzLm9wdGlvbnMob3B0aW9ucyk7XHJcbn1cclxuXHJcbi8qKiBcclxuICogR2V0IG9yIHNldCB0aGUgb3B0aW9ucyBmb3IgdGhlIGRhdGEgdGlwLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgW29wdGlvbnNdICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHRpcCBvcHRpb25zLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy52aWV3cG9ydE1hcmdpbiAgPSAxMF0gICAgICBNYXJnaW4gYXJvdW5kIHRoZSB2aWV3cG9ydCBlZGdlIHRoYXQgdGhlIHRpcCBpc250IGFsbG93ZWQgdG8gb3ZlcmxhcC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW29wdGlvbnMucG9zaXRpb24gICAgICAgID0gdG9wXSAgICAgVGhlIHByZWZlcnJlZCBwb3NpdGlvbiBvZiB0aGUgZGF0YSB0aXAgcmVsYXRpdmUgdG8gdGhlIHggYW5kIHkgY29vcmRzIC0gb25lIG9mIHRvcCwgYm90dG9tLCBsZWZ0IG9yIHJpZ2h0LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5wYWRkaW5nICAgICAgICAgPSA3XSAgICAgICBQYWRkaW5nLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbb3B0aW9ucy5mb250RmFtaWx5ICAgICAgPSBhcmlhbF0gICBGb250IGZhbWlseS4gXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLmZvbnRTaXplICAgICAgICA9IDEyXSAgICAgIEZvbnQgc2l6ZS4gXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtvcHRpb25zLmZvbnRDb2xvciAgICAgICA9ICM2NjY2NjZdIEZvbnQgY29sb3IuIFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPSAjZmFmYWZhXSBCYWNrZ3JvdW5kIGNvbG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbb3B0aW9ucy5ib3JkZXJTdHlsZSAgICAgPSBzb2xpZF0gICBCb3JkZXIgc3R5bGUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtvcHRpb25zLmJvcmRlckNvbG9yICAgICA9ICM2NjY2NjZdIEJvcmRlciBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW29wdGlvbnMuYm9yZGVyV2lkdGggICAgID0gMV0gICAgICAgQm9yZGVyIHdpZHRoLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5ib3JkZXJSYWRpdXMgICAgPSAyXSAgICAgICBCb3JkZXIgcmFkaXVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5zaGFkb3dTaXplICAgICAgPSAxXSAgICAgICBTaGFkb3cgc2l6ZS5cclxuICogQHBhcmFtIHtib29sZWFufSAgICAgW29wdGlvbnMuaGlkZVNoYWRvdyAgICAgID0gZmFsc2VdICAgSGlkZSBzaGFkb3cuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLm5vdGNoU2l6ZSAgICAgICA9IDhdICAgICAgIE5vdGNoIHNpemUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLm5vdGNoUGFkZGluZyAgICA9IDVdICAgICAgIFBhZGRpbmcgYmV0d2VlbiBub3RjaCBhbmQgZWRnZSBvZiB0aXAuXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gICAgIFtvcHRpb25zLmhpZGVOb3RjaCAgICAgICA9IGZhbHNlXSAgIEhpZGUgbm90Y2guXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gICAgIFtvcHRpb25zLmZvbGxvd01vdXNlICAgICA9IGZhbHNlXSAgIFNob3VsZCB0aGUgdGlwIGZvbGxvdyB0aGUgbW91c2UuXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gICAgIFtvcHRpb25zLnVzZUFuaW1hdGlvbiAgICA9IHRydWVdICAgIFNob3VsZCB0aGUgdGlwIG1vdmVtZW50IGJlIGFuaW1hdGVkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbb3B0aW9ucy5zcGVlZCAgICAgICAgICAgPSAwLjAxXSAgICBUaGUgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbi4gQSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEgdGhhdCBjb250cm9scyB0aGUgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbi5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW29wdGlvbnMuc3BlZWRJbmNyICAgICAgID0gMC4wNV0gICAgSW5jcmVhc2VzIHRoZSBhbmltYXRpb24gc3BlZWQgc28gdGhhdCBpdCByZW1haW5zIG1vcmUgY29uc3RhbnQgYW5kIHNtb290aCBhcyBnYXBzIGJldHdlZW4gc3RhcnQgYW5kIGVuZCBwb2ludHMgZ2V0IHNtYWxsZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtvcHRpb25zLnNuYXBEaXN0YW5jZSAgICA9IDVdICAgICAgIFRoZSBkaXN0YW5jZSBhd2F5IGZyb20gYSBnaXZlbiB4eSBwb3NpdGlvbiBhdCB3aGljaCB0aGUgdGlwIHdpbGwgc25hcCB0byBhIHBvaW50LlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtPYmplY3R8RGF0YXRpcH0gVGhlIG9wdGlvbnMgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuRGF0YXRpcC5wcm90b3R5cGUub3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLyBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIHdpdGggcGFzc2VkIGluIG9wdGlvbnMuXHJcbiAgICAgICAgdXRpbC5leHRlbmRPYmplY3QodGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIFN0eWxlIHRoZSBkYXRhIHRpcC5cclxuICAgICAgICBkb20uc3R5bGUodGhpcy5fdGlwLCBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uICAgICAgICA6ICdhYnNvbHV0ZScsIFxyXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzICAgOiAnbm9uZScsXHJcbiAgICAgICAgICAgIGN1cnNvciAgICAgICAgICA6ICdkZWZhdWx0JyxcclxuICAgICAgICAgICAgYm9yZGVyU3R5bGUgICAgIDogdGhpcy5fb3B0aW9ucy5ib3JkZXJTdHlsZSxcclxuICAgICAgICAgICAgYm9yZGVyV2lkdGggICAgIDogdGhpcy5fb3B0aW9ucy5ib3JkZXJXaWR0aCsncHgnLFxyXG4gICAgICAgICAgICBib3JkZXJDb2xvciAgICAgOiB0aGlzLl9vcHRpb25zLmJvcmRlckNvbG9yLCBcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzICAgIDogdGhpcy5fb3B0aW9ucy5ib3JkZXJSYWRpdXMrJ3B4JywgXHJcbiAgICAgICAgICAgIGZvbnRGYW1pbHkgICAgICA6IHRoaXMuX29wdGlvbnMuZm9udEZhbWlseSwgXHJcbiAgICAgICAgICAgIGZvbnRTaXplICAgICAgICA6IHRoaXMuX29wdGlvbnMuZm9udFNpemUrJ3B4JywgXHJcbiAgICAgICAgICAgIGNvbG9yICAgICAgICAgICA6IHRoaXMuX29wdGlvbnMuZm9udENvbG9yLCBcclxuICAgICAgICAgICAgcGFkZGluZyAgICAgICAgIDogdGhpcy5fb3B0aW9ucy5wYWRkaW5nKydweCcsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmQgICAgICA6IHRoaXMuX29wdGlvbnMuYmFja2dyb3VuZENvbG9yLCAgICAgXHJcbiAgICAgICAgICAgIGJveFNoYWRvdyAgICAgICA6IHRoaXMuX29wdGlvbnMuaGlkZVNoYWRvdyA9PT0gdHJ1ZSA/ICcnIDogdGhpcy5fb3B0aW9ucy5zaGFkb3dTaXplKydweCAnK3RoaXMuX29wdGlvbnMuc2hhZG93U2l6ZSsncHggJyt0aGlzLl9vcHRpb25zLnNoYWRvd1NpemUrJ3B4IDBweCByZ2JhKDIwMCwyMDAsMjAwLDEpJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX29wdGlvbnM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFBvc2l0aW9uIHRoZSBkYXRhIHRpcCB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbmluZy5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSBhYnNvbHV0ZSB4IHBvc2l0aW9uIG9mIHRoZSBkYXRhIHRpcCByZWxhdGl2ZSB0byBpdHMgY29udGFpbmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geSBUaGUgYWJzb2x1dGUgeSBwb3NpdGlvbiBvZiB0aGUgZGF0YSB0aXAgcmVsYXRpdmUgdG8gaXRzIGNvbnRhaW5lci5cclxuICpcclxuICogQHJldHVybiB7RGF0YXRpcH0gPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5EYXRhdGlwLnByb3RvdHlwZS5wb3NpdGlvbiA9IGZ1bmN0aW9uICh4LCB5KVxyXG57XHJcbiAgICB2YXIgcG9zaXRpb24gPSB0aGlzLl9vcHRpb25zLnBvc2l0aW9uO1xyXG5cclxuICAgIC8vIEdldCB0aGUgdGlwIGRpbWVuc2lvbnMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LlxyXG4gICAgdmFyIGJDb250YWluZXIgPSBkb20uYm91bmRzKHRoaXMuX2NvbnRhaW5lcik7XHJcbiAgICB2YXIgYlRpcCAgICAgICA9IGRvbS5ib3VuZHModGhpcy5fdGlwKTtcclxuXHJcbiAgICAvLyBTdHlsZSB0aGUgbm90Y2ggc28gd2UgY2FuIGdldCB1c2UgaXRzIGRpbWVuc2lvbnMgZm9yIGNhbGN1bGF0aW9ucy5cclxuICAgIHZhciBiTm90Y2ggPSB7fTtcclxuICAgIGJOb3RjaC53aWR0aCA9IDA7XHJcbiAgICBiTm90Y2guaGVpZ2h0ID0gMDtcclxuICAgIGlmICh0aGlzLl9vcHRpb25zLmhpZGVOb3RjaCA9PT0gZmFsc2UpIGJOb3RjaCA9IHRoaXMuX3N0eWxlTm90Y2gocG9zaXRpb24sIHRoaXMuX29wdGlvbnMubm90Y2hTaXplLCB0aGlzLl9vcHRpb25zLmJvcmRlcldpZHRoLCB0aGlzLl9vcHRpb25zLmJvcmRlckNvbG9yLCB0aGlzLl9vcHRpb25zLmJhY2tncm91bmRDb2xvciwgYlRpcC53aWR0aCwgYlRpcC5oZWlnaHQpO1xyXG5cclxuICAgIC8vIENoYW5nZSB0aGUgcG9zaXRpb24gaWYgdGhlIHRpcCBjYW50IGJlIGRyYXduIHNlbnNpYmx5IHVzaW5nIHRoZSBkZWZpbmVkIHBvc2l0aW9uLlxyXG4gICAgdmFyIHhEaXN0RnJvbU5vdGNoVG9FZGdlLCB5RGlzdEZyb21Ob3RjaFRvRWRnZSwgdGlwT3ZlcmxhcFRvcEVkZ2UsIHRpcE92ZXJsYXBCb3R0b21FZGdlLCB0aXBPdmVybGFwTGVmdEVkZ2UsIHRpcE92ZXJsYXBSaWdodEVkZ2U7XHJcbiAgICBpZiAocG9zaXRpb24gPT09ICd0b3AnIHx8IHBvc2l0aW9uID09PSAnYm90dG9tJylcclxuICAgIHtcclxuICAgICAgICB4RGlzdEZyb21Ob3RjaFRvRWRnZSAgICAgICAgPSAoYk5vdGNoLndpZHRoIC8gMikgKyB0aGlzLl9vcHRpb25zLm5vdGNoUGFkZGluZyArIHRoaXMuX29wdGlvbnMuYm9yZGVyV2lkdGggKyB0aGlzLl9vcHRpb25zLnZpZXdwb3J0TWFyZ2luO1xyXG4gICAgICAgIHZhciB0b3RhbFRpcEhlaWdodCAgICAgICAgICA9IGJOb3RjaC5oZWlnaHQgKyBiVGlwLmhlaWdodCArIHRoaXMuX29wdGlvbnMudmlld3BvcnRNYXJnaW47XHJcblxyXG4gICAgICAgIHZhciBub3RjaE92ZXJsYXBMZWZ0RWRnZSAgICA9IHhEaXN0RnJvbU5vdGNoVG9FZGdlIC0gKGJDb250YWluZXIubGVmdCArIHgpO1xyXG4gICAgICAgIHZhciBub3RjaE92ZXJsYXBSaWdodEVkZ2UgICA9IChiQ29udGFpbmVyLmxlZnQgKyB4KSAtIChkb20udmlld3BvcnRXaWR0aCgpIC0geERpc3RGcm9tTm90Y2hUb0VkZ2UpO1xyXG5cclxuICAgICAgICBpZiAgICAgIChub3RjaE92ZXJsYXBMZWZ0RWRnZSA+IDApICBwb3NpdGlvbiA9ICdyaWdodCc7ICAgIC8vIHggaXMgaW4gdGhlIGxlZnQgdmlld3BvcnQgbWFyZ2luLlxyXG4gICAgICAgIGVsc2UgaWYgKG5vdGNoT3ZlcmxhcFJpZ2h0RWRnZSA+IDApIHBvc2l0aW9uID0gJ2xlZnQnOyAgICAgLy8geCBpcyBpbiB0aGUgcmlnaHQgdmlld3BvcnQgbWFyZ2luLiBcclxuICAgICAgICBlbHNlIGlmICh0b3RhbFRpcEhlaWdodCA+IChkb20udmlld3BvcnRIZWlnaHQoKSAvIDIpKSAgICAgIC8vIFRvb2x0aXAgaXMgdG9vIGhpZ2ggZm9yIGJvdGggdG9wIGFuZCBib3R0b20gc28gcGljayBzaWRlIG9mIHkgd2l0aCBtb3N0IHNwYWNlLlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKChiQ29udGFpbmVyLnRvcCArIHkpIDwgKGRvbS52aWV3cG9ydEhlaWdodCgpIC8gMikpIHBvc2l0aW9uID0gJ2JvdHRvbSc7XHJcbiAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9ICd0b3AnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aXBPdmVybGFwVG9wRWRnZSAgICAgID0gdG90YWxUaXBIZWlnaHQgLSAoYkNvbnRhaW5lci50b3AgKyB5KTtcclxuICAgICAgICAgICAgdGlwT3ZlcmxhcEJvdHRvbUVkZ2UgICA9IChiQ29udGFpbmVyLnRvcCArIHkpIC0gKGRvbS52aWV3cG9ydEhlaWdodCgpIC0gdG90YWxUaXBIZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpcE92ZXJsYXBUb3BFZGdlID4gMCkgICAgcG9zaXRpb24gPSAnYm90dG9tJzsgICAgIC8vIFRoZSB0aXAgaXMgb3ZlcmxhcHBpbmcgdGhlIHRvcCB2aWV3cG9ydCBtYXJnaW4uXHJcbiAgICAgICAgICAgIGlmICh0aXBPdmVybGFwQm90dG9tRWRnZSA+IDApIHBvc2l0aW9uID0gJ3RvcCc7ICAgICAgICAvLyBUaGUgdGlwIGlzIG92ZXJsYXBwaW5nIHRoZSBib3R0b20gdmlld3BvcnQgbWFyZ2luLlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBvc2l0aW9uID09PSAnbGVmdCcgfHwgcG9zaXRpb24gPT09ICdyaWdodCcpXHJcbiAgICB7XHJcbiAgICAgICAgeURpc3RGcm9tTm90Y2hUb0VkZ2UgICAgICAgID0gKGJOb3RjaC5oZWlnaHQgLyAyKSArIHRoaXMuX29wdGlvbnMubm90Y2hQYWRkaW5nICsgdGhpcy5fb3B0aW9ucy5ib3JkZXJXaWR0aCArIHRoaXMuX29wdGlvbnMudmlld3BvcnRNYXJnaW47XHJcbiAgICAgICAgdmFyIHRvdGFsVGlwV2lkdGggICAgICAgICAgID0gYk5vdGNoLndpZHRoICsgYlRpcC53aWR0aCArIHRoaXMuX29wdGlvbnMudmlld3BvcnRNYXJnaW47XHJcblxyXG4gICAgICAgIHZhciBub3RjaE92ZXJsYXBUb3BFZGdlICAgICA9IHlEaXN0RnJvbU5vdGNoVG9FZGdlIC0gKGJDb250YWluZXIudG9wICsgeSk7XHJcbiAgICAgICAgdmFyIG5vdGNoT3ZlcmxhcEJvdHRvbUVkZ2UgID0gKGJDb250YWluZXIudG9wICsgeSkgLSAoZG9tLnZpZXdwb3J0SGVpZ2h0KCkgLSB5RGlzdEZyb21Ob3RjaFRvRWRnZSk7XHJcblxyXG4gICAgICAgIGlmICAgICAgKG5vdGNoT3ZlcmxhcFRvcEVkZ2UgPiAwKSAgICBwb3NpdGlvbiA9ICdib3R0b20nOyAgLy8geSBpcyBpbiB0aGUgdG9wIHZpZXdwb3J0IG1hcmdpbi5cclxuICAgICAgICBlbHNlIGlmIChub3RjaE92ZXJsYXBCb3R0b21FZGdlID4gMCkgcG9zaXRpb24gPSAndG9wJzsgICAgIC8vIHkgaXMgaW4gdGhlIGJvdHRvbSB2aWV3cG9ydCBtYXJnaW4uIFxyXG4gICAgICAgIGVsc2UgaWYgKHRvdGFsVGlwV2lkdGggPiAoZG9tLnZpZXdwb3J0V2lkdGgoKSAvIDIpKSAgICAgICAgLy8gVG9vbHRpcCBpcyB0b28gd2lkZSBmb3IgYm90aCBsZWZ0IGFuZCByaWdodCBzbyBwaWNrIHNpZGUgb2YgeCB3aXRoIG1vc3Qgc3BhY2UuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoKGJDb250YWluZXIubGVmdCArIHgpIDwgKGRvbS52aWV3cG9ydFdpZHRoKCkgLyAyKSkgcG9zaXRpb24gPSAncmlnaHQnO1xyXG4gICAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSAnbGVmdCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRpcE92ZXJsYXBMZWZ0RWRnZSAgICAgID0gdG90YWxUaXBXaWR0aCAtIChiQ29udGFpbmVyLmxlZnQgKyB4KTtcclxuICAgICAgICAgICAgdGlwT3ZlcmxhcFJpZ2h0RWRnZSAgICAgPSAoYkNvbnRhaW5lci5sZWZ0ICsgeCkgLSAoZG9tLnZpZXdwb3J0V2lkdGgoKSAtIHRvdGFsVGlwV2lkdGgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpcE92ZXJsYXBMZWZ0RWRnZSA+IDApICBwb3NpdGlvbiA9ICdyaWdodCc7ICAgICAgIC8vIFRoZSB0aXAgaXMgb3ZlcmxhcHBpbmcgdGhlIGxlZnQgdmlld3BvcnQgbWFyZ2luLlxyXG4gICAgICAgICAgICBpZiAodGlwT3ZlcmxhcFJpZ2h0RWRnZSA+IDApIHBvc2l0aW9uID0gJ2xlZnQnOyAgICAgICAgLy8gVGhlIHRpcCBpcyBvdmVybGFwcGluZyB0aGUgcmlnaHQgdmlld3BvcnQgbWFyZ2luLlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTdHlsZSB0aGUgbm90Y2ggYSBzZWNvbmQgdGltZSBhcyBpdHMgcG9zaXRpb24gbWF5IHdlbGwgaGF2ZSBjaGFuZ2VkIGR1ZSB0byBhYm92ZSBjb2RlLlxyXG4gICAgaWYgKHRoaXMuX29wdGlvbnMuaGlkZU5vdGNoID09PSBmYWxzZSkgYk5vdGNoID0gdGhpcy5fc3R5bGVOb3RjaChwb3NpdGlvbiwgdGhpcy5fb3B0aW9ucy5ub3RjaFNpemUsIHRoaXMuX29wdGlvbnMuYm9yZGVyV2lkdGgsIHRoaXMuX29wdGlvbnMuYm9yZGVyQ29sb3IsIHRoaXMuX29wdGlvbnMuYmFja2dyb3VuZENvbG9yLCBiVGlwLndpZHRoLCBiVGlwLmhlaWdodCk7XHJcblxyXG4gICAgLy8gQWRqdXN0IHRoZSB0aXAgYnViYmxlIHNvIHRoYXQgaXRzIGNlbnRlcmVkIG9uIHRoZSBub3RjaC5cclxuICAgIHZhciB4VGlwLCB5VGlwO1xyXG4gICAgaWYgKHBvc2l0aW9uID09PSAndG9wJykgICBcclxuICAgIHtcclxuICAgICAgICB4VGlwID0geCAtIChiVGlwLndpZHRoIC8gMik7XHJcbiAgICAgICAgeVRpcCA9IHkgLSAoYlRpcC5oZWlnaHQgKyBiTm90Y2guaGVpZ2h0KTtcclxuICAgIH0gXHJcbiAgICBlbHNlIGlmIChwb3NpdGlvbiA9PT0gJ2JvdHRvbScpICAgXHJcbiAgICB7XHJcbiAgICAgICAgeFRpcCA9IHggLSAoYlRpcC53aWR0aCAvIDIpO1xyXG4gICAgICAgIHlUaXAgPSB5ICsgYk5vdGNoLmhlaWdodDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBvc2l0aW9uID09PSAnbGVmdCcpICAgXHJcbiAgICB7XHJcbiAgICAgICAgeFRpcCA9IHggLSAoYlRpcC53aWR0aCArIGJOb3RjaC53aWR0aCk7XHJcbiAgICAgICAgeVRpcCA9IHkgLSAoYlRpcC5oZWlnaHQgLyAyKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBvc2l0aW9uID09PSAncmlnaHQnKSAgIFxyXG4gICAge1xyXG4gICAgICAgIHhUaXAgPSB4ICsgYk5vdGNoLndpZHRoO1xyXG4gICAgICAgIHlUaXAgPSB5IC0gKGJUaXAuaGVpZ2h0IC8gMik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRqdXN0IHRoZSB0aXAgYnViYmxlIGlmIGl0cyBvdmVybGFwcGluZyB0aGUgdmlld3BvcnQgbWFyZ2luLlxyXG4gICAgaWYgKHBvc2l0aW9uID09PSAndG9wJyB8fCBwb3NpdGlvbiA9PT0gJ2JvdHRvbScpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gVGhlIHRpcCB3aWR0aCBpcyBncmVhdGVyIHRoYW4gdmlld3BvcnQgd2lkdGggc28ganVzdCBhbmNob3IgdGhlIHRpcCB0byB0aGUgc2lkZSB0aGF0IHRoZSBub3RjaCBpcyBvbi5cclxuICAgICAgICBpZiAoYlRpcC53aWR0aCA+IGRvbS52aWV3cG9ydFdpZHRoKCkpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKChiQ29udGFpbmVyLmxlZnQgKyB4KSA8IChkb20udmlld3BvcnRXaWR0aCgpIC8gMikpIHhUaXAgPSB0aGlzLl9vcHRpb25zLnZpZXdwb3J0TWFyZ2luIC0gYkNvbnRhaW5lci5sZWZ0O1xyXG4gICAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFRpcCA9IGRvbS52aWV3cG9ydFdpZHRoKCkgLSBiQ29udGFpbmVyLmxlZnQgLSB0aGlzLl9vcHRpb25zLnZpZXdwb3J0TWFyZ2luIC0gYlRpcC53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGlwT3ZlcmxhcFJpZ2h0RWRnZSA9IChiQ29udGFpbmVyLmxlZnQgKyB4VGlwICsgYlRpcC53aWR0aCkgLSAoZG9tLnZpZXdwb3J0V2lkdGgoKSAtIHRoaXMuX29wdGlvbnMudmlld3BvcnRNYXJnaW4pO1xyXG4gICAgICAgICAgICB0aXBPdmVybGFwTGVmdEVkZ2UgID0gdGhpcy5fb3B0aW9ucy52aWV3cG9ydE1hcmdpbiAtIChiQ29udGFpbmVyLmxlZnQgKyB4VGlwKTtcclxuXHJcbiAgICAgICAgICAgIGlmICAgICAgKHRpcE92ZXJsYXBSaWdodEVkZ2UgPiAwKSB4VGlwIC09IHRpcE92ZXJsYXBSaWdodEVkZ2U7ICAvLyBUaGUgdGlwIGlzIG92ZXJsYXBwaW5nIHRoZSByaWdodCB2aWV3cG9ydCBtYXJnaW4uXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRpcE92ZXJsYXBMZWZ0RWRnZSA+IDApICB4VGlwICs9IHRpcE92ZXJsYXBMZWZ0RWRnZTsgICAvLyBUaGUgdGlwIGlzIG92ZXJsYXBwaW5nIHRoZSBsZWZ0IHZpZXdwb3J0IG1hcmdpbi5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwb3NpdGlvbiA9PT0gJ2xlZnQnIHx8IHBvc2l0aW9uID09PSAncmlnaHQnKVxyXG4gICAge1xyXG4gICAgICAgIC8vIFRoZSB0aXAgaXMgaGVpZ2h0IGlzIGdyZWF0ZXIgdGhhbiB2aWV3cG9ydCBoZWlnaHQgc28ganVzdCBhbmNob3IgdGhlIHRpcCB0byB0aGUgc2lkZSB0aGF0IHRoZSBub3RjaCBpcyBvbi5cclxuICAgICAgICBpZiAoYlRpcC5oZWlnaHQgPiBkb20udmlld3BvcnRIZWlnaHQoKSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoKGJDb250YWluZXIudG9wICsgeSkgPCAoZG9tLnZpZXdwb3J0SGVpZ2h0KCkgLyAyKSkgeVRpcCA9IHRoaXMuX29wdGlvbnMudmlld3BvcnRNYXJnaW4gLSBiQ29udGFpbmVyLnRvcDtcclxuICAgICAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlUaXAgPSBkb20udmlld3BvcnRIZWlnaHQoKSAtIGJDb250YWluZXIudG9wIC0gdGhpcy5fb3B0aW9ucy52aWV3cG9ydE1hcmdpbiAtIGJUaXAuaGVpZ2h0O1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGlwT3ZlcmxhcEJvdHRvbUVkZ2UgPSAoYkNvbnRhaW5lci50b3AgKyB5VGlwICsgYlRpcC5oZWlnaHQpIC0gKGRvbS52aWV3cG9ydEhlaWdodCgpIC0gdGhpcy5fb3B0aW9ucy52aWV3cG9ydE1hcmdpbik7XHJcbiAgICAgICAgICAgIHRpcE92ZXJsYXBUb3BFZGdlICAgID0gdGhpcy5fb3B0aW9ucy52aWV3cG9ydE1hcmdpbiAtIChiQ29udGFpbmVyLnRvcCArIHlUaXApO1xyXG5cclxuICAgICAgICAgICAgaWYgICAgICAodGlwT3ZlcmxhcEJvdHRvbUVkZ2UgPiAwKSB5VGlwIC09IHRpcE92ZXJsYXBCb3R0b21FZGdlOyAvLyBUaGUgdGlwIGlzIG92ZXJsYXBwaW5nIHRoZSBib3R0b20gdmlld3BvcnQgbWFyZ2luLlxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aXBPdmVybGFwVG9wRWRnZSA+IDApICAgIHlUaXAgKz0gdGlwT3ZlcmxhcFRvcEVkZ2U7ICAgIC8vIFRoZSB0aXAgaXMgb3ZlcmxhcHBpbmcgdGhlIHRvcCB2aWV3cG9ydCBtYXJnaW4uXHJcbiAgICAgICAgfVxyXG4gICAgfSBcclxuXHJcbiAgICAvLyBQb3NpdGlvbiB0aGUgdGlwIGFuZCBub3RjaC5cclxuICAgIHRoaXMuX3hUaXBFbmQgICA9IHhUaXA7XHJcbiAgICB0aGlzLl95VGlwRW5kICAgPSB5VGlwO1xyXG4gICAgdGhpcy5feE5vdGNoRW5kID0geCAtIHhUaXA7XHJcbiAgICB0aGlzLl95Tm90Y2hFbmQgPSB5IC0geVRpcDtcclxuXHJcbiAgICAvLyBIaWRlIG5vdGNoIGlmIGl0cyBzdHJheWVkIGJleW9uZCB0aGUgZWRnZSBvZiB0aGUgdGlwIGllIHdoZW4gdGhlIHh5IGNvb3JkcyBhcmUgaW4gdGhlIGNvcm5lcnMgb2YgdGhlIHZpZXdwb3J0LlxyXG4gICAgaWYgKHBvc2l0aW9uID09PSAndG9wJyB8fCBwb3NpdGlvbiA9PT0gJ2JvdHRvbScpXHJcbiAgICB7XHJcbiAgICAgICAgeERpc3RGcm9tTm90Y2hUb0VkZ2UgPSAoYk5vdGNoLndpZHRoIC8gMikgKyB0aGlzLl9vcHRpb25zLmJvcmRlcldpZHRoO1xyXG4gICAgICAgIGlmICgodGhpcy5feE5vdGNoRW5kIDwgeERpc3RGcm9tTm90Y2hUb0VkZ2UpIHx8ICh0aGlzLl94Tm90Y2hFbmQgPiAoYlRpcC53aWR0aCAtIHhEaXN0RnJvbU5vdGNoVG9FZGdlKSkpIHRoaXMuX2hpZGVOb3RjaCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocG9zaXRpb24gPT09ICdsZWZ0JyB8fCBwb3NpdGlvbiA9PT0gJ3JpZ2h0JylcclxuICAgIHtcclxuICAgICAgICB5RGlzdEZyb21Ob3RjaFRvRWRnZSAgPSAoYk5vdGNoLmhlaWdodCAvIDIpICsgdGhpcy5fb3B0aW9ucy5ib3JkZXJXaWR0aDtcclxuICAgICAgICBpZiAoKHRoaXMuX3lOb3RjaEVuZCA8IHlEaXN0RnJvbU5vdGNoVG9FZGdlKSB8fCAodGhpcy5feU5vdGNoRW5kID4gKGJUaXAuaGVpZ2h0IC0geURpc3RGcm9tTm90Y2hUb0VkZ2UpKSkgdGhpcy5faGlkZU5vdGNoKCk7XHJcbiAgICB9IFxyXG5cclxuICAgIGRvbS5jYW5jZWxBbmltYXRpb24odGhpcy5fYW5pbWF0aW9uSWQpO1xyXG5cclxuICAgIGlmICh0aGlzLl9vcHRpb25zLnVzZUFuaW1hdGlvbikgdGhpcy5fYW5pbWF0ZVRpcCh0aGlzLl9vcHRpb25zLnNwZWVkLCBwb3NpdGlvbik7XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb25UaXAodGhpcy5feFRpcEVuZCwgdGhpcy5feVRpcEVuZCk7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb25Ob3RjaCh0aGlzLl94Tm90Y2hFbmQsIHRoaXMuX3lOb3RjaEVuZCwgcG9zaXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBNb3ZlcyB0aGUgdGlwIHVzaW5nIGFuaW1hdGlvbi5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcHJpdmF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgICAgQSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEgdGhhdCBjb250cm9scyB0aGUgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbi5cclxuICogQHBhcmFtIHtzdHJpbmd9IHBvc2l0aW9uIFRoZSBwcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGRhdGEgdGlwIHJlbGF0aXZlIHRvIHRoZSB4IGFuZCB5IGNvb3JkcyAtIG9uZSBvZiB0b3AsIGJvdHRvbSwgbGVmdCBvciByaWdodC5cclxuICovXHJcbkRhdGF0aXAucHJvdG90eXBlLl9hbmltYXRlVGlwID0gZnVuY3Rpb24gKHNwZWVkLCBwb3NpdGlvbilcclxue1xyXG4gICAgLy8gRmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cclxuICAgIC8vIFRlc3RzIGZvciBjb21wbGV0aW9uIG9mIGJvdGggdGlwIGFuZCBub3RjaCBhbmltYXRpb25zLlxyXG4gICAgdmFyIGNvbnRpbnVlQW5pbWF0aW9uID0gZmFsc2U7XHJcblxyXG4gICAgLy8gUG9zaXRpb24gdGhlIHRpcC4gVGVzdCBmb3Igd2l0aGluIHNuYXBEaXN0YW5jZSBvZiBlbmQgcG9pbnQuXHJcbiAgICBpZiAoKE1hdGguYWJzKHRoaXMuX3hUaXBFbmQgLSB0aGlzLl94VGlwU3RhcnQpIDwgdGhpcy5fb3B0aW9ucy5zbmFwRGlzdGFuY2UpICYmIChNYXRoLmFicyh0aGlzLl95VGlwRW5kIC0gdGhpcy5feVRpcFN0YXJ0KSA8IHRoaXMuX29wdGlvbnMuc25hcERpc3RhbmNlKSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLl94VGlwU3RhcnQgPSB0aGlzLl94VGlwRW5kO1xyXG4gICAgICAgIHRoaXMuX3lUaXBTdGFydCA9IHRoaXMuX3lUaXBFbmQ7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5feFRpcFN0YXJ0ICs9ICh0aGlzLl94VGlwRW5kIC0gdGhpcy5feFRpcFN0YXJ0KSAqIHNwZWVkO1xyXG4gICAgICAgIHRoaXMuX3lUaXBTdGFydCArPSAodGhpcy5feVRpcEVuZCAtIHRoaXMuX3lUaXBTdGFydCkgKiBzcGVlZDtcclxuICAgICAgICBjb250aW51ZUFuaW1hdGlvbiA9IHRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9wb3NpdGlvblRpcCh0aGlzLl94VGlwU3RhcnQsIHRoaXMuX3lUaXBTdGFydCk7XHJcblxyXG4gICAgLy8gUG9zaXRpb24gdGhlIG5vdGNoLiBUZXN0IGZvciB3aXRoaW4gc25hcERpc3RhbmNlIG9mIGVuZCBwb2ludC5cclxuICAgIGlmICgoTWF0aC5hYnModGhpcy5feE5vdGNoRW5kIC0gdGhpcy5feE5vdGNoU3RhcnQpIDwgdGhpcy5fb3B0aW9ucy5zbmFwRGlzdGFuY2UpICYmIChNYXRoLmFicyh0aGlzLl95Tm90Y2hFbmQgLSB0aGlzLl95Tm90Y2hTdGFydCkgPCB0aGlzLl9vcHRpb25zLnNuYXBEaXN0YW5jZSkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5feE5vdGNoU3RhcnQgPSB0aGlzLl94Tm90Y2hFbmQ7XHJcbiAgICAgICAgdGhpcy5feU5vdGNoU3RhcnQgPSB0aGlzLl95Tm90Y2hFbmQ7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5feE5vdGNoU3RhcnQgKz0gKHRoaXMuX3hOb3RjaEVuZCAtIHRoaXMuX3hOb3RjaFN0YXJ0KSAqIHNwZWVkO1xyXG4gICAgICAgIHRoaXMuX3lOb3RjaFN0YXJ0ICs9ICh0aGlzLl95Tm90Y2hFbmQgLSB0aGlzLl95Tm90Y2hTdGFydCkgKiBzcGVlZDtcclxuICAgICAgICBjb250aW51ZUFuaW1hdGlvbiA9IHRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9wb3NpdGlvbk5vdGNoKHRoaXMuX3hOb3RjaFN0YXJ0LCB0aGlzLl95Tm90Y2hTdGFydCwgcG9zaXRpb24pO1xyXG4gICAgICAgIFxyXG4gICAgLy8gQ29udGludWUgYW5pbWF0aW9uIHVudGlsIGJvdGggdGlwIGFuZCBub3RjaCBhcmUgd2l0aGluIG9uZSBwaXhlbCBvZiBlbmQgcG9pbnQuXHJcbiAgICBpZiAoY29udGludWVBbmltYXRpb24pIFxyXG4gICAge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uSWQgPSBkb20ucmVxdWVzdEFuaW1hdGlvbihmdW5jdGlvbiAoKSB7bWUuX2FuaW1hdGVUaXAoc3BlZWQgKz0gbWUuX29wdGlvbnMuc3BlZWRJbmNyLCBwb3NpdGlvbik7fSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFBvc2l0aW9ucyB0aGUgdGlwLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwcml2YXRlXHJcbiAqIFxyXG4gKiBAcGFyYW0ge251bWJlcn0geCBUaGUgeCBwb3NpdGlvbi5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkgVGhlIHkgcG9zaXRpb24uXHJcbiAqL1xyXG5EYXRhdGlwLnByb3RvdHlwZS5fcG9zaXRpb25UaXAgPSBmdW5jdGlvbiAoeCwgeSlcclxue1xyXG4gICAgZG9tLnN0eWxlKHRoaXMuX3RpcCwge2xlZnQ6eCsncHgnLCB0b3A6eSsncHgnfSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFBvc2l0aW9ucyB0aGUgbm90Y2guXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHByaXZhdGVcclxuICogXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4ICAgICAgICAgICAgVGhlIHggcG9zaXRpb24gb2YgdGhlIG5vdGNoLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geSAgICAgICAgICAgIFRoZSB5IHBvc2l0aW9uIG9mIHRoZSBub3RjaC5cclxuICogQHBhcmFtIHtzdHJpbmd9IHBvc2l0aW9uICAgICBUaGUgcHJlZmVycmVkIHBvc2l0aW9uIG9mIHRoZSBkYXRhIHRpcCByZWxhdGl2ZSB0byB0aGUgeCBhbmQgeSBjb29yZHMgLSBvbmUgb2YgdG9wLCBib3R0b20sIGxlZnQgb3IgcmlnaHQuXHJcbiAqL1xyXG5EYXRhdGlwLnByb3RvdHlwZS5fcG9zaXRpb25Ob3RjaCA9IGZ1bmN0aW9uICh4LCB5LCBwb3NpdGlvbilcclxue1xyXG4gICAgdmFyIGJOb3RjaCAgICAgID0gZG9tLmJvdW5kcyh0aGlzLl9ub3RjaEJvcmRlcik7XHJcbiAgICB2YXIgYm9yZGVyV2lkdGggPSB0aGlzLl9vcHRpb25zLmJvcmRlcldpZHRoO1xyXG4gICAgdmFyIG54LCBueTtcclxuICAgIGlmIChwb3NpdGlvbiA9PT0gJ3RvcCcpXHJcbiAgICB7XHJcbiAgICAgICAgbnggPSB4IC0gKGJOb3RjaC53aWR0aCAvIDIpIC0gYm9yZGVyV2lkdGg7XHJcbiAgICAgICAgbnkgPSBiTm90Y2guaGVpZ2h0ICogLTE7XHJcbiAgICAgICAgZG9tLnN0eWxlKHRoaXMuX25vdGNoQm9yZGVyLCB7bGVmdDpueCsncHgnLCBib3R0b206KG55LWJvcmRlcldpZHRoKSsncHgnLCB0b3A6JycsICAgIHJpZ2h0OicnfSk7XHJcbiAgICAgICAgZG9tLnN0eWxlKHRoaXMuX25vdGNoRmlsbCwgICB7bGVmdDpueCsncHgnLCBib3R0b206KG55KzEpKydweCcsICAgICAgICAgICB0b3A6JycsICAgIHJpZ2h0OicnfSk7XHJcbiAgICB9IFxyXG4gICAgZWxzZSBpZiAocG9zaXRpb24gPT09ICdib3R0b20nKVxyXG4gICAge1xyXG4gICAgICAgIG54ID0geCAtIChiTm90Y2gud2lkdGggLyAyKSAtIGJvcmRlcldpZHRoO1xyXG4gICAgICAgIG55ID0gYk5vdGNoLmhlaWdodCAqIC0xO1xyXG4gICAgICAgIGRvbS5zdHlsZSh0aGlzLl9ub3RjaEJvcmRlciwge2xlZnQ6bngrJ3B4JywgdG9wOihueS1ib3JkZXJXaWR0aCkrJ3B4JywgICAgYm90dG9tOicnLCByaWdodDonJ30pO1xyXG4gICAgICAgIGRvbS5zdHlsZSh0aGlzLl9ub3RjaEZpbGwsICAge2xlZnQ6bngrJ3B4JywgdG9wOihueSsxKSsncHgnLCAgICAgICAgICAgICAgYm90dG9tOicnLCByaWdodDonJ30pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocG9zaXRpb24gPT09ICdsZWZ0JylcclxuICAgIHtcclxuICAgICAgICBueSA9IHkgLSAoYk5vdGNoLmhlaWdodCAvIDIpIC0gYm9yZGVyV2lkdGg7XHJcbiAgICAgICAgbnggPSBiTm90Y2gud2lkdGggKiAtMTtcclxuICAgICAgICBkb20uc3R5bGUodGhpcy5fbm90Y2hCb3JkZXIsIHt0b3A6bnkrJ3B4JywgIHJpZ2h0OihueC1ib3JkZXJXaWR0aCkrJ3B4JywgIGJvdHRvbTonJywgbGVmdDonJ30pO1xyXG4gICAgICAgIGRvbS5zdHlsZSh0aGlzLl9ub3RjaEZpbGwsICAge3RvcDpueSsncHgnLCAgcmlnaHQ6KG54KzEpKydweCcsICAgICAgICAgICAgYm90dG9tOicnLCBsZWZ0OicnfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwb3NpdGlvbiA9PT0gJ3JpZ2h0JylcclxuICAgIHtcclxuICAgICAgICBueSA9IHkgLSAoYk5vdGNoLmhlaWdodCAvIDIpIC0gYm9yZGVyV2lkdGg7XHJcbiAgICAgICAgbnggPSBiTm90Y2gud2lkdGggKiAtMTtcclxuICAgICAgICBkb20uc3R5bGUodGhpcy5fbm90Y2hCb3JkZXIsIHt0b3A6bnkrJ3B4JywgIGxlZnQ6KG54LWJvcmRlcldpZHRoKSsncHgnLCAgIGJvdHRvbTonJywgcmlnaHQ6Jyd9KTtcclxuICAgICAgICBkb20uc3R5bGUodGhpcy5fbm90Y2hGaWxsLCAgIHt0b3A6bnkrJ3B4JywgIGxlZnQ6KG54KzEpKydweCcsICAgICAgICAgICAgIGJvdHRvbTonJywgcmlnaHQ6Jyd9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8qKiBcclxuICogU3R5bGVzIHRoZSBub3RjaC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcHJpdmF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zaXRpb24gICAgICAgICBUaGUgcHJlZmVycmVkIHBvc2l0aW9uIG9mIHRoZSBkYXRhIHRpcCByZWxhdGl2ZSB0byB0aGUgeCBhbmQgeSBjb29yZHMgLSBvbmUgb2YgdG9wLCBib3R0b20sIGxlZnQgb3IgcmlnaHQuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplICAgICAgICAgICAgIFRoZSBub3RjaCBzaXplLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gYm9yZGVyV2lkdGggICAgICBUaGUgYm9yZGVyIHdpZHRoLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gYm9yZGVyQ29sb3IgICAgICBUaGUgYm9yZGVyIGNvbG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFja2dyb3VuZENvbG9yICBUaGUgYmFja2dyb3VuZCBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRpcFdpZHRoICAgICAgICAgVGhlIHRpcCB3aWR0aC5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRpcEhlaWdodCAgICAgICAgVGhlIHRpcCBoZWlnaHQuXHJcbiAqXHJcbiAqIEByZXR1cm4ge0RPTVJlY3R9IFRoZSBzaXplIG9mIHRoZSBub3RjaCBhbmQgaXRzIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydC5cclxuICovXHJcbkRhdGF0aXAucHJvdG90eXBlLl9zdHlsZU5vdGNoID0gZnVuY3Rpb24gKHBvc2l0aW9uLCBzaXplLCBib3JkZXJXaWR0aCwgYm9yZGVyQ29sb3IsIGJhY2tncm91bmRDb2xvciwgdGlwV2lkdGgsIHRpcEhlaWdodClcclxue1xyXG4gICAgLy8gTm90Y2ggc3R5bGUgdXNlcyBjc3MgYm9yZGVyIHRyaWNrLlxyXG4gICAgdmFyIG5TaXplICAgPSBNYXRoLm1heChzaXplLCBib3JkZXJXaWR0aCk7XHJcbiAgICB2YXIgbkJvcmRlciA9IG5TaXplKydweCBzb2xpZCAnK2JvcmRlckNvbG9yO1xyXG4gICAgdmFyIG5GaWxsICAgPSBuU2l6ZSsncHggc29saWQgJytiYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICB2YXIgblRyYW5zICA9IG5TaXplKydweCBzb2xpZCB0cmFuc3BhcmVudCc7XHJcblxyXG4gICAgaWYgKHBvc2l0aW9uID09PSAndG9wJylcclxuICAgIHtcclxuICAgICAgICBkb20uc3R5bGUodGhpcy5fbm90Y2hCb3JkZXIsIHtib3JkZXJUb3A6bkJvcmRlciwgICAgYm9yZGVyUmlnaHQ6blRyYW5zLCBib3JkZXJMZWZ0Om5UcmFucywgICBib3JkZXJCb3R0b206JzBweCd9KTtcclxuICAgICAgICBkb20uc3R5bGUodGhpcy5fbm90Y2hGaWxsLCAgIHtib3JkZXJUb3A6bkZpbGwsICAgICAgYm9yZGVyUmlnaHQ6blRyYW5zLCBib3JkZXJMZWZ0Om5UcmFucywgICBib3JkZXJCb3R0b206JzBweCd9KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBvc2l0aW9uID09PSAnYm90dG9tJylcclxuICAgIHtcclxuICAgICAgICBkb20uc3R5bGUodGhpcy5fbm90Y2hCb3JkZXIsIHtib3JkZXJCb3R0b206bkJvcmRlciwgYm9yZGVyUmlnaHQ6blRyYW5zLCBib3JkZXJMZWZ0Om5UcmFucywgICBib3JkZXJUb3A6JzBweCd9KTtcclxuICAgICAgICBkb20uc3R5bGUodGhpcy5fbm90Y2hGaWxsLCAgIHtib3JkZXJCb3R0b206bkZpbGwsICAgYm9yZGVyUmlnaHQ6blRyYW5zLCBib3JkZXJMZWZ0Om5UcmFucywgICBib3JkZXJUb3A6JzBweCd9KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBvc2l0aW9uID09PSAnbGVmdCcpXHJcbiAgICB7XHJcbiAgICAgICAgZG9tLnN0eWxlKHRoaXMuX25vdGNoQm9yZGVyLCB7Ym9yZGVyTGVmdDpuQm9yZGVyLCAgIGJvcmRlclRvcDpuVHJhbnMsICAgYm9yZGVyQm90dG9tOm5UcmFucywgYm9yZGVyUmlnaHQ6JzBweCd9KTtcclxuICAgICAgICBkb20uc3R5bGUodGhpcy5fbm90Y2hGaWxsLCAgIHtib3JkZXJMZWZ0Om5GaWxsLCAgICAgYm9yZGVyVG9wOm5UcmFucywgICBib3JkZXJCb3R0b206blRyYW5zLCBib3JkZXJSaWdodDonMHB4J30pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocG9zaXRpb24gPT09ICdyaWdodCcpXHJcbiAgICB7XHJcbiAgICAgICAgZG9tLnN0eWxlKHRoaXMuX25vdGNoQm9yZGVyLCB7Ym9yZGVyUmlnaHQ6bkJvcmRlciwgIGJvcmRlclRvcDpuVHJhbnMsICAgYm9yZGVyQm90dG9tOm5UcmFucywgYm9yZGVyTGVmdDonMHB4J30pO1xyXG4gICAgICAgIGRvbS5zdHlsZSh0aGlzLl9ub3RjaEZpbGwsICAge2JvcmRlclJpZ2h0Om5GaWxsLCAgICBib3JkZXJUb3A6blRyYW5zLCAgIGJvcmRlckJvdHRvbTpuVHJhbnMsIGJvcmRlckxlZnQ6JzBweCd9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIaWRlIG5vdGNoIGlmIGl0cyBiaWdnZXIgdGhhbiB0aGUgdGlwLlxyXG4gICAgdmFyIGJOb3RjaCA9IGRvbS5ib3VuZHModGhpcy5fbm90Y2hCb3JkZXIpO1xyXG4gICAgaWYgICgoKHBvc2l0aW9uID09PSAnbGVmdCcgfHwgcG9zaXRpb24gPT09ICdyaWdodCcpICYmICgoYk5vdGNoLmhlaWdodCArICh0aGlzLl9vcHRpb25zLm5vdGNoUGFkZGluZyAqIDIpICsgKHRoaXMuX29wdGlvbnMuYm9yZGVyV2lkdGggKiAyKSkgPiB0aXBIZWlnaHQpKSB8fCBcclxuICAgICAgICAgKChwb3NpdGlvbiA9PT0gJ3RvcCcgfHwgcG9zaXRpb24gPT09ICdib3R0b20nKSAmJiAoKGJOb3RjaC53aWR0aCArICh0aGlzLl9vcHRpb25zLm5vdGNoUGFkZGluZyAqIDIpICsgKHRoaXMuX29wdGlvbnMuYm9yZGVyV2lkdGggKiAyKSkgID4gdGlwV2lkdGgpKSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9oaWRlTm90Y2goKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYk5vdGNoO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBIaWRlIHRoZSBub3RjaC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuRGF0YXRpcC5wcm90b3R5cGUuX2hpZGVOb3RjaCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICAgIGRvbS5zdHlsZSh0aGlzLl9ub3RjaEJvcmRlciwge2JvcmRlclRvcDonMHB4JywgYm9yZGVyUmlnaHQ6JzBweCcsIGJvcmRlckJvdHRvbTonMHB4JywgYm9yZGVyTGVmdDonMHB4J30pO1xyXG4gICAgZG9tLnN0eWxlKHRoaXMuX25vdGNoRmlsbCwgICB7Ym9yZGVyVG9wOicwcHgnLCBib3JkZXJSaWdodDonMHB4JywgYm9yZGVyQm90dG9tOicwcHgnLCBib3JkZXJMZWZ0OicwcHgnfSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFNldHMgdGhlIGh0bWwgZm9yIHRoZSBkYXRhIHRpcC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBcclxuICogQHBhcmFtIHtzdHJpbmd9IGh0bWwgVGhlIGh0bWwuXHJcbiAqXHJcbiAqIEByZXR1cm4ge0RhdGF0aXB9IDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuRGF0YXRpcC5wcm90b3R5cGUuaHRtbCA9IGZ1bmN0aW9uICh0ZXh0KVxyXG57XHJcbiAgICBkb20uaHRtbCh0aGlzLl90aXBUZXh0LCB0ZXh0KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBTaG93cyB0aGUgZGF0YSB0aXAuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHJldHVybiB7RGF0YXRpcH0gPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5EYXRhdGlwLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKClcclxueyBcclxuICAgIGlmICh0aGlzLl90aXBPcGFjaXR5ICE9PSAxKVxyXG4gICAge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9mYWRlT3V0RGVsYXkpO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fZmFkZU91dEludGVydmFsKTtcclxuICAgICAgICBkb20uc2hvdyh0aGlzLl90aXApO1xyXG4gICAgICAgIGRvbS5vcGFjaXR5KHRoaXMuX3RpcCwgMSk7XHJcbiAgICAgICAgdGhpcy5fdGlwT3BhY2l0eSA9IDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogSGlkZXMgdGhlIGRhdGEgdGlwLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEByZXR1cm4ge0RhdGF0aXB9IDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuRGF0YXRpcC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICAgIGlmICh0aGlzLl90aXBPcGFjaXR5ICE9PSAwKVxyXG4gICAge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9mYWRlT3V0RGVsYXkpO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fZmFkZU91dEludGVydmFsKTtcclxuICAgICAgICBkb20uaGlkZSh0aGlzLl90aXApO1xyXG4gICAgICAgIGRvbS5vcGFjaXR5KHRoaXMuX3RpcCwgMCk7XHJcbiAgICAgICAgdGhpcy5fdGlwT3BhY2l0eSA9IDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogRmFkZSBvdXQgdGhlICBkYXRhIHRpcC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtEYXRhdGlwfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkRhdGF0aXAucHJvdG90eXBlLmZhZGVPdXQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICB2YXIgbWUgPSB0aGlzO1xyXG5cclxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9mYWRlT3V0RGVsYXkpO1xyXG4gICAgdGhpcy5fZmFkZU91dERlbGF5ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKVxyXG4gICAge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwobWUuX2ZhZGVPdXRJbnRlcnZhbCk7XHJcbiAgICAgICAgbWUuX2ZhZGVPdXRJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKG1lLl90aXBPcGFjaXR5IDw9IDAuMSkgbWUuaGlkZSgpO1xyXG4gICAgICAgICAgICBkb20ub3BhY2l0eShtZS5fdGlwLCBtZS5fdGlwT3BhY2l0eSk7XHJcbiAgICAgICAgICAgIG1lLl90aXBPcGFjaXR5IC09IG1lLl90aXBPcGFjaXR5ICogMC4xO1xyXG4gICAgICAgIH0sIDIwKTtcclxuICAgIH0sIDcwMCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGF0YXRpcDsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4vKiBnbG9iYWxzIERFQlVHICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3ICAgIEV4cG9ydHMgdGhlIHtAbGluayBFdmVudEhhbmRsZXJ9IGNsYXNzLlxyXG4gKiBAYXV0aG9yICAgICAgICAgIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0ICAgICAgIEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlICAgICAgICAgIGNoYXJ0cy9FdmVudEhhbmRsZXIgXHJcbiAqIEByZXF1aXJlcyAgICAgICAgdXRpbHMvZG9tXHJcbiAqL1xyXG5cclxuLy8gUmVxdWlyZWQgbW9kdWxlcy5cclxudmFyIGRvbSA9IHJlcXVpcmUoJy4uL3V0aWxzL2RvbScpO1xyXG5cclxuLyoqIFxyXG4gKiBAY2xhc3NkZXNjIEV2ZW50IGhhbmRsZXIgY2xhc3MuXHJcbiAqXHJcbiAqIEBjbGFzc1xyXG4gKiBAYWxpYXMgRXZlbnRIYW5kbGVyXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtDYXJ0ZXNpYW5Db29yZHN8UG9sYXJDb29yZHN9IGNvb3JkcyAgVGhlIGNvb3JkaW5hdGUgc3lzdGVtLiBcclxuICovXHJcbmZ1bmN0aW9uIEV2ZW50SGFuZGxlciAob3B0aW9ucylcclxue1xyXG4gICAgLy8gVE9ETyBDaHJvbWUsIEZGIGFuZCBPcGVyYSBkb250IGRpc3BhdGNoIGEgbW91c2VvdXQgZXZlbnQgaWYgeW91IGxlYXZlIHRoZSBicm93c2VyIHdpbmRvdyB3aGlsc3QgaG92ZXJpbmcgYW4gc3ZnIGVsZW1lbnQuXHJcblxyXG4gICAgdmFyIGVsZW1lbnQgICAgICAgICA9IG9wdGlvbnMuZWxlbWVudDtcclxuICAgIHZhciBjb29yZHMgICAgICAgICAgPSBvcHRpb25zLmNvb3JkcztcclxuICAgIHZhciBkZWx0YSAgICAgICAgICAgPSAwO1xyXG4gICAgdmFyIGlzT3ZlciAgICAgICAgICA9IGZhbHNlO1xyXG4gICAgdmFyIGlzRHJhZ2dpbmcgICAgICA9IGZhbHNlO1xyXG4gICAgdmFyIGlzRG93biAgICAgICAgICA9IGZhbHNlO1xyXG4gICAgdmFyIGlzRG93bk92ZXIgICAgICA9IGZhbHNlO1xyXG4gICAgdmFyIGRvd25YICAgICAgICAgICA9IDA7XHJcbiAgICB2YXIgZG93blkgICAgICAgICAgID0gMDtcclxuICAgIHZhciBkaXNwYXRjaGVkT3ZlciAgPSBmYWxzZTtcclxuICAgIHZhciBlbGVtZW50UG9zaXRpb247XHJcbiAgICB2YXIgcG9pbnRlclBvc2l0aW9uO1xyXG4gICAgdmFyIHZpZXdwb3J0V2lkdGg7XHJcbiAgICB2YXIgdmlld3BvcnRIZWlnaHQ7XHJcblxyXG4gICAgLy8gTW91c2UgZXZlbnQgaGFuZGxlclxyXG4gICAgZnVuY3Rpb24gbW91c2VFdmVudEhhbmRsZXIgKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBjbGllbnRYID0gZXZlbnQuY2xpZW50WDtcclxuICAgICAgICB2YXIgY2xpZW50WSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgICAgICAgcG9pbnRlclBvc2l0aW9uID0gZ2V0UG9pbnRlclBvc2l0aW9uKGNsaWVudFgsIGNsaWVudFkpO1xyXG4gICAgICAgIGlzUG9pbnRlck92ZXJDaGFydChjbGllbnRYLCBjbGllbnRZKTtcclxuXHJcbiAgICAgICAgdmFyIGR4ICAgPSBwb2ludGVyUG9zaXRpb24ueCAtIGRvd25YO1xyXG4gICAgICAgIHZhciBkeSAgID0gcG9pbnRlclBvc2l0aW9uLnkgLSBkb3duWTtcclxuICAgICAgICB2YXIgZGlmZiA9IE1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnIDogXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNEcmFnZ2luZykgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ21vdXNlZHJhZycsIGV2ZW50LCBwb2ludGVyUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpc0Rvd25PdmVyICYmIChkaWZmID4gNSkpIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCdtb3VzZWRyYWdzdGFydCcsIGV2ZW50LCB7eDpkb3duWCwgeTpkb3duWX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNPdmVyICYmICFpc0Rvd24gJiYgKGRvd25YICE9PSBwb2ludGVyUG9zaXRpb24ueCB8fCBkb3duWSAhPT0gcG9pbnRlclBvc2l0aW9uLnkpKSBcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgnbW91c2Vtb3ZlJywgZXZlbnQsIHBvaW50ZXJQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzT3ZlciAmJiAhZGlzcGF0Y2hlZE92ZXIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2hlZE92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCdtb3VzZW92ZXInLCBldmVudCwgcG9pbnRlclBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFpc092ZXIgJiYgZGlzcGF0Y2hlZE92ZXIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2hlZE92ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgnbW91c2VvdXQnLCBldmVudCwgcG9pbnRlclBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nIDogXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNPdmVyKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRG93bk92ZXIgPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgnbW91c2Vkb3duJywgZXZlbnQsIHBvaW50ZXJQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG93blggPSBwb2ludGVyUG9zaXRpb24ueDtcclxuICAgICAgICAgICAgICAgICAgICBkb3duWSA9IHBvaW50ZXJQb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIGVsc2UgZGlzcGF0Y2goJ21vdXNlZG93bm91dHNpZGUnLCBldmVudCwgcG9pbnRlclBvc2l0aW9uKTsgXHJcbiAgICAgICAgICAgICAgICBpc0Rvd24gPSB0cnVlOyBcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdtb3VzZXVwJyA6IFxyXG4gICAgICAgICAgICAgICAgaWYgKGlzRHJhZ2dpbmcpICAgIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCdtb3VzZWRyYWdlbmQnLCBldmVudCwgcG9pbnRlclBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzRG93bk92ZXIpICAgICAgXHJcbiAgICAgICAgICAgICAgICB7ICBcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgnbW91c2V1cCcsIGV2ZW50LCBwb2ludGVyUG9zaXRpb24pOyAgICBcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgnbW91c2VjbGljaycsIGV2ZW50LCBwb2ludGVyUG9zaXRpb24pOyBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlzRG93biAgICAgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgICAgICBpc0Rvd25PdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnbW91c2V3aGVlbCcgOiBcclxuICAgICAgICAgICAgY2FzZSAnRE9NTW91c2VTY3JvbGwnIDogIFxyXG4gICAgICAgICAgICAgICAgZGVsdGEgPSAoZXZlbnQuZGV0YWlsIDwgMCB8fCBldmVudC53aGVlbERlbHRhID4gMCkgPyAxIDogLTE7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgnbW91c2V3aGVlbCcsIGV2ZW50LCBwb2ludGVyUG9zaXRpb24pOyAgICBcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBGb3IgY2FzZXMgd2hlbiB0aGUgbW91c2UgbW92ZXMgb3V0c2lkZSB0aGUgYnJvd3NlciB3aW5kb3cgd2hpbHN0IG92ZXIgdGhlIGNoYXJ0cyB2aWV3cG9ydC5cclxuICAgICAgICAgICAgY2FzZSAnbW91c2VvdXQnIDogXHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQudG9FbGVtZW50ID09PSBudWxsICYmIGV2ZW50LnJlbGF0ZWRUYXJnZXQgPT09IG51bGwpIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc092ZXIgJiYgZGlzcGF0Y2hlZE92ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaGVkT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgnbW91c2VvdXQnLCBldmVudCwgcG9pbnRlclBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IG1vdXNlIGZ1bmN0aW9uYWxpdHkuXHJcbiAgICAgICAgaWYgKGlzT3ZlciB8fCBpc0RyYWdnaW5nKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvdWNoIGV2ZW50IGhhbmRsZXJcclxuICAgIGZ1bmN0aW9uIHRvdWNoRXZlbnRIYW5kbGVyIChldmVudClcclxuICAgIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgIEZvciBhIHNpbmdsZSBjbGljayB0aGUgb3JkZXIgb2YgZXZlbnRzIGlzOlxyXG5cclxuICAgICAgICAxLiB0b3VjaHN0YXJ0XHJcbiAgICAgICAgMi4gdG91Y2htb3ZlXHJcbiAgICAgICAgMy4gdG91Y2hlbmRcclxuICAgICAgICA0LiBtb3VzZW92ZXJcclxuICAgICAgICA1LiBtb3VzZW1vdmVcclxuICAgICAgICA2LiBtb3VzZWRvd25cclxuICAgICAgICA3LiBtb3VzZXVwXHJcbiAgICAgICAgOC4gY2xpY2tcclxuXHJcbiAgICAgICAgVXNlIHByZXZlbnREZWZhdWx0KCkgaW5zaWRlIHRvdWNoIGV2ZW50IGhhbmRsZXJzLCBzbyB0aGUgZGVmYXVsdCBtb3VzZS1lbXVsYXRpb24gaGFuZGxpbmcgZG9lc27igJl0IG9jY3VyLlxyXG4gICAgICAgIGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vbW9iaWxlL3RvdWNoYW5kbW91c2UvXHJcblxyXG4gICAgICAgIEJ1dCB3ZXZlIGF0dGFjaGVkIGhhbmRsZXJzIHRvIHRoZSB3aW5kb3cgcmF0aGVyIHRoYW4gdGhlIGVsZW1lbnQgc28gb25seSBjYWxsIHByZXZlbnREZWZhdWx0KCkgaWYgd2VyZVxyXG4gICAgICAgIGRyYWdnaW5nIG9yIG92ZXIgdGhlIGNoYXJ0IHZpZXdwb3J0IHNvIHdlIGRvbnQgYnJlYWsgZGVmYXVsdCB3aW5kb3cgdG91Y2ggZXZlbnRzIHdoZW4gbm90IG92ZXIgdGhlIGNoYXJ0LlxyXG5cclxuICAgICAgICB0b3VjaGVzICAgICAgICAgOiBhIGxpc3Qgb2YgYWxsIGZpbmdlcnMgY3VycmVudGx5IG9uIHRoZSBzY3JlZW4uXHJcbiAgICAgICAgdGFyZ2V0VG91Y2hlcyAgIDogYSBsaXN0IG9mIGZpbmdlcnMgb24gdGhlIGN1cnJlbnQgRE9NIGVsZW1lbnQuXHJcbiAgICAgICAgY2hhbmdlZFRvdWNoZXMgIDogYSBsaXN0IG9mIGZpbmdlcnMgaW52b2x2ZWQgaW4gdGhlIGN1cnJlbnQgZXZlbnQuIEZvciBleGFtcGxlLCBpbiBhIHRvdWNoZW5kIGV2ZW50LCB0aGlzIHdpbGwgYmUgdGhlIGZpbmdlciB0aGF0IHdhcyByZW1vdmVkLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldFRvdWNoZXMgJiYgZXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGggPT09IDIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdDEgPSBldmVudC50YXJnZXRUb3VjaGVzWzBdO1xyXG4gICAgICAgICAgICB2YXIgY2xpZW50WDEgPSB0MS5jbGllbnRYO1xyXG4gICAgICAgICAgICB2YXIgY2xpZW50WTEgPSB0MS5jbGllbnRZO1xyXG4gICAgICAgICAgICBwb2ludGVyUG9zaXRpb24gPSBnZXRQb2ludGVyUG9zaXRpb24oY2xpZW50WDEsIGNsaWVudFkxKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0MiA9IGV2ZW50LnRhcmdldFRvdWNoZXNbMV07XHJcbiAgICAgICAgICAgIHZhciBjbGllbnRYMiA9IHQyLmNsaWVudFg7XHJcbiAgICAgICAgICAgIHZhciBjbGllbnRZMiA9IHQyLmNsaWVudFk7XHJcbiAgICAgICAgICAgIHBvaW50ZXJQb3NpdGlvbiA9IGdldFBvaW50ZXJQb3NpdGlvbihjbGllbnRYMiwgY2xpZW50WTIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldmVudC5jaGFuZ2VkVG91Y2hlcyAmJiBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPT09IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xyXG4gICAgICAgICAgICB2YXIgY2xpZW50WCA9IHQuY2xpZW50WDtcclxuICAgICAgICAgICAgdmFyIGNsaWVudFkgPSB0LmNsaWVudFk7XHJcbiAgICAgICAgICAgIHBvaW50ZXJQb3NpdGlvbiA9IGdldFBvaW50ZXJQb3NpdGlvbihjbGllbnRYLCBjbGllbnRZKTtcclxuICAgICAgICAgICAgaXNQb2ludGVyT3ZlckNoYXJ0KGNsaWVudFgsIGNsaWVudFkpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGR4ICAgPSBwb2ludGVyUG9zaXRpb24ueCAtIGRvd25YO1xyXG4gICAgICAgICAgICB2YXIgZHkgICA9IHBvaW50ZXJQb3NpdGlvbi55IC0gZG93blk7XHJcbiAgICAgICAgICAgIHZhciBkaWZmID0gTWF0aC5zcXJ0KE1hdGgucG93KGR4LCAyKSArIE1hdGgucG93KGR5LCAyKSk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3RvdWNobW92ZScgOiBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRHJhZ2dpbmcpIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ3RvdWNoZHJhZycsIGV2ZW50LCBwb2ludGVyUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gIFxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzRG93bk92ZXIgJiYgKGRpZmYgPiAxMCkpIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCd0b3VjaGRyYWdzdGFydCcsIGV2ZW50LCB7eDpkb3duWCwgeTpkb3duWX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzT3ZlciAmJiAhZGlzcGF0Y2hlZE92ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaGVkT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCd0b3VjaG92ZXInLCBldmVudCwgcG9pbnRlclBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIWlzT3ZlciAmJiBkaXNwYXRjaGVkT3ZlcilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoZWRPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCd0b3VjaG91dCcsIGV2ZW50LCBwb2ludGVyUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3RvdWNoc3RhcnQnIDogXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzT3ZlcilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRG93bk92ZXIgPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goJ3RvdWNoZG93bicsIGV2ZW50LCBwb2ludGVyUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3duWCA9IHBvaW50ZXJQb3NpdGlvbi54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3duWSA9IHBvaW50ZXJQb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBkaXNwYXRjaCgndG91Y2hkb3dub3V0c2lkZScsIGV2ZW50LCBwb2ludGVyUG9zaXRpb24pOyBcclxuICAgICAgICAgICAgICAgICAgICBpc0Rvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndG91Y2hjYW5jZWwnIDogXHJcbiAgICAgICAgICAgICAgICBjYXNlICd0b3VjaGVuZCcgOiBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNEcmFnZ2luZykgICAgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgndG91Y2hkcmFnZW5kJywgZXZlbnQsIHBvaW50ZXJQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzRG93bk92ZXIpICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgeyAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKCd0b3VjaHVwJywgZXZlbnQsIHBvaW50ZXJQb3NpdGlvbik7ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCgndG91Y2hjbGljaycsIGV2ZW50LCBwb2ludGVyUG9zaXRpb24pOyBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRG93biAgICAgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgICAgICAgICAgaXNEb3duT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCB0b3VjaCBmdW5jdGlvbmFsaXR5LlxyXG4gICAgICAgICAgICBpZiAoaXNPdmVyIHx8IGlzRHJhZ2dpbmcpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEV2ZW50IGRpc3BhdGNoZXIuXHJcbiAgICBmdW5jdGlvbiBkaXNwYXRjaCAoZXZlbnRUeXBlLCBldmVudCwgcG9pbnRlclBvc2l0aW9uKVxyXG4gICAge1xyXG4gICAgICAgIC8vd2luZG93LmNvbnNvbGUubG9nKGV2ZW50VHlwZSk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnNbZXZlbnRUeXBlXSAhPT0gdW5kZWZpbmVkKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG9wdGlvbnNbZXZlbnRUeXBlXShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudCA6IGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgZGVsdGEgICAgICAgICA6IGRlbHRhLFxyXG4gICAgICAgICAgICAgICAgaXNPdmVyICAgICAgICA6IGlzT3ZlcixcclxuICAgICAgICAgICAgICAgIGlzRHJhZ2dpbmcgICAgOiBpc0RyYWdnaW5nLFxyXG4gICAgICAgICAgICAgICAgaXNEb3duICAgICAgICA6IGlzRG93bixcclxuICAgICAgICAgICAgICAgIGRhdGFYICAgICAgICAgOiBjb29yZHMuZ2V0RGF0YVgocG9pbnRlclBvc2l0aW9uLngpLFxyXG4gICAgICAgICAgICAgICAgZGF0YVkgICAgICAgICA6IGNvb3Jkcy5nZXREYXRhWShwb2ludGVyUG9zaXRpb24ueSksXHJcbiAgICAgICAgICAgICAgICBwaXhlbFggICAgICAgIDogcG9pbnRlclBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICBwaXhlbFkgICAgICAgIDogcG9pbnRlclBvc2l0aW9uLnlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIGVsZW1lbnQgd2l0aGluIHRoZSBicm93c2VyIHZpZXdwb3J0IGFuZCBcclxuICAgIC8vIHRoZSB2aWV3cG9ydCB3aWR0aCBhbmQgaGVpZ2h0IHdoZW4gdGhlIHdpbmRvdyBzaXplIGNoYW5nZXMgaWUgcmVzaXplZCBvciBzY3JvbGxlZC5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUVsZW1lbnRQb3NpdGlvbiAoKSBcclxuICAgIHtcclxuICAgICAgICB2aWV3cG9ydFdpZHRoICAgPSBkb20udmlld3BvcnRXaWR0aCgpO1xyXG4gICAgICAgIHZpZXdwb3J0SGVpZ2h0ICA9IGRvbS52aWV3cG9ydEhlaWdodCgpO1xyXG4gICAgICAgIGVsZW1lbnRQb3NpdGlvbiA9IGRvbS5ib3VuZHMoZWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVFbGVtZW50UG9zaXRpb24oKTtcclxuXHJcbiAgICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIHdpdGhpbiB0aGUgZWxlbWVudC5cclxuICAgIGZ1bmN0aW9uIGdldFBvaW50ZXJQb3NpdGlvbiAoY2xpZW50WCwgY2xpZW50WSkgXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHggPSBjbGllbnRYIC0gZWxlbWVudFBvc2l0aW9uLmxlZnQ7XHJcbiAgICAgICAgdmFyIHkgPSBjbGllbnRZIC0gZWxlbWVudFBvc2l0aW9uLnRvcDtcclxuICAgICAgICByZXR1cm4ge3g6eCwgeTp5fTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGUgcG9pbnRlciBpcyBvdmVyIHRoZSBjaGFydHMgdmlld3BvcnQuXHJcbiAgICBmdW5jdGlvbiBpc1BvaW50ZXJPdmVyQ2hhcnQgKGNsaWVudFgsIGNsaWVudFkpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gUHJldmVudCBwb2ludGVyIGV2ZW50cyBiZWluZyBkaXNwYXRjaGVkIHdoZW4gdGhlIHBvaW50ZXIgaXMgb3V0c2lkZSB0aGUgZWxlbWVudCBvciBvdmVyIHNjcm9sbGJhcnMgaW4gRkYgYW5kIElFLlxyXG4gICAgICAgIGlmIChjbGllbnRYIDwgMCB8fCBjbGllbnRYID4gdmlld3BvcnRXaWR0aCB8fCBjbGllbnRZIDwgMCB8fCBjbGllbnRZID4gdmlld3BvcnRIZWlnaHQpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENoZWNrIGlmIHBvaW50ZXIgaXMgb3ZlciB0aGUgY2hhcnQgdmlld3BvcnQuXHJcbiAgICAgICAgZWxzZSBpZiAocG9pbnRlclBvc2l0aW9uLnggPj0gY29vcmRzLnZpZXdQb3J0KCkueCgpICYmIChwb2ludGVyUG9zaXRpb24ueCAtIGNvb3Jkcy52aWV3UG9ydCgpLngoKSkgPD0gY29vcmRzLnZpZXdQb3J0KCkud2lkdGgoKSAmJiBcclxuICAgICAgICAgICAgICAgICBwb2ludGVyUG9zaXRpb24ueSA+PSBjb29yZHMudmlld1BvcnQoKS55KCkgJiYgKHBvaW50ZXJQb3NpdGlvbi55IC0gY29vcmRzLnZpZXdQb3J0KCkueSgpKSA8PSBjb29yZHMudmlld1BvcnQoKS5oZWlnaHQoKSkgIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXNPdmVyID0gdHJ1ZTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpc092ZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHdpbiA9IGRvbS5nZXRXaW5kb3dGb3JFbGVtZW50KGVsZW1lbnQpO1xyXG5cclxuICAgIC8vIE1vbml0b3IgY2hhbmdlcyB0byB0byBicm93c2VyIHdpbmRvdy5cclxuICAgIGRvbS5vbih3aW4sICdzY3JvbGwgcmVzaXplJywgdXBkYXRlRWxlbWVudFBvc2l0aW9uKTtcclxuXHJcbiAgICAvLyBNb3VzZSBldmVudHMuXHJcbiAgICBkb20ub24od2luLCAnbW91c2Vtb3ZlIG1vdXNldXAgbW91c2Vkb3duJywgbW91c2VFdmVudEhhbmRsZXIpO1xyXG4gICAgZG9tLm9uKGVsZW1lbnQsICdtb3VzZW91dCBtb3VzZXdoZWVsIERPTU1vdXNlU2Nyb2xsJywgbW91c2VFdmVudEhhbmRsZXIpO1xyXG5cclxuICAgIC8vIFRvdWNoIGV2ZW50cy5cclxuICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIGRvbS5vbih3aW4sICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCcsIHRvdWNoRXZlbnRIYW5kbGVyKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEhhbmRsZXI7IiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuLyogZ2xvYmFscyBERUJVRyAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQGZpbGVvdmVydmlldyAgICBFeHBvcnRzIHRoZSB7QGxpbmsgQ2FydGVzaWFuQ29vcmRzfSBjbGFzcy5cclxuICogQGF1dGhvciAgICAgICAgICBKb25hdGhhbiBDbGFyZSBcclxuICogQGNvcHlyaWdodCAgICAgICBGbG93aW5nQ2hhcnRzIDIwMTVcclxuICogQG1vZHVsZSAgICAgICAgICBnZW9tL0NhcnRlc2lhbkNvb3JkcyBcclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy91dGlsXHJcbiAqIEByZXF1aXJlcyAgICAgICAgZ2VvbS9WaWV3Qm94XHJcbiAqIEByZXF1aXJlcyAgICAgICAgZ2VvbS9SZWN0YW5nbGVcclxuICogQHJlcXVpcmVzICAgICAgICBnZW9tL1BvaW50XHJcbiAqL1xyXG5cclxuLy8gUmVxdWlyZWQgbW9kdWxlcy5cclxudmFyIFZpZXdCb3ggICAgPSByZXF1aXJlKCcuL1ZpZXdCb3gnKTtcclxudmFyIFJlY3RhbmdsZSAgPSByZXF1aXJlKCcuL1JlY3RhbmdsZScpO1xyXG52YXIgUG9pbnQgICAgICA9IHJlcXVpcmUoJy4vUG9pbnQnKTtcclxudmFyIHV0aWwgICAgICAgPSByZXF1aXJlKCcuLi91dGlscy91dGlsJyk7XHJcblxyXG4vKiogXHJcbiAqIEBjbGFzc2Rlc2MgTWFwcyBhIGRhdGEgc3BhY2UgdG8gYSBwaXhlbCBzcGFjZSBhbmQgdmljZSB2ZXJzYS5cclxuICpcclxuICogQGNsYXNzXHJcbiAqIEBhbGlhcyBDYXJ0ZXNpYW5Db29yZHNcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICBbb3B0aW9uc10gICAgICAgICAgIFRoZSBvcHRpb25zLlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbb3B0aW9ucy5jb250YWluZXJdIFRoZSBodG1sIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIHJlbmRlcmVyLiBcclxuICovXHJcbmZ1bmN0aW9uIENhcnRlc2lhbkNvb3JkcyAoKVxyXG57XHJcbiAgICAvLyBQcml2YXRlIGluc3RhbmNlIG1lbWJlcnMuICAgIFxyXG4gICAgdGhpcy5fdmlld1BvcnQgID0gbmV3IFJlY3RhbmdsZSgpOyAgLy8gVGhlIHJlY3RhbmdsZSBkZWZpbmluZyB0aGUgcGl4ZWwgY29vcmRzLlxyXG4gICAgdGhpcy5fdmlld0JveCAgID0gbmV3IFZpZXdCb3goKTsgICAgLy8gVGhlIHZpZXdCb3ggZGVmaW5pbmcgdGhlIGRhdGEgY29vcmRzLlxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIElmIHNldCB0byA8Y29kZT50cnVlPC9jb2RlPiB0aGUgdmlld0JveCBpcyBhZGp1c3RlZCB0byBtYWludGFpbiB0aGUgYXNwZWN0IHJhdGlvLlxyXG4gICAgICogSWYgc2V0IHRvIDxjb2RlPmZhbHNlPC9jb2RlPiB0aGUgdmlld0JveCBzdHJldGNoZXMgdG8gZmlsbCB0aGUgdmlld1BvcnQuXHJcbiAgICAgKiBcclxuICAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgICogQHR5cGUgYm9vbGVhblxyXG4gICAgICogQGRlZmF1bHQgZmFsc2VcclxuICAgICAqL1xyXG4gICAgdGhpcy5wcmVzZXJ2ZUFzcGVjdFJhdGlvID0gZmFsc2U7XHJcbn1cclxuXHJcbi8qKiBcclxuICogQSByZWN0YW5nbGUgdGhhdCBkZWZpbmVzIHRoZSBkcmF3aW5nIGFyZWEgKGluIHBpeGVscykgd2l0aGluIHRoZSBjb29yZGluYXRlIHNwYWNlLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFt4ID0gMF0gICAgICAgICAgVGhlIHggY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt5ID0gMF0gICAgICAgICAgVGhlIHkgY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt3aWR0aCA9IDEwMF0gICAgVGhlIHdpZHRoLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodCA9IDEwMF0gICBUaGUgaGVpZ2h0LlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtSZWN0YW5nbGV8Q2FydGVzaWFuQ29vcmRzfSBBIFJlY3RhbmdsZSB0aGF0IGRlZmluZWRzIHRoZSB2aWV3UG9ydCBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5DYXJ0ZXNpYW5Db29yZHMucHJvdG90eXBlLnZpZXdQb3J0ID0gZnVuY3Rpb24gKHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl92aWV3UG9ydC5zZXREaW1lbnNpb25zKHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNlcnZlQXNwZWN0UmF0aW8pIHRoaXMuZml0Vmlld0JveFRvVmlld1BvcnQodGhpcy5fdmlld0JveCwgdGhpcy5fdmlld1BvcnQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5fdmlld1BvcnQ7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFRoZSB2YWx1ZSBvZiB0aGUgdmlld0JveCBzcGVjaWZpZXMgYSByZWN0YW5nbGUgaW4gdXNlciBzcGFjZSB3aGljaCBpcyBtYXBwZWQgdG8gdGhlIGJvdW5kcyBvZiB0aGUgY29vcmRpbmF0ZSBzcGFjZS4gXHJcbiAqIFRoZSB2aWV3Qm94IGhhcyBpdHMgb3JpZ2luIGF0IHRoZSBib3R0b20gbGVmdCBjb3JuZXIgb2YgdGhlIGNvb3JkaW5hdGUgc3BhY2Ugd2l0aCB0aGUgXHJcbiAqIHBvc2l0aXZlIHgtYXhpcyBwb2ludGluZyB0b3dhcmRzIHRoZSByaWdodCwgdGhlIHBvc2l0aXZlIHktYXhpcyBwb2ludGluZyB1cC5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeE1pbiA9IDBdICAgVGhlIHggY29vcmQgb2YgdGhlIGJvdHRvbSBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt5TWluID0gMF0gICBUaGUgeSBjb29yZCBvZiB0aGUgYm90dG9tIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hNYXggPSAxMDBdIFRoZSB4IGNvb3JkIG9mIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3lNYXggPSAxMDBdIFRoZSB5IGNvb3JkIG9mIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtWaWV3Qm94fENhcnRlc2lhbkNvb3Jkc30gVGhlIFZpZXdCb3ggaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuQ2FydGVzaWFuQ29vcmRzLnByb3RvdHlwZS52aWV3Qm94ID0gZnVuY3Rpb24gKHhNaW4sIHlNaW4sIHhNYXgsIHlNYXgpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl92aWV3Qm94LnNldENvb3Jkcyh4TWluLCB5TWluLCB4TWF4LCB5TWF4KTtcclxuICAgICAgICBpZiAodGhpcy5wcmVzZXJ2ZUFzcGVjdFJhdGlvKSB0aGlzLmZpdFZpZXdCb3hUb1ZpZXdQb3J0KHRoaXMuX3ZpZXdCb3gsIHRoaXMuX3ZpZXdQb3J0KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX3ZpZXdCb3g7XHJcbn07XHJcblxyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhIHBvaW50IGZyb20gZGF0YSB1bml0cyB0byBwaXhlbCB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge1BvaW50fSBkYXRhUG9pbnQgQSBwb2ludCAoZGF0YSB1bml0cykuXHJcbiAqXHJcbiAqIEByZXR1cm4ge1BvaW50fSBBIHBvaW50IChwaXhlbCB1bml0cykuXHJcbiAqL1xyXG5DYXJ0ZXNpYW5Db29yZHMucHJvdG90eXBlLmdldFBpeGVsUG9pbnQgPSBmdW5jdGlvbiAoZGF0YVBvaW50KVxyXG57XHJcbiAgICB2YXIgeCA9IHRoaXMuZ2V0UGl4ZWxYKGRhdGFQb2ludC54KCkpO1xyXG4gICAgdmFyIHkgPSB0aGlzLmdldFBpeGVsWShkYXRhUG9pbnQueSgpKTtcclxuICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGEgYm91bmRpbmcgYm94IChkYXRhIHVuaXRzKSB0byBhIHJlY3RhbmdsZSAocGl4ZWwgdW5pdHMpLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7Vmlld0JveH0gdmlld0JveCBBIGJvdW5kaW5nIGJveCAoZGF0YSB1bml0cykuXHJcbiAqXHJcbiAqIEByZXR1cm4ge1JlY3RhbmdsZX0gQSByZWN0YW5nbGUgKHBpeGVsIHVuaXRzKS5cclxuICovXHJcbkNhcnRlc2lhbkNvb3Jkcy5wcm90b3R5cGUuZ2V0UGl4ZWxSZWN0ID0gZnVuY3Rpb24gKHZpZXdCb3gpXHJcbntcclxuICAgIHZhciB4ID0gdGhpcy5nZXRQaXhlbFgodmlld0JveC54TWluKCkpO1xyXG4gICAgdmFyIHkgPSB0aGlzLmdldFBpeGVsWSh2aWV3Qm94LnlNYXgoKSk7XHJcbiAgICB2YXIgdyA9IHRoaXMuZ2V0UGl4ZWxEaW1lbnNpb25YKHZpZXdCb3gud2lkdGgoKSk7XHJcbiAgICB2YXIgaCA9IHRoaXMuZ2V0UGl4ZWxEaW1lbnNpb25ZKHZpZXdCb3guaGVpZ2h0KCkpO1xyXG4gICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUoeCwgeSwgdywgaCk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGNvb3JkcyBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0LCAuLi5dIGZyb20gZGF0YSB1bml0cyB0byBwaXhlbCB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBhcnJEYXRhIEFuIGFycmF5IG9mIGNvb3JkcyAoZGF0YSB1bml0cykuXHJcbiAqXHJcbiAqIEByZXR1cm4ge251bWJlcltdfSBBbiBhcnJheSBvZiBjb29yZHMgKHBpeGVsIHVuaXRzKS5cclxuICovXHJcbkNhcnRlc2lhbkNvb3Jkcy5wcm90b3R5cGUuZ2V0UGl4ZWxBcnJheSA9IGZ1bmN0aW9uIChhcnJEYXRhKVxyXG57XHJcbiAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgdmFyIGFyclBpeGVsID0gYXJyRGF0YS5tYXAoZnVuY3Rpb24obnVtICwgaW5kZXgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGluZGV4ICUgMikgIHJldHVybiBtZS5nZXRQaXhlbFkobnVtKTtcclxuICAgICAgICBlbHNlICAgICAgICAgICAgcmV0dXJuIG1lLmdldFBpeGVsWChudW0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYXJyUGl4ZWw7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGFuIHggY29vcmQgZnJvbSBkYXRhIHVuaXRzIHRvIHBpeGVsIHVuaXRzLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRhWCBBbiB4IGNvb3JkIChkYXRhIHVuaXRzKS5cclxuICpcclxuICogQHJldHVybiB7bnVtYmVyfSBBbiB4IGNvb3JkIChwaXhlbCB1bml0cykuXHJcbiAqL1xyXG5DYXJ0ZXNpYW5Db29yZHMucHJvdG90eXBlLmdldFBpeGVsWCA9IGZ1bmN0aW9uIChkYXRhWClcclxue1xyXG4gICAgLy88dmFsaWRhdGlvbj5cclxuICAgIGlmICghdXRpbC5pc051bWJlcihkYXRhWCkpIHRocm93IG5ldyBFcnJvcignQ2FydGVzaWFuQ29vcmRzLmdldFBpeGVsWChkYXRhWCk6IGRhdGFYIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgIHZhciBweCA9IHRoaXMuX3ZpZXdQb3J0LngoKSArIHRoaXMuZ2V0UGl4ZWxEaW1lbnNpb25YKGRhdGFYIC0gdGhpcy5fdmlld0JveC54TWluKCkpO1xyXG4gICAgcmV0dXJuIHB4O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhIHkgY29vcmQgZnJvbSBkYXRhIHVuaXRzIHRvIHBpeGVsIHVuaXRzLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRhWSBBIHkgY29vcmQgKGRhdGEgdW5pdHMpLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IEEgeSBjb29yZCAocGl4ZWwgdW5pdHMpLlxyXG4gKi9cclxuQ2FydGVzaWFuQ29vcmRzLnByb3RvdHlwZS5nZXRQaXhlbFkgPSBmdW5jdGlvbiAoZGF0YVkpXHJcbntcclxuICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICBpZiAoIXV0aWwuaXNOdW1iZXIoZGF0YVkpKSB0aHJvdyBuZXcgRXJyb3IoJ0NhcnRlc2lhbkNvb3Jkcy5nZXRQaXhlbFkoZGF0YVkpOiBkYXRhWSBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICB2YXIgcHkgPSAgdGhpcy5fdmlld1BvcnQueSgpICsgdGhpcy5fdmlld1BvcnQuaGVpZ2h0KCkgLSB0aGlzLmdldFBpeGVsRGltZW5zaW9uWShkYXRhWSAtIHRoaXMuX3ZpZXdCb3gueU1pbigpKTtcclxuICAgIHJldHVybiBweTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ29udmVydHMgYW4geCBkaW1lbnNpb24gZnJvbSBkYXRhIHVuaXRzIHRvIHBpeGVsIHVuaXRzLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRhRGltZW5zaW9uWCBBbiB4IGRpbWVuc2lvbiAoZGF0YSB1bml0cykuXHJcbiAqXHJcbiAqIEByZXR1cm4ge251bWJlcn0gQW4geCBkaW1lbnNpb24gKHBpeGVsIHVuaXRzKS5cclxuICovXHJcbkNhcnRlc2lhbkNvb3Jkcy5wcm90b3R5cGUuZ2V0UGl4ZWxEaW1lbnNpb25YID0gZnVuY3Rpb24gKGRhdGFEaW1lbnNpb25YKVxyXG57XHJcbiAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgaWYgKCF1dGlsLmlzTnVtYmVyKGRhdGFEaW1lbnNpb25YKSkgdGhyb3cgbmV3IEVycm9yKCdDYXJ0ZXNpYW5Db29yZHMuZ2V0UGl4ZWxEaW1lbnNpb25YKGRhdGFEaW1lbnNpb25ZKTogZGF0YURpbWVuc2lvblggbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgaWYgKGRhdGFEaW1lbnNpb25YID09PSAwKSByZXR1cm4gMDtcclxuICAgIHZhciBwaXhlbERpbWVuc2lvblggID0gKGRhdGFEaW1lbnNpb25YIC8gdGhpcy5fdmlld0JveC53aWR0aCgpKSAqIHRoaXMuX3ZpZXdQb3J0LndpZHRoKCk7XHJcbiAgICByZXR1cm4gcGl4ZWxEaW1lbnNpb25YO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhIHkgZGltZW5zaW9uIGZyb20gZGF0YSB1bml0cyB0byBwaXhlbCB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0YURpbWVuc2lvblkgQSB5IGRpbWVuc2lvbiAoZGF0YSB1bml0cykuXHJcbiAqXHJcbiAqIEByZXR1cm4ge251bWJlcn0gQSB5IGRpbWVuc2lvbiAocGl4ZWwgdW5pdHMpLlxyXG4gKi9cclxuQ2FydGVzaWFuQ29vcmRzLnByb3RvdHlwZS5nZXRQaXhlbERpbWVuc2lvblkgPSBmdW5jdGlvbiAoZGF0YURpbWVuc2lvblkpXHJcbntcclxuICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICBpZiAoIXV0aWwuaXNOdW1iZXIoZGF0YURpbWVuc2lvblkpKSB0aHJvdyBuZXcgRXJyb3IoJ0NhcnRlc2lhbkNvb3Jkcy5nZXRQaXhlbERpbWVuc2lvblkoZGF0YURpbWVuc2lvblkpOiBkYXRhRGltZW5zaW9uWSBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICBpZiAoZGF0YURpbWVuc2lvblkgPT09IDApIHJldHVybiAwO1xyXG4gICAgdmFyIHBpeGVsRGltZW5zaW9uWSA9IChkYXRhRGltZW5zaW9uWSAvIHRoaXMuX3ZpZXdCb3guaGVpZ2h0KCkpICogdGhpcy5fdmlld1BvcnQuaGVpZ2h0KCk7XHJcbiAgICByZXR1cm4gcGl4ZWxEaW1lbnNpb25ZO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhIHBvaW50IGZyb20gcGl4ZWwgdW5pdHMgdG8gZGF0YSB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwaXhlbFBvaW50IEEgcG9pbnQgKHBpeGVsIHVuaXRzKS5cclxuICpcclxuICogQHJldHVybiB7UG9pbnR9IEEgcG9pbnQgKGRhdGEgdW5pdHMpLlxyXG4gKi9cclxuQ2FydGVzaWFuQ29vcmRzLnByb3RvdHlwZS5nZXREYXRhUG9pbnQgPSBmdW5jdGlvbiAocGl4ZWxQb2ludClcclxue1xyXG4gICAgdmFyIHggPSB0aGlzLmdldERhdGFYKHBpeGVsUG9pbnQueCgpKTtcclxuICAgIHZhciB5ID0gdGhpcy5nZXREYXRhWShwaXhlbFBvaW50LnkoKSk7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHgsIHkpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhIHJlY3RhbmdsZSAocGl4ZWwgdW5pdHMpIHRvIGEgdmlld0JveCAoZGF0YSB1bml0cykuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtSZWN0YW5nbGV9IHBpeGVsQ29vcmRzIEEgcmVjdGFuZ2xlIChwaXhlbCB1bml0cykuXHJcbiAqXHJcbiAqIEByZXR1cm4ge1ZpZXdCb3h9IEEgdmlld0JveCAoZGF0YSB1bml0cykuXHJcbiAqL1xyXG5DYXJ0ZXNpYW5Db29yZHMucHJvdG90eXBlLmdldERhdGFDb29yZHMgPSBmdW5jdGlvbiAocGl4ZWxDb29yZHMpXHJcbntcclxuICAgIHZhciB4TWluID0gdGhpcy5nZXREYXRhWChwaXhlbENvb3Jkcy54KCkpO1xyXG4gICAgdmFyIHlNYXggPSB0aGlzLmdldERhdGFZKHBpeGVsQ29vcmRzLnkoKSk7XHJcbiAgICB2YXIgeE1heCA9IHhNaW4gKyB0aGlzLmdldERhdGFEaW1lbnNpb25YKHBpeGVsQ29vcmRzLndpZHRoKCkpO1xyXG4gICAgdmFyIHlNaW4gPSB5TWF4IC0gdGhpcy5nZXRQRGF0YUhlaWdodChwaXhlbENvb3Jkcy5oZWlnaHQoKSk7XHJcbiAgICByZXR1cm4gbmV3IFZpZXdCb3goeE1pbiwgeU1pbiwgeE1heCwgeU1heCk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGNvb3JkcyBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0LCAuLi5dIGZyb20gcGl4ZWwgdW5pdHMgdG8gZGF0YSB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBhcnJQaXhlbCBBbiBhcnJheSBvZiBjb29yZHMgKHBpeGVsIHVuaXRzKS5cclxuICpcclxuICogQHJldHVybiB7bnVtYmVyW119IEFuIGFycmF5IG9mIGNvb3JkcyAoZGF0YSB1bml0cykuXHJcbiAqL1xyXG5DYXJ0ZXNpYW5Db29yZHMucHJvdG90eXBlLmdldERhdGFBcnJheSA9IGZ1bmN0aW9uIChhcnJQaXhlbClcclxue1xyXG4gICAgdmFyIG1lID0gdGhpcztcclxuICAgIHZhciBhcnJEYXRhID0gYXJyUGl4ZWwubWFwKGZ1bmN0aW9uKG51bSAsIGluZGV4KVxyXG4gICAge1xyXG4gICAgICAgIGlmIChpbmRleCAlIDIpICByZXR1cm4gbWUuZ2V0RGF0YVkobnVtKTtcclxuICAgICAgICBlbHNlICAgICAgICAgICAgcmV0dXJuIG1lLmdldERhdGFYKG51bSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBhcnJEYXRhO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhbiB4IGNvb3JkIGZyb20gcGl4ZWwgdW5pdHMgdG8gZGF0YSB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcGl4ZWxYIEFuIHggY29vcmQgKHBpeGVsIHVuaXRzKS5cclxuICpcclxuICogQHJldHVybiB7bnVtYmVyfSBBbiB4IGNvb3JkIChkYXRhIHVuaXRzKS5cclxuICovXHJcbkNhcnRlc2lhbkNvb3Jkcy5wcm90b3R5cGUuZ2V0RGF0YVggPSBmdW5jdGlvbiAocGl4ZWxYKVxyXG57XHJcbiAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgaWYgKCF1dGlsLmlzTnVtYmVyKHBpeGVsWCkpIHRocm93IG5ldyBFcnJvcignQ2FydGVzaWFuQ29vcmRzLmdldERhdGFYKHBpeGVsWCk6IHBpeGVsWCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICB2YXIgcHggPSBwaXhlbFggLSB0aGlzLl92aWV3UG9ydC54KCk7XHJcbiAgICB2YXIgZGF0YVggPSB0aGlzLl92aWV3Qm94LnhNaW4oKSArIHRoaXMuZ2V0RGF0YURpbWVuc2lvblgocHgpO1xyXG4gICAgcmV0dXJuIGRhdGFYO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhIHkgY29vcmQgZnJvbSBwaXhlbCB1bml0cyB0byBkYXRhIHVuaXRzLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwaXhlbFkgQSB5IGNvb3JkIChwaXhlbCB1bml0cykuXHJcbiAqXHJcbiAqIEByZXR1cm4ge251bWJlcn0gQSB5IGNvb3JkIChkYXRhIHVuaXRzKS5cclxuICovXHJcbkNhcnRlc2lhbkNvb3Jkcy5wcm90b3R5cGUuZ2V0RGF0YVkgPSBmdW5jdGlvbiAocGl4ZWxZKVxyXG57XHJcbiAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgaWYgKCF1dGlsLmlzTnVtYmVyKHBpeGVsWSkpIHRocm93IG5ldyBFcnJvcignQ2FydGVzaWFuQ29vcmRzLmdldERhdGFZKHBpeGVsWSk6IHBpeGVsWSBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICB2YXIgcHkgPSBwaXhlbFkgLSB0aGlzLl92aWV3UG9ydC55KCk7XHJcbiAgICB2YXIgZGF0YVkgPSB0aGlzLl92aWV3Qm94LnlNaW4oKSArIHRoaXMuZ2V0RGF0YURpbWVuc2lvblkodGhpcy5fdmlld1BvcnQuaGVpZ2h0KCkgLSBweSk7XHJcbiAgICByZXR1cm4gZGF0YVk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGFuIHggZGltZW5zaW9uIGZyb20gcGl4ZWwgdW5pdHMgdG8gZGF0YSB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcGl4ZWxEaW1lbnNpb25YIEFuIHggZGltZW5zaW9uIChwaXhlbCB1bml0cykuXHJcbiAqXHJcbiAqIEByZXR1cm4ge251bWJlcn0gQW4geCBkaW1lbnNpb24gKGRhdGEgdW5pdHMpLlxyXG4gKi9cclxuQ2FydGVzaWFuQ29vcmRzLnByb3RvdHlwZS5nZXREYXRhRGltZW5zaW9uWCA9IGZ1bmN0aW9uIChwaXhlbERpbWVuc2lvblgpXHJcbntcclxuICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICBpZiAoIXV0aWwuaXNOdW1iZXIocGl4ZWxEaW1lbnNpb25YKSkgdGhyb3cgbmV3IEVycm9yKCdDYXJ0ZXNpYW5Db29yZHMuZ2V0RGF0YURpbWVuc2lvblgocGl4ZWxEaW1lbnNpb25YKTogcGl4ZWxEaW1lbnNpb25YIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgIGlmIChwaXhlbERpbWVuc2lvblggPT09IDApIHJldHVybiAwO1xyXG4gICAgdmFyIGRhdGFEaW1lbnNpb25YID0gKHBpeGVsRGltZW5zaW9uWCAvIHRoaXMuX3ZpZXdQb3J0LndpZHRoKCkpICogdGhpcy5fdmlld0JveC53aWR0aCgpO1xyXG4gICAgcmV0dXJuIGRhdGFEaW1lbnNpb25YO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhIHkgZGltZW5zaW9uIGZyb20gcGl4ZWwgdW5pdHMgdG8gZGF0YSB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcGl4ZWxEaW1lbnNpb25ZIEEgeSBkaW1lbnNpb24gKHBpeGVsIHVuaXRzKS5cclxuICpcclxuICogQHJldHVybiB7bnVtYmVyfSBBIHkgZGltZW5zaW9uIChkYXRhIHVuaXRzKS5cclxuICovXHJcbkNhcnRlc2lhbkNvb3Jkcy5wcm90b3R5cGUuZ2V0RGF0YURpbWVuc2lvblkgPSBmdW5jdGlvbiAocGl4ZWxEaW1lbnNpb25ZKVxyXG57XHJcbiAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgaWYgKCF1dGlsLmlzTnVtYmVyKHBpeGVsRGltZW5zaW9uWSkpIHRocm93IG5ldyBFcnJvcignQ2FydGVzaWFuQ29vcmRzLmdldERhdGFEaW1lbnNpb25ZKHBpeGVsRGltZW5zaW9uWSk6IHBpeGVsRGltZW5zaW9uWSBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICBpZiAocGl4ZWxEaW1lbnNpb25ZID09PSAwKSByZXR1cm4gMDtcclxuICAgIHZhciBkYXRhRGltZW5zaW9uWSA9IChwaXhlbERpbWVuc2lvblkgLyB0aGlzLl92aWV3UG9ydC5oZWlnaHQoKSkgKiB0aGlzLl92aWV3Qm94LmhlaWdodCgpO1xyXG4gICAgcmV0dXJuIGRhdGFEaW1lbnNpb25ZO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBBZGp1c3RzIGEgYm91bmRpbmcgYm94IHRvIGZpdCBhIHJlY3RhbmdsZSBpbiBvcmRlciB0byBtYWludGFpbiB0aGUgYXNwZWN0IHJhdGlvLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwcml2YXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7Vmlld0JveH0gdmlld0JveCBBIGJvdW5kaW5nIGJveC5cclxuICpcclxuICogQHBhcmFtIHtSZWN0YW5nbGV9IHJlY3QgQSByZWN0YW5nbGUuXHJcbiAqL1xyXG5DYXJ0ZXNpYW5Db29yZHMucHJvdG90eXBlLmZpdFZpZXdCb3hUb1ZpZXdQb3J0ID0gZnVuY3Rpb24gKHZpZXdCb3gsIHJlY3QpXHJcbntcclxuICAgIHZhciBzeSA9IHZpZXdCb3guaGVpZ2h0KCkgLyByZWN0LmhlaWdodCgpO1xyXG4gICAgdmFyIHN4ID0gdmlld0JveC5oZWlnaHQoKSAvIHJlY3Qud2lkdGgoKTtcclxuXHJcbiAgICB2YXIgc0JCb3hYLCBzQkJveFksIHNCQm94Vywgc0JCb3hIOyBcclxuXHJcbiAgICBpZiAoc3kgPiBzeClcclxuICAgIHtcclxuICAgICAgICBzQkJveFkgPSB2aWV3Qm94LnlNaW4oKTtcclxuICAgICAgICBzQkJveEggPSB2aWV3Qm94LmhlaWdodCgpO1xyXG4gICAgICAgIHNCQm94VyA9IChyZWN0LndpZHRoKCkgLyByZWN0LmhlaWdodCgpKSAqIHNCQm94SDtcclxuICAgICAgICBzQkJveFggPSB2aWV3Qm94LnhNaW4oKSAtICgoc0JCb3hXIC0gdmlld0JveC53aWR0aCgpKSAvIDIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoc3ggPiBzeSlcclxuICAgIHtcclxuICAgICAgICBzQkJveFggPSB2aWV3Qm94LnhNaW4oKTtcclxuICAgICAgICBzQkJveFcgPSB2aWV3Qm94LndpZHRoKCk7XHJcbiAgICAgICAgc0JCb3hIID0gKHJlY3QuaGVpZ2h0KCkgLyByZWN0LndpZHRoKCkpICogc0JCb3hXO1xyXG4gICAgICAgIHNCQm94WSA9IHZpZXdCb3gueU1pbigpIC0gKChzQkJveEggLSB2aWV3Qm94LmhlaWdodCgpKSAvIDIpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHNCQm94WCA9IHZpZXdCb3gueE1pbigpO1xyXG4gICAgICAgIHNCQm94WSA9IHZpZXdCb3gueU1pbigpO1xyXG4gICAgICAgIHNCQm94VyA9IHZpZXdCb3gud2lkdGgoKTtcclxuICAgICAgICBzQkJveEggPSB2aWV3Qm94LmhlaWdodCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZpZXdCb3gueE1pbihzQkJveFgpLnlNaW4oc0JCb3hZKS53aWR0aChzQkJveFcpLmhlaWdodChzQkJveEgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJ0ZXNpYW5Db29yZHM7IiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuLyogZ2xvYmFscyBERUJVRyAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQGZpbGVvdmVydmlldyAgICBFeHBvcnRzIHRoZSB7QGxpbmsgUG9pbnR9IGNsYXNzLlxyXG4gKiBAYXV0aG9yICAgICAgICAgIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0ICAgICAgIEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlICAgICAgICAgIGdlb20vUG9pbnQgXHJcbiAqIEByZXF1aXJlcyAgICAgICAgdXRpbHMvdXRpbFxyXG4gKi9cclxuXHJcbi8vIFJlcXVpcmVkIG1vZHVsZXMuXHJcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbCcpO1xyXG5cclxuLyoqIFxyXG4gKiBAY2xhc3NkZXNjIEEgUG9pbnQgZGVmaW5lZCBieSBpdHMgPGNvZGU+eDwvY29kZT4gYW5kIDxjb2RlPnk8L2NvZGU+IFxyXG4gKiBcclxuICogQGNsYXNzXHJcbiAqIEBhbGlhcyBQb2ludFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeCA9IDBdIFRoZSB4IGNvb3JkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3kgPSAwXSBUaGUgeSBjb29yZC5cclxuICovXHJcbmZ1bmN0aW9uIFBvaW50ICh4LCB5KVxyXG57XHJcbiAgICAvLyBQcml2YXRlIGluc3RhbmNlIG1lbWJlcnMuXHJcbiAgICB0aGlzLl94ID0gbnVsbDsgLy8gVGhlIHggY29vcmQuXHJcbiAgICB0aGlzLl95ID0gbnVsbDsgLy8gVGhlIHkgY29vcmQuXHJcblxyXG4gICAgeCA9IHggIT09IHVuZGVmaW5lZCA/IHggOiAwO1xyXG4gICAgeSA9IHkgIT09IHVuZGVmaW5lZCA/IHkgOiAwO1xyXG4gICAgdGhpcy5zZXRDb29yZHMoeCwgeSk7XHJcbn1cclxuXHJcbi8qKiBcclxuICogU2V0IHRoZSBjb29yZGluYXRlcy5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeF0gVGhlIHggY29vcmQuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeV0gVGhlIHkgY29vcmQuXHJcbiAqXHJcbiAqIEByZXR1cm4ge1BvaW50fSAgICAgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5Qb2ludC5wcm90b3R5cGUuc2V0Q29vcmRzID0gZnVuY3Rpb24gKHgsIHkpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB0aGlzLngoeCk7XHJcbiAgICAgICAgaWYgKHkgIT09IHVuZGVmaW5lZCkgdGhpcy55KHkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIHggY29vcmQgb2YgdGhlIGxlZnQgZWRnZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29vcmRdIFRoZSBjb29yZGluYXRlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8UG9pbnR9IFRoZSBjb29yZGluYXRlIGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS54ID0gZnVuY3Rpb24gKGNvb3JkKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIXV0aWwuaXNOdW1iZXIoY29vcmQpKSB0aHJvdyBuZXcgRXJyb3IoJ1BvaW50LngoY29vcmQpOiBjb29yZCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3ggPSBjb29yZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX3g7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIHkgY29vcmQgb2YgdGhlIHRvcCBlZGdlLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFtjb29yZF0gVGhlIGNvb3JkaW5hdGUuXHJcbiAqXHJcbiAqIEByZXR1cm4ge251bWJlcnxQb2ludH0gVGhlIGNvb3JkaW5hdGUgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLnkgPSBmdW5jdGlvbiAoY29vcmQpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghdXRpbC5pc051bWJlcihjb29yZCkpIHRocm93IG5ldyBFcnJvcignUG9pbnQueShjb29yZCk6IGNvb3JkIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5feSA9IGNvb3JkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5feTtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJucyBhIGNsb25lIG9mIHRoaXMgUG9pbnQuICAgICAgICBcclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gVGhlIFBvaW50LiAgIFxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLl94LCB0aGlzLl95KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7IiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuLyogZ2xvYmFscyBERUJVRyAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQGZpbGVvdmVydmlldyAgICBFeHBvcnRzIHRoZSB7QGxpbmsgUG9sYXJDb29yZHN9IGNsYXNzLlxyXG4gKiBAYXV0aG9yICAgICAgICAgIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0ICAgICAgIEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlICAgICAgICAgIGdlb20vUG9sYXJDb29yZHMgXHJcbiAqL1xyXG5cclxuLy8gUmVxdWlyZWQgbW9kdWxlcy5cclxuXHJcbi8qKiBcclxuICogQGNsYXNzZGVzYyBNYXBzIGEgZGF0YSBzcGFjZSB0byBhIHBpeGVsIHNwYWNlIGFuZCB2aWNlIHZlcnNhLlxyXG4gKlxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIFBvbGFyQ29vcmRzXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgW29wdGlvbnNdIFRoZSBvcHRpb25zLlxyXG4gKi9cclxuZnVuY3Rpb24gUG9sYXJDb29yZHMgKClcclxue1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQb2xhckNvb3JkczsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4vKiBnbG9iYWxzIERFQlVHICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IEV4cG9ydHMgdGhlIHtAbGluayBSZWN0YW5nbGV9IGNsYXNzLlxyXG4gKiBAYXV0aG9yIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0IEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlIGdlb20vUmVjdGFuZ2xlIFxyXG4gKiBAcmVxdWlyZXMgdXRpbHMvdXRpbFxyXG4gKi9cclxuXHJcbi8vIFJlcXVpcmVkIG1vZHVsZXMuXHJcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbCcpO1xyXG5cclxuLyoqIFxyXG4gKiBAY2xhc3NkZXNjIEEgcmVjdGFuZ2xlIGRlZmluZWQgYnkgaXRzIDxjb2RlPng8L2NvZGU+LCA8Y29kZT55PC9jb2RlPiBcclxuICogPGNvZGU+d2lkdGg8L2NvZGU+IGFuZCA8Y29kZT5oZWlnaHQ8L2NvZGU+LlxyXG4gKiBcclxuICogQGNsYXNzXHJcbiAqIEBhbGlhcyBSZWN0YW5nbGVcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3ggPSAwXSAgICAgICAgICBUaGUgeCBjb29yZCBvZiB0aGUgdG9wIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3kgPSAwXSAgICAgICAgICBUaGUgeSBjb29yZCBvZiB0aGUgdG9wIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3dpZHRoID0gMTAwXSAgICBUaGUgd2lkdGguXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaGVpZ2h0ID0gMTAwXSAgIFRoZSBoZWlnaHQuXHJcbiAqL1xyXG5mdW5jdGlvbiBSZWN0YW5nbGUgKHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbntcclxuICAgIC8vIFByaXZhdGUgaW5zdGFuY2UgbWVtYmVycy5cclxuICAgIHRoaXMuX3ggPSBudWxsOyAvLyBUaGUgeCBjb29yZCBvZiB0aGUgdG9wIGxlZnQgY29ybmVyLlxyXG4gICAgdGhpcy5feSA9IG51bGw7IC8vIFRoZSB5IGNvb3JkIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAgICB0aGlzLl93ID0gbnVsbDsgLy8gVGhlIHdpZHRoLlxyXG4gICAgdGhpcy5faCA9IG51bGw7IC8vIFRoZSBoZWlnaHQuXHJcblxyXG4gICAgeCA9IHggIT09IHVuZGVmaW5lZCA/IHggOiAwO1xyXG4gICAgeSA9IHkgIT09IHVuZGVmaW5lZCA/IHkgOiAwO1xyXG4gICAgd2lkdGggPSB3aWR0aCAhPT0gdW5kZWZpbmVkID8gd2lkdGggOiAxMDA7XHJcbiAgICBoZWlnaHQgPSBoZWlnaHQgIT09IHVuZGVmaW5lZCA/IGhlaWdodCA6IDEwMDtcclxuICAgIHRoaXMuc2V0RGltZW5zaW9ucyh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxufVxyXG5cclxuLyoqIFxyXG4gKiBTZXQgdGhlIGRpbWVuc2lvbnMuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hdIFRoZSB4IGNvb3JkIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeV0gVGhlIHkgY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt3XSBUaGUgd2lkdGguXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaF0gVGhlIGhlaWdodC5cclxuICpcclxuICogQHJldHVybiB7UmVjdGFuZ2xlfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblJlY3RhbmdsZS5wcm90b3R5cGUuc2V0RGltZW5zaW9ucyA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkgdGhpcy54KHgpO1xyXG4gICAgICAgIGlmICh5ICE9PSB1bmRlZmluZWQpIHRoaXMueSh5KTtcclxuICAgICAgICBpZiAodyAhPT0gdW5kZWZpbmVkKSB0aGlzLndpZHRoKHcpO1xyXG4gICAgICAgIGlmIChoICE9PSB1bmRlZmluZWQpIHRoaXMuaGVpZ2h0KGgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIHggY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29vcmRdIFRoZSBjb29yZGluYXRlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8UmVjdGFuZ2xlfSBUaGUgY29vcmRpbmF0ZSBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5SZWN0YW5nbGUucHJvdG90eXBlLnggPSBmdW5jdGlvbiAoY29vcmQpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghdXRpbC5pc051bWJlcihjb29yZCkpIHRocm93IG5ldyBFcnJvcignUmVjdGFuZ2xlLngoY29vcmQpOiBjb29yZCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3ggPSBjb29yZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX3g7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIHkgY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29vcmRdIFRoZSBjb29yZGluYXRlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8UmVjdGFuZ2xlfSBUaGUgY29vcmRpbmF0ZSBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5SZWN0YW5nbGUucHJvdG90eXBlLnkgPSBmdW5jdGlvbiAoY29vcmQpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghdXRpbC5pc051bWJlcihjb29yZCkpIHRocm93IG5ldyBFcnJvcignUmVjdGFuZ2xlLnkoY29vcmQpOiBjb29yZCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3kgPSBjb29yZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX3k7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIHdpZHRoLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFt3XSBUaGUgd2lkdGguXHJcbiAqXHJcbiAqIEByZXR1cm4ge251bWJlcnxSZWN0YW5nbGV9IFRoZSB3aWR0aCBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5SZWN0YW5nbGUucHJvdG90eXBlLndpZHRoID0gZnVuY3Rpb24gKHcpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghdXRpbC5pc051bWJlcih3KSkgIHRocm93IG5ldyBFcnJvcignUmVjdGFuZ2xlLndpZHRoKHcpOiB3IG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgaWYgKHcgPCAwKSAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWN0YW5nbGUud2lkdGgodyk6IHcgbXVzdCBiZSA+PSAwLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3cgPSB3O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5fdztcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0IG9yIHNldCB0aGUgaGVpZ2h0LlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFtoXSBUaGUgaGVpZ2h0LlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8UmVjdGFuZ2xlfSBUaGUgaGVpZ2h0IGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblJlY3RhbmdsZS5wcm90b3R5cGUuaGVpZ2h0ID0gZnVuY3Rpb24gKGgpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghdXRpbC5pc051bWJlcihoKSkgIHRocm93IG5ldyBFcnJvcignUmVjdGFuZ2xlLmhlaWdodChoKTogaCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIGlmIChoIDwgMCkgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVjdGFuZ2xlLmhlaWdodChoKTogaCBtdXN0IGJlID49IDAuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5faCA9IGg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl9oO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBSZXR1cm5zIGEgY2xvbmUgb2YgdGhpcyByZWN0YW5nbGUuICAgICAgICBcclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtSZWN0YW5nbGV9IFRoZSByZWN0YW5nbGUuICAgXHJcbiAqL1xyXG5SZWN0YW5nbGUucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy5feCwgdGhpcy5feSwgdGhpcy5fdywgdGhpcy5faCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlY3RhbmdsZTsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4vKiBnbG9iYWxzIERFQlVHICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3ICAgIEV4cG9ydHMgdGhlIHtAbGluayBWaWV3Qm94fSBjbGFzcy5cclxuICogQGF1dGhvciAgICAgICAgICBKb25hdGhhbiBDbGFyZSBcclxuICogQGNvcHlyaWdodCAgICAgICBGbG93aW5nQ2hhcnRzIDIwMTVcclxuICogQG1vZHVsZSAgICAgICAgICBnZW9tL1ZpZXdCb3ggXHJcbiAqIEByZXF1aXJlcyAgICAgICAgdXRpbHMvdXRpbFxyXG4gKi9cclxuXHJcbi8vIFJlcXVpcmVkIG1vZHVsZXMuXHJcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbCcpO1xyXG5cclxuLyoqIFxyXG4gKiBAY2xhc3NkZXNjIEFuIGFyZWEgZGVmaW5lZCBieSBpdHMgcG9zaXRpb24sIGFzIGluZGljYXRlZCBcclxuICogYnkgaXRzIGJvdHRvbS1sZWZ0IGNvcm5lciBwb2ludCAoPGNvZGU+eE1pbjwvY29kZT4sIDxjb2RlPnlNaW48L2NvZGU+KSBcclxuICogYW5kIHRvcC1yaWdodCBjb3JuZXIgcG9pbnQgKDxjb2RlPnhNYXg8L2NvZGU+LCA8Y29kZT55TWF4PC9jb2RlPikuXHJcbiAqIFxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIFZpZXdCb3hcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hNaW4gPSAwXSAgIFRoZSB4IGNvb3JkIG9mIHRoZSBib3R0b20gbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeU1pbiA9IDBdICAgVGhlIHkgY29vcmQgb2YgdGhlIGJvdHRvbSBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt4TWF4ID0gMTAwXSBUaGUgeCBjb29yZCBvZiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt5TWF4ID0gMTAwXSBUaGUgeSBjb29yZCBvZiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICovXHJcbmZ1bmN0aW9uIFZpZXdCb3ggKHhNaW4sIHlNaW4sIHhNYXgsIHlNYXgpXHJcbntcclxuICAgIC8vIFByaXZhdGUgaW5zdGFuY2UgbWVtYmVycy5cclxuICAgIHRoaXMuX3hNaW4gICAgICA9IG51bGw7IC8vIFRoZSB4IGNvb3JkIG9mIHRoZSBib3R0b20gbGVmdCBjb3JuZXIuXHJcbiAgICB0aGlzLl94TWF4ICAgICAgPSBudWxsOyAvLyBUaGUgeCBjb29yZCBvZiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICAgIHRoaXMuX3hDZW50ZXIgICA9IG51bGw7IC8vIFRoZSB4IGNvb3JkIG9mIHRoZSBjZW50ZXIuXHJcbiAgICB0aGlzLl93aWR0aCAgICAgPSBudWxsOyAvLyBUaGUgd2lkdGguXHJcbiAgICB0aGlzLl95TWluICAgICAgPSBudWxsOyAvLyBUaGUgeSBjb29yZCBvZiB0aGUgYm90dG9tIGxlZnQgY29ybmVyLlxyXG4gICAgdGhpcy5feU1heCAgICAgID0gbnVsbDsgLy8gVGhlIHkgY29vcmQgb2YgdGhlIHRvcCByaWdodCBjb3JuZXIuXHJcbiAgICB0aGlzLl95Q2VudGVyICAgPSBudWxsOyAvLyBUaGUgeSBjb29yZCBvZiB0aGUgY2VudGVyLlxyXG4gICAgdGhpcy5faGVpZ2h0ICAgID0gbnVsbDsgLy8gVGhlIGhlaWdodC5cclxuXHJcbiAgICB4TWluID0geE1pbiAhPT0gdW5kZWZpbmVkID8geE1pbiA6IDA7XHJcbiAgICB5TWluID0geU1pbiAhPT0gdW5kZWZpbmVkID8geU1pbiA6IDA7XHJcbiAgICB4TWF4ID0geE1heCAhPT0gdW5kZWZpbmVkID8geE1heCA6IDEwMDtcclxuICAgIHlNYXggPSB5TWF4ICE9PSB1bmRlZmluZWQgPyB5TWF4IDogMTAwO1xyXG4gICAgdGhpcy5zZXRDb29yZHMoeE1pbiwgeU1pbiwgeE1heCwgeU1heCk7XHJcbn1cclxuXHJcbi8qKiBcclxuICogU2V0IHRoZSBkaW1lbnNpb25zLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFt4TWluXSBUaGUgeCBjb29yZCBvZiB0aGUgYm90dG9tIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3lNaW5dIFRoZSB5IGNvb3JkIG9mIHRoZSBib3R0b20gbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeE1heF0gVGhlIHggY29vcmQgb2YgdGhlIHRvcCByaWdodCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeU1heF0gVGhlIHkgY29vcmQgb2YgdGhlIHRvcCByaWdodCBjb3JuZXIuXHJcbiAqXHJcbiAqIEByZXR1cm4ge1ZpZXdCb3h9ICAgICAgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5WaWV3Qm94LnByb3RvdHlwZS5zZXRDb29yZHMgPSBmdW5jdGlvbiAoeE1pbiwgeU1pbiwgeE1heCwgeU1heClcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh4TWluICE9PSB1bmRlZmluZWQpIHRoaXMueE1pbih4TWluKTtcclxuICAgICAgICBpZiAoeU1pbiAhPT0gdW5kZWZpbmVkKSB0aGlzLnlNaW4oeU1pbik7XHJcbiAgICAgICAgaWYgKHhNYXggIT09IHVuZGVmaW5lZCkgdGhpcy54TWF4KHhNYXgpO1xyXG4gICAgICAgIGlmICh5TWF4ICE9PSB1bmRlZmluZWQpIHRoaXMueU1heCh5TWF4KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB4IGNvb3JkIG9mIHRoZSBib3R0b20gbGVmdCBjb3JuZXIuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hdIFRoZSBjb29yZGluYXRlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8Vmlld0JveH0gVGhlIGNvb3JkaW5hdGUgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUueE1pbiA9IGZ1bmN0aW9uICh4KVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIXV0aWwuaXNOdW1iZXIoeCkpIHRocm93IG5ldyBFcnJvcignVmlld0JveC54TWluKHgpOiB4IG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5feE1pbiA9IHg7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSBNYXRoLmFicyh0aGlzLl94TWF4IC0gdGhpcy5feE1pbik7XHJcbiAgICAgICAgdGhpcy5feENlbnRlciA9IHRoaXMuX3hNaW4gKyAodGhpcy5fd2lkdGggLyAyKTsgXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl94TWluO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB4IGNvb3JkIG9mIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFt4XSBUaGUgY29vcmRpbmF0ZS5cclxuICpcclxuICogQHJldHVybiB7bnVtYmVyfFZpZXdCb3h9IFRoZSBjb29yZGluYXRlIGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblZpZXdCb3gucHJvdG90eXBlLnhNYXggPSBmdW5jdGlvbiAoeClcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCF1dGlsLmlzTnVtYmVyKHgpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3gueE1heCh4KTogeCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3hNYXggPSB4O1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gTWF0aC5hYnModGhpcy5feE1heCAtIHRoaXMuX3hNaW4pO1xyXG4gICAgICAgIHRoaXMuX3hDZW50ZXIgPSB0aGlzLl94TWluICsgKHRoaXMuX3dpZHRoIC8gMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl94TWF4O1xyXG59O1xyXG5cclxuXHJcbi8qKiBcclxuICogR2V0IG9yIHNldCB0aGUgeCBjb29yZCBvZiB0aGUgY2VudGVyLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFt4XSBUaGUgY29vcmRpbmF0ZS5cclxuICpcclxuICogQHJldHVybiB7bnVtYmVyfFZpZXdCb3h9IFRoZSBjb29yZGluYXRlIGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblZpZXdCb3gucHJvdG90eXBlLnhDZW50ZXIgPSBmdW5jdGlvbiAoeClcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCF1dGlsLmlzTnVtYmVyKHgpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3gueENlbnRlcih4KTogeCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3hDZW50ZXIgPSB4O1xyXG4gICAgICAgIHRoaXMuX3hNaW4gID0gdGhpcy5feENlbnRlciAtICh0aGlzLl93aWR0aCAvIDIpO1xyXG4gICAgICAgIHRoaXMuX3hNYXggID0gdGhpcy5feENlbnRlciArICh0aGlzLl93aWR0aCAvIDIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5feENlbnRlcjtcclxufTtcclxuXHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIHdpZHRoLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFt3XSBUaGUgd2lkdGguXHJcbiAqXHJcbiAqIEByZXR1cm4ge251bWJlcnxWaWV3Qm94fSBUaGUgd2lkdGggaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUud2lkdGggPSBmdW5jdGlvbiAodylcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCF1dGlsLmlzTnVtYmVyKHcpKSAgdGhyb3cgbmV3IEVycm9yKCdWaWV3Qm94LndpZHRoKHcpOiB3IG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgaWYgKHcgPCAwKSAgICAgICAgIHRocm93IG5ldyBFcnJvcignVmlld0JveC53aWR0aCh3KTogdyBtdXN0IGJlID49IDAuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB3O1xyXG4gICAgICAgIHRoaXMuX3hNYXggPSB0aGlzLl94TWluICsgdGhpcy5fd2lkdGg7XHJcbiAgICAgICAgdGhpcy5feENlbnRlciA9IHRoaXMuX3hNaW4gKyAodGhpcy5fd2lkdGggLyAyKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB5IGNvb3JkIG9mIHRoZSBib3R0b20gbGVmdCBjb3JuZXIuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3ldIFRoZSBjb29yZGluYXRlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8Vmlld0JveH0gVGhlIGNvb3JkaW5hdGUgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUueU1pbiA9IGZ1bmN0aW9uICh5KVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIXV0aWwuaXNOdW1iZXIoeSkpIHRocm93IG5ldyBFcnJvcignVmlld0JveC55TWluKHkpOiB5IG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5feU1pbiA9IHk7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gTWF0aC5hYnModGhpcy5feU1heCAtIHRoaXMuX3lNaW4pO1xyXG4gICAgICAgIHRoaXMuX3lDZW50ZXIgPSB0aGlzLl95TWluICsgKHRoaXMuX2hlaWdodCAvIDIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5feU1pbjtcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0IG9yIHNldCB0aGUgeSBjb29yZCBvZiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeV0gVGhlIGNvb3JkaW5hdGUuXHJcbiAqXHJcbiAqIEByZXR1cm4ge251bWJlcnxWaWV3Qm94fSBUaGUgY29vcmRpbmF0ZSBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5WaWV3Qm94LnByb3RvdHlwZS55TWF4ID0gZnVuY3Rpb24gKHkpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghdXRpbC5pc051bWJlcih5KSkgdGhyb3cgbmV3IEVycm9yKCdWaWV3Qm94LnlNYXgoeSk6IHkgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgICAgICB0aGlzLl95TWF4ID0geTtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBNYXRoLmFicyh0aGlzLl95TWF4IC0gdGhpcy5feU1pbik7XHJcbiAgICAgICAgdGhpcy5feUNlbnRlciA9IHRoaXMuX3lNaW4gKyAodGhpcy5faGVpZ2h0IC8gMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl95TWF4O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB5IGNvb3JkIG9mIHRoZSBjZW50ZXIuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3ldIFRoZSBjb29yZGluYXRlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8Vmlld0JveH0gVGhlIGNvb3JkaW5hdGUgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUueUNlbnRlciA9IGZ1bmN0aW9uICh5KVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIXV0aWwuaXNOdW1iZXIoeSkpIHRocm93IG5ldyBFcnJvcignVmlld0JveC55Q2VudGVyKHkpOiB5IG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5feUNlbnRlciA9IHk7XHJcbiAgICAgICAgdGhpcy5feU1pbiAgPSB0aGlzLl95Q2VudGVyIC0gKHRoaXMuX2hlaWdodCAvIDIpO1xyXG4gICAgICAgIHRoaXMuX3lNYXggID0gdGhpcy5feUNlbnRlciArICh0aGlzLl9oZWlnaHQgLyAyKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX3lDZW50ZXI7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIGhlaWdodC5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaF0gVGhlIGhlaWdodC5cclxuICpcclxuICogQHJldHVybiB7bnVtYmVyfFZpZXdCb3h9IFRoZSBoZWlnaHQgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUuaGVpZ2h0ID0gZnVuY3Rpb24gKGgpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghdXRpbC5pc051bWJlcihoKSkgdGhyb3cgbmV3IEVycm9yKCdWaWV3Qm94LmhlaWdodChoKTogaCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIGlmIChoIDwgMCkgICAgICAgIHRocm93IG5ldyBFcnJvcignVmlld0JveC5oZWlnaHQoaCk6IGggbXVzdCBiZSA+PSAwLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGg7XHJcbiAgICAgICAgdGhpcy5feU1heCA9IHRoaXMuX3lNaW4gKyB0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5feUNlbnRlciA9IHRoaXMuX3lNaW4gKyAodGhpcy5faGVpZ2h0IC8gMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJldHVybnMgYSBjbG9uZSBvZiB0aGlzIFZpZXdCb3guICAgICAgICBcclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtWaWV3Qm94fSBUaGUgVmlld0JveC4gICBcclxuICovXHJcblZpZXdCb3gucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBWaWV3Qm94KHRoaXMuX3hNaW4sIHRoaXMuX3lNaW4sIHRoaXMuX3hNYXgsIHRoaXMuX3lNYXgpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBWaWV3Qm94IGVxdWFscyB0byB0aGlzIG9uZS5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge1ZpZXdCb3h9IHZiIFRoZSBWaWV3Qm94LlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLCBpZiB0aGUgVmlld0JveCBpcyBlcXVhbCB0byB0aGlzIG9uZSwgb3RoZXJ3aXNlIGZhbHNlLlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKHZiKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoISh2YiBpbnN0YW5jZW9mIFZpZXdCb3gpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3guZXF1YWxzKHZiKTogdmIgbXVzdCBiZSBhIFZpZXdCb3guJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKHZiLmdldFhNaW4oKSAhPT0gdGhpcy5feE1pbikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh2Yi5nZXRZTWluKCkgIT09IHRoaXMuX3lNaW4pIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodmIuZ2V0WE1heCgpICE9PSB0aGlzLl94TWF4KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHZiLmdldFlNYXgoKSAhPT0gdGhpcy5feU1heCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3guZXF1YWxzKHZiKTogdmIgaGFzIG5vdCBiZWVuIGRlZmluZWQuJyk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiBhIFZpZXdCb3ggaW50ZXJzZWN0cyB0aGlzIG9uZS5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge1ZpZXdCb3h9IHZiIFRoZSBWaWV3Qm94LlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLCBpZiB0aGUgVmlld0JveCBpbnRlcmNlcHRzIHRoaXMgb25lLCBvdGhlcndpc2UgZmFsc2UuXHJcbiAqL1xyXG5WaWV3Qm94LnByb3RvdHlwZS5pbnRlcnNlY3RzID0gZnVuY3Rpb24gKHZiKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoISh2YiBpbnN0YW5jZW9mIFZpZXdCb3gpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3guaW50ZXJzZWN0cyh2Yik6IHZiIG11c3QgYmUgYSBWaWV3Qm94LicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICh2Yi5nZXRYTWluKCkgPiB0aGlzLl94TWF4KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHZiLmdldFhNYXgoKSA8IHRoaXMuX3hNaW4pIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodmIuZ2V0WU1pbigpID4gdGhpcy5feU1heCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh2Yi5nZXRZTWF4KCkgPCB0aGlzLl95TWluKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHRocm93IG5ldyBFcnJvcignVmlld0JveC5pbnRlcnNlY3RzKHZiKTogdmIgaGFzIG5vdCBiZWVuIGRlZmluZWQuJyk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiBhIFZpZXdCb3ggaXMgY29udGFpbmVkIHdpdGhpbiB0aGlzIG9uZS5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge1ZpZXdCb3h9IHZiIFRoZSBWaWV3Qm94LlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLCBpZiB0aGUgVmlld0JveCBpcyBjb250YWluZWQgd2l0aGluIHRoaXMgb25lLCBvdGhlcndpc2UgZmFsc2UuXHJcbiAqL1xyXG5WaWV3Qm94LnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uICh2Yilcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCEodmIgaW5zdGFuY2VvZiBWaWV3Qm94KSkgdGhyb3cgbmV3IEVycm9yKCdWaWV3Qm94LmNvbnRhaW5zKHZiKTogdmIgbXVzdCBiZSBhIFZpZXdCb3guJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKHZiLmdldFhNaW4oKSA8IHRoaXMuX3hNaW4pIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodmIuZ2V0WE1heCgpID4gdGhpcy5feE1heCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh2Yi5nZXRZTWluKCkgPCB0aGlzLl95TWluKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHZiLmdldFlNYXgoKSA+IHRoaXMuX3lNYXgpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKCdWaWV3Qm94LmNvbnRhaW5zKHZiKTogdmIgaGFzIG5vdCBiZWVuIGRlZmluZWQuJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdCb3g7IiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gR3JhYiBhbiBleGlzdGluZyBuYW1lc3BhY2Ugb2JqZWN0LCBvciBjcmVhdGUgYSBibGFuayBvYmplY3QgaWYgaXQgZG9lc24ndCBleGlzdC5cclxuLy8gQWRkIHRoZSBtb2R1bGVzLlxyXG4vLyBPbmx5IG5lZWQgdG8gcmVxdWlyZSB0aGUgdG9wLWxldmVsIG1vZHVsZXMsIGJyb3dzZXJpZnlcclxuLy8gd2lsbCB3YWxrIHRoZSBkZXBlbmRlbmN5IGdyYXBoIGFuZCBsb2FkIGV2ZXJ5dGhpbmcgY29ycmVjdGx5LlxyXG52YXIgZmxvd2luZ2NoYXJ0cyA9IHdpbmRvdy5mbG93aW5nY2hhcnRzIHx8XHJcbntcclxuICAgIGNhbnZhcyA6IHJlcXVpcmUoJy4vY2FudmFzL0NhbnZhcycpXHJcbn07XHJcblxyXG5yZXF1aXJlKCcuL3BsdWdpbnMvanF1ZXJ5cGx1Z2luJyk7XHJcblxyXG4vLyBSZXBsYWNlL0NyZWF0ZSB0aGUgZ2xvYmFsIG5hbWVzcGFjZVxyXG53aW5kb3cuZmxvd2luZ2NoYXJ0cyA9IGZsb3dpbmdjaGFydHM7IiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuLyogZ2xvYmFscyBERUJVRyAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgJCAgICAgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xyXG52YXIgQ2hhcnQgPSByZXF1aXJlKCcuLi9jaGFydHMvQ2hhcnQnKTtcclxuXHJcbmlmICgkICE9PSB1bmRlZmluZWQpXHJcbntcclxuICAgICQuZm4uZmxvd2luZ2NoYXJ0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSBcclxuICAgIHsgICBcclxuICAgICAgICBvcHRpb25zLmNoYXJ0LmNvbnRhaW5lciA9IHRoaXNbMF07XHJcbiAgICAgICAgdmFyIGNoYXJ0ID0gbmV3IENoYXJ0KG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxufSIsIi8qIGpzaGludCBicm93c2VyaWZ5OiB0cnVlICovXHJcbi8qIGdsb2JhbHMgREVCVUcgKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgICAgRXhwb3J0cyB0aGUge0BsaW5rIFNlcmllc30gY2xhc3MuXHJcbiAqIEBhdXRob3IgICAgICAgICAgSm9uYXRoYW4gQ2xhcmUgXHJcbiAqIEBjb3B5cmlnaHQgICAgICAgRmxvd2luZ0NoYXJ0cyAyMDE1XHJcbiAqIEBtb2R1bGUgICAgICAgICAgY2hhcnRzL1NlcmllcyBcclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy91dGlsXHJcbiAqL1xyXG5cclxuLy8gUmVxdWlyZWQgbW9kdWxlcy5cclxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlscy91dGlsJyk7XHJcblxyXG4vKiogXHJcbiAqIEBjbGFzc2Rlc2MgQSBiYXNlIGNsYXNzIGZvciBzZXJpZXMuXHJcbiAqXHJcbiAqIEBjbGFzc1xyXG4gKiBAYWxpYXMgU2VyaWVzXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtDYW52YXN9IFRoZSBkcmF3aW5nIGNhbnZhcy5cclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBzZXJpZXMgb3B0aW9ucy5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRhdGEgPSBbXV0gICAgICAgICAgICAgIFRoZSBkYXRhIC0gYW4gYXJyYXkgb2YgdGhlIGZvcm0gW3t4OjEwLCB5OjIwfSwge3g6MTAsIHk6MjB9LCB7eDoxMCwgeToyMH0sIC4uLl0uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5pZEZpZWxkID0gaWRdICAgICAgICAgICBUaGUgZGF0YSBwcm9wZXJ0eSB0aGF0IGNvbnRhaW5zIHRoZSBpZCB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hbWVGaWVsZCA9IG5hbWVdICAgICAgIFRoZSBkYXRhIHByb3BlcnR5IHRoYXQgY29udGFpbnMgdGhlICBuYW1lIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMueEZpZWxkID0geF0gICAgICAgICAgICAgVGhlIGRhdGEgcHJvcGVydHkgdGhhdCBjb250YWlucyB0aGUgeCB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnlGaWVsZCA9IHldICAgICAgICAgICAgIFRoZSBkYXRhIHByb3BlcnR5IHRoYXQgY29udGFpbnMgdGhlIHkgdmFsdWUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5zaXplRmllbGQgPSBzaXplXSAgICAgICBUaGUgZGF0YSBwcm9wZXJ0eSB0aGF0IGNvbnRhaW5zIHRoZSBzaXplIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY29sb3JGaWVsZCA9IGNvbG9yXSAgICAgVGhlIGRhdGEgcHJvcGVydHkgdGhhdCBjb250YWlucyB0aGUgY29sb3IgdmFsdWUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5zaGFwZUZpZWxkID0gc2hhcGVdICAgICBUaGUgZGF0YSBwcm9wZXJ0eSB0aGF0IGNvbnRhaW5zIHRoZSBzaGFwZSB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmltYWdlRmllbGQgPSBpbWFnZV0gICAgIFRoZSBkYXRhIHByb3BlcnR5IHRoYXQgY29udGFpbnMgdGhlIGltYWdlIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuc2hhcGUgPSBjaXJjbGVdICAgICAgICAgVGhlIHNoYXBlIHRvIHVzZSBmb3IgcmVuZGVyaW5nLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuaW1hZ2VdICAgICAgICAgICAgICAgICAgVGhlIGltYWdlIHRvIHVzZSBmb3IgcmVuZGVyaW5nLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubWFya2VyU2l6ZSA9IDhdICAgICAgICAgVGhlIG1hcmtlciBzaXplLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZmlsbENvbG9yID0gI2ZmZmZmZl0gICAgVGhlIGZpbGwgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5maWxsT3BhY2l0eSA9IDFdICAgICAgICBUaGUgZmlsbCBvcGFjaXR5LlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubGluZUNvbG9yID0gIzAwMDAwMF0gICAgVGhlIGxpbmUgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5saW5lV2lkdGggPSAwXSAgICAgICAgICBUaGUgbGluZSB3aWR0aC5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmxpbmVKb2luID0gcm91bmRdICAgICAgIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubGluZUNhcCA9IGJ1dHRdICAgICAgICAgVGhlIGxpbmUgY2FwLCBvbmUgb2YgXCJidXR0XCIsIFwicm91bmRcIiwgXCJzcXVhcmVcIi5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmxpbmVPcGFjaXR5ID0gMV0gICAgICAgIFRoZSBsaW5lIG9wYWNpdHkuXHJcbiAqL1xyXG5mdW5jdGlvbiBTZXJpZXMgKGNhbnZhcywgb3B0aW9ucylcclxue1xyXG4gICAgLy8gUHJpdmF0ZSBpbnN0YW5jZSBtZW1iZXJzLiAgXHJcbiAgICB0aGlzLl9pdGVtcyA9IFtdOyAvLyBUaGUgbGlzdCBvZiBpdGVtcyBiZWxvbmdpbmcgdG8gdGhlIHNlcmllcy5cclxuXHJcbiAgICAvLyBQdWJsaWMgaW5zdGFuY2UgbWVtYmVycy4gIFxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFRoZSBtaW5pbXVtIHggdmFsdWUuXHJcbiAgICAgKiBcclxuICAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgICogQHR5cGUgbnVtYmVyXHJcbiAgICAgKiBAZGVmYXVsdCAwXHJcbiAgICAgKi9cclxuICAgIHRoaXMueE1pbiA9IDA7XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogVGhlIG1heGltdW0geCB2YWx1ZS5cclxuICAgICAqIFxyXG4gICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAgKiBAdHlwZSBudW1iZXJcclxuICAgICAqIEBkZWZhdWx0IDEwMFxyXG4gICAgICovXHJcbiAgICB0aGlzLnhNYXggPSAxMDA7XHJcbiAgICBcclxuICAgIC8qKiBcclxuICAgICAqIFRoZSBtaW5pbXVtIHggdmFsdWUuXHJcbiAgICAgKiBcclxuICAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgICogQHR5cGUgbnVtYmVyXHJcbiAgICAgKiBAZGVmYXVsdCAwXHJcbiAgICAgKi9cclxuICAgIHRoaXMueU1pbiA9IDA7XHJcbiAgICBcclxuICAgIC8qKiBcclxuICAgICAqIFRoZSBtYXhpbXVtIHkgdmFsdWUuXHJcbiAgICAgKiBcclxuICAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgICogQHR5cGUgbnVtYmVyXHJcbiAgICAgKiBAZGVmYXVsdCAxMDBcclxuICAgICAqL1xyXG4gICAgdGhpcy55TWF4ID0gMTAwO1xyXG4gICAgXHJcbiAgICAvKiogXHJcbiAgICAgKiBUaGUgZHJhd2luZyBjYW52YXMuXHJcbiAgICAgKiBcclxuICAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgICogQHR5cGUgQ2FudmFzXHJcbiAgICAgKiBAZGVmYXVsdCBudWxsXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyhvcHRpb25zKTtcclxufVxyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSBvcHRpb25zIGZvciB0aGUgc2VyaWVzLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBzZXJpZXMgb3B0aW9ucy5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRhdGEgPSBbXV0gICAgICAgICAgICAgIFRoZSBkYXRhIC0gYW4gYXJyYXkgb2YgdGhlIGZvcm0gW3t4OjEwLCB5OjIwfSwge3g6MTAsIHk6MjB9LCB7eDoxMCwgeToyMH0sIC4uLl0uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5pZEZpZWxkID0gaWRdICAgICAgICAgICBUaGUgZGF0YSBwcm9wZXJ0eSB0aGF0IGNvbnRhaW5zIHRoZSBpZCB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hbWVGaWVsZCA9IG5hbWVdICAgICAgIFRoZSBkYXRhIHByb3BlcnR5IHRoYXQgY29udGFpbnMgdGhlICBuYW1lIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMueEZpZWxkID0geF0gICAgICAgICAgICAgVGhlIGRhdGEgcHJvcGVydHkgdGhhdCBjb250YWlucyB0aGUgeCB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnlGaWVsZCA9IHldICAgICAgICAgICAgIFRoZSBkYXRhIHByb3BlcnR5IHRoYXQgY29udGFpbnMgdGhlIHkgdmFsdWUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5zaXplRmllbGQgPSBzaXplXSAgICAgICBUaGUgZGF0YSBwcm9wZXJ0eSB0aGF0IGNvbnRhaW5zIHRoZSBzaXplIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY29sb3JGaWVsZCA9IGNvbG9yXSAgICAgVGhlIGRhdGEgcHJvcGVydHkgdGhhdCBjb250YWlucyB0aGUgY29sb3IgdmFsdWUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5zaGFwZUZpZWxkID0gc2hhcGVdICAgICBUaGUgZGF0YSBwcm9wZXJ0eSB0aGF0IGNvbnRhaW5zIHRoZSBzaGFwZSB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmltYWdlRmllbGQgPSBpbWFnZV0gICAgIFRoZSBkYXRhIHByb3BlcnR5IHRoYXQgY29udGFpbnMgdGhlIGltYWdlIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuc2hhcGUgPSBjaXJjbGVdICAgICAgICAgVGhlIHNoYXBlIHRvIHVzZSBmb3IgcmVuZGVyaW5nLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuaW1hZ2UgPSBdICAgICAgICAgICAgICAgVGhlIGltYWdlIHRvIHVzZSBmb3IgcmVuZGVyaW5nLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubWFya2VyU2l6ZSA9IDhdICAgICAgICAgVGhlIG1hcmtlciBzaXplLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZmlsbENvbG9yXSAgICAgICAgICAgICAgVGhlIGZpbGwgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5maWxsT3BhY2l0eSA9IDFdICAgICAgICBUaGUgZmlsbCBvcGFjaXR5LlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubGluZUNvbG9yXSAgICAgICAgICAgICAgVGhlIGxpbmUgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5saW5lV2lkdGggPSAxXSAgICAgICAgICBUaGUgbGluZSB3aWR0aC5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmxpbmVKb2luID0gcm91bmRdICAgICAgIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubGluZUNhcCA9IGJ1dHRdICAgICAgICAgVGhlIGxpbmUgY2FwLCBvbmUgb2YgXCJidXR0XCIsIFwicm91bmRcIiwgXCJzcXVhcmVcIi5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmxpbmVPcGFjaXR5ID0gMV0gICAgICAgIFRoZSBsaW5lIG9wYWNpdHkuXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdHxTZXJpZXN9ICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgb3B0aW9ucyBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5TZXJpZXMucHJvdG90eXBlLm9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IC8vIERlZmF1bHQgb3B0aW9ucy5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgIGlkRmllbGQgICAgIDogJ2lkJyxcclxuICAgICAgICAgICAgbmFtZUZpZWxkICAgOiAnbmFtZScsXHJcbiAgICAgICAgICAgIHhGaWVsZCAgICAgIDogJ3gnLFxyXG4gICAgICAgICAgICB5RmllbGQgICAgICA6ICd5JyxcclxuICAgICAgICAgICAgc2l6ZUZpZWxkICAgOiAnc2l6ZScsXHJcbiAgICAgICAgICAgIGNvbG9yRmllbGQgIDogJ2NvbG9yJyxcclxuICAgICAgICAgICAgc2hhcGVGaWVsZCAgOiAnc2hhcGUnLFxyXG4gICAgICAgICAgICBpbWFnZUZpZWxkICA6ICdpbWFnZScsXHJcbiAgICAgICAgICAgIHNoYXBlICAgICAgIDogJ2NpcmNsZScsXHJcbiAgICAgICAgICAgIGltYWdlICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBtYXJrZXJTaXplICA6IDgsXHJcbiAgICAgICAgICAgIGZpbGxDb2xvciAgIDogdW5kZWZpbmVkLCBcclxuICAgICAgICAgICAgZmlsbE9wYWNpdHkgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGxpbmVDb2xvciAgIDogdW5kZWZpbmVkLCAgXHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCAgIDogdW5kZWZpbmVkLCBcclxuICAgICAgICAgICAgbGluZUpvaW4gICAgOiB1bmRlZmluZWQsIFxyXG4gICAgICAgICAgICBsaW5lQ2FwICAgICA6IHVuZGVmaW5lZCwgXHJcbiAgICAgICAgICAgIGxpbmVPcGFjaXR5IDogdW5kZWZpbmVkXHJcbiAgICAgICAgfTsgICBcclxuXHJcbiAgICAgICAgLy8gRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHBhc3NlZCBpbiBvcHRpb25zLlxyXG4gICAgICAgIHV0aWwuZXh0ZW5kT2JqZWN0KHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBQcm9jZXNzIHRoZSBkYXRhLlxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5fb3B0aW9ucztcclxufTtcclxuXHJcbi8qKiBcclxuICogVXBkYXRlcyB0aGUgc2VyaWVzLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHJldHVybiB7U2VyaWVzfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblNlcmllcy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLl9pdGVtcyA9IFtdO1xyXG5cclxuICAgIHRoaXMueE1pbiA9IEluZmluaXR5O1xyXG4gICAgdGhpcy54TWF4ID0gLUluZmluaXR5O1xyXG4gICAgdGhpcy55TWluID0gSW5maW5pdHk7XHJcbiAgICB0aGlzLnlNYXggPSAtSW5maW5pdHk7XHJcblxyXG4gICAgdmFyIG4gPSB0aGlzLl9vcHRpb25zLmRhdGEubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspICBcclxuICAgIHtcclxuICAgICAgICB2YXIgZGF0YUl0ZW0gPSB0aGlzLl9vcHRpb25zLmRhdGFbaV07XHJcblxyXG4gICAgICAgIC8vIEFkZCBhIG5ldyBzZXJpZXMgaXRlbSBmb3IgZWFjaCBkYXRhIGl0ZW0uXHJcbiAgICAgICAgdmFyIHggICAgICAgICAgID0gZGF0YUl0ZW1bdGhpcy5fb3B0aW9ucy54RmllbGRdO1xyXG4gICAgICAgIHZhciB5ICAgICAgICAgICA9IGRhdGFJdGVtW3RoaXMuX29wdGlvbnMueUZpZWxkXTtcclxuICAgICAgICB2YXIgaWQgICAgICAgICAgPSBkYXRhSXRlbVt0aGlzLl9vcHRpb25zLmlkRmllbGRdICAgICE9PSB1bmRlZmluZWQgPyBkYXRhSXRlbVt0aGlzLl9vcHRpb25zLmlkRmllbGRdICAgIDogaTtcclxuICAgICAgICB2YXIgbmFtZSAgICAgICAgPSBkYXRhSXRlbVt0aGlzLl9vcHRpb25zLm5hbWVGaWVsZF0gICE9PSB1bmRlZmluZWQgPyBkYXRhSXRlbVt0aGlzLl9vcHRpb25zLm5hbWVGaWVsZF0gIDogaTtcclxuICAgICAgICB2YXIgbWFya2VyU2l6ZSAgPSBkYXRhSXRlbVt0aGlzLl9vcHRpb25zLnNpemVGaWVsZF0gICE9PSB1bmRlZmluZWQgPyBkYXRhSXRlbVt0aGlzLl9vcHRpb25zLnNpemVGaWVsZF0gIDogdGhpcy5fb3B0aW9ucy5tYXJrZXJTaXplO1xyXG4gICAgICAgIHZhciBzaGFwZSAgICAgICA9IGRhdGFJdGVtW3RoaXMuX29wdGlvbnMuc2hhcGVGaWVsZF0gIT09IHVuZGVmaW5lZCA/IGRhdGFJdGVtW3RoaXMuX29wdGlvbnMuc2hhcGVGaWVsZF0gOiB0aGlzLl9vcHRpb25zLnNoYXBlO1xyXG5cclxuICAgICAgICBpZiAodXRpbC5pc051bWJlcih4KSAmJiB1dGlsLmlzTnVtYmVyKHkpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmNhbnZhcy5tYXJrZXIoc2hhcGUsIHgsIHksIG1hcmtlclNpemUpO1xyXG4gICAgICAgICAgICAvL3ZhciBpdGVtID0gdGhpcy5jYW52YXMuc2hhcGUoc2hhcGUsIHgsIHksIG1hcmtlclNpemUsIG1hcmtlclNpemUpO1xyXG4gICAgICAgICAgICBpdGVtLnN0eWxlID0gXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZpbGxDb2xvciAgIDogZGF0YUl0ZW1bdGhpcy5fb3B0aW9ucy5jb2xvckZpZWxkXSAhPT0gdW5kZWZpbmVkID8gZGF0YUl0ZW1bdGhpcy5fb3B0aW9ucy5jb2xvckZpZWxkXSA6IHRoaXMuX29wdGlvbnMuZmlsbENvbG9yLFxyXG4gICAgICAgICAgICAgICAgZmlsbE9wYWNpdHkgOiB0aGlzLl9vcHRpb25zLmZpbGxPcGFjaXR5LFxyXG4gICAgICAgICAgICAgICAgbGluZUNvbG9yICAgOiB0aGlzLl9vcHRpb25zLmxpbmVDb2xvcixcclxuICAgICAgICAgICAgICAgIGxpbmVXaWR0aCAgIDogdGhpcy5fb3B0aW9ucy5saW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgICBsaW5lSm9pbiAgICA6IHRoaXMuX29wdGlvbnMubGluZUpvaW4sXHJcbiAgICAgICAgICAgICAgICBsaW5lQ2FwICAgICA6IHRoaXMuX29wdGlvbnMubGluZUNhcCxcclxuICAgICAgICAgICAgICAgIGxpbmVPcGFjaXR5IDogdGhpcy5fb3B0aW9ucy5saW5lT3BhY2l0eVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaChpdGVtKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbWluIGFuZCBtYXggdmFsdWVzIGluIHRoZSBkYXRhLlxyXG4gICAgICAgICAgICB0aGlzLnhNaW4gPSBNYXRoLm1pbih0aGlzLnhNaW4sIHgpO1xyXG4gICAgICAgICAgICB0aGlzLnhNYXggPSBNYXRoLm1heCh0aGlzLnhNYXgsIHgpO1xyXG4gICAgICAgICAgICB0aGlzLnlNaW4gPSBNYXRoLm1pbih0aGlzLnlNaW4sIHkpO1xyXG4gICAgICAgICAgICB0aGlzLnlNYXggPSBNYXRoLm1heCh0aGlzLnlNYXgsIHkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBSZW5kZXJzIHRoZSBncmFwaGljcy5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEByZXR1cm4ge1Nlcmllc30gPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5TZXJpZXMucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5jYW52YXMucmVuZGVyKCk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJldHVybnMgYSBoaXQgZXZlbnQgZm9yIHRoZSBuZWFyZXN0IGl0ZW0uXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0geCBUaGUgeCBwaXhlbCBjb29yZC5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkgVGhlIHkgcGl4ZWwgY29vcmQuXHJcbiAqXHJcbiAqIEByZXR1cm4ge0NhbnZhc0l0ZW19IFRoZSBjYW52YXMgaXRlbS5cclxuICovXHJcblNlcmllcy5wcm90b3R5cGUuaGl0RXZlbnQgPSBmdW5jdGlvbih4LCB5KVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5jYW52YXMuaGl0RXZlbnQoeCwgeSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlcmllczsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4vKiBnbG9iYWxzIERFQlVHICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3ICAgIENvbnRhaW5zIGNhbnZhcyBkcmF3aW5nIHJvdXRpbmVzLlxyXG4gKiBAYXV0aG9yICAgICAgICAgIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0ICAgICAgIEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlICAgICAgICAgIGNhbnZhcyBcclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9kb21cclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9jb2xvclxyXG4gKi9cclxuXHJcbi8vIFJlcXVpcmVkIG1vZHVsZXMuXHJcbnZhciBkb20gICAgICAgPSByZXF1aXJlKCcuLi91dGlscy9kb20nKTtcclxudmFyIGNvbG9yVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWxzL2NvbG9yJyk7XHJcblxyXG4vKiogXHJcbiAqIENoZWNrcyBmb3IgY2FudmFzIHN1cHBvcnQuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRoZSBncmFwaGljcyBsaWJyYXJ5LCBvdGhlcndpc2UgZmFsc2UuXHJcbiAqL1xyXG52YXIgaXNTdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICByZXR1cm4gISFkb20uY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dCgnMmQnKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJucyBhbiBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgY2FudmFzIHRoYXQgY2FuIGJlIHN0YWNrZWQgaW4gYSByZWxhdGl2ZSBjb250YWluZXIuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtIdG1sQ2FudmFzfSBBIGNhbnZhcy5cclxuICovXHJcbnZhciBnZXRDYW52YXMgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICB2YXIgY2FudmFzID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpOyBcclxuICAgIGRvbS5zdHlsZShjYW52YXMsIHtwb3NpdGlvbjonYWJzb2x1dGUnLCBsZWZ0OjAsIHJpZ2h0OjB9KTtcclxuICAgIHJldHVybiBjYW52YXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJldHVybnMgYSBkcmF3aW5nIGNvbnRleHQuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge0h0bWxDYW52YXN9ICBjYW52YXMgVGhlIGNhbnZhcy5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdHlwZSAgIFRoZSBlbGVtZW50IHR5cGUuXHJcbiAqXHJcbiAqIEByZXR1cm4ge0h0bWxDYW52YXNDb250ZXh0fSBBIGNhbnZhcyBjb250ZXh0LlxyXG4gKi9cclxudmFyIGdldENvbnRleHQgPSBmdW5jdGlvbiAoY2FudmFzLCB0eXBlKVxyXG57XHJcbiAgICByZXR1cm4gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENsZWFycyB0aGUgY2FudmFzLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtIdG1sQ2FudmFzfSBjYW52YXMgVGhlIGNhbnZhcy5cclxuICovXHJcbnZhciBjbGVhciA9IGZ1bmN0aW9uIChjYW52YXMpXHJcbntcclxuICAgIGVtcHR5KGNhbnZhcyk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEVtcHRpZXMgdGhlIGNhbnZhcy5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7SHRtbENhbnZhc30gY2FudmFzIFRoZSBjYW52YXMuXHJcbiAqL1xyXG52YXIgZW1wdHkgPSBmdW5jdGlvbiAoY2FudmFzKVxyXG57XHJcbiAgICBnZXRDb250ZXh0KGNhbnZhcykuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIERyYXdzIGEgY2lyY2xlLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtIdG1sQ2FudmFzQ29udGV4dH0gICBjdHggICAgICAgICAgICAgICAgIFRoZSBjYW52YXMgY29udGV4dCB0byBkcmF3IHRvLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIGN4ICAgICAgICAgICAgICAgICAgVGhlIHggcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIGN5ICAgICAgICAgICAgICAgICAgVGhlIHkgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIHIgICAgICAgICAgICAgICAgICAgVGhlIGNpcmNsZSByYWRpdXMuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICAgICAgW3N0eWxlXSAgICAgICAgICAgICBUaGUgc3R5bGUgcHJvcGVydGllcy5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICBbc3R5bGUuZmlsbENvbG9yXSAgIFRoZSBmaWxsIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIFtzdHlsZS5maWxsT3BhY2l0eV0gVGhlIGZpbGwgb3BhY2l0eS4gVGhpcyBpcyBvdmVycmlkZW4gYnkgdGhlIGZpbGxDb2xvciBpZiBpdCBjb250YWlucyBhbiBhbHBoYSB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICBbc3R5bGUubGluZUNvbG9yXSAgIFRoZSBsaW5lIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIFtzdHlsZS5saW5lV2lkdGhdICAgVGhlIGxpbmUgd2lkdGguXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVKb2luXSAgICBUaGUgbGluZSBqb2luLCBvbmUgb2YgXCJiZXZlbFwiLCBcInJvdW5kXCIsIFwibWl0ZXJcIi5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICBbc3R5bGUubGluZUNhcF0gICAgIFRoZSBsaW5lIGNhcCwgb25lIG9mIFwiYnV0dFwiLCBcInJvdW5kXCIsIFwic3F1YXJlXCIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVPcGFjaXR5XSBUaGUgbGluZSBvcGFjaXR5LiBUaGlzIGlzIG92ZXJyaWRlbiBieSB0aGUgbGluZUNvbG9yIGlmIGl0IGNvbnRhaW5zIGFuIGFscGhhIHZhbHVlLlxyXG4gKi9cclxudmFyIGNpcmNsZSA9IGZ1bmN0aW9uIChjdHgsIGN4LCBjeSwgciwgc3R5bGUpXHJcbntcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoY3gsIGN5LCByLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgZHJhdyhjdHgsIHN0eWxlKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogRHJhd3MgYW4gZWxsaXBzZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7SHRtbENhbnZhc0NvbnRleHR9ICAgY3R4ICAgICAgICAgICAgICAgICBUaGUgY2FudmFzIGNvbnRleHQgdG8gZHJhdyB0by5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICAgICAgICBjeCAgICAgICAgICAgICAgICAgIFRoZSB4IHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGVsbGlwc2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgY3kgICAgICAgICAgICAgICAgICBUaGUgeSBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoZSBlbGxpcHNlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgcnggICAgICAgICAgICAgICAgICBUaGUgeCByYWRpdXMgb2YgdGhlIGVsbGlwc2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgcnkgICAgICAgICAgICAgICAgICBUaGUgeSByYWRpdXMgb2YgdGhlIGVsbGlwc2UuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICAgICAgW3N0eWxlXSAgICAgICAgICAgICBUaGUgc3R5bGUgcHJvcGVydGllcy5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICBbc3R5bGUuZmlsbENvbG9yXSAgIFRoZSBmaWxsIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIFtzdHlsZS5maWxsT3BhY2l0eV0gVGhlIGZpbGwgb3BhY2l0eS4gVGhpcyBpcyBvdmVycmlkZW4gYnkgdGhlIGZpbGxDb2xvciBpZiBpdCBjb250YWlucyBhbiBhbHBoYSB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICBbc3R5bGUubGluZUNvbG9yXSAgIFRoZSBsaW5lIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIFtzdHlsZS5saW5lV2lkdGhdICAgVGhlIGxpbmUgd2lkdGguXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVKb2luXSAgICBUaGUgbGluZSBqb2luLCBvbmUgb2YgXCJiZXZlbFwiLCBcInJvdW5kXCIsIFwibWl0ZXJcIi5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICBbc3R5bGUubGluZUNhcF0gICAgIFRoZSBsaW5lIGNhcCwgb25lIG9mIFwiYnV0dFwiLCBcInJvdW5kXCIsIFwic3F1YXJlXCIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVPcGFjaXR5XSBUaGUgbGluZSBvcGFjaXR5LiBUaGlzIGlzIG92ZXJyaWRlbiBieSB0aGUgbGluZUNvbG9yIGlmIGl0IGNvbnRhaW5zIGFuIGFscGhhIHZhbHVlLlxyXG4gKi9cclxudmFyIGVsbGlwc2UgPSBmdW5jdGlvbiAoY3R4LCBjeCwgY3ksIHJ4LCByeSwgc3R5bGUpXHJcbntcclxuICAgIHZhciBrYXBwYSA9IDAuNTUyMjg0OCxcclxuICAgIHggID0gY3ggLSByeCwgICAgICAgLy8geC1zdGFydC5cclxuICAgIHkgID0gY3kgLSByeSwgICAgICAgLy8geS1zdGFydC5cclxuICAgIHhlID0gY3ggKyByeCwgICAgICAgLy8geC1lbmQuXHJcbiAgICB5ZSA9IGN5ICsgcnksICAgICAgIC8vIHktZW5kLlxyXG4gICAgb3ggPSByeCAqIGthcHBhLCAgICAvLyBDb250cm9sIHBvaW50IG9mZnNldCBob3Jpem9udGFsLlxyXG4gICAgb3kgPSByeSAqIGthcHBhOyAgICAvLyBDb250cm9sIHBvaW50IG9mZnNldCB2ZXJ0aWNhbC5cclxuXHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKHgsIGN5KTtcclxuICAgIGN0eC5iZXppZXJDdXJ2ZVRvKHgsIGN5IC0gb3ksIGN4IC0gb3gsIHksIGN4LCB5KTtcclxuICAgIGN0eC5iZXppZXJDdXJ2ZVRvKGN4ICsgb3gsIHksIHhlLCBjeSAtIG95LCB4ZSwgY3kpO1xyXG4gICAgY3R4LmJlemllckN1cnZlVG8oeGUsIGN5ICsgb3ksIGN4ICsgb3gsIHllLCBjeCwgeWUpO1xyXG4gICAgY3R4LmJlemllckN1cnZlVG8oY3ggLSBveCwgeWUsIHgsIGN5ICsgb3ksIHgsIGN5KTtcclxuICAgIGRyYXcoY3R4LCBzdHlsZSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIERyYXdzIGEgcmVjdGFuZ2xlLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtIdG1sQ2FudmFzQ29udGV4dH0gICBjdHggICAgICAgICAgICAgICAgIFRoZSBjYW52YXMgY29udGV4dCB0byBkcmF3IHRvLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIHggICAgICAgICAgICAgICAgICAgVGhlIHggcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICAgICAgICB5ICAgICAgICAgICAgICAgICAgIFRoZSB5IHBvc2l0aW9uIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgdyAgICAgICAgICAgICAgICAgICBUaGUgd2lkdGguXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgaCAgICAgICAgICAgICAgICAgICBUaGUgaGVpZ2h0LlxyXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICAgICAgIFtzdHlsZV0gICAgICAgICAgICAgVGhlIHN0eWxlIHByb3BlcnRpZXMuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgW3N0eWxlLmZpbGxDb2xvcl0gICBUaGUgZmlsbCBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICAgICAgICBbc3R5bGUuZmlsbE9wYWNpdHldIFRoZSBmaWxsIG9wYWNpdHkuIFRoaXMgaXMgb3ZlcnJpZGVuIGJ5IHRoZSBmaWxsQ29sb3IgaWYgaXQgY29udGFpbnMgYW4gYWxwaGEgdmFsdWUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVDb2xvcl0gICBUaGUgbGluZSBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICAgICAgICBbc3R5bGUubGluZVdpZHRoXSAgIFRoZSBsaW5lIHdpZHRoLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5saW5lSm9pbl0gICAgVGhlIGxpbmUgam9pbiwgb25lIG9mIFwiYmV2ZWxcIiwgXCJyb3VuZFwiLCBcIm1pdGVyXCIuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVDYXBdICAgICBUaGUgbGluZSBjYXAsIG9uZSBvZiBcImJ1dHRcIiwgXCJyb3VuZFwiLCBcInNxdWFyZVwiLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIFtzdHlsZS5saW5lT3BhY2l0eV0gVGhlIGxpbmUgb3BhY2l0eS4gVGhpcyBpcyBvdmVycmlkZW4gYnkgdGhlIGxpbmVDb2xvciBpZiBpdCBjb250YWlucyBhbiBhbHBoYSB2YWx1ZS5cclxuICovXHJcbnZhciByZWN0ID0gZnVuY3Rpb24gKGN0eCwgeCwgeSwgdywgaCwgc3R5bGUpXHJcbntcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5yZWN0KHgsIHksIHcsIGgpO1xyXG4gICAgZHJhdyhjdHgsIHN0eWxlKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogRHJhd3MgYSBsaW5lLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtIdG1sQ2FudmFzQ29udGV4dH0gICBjdHggICAgICAgICAgICAgICAgIFRoZSBjYW52YXMgY29udGV4dCB0byBkcmF3IHRvLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIHgxICAgICAgICAgICAgICAgICAgVGhlIHggcG9zaXRpb24gb2YgcG9pbnQgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICAgICAgICB5MSAgICAgICAgICAgICAgICAgIFRoZSB5IHBvc2l0aW9uIG9mIHBvaW50IDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgeDIgICAgICAgICAgICAgICAgICBUaGUgeCBwb3NpdGlvbiBvZiBwb2ludCAyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIHkyICAgICAgICAgICAgICAgICAgVGhlIHkgcG9zaXRpb24gb2YgcG9pbnQgMi5cclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgICBbc3R5bGVdICAgICAgICAgICAgIFRoZSBzdHlsZSBwcm9wZXJ0aWVzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5maWxsQ29sb3JdICAgVGhlIGZpbGwgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgW3N0eWxlLmZpbGxPcGFjaXR5XSBUaGUgZmlsbCBvcGFjaXR5LiBUaGlzIGlzIG92ZXJyaWRlbiBieSB0aGUgZmlsbENvbG9yIGlmIGl0IGNvbnRhaW5zIGFuIGFscGhhIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5saW5lQ29sb3JdICAgVGhlIGxpbmUgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVXaWR0aF0gICBUaGUgbGluZSB3aWR0aC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICBbc3R5bGUubGluZUpvaW5dICAgIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5saW5lQ2FwXSAgICAgVGhlIGxpbmUgY2FwLCBvbmUgb2YgXCJidXR0XCIsIFwicm91bmRcIiwgXCJzcXVhcmVcIi5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICAgICAgICBbc3R5bGUubGluZU9wYWNpdHldIFRoZSBsaW5lIG9wYWNpdHkuIFRoaXMgaXMgb3ZlcnJpZGVuIGJ5IHRoZSBsaW5lQ29sb3IgaWYgaXQgY29udGFpbnMgYW4gYWxwaGEgdmFsdWUuXHJcbiAqL1xyXG52YXIgbGluZSA9IGZ1bmN0aW9uIChjdHgsIHgxLCB5MSwgeDIsIHkyLCBzdHlsZSlcclxue1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4Lm1vdmVUbyh4MSwgeTEpO1xyXG4gICAgY3R4LmxpbmVUbyh4MiwgeTIpO1xyXG4gICAgZHJhdyhjdHgsIHN0eWxlKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogRHJhd3MgYSBwb2x5bGluZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7SHRtbENhbnZhc0NvbnRleHR9ICAgY3R4ICAgICAgICAgICAgICAgICBUaGUgY2FudmFzIGNvbnRleHQgdG8gZHJhdyB0by5cclxuICogQHBhcmFtIHtudW1iZXJbXX0gICAgICAgICAgICBhcnJDb29yZHMgICAgICAgICAgIEFuIGFycmF5IG9mIHh5IHBvc2l0aW9ucyBvZiB0aGUgZm9ybSBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0Li4uXS5cclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgICBbc3R5bGVdICAgICAgICAgICAgIFRoZSBzdHlsZSBwcm9wZXJ0aWVzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5maWxsQ29sb3JdICAgVGhlIGZpbGwgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgW3N0eWxlLmZpbGxPcGFjaXR5XSBUaGUgZmlsbCBvcGFjaXR5LiBUaGlzIGlzIG92ZXJyaWRlbiBieSB0aGUgZmlsbENvbG9yIGlmIGl0IGNvbnRhaW5zIGFuIGFscGhhIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5saW5lQ29sb3JdICAgVGhlIGxpbmUgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVXaWR0aF0gICBUaGUgbGluZSB3aWR0aC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICBbc3R5bGUubGluZUpvaW5dICAgIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5saW5lQ2FwXSAgICAgVGhlIGxpbmUgY2FwLCBvbmUgb2YgXCJidXR0XCIsIFwicm91bmRcIiwgXCJzcXVhcmVcIi5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICAgICAgICBbc3R5bGUubGluZU9wYWNpdHldIFRoZSBsaW5lIG9wYWNpdHkuIFRoaXMgaXMgb3ZlcnJpZGVuIGJ5IHRoZSBsaW5lQ29sb3IgaWYgaXQgY29udGFpbnMgYW4gYWxwaGEgdmFsdWUuXHJcbiAqL1xyXG52YXIgcG9seWxpbmUgPSBmdW5jdGlvbiAoY3R4LCBhcnJDb29yZHMsIHN0eWxlKVxyXG57XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICB2YXIgbiA9IGFyckNvb3Jkcy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrPTIpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHggPSBhcnJDb29yZHNbaV07XHJcbiAgICAgICAgdmFyIHkgPSBhcnJDb29yZHNbaSsxXTtcclxuICAgICAgICBpZiAoaSA9PT0gMCkgY3R4Lm1vdmVUbyh4LCB5KTtcclxuICAgICAgICBlbHNlICAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcclxuICAgIH1cclxuICAgIGRyYXcoY3R4LCBzdHlsZSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIERyYXdzIGEgcG9seWdvbi5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7SHRtbENhbnZhc0NvbnRleHR9ICAgY3R4ICAgICAgICAgICAgICAgICBUaGUgY2FudmFzIGNvbnRleHQgdG8gZHJhdyB0by5cclxuICogQHBhcmFtIHtudW1iZXJbXX0gICAgICAgICAgICBhcnJDb29yZHMgICAgICAgICAgIEFuIGFycmF5IG9mIHh5IHBvc2l0aW9ucyBvZiB0aGUgZm9ybSBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0Li4uXS5cclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgICBbc3R5bGVdICAgICAgICAgICAgIFRoZSBzdHlsZSBwcm9wZXJ0aWVzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5maWxsQ29sb3JdICAgVGhlIGZpbGwgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgW3N0eWxlLmZpbGxPcGFjaXR5XSBUaGUgZmlsbCBvcGFjaXR5LiBUaGlzIGlzIG92ZXJyaWRlbiBieSB0aGUgZmlsbENvbG9yIGlmIGl0IGNvbnRhaW5zIGFuIGFscGhhIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5saW5lQ29sb3JdICAgVGhlIGxpbmUgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVXaWR0aF0gICBUaGUgbGluZSB3aWR0aC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICBbc3R5bGUubGluZUpvaW5dICAgIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5saW5lQ2FwXSAgICAgVGhlIGxpbmUgY2FwLCBvbmUgb2YgXCJidXR0XCIsIFwicm91bmRcIiwgXCJzcXVhcmVcIi5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICAgICAgICBbc3R5bGUubGluZU9wYWNpdHldIFRoZSBsaW5lIG9wYWNpdHkuIFRoaXMgaXMgb3ZlcnJpZGVuIGJ5IHRoZSBsaW5lQ29sb3IgaWYgaXQgY29udGFpbnMgYW4gYWxwaGEgdmFsdWUuXHJcbiAqL1xyXG52YXIgcG9seWdvbiA9IGZ1bmN0aW9uIChjdHgsIGFyckNvb3Jkcywgc3R5bGUpXHJcbntcclxuICAgIHBvbHlsaW5lKGFyckNvb3Jkcyk7XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBkcmF3KGN0eCwgc3R5bGUpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBQcm92aWRlcyB0aGUgZmlsbCBkcmF3aW5nIHJvdXRpbmUuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcHJpdmF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0h0bWxDYW52YXNDb250ZXh0fSAgIGN0eCAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FudmFzIGNvbnRleHQgdG8gZHJhdyB0by5cclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgICBbc3R5bGVdICAgICAgICAgICAgICAgICAgICAgVGhlIHN0eWxlIHByb3BlcnRpZXMuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgW3N0eWxlLmZpbGxDb2xvcl0gICAgICAgICAgIFRoZSBmaWxsIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIFtzdHlsZS5maWxsT3BhY2l0eSA9IDFdICAgICBUaGUgZmlsbCBvcGFjaXR5LlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5saW5lQ29sb3JdICAgICAgICAgICBUaGUgbGluZSBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICAgICAgICBbc3R5bGUubGluZVdpZHRoID0gMV0gICAgICAgVGhlIGxpbmUgd2lkdGguXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgW3N0eWxlLmxpbmVKb2luID0gcm91bmRdICAgIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgICAgIFtzdHlsZS5saW5lQ2FwID0gYnV0dF0gICAgICBUaGUgbGluZSBjYXAsIG9uZSBvZiBcImJ1dHRcIiwgXCJyb3VuZFwiLCBcInNxdWFyZVwiLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICAgICAgICAgIFtzdHlsZS5saW5lT3BhY2l0eSA9IDFdICAgICBUaGUgbGluZSBvcGFjaXR5LiBPdmVycmlkZXMgYW55IGFscGhhIHZhbHVlIG9uIHRoZSBmaWxsIGNvbG9yLlxyXG4gKi9cclxuZnVuY3Rpb24gZHJhdyAoY3R4LCBzdHlsZSlcclxue1xyXG4gICAgLy8gRmlsbC5cclxuICAgIGlmIChzdHlsZS5maWxsQ29sb3IgIT09IHVuZGVmaW5lZClcclxuICAgIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlICAgPSBzdHlsZS5maWxsT3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gY29sb3JVdGlsLnRvUkdCQShzdHlsZS5maWxsQ29sb3IsIHN0eWxlLmZpbGxPcGFjaXR5KSA6IGNvbG9yVXRpbC50b1JHQkEoc3R5bGUuZmlsbENvbG9yKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFN0cm9rZS5cclxuICAgIGlmIChzdHlsZS5saW5lQ29sb3IgIT09IHVuZGVmaW5lZCAmJiBzdHlsZS5saW5lV2lkdGggIT09IDApXHJcbiAgICB7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCAgID0gc3R5bGUubGluZVdpZHRoICAgIT09IHVuZGVmaW5lZCA/IHN0eWxlLmxpbmVXaWR0aCA6IDE7XHJcbiAgICAgICAgY3R4LmxpbmVKb2luICAgID0gc3R5bGUubGluZUpvaW4gICAgIT09IHVuZGVmaW5lZCA/IHN0eWxlLmxpbmVKb2luICA6ICdyb3VuZCc7XHJcbiAgICAgICAgY3R4LmxpbmVDYXAgICAgID0gc3R5bGUubGluZUNhcCAgICAgIT09IHVuZGVmaW5lZCA/IHN0eWxlLmxpbmVDYXAgICA6ICdidXR0JztcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHlsZS5saW5lT3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gY29sb3JVdGlsLnRvUkdCQShzdHlsZS5saW5lQ29sb3IsIHN0eWxlLmxpbmVPcGFjaXR5KSA6IGNvbG9yVXRpbC50b1JHQkEoc3R5bGUubGluZUNvbG9yKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gXHJcbntcclxuICAgIGlzU3VwcG9ydGVkIDogaXNTdXBwb3J0ZWQsXHJcbiAgICBnZXRDYW52YXMgICA6IGdldENhbnZhcyxcclxuICAgIGdldENvbnRleHQgIDogZ2V0Q29udGV4dCxcclxuICAgIGNsZWFyICAgICAgIDogY2xlYXIsXHJcbiAgICBlbXB0eSAgICAgICA6IGVtcHR5LFxyXG4gICAgZHJhdyAgICAgICAgOiBkcmF3LFxyXG4gICAgY2lyY2xlICAgICAgOiBjaXJjbGUsXHJcbiAgICBlbGxpcHNlICAgICA6IGVsbGlwc2UsXHJcbiAgICByZWN0ICAgICAgICA6IHJlY3QsXHJcbiAgICBsaW5lICAgICAgICA6IGxpbmUsXHJcbiAgICBwb2x5bGluZSAgICA6IHBvbHlsaW5lLFxyXG4gICAgcG9seWdvbiAgICAgOiBwb2x5Z29uXHJcbn07IiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuLyogZ2xvYmFscyBERUJVRyAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQGZpbGVvdmVydmlldyAgICBDb250YWlucyBjb2xvciBmdW5jdGlvbnMuXHJcbiAqIEBhdXRob3IgICAgICAgICAgSm9uYXRoYW4gQ2xhcmUgXHJcbiAqIEBjb3B5cmlnaHQgICAgICAgRmxvd2luZ0NoYXJ0cyAyMDE1XHJcbiAqIEBtb2R1bGUgICAgICAgICAgY29sb3IgXHJcbiAqL1xyXG5cclxuLy8gTGlzdCBvZiB2YWxpZCBjb2xvciBuYW1lcy5cclxudmFyIGNvbG9yTmFtZXMgPSBcclxue1xyXG4gICAgJ2FsaWNlYmx1ZSc6JyNmMGY4ZmYnLCdhbnRpcXVld2hpdGUnOicjZmFlYmQ3JywnYXF1YSc6JyMwMGZmZmYnLCdhcXVhbWFyaW5lJzonIzdmZmZkNCcsJ2F6dXJlJzonI2YwZmZmZicsXHJcbiAgICAnYmVpZ2UnOicjZjVmNWRjJywnYmlzcXVlJzonI2ZmZTRjNCcsJ2JsYWNrJzonIzAwMDAwMCcsJ2JsYW5jaGVkYWxtb25kJzonI2ZmZWJjZCcsJ2JsdWUnOicjMDAwMGZmJywnYmx1ZXZpb2xldCc6JyM4YTJiZTInLCdicm93bic6JyNhNTJhMmEnLCdidXJseXdvb2QnOicjZGViODg3JyxcclxuICAgICdjYWRldGJsdWUnOicjNWY5ZWEwJywnY2hhcnRyZXVzZSc6JyM3ZmZmMDAnLCdjaG9jb2xhdGUnOicjZDI2OTFlJywnY29yYWwnOicjZmY3ZjUwJywnY29ybmZsb3dlcmJsdWUnOicjNjQ5NWVkJywnY29ybnNpbGsnOicjZmZmOGRjJywnY3JpbXNvbic6JyNkYzE0M2MnLCdjeWFuJzonIzAwZmZmZicsXHJcbiAgICAnZGFya2JsdWUnOicjMDAwMDhiJywnZGFya2N5YW4nOicjMDA4YjhiJywnZGFya2dvbGRlbnJvZCc6JyNiODg2MGInLCdkYXJrZ3JheSc6JyNhOWE5YTknLCdkYXJrZ3JlZW4nOicjMDA2NDAwJywnZGFya2toYWtpJzonI2JkYjc2YicsJ2RhcmttYWdlbnRhJzonIzhiMDA4YicsJ2RhcmtvbGl2ZWdyZWVuJzonIzU1NmIyZicsXHJcbiAgICAnZGFya29yYW5nZSc6JyNmZjhjMDAnLCdkYXJrb3JjaGlkJzonIzk5MzJjYycsJ2RhcmtyZWQnOicjOGIwMDAwJywnZGFya3NhbG1vbic6JyNlOTk2N2EnLCdkYXJrc2VhZ3JlZW4nOicjOGZiYzhmJywnZGFya3NsYXRlYmx1ZSc6JyM0ODNkOGInLCdkYXJrc2xhdGVncmF5JzonIzJmNGY0ZicsJ2Rhcmt0dXJxdW9pc2UnOicjMDBjZWQxJyxcclxuICAgICdkYXJrdmlvbGV0JzonIzk0MDBkMycsJ2RlZXBwaW5rJzonI2ZmMTQ5MycsJ2RlZXBza3libHVlJzonIzAwYmZmZicsJ2RpbWdyYXknOicjNjk2OTY5JywnZG9kZ2VyYmx1ZSc6JyMxZTkwZmYnLFxyXG4gICAgJ2ZpcmVicmljayc6JyNiMjIyMjInLCdmbG9yYWx3aGl0ZSc6JyNmZmZhZjAnLCdmb3Jlc3RncmVlbic6JyMyMjhiMjInLCdmdWNoc2lhJzonI2ZmMDBmZicsXHJcbiAgICAnZ2FpbnNib3JvJzonI2RjZGNkYycsJ2dob3N0d2hpdGUnOicjZjhmOGZmJywnZ29sZCc6JyNmZmQ3MDAnLCdnb2xkZW5yb2QnOicjZGFhNTIwJywnZ3JheSc6JyM4MDgwODAnLCdncmVlbic6JyMwMDgwMDAnLCdncmVlbnllbGxvdyc6JyNhZGZmMmYnLFxyXG4gICAgJ2hvbmV5ZGV3JzonI2YwZmZmMCcsJ2hvdHBpbmsnOicjZmY2OWI0JyxcclxuICAgICdpbmRpYW5yZWQgJzonI2NkNWM1YycsJ2luZGlnbyc6JyM0YjAwODInLCdpdm9yeSc6JyNmZmZmZjAnLCdraGFraSc6JyNmMGU2OGMnLFxyXG4gICAgJ2xhdmVuZGVyJzonI2U2ZTZmYScsJ2xhdmVuZGVyYmx1c2gnOicjZmZmMGY1JywnbGF3bmdyZWVuJzonIzdjZmMwMCcsJ2xlbW9uY2hpZmZvbic6JyNmZmZhY2QnLCdsaWdodGJsdWUnOicjYWRkOGU2JywnbGlnaHRjb3JhbCc6JyNmMDgwODAnLCdsaWdodGN5YW4nOicjZTBmZmZmJywnbGlnaHRnb2xkZW5yb2R5ZWxsb3cnOicjZmFmYWQyJyxcclxuICAgICdsaWdodGdyZXknOicjZDNkM2QzJywnbGlnaHRncmVlbic6JyM5MGVlOTAnLCdsaWdodHBpbmsnOicjZmZiNmMxJywnbGlnaHRzYWxtb24nOicjZmZhMDdhJywnbGlnaHRzZWFncmVlbic6JyMyMGIyYWEnLCdsaWdodHNreWJsdWUnOicjODdjZWZhJywnbGlnaHRzbGF0ZWdyYXknOicjNzc4ODk5JywnbGlnaHRzdGVlbGJsdWUnOicjYjBjNGRlJyxcclxuICAgICdsaWdodHllbGxvdyc6JyNmZmZmZTAnLCdsaW1lJzonIzAwZmYwMCcsJ2xpbWVncmVlbic6JyMzMmNkMzInLCdsaW5lbic6JyNmYWYwZTYnLFxyXG4gICAgJ21hZ2VudGEnOicjZmYwMGZmJywnbWFyb29uJzonIzgwMDAwMCcsJ21lZGl1bWFxdWFtYXJpbmUnOicjNjZjZGFhJywnbWVkaXVtYmx1ZSc6JyMwMDAwY2QnLCdtZWRpdW1vcmNoaWQnOicjYmE1NWQzJywnbWVkaXVtcHVycGxlJzonIzkzNzBkOCcsJ21lZGl1bXNlYWdyZWVuJzonIzNjYjM3MScsJ21lZGl1bXNsYXRlYmx1ZSc6JyM3YjY4ZWUnLFxyXG4gICAgJ21lZGl1bXNwcmluZ2dyZWVuJzonIzAwZmE5YScsJ21lZGl1bXR1cnF1b2lzZSc6JyM0OGQxY2MnLCdtZWRpdW12aW9sZXRyZWQnOicjYzcxNTg1JywnbWlkbmlnaHRibHVlJzonIzE5MTk3MCcsJ21pbnRjcmVhbSc6JyNmNWZmZmEnLCdtaXN0eXJvc2UnOicjZmZlNGUxJywnbW9jY2FzaW4nOicjZmZlNGI1JyxcclxuICAgICduYXZham93aGl0ZSc6JyNmZmRlYWQnLCduYXZ5JzonIzAwMDA4MCcsXHJcbiAgICAnb2xkbGFjZSc6JyNmZGY1ZTYnLCdvbGl2ZSc6JyM4MDgwMDAnLCdvbGl2ZWRyYWInOicjNmI4ZTIzJywnb3JhbmdlJzonI2ZmYTUwMCcsJ29yYW5nZXJlZCc6JyNmZjQ1MDAnLCdvcmNoaWQnOicjZGE3MGQ2JyxcclxuICAgICdwYWxlZ29sZGVucm9kJzonI2VlZThhYScsJ3BhbGVncmVlbic6JyM5OGZiOTgnLCdwYWxldHVycXVvaXNlJzonI2FmZWVlZScsJ3BhbGV2aW9sZXRyZWQnOicjZDg3MDkzJywncGFwYXlhd2hpcCc6JyNmZmVmZDUnLCdwZWFjaHB1ZmYnOicjZmZkYWI5JywncGVydSc6JyNjZDg1M2YnLCdwaW5rJzonI2ZmYzBjYicsJ3BsdW0nOicjZGRhMGRkJywncG93ZGVyYmx1ZSc6JyNiMGUwZTYnLCdwdXJwbGUnOicjODAwMDgwJyxcclxuICAgICdyZWQnOicjZmYwMDAwJywncm9zeWJyb3duJzonI2JjOGY4ZicsJ3JveWFsYmx1ZSc6JyM0MTY5ZTEnLFxyXG4gICAgJ3NhZGRsZWJyb3duJzonIzhiNDUxMycsJ3NhbG1vbic6JyNmYTgwNzInLCdzYW5keWJyb3duJzonI2Y0YTQ2MCcsJ3NlYWdyZWVuJzonIzJlOGI1NycsJ3NlYXNoZWxsJzonI2ZmZjVlZScsJ3NpZW5uYSc6JyNhMDUyMmQnLCdzaWx2ZXInOicjYzBjMGMwJywnc2t5Ymx1ZSc6JyM4N2NlZWInLCdzbGF0ZWJsdWUnOicjNmE1YWNkJywnc2xhdGVncmF5JzonIzcwODA5MCcsJ3Nub3cnOicjZmZmYWZhJywnc3ByaW5nZ3JlZW4nOicjMDBmZjdmJywnc3RlZWxibHVlJzonIzQ2ODJiNCcsXHJcbiAgICAndGFuJzonI2QyYjQ4YycsJ3RlYWwnOicjMDA4MDgwJywndGhpc3RsZSc6JyNkOGJmZDgnLCd0b21hdG8nOicjZmY2MzQ3JywndHVycXVvaXNlJzonIzQwZTBkMCcsXHJcbiAgICAndmlvbGV0JzonI2VlODJlZScsXHJcbiAgICAnd2hlYXQnOicjZjVkZWIzJywnd2hpdGUnOicjZmZmZmZmJywnd2hpdGVzbW9rZSc6JyNmNWY1ZjUnLFxyXG4gICAgJ3llbGxvdyc6JyNmZmZmMDAnLCd5ZWxsb3dncmVlbic6JyM5YWNkMzInXHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENoZWNrIGlmIGMgaXMgYSB2YWxpZCBjb2xvci5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjIFRoZSBjb2xvci5cclxuICpcclxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSwgaWYgYyBpcyBhIG51bWJlciwgb3RoZXJ3aXNlIGZhbHNlLlxyXG4gKi9cclxudmFyIGlzQ29sb3IgPSBmdW5jdGlvbiAoYylcclxue1xyXG4gICAgaWYgKGlzSGV4KGMpKSAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGlmIChpc1JHQihjKSkgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBpZiAoaXNDb2xvck5hbWUoYykpIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDaGVjayBpZiBjIGlzIGEgdmFsaWQgcmdiIGNvbG9yLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGMgVGhlIGNvbG9yLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLCBpZiBjIGlzIGFuIHJnYiBjb2xvciwgb3RoZXJ3aXNlIGZhbHNlLlxyXG4gKi9cclxudmFyIGlzUkdCID0gZnVuY3Rpb24oYylcclxue1xyXG4gICAgcmV0dXJuIChjLmluZGV4T2YoJ3JnYicpICE9IC0xKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ2hlY2sgaWYgYyBpcyBhIHZhbGlkIHJnYmEgY29sb3IuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gYyBUaGUgY29sb3IuXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUsIGlmIGMgaXMgYW4gcmdiYSBjb2xvciwgb3RoZXJ3aXNlIGZhbHNlLlxyXG4gKi9cclxudmFyIGlzUkdCQSA9IGZ1bmN0aW9uKGMpXHJcbntcclxuICAgIHJldHVybiAoYy5pbmRleE9mKCdyZ2JhJykgIT0gLTEpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDaGVjayBpZiBjIGlzIGEgdmFsaWQgaGV4IGNvbG9yLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGMgVGhlIGNvbG9yLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLCBpZiBjIGlzIGEgaGV4YWRlY2ltYWwgY29sb3IsIG90aGVyd2lzZSBmYWxzZS5cclxuICovXHJcbnZhciBpc0hleCA9IGZ1bmN0aW9uIChjKVxyXG57XHJcbiAgICByZXR1cm4gLyheI1swLTlBLUZdezZ9JCl8KF4jWzAtOUEtRl17M30kKS9pLnRlc3QoYyk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENoZWNrIGlmIGMgaXMgYSB2YWxpZCBjb2xvciBuYW1lLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGMgVGhlIGNvbG9yLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLCBpZiBjIGlzIGEgY29sb3IgbmFtZSwgb3RoZXJ3aXNlIGZhbHNlLlxyXG4gKi9cclxudmFyIGlzQ29sb3JOYW1lID0gZnVuY3Rpb24gKGMpXHJcbntcclxuICAgIGlmIChjb2xvck5hbWVzW2MudG9Mb3dlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIHJnYiB0byBoZXguXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gciBUaGUgcmVkIGNvbXBvbmVudC5cclxuICogQHBhcmFtIHtudW1iZXJ9IGcgVGhlIGdyZWVuIGNvbXBvbmVudC5cclxuICogQHBhcmFtIHtudW1iZXJ9IGIgVGhlIGJsdWUgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBoZXhhZGVjaW1hbCB2YWx1ZS5cclxuICovXHJcbnZhciBSR0JUb0hleCA9IGZ1bmN0aW9uIChyLCBnLCBiKVxyXG57XHJcbiAgICByZXR1cm4gJyMnICsgKCgxIDw8IDI0KSArIChyIDw8IDE2KSArIChnIDw8IDgpICsgYikudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBoZXggdG8gcmdiLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGhleCBUaGUgaGV4YWRlY2ltYWwgdmFsdWUuXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJnYiBjb2xvciB2YWx1ZXMge3I6MjU1LCBnOjI1NSwgYjoyNTV9LlxyXG4gKi9cclxudmFyIGhleFRvUkdCID0gZnVuY3Rpb24gKGhleClcclxue1xyXG4gICAgLy8gRXhwYW5kIHNob3J0aGFuZCBmb3JtIChlLmcuICcwM0YnKSB0byBmdWxsIGZvcm0gKGUuZy4gJzAwMzNGRicpXHJcbiAgICB2YXIgc2hvcnRoYW5kUmVnZXggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pO1xyXG4gICAgaGV4ID0gaGV4LnJlcGxhY2Uoc2hvcnRoYW5kUmVnZXgsIGZ1bmN0aW9uKG0sIHIsIGcsIGIpIFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiByICsgciArIGcgKyBnICsgYiArIGI7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XHJcbiAgICByZXR1cm4gcmVzdWx0ID8gXHJcbiAgICB7XHJcbiAgICAgICAgciA6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLCBcclxuICAgICAgICBnIDogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksIFxyXG4gICAgICAgIGIgOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxyXG4gICAgfSA6IG51bGw7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGEgY29sb3IgbmFtZSB0byBoZXguXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gYyBUaGUgY29sb3IgbmFtZS5cclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgaGV4YWRlY2ltYWwgdmFsdWUuXHJcbiAqL1xyXG52YXIgY29sb3JOYW1lVG9IZXggPSBmdW5jdGlvbiAoYylcclxue1xyXG4gICAgcmV0dXJuIGNvbG9yTmFtZXNbYy50b0xvd2VyQ2FzZSgpXTtcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0IHRoZSBjb21wb25lbnRzIGNvbG9ycyBmb3IgYW4gcmdiYSBjb2xvciBzdHJpbmcuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcmdiYSBUaGUgcmdiKGEpIGNvbG9yIHN0cmluZyAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpJy5cclxuICpcclxuICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgY29tcG9uZW50IGNvbG9ycyB7cjoyNTUsIGc6MjU1LCBiOjI1NSwgYTowLjV9LlxyXG4gKi9cclxudmFyIGNvbXBvbmVudENvbG9ycyA9IGZ1bmN0aW9uKHJnYmEpXHJcbntcclxuICAgIHZhciBhcnIgPSByZ2JhLm1hdGNoKC9cXGQrL2cpO1xyXG4gICAgdmFyIG8gPSBcclxuICAgIHtcclxuICAgICAgICByIDogTWF0aC5mbG9vcihhcnJbMF0pLCBcclxuICAgICAgICBnIDogTWF0aC5mbG9vcihhcnJbMV0pLCBcclxuICAgICAgICBiIDogTWF0aC5mbG9vcihhcnJbMl0pXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuICBvO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIGEgY29sb3IgdG8gYW4gcmdiYSBzdHJpbmcuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gYyAgICAgICAgVGhlIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gb3BhY2l0eSAgVGhlIG9wYWNpdHkgdmFsdWUgMCB0byAxLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9IEFuIHJnYmEgY29sb3Igc3RyaW5nICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSknIG9yIHVuZGVmaW5lZCBpZiBub3QgYSB2YWxpZCBjb2xvci5cclxuICovXHJcbnZhciB0b1JHQkEgPSBmdW5jdGlvbihjLCBvcGFjaXR5KVxyXG57XHJcbiAgICB2YXIgbztcclxuICAgIGlmIChpc1JHQkEoYykgJiYgb3BhY2l0eSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHJldHVybiBjOyBcclxuICAgIGVsc2UgaWYgKGlzUkdCKGMpKVxyXG4gICAgICAgIG8gPSBjb21wb25lbnRDb2xvcnMoYyk7IFxyXG4gICAgZWxzZSBpZiAoaXNIZXgoYykpICAgICAgIFxyXG4gICAgICAgIG8gPSBoZXhUb1JHQihjKTtcclxuICAgIGVsc2UgaWYgKGlzQ29sb3JOYW1lKGMpKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBoZXggPSBjb2xvck5hbWVUb0hleChjKTtcclxuICAgICAgICBvID0gaGV4VG9SR0IoaGV4KTtcclxuICAgIH0gICBcclxuICAgIGVsc2UgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIFxyXG4gICAgby5hID0gb3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gb3BhY2l0eSA6IDE7ICBcclxuICAgIHJldHVybiAncmdiYSgnK28ucisnLCcrby5nKycsJytvLmIrJywnK28uYSsnKSc7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG57XHJcbiAgICBpc0NvbG9yICAgICAgICAgOiBpc0NvbG9yLFxyXG4gICAgaXNIZXggICAgICAgICAgIDogaXNIZXgsXHJcbiAgICBpc1JHQiAgICAgICAgICAgOiBpc1JHQixcclxuICAgIGlzUkdCQSAgICAgICAgICA6IGlzUkdCQSxcclxuICAgIHRvUkdCQSAgICAgICAgICA6IHRvUkdCQVxyXG59OyIsIi8qIGpzaGludCBicm93c2VyaWZ5OiB0cnVlICovXHJcbi8qIGdsb2JhbHMgREVCVUcgKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgICAgQ29udGFpbnMgZnVuY3Rpb25zIGZvciBtYW5pcHVsYXRpbmcgdGhlIGRvbS5cclxuICogQGF1dGhvciAgICAgICAgICBKb25hdGhhbiBDbGFyZSBcclxuICogQGNvcHlyaWdodCAgICAgICBGbG93aW5nQ2hhcnRzIDIwMTVcclxuICogQG1vZHVsZSAgICAgICAgICBkb20gXHJcbiAqL1xyXG5cclxuLy8gQW5pbWF0aW9uIHBvbHlmaWxsLlxyXG52YXIgbGFzdFRpbWUgPSAwO1xyXG52YXIgdmVuZG9ycyAgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xyXG52YXIgcmFmICAgICAgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xyXG52YXIgY2FmICAgICAgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWU7XHJcbmZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXJhZjsgKyt4KSBcclxue1xyXG4gICAgcmFmID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xyXG4gICAgY2FmID0gd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xyXG59XHJcbmlmICghcmFmKVxyXG57XHJcbiAgICByYWYgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIFxyXG4gICAge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSAgID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XHJcbiAgICAgICAgdmFyIGlkICAgICAgICAgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7Y2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTt9LCB0aW1lVG9DYWxsKTtcclxuICAgICAgICBsYXN0VGltZSAgICAgICA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcclxuICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICB9O1xyXG59XHJcbmlmICghY2FmKVxyXG57XHJcbiAgICBjYWYgPSBmdW5jdGlvbiAoaWQpIHtjbGVhclRpbWVvdXQoaWQpO307XHJcbn1cclxuXHJcbi8qKiBcclxuICogUmVxdWVzdCBhbmltYXRpb24uXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBGdW5jdGlvbiB0byBjYWxsIHdoZW4gaXQncyB0aW1lIHRvIHVwZGF0ZSB5b3VyIGFuaW1hdGlvbiBmb3IgdGhlIG5leHQgcmVwYWludFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSByZXF1ZXN0IGlkLCB0aGF0IHVuaXF1ZWx5IGlkZW50aWZpZXMgdGhlIGVudHJ5IGluIHRoZSBjYWxsYmFjayBsaXN0LlxyXG4gKi9cclxudmFyIHJlcXVlc3RBbmltYXRpb24gPSBmdW5jdGlvbiAoY2FsbGJhY2spXHJcbntcclxuICAgIHJldHVybiByYWYoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDYW5jZWwgYW5pbWF0aW9uLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGlkIFRoZSBpZCB2YWx1ZSByZXR1cm5lZCBieSB0aGUgY2FsbCB0byByZXF1ZXN0QW5pbWF0aW9uKCkgdGhhdCByZXF1ZXN0ZWQgdGhlIGNhbGxiYWNrLlxyXG4gKi9cclxudmFyIGNhbmNlbEFuaW1hdGlvbiA9IGZ1bmN0aW9uIChpZClcclxue1xyXG4gICAgY2FmKGlkKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ2hlY2sgZm9yIHN1cHBvcnQgb2YgYSBmZWF0dXJlLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IFRoZSBmZWF0dXJlIG5hbWUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBUaGUgdmVyc2lvbiBvZiB0aGUgc3BlY2lmaWNhdGlvbiBkZWZpbmluZyB0aGUgZmVhdHVyZS5cclxuICpcclxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgZnVuY3Rpb25hbGl0eSwgb3RoZXJ3aXNlIGZhbHNlLlxyXG4gKi9cclxudmFyIGlzU3VwcG9ydGVkID0gZnVuY3Rpb24gKGZlYXR1cmUsIHZlcnNpb24pXHJcbntcclxuICAgIHJldHVybiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKGZlYXR1cmUsIHZlcnNpb24pO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBBcHBlbmRzIHRoZSBjaGlsZCBlbGVtZW50IHRvIHRoZSBwYXJlbnQuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudEVsZW1lbnQgICBUaGUgcGFyZW50IGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNoaWxkRWxlbWVudCAgICBUaGUgY2hpbGQgZWxlbWVudC5cclxuICovXHJcbnZhciBhcHBlbmRDaGlsZCA9IGZ1bmN0aW9uIChwYXJlbnRFbGVtZW50LCBjaGlsZEVsZW1lbnQpXHJcbntcclxuICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQXBwZW5kcyB0ZXh0IHRvIHRoZSB0YXJnZXQgZWxlbWVudC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgdGFyZ2V0IGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIHRleHQgICAgVGhlIHRleHQgdG8gYWRkLlxyXG4gKi9cclxudmFyIGFwcGVuZFRleHQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdGV4dClcclxue1xyXG4gICAgdmFyIHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCk7ICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgIGFwcGVuZENoaWxkKGVsZW1lbnQsIHRleHROb2RlKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQXBwZW5kcyBodG1sIHRvIHRoZSB0YXJnZXQgZWxlbWVudC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgdGFyZ2V0IGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIGh0bWwgICAgVGhlIGh0bWwgdG8gYWRkLlxyXG4gKi9cclxudmFyIGh0bWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgaHRtbClcclxue1xyXG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBSZW1vdmVzIGFuIGVsZW1lbnQuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gcmVtb3ZlLlxyXG4gKi9cclxudmFyIHJlbW92ZSA9IGZ1bmN0aW9uIChlbGVtZW50KVxyXG57XHJcbiAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEVtcHRpZXMgdGhlIHRhcmdldCBlbGVtZW50LlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSB0YXJnZXQgZWxlbWVudC5cclxuICovXHJcbnZhciBlbXB0eSA9IGZ1bmN0aW9uIChlbGVtZW50KVxyXG57XHJcbiAgICB3aGlsZSAoZWxlbWVudC5maXJzdENoaWxkKSBcclxuICAgIHtcclxuICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFNldHMgdGhlIGF0dHJpYnV0ZXMgZm9yIHRoZSB0YXJnZXQgZWxlbWVudC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgICAgVGhlIHRhcmdldCBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge29iamVjdH0gICAgICBhdHRyaWJ1dGVzICBUaGUgbGlzdCBvZiBhdHRyaWJ1dGVzLlxyXG4gKi9cclxudmFyIGF0dHIgPSBmdW5jdGlvbiAoZWxlbWVudCwgYXR0cmlidXRlcylcclxue1xyXG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYXR0cmlidXRlcykgXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSAgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShwcm9wZXJ0eSwgYXR0cmlidXRlc1twcm9wZXJ0eV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbi8qKiBcclxuICogUmVtb3ZlcyB0aGUgYXR0cmlidXRlcyBmcm9tIHRoZSB0YXJnZXQgZWxlbWVudC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgICAgVGhlIHRhcmdldCBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSAgICBhdHRyaWJ1dGVzICBUaGUgbGlzdCBvZiBhdHRyaWJ1dGVzIHRvIHJlbW92ZS5cclxuICovXHJcbnZhciByZW1vdmVBdHRyID0gZnVuY3Rpb24gKGVsZW1lbnQsIGF0dHJpYnV0ZXMpXHJcbntcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykgIFxyXG4gICAge1xyXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZXNbaV0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBTZXRzIHRoZSBzdHlsZSBmb3IgdGhlIHRhcmdldCBlbGVtZW50LlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50ICAgICBUaGUgdGFyZ2V0IGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSAgICAgIHN0eWxlcyAgICAgIFRoZSBsaXN0IG9mIHN0eWxlIGF0dHJpYnV0ZXMuXHJcbiAqL1xyXG52YXIgc3R5bGUgPSBmdW5jdGlvbiAoZWxlbWVudCwgc3R5bGVzKVxyXG57XHJcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzdHlsZXMpIFxyXG4gICAge1xyXG4gICAgICAgIGlmIChzdHlsZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSAgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BlcnR5XSA9IHN0eWxlc1twcm9wZXJ0eV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDcmVhdGVzIGEgaHRtbCBlbGVtZW50IHdpdGggdGhlIGdpdmVuIGF0dHJpYnV0ZXMuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlICAgICAgICAgVGhlIGVsZW1lbnQgdHlwZS5cclxuICogQHBhcmFtIHtvYmplY3R9IGF0dHJpYnV0ZXMgICBUaGUgbGlzdCBvZiBhdHRyaWJ1dGVzLlxyXG4gKiBcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICBUaGUgaHRtbCBlbGVtZW50LlxyXG4gKi9cclxudmFyIGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSwgYXR0cmlidXRlcylcclxue1xyXG4gICAgdmFyIGh0bWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcclxuICAgIGF0dHIoaHRtbEVsZW1lbnQsIGF0dHJpYnV0ZXMpO1xyXG4gICAgcmV0dXJuIGh0bWxFbGVtZW50O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDcmVhdGVzIGFuIHN2ZyBlbGVtZW50IHdpdGggdGhlIGdpdmVuIGF0dHJpYnV0ZXMuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlICAgICAgICAgVGhlIGVsZW1lbnQgdHlwZS5cclxuICogQHBhcmFtIHtvYmplY3R9IGF0dHJpYnV0ZXMgICBUaGUgbGlzdCBvZiBhdHRyaWJ1dGVzLlxyXG4gKiBcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICBUaGUgaHRtbCBlbGVtZW50LlxyXG4gKi9cclxudmFyIGNyZWF0ZVNWR0VsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSwgYXR0cmlidXRlcylcclxue1xyXG4gICAgdmFyIHN2Z0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdHlwZSk7XHJcbiAgICBhdHRyKHN2Z0VsZW1lbnQsIGF0dHJpYnV0ZXMpO1xyXG4gICAgcmV0dXJuIHN2Z0VsZW1lbnQ7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEhpZGVzIHRoZSB0YXJnZXQgZWxlbWVudC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgdGFyZ2V0IGVsZW1lbnQuXHJcbiAqL1xyXG52YXIgaGlkZSA9IGZ1bmN0aW9uIChlbGVtZW50KVxyXG57XHJcbiAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxufTtcclxuXHJcbi8qKiBcclxuICogU2hvd3MgdGhlIHRhcmdldCBlbGVtZW50LlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSB0YXJnZXQgZWxlbWVudC5cclxuICovXHJcbnZhciBzaG93ID0gZnVuY3Rpb24gKGVsZW1lbnQpXHJcbntcclxuICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIG9wYWNpdHkgb2YgYW4gZWxlbWVudC5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gIGVsZW1lbnQgVGhlIHRhcmdldCBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAgYWxwaGEgICBUaGUgYWxwaGEgdmFsdWUgMCAtIDEuXHJcbiAqIFxyXG4gKi9cclxudmFyIG9wYWNpdHkgPSBmdW5jdGlvbihlbGVtZW50LCBhbHBoYSkgXHJcbntcclxuICAgIHN0eWxlKGVsZW1lbnQsIHtvcGFjaXR5OmFscGhhLCBmaWx0ZXI6J2FscGhhKG9wYWNpdHk9JyArIGFscGhhICogMTAwICsgJyknfSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENoZWNrIGlmIGFuIGVsZW1lbnQgaXMgdmlzaWJsZS5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgdGFyZ2V0IGVsZW1lbnQuXHJcbiAqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHZpc2libGUsIG90aGVyd2lzZSBmYWxzZS5cclxuICovXHJcbnZhciBpc1Zpc2libGUgPSBmdW5jdGlvbiAoZWxlbWVudCkgXHJcbntcclxuICAgIGlmIChlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPT09ICdoaWRkZW4nKSAgcmV0dXJuIGZhbHNlO1xyXG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgdGFyZ2V0IGVsZW1lbnQuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgIFRoZSB0YXJnZXQgZWxlbWVudC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdHlwZXMgICAgQSBzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9mIGV2ZW50IHR5cGVzLlxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICBsaXN0ZW5lciBUaGUgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIG5vdGlmaWNhdGlvbiB3aGVuIGFuIGV2ZW50IG9mIHRoZSBzcGVjaWZpZWQgdHlwZSBvY2N1cnMuXHJcbiAqL1xyXG52YXIgb24gPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZXMsIGxpc3RlbmVyKVxyXG57XHJcbiAgICB2YXIgYXJyVHlwZXMgPSB0eXBlcy5zcGxpdCgnICcpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJUeXBlcy5sZW5ndGg7IGkrKykgIFxyXG4gICAge1xyXG4gICAgICAgIHZhciB0eXBlID0gYXJyVHlwZXNbaV0udHJpbSgpO1xyXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcik7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdGFyZ2V0IGVsZW1lbnQuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgIFRoZSB0YXJnZXQgZWxlbWVudC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdHlwZXMgICAgQSBzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9mIGV2ZW50IHR5cGVzLlxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICBsaXN0ZW5lciBUaGUgZnVuY3Rpb24gdG8gcmVtb3ZlIGZyb20gdGhlIGV2ZW50IHRhcmdldC5cclxuICovXHJcbnZhciBvZmYgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZXMsIGxpc3RlbmVyKVxyXG57XHJcbiAgICB2YXIgYXJyVHlwZXMgPSB0eXBlcy5zcGxpdCgnICcpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJUeXBlcy5sZW5ndGg7IGkrKykgIFxyXG4gICAge1xyXG4gICAgICAgIHZhciB0eXBlID0gYXJyVHlwZXNbaV0udHJpbSgpO1xyXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcik7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJldHVybiB0aGUgYm91bmRzIG9mIHRoZSB0YXJnZXQgZWxlbWVudCByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIHRhcmdldCBlbGVtZW50LlxyXG4gKiBcclxuICogQHJldHVybiB7RE9NUmVjdH0gVGhlIHNpemUgb2YgdGhlIGVsZW1lbnQgYW5kIGl0cyBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuXHJcbiAqL1xyXG52YXIgYm91bmRzID0gZnVuY3Rpb24gKGVsZW1lbnQpIFxyXG57XHJcbiAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ2hlY2sgaWYgYSByZWN0IGlzIGZ1bGx5IGNvbnRhaW5lZCB3aXRoaW4gdGhlIHZpZXdwb3J0LlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIFxyXG4gKiBAcGFyYW0ge09iamVjdH0gcmVjdCAgICAgICAgIFRoZSByZWN0YW5nbGUgdG8gdGVzdCAtIGNvb3JkcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcmVjdC50b3AgICAgIFRoZSB0b3AgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByZWN0LnJpZ2h0ICAgVGhlIHJpZ2h0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcmVjdC5ib3R0b20gIFRoZSBib3R0b20gdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByZWN0LmxlZnQgICAgVGhlIGxlZnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbWFyZ2luID0gMF0gQW4gb3B0aW9uYWwgbWFyZ2luIHRoYXQgaXMgYXBwbGllZCB0byB0aGUgcmVjdC5cclxuICogXHJcbiAqIEByZXR1cm4ge29iamVjdH0gQSByZWN0YW5nbGUgdGhhdCBjb250YWlucyB0aGUgYW1vdW50IG9mIG92ZXJsYXAgZm9yIGVhY2ggZWRnZSByZWN0e3RvcDowLCByaWdodDowLCBib3R0b206MCwgbGVmdDowfS5cclxuICovXHJcbnZhciBpc1JlY3RJblZpZXdwb3J0ID0gZnVuY3Rpb24gKHJlY3QsIG1hcmdpbikgXHJcbntcclxuICAgIHZhciB3ID0gdmlld3BvcnRXaWR0aCgpO1xyXG4gICAgdmFyIGggPSB2aWV3cG9ydEhlaWdodCgpO1xyXG4gICAgbWFyZ2luID0gbWFyZ2luICE9PSB1bmRlZmluZWQgPyBtYXJnaW4gOiAwO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0b3AgICAgIDogcmVjdC50b3AgIC0gbWFyZ2luIDwgMCAgID8gKHJlY3QudG9wIC0gbWFyZ2luKSAqIC0xICA6IDAsXHJcbiAgICAgICAgcmlnaHQgICA6IHJlY3QucmlnaHQgKyBtYXJnaW4gPiB3ICA/IHJlY3QucmlnaHQgKyBtYXJnaW4gLSB3ICAgOiAwLFxyXG4gICAgICAgIGJvdHRvbSAgOiByZWN0LmJvdHRvbSArIG1hcmdpbiA+IGggPyByZWN0LmJvdHRvbSArIG1hcmdpbiAtIGggIDogMCxcclxuICAgICAgICBsZWZ0ICAgIDogcmVjdC5sZWZ0IC0gbWFyZ2luIDwgMCAgID8gKHJlY3QubGVmdCAtIG1hcmdpbikgKiAtMSA6IDBcclxuICAgIH07XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCB0aGUgdmlld3BvcnQgd2lkdGguXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIHZpZXdwb3J0IHdpZHRoLlxyXG4gKi9cclxudmFyIHZpZXdwb3J0V2lkdGggPSBmdW5jdGlvbiAoKSBcclxue1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0IHRoZSB2aWV3cG9ydCBoZWlnaHQuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIHZpZXdwb3J0IGhlaWdodC5cclxuICovXHJcbnZhciB2aWV3cG9ydEhlaWdodCA9IGZ1bmN0aW9uICgpIFxyXG57XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJuIHRoZSBwYWdlIG9mZnNldCAodGhlIGFtb3VudCB0aGUgcGFnZSBpcyBzY3JvbGxlZCkuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEByZXR1cm4ge09iamVjdH0ge3g6bnVtYmVyLCB5Om51bWJlcn0uXHJcbiAqL1xyXG52YXIgcGFnZU9mZnNldCA9IGZ1bmN0aW9uICgpIFxyXG57XHJcbiAgICB2YXIgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4IDogKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2Muc2Nyb2xsTGVmdCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMCksXHJcbiAgICAgICAgeSA6ICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgIC0gKGRvYy5jbGllbnRUb3AgfHwgMClcclxuICAgIH07XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSB3aW5kb3cgb2JqZWN0IG9mIGFuIGVsZW1lbnQuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICBlbGVtZW50IFRoZSB0YXJnZXQgZWxlbWVudC5cclxuICogXHJcbiAqIEByZXR1cm5zIHtEb2N1bWVudFZpZXd8V2luZG93fSBUaGUgd2luZG93LlxyXG4gKi9cclxudmFyIGdldFdpbmRvd0ZvckVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSBcclxue1xyXG4gICAgdmFyIGRvYyA9IGVsZW1lbnQub3duZXJEb2N1bWVudCB8fCBlbGVtZW50O1xyXG4gICAgcmV0dXJuIChkb2MuZGVmYXVsdFZpZXcgfHwgZG9jLnBhcmVudFdpbmRvdyB8fCB3aW5kb3cpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBcclxue1xyXG4gICAgaXNTdXBwb3J0ZWQgICAgICAgICAgICAgOiBpc1N1cHBvcnRlZCxcclxuICAgIGFwcGVuZENoaWxkICAgICAgICAgICAgIDogYXBwZW5kQ2hpbGQsXHJcbiAgICBhcHBlbmRUZXh0ICAgICAgICAgICAgICA6IGFwcGVuZFRleHQsXHJcbiAgICBodG1sICAgICAgICAgICAgICAgICAgICA6IGh0bWwsXHJcbiAgICByZW1vdmUgICAgICAgICAgICAgICAgICA6IHJlbW92ZSxcclxuICAgIGVtcHR5ICAgICAgICAgICAgICAgICAgIDogZW1wdHksXHJcbiAgICBhdHRyICAgICAgICAgICAgICAgICAgICA6IGF0dHIsXHJcbiAgICByZW1vdmVBdHRyICAgICAgICAgICAgICA6IHJlbW92ZUF0dHIsXHJcbiAgICBzdHlsZSAgICAgICAgICAgICAgICAgICA6IHN0eWxlLFxyXG4gICAgY3JlYXRlRWxlbWVudCAgICAgICAgICAgOiBjcmVhdGVFbGVtZW50LFxyXG4gICAgY3JlYXRlU1ZHRWxlbWVudCAgICAgICAgOiBjcmVhdGVTVkdFbGVtZW50LFxyXG4gICAgb24gICAgICAgICAgICAgICAgICAgICAgOiBvbixcclxuICAgIG9mZiAgICAgICAgICAgICAgICAgICAgIDogb2ZmLFxyXG4gICAgaGlkZSAgICAgICAgICAgICAgICAgICAgOiBoaWRlLFxyXG4gICAgc2hvdyAgICAgICAgICAgICAgICAgICAgOiBzaG93LFxyXG4gICAgb3BhY2l0eSAgICAgICAgICAgICAgICAgOiBvcGFjaXR5LFxyXG4gICAgaXNWaXNpYmxlICAgICAgICAgICAgICAgOiBpc1Zpc2libGUsXHJcbiAgICBib3VuZHMgICAgICAgICAgICAgICAgICA6IGJvdW5kcyxcclxuICAgIGlzUmVjdEluVmlld3BvcnQgICAgICAgIDogaXNSZWN0SW5WaWV3cG9ydCxcclxuICAgIHZpZXdwb3J0V2lkdGggICAgICAgICAgIDogdmlld3BvcnRXaWR0aCxcclxuICAgIHZpZXdwb3J0SGVpZ2h0ICAgICAgICAgIDogdmlld3BvcnRIZWlnaHQsXHJcbiAgICBwYWdlT2Zmc2V0ICAgICAgICAgICAgICA6IHBhZ2VPZmZzZXQsXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uICAgICAgICA6IHJlcXVlc3RBbmltYXRpb24sXHJcbiAgICBjYW5jZWxBbmltYXRpb24gICAgICAgICA6IGNhbmNlbEFuaW1hdGlvbixcclxuICAgIGdldFdpbmRvd0ZvckVsZW1lbnQgICAgIDogZ2V0V2luZG93Rm9yRWxlbWVudFxyXG59OyIsIi8qIGpzaGludCBicm93c2VyaWZ5OiB0cnVlICovXHJcbi8qIGdsb2JhbHMgREVCVUcgKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgICAgQ29udGFpbnMgZnVuY3Rpb25zIGZvciBtYW5pcHVsYXRpbmcgc3ZnLlxyXG4gKiBAYXV0aG9yICAgICAgICAgIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0ICAgICAgIEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlICAgICAgICAgIHN2ZyBcclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9kb21cclxuICogQHJlcXVpcmVzICAgICAgICB1dGlscy9jb2xvclxyXG4gKi9cclxuXHJcbi8vIFJlcXVpcmVkIG1vZHVsZXMuXHJcbnZhciBkb20gICAgICAgPSByZXF1aXJlKCcuLi91dGlscy9kb20nKTtcclxudmFyIGNvbG9yVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWxzL2NvbG9yJyk7XHJcblxyXG4vKiogXHJcbiAqIENyZWF0ZXMgYW4gc3ZnIGVsZW1lbnQgd2l0aCB0aGUgZ2l2ZW4gYXR0cmlidXRlcy5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSBzdmcgZWxlbWVudCB0eXBlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtvYmplY3R9IGF0dHJpYnV0ZXMgVGhlIGxpc3Qgb2YgYXR0cmlidXRlcy5cclxuICovXHJcbnZhciBjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGF0dHJpYnV0ZXMpXHJcbntcclxuICAgIHJldHVybiBkb20uY3JlYXRlU1ZHRWxlbWVudCh0eXBlLCBhdHRyaWJ1dGVzKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ2hlY2tzIGZvciBzdmcgc3VwcG9ydC5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhlIGdyYXBoaWNzIGxpYnJhcnksIG90aGVyd2lzZSBmYWxzZS5cclxuICovXHJcbnZhciBpc1N1cHBvcnRlZCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICAgIHJldHVybiBkb20uaXNTdXBwb3J0ZWQoJ2h0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZlYXR1cmUjU2hhcGUnLCAnMS4wJyk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJldHVybnMgYSBkcmF3aW5nIGNhbnZhcy5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IEFuIHN2ZyBlbGVtZW50LlxyXG4gKi9cclxudmFyIGdldENhbnZhcyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICAgIHZhciBjYW52YXMgPSBjcmVhdGVFbGVtZW50KCdzdmcnKTsgXHJcbiAgICBkb20uc3R5bGUoY2FudmFzLCB7cG9zaXRpb246J2Fic29sdXRlJywgbGVmdDowLCByaWdodDowfSk7XHJcbiAgICByZXR1cm4gY2FudmFzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBSZXR1cm5zIGFuIHN2ZyBlbGVtZW50IG9mIHRoZSBnaXZlbiB0eXBlLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtTVkdFbGVtZW50fSAgcGFyZW50RWxlbWVudCAgIFRoZSBwYXJlbnQgZWxlbWVudC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdHlwZSAgICAgICAgICAgIFRoZSBlbGVtZW50IHR5cGUuXHJcbiAqXHJcbiAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IEFuIHN2ZyBlbGVtZW50LlxyXG4gKi9cclxudmFyIGdldENvbnRleHQgPSBmdW5jdGlvbiAocGFyZW50RWxlbWVudCwgdHlwZSlcclxue1xyXG4gICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHR5cGUpO1xyXG4gICAgZG9tLmFwcGVuZENoaWxkKHBhcmVudEVsZW1lbnQsIGVsZW1lbnQpO1xyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENsZWFycyB0aGUgZWxlbWVudC5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7U1ZHRWxlbWVudH0gZWxlbWVudCBUaGUgc3ZnIGVsZW1lbnQuXHJcbiAqL1xyXG52YXIgY2xlYXIgPSBmdW5jdGlvbiAoZWxlbWVudClcclxue1xyXG5cclxufTtcclxuXHJcbi8qKiBcclxuICogRW1wdGllcyB0aGUgZWxlbWVudC5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7U1ZHRWxlbWVudH0gZWxlbWVudCBUaGUgc3ZnIGVsZW1lbnQuXHJcbiAqL1xyXG52YXIgZW1wdHkgPSBmdW5jdGlvbiAoZWxlbWVudClcclxue1xyXG4gICAgZG9tLmVtcHR5KGVsZW1lbnQpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBEcmF3cyBhIGNpcmNsZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7U1ZHRWxlbWVudH0gIGVsZW1lbnQgICAgICAgICAgICAgVGhlIHN2ZyBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBjeCAgICAgICAgICAgICAgICAgIFRoZSB4IHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZS5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgY3kgICAgICAgICAgICAgICAgICBUaGUgeSBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIHIgICAgICAgICAgICAgICAgICAgVGhlIGNpcmNsZSByYWRpdXMuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIFtzdHlsZV0gICAgICAgICAgICAgVGhlIHN0eWxlIHByb3BlcnRpZXMuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtzdHlsZS5maWxsQ29sb3JdICAgVGhlIGZpbGwgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtzdHlsZS5maWxsT3BhY2l0eV0gVGhlIGZpbGwgb3BhY2l0eS4gVGhpcyBpcyBvdmVycmlkZW4gYnkgdGhlIGZpbGxDb2xvciBpZiBpdCBjb250YWlucyBhbiBhbHBoYSB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmxpbmVDb2xvcl0gICBUaGUgbGluZSBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW3N0eWxlLmxpbmVXaWR0aF0gICBUaGUgbGluZSB3aWR0aC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmxpbmVKb2luXSAgICBUaGUgbGluZSBqb2luLCBvbmUgb2YgXCJiZXZlbFwiLCBcInJvdW5kXCIsIFwibWl0ZXJcIi5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmxpbmVDYXBdICAgICBUaGUgbGluZSBjYXAsIG9uZSBvZiBcImJ1dHRcIiwgXCJyb3VuZFwiLCBcInNxdWFyZVwiLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbc3R5bGUubGluZU9wYWNpdHldIFRoZSBsaW5lIG9wYWNpdHkuIFRoaXMgaXMgb3ZlcnJpZGVuIGJ5IHRoZSBsaW5lQ29sb3IgaWYgaXQgY29udGFpbnMgYW4gYWxwaGEgdmFsdWUuXHJcbiAqL1xyXG52YXIgY2lyY2xlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGN4LCBjeSwgciwgc3R5bGUpXHJcbntcclxuICAgIGRvbS5hdHRyKGVsZW1lbnQsIHtjeDpjeCwgY3k6Y3ksIHI6cn0pO1xyXG4gICAgZHJhdyhlbGVtZW50LCBzdHlsZSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIERyYXdzIGFuIGVsbGlwc2UuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge1NWR0VsZW1lbnR9ICBlbGVtZW50ICAgICAgICAgICAgIFRoZSBzdmcgZWxlbWVudC5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgY3ggICAgICAgICAgICAgICAgICBUaGUgeCBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoZSBlbGxpcHNlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBjeSAgICAgICAgICAgICAgICAgIFRoZSB5IHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGVsbGlwc2VcclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgcnggICAgICAgICAgICAgICAgICBUaGUgeCByYWRpdXMgb2YgdGhlIGVsbGlwc2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIHJ5ICAgICAgICAgICAgICAgICAgVGhlIHkgcmFkaXVzIG9mIHRoZSBlbGxpcHNlLlxyXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICBbc3R5bGVdICAgICAgICAgICAgIFRoZSBzdHlsZSBwcm9wZXJ0aWVzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUuZmlsbENvbG9yXSAgIFRoZSBmaWxsIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbc3R5bGUuZmlsbE9wYWNpdHldIFRoZSBmaWxsIG9wYWNpdHkuIFRoaXMgaXMgb3ZlcnJpZGVuIGJ5IHRoZSBmaWxsQ29sb3IgaWYgaXQgY29udGFpbnMgYW4gYWxwaGEgdmFsdWUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtzdHlsZS5saW5lQ29sb3JdICAgVGhlIGxpbmUgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtzdHlsZS5saW5lV2lkdGhdICAgVGhlIGxpbmUgd2lkdGguXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtzdHlsZS5saW5lSm9pbl0gICAgVGhlIGxpbmUgam9pbiwgb25lIG9mIFwiYmV2ZWxcIiwgXCJyb3VuZFwiLCBcIm1pdGVyXCIuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtzdHlsZS5saW5lQ2FwXSAgICAgVGhlIGxpbmUgY2FwLCBvbmUgb2YgXCJidXR0XCIsIFwicm91bmRcIiwgXCJzcXVhcmVcIi5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW3N0eWxlLmxpbmVPcGFjaXR5XSBUaGUgbGluZSBvcGFjaXR5LiBUaGlzIGlzIG92ZXJyaWRlbiBieSB0aGUgbGluZUNvbG9yIGlmIGl0IGNvbnRhaW5zIGFuIGFscGhhIHZhbHVlLlxyXG4gKi9cclxudmFyIGVsbGlwc2UgPSBmdW5jdGlvbiAoZWxlbWVudCwgY3gsIGN5LCByeCwgcnksIHN0eWxlKVxyXG57XHJcbiAgICBkb20uYXR0cihlbGVtZW50LCB7Y3g6Y3gsIGN5OmN5LCByeDpyeCwgcnk6cnl9KTtcclxuICAgIGRyYXcoZWxlbWVudCwgc3R5bGUpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBEcmF3cyBhIHJlY3RhbmdsZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7U1ZHRWxlbWVudH0gIGVsZW1lbnQgICAgICAgICAgICAgVGhlIHN2ZyBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICB4ICAgICAgICAgICAgICAgICAgIFRoZSB4IHBvc2l0aW9uIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIHkgICAgICAgICAgICAgICAgICAgVGhlIHkgcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgdyAgICAgICAgICAgICAgICAgICBUaGUgd2lkdGguXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIGggICAgICAgICAgICAgICAgICAgVGhlIGhlaWdodC5cclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgW3N0eWxlXSAgICAgICAgICAgICBUaGUgc3R5bGUgcHJvcGVydGllcy5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmZpbGxDb2xvcl0gICBUaGUgZmlsbCBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW3N0eWxlLmZpbGxPcGFjaXR5XSBUaGUgZmlsbCBvcGFjaXR5LiBUaGlzIGlzIG92ZXJyaWRlbiBieSB0aGUgZmlsbENvbG9yIGlmIGl0IGNvbnRhaW5zIGFuIGFscGhhIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUubGluZUNvbG9yXSAgIFRoZSBsaW5lIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbc3R5bGUubGluZVdpZHRoXSAgIFRoZSBsaW5lIHdpZHRoLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUubGluZUpvaW5dICAgIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUubGluZUNhcF0gICAgIFRoZSBsaW5lIGNhcCwgb25lIG9mIFwiYnV0dFwiLCBcInJvdW5kXCIsIFwic3F1YXJlXCIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtzdHlsZS5saW5lT3BhY2l0eV0gVGhlIGxpbmUgb3BhY2l0eS4gVGhpcyBpcyBvdmVycmlkZW4gYnkgdGhlIGxpbmVDb2xvciBpZiBpdCBjb250YWlucyBhbiBhbHBoYSB2YWx1ZS5cclxuICovXHJcbnZhciByZWN0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHgsIHksIHcsIGgsIHN0eWxlKVxyXG57XHJcbiAgICBkb20uYXR0cihlbGVtZW50LCB7eDp4LCB5OnksIHdpZHRoOncsIGhlaWdodDpofSk7XHJcbiAgICBkcmF3KGVsZW1lbnQsIHN0eWxlKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogRHJhd3MgYSBsaW5lLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICpcclxuICogQHBhcmFtIHtTVkdFbGVtZW50fSAgZWxlbWVudCAgICAgICAgICAgICBUaGUgc3ZnIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIHgxICAgICAgICAgICAgICAgICAgVGhlIHggcG9zaXRpb24gb2YgcG9pbnQgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgeTEgICAgICAgICAgICAgICAgICBUaGUgeSBwb3NpdGlvbiBvZiBwb2ludCAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICB4MiAgICAgICAgICAgICAgICAgIFRoZSB4IHBvc2l0aW9uIG9mIHBvaW50IDIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIHkyICAgICAgICAgICAgICAgICAgVGhlIHkgcG9zaXRpb24gb2YgcG9pbnQgMi5cclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgW3N0eWxlXSAgICAgICAgICAgICBUaGUgc3R5bGUgcHJvcGVydGllcy5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmZpbGxDb2xvcl0gICBUaGUgZmlsbCBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW3N0eWxlLmZpbGxPcGFjaXR5XSBUaGUgZmlsbCBvcGFjaXR5LiBUaGlzIGlzIG92ZXJyaWRlbiBieSB0aGUgZmlsbENvbG9yIGlmIGl0IGNvbnRhaW5zIGFuIGFscGhhIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUubGluZUNvbG9yXSAgIFRoZSBsaW5lIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbc3R5bGUubGluZVdpZHRoXSAgIFRoZSBsaW5lIHdpZHRoLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUubGluZUpvaW5dICAgIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUubGluZUNhcF0gICAgIFRoZSBsaW5lIGNhcCwgb25lIG9mIFwiYnV0dFwiLCBcInJvdW5kXCIsIFwic3F1YXJlXCIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtzdHlsZS5saW5lT3BhY2l0eV0gVGhlIGxpbmUgb3BhY2l0eS4gVGhpcyBpcyBvdmVycmlkZW4gYnkgdGhlIGxpbmVDb2xvciBpZiBpdCBjb250YWlucyBhbiBhbHBoYSB2YWx1ZS5cclxuICovXHJcbnZhciBsaW5lID0gZnVuY3Rpb24gKGVsZW1lbnQsIHgxLCB5MSwgeDIsIHkyLCBzdHlsZSlcclxue1xyXG4gICAgZG9tLmF0dHIoZWxlbWVudCwge3gxOngxLCB5MTp5MSwgeDI6eDIsIHkyOnkyfSk7XHJcbiAgICBkcmF3KGVsZW1lbnQsIHN0eWxlKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogRHJhd3MgYSBwb2x5bGluZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7U1ZHRWxlbWVudH0gIGVsZW1lbnQgICAgICAgICAgICAgVGhlIHN2ZyBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge251bWJlcltdfSAgICBhcnJDb29yZHMgICAgICAgICAgIEFuIGFycmF5IG9mIHh5IHBvc2l0aW9ucyBvZiB0aGUgZm9ybSBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0Li4uXS5cclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgW3N0eWxlXSAgICAgICAgICAgICBUaGUgc3R5bGUgcHJvcGVydGllcy5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmZpbGxDb2xvcl0gICBUaGUgZmlsbCBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW3N0eWxlLmZpbGxPcGFjaXR5XSBUaGUgZmlsbCBvcGFjaXR5LiBUaGlzIGlzIG92ZXJyaWRlbiBieSB0aGUgZmlsbENvbG9yIGlmIGl0IGNvbnRhaW5zIGFuIGFscGhhIHZhbHVlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUubGluZUNvbG9yXSAgIFRoZSBsaW5lIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbc3R5bGUubGluZVdpZHRoXSAgIFRoZSBsaW5lIHdpZHRoLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUubGluZUpvaW5dICAgIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBbc3R5bGUubGluZUNhcF0gICAgIFRoZSBsaW5lIGNhcCwgb25lIG9mIFwiYnV0dFwiLCBcInJvdW5kXCIsIFwic3F1YXJlXCIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtzdHlsZS5saW5lT3BhY2l0eV0gVGhlIGxpbmUgb3BhY2l0eS4gVGhpcyBpcyBvdmVycmlkZW4gYnkgdGhlIGxpbmVDb2xvciBpZiBpdCBjb250YWlucyBhbiBhbHBoYSB2YWx1ZS5cclxuICovXHJcbnZhciBwb2x5bGluZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBhcnJDb29yZHMsIHN0eWxlKVxyXG57XHJcbiAgICBkb20uYXR0cihlbGVtZW50LCB7cG9pbnRzOmdldENvb3Jkc0FzU3RyaW5nKGFyckNvb3Jkcyl9KTtcclxuICAgIGRyYXcoZWxlbWVudCwgc3R5bGUpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBEcmF3cyBhIHBvbHlnb24uXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge1NWR0VsZW1lbnR9ICBlbGVtZW50ICAgICAgICAgICAgIFRoZSBzdmcgZWxlbWVudC5cclxuICogQHBhcmFtIHtudW1iZXJbXX0gICAgYXJyQ29vcmRzICAgICAgICAgICBBbiBhcnJheSBvZiB4eSBwb3NpdGlvbnMgb2YgdGhlIGZvcm0gW3gxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NC4uLl0uXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIFtzdHlsZV0gICAgICAgICAgICAgVGhlIHN0eWxlIHByb3BlcnRpZXMuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtzdHlsZS5maWxsQ29sb3JdICAgVGhlIGZpbGwgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtzdHlsZS5maWxsT3BhY2l0eV0gVGhlIGZpbGwgb3BhY2l0eS4gVGhpcyBpcyBvdmVycmlkZW4gYnkgdGhlIGZpbGxDb2xvciBpZiBpdCBjb250YWlucyBhbiBhbHBoYSB2YWx1ZS5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmxpbmVDb2xvcl0gICBUaGUgbGluZSBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW3N0eWxlLmxpbmVXaWR0aF0gICBUaGUgbGluZSB3aWR0aC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmxpbmVKb2luXSAgICBUaGUgbGluZSBqb2luLCBvbmUgb2YgXCJiZXZlbFwiLCBcInJvdW5kXCIsIFwibWl0ZXJcIi5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmxpbmVDYXBdICAgICBUaGUgbGluZSBjYXAsIG9uZSBvZiBcImJ1dHRcIiwgXCJyb3VuZFwiLCBcInNxdWFyZVwiLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbc3R5bGUubGluZU9wYWNpdHldIFRoZSBsaW5lIG9wYWNpdHkuIFRoaXMgaXMgb3ZlcnJpZGVuIGJ5IHRoZSBsaW5lQ29sb3IgaWYgaXQgY29udGFpbnMgYW4gYWxwaGEgdmFsdWUuXHJcbiAqL1xyXG52YXIgcG9seWdvbiA9IGZ1bmN0aW9uIChlbGVtZW50LCBhcnJDb29yZHMsIHN0eWxlKVxyXG57XHJcbiAgICBkb20uYXR0cihlbGVtZW50LCB7cG9pbnRzOmdldENvb3Jkc0FzU3RyaW5nKGFyckNvb3Jkcyl9KTtcclxuICAgIGRyYXcoZWxlbWVudCwgc3R5bGUpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBjb29yZHMgW3gxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCwgLi4uXSBcclxuICogdG8gYSBjb21tYSBzZXBhcmF0ZWQgc3RyaW5nIG9mIGNvb3JkcyAneDEgeTEsIHgyIHkyLCB4MyB5MywgeDQgeTQsIC4uLicuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHByaXZhdGVcclxuICogXHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IGFyckNvb3JkcyBUaGUgbGlzdCBvZiBjb29yZHMuXHJcbiAqIFxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9IEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGxpc3Qgb2YgY29vcmRzLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Q29vcmRzQXNTdHJpbmcgKGFyckNvb3Jkcylcclxue1xyXG4gICAgdmFyIG4gPSBhcnJDb29yZHMubGVuZ3RoO1xyXG4gICAgdmFyIHN0clBvaW50cyA9ICcnO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKz0yKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChpICE9PSAwKSBzdHJQb2ludHMgKz0gJywnO1xyXG4gICAgICAgIHN0clBvaW50cyArPSAnJyArIGFyckNvb3Jkc1tpXSArICcgJyArIGFyckNvb3Jkc1tpKzFdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0clBvaW50cztcclxufVxyXG5cclxuLyoqIFxyXG4gKiBQcm92aWRlcyB0aGUgZmlsbCBkcmF3aW5nIHJvdXRpbmUuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcHJpdmF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge1NWR0VsZW1lbnR9ICBlbGVtZW50ICAgICAgICAgICAgICAgICAgICAgVGhlIHN2ZyBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICBbc3R5bGVdICAgICAgICAgICAgICAgICAgICAgVGhlIHN0eWxlIHByb3BlcnRpZXMuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtzdHlsZS5maWxsQ29sb3IgPSBub25lXSAgICBUaGUgZmlsbCBjb2xvci5cclxuICogQHBhcmFtIHtudW1iZXJ9ICAgICAgW3N0eWxlLmZpbGxPcGFjaXR5ID0gMV0gICAgIFRoZSBmaWxsIG9wYWNpdHkuIC5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmxpbmVDb2xvciA9IG5vbmVdICAgIFRoZSBsaW5lIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gICAgICBbc3R5bGUubGluZVdpZHRoID0gMV0gICAgICAgVGhlIGxpbmUgd2lkdGguXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIFtzdHlsZS5saW5lSm9pbiA9IHJvdW5kXSAgICBUaGUgbGluZSBqb2luLCBvbmUgb2YgXCJiZXZlbFwiLCBcInJvdW5kXCIsIFwibWl0ZXJcIi5cclxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgW3N0eWxlLmxpbmVDYXAgPSBidXR0XSAgICAgIFRoZSBsaW5lIGNhcCwgb25lIG9mIFwiYnV0dFwiLCBcInJvdW5kXCIsIFwic3F1YXJlXCIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgIFtzdHlsZS5saW5lT3BhY2l0eSA9IDFdICAgICBUaGUgbGluZSBvcGFjaXR5LiBPdmVycmlkZXMgYW55IGFscGhhIHZhbHVlIG9uIHRoZSBmaWxsIGNvbG9yLlxyXG4gKi9cclxuZnVuY3Rpb24gZHJhdyhlbGVtZW50LCBzdHlsZSlcclxue1xyXG4gICAgLy8gRmlsbC5cclxuICAgIHZhciBmaWxsQ29sb3IgPSBzdHlsZS5maWxsQ29sb3IgIT09IHVuZGVmaW5lZCA/IGNvbG9yVXRpbC50b1JHQkEoc3R5bGUuZmlsbENvbG9yKSA6ICdub25lJztcclxuICAgIGlmIChmaWxsQ29sb3IgIT0gJ25vbmUnICYmIHN0eWxlLmZpbGxPcGFjaXR5ICE9PSB1bmRlZmluZWQpIGZpbGxDb2xvciA9IGNvbG9yVXRpbC50b1JHQkEoZmlsbENvbG9yLCBzdHlsZS5maWxsT3BhY2l0eSk7XHJcblxyXG4gICAgLy8gU3Ryb2tlLlxyXG4gICAgdmFyIGxpbmVXaWR0aCAgID0gc3R5bGUubGluZVdpZHRoICE9PSB1bmRlZmluZWQgPyBzdHlsZS5saW5lV2lkdGggOiAxO1xyXG4gICAgdmFyIGxpbmVKb2luICAgID0gc3R5bGUubGluZUpvaW4gICE9PSB1bmRlZmluZWQgPyBzdHlsZS5saW5lSm9pbiAgOiAncm91bmQnO1xyXG4gICAgdmFyIGxpbmVDYXAgICAgID0gc3R5bGUubGluZUNhcCAgICE9PSB1bmRlZmluZWQgPyBzdHlsZS5saW5lQ2FwICAgOiAnYnV0dCc7XHJcbiAgICB2YXIgbGluZUNvbG9yICAgPSBzdHlsZS5saW5lQ29sb3IgIT09IHVuZGVmaW5lZCA/IGNvbG9yVXRpbC50b1JHQkEoc3R5bGUubGluZUNvbG9yKSA6ICdub25lJztcclxuICAgIGlmIChsaW5lQ29sb3IgIT0gJ25vbmUnICYmIHN0eWxlLmxpbmVPcGFjaXR5ICE9PSB1bmRlZmluZWQpIGxpbmVDb2xvciA9IGNvbG9yVXRpbC50b1JHQkEobGluZUNvbG9yLCBzdHlsZS5saW5lT3BhY2l0eSk7XHJcblxyXG4gICAgZG9tLmF0dHIoZWxlbWVudCwgXHJcbiAgICB7XHJcbiAgICAgICAgJ2ZpbGwnICAgICAgICAgICAgOiBmaWxsQ29sb3IsXHJcbiAgICAgICAgJ3N0cm9rZScgICAgICAgICAgOiBsaW5lQ29sb3IsXHJcbiAgICAgICAgJ3N0cm9rZS13aWR0aCcgICAgOiBsaW5lV2lkdGgsXHJcbiAgICAgICAgJ3N0cm9rZS1saW5lam9pbicgOiBsaW5lSm9pbixcclxuICAgICAgICAnc3Ryb2tlLWxpbmVjYXAnICA6IGxpbmVDYXAsXHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBcclxue1xyXG4gICAgY3JlYXRlRWxlbWVudCA6IGNyZWF0ZUVsZW1lbnQsXHJcbiAgICBpc1N1cHBvcnRlZCAgIDogaXNTdXBwb3J0ZWQsXHJcbiAgICBnZXRDYW52YXMgICAgIDogZ2V0Q2FudmFzLFxyXG4gICAgZ2V0Q29udGV4dCAgOiBnZXRDb250ZXh0LFxyXG4gICAgY2xlYXIgICAgICAgICA6IGNsZWFyLFxyXG4gICAgZW1wdHkgICAgICAgICA6IGVtcHR5LFxyXG4gICAgY2lyY2xlICAgICAgICA6IGNpcmNsZSxcclxuICAgIGVsbGlwc2UgICAgICAgOiBlbGxpcHNlLFxyXG4gICAgcmVjdCAgICAgICAgICA6IHJlY3QsXHJcbiAgICBsaW5lICAgICAgICAgIDogbGluZSxcclxuICAgIHBvbHlsaW5lICAgICAgOiBwb2x5bGluZSxcclxuICAgIHBvbHlnb24gICAgICAgOiBwb2x5Z29uXHJcbn07IiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuLyogZ2xvYmFscyBERUJVRyAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQGZpbGVvdmVydmlldyAgICBDb250YWlucyB1dGlsaXR5IGZ1bmN0aW9ucy5cclxuICogQGF1dGhvciAgICAgICAgICBKb25hdGhhbiBDbGFyZSBcclxuICogQGNvcHlyaWdodCAgIEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlICAgICAgdXRpbCBcclxuICovXHJcblxyXG4vKiogXHJcbiAqIENoZWNrIGlmIG4gaXMgYSB2YWxpZCBudW1iZXIuIFJldHVybnMgZmFsc2UgaWYgbiBpcyBlcXVhbCB0byBOYU4sIEluZmluaXR5LCAtSW5maW5pdHkgb3IgYSBzdHJpbmcgZWcgJzEwJy5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gbiBUaGUgbnVtYmVyIHRvIHRlc3QuXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUsIGlmIG4gaXMgYSBudW1iZXIsIG90aGVyd2lzZSBmYWxzZS5cclxuICovXHJcbnZhciBpc051bWJlciA9IGZ1bmN0aW9uIChuKVxyXG57XHJcbiAgICAvLyAodHlwZW9mIG4gPT0gJ251bWJlcicpICAgUmVqZWN0IG9iamVjdHMgdGhhdCBhcmVudCBudW1iZXIgdHlwZXMgZWcgbnVtYmVycyBzdG9yZWQgYXMgc3RyaW5ncyBzdWNoIGFzICcxMCcuXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgTmFOLCBJbmZpbml0eSBhbmQgLUluZmluaXR5IGFyZSBudW1iZXIgdHlwZXMgc28gd2lsbCBwYXNzIHRoaXMgdGVzdC5cclxuICAgIC8vIGlzRmluaXRlKG4pICAgICAgICAgICAgICBSZWplY3QgaW5maW5pdGUgbnVtYmVycy5cclxuICAgIC8vICFpc05hTihuKSkgICAgICAgICAgICAgICBSZWplY3QgTmFOLlxyXG4gICAgcmV0dXJuICh0eXBlb2YgbiA9PSAnbnVtYmVyJykgJiYgaXNGaW5pdGUobikgJiYgIWlzTmFOKG4pO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDbG9uZSBhbiBvYmplY3QgbGl0ZXJhbC5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBiZSBjbG9uZWQuXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdH0gQSBjbG9uZSBvZiB0aGUgb2JqZWN0LlxyXG4gKi9cclxudmFyIGNsb25lT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikgXHJcbntcclxuICAgIHZhciBjb3B5ID0ge307XHJcblxyXG4gICAgLy8gSGFuZGxlIHRoZSAzIHNpbXBsZSB0eXBlcywgYW5kIG51bGwgb3IgdW5kZWZpbmVkXHJcbiAgICBpZiAobnVsbCA9PT0gb2JqIHx8IFwib2JqZWN0XCIgIT09IHR5cGVvZiBvYmopIHJldHVybiBvYmo7XHJcblxyXG4gICAgLy8gSGFuZGxlIERhdGVcclxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBEYXRlKSBcclxuICAgIHtcclxuICAgICAgICBjb3B5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb3B5LnNldFRpbWUob2JqLmdldFRpbWUoKSk7XHJcbiAgICAgICAgcmV0dXJuIGNvcHk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlIEFycmF5XHJcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpIFxyXG4gICAge1xyXG4gICAgICAgIGNvcHkgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvcHlbaV0gPSBjbG9uZU9iamVjdChvYmpbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29weTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGUgT2JqZWN0XHJcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgT2JqZWN0KSBcclxuICAgIHtcclxuICAgICAgICBjb3B5ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgYXR0ciBpbiBvYmopIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShhdHRyKSkgY29weVthdHRyXSA9IGNsb25lT2JqZWN0KG9ialthdHRyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3B5O1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBFeHRlbmQgYW4gb2JqZWN0IG9iakEgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3Qgb2JqQi5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSAgb2JqQSAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkLlxyXG4gKiBAcGFyYW0ge09iamVjdH0gIG9iakIgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIHdpbGwgYmUgYWRkZWQgdG8gb2JqQS5cclxuICogQHBhcmFtIHtCb29sZWFufSBbb3ZlcndyaXRlUHJvcGVydGllcyA9IHRydWVdICAgIFNob3VsZCBvYmpBIHByb3BlcnRpZXMgYmUgb3ZlcndyaXR0ZW4gaWYgdGhleSBhbHJlYWR5IGV4aXN0LlxyXG4gKi9cclxudmFyIGV4dGVuZE9iamVjdCA9IGZ1bmN0aW9uIChvYmpBLCBvYmpCLCBvdmVyd3JpdGVQcm9wZXJ0aWVzKVxyXG57XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqQilcclxuICAgIHtcclxuICAgICAgICAgaWYgKG9iakIuaGFzT3duUHJvcGVydHkoa2V5KSlcclxuICAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAob3ZlcndyaXRlUHJvcGVydGllcyA9PT0gZmFsc2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmpBW2tleV0gPT09IHVuZGVmaW5lZCkgb2JqQVtrZXldID0gb2JqQltrZXldO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICBlbHNlIG9iakFba2V5XSA9IG9iakJba2V5XTtcclxuICAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZXh0ZW5kIG9uZSBjbGFzcyB3aXRoIGFub3RoZXIuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gYmFzZUNsYXNzICAgIFRoZSBjbGFzcyBmcm9tIHdoaWNoIHRvIGluaGVyaXQuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdWJDbGFzcyAgICAgVGhlIGluaGVyaXRpbmcgY2xhc3MsIG9yIHN1YmNsYXNzLlxyXG4gKi9cclxudmFyIGV4dGVuZENsYXNzID0gZnVuY3Rpb24oYmFzZUNsYXNzLCBzdWJDbGFzcylcclxue1xyXG4gICAgZnVuY3Rpb24gSW5oZXJpdGFuY2UoKSB7fVxyXG4gICAgSW5oZXJpdGFuY2UucHJvdG90eXBlID0gYmFzZUNsYXNzLnByb3RvdHlwZTtcclxuICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IG5ldyBJbmhlcml0YW5jZSgpO1xyXG4gICAgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7XHJcbiAgICBzdWJDbGFzcy5iYXNlQ29uc3RydWN0b3IgPSBiYXNlQ2xhc3M7XHJcbiAgICBzdWJDbGFzcy5zdXBlckNsYXNzID0gYmFzZUNsYXNzLnByb3RvdHlwZTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gXHJcbntcclxuICAgIGlzTnVtYmVyICAgICAgICA6IGlzTnVtYmVyLFxyXG4gICAgY2xvbmVPYmplY3QgICAgIDogY2xvbmVPYmplY3QsXHJcbiAgICBleHRlbmRPYmplY3QgICAgOiBleHRlbmRPYmplY3QsXHJcbiAgICBleHRlbmRDbGFzcyAgICAgOiBleHRlbmRDbGFzc1xyXG59OyJdfQ==
