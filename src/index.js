import React from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, Link, browserHistory} from 'react-router'
import App from './App'
import MyIndexRoute from './routes/IndexRoute'


render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={MyIndexRoute} />
    </Route>
  </Router>
), document.getElementById('app'))

// // render(<App/>, document.querySelector('#app'))
// render(Router({
//   history: browserHistory
// }, Route({
//   name: 'app',
//   path: '/',
//   component: App
// }, IndexRoute({
//   component:
// }))), document.getElementById('app'));