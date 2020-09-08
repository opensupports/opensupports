import React from 'react';

import i18n from 'lib-app/i18n';
import ModalContainer from 'app-components/modal-container';

import Button from 'core-components/button';
import Input from 'core-components/input';
import Icon from 'core-components/icon';
import Loading from 'core-components/loading'


class AreYouSure extends React.Component {
    static propTypes = {
        description: React.PropTypes.node,
        onYes: React.PropTypes.func,
        type: React.PropTypes.oneOf(['default', 'secure'])
    };

    static defaultProps = {
        type: 'default'
    };

    static contextTypes = {
        closeModal: React.PropTypes.func
    };

    state = {
        loading: false,
        password: ''
    };

    static openModal(description, onYes, type = 'default') {
        ModalContainer.openModal(
            <AreYouSure description={description} onYes={onYes} type={type} />,
            true
        );
    }

    componentDidMount() {
        this.refs.yesButton && this.refs.yesButton.focus();
    }

    render() {
        const { loading } = this.state;
        return (
            <div className="are-you-sure" role="dialog" aria-labelledby="are-you-sure__header" aria-describedby="are-you-sure__description">
                <div className="are-you-sure__header" id="are-you-sure__header">
                    {i18n('ARE_YOU_SURE')}
                </div>
                <span className="are-you-sure__close-icon" onClick={this.onNo.bind(this)}>
                    <Icon name="times" size="2x" />
                </span>
                <div className="are-you-sure__description" id="are-you-sure__description">
                    {this.props.description || (this.props.type === 'secure' && i18n('PLEASE_CONFIRM_PASSWORD'))}
                </div>
                {(this.props.type === 'secure') ? this.renderPassword() : null}
                <span className="separator" />
                <div className="are-you-sure__buttons">
                    <div className="are-you-sure__no-button">
                        <Button disabled={loading} type="link" size="auto" onClick={this.onNo.bind(this)} tabIndex="2">
                            {i18n('CANCEL')}
                        </Button>
                    </div>
                    <div className="are-you-sure__yes-button">
                        <Button
                            type="secondary"
                            size="small"
                            onClick={this.onYes.bind(this)}
                            ref="yesButton"
                            tabIndex="2"
                            disabled={loading}
                        >
                            {loading ? <Loading /> : i18n('YES')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    renderPassword() {
        const {
            password,
            loading
        } = this.state;
        return (
            <Input
                className="are-you-sure__password"
                password
                placeholder="password"
                name="password"
                ref="password"
                size="medium"
                value={password}
                onChange={this.onPasswordChange.bind(this)}
                onKeyDown={this.onInputKeyDown.bind(this)}
                disabled={loading}
           />
        );
    }

    onPasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }

    onInputKeyDown(event) {
        if (event.keyCode == 13) {
            this.onYes();
        }
    }

    onYes() {
        const {
            password,
        } = this.state;
        const {
            type,
            onYes
        } = this.props;

        if(type === 'secure' && !password) {
            this.refs.password.focus()
        }

        if(type === 'default' || password) {
            if(onYes) {
                const result = onYes(password);
                if(this.isPromise(result)) {
                    this.setState({
                        loading: true
                    });
                    result
                        .then(() => {
                            this.setState({
                                loading: false
                            });
                            this.closeModal();
                        })
                        .catch(() => {
                            this.setState({
                                loading: false,
                            });
                            this.closeModal();
                        })
                } else {
                    this.closeModal();
                }
            } else {
                this.closeModal();
            }
        }
    }

    isPromise(object) {
        if(Promise && Promise.resolve) {
            return Promise.resolve(object) == object;
        } else {
            throw "Promise not supported in your environment"
        }
    }

    onNo() {
        this.closeModal();
    }

    closeModal() {
        if (this.context.closeModal) {
            this.context.closeModal();
        }
    }
}

export default AreYouSure;