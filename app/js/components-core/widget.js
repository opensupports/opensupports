import React from 'react/addons';
import classNames from 'classnames';

var Widget = React.createClass({
	propTypes: {
		children: React.PropTypes.node.isRequired
	},

	render() {
		return (
			<div className={this.getClass()}>
				{this.props.children}
			</div>
		);
	},

	getClass() {
		var classes = {
			'widget': true
		};

		classes[this.props.className] = (this.props.className);

		return classNames(classes);
	}
});

export default Widget;