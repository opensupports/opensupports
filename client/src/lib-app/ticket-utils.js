import React from "react";
import API   from 'lib-app/api-call';
import _ from 'lodash';

export default {
    getStaffList({staffList, ticket}, type) {
        switch(type) {
            case 'toDropDown': 
                {
                    return _.filter(
                        staffList,
                        ({ departments }) => {
                            return _.some(departments, {id: ticket.department.id});
                        }
                    ).map(staff => {
                        return {
                            ...staff,
                            content: this.renderStaffOption(staff)
                        }
                    });
                };
            case 'toAutocomplete': 
               {
                    return staffList.map(staff => {
                        return {
                            id: JSON.parse(staff.id),
                            name: staff.name.toLowerCase(),
                            color: 'gray',
                            contentOnSelected: this.renderStaffSelected(staff),
                            content: this.renderStaffOption(staff),
                        }
                    });
               };
        }
    },

    getStaffProfilePic(staff) {
        return staff.profilePic ? API.getFileLink(staff.profilePic) : (API.getURL() + '/images/profile.png');
    },

    renderStaffOption(staff) {
        return (
            <div className="ticket-query-filters__staff-option" key={`staff-option-${staff.id}`}>
                <img className="ticket-query-filters__staff-option__profile-pic" src={this.getStaffProfilePic(staff)}/>
                <span className="ticket-query-filters__staff-option__name">{staff.name}</span>
            </div>
        );
    },

    renderStaffSelected(staff) {
        return (
            <div className="ticket-query-filters__staff-selected" key={`staff-selected-${staff.id}`}>
                <img className="ticket-query-filters__staff-selected__profile-pic" src={this.getStaffProfilePic(staff)}/>
                <span className="ticket-query-filters__staff-selected__name">{staff.name}</span>
            </div>
        );
    }
}
