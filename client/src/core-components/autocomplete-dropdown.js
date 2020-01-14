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

    id = 1;

    state = {
        itemsSelected: [],
        inputValue: "",
        opened: false,
        highlightedIndex: 0,
        items2: [],
        loading: false,
    };

    componentDidMount() {
        const { getItemListFromQuery, } = this.props;

        this.setTimeout = _.throttle((query) => {
            let id = ++this.id;

            getItemListFromQuery(query, this.getValue().map(item => item.id))
            .then(res => {
                if(id === this.id)
                this.setState({
                    items2: res,
                    loading: false,
                });
            })
            .catch(() => this.setState({
                loading: false,
            }));
        }, 300, {leading: false});

        this.searchApi("");

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
                        loading={this.state.loading}
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
        return  <Tag
                    name={item.name}
                    color={item.color}
                    showDeleteButton
                    onRemoveClick={this.onRemoveClick.bind(this,item.id)}
                    key={item.id}/>
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

    onRemoveClick(itemId, event) {
        const {
            onChange,
            onRemoveClick,
        } = this.props;

        const newList = this.getValue().filter(item => item.id != itemId);

        event.preventDefault();

        this.setState({
            itemsSelected: newList,
            opened: false,
            highlightedIndex: 0,
        });

        onChange && onChange(newList);
        onRemoveClick && onRemoveClick(itemId);
        this.searchApi("", newList);
    }

    onChangeDropDown(e){
        const {
            onChange,
            onTagSelected,
        } = this.props;

        if (this.getDropdownList().length) {
            const itemSelected = this.getDropdownList()[e.index];
            const newList = [...this.getValue(), itemSelected];

            this.setState({
                itemsSelected: newList,
                inputValue: "",
                highlightedIndex: 0,
            });

            onChange && onChange(newList);
            onTagSelected && onTagSelected(itemSelected.id);
            this.searchApi("", newList);
    
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
            this.setState({
                loading: true,
            });

            this.setTimeout(str);

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
            const newList = this.getValue().slice(0,this.getValue().length-1);
            this.setState({
                itemsSelected: newList,
                highlightedIndex: 0,
            });

            onChange && onChange(newList);

            if (this.getValue().length) {
                const itemId = this.getValue()[this.getValue().length-1].id;

                onRemoveClick && onRemoveClick(itemId);
            }

            this.searchApi("", newList);

        }

    }

    searchApi(query, blacklist=this.getValue()) {
        const { getItemListFromQuery, } = this.props;

        if (getItemListFromQuery !== undefined) {

            getItemListFromQuery(query, blacklist.map(item => item.id))
            .then(res => {
                this.setState({
                    items2: res,
                    loading: false,
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                })
            })

        }

    }

}

export default AutocompleteDropDown;
