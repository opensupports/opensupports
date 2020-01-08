import AutocompleteDropDown from 'core-components/autocomplete-dropdown';

const React = require('react');
const _ = require('lodash');

class DemoPage extends React.Component {
   
    state = {
        selectedList: [
            {id: 47, name: 'asdasdasd', content: 'asdasdasd.', color: 'red'},
            {id: 48, name: '123123123', content: '123123123.', color: 'blue'},
            {id: 49, name: 'hola', content: 'hola', color: 'green'},
        ]
    }
    
	render() {
        let itemsList = [
            {id: 45, name: 'Lautaro', content: 'Lautaro.', color: 'gray'},
            {id: 46, name: 'dsafa', content: 'dsafa', color: 'black'},
            {id: 47, name: 'asdasdasd', content: 'asdasdasd.', color: 'red'},
            {id: 48, name: '123123123', content: '123123123.', color: 'blue'},
            {id: 49, name: 'hola', content: 'hola', color: 'green'},
        ];
        
        return (
            <div>
                <AutocompleteDropDown
                items={itemsList}
                value={this.state.selectedList}
                onChange={selectedList => this.setState({selectedList: selectedList})}/>
                <button onClick={() => this.setState({selectedList: []})}>clear</button>
            </div>
		);
	}
}

export default DemoPage;
