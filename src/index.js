import React           from 'react'
import ReactDOM        from 'react-dom'
import HashRouter      from 'react-router-dom/HashRouter'
import RouterSwitch    from 'react-router-dom/Switch'

import IndexPage from './js/page/IndexPage'
import SongPage  from './js/page/SongPage'
import NotFound  from './js/page/NotFound'

import { Route } from 'react-router'

import './scss/common.scss'

const App = (props) => (
	<HashRouter>
		<RouterSwitch>
			<Route exact path="/" component={IndexPage} />
			<Route exact path="/song/:song" component={SongPage} />
			<Route component={NotFound} />
		</RouterSwitch>
	</HashRouter>
)

ReactDOM.render(<App />, document.getElementById('application'))
