import React from 'react'
import ReactDOM from 'react-dom'

import Dashboard from './Dashboard'

const render = Component => {
    ReactDOM.render(<Component/>,document.getElementById('app-mount'))
}

render(Dashboard)

// 热加载(加载无class-extents)
if(module.hot){
    module.hot.accept('.Dashboard',() => {
        const NextDashboard = require('./Dashboard').default
        render(NextDashboard)
    })
}