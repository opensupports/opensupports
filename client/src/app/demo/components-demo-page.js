import AutocompleteDropDown from 'core-components/autocomplete-dropdown';

const React = require('react');
const _ = require('lodash');

class DemoPage extends React.Component {
    
	render() {
        let itemsList = [
            {id: 45, content: 'content item 1'},
            {id: 46, content: 'content item 2'},
            {id: 47, content: 'content item 3'},
            {id: 48, content: 'content item 4'},
            {id: 49, content: 'content item 5'},
        ];
        
        return (
            <AutocompleteDropDown items={itemsList} />
		);
	}
}

export default DemoPage;
