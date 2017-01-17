import React from 'react';

import i18n from 'lib-app/i18n';
import Button from 'core-components/button';
import Input from 'core-components/input';
import ModalContainer from 'app-components/modal-container';

class AreYouSure extends React.Component {
    static propTypes = {
        description: React.PropTypes.node,
        onYes: React.PropTypes.func,
        type: React.PropTypes.string
    };

    static contextTypes = {
        closeModal: React.PropTypes.func
    };

    state = {
        password: ''
    };

    static openModal(description, onYes, type) {
        ModalContainer.openModal(
            <AreYouSure description={description} onYes={onYes} type={type}/>
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
                <div className="are-you-sure__description" id="are-you-sure__description">
                    {this.props.description}
                </div>
                {this.props.type === 'secure' ? this.renderPassword() : null}
                <div className="are-you-sure__buttons">
                    <div className="are-you-sure__yes-button">
                        <Button type="secondary" size="small" onClick={this.onYes.bind(this)} ref="yesButton" tabIndex="2">
                            {i18n('YES')}
                        </Button>
                    </div>
                    <div className="are-you-sure__no-button">
                        <Button type="link" size="auto" onClick={this.onNo.bind(this)} tabIndex="2">
                            {i18n('CANCEL')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    renderPassword() {
        return (
            <Input className="are-you-sure__password" password placeholder="password" name="password" value={this.state.password} onChange={this.onPasswordChange.bind(this)} onKeyDown={this.onInputKeyDown.bind(this)}/>
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
        if (this.state.password){
            this.closeModal();

            if (this.props.onYes) {
                this.props.onYes();
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