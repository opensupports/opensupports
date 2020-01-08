import AutocompleteDropDown from 'core-components/autocomplete-dropdown';

const React = require('react');
const _ = require('lodash');

class DemoPage extends React.Component {
   
    state = {
        selectedList: []
    }
    
	render() {
        let itemsList = [
            {id: 45, name: 'Lautaro', content: 'Lautaro.', color: 'red'},
            {id: 46, name: 'dsafa', content: 'dsafa', color: 'red'},
            {id: 47, name: 'asdasdasd', content: 'asdasdasd.', color: 'red'},
            {id: 48, name: '123123123', content: '123123123.', color: 'blue'},
            {id: 49, name: 'hola', content: 'hola', color: 'green'},
        ];
        
        return (
            <AutocompleteDropDown
                items={itemsList}
                value={this.state.selectedList}
                onChange={selectedList => this.setState({selectedList})}/>
		);
	}
}

export default DemoPage;
