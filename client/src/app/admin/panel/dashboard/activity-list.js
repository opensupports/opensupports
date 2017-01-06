import React from 'react';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';

import ActivityRow from 'app-components/activity-row';
import SubmitButton from 'core-components/submit-button';

class ActivityList extends React.Component {

    static propTypes = {
        mode: React.PropTypes.oneOf(['staff', 'system'])
    };

    static childContextTypes = {
        loading: React.PropTypes.bool
    };

    getChildContext() {
        return {
            loading: this.state.loading
        };
    }

    state = {
        activities: [],
        page: 1,
        limit: false,
        loading: false
    };

    componentDidMount() {
        this.retrieveNextPage();
    }

    render() {
        if (this.props.mode === 'staff') {
            return (
                <div>
                    {this.state.activities.map(this.renderRow.bind(this))}
                    {(!this.state.limit) ? this.renderButton() : null}
                </div>
            );
        }
        else {
            return (
                <div>
                    {this.state.activities.map(this.renderRow.bind(this))}
                    {(!this.state.limit) ? this.renderButton() : null}
                </div>
            );
        }
    }

    renderButton() {
        return (
            <SubmitButton type="secondary" onClick={this.retrieveNextPage.bind(this)}>
                {i18n('LOAD_MORE')}
            </SubmitButton>
        );
    }

    renderRow(row) {
        return (
            <ActivityRow {...row} />
        );
    }

    retrieveNextPage() {
        this.setState({loading: true});

        API.call({
            path: '/staff/last-events',
            data: {
                page: this.state.page
            }
        }).then(this.onRetrieveSuccess.bind(this));
    }

    onRetrieveSuccess(result) {
        this.setState({
            activities: this.state.activities.concat(result.data),
            page: this.state.page + 1,
            limit: (result.data.length !== 10),
            loading: false
        });
    }
}

export default ActivityList;