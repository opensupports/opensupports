// LIBS
const _ = require('lodash');

// MOCKS
const Icon = ReactMock();

// COMPONENTS
const Menu = requireUnit('core-components/menu', {
    'core-components/icon': Icon
});

describe('Menu component', function () {
    let menu, items, icons;

    function renderMenu(props) {
        let defaultProps = {
            items: [
                {content: 'First Item', icon: 'ICON_1'},
                {content: 'Second Item', icon: 'ICON_2'},
                {content: 'Third Item', icon: 'ICON_3'},
                {content: 'Fourth Item', icon: 'ICON_4'}
            ]
        };


        menu = TestUtils.renderIntoDocument(
            <Menu {..._.extend(defaultProps, props)} />
        );
        items = TestUtils.scryRenderedDOMComponentsWithTag(menu, 'li');
        icons = TestUtils.scryRenderedComponentsWithType(menu, Icon);
    }

    it('should render items with icons', function () {
        renderMenu({
            items: [
                {content: 'First Item', icon: 'ICON_1'},
                {content: 'Second Item', icon: 'ICON_2'},
                {content: 'Third Item', icon: 'ICON_3'},
                {content: 'Fourth Item', icon: 'ICON_4'}
            ],
            itemsRole: 'some_role'
        });

        expect(items.length).to.equal(4);
        expect(items[0].textContent).to.equal('First Item');
        expect(items[1].textContent).to.equal('Second Item');
        expect(items[2].textContent).to.equal('Third Item');
        expect(items[3].textContent).to.equal('Fourth Item');

        items.forEach((item, index) => {
            expect(item.getAttribute('role')).to.equal('some_role');
            expect(item.className).to.contain('menu__list-item');
            expect(item.childNodes[0]).to.equal(ReactDOM.findDOMNode(icons[index]));
        });
    });

    it('should add custom class if passsed', function () {
        renderMenu({
            className: 'CUSTOM_CLASSNAME'
        });

        expect(ReactDOM.findDOMNode(menu).className).to.contain('CUSTOM_CLASSNAME');
    });

    it('should add selected class to selected index', function () {
        renderMenu({
            selectedIndex: 2
        });

        expect(ReactDOM.findDOMNode(items[2]).className).to.contain('menu__list-item_selected')
    });

    it('should call onItemClick if an item is clicked', function () {
        let callback = stub();

        renderMenu({
            onItemClick: callback
        });

        TestUtils.Simulate.click(ReactDOM.findDOMNode(items[2]));

        expect(callback).to.have.been.calledWith(2);
    });
});
