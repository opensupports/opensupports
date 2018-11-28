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
    'lib-app/i18n': i18n
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
            priority: 'low',
            author: {
                id: 3,
                name: 'Francisco Villegas'
            }
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
            <TicketList tickets={tickets} {...props}/>
        );

        table = TestUtils.scryRenderedComponentsWithType(ticketList, Table);
        dropdown = TestUtils.scryRenderedComponentsWithType(ticketList, DepartmentDropdown);
    }

    it('should pass correct props to Table', function () {
        renderTicketList();
        expect(table[0].props.loading).to.equal(false);
        expect(table[0].props.pageSize).to.equal(10);
        expect(table[0].props.headers).to.deep.equal([
            {
                key: 'number',
                value: i18n('NUMBER'),
                className: 'ticket-list__number col-md-1'
            },
            {
                key: 'title',
                value: i18n('TITLE'),
                className: 'ticket-list__title col-md-6'
            },
            {
                key: 'department',
                value: i18n('DEPARTMENT'),
                className: 'ticket-list__department col-md-3'
            },
            {
                key: 'date',
                value: i18n('DATE'),
                className: 'ticket-list__date col-md-2'
            }
        ]);
    });

    it('should pass loading to Table', function () {
        renderTicketList({loading: true});
        expect(table[0].props.loading).to.equal(true);
    });

    it('should pass correct compare function to Table', function () {
        let minCompare = table[0].props.comp;

        let row1 = {
            closed: false,
            unread: false,
            date: '20160405'
        };
        let row2 = {
            closed: false,
            unread: false,
            date: '20160406'
        };
        expect(minCompare(row1, row2)).to.equal(1);

        row1.unread = true;
        expect(minCompare(row1, row2)).to.equal(-1);

        row2.unread = true;
        expect(minCompare(row1, row2)).to.equal(1);

        row2.date = '20160401';
        expect(minCompare(row1, row2)).to.equal(-1);
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
            expect(table[0].props.headers).to.deep.equal([
                {
                    key: 'number',
                    value: i18n('NUMBER'),
                    className: 'ticket-list__number col-md-1'
                },
                {
                    key: 'title',
                    value: i18n('TITLE'),
                    className: 'ticket-list__title col-md-4'
                },
                {
                    key: 'priority',
                    value: i18n('PRIORITY'),
                    className: 'ticket-list__priority col-md-1'
                },
                {
                    key: 'department',
                    value: i18n('DEPARTMENT'),
                    className: 'ticket-list__department col-md-2'
                },
                {
                    key: 'author',
                    value: i18n('AUTHOR'),
                    className: 'ticket-list__author col-md-2'
                },
                {
                    key: 'date',
                    value: i18n('DATE'),
                    className: 'ticket-list__date col-md-2'
                }
            ]);
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
