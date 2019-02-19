import React from 'react';
import _ from 'lodash';
import Icon from 'core-components/icon';

class TagSelector extends React.Component {

    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.string
        })),
        values: React.PropTypes.arrayOf(React.PropTypes.string)
    };

    render() {
        return (
            <div>
                <div style={{alignItems:'center', backgroundColor:'light-blue'}}>
                    <h2>Tags</h2>
                    <div style={{justifyContent:'flex-start', borderRadius:'25px', backgroundColor:'grey'}}>{this.renderItemsList()}</div>
                </div>
                <div>{this.props.values.join()}</div>
            </div>
        );
    }
    renderItemsList() {
        const itemList = _.filter(this.props.items,(item) => !_.includes(this.props.values,item.name));
        console.log('la lista de items librs',itemList);
        return itemList.map((item,index) => {
                return(
                    <spam style={{justifyContent:'space-between',backgroundColor:item.color,borderRadius:'25px'}} key={index}>
                        <spam >{item.name}</spam>
                        <spam style={{color:item.color,borderRadius:'25px' ,backgroundColor:'white'}}>x</spam>
                    </spam>
                )
        });
    }
}
export default TagSelector;
