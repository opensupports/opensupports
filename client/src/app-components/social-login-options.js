import React      from 'react';
import classNames from 'classnames';


class SocialLoginOptions extends React.Component {
    static propTypes = {
        loginOptionsList: React.PropTypes.array,
    };

    static defaultProps = {
        loginOptionsList: []
    };

    render() {
        return (
            <div className="social-login-options" >
                {this.renderLoginOptionsButtons()}
            </div>
        );
    }

    renderLoginOptionsButtons() {
        const { loginOptionsList } = this.props;

        return loginOptionsList.map((socialLoginOption) => {
            return (
                <button
                    className="social-login-options__buttons"
                    onClick={() => alert(socialLoginOption)}>
                        {socialLoginOption}
                </button>
            );
        });
    }
}

export default SocialLoginOptions;
