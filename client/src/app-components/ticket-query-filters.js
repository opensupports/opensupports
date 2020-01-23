import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import keyCode from 'keycode';

import Input from 'core-components/input';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import TagSelector from 'core-components/tag-selector';


class TicketQueryFilters extends React.Component {

    static propTypes = {
        onChange: React.PropTypes.func,
        departments: React.PropTypes.arrayOf(React.PropTypes.number),
        tags: React.PropTypes.array,
        //defaultValue: React.PropTypes.
    }
    
    state = {
        filters: this.props.defaultValue,
    }
    render() {

        return (
            <div className="ticket-query-filters">
                <Input
                    className="ticket-query-filters__input"
                    value={this.state.query}
                    onKeyDown={e => this.onKeyDown(e)}
                    onChange={e => this.onChangeInput(e.target.value)} />
                {this.renderDropDown()}
                <TagSelector 
                    items={this.getTags(this.props.tags)}
                    values={this.getSelectedTags().map(tag => tag.name)}
                    onTagSelected={this.addTag.bind(this)}
                    onRemoveClick={this.removeTag.bind(this)}
                    />
            </div>
        );
    }

    renderDropDown() {

        return (
            <Form value={{ closed: [], }} onChange={this.onChangeFrom.bind(this)}>
                <FormField name="closed" field="select" fieldProps={{items: this.getItems()}} />
            </Form>
        );
    }

    onChangeInput(str) {
        this.setState({
            filters: {...this.state.filters, query: str},
        });
    }
    
    onKeyDown(event) {
        const { onChange, } = this.props;

        if(keyCode(event) === "enter") {
            onChange && onChange(this.state.filters);
        }
    }

    getItems() {
        let items = [
            {id: 0, name: 'Any', content: 'Any'},
            {id: 1, name: 'Opend', content: 'Opend'},
            {id: 2, name: 'Closed', content: 'Closed'},
        ]

        return items;
    }

    onChangeFrom(data) {
        const { onChange, } = this.props;
        let value = data.closed === 0 ? undefined : data.closed-1;
        
        this.setState({
            filters: {...this.state.filters, closed: value},
         });
         onChange && onChange({...this.state.filters, closed: value})
    }

    addTag(tag) {
        const { onChange, } = this.props;
        let newTags = JSON.stringify(JSON.parse(this.state.filters.tags).concat([tag]));

        this.setState({
            filters: {...this.state.filters, tags: newTags},
        });

        onChange && onChange({...this.state.filters, tags: newTags});
    }

    getSelectedTags() {
        const { tags, } = this.props;
        let tagList = this.getTags(tags);
        let tagsIdList = JSON.parse(this.state.filters.tags);
        let selectedTags = tagList.filter(item => _.includes(tagsIdList, item.id));
        
        return selectedTags;
    }

    removeTag(tag) {
        const { onChange, } = this.props;
        let newTagList = JSON.stringify((JSON.parse(this.state.filters.tags)).filter(item => item !== tag));

        this.setState({
            filters: {...this.state.filters, tags: newTagList},
        });

        onChange && onChange({...this.state.filters, tags: newTagList});
    }

    getTags(tagList) {
        let newTagList = tagList.map(tag => {
            return {
                id: JSON.parse(tag.id),
                name: tag.name,
                color : tag.color
            }
        });

        return newTagList;
    }

    getUnselectedTags(list, selectedList) {

        return list.filter(item  => !_.some(selectedList, item));
    }

}

export default connect((store) => {
    return {
        tags: store.config['tags'],
    };
})(TicketQueryFilters);