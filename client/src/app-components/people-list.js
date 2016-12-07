import React from 'react';
import _ from 'lodash';
import {StaggeredMotion, spring} from 'react-motion';
import Menu from 'core-components/menu'

import DateTransformer from 'lib-core/date-transformer';
import i18n from 'lib-app/i18n';

class PeopleList extends React.Component {
    static propTypes = {
        list: React.PropTypes.arrayOf(React.PropTypes.shape({
            profilePic: React.PropTypes.string,
            name: React.PropTypes.string,
            assignedTickets: React.PropTypes.number,
            closedTickets: React.PropTypes.number,
            lastLogin: React.PropTypes.number
        })),
        pageSize: React.PropTypes.number
    };

    static defaultProps = {
        pageSize: 4,
        list: []
    };

    state = {
        page: 1
    };

    render() {
        const pages = _.range(1, this.getPages() + 1).map((index) => {return {content: index};});

        return (
            <div className="people-list">
                <div className="people-list__list">
                    <StaggeredMotion defaultStyles={_.times(this.props.pageSize).map(() => {return {offset: -100, alpha: 0};})} styles={(prevStyles) => prevStyles.map((_, i) => {
                        return i === 0
                          ? {offset: spring(0), alpha: spring(1)}
                          : {offset: spring(prevStyles[i - 1].offset), alpha: spring(prevStyles[i - 1].alpha)}
                      })}>
                        {(styles) =>
                            <div>
                                {styles.map((style, index) =>
                                    <div style={{transform: 'translateX('+style.offset+'px)', opacity: style.alpha}}>
                                        {this.renderItem(index + this.props.pageSize * (this.state.page - 1))}
                                    </div>
                                )}
                            </div>
                        }
                    </StaggeredMotion>
                </div>
                <div className="people-list__pagination">
                    <Menu type="navigation" items={pages} selectedIndex={this.state.page - 1} onItemClick={(index) => this.setState({page: index+1})} tabbable/>
                </div>
            </div>
        );
    }

    renderItem(index) {
        if(index >= this.props.list.length) {
            return null;
        }

        const item = this.props.list[index];
        const minIndex = this.props.pageSize * (this.state.page - 1);
        const maxIndex = this.props.pageSize * this.state.page;

        return (minIndex <= index && index < maxIndex) ? (
            <div className="people-list__item">
                <div className="people-list__item-profile-pic-wrapper">
                    <img className="people-list__item-profile-pic" src={item.profilePic} />
                </div>
                <div className="people-list__item-block people-list__item-name">{item.name}</div>
                <div className="people-list__item-block people-list__item-assigned-tickets">
                    {i18n('ASSIGNED_TICKETS', {tickets: item.assignedTickets})}
                </div>
                <div className="people-list__item-block people-list__item-closed-tickets">
                    {i18n('CLOSED_TICKETS', {tickets: item.closedTickets})}
                </div>
                <div className="people-list__item-block people-list__item-last-login">
                    <div>{i18n('LAST_LOGIN')}</div>
                    <div>{DateTransformer.transformToString(item.lastLogin)}</div>
                </div>
            </div>
        ) : null;
    }

    getRowsQuantity() {
        console.log(this.state.page);
        if(this.state.page == this.getPages()){
            console.log("Ultima pagina");
            console.log(this.props.list.length);
            console.log(this.props.pageSize);
            return this.props.list.length % this.props.pageSize;
        }
        else {
            return this.props.pageSize;
        }
    }


    getPages() {
        return Math.ceil(this.props.list.length / this.props.pageSize);
    }

}

export default PeopleList;