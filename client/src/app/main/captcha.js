import React              from 'react';
import ReactDOM           from 'react-dom';
import ReCAPTCHA          from 'react-google-recaptcha';
import {connect}          from 'react-redux';


class Captcha extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }

    render() {
        return (
            <ReCAPTCHA sitekey={this.props.sitekey} ref="reCaptcha" onChange={(value) => {this.setState({value})}} tabIndex="0" />
        );
    }

    getValue() {
        return this.state.value;
    }

    focus() {
        ReactDOM.findDOMNode(this).focus();
    }
}

export default connect((store) => {
    return {
        sitekey: store.config.reCaptchaKey
    };
}, null, null, { withRef: true })(Captcha);