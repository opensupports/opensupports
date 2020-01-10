import AutocompleteDropDown from 'core-components/autocomplete-dropdown';

const React = require('react');
const _ = require('lodash');

const searchApi = (query) => {
    const data = [
        {id: 11, name: 'ivan', content: 'Ivan.', color: 'red',},
        {id: 12, name: 'lautaro', content: 'Lautaro.', color: 'indigo',},
        {id: 13, name: 'javier', content: 'Javier.', color: 'cyan',},
        {id: 14, name: 'guillermo', content: 'Guillermo.', color: 'violet',},
    ]

    return new Promise((res,rej) => {
        setTimeout(function () {
            res(data.filter(item => _.includes(item.name, query)));
        }, 500);
    })
};

class DemoPage extends React.Component {
   
    state = {
        selectedList: [
            {id: 47, name: 'asdasdasd', content: 'asdasdasd.', color: 'red'},
            {id: 48, name: '123123123', content: '123123123.', color: 'blue'},
            {id: 49, name: 'hola', content: 'hola', color: 'green'},
        ],
        selectedList2: []
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
                values={this.state.selectedList}
                onChange={selectedList => this.setState({selectedList: selectedList})}/>
                <button onClick={() => this.setState({selectedList: []})}>clear</button>

                <AutocompleteDropDown
                values={this.state.selectedList2}
                getItemListFromQuery={searchApi}
                onChange={selectedList => this.setState({selectedList2: selectedList})}/>
                <button onClick={() => this.setState({selectedList2: []})}>clear</button>

            </div>
		);
	}
}

export default DemoPage;
