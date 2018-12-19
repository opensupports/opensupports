root = 'ROOT_PATH';
const mentionsParser = requireUnit('lib-app/mentions-parser', {});

describe('MentionsParser library', function () {

    it('should not parse text without mentions', function () {
        expect(mentionsParser.parse(
            'This is an example without mentions'
        )).to.equal(
            'This is an example without mentions'
        );

        expect(mentionsParser.parse(
            'This is an example without mentions <img src=\'/image.png\' /> abc <br/>',
        )).to.equal(
            'This is an example without mentions <img src=\'/image.png\' /> abc <br/>',
        );
    });

    it('should parse ticket number mention', function () {
        expect(mentionsParser.parse(
            'This is an example with #123456'
        )).to.equal(
            'This is an example with <a href="ROOT_PATH/admin/panel/tickets/view-ticket/123456">#123456</a>'
        );

        expect(mentionsParser.parse(
            'This is an example with #487213 text'
        )).to.equal(
            'This is an example with <a href="ROOT_PATH/admin/panel/tickets/view-ticket/487213">#487213</a> text'
        );

        expect(mentionsParser.parse(
            'This is an example with #487213text'
        )).to.equal(
            'This is an example with <a href="ROOT_PATH/admin/panel/tickets/view-ticket/487213">#487213</a>text'
        );

        expect(mentionsParser.parse(
            'This is an example with 4848#777777text'
        )).to.equal(
            'This is an example with 4848<a href="ROOT_PATH/admin/panel/tickets/view-ticket/777777">#777777</a>text'
        );
    });

    it('should not parse invalid ticket number mention', function () {
        expect(mentionsParser.parse(
            'This is an example with #12345'
        )).to.equal(
            'This is an example with #12345'
        );

        expect(mentionsParser.parse(
            'This is an example with #12345abv hello'
        )).to.equal(
            'This is an example with #12345abv hello'
        );

        expect(mentionsParser.parse(
            'This is an example with #a12345 hello'
        )).to.equal(
            'This is an example with #a12345 hello'
        );

        expect(mentionsParser.parse(
            'This is an example with # hello'
        )).to.equal(
            'This is an example with # hello'
        );
    });
});
