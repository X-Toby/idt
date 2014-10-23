/**
 * Webserver任务
 * @author pooky
 */

var fs = require( 'fs' );

var config = require( './config' );
var utils = require( './utils' );
var handlerHtml = require( './handlerHtml' );
var handlerAjax = require( './handlerAjax' );

/**
 * onCreateServer
 * @param  {Object} server  [description]
 * @param  {Object} connect [description]
 * @param  {Object} options [description]
 */
var onCreateServer = function( server, connect, options ) {

    debugger;
    console.log( 'WebServer Pid: ' + process.pid );
    console.log( 'Running on port: ' + options.port );

    // socket 支持
    var io = require( 'socket.io' ).listen( server );
    io.sockets.on( 'connection', function( socket ) {

        // do something with socket

    } );

    // write stop 
    // kill -9 $pid
    // var kill = 'kill -9 ' + process.pid;
    // kill += '\necho "Stop Webserver successful!"';
    // fs.writeFile( 'stop', kill, function( err ) {
    //     if ( err ) throw err;
    //     console.log( 'Pid\'s saved!' );
    // } );

};

/**
 * 中间层
 * @type {Array}
 */
// var middleWares = [

//     // 处理html的中间层
//     function html( req, res, next ) {
//         if ( utils.isHtml( req ) )
//             return handlerHtml.run( req, res, next );
//         return next();
//     }

// ];

/**
 * 中间层【建议的中间层写法】
 * @param  {[type]} connect     [description]
 * @param  {[type]} options     [description]
 * @param  {[type]} middlewares [description]
 * @return {[type]}             [description]
 */
var middleWares = function( connect, options, middlewares ) {

    // inject a custom middleware into the array of default middlewares
    // html
    middlewares.unshift( function( req, res, next ) {
        if ( utils.isHtml( req ) )
            return handlerHtml.run( req, res, next );
        return next();
    } );

    // ajax
    middlewares.unshift( function( req, res, next ) {
        if ( utils.isAjax( req ) )
            return handlerAjax.run( req, res, next );
        return next();
    } );

    // static
    // middlewares.unshift( function( req, res, next ) {
    //     connect.static( options.base );
    // } );

    // directory
    // middlewares.unshift( function( req, res, next ) {
    //     connect.directory( options.base );
    // } );

    return middlewares;

};

module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig( {

        pkg: grunt.file.readJSON( 'package.json' ),

        /**
         * 服务器配置
         * @type {Object}
         */
        connect: {
            // base server
            baseServer: {
                options: {
                    port: 8000,
                    // 可访问性
                    hostname: '*',
                    // 根目录
                    base: config.webContent,
                    // 持续任务
                    keepalive: true,
                    onCreateServer: onCreateServer,
                    // 中间层
                    middleware: middleWares
                }
            }
        }

    } );

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks( 'grunt-contrib-connect' );

    // 默认被执行的任务列表。
    grunt.registerTask( 'default', [ 'connect' ] );

};
