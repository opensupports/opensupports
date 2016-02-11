import React   from 'react';
import _       from 'lodash';

export default function () {
    let className = 'fa';

    _.each(arguments, (arg) => {
        className += ' fa-' + arg;
    });

    return (
        <i className={className} />
    );
};