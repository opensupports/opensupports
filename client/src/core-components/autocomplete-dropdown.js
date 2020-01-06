import React from 'react';
import _ from 'lodash';

import DropDown from 'core-components/drop-down';
import Menu from 'core-components/menu';
import Tag from 'core-components/tag';

class AutocompleteDropDown extends React.Component {

    static propTypes = {
        items: Menu.propTypes.items,
    };

    state = {
        selectedIndex: 0,
        itemsSelected: [],
    };

    render() {
        return (
            <div className="tag-selector">
                <label /*for="query"*/>
                    <DropDown
                        className="tag-selector__drop-down" 
                        items={this.getDropdownList()}
                        selectedIndex={this.state.selectedIndex} size="large"
                        onChange={e => this.setState({
                            itemsSelected: [...this.state.itemsSelected, this.getDropdownList()[e.index]],
                        })}
                    >   
                        <input style={{width:'100%'}} id="query" />
                        {this.renderSelectedItems()}
                    </DropDown>
                </label>
            </div>
        );
    }

    getDropdownList() {
        const {items} = this.props;
        return this.getUnselectedList(items, this.state.itemsSelected);
    }

    getUnselectedList(list, selectedList) {
        return list.filter(item  => !_.some(selectedList, item));
    }

    renderSelectedItems() {
        console.log('itemsSelected: ', this.state.itemsSelected);
        return this.state.itemsSelected.map(item => this.renderSelectedItem(item));
    }

    renderSelectedItem(item) {
        console.log(item.id);
        return  <Tag name={item.content} color='gray' showDeleteButton onRemoveClick={this.onRemoveClick.bind(this,item.id)}  key={item.id}/>          
    }

    onRemoveClick(itemId) {
        this.setState({
            itemsSelected: this.state.itemsSelected.filter(item => item.id != itemId),
        });
    }
    
}

export default AutocompleteDropDown;
