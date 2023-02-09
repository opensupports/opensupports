import React from 'react';
import { connect } from 'react-redux'

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import ConfigActions from 'actions/config-actions';

import ToggleButton from 'app-components/toggle-button';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class InstallStep4UserSystem extends React.Component {

    state = {
        form: {
            'mandatory-login': true,
            'registration': true
        }
    };

    render() {
        const { form } = this.state
        return (
            <div className="install-step-4">
                <Header title={i18n('STEP_TITLE', {title: i18n('USER_SYSTEM'), current: 4, total: 6})} description={i18n('STEP_4_DESCRIPTION')} />
                <Form onSubmit={this.onSubmit.bind(this)} values={form} onChange={this.onChange.bind(this)}>
                    <div className="install-step-4__container">
                        <FormField
                            name="mandatory-login"
                            label={i18n('ENABLE_MANDATORY_LOGIN')}
                            decorator={ToggleButton}
                            fieldProps={{disabled: !form['registration']}}/>
                        <FormField
                            name="registration"
                            label={i18n('ENABLE_USER_REGISTRATION')}
                            decorator={ToggleButton}
                            fieldProps={{disabled: !form['mandatory-login']}}/>
                    </div>
                    <div className="install-step-4__buttons">
                        <SubmitButton className="install-step-4__next" size="medium" type="secondary">{i18n('NEXT')}</SubmitButton>
                    </div>
                </Form>
            </div>
        );
    }

    onChange(form) {
        this.setState({
            form: {
                'mandatory-login': form['mandatory-login'],
                'registration': form['registration']
            }
        });
    }

    onSubmit(form) {
        this.props.dispatch(ConfigActions.updateUserSystemSettings({
            'mandatory-login': form['mandatory-login'] * 1,
            'registration': form['registration'] * 1
        }));

        history.push('/install/step-5');
    }
}

export default connect((store) => {
    return {
        language: store.config.language
    };
})(InstallStep4UserSystem);
