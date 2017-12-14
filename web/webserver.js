import http from 'http'
import express from 'express'

import config from '../config/config'


/**
 * 创建服务器
 */
const app = module.exports = express()

const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || config.port || 3000

app.set('env', env)
app.set('port', port)

require ('./server/express')(app,env,config)
require ('./server/routes')(express,app,config)

// 参数 '127.0.0.1' 限制本机访问，用于生产环境仅允许域名访问nginx跳转
// 要注意用手机调试时去掉该参数
http.createServer(app).listen(port,'127.0.0.1', (req,res) => {
    console.info(`${config.name} Server start on port ${config.port}, env=${env}`)
})
