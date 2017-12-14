/**
 * NodeJS 自带库
 */
import fs from 'fs'
import path from 'path'

import bodyparser from 'body-parser' // 提供 JSON /Raw /Text /URL-encoded 解析
import morgan from 'morgan' // HTTP request logger
import fsr from 'file-stream-rotator' // 每天自动生成一个日志
import compression from 'compression' // Http Request 压缩
import errorhandler from 'errorhandler' //错误处理，仅用于Development模式
import favicon from 'serve-favicon'
import session from 'serve-static'
import exphbs from 'express-handlebars'

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
    const accessLogsStream = fs.getStream({
        date_format: YYYYMMDD,
        filename: `${logDirectory}/%DATE%-web.log`,
        frequency: 'daily',
        verbose: false
    })

    app.use(morgan('short', {
        stream: acceeLogStream
    }))

    /**
     * 用于指定URL路径和服务器路径的映射
     */
    const publicDir = path.resolve(__dirname,'./public')
    app.use(serveStatic(publicDir))

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
   * 页面/视图 模板使用 Handlebars
   */
  app.engine(
    '.hbs',
    exphbs({
      layoutsDir: 'web/views/layouts',
      partialsDir: 'web/views/partials',
      defaultLayout: 'main',
      extname: '.hbs'
    })
  )

  app.set('views', path.join(config.rootPath, 'web/views'))
  app.set('view engine', '.hbs')


  /**
   * 设定收藏icon
   */
  // app.use(favicon(path.join(config.rootPath, 'favicon.ico')))

}
