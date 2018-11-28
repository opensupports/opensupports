import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import DropDown from 'core-components/drop-down';
import Icon from 'core-components/icon';

class DepartmentDropdown extends React.Component {
    static propTypes = {
        value: React.PropTypes.number,
        onChange: React.PropTypes.func,
        departments: React.PropTypes.array
    }
    render(){
        return <DropDown {...this.props} items={this.getDepartments()} />
    }

    getDepartments(){
        let departments = this.props.departments.map((department) => {
            if(department.private*1) {
                return {content: <span>{department.name} <Icon name='user-secret'/></span>};
            }else{
                return {content: department.name};
            }
        });

        return departments;
    }
}

export default DepartmentDropdown;
