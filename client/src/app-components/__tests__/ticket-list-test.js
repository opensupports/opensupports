const _ = require('lodash');
const TicketInfo = ReactMock();
const Table = ReactMock();
const Button = ReactMock();
const Tooltip = ReactMock();
const DepartmentDropdown = ReactMock();
const i18n = stub().returnsArg(0);

const TicketList = requireUnit('app-components/ticket-list', {
    'app-components/ticket-info': TicketInfo,
    'core-components/table': Table,
    'core-components/button': Button,
    'core-components/tooltip': Tooltip,
    'app-components/department-dropdown': DepartmentDropdown,
    'lib-app/i18n': i18n,
    'react-redux': {
        connect: function() {
            return function(param) {
                return param;
            }
        }
    },
});

describe('TicketList component', function () {
    let ticketList, table, dropdown;
    let tickets = (function() {
        let ticket = {
            unread: false,
            closed: false,
            title: 'This is not working',
            ticketNumber: 123124,
            date: '20160215',
            department: {
                id: 1,
                name: 'Sales Support'
            },
            author: {
                id: 3,
                name: 'Francisco Villegas'
            },
            tags: []
        };
        let list = _.range(5).map(() => ticket);

        list = list.concat(_.range(5).map(() => {
            return _.extend({}, ticket, {
                department: {
                    id: 2,
                    name: 'Tech Help'
                }
            })
        }));

        return list;
    })();

    function renderTicketList(props = {}) {
        ticketList = TestUtils.renderIntoDocument(
            <TicketList tickets={tickets} {...props}></TicketList>
        );

        table = TestUtils.scryRenderedComponentsWithType(ticketList, Table);
        dropdown = TestUtils.scryRenderedComponentsWithType(ticketList, DepartmentDropdown);
    }

    it('should pass correct props to Table', function () {
        renderTicketList();
        expect(table[0].props.loading).to.equal(false);
        expect(table[0].props.pageSize).to.equal(10);
        expect(table[0].props.headers[0]).to.deep.equal(
            {
                key: 'number',
                value: i18n('NUMBER'),
                className: 'ticket-list__number col-md-1'
            });
        expect(table[0].props.headers[1]).to.deep.equal(
            {
                key: 'title',
                value: i18n('TITLE'),
                className: 'ticket-list__title col-md-6'
            });
        expect(table[0].props.headers[2]).to.deep.equal(
            {
                key: 'department',
                value: i18n('DEPARTMENT'),
                className: 'ticket-list__department col-md-3'
            });
        expect(table[0].props.headers[3].key).to.equal('date');
        expect(table[0].props.headers[3].value.props.children[0]).to.equal(i18n('DATE'));
        expect(table[0].props.headers[3].value.props.children[1]).to.equal(null);
        expect(table[0].props.headers[3].className).to.equal('ticket-list__date col-md-2');
    });

    it('should pass loading to Table', function () {
        renderTicketList({loading: true});
        expect(table[0].props.loading).to.equal(true);
    });

    describe('when using secondary type', function () {
        beforeEach(function () {
            renderTicketList({
                type: 'secondary',
                departments: [
                    {id: 1, name: 'Sales Support'},
                    {id: 2, name: 'Tech Help'}
                ]
            });
        });

        it('should pass correct props to Table', function () {
            expect(table[0].props.headers[0]).to.deep.equal(
                {
                    key: 'number',
                    value: i18n('NUMBER'),
                    className: 'ticket-list__number col-md-1'
                });
            expect(table[0].props.headers[1]).to.deep.equal(
                {
                    key: 'title',
                    value: i18n('TITLE'),
                    className: 'ticket-list__title col-md-4'
                });
            expect(table[0].props.headers[2]).to.deep.equal(
                {
                    key: 'department',
                    value: i18n('DEPARTMENT'),
                    className: 'ticket-list__department col-md-2'
                });
            expect(table[0].props.headers[3]).to.deep.equal(
                {
                    key: 'author',
                    value: i18n('AUTHOR'),
                    className: 'ticket-list__author col-md-2'
                });
            expect(table[0].props.headers[4].key).to.equal('date');
            expect(table[0].props.headers[4].value.props.children[0]).to.equal(i18n('DATE'));
            expect(table[0].props.headers[4].value.props.children[1]).to.equal(null);
            expect(table[0].props.headers[4].className).to.equal('ticket-list__date col-md-2');
        });

        it('should pass correct props to dropdown', function () {
            expect(dropdown[0].props.departments).to.deep.equal([
                {name: i18n('ALL_DEPARTMENTS')},
                {name: 'Sales Support', id: 1},
                {name: 'Tech Help', id: 2}
            ]);
            expect(dropdown[0].props.size).to.equal('medium');
        });

        it('should filter tickets by department when DropDown changes', function () {
            dropdown[0].props.onChange({index: 1});
            _.forEach(table[0].props.rows, function (row) {
                expect(row.department).to.equal('Sales Support');
            });

            dropdown[0].props.onChange({index: 2});
            _.forEach(table[0].props.rows, function (row) {
                expect(row.department).to.equal('Tech Help');
            });

            dropdown[0].props.onChange({index: 0});
            expect(table[0].props.rows.length).to.equal(10);
        });
    });
});
