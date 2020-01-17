// LIBS
const _ = require('lodash');

// MOCKS
const Tag = ReactMock();
const DropDown = ReactMock();

// COMPONENT
const Autocomplete = requireUnit('core-components/autocomplete', {
    'core-components/drop-down': DropDown,
    'core-components/tag': Tag,
});


const color = [
    'red',
    'cyan',
    'blue',
    'green',
];

let countries = ["Afghanistan","Åland Islands","Albania","Algeria","American Samoa","AndorrA","Angola","Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo, The Democratic Republic of the","Cook Islands","Costa Rica","Cote D'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands (Malvinas)","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and Mcdonald Islands","Holy See (Vatican City State)","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran, Islamic Republic Of","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Korea, Democratic People'S Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao People'S Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia, The Former Yugoslav Republic of","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldova, Republic of","Monaco","Mongolia","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestinian Territory, Occupied","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russian Federation","RWANDA","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia and Montenegro","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the South Sandwich Islands","Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Swaziland","Sweden","Switzerland","Syrian Arab Republic","Taiwan, Province of China","Tajikistan","Tanzania, United Republic of","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela","Viet Nam","Virgin Islands, British","Virgin Islands, U.S.","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"];
countries = countries.map((name, index) => {
    return {
        id: index,
        name: name.toLowerCase(),
        content: name,
        color: color[_.random(0, color.length-1)],
    }
});

const timeout = function (f, t) {
    return new Promise(function (res) {
        setTimeout(function() {
            res(f());
        },t);
    });
};

const searchApi = spy((query, blacklist = []) => {
    const data = countries.filter(x => !_.includes(blacklist, x.id));

    return new Promise((res,rej) => {
        setTimeout(function () {
            const result = data.filter(item => _.includes(item.name, query));
            res(result.slice(0, 10));
        }, query == 'brazilq' ? 100 : 50);
    });
});

describe('Autocomplete component with external api', function () {
    let selectedList2 = [], autocompleteInput, autocompleteDropdown;
    function renderAutocomplete(props) {
        selectedList2 = [];

        let autocompleteWithExternalApi = TestUtils.renderIntoDocument(
            <Autocomplete
                getItemListFromQuery={searchApi}
                onChange={selectedList => selectedList2 = selectedList} />
        );

        autocompleteInput = TestUtils.scryRenderedDOMComponentsWithClass(autocompleteWithExternalApi, 'autocomplete__input')[0];
        autocompleteDropdown = TestUtils.scryRenderedComponentsWithType(autocompleteWithExternalApi, DropDown)[0];
    }

    describe('writing in input', function() {
        beforeEach(function() {
            renderAutocomplete();
        });

        it('should open menu with list', function() {
            expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
            autocompleteInput.value = "ho";
            TestUtils.Simulate.change(autocompleteInput);
            expect(autocompleteDropdown.props.opened).to.equal(true);
            expect(autocompleteDropdown.props.loading).to.equal(true);
            return timeout(function () {
                expect(searchApi).to.have.been.calledWith("ho", selectedList2.map(item => item.id));
                expect(autocompleteDropdown.props.loading).to.equal(false);
                expect(autocompleteDropdown.props.items.length).to.equal(4);
                expect(selectedList2.length).to.equal(0);
                autocompleteDropdown.props.onChange({index: 1});
                expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                expect(selectedList2[0].name).to.equal("honduras");
                expect(autocompleteDropdown.props.opened).to.equal(false);
            }, 360);
        });

        it('should select item if enter is pressed', function() {
            expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
            autocompleteInput.value = "argentina";
            TestUtils.Simulate.change(autocompleteInput);
            expect(autocompleteDropdown.props.opened).to.equal(true);
            expect(autocompleteDropdown.props.loading).to.equal(true);
            return timeout(function () {
                expect(searchApi).to.have.been.calledWith("argentina", selectedList2.map(item => item.id));
                expect(autocompleteDropdown.props.loading).to.equal(false);
                expect(autocompleteDropdown.props.items.length).to.equal(1);
                expect(selectedList2.length).to.equal(0);
                autocompleteDropdown.props.onChange({index: 0});
                expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                expect(selectedList2.length).to.equal(1);
                expect(autocompleteDropdown.props.opened).to.equal(false);
            }, 360);
        });

        it("should sinc", function() {
            expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
            autocompleteInput.value = "brazilq";
            TestUtils.Simulate.change(autocompleteInput);
            expect(autocompleteDropdown.props.opened).to.equal(true);
            expect(autocompleteDropdown.props.loading).to.equal(true);
            return timeout(function () {
                expect(searchApi).to.have.not.been.calledWith("brazil", selectedList2.map(item => item.id));
                autocompleteInput.value = "brazil";
                TestUtils.Simulate.change(autocompleteInput);
                return timeout(function () {
                    expect(searchApi).to.have.been.calledWith("brazil", selectedList2.map(item => item.id));
                    expect(autocompleteDropdown.props.opened).to.equal(true);
                    expect(autocompleteDropdown.props.items.length).to.equal(1);
                    expect(selectedList2.length).to.equal(0);
                    autocompleteDropdown.props.onChange({index: 0});
                    expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                    expect(autocompleteDropdown.props.opened).to.equal(false);
                    expect(selectedList2.length).to.equal(1);
                    expect(selectedList2[0].name).to.equal("brazil");
                    autocompleteDropdown.props.onMenuToggle(true);
                    expect(autocompleteDropdown.props.opened).to.equal(true);
                    expect(autocompleteDropdown.props.items.length).to.equal(0); 
                }, 360);
            }, 50);
        });

        it("should delete item if backspace is pressed and input value is '' ", function() {
            expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
            autocompleteInput.value = "za";
            TestUtils.Simulate.change(autocompleteInput);
            expect(autocompleteDropdown.props.opened).to.equal(true);
            expect(autocompleteDropdown.props.loading).to.equal(true);
            return timeout(function () {
                expect(searchApi).to.have.been.calledWith("za", selectedList2.map(item => item.id));
                autocompleteDropdown.props.onChange({index: 3});
                expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                expect(selectedList2[0].name).to.equal("zambia");
                expect(selectedList2.length).to.equal(1);
                TestUtils.Simulate.keyDown(autocompleteInput, {key: 'backspace', keyCode: 8, which: 8});
                expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                expect(selectedList2.length).to.equal(0);
                autocompleteInput.value = "";
                TestUtils.Simulate.change(autocompleteInput);
                expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                TestUtils.Simulate.keyDown(autocompleteInput, {key: 'backspace', keyCode: 8, which: 8});
                expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                expect(selectedList2.length).to.equal(0);
            }, 360);
        });

        it("should ...", function() {
            expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
            autocompleteInput.value = "ang";
            TestUtils.Simulate.change(autocompleteInput);
            expect(autocompleteDropdown.props.opened).to.equal(true);
            expect(autocompleteDropdown.props.loading).to.equal(true);
            return timeout(function () {
                expect(searchApi).to.have.been.calledWith("ang", selectedList2.map(item => item.id));
                expect(autocompleteDropdown.props.items.length).to.equal(3);
                autocompleteDropdown.props.onChange({index: 0});
                expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                expect(selectedList2[0].name).to.equal("angola");
                expect(selectedList2.length).to.equal(1);
                autocompleteInput.value = "ang";
                TestUtils.Simulate.change(autocompleteInput);
                expect(autocompleteDropdown.props.opened).to.equal(true);
                expect(autocompleteDropdown.props.loading).to.equal(true);
                return timeout(function() {
                    expect(searchApi).to.have.been.calledWith("ang", selectedList2.map(item => item.id));
                    expect(autocompleteDropdown.props.items.length).to.equal(2);
                    autocompleteDropdown.props.onChange({index: 0});
                    expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                    expect(selectedList2.length).to.equal(2);
                    expect(selectedList2[1].name).to.equal("anguilla");
                    expect(autocompleteDropdown.props.items.length).to.equal(1);
                    TestUtils.Simulate.keyDown(autocompleteInput, {key: 'backspace', keyCode: 8, which: 8});
                    expect(selectedList2.length).to.equal(1);
                    expect(searchApi).to.have.been.calledWith("", selectedList2.map(item => item.id));
                    autocompleteInput.value = "ang";
                    TestUtils.Simulate.change(autocompleteInput);
                    expect(autocompleteDropdown.props.opened).to.equal(true);
                    expect(autocompleteDropdown.props.loading).to.equal(true);
                    return timeout(function() {
                        expect(searchApi).to.have.been.calledWith("ang", selectedList2.map(item => item.id));
                        expect(autocompleteDropdown.props.items.length).to.equal(2);
                        expect(autocompleteDropdown.props.items[0].name).to.equal("anguilla");
                    }, 360);
                },360);
            }, 360);
        });

    });
});
