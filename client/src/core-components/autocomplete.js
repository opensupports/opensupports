import React from 'react';
import _ from 'lodash';
import keyCode from 'keycode';

import DropDown from 'core-components/drop-down';
import Tag from 'core-components/tag';

const ItemsSchema = React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string,
    content: React.PropTypes.node,
    color: React.PropTypes.string,
}));

class Autocomplete extends React.Component {

    static propTypes = {
        items: ItemsSchema,
        onChange: React.PropTypes.func,
        values: ItemsSchema,
        onRemoveClick: React.PropTypes.func,
        onTagSelected: React.PropTypes.func,
        getItemListFromQuery: React.PropTypes.func,
        disabled: React.PropTypes.bool,
    };

    id = 1;

    state = {
        selectedItems: [],
        inputValue: "",
        opened: false,
        highlightedIndex: 0,
        itemsFromQuery: [],
        loading: false,
    };

    componentDidMount() {
        const { getItemListFromQuery, } = this.props;

        this.setTimeout = _.throttle((query) => {
            let id = ++this.id;

            getItemListFromQuery(query, this.getSelectedItems().map(item => item.id))
            .then(result => {
                if(id === this.id)
                this.setState({
                    itemsFromQuery: result,
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
        let inputWidth = 0;

        if(this.span) {
            this.span.style.display = 'inline';
            this.span.textContent = this.state.inputValue;
            inputWidth = Math.ceil(this.span.getBoundingClientRect().width)-31;
            this.span.style.display = 'none';
        }

        return (
            <div className="autocomplete">
                <label className="autocomplete__label" onClick={(e) => e.stopPropagation()}>
                    <DropDown
                        className="autocomplete__drop-down"
                        items={this.getDropdownList()}
                        size="large"
                        onChange={e => this.onChangeDropDown(e)}
                        onMenuToggle={e => this.onMenuToggle(e)}
                        opened={this.state.opened}
                        onHighlightedIndexChange={n => this.onHighlightedIndexChange(n)}
                        highlightedIndex={this.state.highlightedIndex}
                        loading={this.state.loading}
                    >
                        {this.renderSelectedItems()}
                        <input
                            className="autocomplete__input"
                            ref={input => this.input = input}
                            value={this.state.inputValue}
                            onKeyDown={e => this.onKeyDown(e)}
                            onChange={e => this.onChangeInput(e.target.value)}
                            style={this.span ? {width: inputWidth} : {}} />
                        <span className="sizer" ref={span => this.span = span} />
                    </DropDown>
                </label>
            </div>
        );
    }

    renderSelectedItems() {
        return this.getSelectedItems().map(item => this.renderSelectedItem(item));
    }

    renderSelectedItem(item) {
        return  <Tag
                    name={item.contentOnSelected || item.name}
                    color={item.color}
                    showDeleteButton
                    onRemoveClick={this.onRemoveClick.bind(this,item.id)}
                    key={"tagId__" + item.id} />
    }

    getDropdownList() {
        const {
            items,
        } = this.props;
        let dropdownList = [];

        if(items !== undefined) {
            const list = this.getUnselectedList(items, this.getSelectedItems());

            dropdownList = list.filter(s => _.includes(s.name, this.state.inputValue));
        } else {
            dropdownList = this.getUnselectedList(this.state.itemsFromQuery, this.getSelectedItems());
        }

        return dropdownList;
    }

    getUnselectedList(list, selectedList) {

        return list.filter(item  => !_.some(selectedList, item));
    }

    getSelectedItems() {
        const { values, } = this.props;

        return (values !== undefined) ? values : this.state.selectedItems;
    }

    onRemoveClick(itemId, event) {
        const {
            onChange,
            onRemoveClick,
        } = this.props;
        const newList = this.getSelectedItems().filter(item => item.id != itemId);
        event.preventDefault();

        this.setState({
            selectedItems: newList,
            opened: false,
            highlightedIndex: 0,
        });

        onChange && onChange(newList);
        onRemoveClick && onRemoveClick(itemId);
        this.searchApi("", newList);
    }

    onChangeDropDown(e) {
        const {
            onChange,
            onTagSelected,
        } = this.props;

        if(this.getDropdownList().length) {
            const itemSelected = this.getDropdownList()[e.index];
            const newList = [...this.getSelectedItems(), itemSelected];

            this.setState({
                selectedItems: newList,
                inputValue: "",
                highlightedIndex: 0,
                opened: false,
            });

            onChange && onChange(newList);
            onTagSelected && onTagSelected(itemSelected.id);
            this.searchApi("", newList);
        }
    }

    onChangeInput(str) {
        const { getItemListFromQuery, } = this.props;

        this.setState({
            inputValue: str,
            opened: true,
            highlightedIndex: 0,
        });

        if(getItemListFromQuery !== undefined) {
            this.setState({
                loading: true,
            });

            this.setTimeout(str);
        }
    }

    onMenuToggle(e) {
        this.setState({
            opened: e,
        });
    }

    onHighlightedIndexChange(index) {
        this.setState({
            highlightedIndex: index,
        });
    }

    onKeyDown(event) {
        const {
            onChange,
            onRemoveClick,
        } = this.props;

        if(this.props.disabled) {
            event.stopPropagation();
            event.preventDefault();

            return;
        }

        if(keyCode(event) === "space") {
            event.stopPropagation();
        }

        if(keyCode(event) === "backspace" && this.state.inputValue === "") {
            const lastSelectedItemsIndex = this.getSelectedItems().length-1;
            const newList = this.getSelectedItems().slice(0, lastSelectedItemsIndex);
            this.setState({
                selectedItems: newList,
                highlightedIndex: 0,
            });
            onChange && onChange(newList);

            if(this.getSelectedItems().length) {
                const itemId = this.getSelectedItems()[lastSelectedItemsIndex].id;

                onRemoveClick && onRemoveClick(itemId);
            }

            this.searchApi("", newList);
        }
    }

    searchApi(query, blacklist=this.getSelectedItems()) {
        const { getItemListFromQuery, } = this.props;

        if(getItemListFromQuery !== undefined) {
            getItemListFromQuery(query, blacklist.map(item => item.id))
            .then(result => {
                this.setState({
                    itemsFromQuery: result,
                    loading: false,
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                });
            });
        }
    }
}

export default Autocomplete;
