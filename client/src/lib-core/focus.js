const _ = require('lodash');

export default {
    isActiveElementInsideDOMTree(domTree = document) {
        let activeElement = document.activeElement;
        let elements = domTree.querySelectorAll('*');

        return (_.findIndex(elements, activeElement) !== -1);
    },

    focusFirstInput(domTree) {
        let firstFocusableElement = domTree.querySelector('input');

        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }
};