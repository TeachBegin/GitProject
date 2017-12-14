/**
 * NodeJS 自带库
 */
const fs =require('fs')
const path =require('path')

const bodyparser =require('body-parser') // 提供 JSON /Raw /Text /URL-encoded 解析
const morgan = require('morgan') // HTTP request logger
const fsr = require('file-stream-rotator') // 每天自动生成一个日志
const compression = require('compression') // Http Request 压缩
const errorhandler =require('errorhandler') //错误处理，仅用于Development模式
const favicon = require('serve-favicon')
const session = require('express-session')
const serveStatic = require('serve-static')

module.exports = (app, env, config) => {
    /**
     * Http/ raw /text /URL-encoded 解析
     */
    app.use(bodyparser.urlencoded({
        extended: true,
        limit: '10mb'
    }))

    app.use(bodyparser.json({
        limit: '10mb'
    }))

    /**
     * 服务器
     */
    const logDirectory = `${config.rootPath}/logs`

    //确保日志文件存在
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory)
    }

    //创建一个循环写入流
    const accessLogsStream = fsr.getStream({
        date_format: 'YYYYMMDD',
        filename: `${logDirectory}/%DATE%-web.log`,
        frequency: 'daily',
        verbose: false
    })

    app.use(morgan('short', {
        stream: accessLogsStream
    }))

    /**
     * 用于指定URL路径和服务器路径的映射
     */
    const publicDir = path.resolve(__dirname,'./bundle')
    app.use('/bundle',serveStatic(publicDir))

     /**
   * 压缩
   */
  app.use(
    compression(
      { threshhold: 512 },
      (req, res) => /json|text|javascript|css/.test(res.getHeader('Content-Type')),
      { level: 9 }
    )
  )

  /**
   * 设定收藏icon
   */
  // app.use(favicon(path.join(config.rootPath, 'favicon.ico')))

}

/**
 * 判断运行环境，开发环境使用加热，生产环境不要使用
 */
if (env === 'development') {
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const config = require('../config/webdev.webpack.config')
    // webpack 热加载
    const compiler = webpack(config)
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
    app.use(webpackHotMiddleware(compiler))

    // handle error
    app.locals.pretty = true
    app.use(errorhandler({
      dumpExceptions: true,
      showStack: true
    }))
  

}