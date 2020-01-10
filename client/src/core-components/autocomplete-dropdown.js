import React, { createRef }from 'react';
import _ from 'lodash';
import keyCode from 'keycode';

import DropDown from 'core-components/drop-down';
import Menu from 'core-components/menu';
import Tag from 'core-components/tag';

class AutocompleteDropDown extends React.Component {

    static propTypes = {
        //items: Menu.propTypes.items,
        onChange: React.PropTypes.func,
        values: React.PropTypes.arrayOf(React.PropTypes.shape({})),
        onRemoveClick: React.PropTypes.func,
        onTagSelected: React.PropTypes.func,
        //getItemListFromQuery: React.propTypes.func,
        disabled: React.PropTypes.bool,
    };

    state = {
        itemsSelected: [],
        inputValue: "",
        opened: false,
        highlightedIndex: 0,
        items2: [],
    };

    componentDidMount() {
        const { getItemListFromQuery, } = this.props;

        if (this.state.items2.length === 0){
            if(getItemListFromQuery !== undefined) {
                getItemListFromQuery("")
                .then(res => {
                    this.setState({
                        items2: res,
                    });
                });
            }

        }
    }

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
                <label onClick={(e) => e.stopPropagation()}>
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
        const {
            items,
        } = this.props;
        let resp = [];

        if (items !== undefined) {
            const list = this.getUnselectedList(items, this.getValue());

            resp = list.filter(s => _.includes(s.name, this.state.inputValue));

        } else {
            resp = this.getUnselectedList(this.state.items2, this.getValue());

        }

        return resp;

    }

    getUnselectedList(list, selectedList) {
        return list.filter(item  => !_.some(selectedList, item));
    }

    getValue() {
        const { values, } = this.props;

        return (values !== undefined) ? values : this.state.itemsSelected;
    }

    getDeletingItemLoading() {
        const  { deletingItemLoading, } = this.props;

        return (deletingItemLoading !== undefined) ? deletingItemLoading : false;
    }

    onRemoveClick(itemId, event) {
        const {
            onChange,
            onRemoveClick,
        } = this.props;

        event.preventDefault();

        this.setState({
            itemsSelected: this.getValue().filter(item => item.id != itemId),
            opened: false,
            highlightedIndex: 0,
        });

        onChange && onChange(this.getValue().filter(item => item.id != itemId));

        onRemoveClick && onRemoveClick(itemId);
    }

    onChangeDropDown(e){
        const {
            onChange,
            onTagSelected,
            getItemListFromQuery,
        } = this.props;

        if (this.getDropdownList().length) {
            this.setState({
                itemsSelected: [...this.getValue(), this.getDropdownList()[e.index]],
                inputValue: "",
                highlightedIndex: 0,
            });

            if (getItemListFromQuery !== undefined) {
                getItemListFromQuery("")
                .then(res => {
                    this.setState({
                        items2: res,
                    });
                })
            }

            onChange && onChange([...this.getValue(), this.getDropdownList()[e.index]]);

            onTagSelected && onTagSelected(this.getDropdownList()[e.index].id);
    
        }

    }

    onChangeInput(str){
        const { getItemListFromQuery, } = this.props;

        this.setState({
            inputValue: str,
            opened: true,
            highlightedIndex: 0,
        });

        if (getItemListFromQuery !== undefined) {
            getItemListFromQuery(str)
            .then(res => {
                this.setState({
                    items2: res,
                });
            })
        }
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
        const {
            onChange,
            onRemoveClick,
        } = this.props;

        if(this.props.disabled) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }

        if (keyCode(event) === "space"){
            event.stopPropagation();
        }

        if (keyCode(event) === "backspace" && this.state.inputValue === ""){
            this.setState({
                itemsSelected: this.getValue().slice(0,this.getValue().length-1),
                highlightedIndex: 0,
            });

            onChange && onChange(this.getValue().slice(0,this.getValue().length-1));

            if (this.getValue().length) {
                const itemId = this.getValue()[this.getValue().length-1].id;
                onRemoveClick && onRemoveClick(itemId);
            }
        }
    }

}

export default AutocompleteDropDown;
