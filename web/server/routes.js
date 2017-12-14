module.exports = (express, app, config) => {

    const routes=express.Router()

    /**
     * 每一条路由都要先执行该 middleware(中间件) 一遍
     */
    // router.use(req, res, next) => {}
    
    routes.get('/', (req, res) => {
        res.render('index', {title: 'GitProject1'})
    })

    app.use('/',routes)

}