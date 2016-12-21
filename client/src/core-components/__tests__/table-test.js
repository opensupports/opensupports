const Pagination = ReactMock();
const Table = requireUnit('core-components/table', {
    'core-components/pagination': Pagination
});

describe('Table component', function () {
    let table, menu, tr, th;

    function renderTable(props = {}) {
        let headers = [
            {value: 'Header 1', key: 'header1'},
            {value: 'Header 2', key: 'header2'}
        ];
        let rows = [
            {header1: 'Row1 header1', header2: 'Row1 header2'},
            {header1: 'Row2 header1', header2: 'Row2 header2'},
            {header1: 'Row3 header1', header2: 'Row3 header2'},
            {header1: 'Row4 header1', header2: 'Row4 header2'},
            {header1: 'Row5 header1', header2: 'Row5 header2'},
            {header1: 'Row6 header1', header2: 'Row6 header2'},
            {header1: 'Row7 header1', header2: 'Row7 header2'},
            {header1: 'Row8 header1', header2: 'Row8 header2'}
        ];

        table = TestUtils.renderIntoDocument(
            <Table headers={headers} rows={rows} {...props} />
        );

        menu = TestUtils.scryRenderedComponentsWithType(table, Pagination)[0];
        tr = TestUtils.scryRenderedDOMComponentsWithTag(table, 'tr');
        th = TestUtils.scryRenderedDOMComponentsWithTag(table, 'th');
    }


    it('should render a table of elements', function () {
        renderTable();
        expect(tr.length).to.equal(9);

        expect(tr[0].children[0]).to.equal(th[0]);
        expect(tr[0].children[1]).to.equal(th[1]);

        expect(tr[1].children[0].textContent).to.equal('Row1 header1');
        expect(tr[1].children[1].textContent).to.equal('Row1 header2');

        expect(tr[2].children[0].textContent).to.equal('Row2 header1');
        expect(tr[2].children[1].textContent).to.equal('Row2 header2');

        expect(tr[3].children[0].textContent).to.equal('Row3 header1');
        expect(tr[3].children[1].textContent).to.equal('Row3 header2');

        expect(tr[4].children[0].textContent).to.equal('Row4 header1');
        expect(tr[4].children[1].textContent).to.equal('Row4 header2');

        expect(tr[5].children[0].textContent).to.equal('Row5 header1');
        expect(tr[5].children[1].textContent).to.equal('Row5 header2');

        expect(tr[6].children[0].textContent).to.equal('Row6 header1');
        expect(tr[6].children[1].textContent).to.equal('Row6 header2');

        expect(tr[7].children[0].textContent).to.equal('Row7 header1');
        expect(tr[7].children[1].textContent).to.equal('Row7 header2');

        expect(tr[8].children[0].textContent).to.equal('Row8 header1');
        expect(tr[8].children[1].textContent).to.equal('Row8 header2');

        expect(menu).to.equal(undefined);
    });

    it('should render a table limited by page size with menu', function () {
        renderTable({pageSize: 3});
        expect(tr.length).to.equal(4);

        expect(tr[0].children[0]).to.equal(th[0]);
        expect(tr[0].children[1]).to.equal(th[1]);

        expect(tr[1].children[0].textContent).to.equal('Row1 header1');
        expect(tr[1].children[1].textContent).to.equal('Row1 header2');

        expect(tr[2].children[0].textContent).to.equal('Row2 header1');
        expect(tr[2].children[1].textContent).to.equal('Row2 header2');

        expect(tr[3].children[0].textContent).to.equal('Row3 header1');
        expect(tr[3].children[1].textContent).to.equal('Row3 header2');

        expect(menu.props.pages).to.equal(3);

        menu.props.onChange(2);
        tr = TestUtils.scryRenderedDOMComponentsWithTag(table, 'tr');

        expect(tr.length).to.equal(4);
        expect(tr[1].children[0].textContent).to.equal('Row4 header1');
        expect(tr[1].children[1].textContent).to.equal('Row4 header2');
        expect(tr[2].children[0].textContent).to.equal('Row5 header1');
        expect(tr[2].children[1].textContent).to.equal('Row5 header2');
        expect(tr[3].children[0].textContent).to.equal('Row6 header1');
        expect(tr[3].children[1].textContent).to.equal('Row6 header2');

        menu.props.onChange(3);
        tr = TestUtils.scryRenderedDOMComponentsWithTag(table, 'tr');

        expect(tr.length).to.equal(3);
        expect(tr[1].children[0].textContent).to.equal('Row7 header1');
        expect(tr[1].children[1].textContent).to.equal('Row7 header2');
        expect(tr[2].children[0].textContent).to.equal('Row8 header1');
        expect(tr[2].children[1].textContent).to.equal('Row8 header2');
    });
});