/**
 * Created by ivan on 16/08/15.
 */
'use strict';

import React from 'react/addons';
import classNames from 'classnames';

var Button = React.createClass({

	propTypes: {
		children: React.PropTypes.node,
		type: React.PropTypes.oneOf([
			'primary'
		])
	},

	getDefaultProps() {
		return {
			type: 'primary'
		}
	},

	render() {
		return (
			<button className={this.getClass()}>
				{this.props.children}
			</button>
		);
	},

	getClass() {
		var classes = {
			'button': true
		};

		classes['button-' + this.props.type] = (this.props.type);
		classes[this.props.className] = (this.props.className);

		return classNames(classes);
	}
});

export default Button;