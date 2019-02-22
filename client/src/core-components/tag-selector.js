import React from 'react';
import _ from 'lodash';
import Icon from 'core-components/icon';
import DropDown from 'core-components/drop-down';
import Tag from 'core-components/tag';

class TagSelector extends React.Component {

    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.string,
        })),
        values: React.PropTypes.arrayOf(React.PropTypes.string),
        onRemoveClick: React.PropTypes.func,
    };

    render() {
        return (
            <div className="tag-selector">
                <DropDown className="tag-selector__drop-down" items={this.renderTagOptions().map(tag => ({content: tag}))} selectedIndex={-1} size="large">
                    {this.renderSelectedTags()}
                </DropDown>
            </div>
        );
    }

    renderSelectedTags() {
        const itemList = this.props.values.map(value => _.find(this.props.items, {name:value}));

        return itemList.map(this.renderSelectedTag.bind(this));
    }


    renderSelectedTag(item,index) {
        return <Tag name={item.name} color={item.color} showDeleteButton onRemoveClick={this.onRemoveClick.bind(this,item.id)} key={index}/>;

    }

    renderTagOptions() {
        const itemList = _.filter(this.props.items,(item) => !_.includes(this.props.values,item.name));

        return itemList.map(this.renderTagOption.bind(this));
    }

    renderTagOption(item,index) {
        return (
            <div onClick={this.onTagSelected.bind(this,item.id)} className="tag-selector__tag-option" key={index}>
                <span className="tag-selector__tag-option-square" style={{backgroundColor:item.color}}/>
                <span className="tag-selector__tag-option-name" >{item.name}</span>
            </div>
        );
    }

    onRemoveClick(tagId) {
        if(this.props.onRemoveClick){
            this.props.onRemoveClick(tagId);
        }
    }

    onTagSelected(tagId) {
        if(this.props.onTagSelected){
            this.props.onTagSelected(tagId);
        }
    }
}
export default TagSelector;
