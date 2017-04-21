import React from 'react';

import i18n from 'lib-app/i18n';
import ModalContainer from 'app-components/modal-container';

import Button from 'core-components/button';
import Input from 'core-components/input';
import Icon from 'core-components/icon';


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
        password: ''
    };

    static openModal(description, onYes, type = 'default') {
        ModalContainer.openModal(
            <AreYouSure description={description} onYes={onYes} type={type}/>,
            true
        );
    }

    componentDidMount() {
        this.refs.yesButton && this.refs.yesButton.focus();
    }

    render() {
        return (
            <div className="are-you-sure" role="dialog" aria-labelledby="are-you-sure__header" aria-describedby="are-you-sure__description">
                <div className="are-you-sure__header" id="are-you-sure__header">
                    {i18n('ARE_YOU_SURE')}
                </div>
                <span className="are-you-sure__close-icon" onClick={this.onNo.bind(this)}>
                    <Icon name="times" size="2x"/>
                </span>
                <div className="are-you-sure__description" id="are-you-sure__description">
                    {this.props.description || (this.props.type === 'secure' && i18n('PLEASE_CONFIRM_PASSWORD'))}
                </div>
                {(this.props.type === 'secure') ? this.renderPassword() : null}
                <span className="separator" />
                <div className="are-you-sure__buttons">
                    <div className="are-you-sure__no-button">
                        <Button type="link" size="auto" onClick={this.onNo.bind(this)} tabIndex="2">
                            {i18n('CANCEL')}
                        </Button>
                    </div>
                    <div className="are-you-sure__yes-button">
                        <Button type="secondary" size="small" onClick={this.onYes.bind(this)} ref="yesButton" tabIndex="2">
                            {i18n('YES')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    renderPassword() {
        return (
            <Input className="are-you-sure__password" password placeholder="password" name="password" ref="password" size="medium" value={this.state.password} onChange={this.onPasswordChange.bind(this)} onKeyDown={this.onInputKeyDown.bind(this)}/>
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
        if (this.props.type === 'secure' && !this.state.password) {
            this.refs.password.focus()
        }

        if (this.props.type === 'default' || this.state.password) {
            this.closeModal();

            if (this.props.onYes) {
                this.props.onYes(this.state.password);
            }
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