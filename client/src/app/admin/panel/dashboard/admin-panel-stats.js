import React from 'react';

import i18n from 'lib-app/i18n';
import Header from 'core-components/header';
import Tooltip from 'core-components/tooltip';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import API from 'lib-app/api-call';

class AdminPanelStats extends React.Component {

    state = {
        loading: true,
        form: {
            dateRange: {
                startDate: 202009130000,
                endDate: 202009132359
            }
        },
        ticketData: {}
    };

    componentDidMount() {
        this.retrieveStats();
    }

    render() {
        console.warn("Triggering re-render");
        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
                <Form
                    loading={this.state.loading}
                    values={this.state.form}
                    onChange={this.onFormChange.bind(this)}
                    onSubmit={this.onFormSubmit}>
                    <FormField
                        name="dateRange"
                        field="date-range"
                        // value={this.state.form.dateRange}
                        fieldProps={{defaultValue: this.state.form.dateRange}}/>
                </Form>
                {this.state.loading ? "Loading..." : this.renderTicketData()}
            </div>
        )
    }

    retrieveStats() {
        API.call({
            path: '/system/stats',
            data: {
                dateRange: "[" + this.state.form.dateRange.startDate.toString() + 
                           "," + this.state.form.dateRange.endDate.toString() + 
                           "]"
            }
        }).then(({data}) => {
            this.setState({ticketData: data, loading: false}, () => {
                console.log('DATA AFTER CALL TO /system/stats:', this.state);
            });
        }).catch((error) => {
            console.error('ERROR: ', error);
        })
    }

    onFormChange(newFormState) {
        this.setState({form: newFormState}, () => {
            this.retrieveStats();
        });
    }

    onFormSubmit() {
        
    }

    renderTicketData() {
        const {created, open, closed, instant, reopened} = this.state.ticketData;
        const renderCard = (label, description, value, isPercentage) => {
            const displayValue = isNaN(value) ? "-" : (isPercentage ? value.toFixed(2) : value);
            return (
                <div className="admin-panel-stats__card-list__card">
                    <Tooltip content={description} openOnHover>
                        {label}
                    </Tooltip>
                    <div className="admin-panel-stats__card-list__container">
                        {displayValue}{isPercentage && !isNaN(value) ? "%" : ""}
                    </div>
                </div>
            );
        }

        return (
            <div className="admin-panel-stats__card-list">
                {renderCard(i18n('CREATED'), i18n('CREATED_DESCRIPTION'), created, false)}
                {renderCard(i18n('OPEN'), i18n('OPEN_DESCRIPTION'), open, false)}
                {renderCard(i18n('CLOSED'), i18n('CLOSED_DESCRIPTION'), closed, false)}
                {renderCard(i18n('INSTANT'), i18n('INSTANT_DESCRIPTION'), 100*instant / closed, true)}
                {renderCard(i18n('REOPENED'), i18n('REOPENED_DESCRIPTION'), 100*reopened / created, true)}
            </div>
        )
    }
}

export default AdminPanelStats;
