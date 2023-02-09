import _ from 'lodash';

let Mock = ReactMock();

_.extend(Mock, {
    createEmpty: stub().returns({editorState: true}),

    getEditorStateFromHTML: stub().returns({editorState: true}),

    getHTMLFromEditorState: stub().returns('HTML_CODE'),

    isEditorState: (item) => {
        return item.editorState;
    }
});

export default Mock;