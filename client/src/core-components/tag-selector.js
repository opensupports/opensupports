import React from 'react';
import _ from 'lodash';
import AutocompleteDropDown from './autocomplete-dropdown';

class TagSelector extends React.Component {

    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.string,
        })),
        values: React.PropTypes.arrayOf(React.PropTypes.string),
        onRemoveClick: React.PropTypes.func,
        onTagSelected: React.PropTypes.func,
        loading: React.PropTypes.bool,
    };

    render() {
        const items = this.props.items.map(tag => ({...tag, content: this.renderTagOption(tag)}));
        const values = items.filter(item => _.includes(this.props.values, item.name ));

        return (
            <div className="tag-selector">
                <AutocompleteDropDown
                    items={items}
                    values={values}
                    onRemoveClick={this.props.onRemoveClick}
                    onTagSelected={this.props.onTagSelected}
                    disabled={this.props.loading} />
            </div>
        );
    }

    renderTagOption(item) {
        return (
            <div className="tag-selector__tag-option" key={`tag-option-${item.id}`}>
                <span className="tag-selector__tag-option-square" style={{backgroundColor:item.color}}/>
                <span className="tag-selector__tag-option-name" >{item.name}</span>
            </div>
        );
    }

}
export default TagSelector;
