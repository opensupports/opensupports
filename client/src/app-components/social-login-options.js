import React      from 'react';

class SocialLoginOptions extends React.Component {
    static propTypes = {
        googleLoginOption: React.PropTypes.bool,
        facebookLoginOption: React.PropTypes.bool,
        linkedInLoginOption: React.PropTypes.bool,
    };

    static defaultProps = {
        googleLoginOption: false,
        facebookLoginOption: false,
        linkedInLoginOption: false,
    };

    render() {
        const {
            googleLoginOption,
            facebookLoginOption,
            linkedInLoginOption
        } = this.props;

        return (
            <div className="social-login-options" >
                {googleLoginOption ? this.renderGoogleLoginOptionsButton() : null}
                {facebookLoginOption ? this.renderFacebookLoginOptionsButton() : null}
                {linkedInLoginOption ? this.renderLinkedInLoginOptionsButton() : null}
            </div>
        );
    }

    renderGoogleLoginOptionsButton() {
        const { googleLoginOption } = this.props;
        const googleTitle = "Google";

        return (
            <button
                className="social-login-options__buttons social-login-options__google-button"
                onClick={() => alert(googleTitle)}>
                    {googleTitle}
            </button>
        );
    }

    renderFacebookLoginOptionsButton() {
        const { facebookLoginOption } = this.props;
        const facebookTitle = "Facebook";

        return (
            <button
                className="social-login-options__buttons social-login-options__facebook-button"
                onClick={() => alert(facebookTitle)}>
                    {facebookTitle}
            </button>
        );
    }

    renderLinkedInLoginOptionsButton() {
        const { linkedInLoginOption } = this.props;
        const linkedInTitle = "LinkedIn";

        return (
            <button
                className="social-login-options__buttons social-login-options__linkedin-button"
                onClick={() => alert(linkedInTitle)}>
                    {linkedInTitle}
            </button>
        );
    }
}

export default SocialLoginOptions;
