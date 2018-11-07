import React from 'react'

import Link from 'react-router-dom/Link'

class SongPage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			text: ''
		}
	}

	componentDidMount() {
		const self = this
		fetch(`accord/${this.props.match.params.song}.txt`)
			.then(r => r.text())
			.then(text => {
				self.setState({
					text
				})
			})
	}

	render() {
		return (
			<div className="profile">
				<pre>
					{this.state.text}
				</pre>
				<div>
					<Link to="/">← Назад</Link>
				</div>
			</div>
		);
	}
}

export default SongPage
