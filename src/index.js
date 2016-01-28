import React from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, hashHistory, browserHistory} from 'react-router'
import App from './App'
import MyIndexRoute from './routes/IndexRoute'
import EditRoute from './routes/EditRoute'

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={MyIndexRoute} />
      <Route path="edit/:postId" component={EditRoute} />
    </Route>
  </Router>
), document.getElementById('app'))
