import React from 'react';
import _ from 'lodash';
import Icon from 'core-components/icon';

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
                <div className="tag-selector__selected-tags">
                    {this.renderSelectedTags()}
                </div>
                <div className="tag-selector__tag-options">
                    {this.renderTagOptions()}
                </div>
            </div>
        );
    }

    renderSelectedTags() {
        const itemList = this.props.values.map(value => _.find(this.props.items, {name:value}));

        return itemList.map(this.renderSelectedTag.bind(this));
    }


    renderSelectedTag(item,index) {
        return (
            <div className="tag-selector__selected-tag" style={{backgroundColor:item.color}} key={index}>
                <span className="tag-selector__selected-tag-name">{item.name}</span>
                <span onClick={this.onRemoveClick.bind(this,item.name)} className="tag-selector__selected-tag-remove" >
                    <Icon name="times-circle" size="small"/>
                </span>
            </div>
        );
    }

    renderTagOptions() {
        const itemList = _.filter(this.props.items,(item) => !_.includes(this.props.values,item.name));

        return itemList.map(this.renderTagOption.bind(this));
    }

    renderTagOption(item,index) {
        return (
            <div onClick={this.onTagSelected.bind(this,item.name)} className="tag-selector__tag-option" style={{backgroundColor:item.color}} key={index}>
                <span className="tag-selector__tag-option-name" >{item.name}</span>
            </div>
        );
    }

    onRemoveClick(name) {
        if(this.props.onRemoveClick){
            this.props.onRemoveClick(name);
        }
    }
    onTagSelected(name) {
        if(this.props.onTagSelected){
            this.props.onTagSelected(name);
        }
    }

}
export default TagSelector;
