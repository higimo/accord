import React from 'react'

import Link from 'react-router-dom/Link'

class IndexPage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			list: []
		}
	}

	componentDidMount() {
		const self = this
		fetch('list.json')
			.then(r => r.json())
			.then(json => {
				self.setState({
					list: json
				})
				console.log(json)
			})
	}

	render() {
		this.state.list.sort((a, b) => a.name.localeCompare(b.name))
		let alf = ''
		return (
			<div className="home">
				{this.state.list.map(item => (
					<span key={item.name}>
						{(item.name[0] !== alf) ? (<div className="alf">{alf = item.name[0]}</div>) : null}
						<div><Link to={`/song/${item.name}`}>{item.name}</Link></div>
					</span>
				))}
			</div>
		);
	}
}

export default IndexPage
