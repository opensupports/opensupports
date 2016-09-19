// LIBS
const {Motion} = require('react-motion');
const _ = require('lodash');

// MOCKS
const Menu = ReactMock();
const Icon = ReactMock();

// COMPONENT
const DropDown = requireUnit('core-components/drop-down', {
    'core-components/menu': Menu,
    'core-components/icon': Icon
});

describe('DropDown component', function () {
    let dropdown, menu, currentItem, menuMotion;

    function renderDropDown(props) {
        let defaultProps = {
            items: [
                {content: 'First Item', icon: 'ICON_1'},
                {content: 'Second Item', icon: 'ICON_2'},
                {content: 'Third Item', icon: 'ICON_3'},
                {content: 'Fourth Item', icon: 'ICON_4'}
            ],
            onChange: stub()
        };


        dropdown = TestUtils.renderIntoDocument(
            <DropDown {..._.extend(defaultProps, props)} />
        );
        menu = TestUtils.scryRenderedComponentsWithType(dropdown, Menu)[0];
        menuMotion = TestUtils.scryRenderedComponentsWithType(dropdown, Motion)[0];
        currentItem = TestUtils.scryRenderedDOMComponentsWithClass(dropdown, 'drop-down__current-item')[0];
    }

    beforeEach(function() {
        renderDropDown();
    });

    it('should render a current item and a Menu of items', function () {
        expect(ReactDOM.findDOMNode(dropdown).className).to.contain('drop-down');
        expect(ReactDOM.findDOMNode(dropdown).className).to.contain('drop-down_closed');

        expect(currentItem.textContent).to.equal('First Item');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('false');
        expect(currentItem.getAttribute('aria-autocomplete')).to.equal('list');
        expect(currentItem.getAttribute('role')).to.equal('combobox');
        expect(currentItem.getAttribute('tabindex')).to.equal('0');

        expect(menuMotion.props.style.opacity.val).to.equal(0);
        expect(menu.props.role).to.equal('listbox');
        expect(menu.props.itemsRole).to.equal('option');
        expect(menu.props.items).to.equal(dropdown.props.items);
        expect(menu.props.selectedIndex).to.equal(0);
    });

    it('should open/close list when click on current item', function () {
        TestUtils.Simulate.click(currentItem);

        expect(menuMotion.props.style.opacity.val).to.equal(1);
        expect(ReactDOM.findDOMNode(dropdown).className).to.not.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('true');

        TestUtils.Simulate.click(currentItem);

        expect(menuMotion.props.style.opacity.val).to.equal(0);
        expect(ReactDOM.findDOMNode(dropdown).className).to.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('false');
    });
    
    it('should open/close list when pressing Enter on current item', function () {
        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});

        expect(menuMotion.props.style.opacity.val).to.equal(1);
        expect(ReactDOM.findDOMNode(dropdown).className).to.not.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('true');

        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});

        expect(menuMotion.props.style.opacity.val).to.equal(0);
        expect(ReactDOM.findDOMNode(dropdown).className).to.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should open list but no close when pressing Space on current item', function () {
        TestUtils.Simulate.keyDown(currentItem, {key: 'Space', keyCode: 32, which: 32});

        expect(menuMotion.props.style.opacity.val).to.equal(1);
        expect(ReactDOM.findDOMNode(dropdown).className).to.not.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('true');

        TestUtils.Simulate.keyDown(currentItem, {key: 'Space', keyCode: 32, which: 32});

        expect(menuMotion.props.style.opacity.val).to.equal(1);
        expect(ReactDOM.findDOMNode(dropdown).className).to.not.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should close the list with escape on current item', function () {
        TestUtils.Simulate.keyDown(currentItem, {key: 'Space', keyCode: 32, which: 32});

        expect(menuMotion.props.style.opacity.val).to.equal(1);
        expect(ReactDOM.findDOMNode(dropdown).className).to.not.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('true');

        TestUtils.Simulate.keyDown(currentItem, {key: 'Esc', keyCode: 27, which: 27});

        expect(menuMotion.props.style.opacity.val).to.equal(0);
        expect(ReactDOM.findDOMNode(dropdown).className).to.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should close the list when current item loses focus', function () {
        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});

        expect(menuMotion.props.style.opacity.val).to.equal(1);
        expect(ReactDOM.findDOMNode(dropdown).className).to.not.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('true');

        TestUtils.Simulate.blur(currentItem);

        expect(menuMotion.props.style.opacity.val).to.equal(0);
        expect(ReactDOM.findDOMNode(dropdown).className).to.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should change selection, close and call onChange when a menu item is clicked', function () {
        dropdown.props.onChange.reset();
        TestUtils.Simulate.keyDown(currentItem, {key: 'Space', keyCode: 32, which: 32});
        menu.props.onItemClick(2);

        // Should be closed
        expect(menuMotion.props.style.opacity.val).to.equal(0);
        expect(ReactDOM.findDOMNode(dropdown).className).to.contain('drop-down_closed');
        expect(currentItem.getAttribute('aria-expanded')).to.equal('false');

        expect(currentItem.textContent).to.equal('Third Item');
        expect(menu.props.selectedIndex).to.equal(2);
        expect(dropdown.props.onChange).to.have.been.calledWith({index: 2});
    });

    it('should only change menu section when using arrow keys', function () {
        dropdown.props.onChange.reset();

        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});
        expect(menu.props.selectedIndex).to.equal(0);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        expect(menu.props.selectedIndex).to.equal(1);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        expect(menu.props.selectedIndex).to.equal(2);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        expect(menu.props.selectedIndex).to.equal(3);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        expect(menu.props.selectedIndex).to.equal(0);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        expect(menu.props.selectedIndex).to.equal(1);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Up', keyCode: 38, which: 38});
        expect(menu.props.selectedIndex).to.equal(0);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Up', keyCode: 38, which: 38});
        expect(menu.props.selectedIndex).to.equal(3);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Up', keyCode: 38, which: 38});
        expect(menu.props.selectedIndex).to.equal(2);

        expect(dropdown.props.onChange).to.have.not.been.called;
        expect(currentItem.textContent).to.equal('First Item');
    });

    it('should not change menu selection if it is closed', function () {
        dropdown.props.onChange.reset();

        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        expect(menu.props.selectedIndex).to.equal(0);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        expect(menu.props.selectedIndex).to.equal(0);
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        expect(menu.props.selectedIndex).to.equal(0);

        expect(dropdown.props.onChange).to.have.not.been.called;
        expect(currentItem.textContent).to.equal('First Item');
    });

    it('should change selection to the menu\'s one, if Enter key is pressed', function () {
        dropdown.props.onChange.reset();

        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        expect(menu.props.selectedIndex).to.equal(2);

        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});

        expect(currentItem.textContent).to.equal('Third Item');
        expect(menu.props.selectedIndex).to.equal(2);
        expect(dropdown.props.onChange).to.have.been.calledWith({index: 2});
    });

    it('should not change selection with esc, blur or space', function () {
        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});
        expect(menu.props.selectedIndex).to.equal(2);

        dropdown.props.onChange.reset();
        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Esc', keyCode: 27, which: 27});
        expect(currentItem.textContent).to.equal('Third Item');
        expect(dropdown.props.onChange).to.have.not.been.called;

        dropdown.props.onChange.reset();
        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Space', keyCode: 32, which: 32});
        expect(currentItem.textContent).to.equal('Third Item');
        expect(dropdown.props.onChange).to.have.not.been.called;

        dropdown.props.onChange.reset();
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        TestUtils.Simulate.blur(currentItem);
        expect(currentItem.textContent).to.equal('Third Item');
        expect(dropdown.props.onChange).to.have.not.been.called;
    });

    it('should start selecting defaultSelectedIndex', function () {
        dropdown.props.onChange.reset();
        renderDropDown({defaultSelectedIndex: 2});

        expect(currentItem.textContent).to.equal('Third Item');
        expect(menu.props.selectedIndex).to.equal(2);
        expect(dropdown.props.onChange).to.have.not.been.called;

        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});

        expect(currentItem.textContent).to.equal('Fourth Item');
        expect(menu.props.selectedIndex).to.equal(3);
        expect(dropdown.props.onChange).to.have.been.calledWith({index: 3});
    });

    it('should only show selectedIndex prop on the current selection', function () {
        dropdown.props.onChange.reset();
        renderDropDown({selectedIndex: 2});

        expect(currentItem.textContent).to.equal('Third Item');
        expect(menu.props.selectedIndex).to.equal(2);
        expect(dropdown.props.onChange).to.have.not.been.called;

        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Down', keyCode: 40, which: 40});
        TestUtils.Simulate.keyDown(currentItem, {key: 'Enter', keyCode: 13, which: 13});

        expect(currentItem.textContent).to.equal('Third Item');
        expect(menu.props.selectedIndex).to.equal(3);
        expect(dropdown.props.onChange).to.have.been.calledWith({index: 3});
    });
});