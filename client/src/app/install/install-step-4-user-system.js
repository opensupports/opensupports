import React from 'react';
import { connect } from 'react-redux'

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import ConfigActions from 'actions/config-actions';

import ToggleButton from 'app-components/toggle-button';
import Button from 'core-components/button';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class InstallStep4UserSystem extends React.Component {

    state = {
        form: {
            'user-system-enabled': true,
            'registration': true
        }
    };

    render() {
        return (
            <div className="install-step-4">
                <Header title={i18n('STEP_TITLE', {title: i18n('USER_SYSTEM'), current: 4, total: 7})} description={i18n('STEP_4_DESCRIPTION')}/>
                <Form onSubmit={this.onSubmit.bind(this)} values={this.state.form} onChange={this.onChange.bind(this)}>
                    <FormField name="user-system-enabled" label={i18n('ENABLE_USER_SYSTEM')} decorator={ToggleButton}/>
                    <FormField name="registration" label={i18n('ENABLE_USER_REGISTRATION')} decorator={ToggleButton} fieldProps={{disabled: this.isDisabled()}}/>
                    <div className="install-step-4__buttons">
                        <SubmitButton className="install-step-4__next" size="medium" type="secondary">{i18n('NEXT')}</SubmitButton>
                        <Button className="install-step-4__previous" size="medium" onClick={this.onPreviousClick.bind(this)}>{i18n('PREVIOUS')}</Button>
                    </div>
                </Form>
            </div>
        );
    }

    onChange(form) {
        this.setState({
            form: {
                'user-system-enabled': form['user-system-enabled'],
                'registration': form['user-system-enabled'] && form['registration']
            }
        });
    }

    onPreviousClick(event) {
        event.preventDefault();
        history.push('/install/step-3');
    }

    onSubmit(form) {
        this.props.dispatch(ConfigActions.updateUserSystemSettings({
            'user-system-enabled': form['user-system-enabled'] * 1,
            'registration': form['registration'] * 1
        }));
        
        history.push('/install/step-5');
    }

    isDisabled() {
        return !this.state.form['user-system-enabled'];
    }
}

export default connect((store) => {
    return {
        language: store.config.language
    };
})(InstallStep4UserSystem);