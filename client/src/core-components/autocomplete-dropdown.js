import React, { createRef }from 'react';
import _ from 'lodash';
import keyCode from 'keycode';

import DropDown from 'core-components/drop-down';
import Menu from 'core-components/menu';
import Tag from 'core-components/tag';

class AutocompleteDropDown extends React.Component {

    static propTypes = {
        items: Menu.propTypes.items,
        onChange: React.PropTypes.func,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
        }))
    };

    state = {
        itemsSelected: [],
        inputValue: "",
        opened: false,
        highlightedIndex: 0,
    };

    render() {
        let inputWith = 0;
        if(this.span) {
            this.span.style.display = 'inline';
            this.span.textContent = this.state.inputValue;
            inputWith = Math.ceil(this.span.getBoundingClientRect().width) + 20
            this.span.style.display = 'none';
        }
        
        return (
            <div className="tag-selector">
                <label>
                    <DropDown
                        className="tag-selector__drop-down"
                        items={this.getDropdownList()}
                        size="large"
                        onChange={e => this.onChangeDropDown(e)}
                        onMenuToggle={b => this.onMenuToggle(b)}
                        opened={this.state.opened}
                        onHighlightedIndexChange={n => this.onHighlightedIndexChange(n)}
                        highlightedIndex={this.state.highlightedIndex}
                    >
                        {this.renderSelectedItems()}
                        <input
                            className="autocomplete__input"
                            id="query"
                            ref={input => this.input = input}
                            value={this.state.inputValue}
                            onKeyDown={e => this.onKeyDown(e)}
                            onChange={e => this.onChangeInput(e.target.value)}
                            style={this.span ? {width: inputWith} : {}}
                        />
                        <span className="sizer" ref={span => this.span = span} />
                    </DropDown>
                </label>
            </div>
        );
    }

    renderSelectedItems() {
        return this.getValue().map(item => this.renderSelectedItem(item));
    }

    renderSelectedItem(item) {
        return  <Tag name={item.name} color={item.color} showDeleteButton onRemoveClick={this.onRemoveClick.bind(this,item.id)}  key={item.id}/>
    }

    getDropdownList() {
        const { items, } = this.props;
        const list = this.getUnselectedList(items, this.getValue());
        
        return list.filter(s => _.includes(s.name, this.state.inputValue));
    }

    getUnselectedList(list, selectedList) {
        return list.filter(item  => !_.some(selectedList, item));
    }

    onRemoveClick(itemId, event) {
        const { onChange, } = this.props;

        event.preventDefault();

        this.setState({
            itemsSelected: this.getValue().filter(item => item.id != itemId),
            opened: false,
            highlightedIndex: 0,
        });

        onChange && onChange(this.getValue().filter(item => item.id != itemId));

    }

    onChangeDropDown(e){
        const { onChange, } = this.props;

        if (this.getDropdownList().length) {
            this.setState({
                itemsSelected: [...this.getValue(), this.getDropdownList()[e.index]],
                inputValue: "",
                highlightedIndex: 0,
            });

            onChange && onChange([...this.getValue(), this.getDropdownList()[e.index]]);
    
        }

    }

    onChangeInput(str){        
        this.setState({
            inputValue: str,
            opened: true,
            highlightedIndex: 0,
        });
    }

    onMenuToggle(b){
        this.setState({
            opened: b,
        });
    }
    
    onHighlightedIndexChange(n){
        this.setState({
            highlightedIndex: n,
        });
    }

    onKeyDown(event){
        const { onChange, } = this.props;

        if (keyCode(event) === "space"){
            event.stopPropagation();
        }

        if (keyCode(event) === "backspace" && this.state.inputValue === ""){
            this.setState({
                itemsSelected: this.getValue().slice(0,this.getValue().length-1),
                highlightedIndex: 0,
            });

            onChange && onChange(this.getValue().slice(0,this.getValue().length-1));
        }
    }

    getValue() {
        return (this.props.value !== undefined) ? this.props.value : this.state.itemsSelected;
    }

}

export default AutocompleteDropDown;
