import _ from 'lodash';

export default function (defaultFunction, callback, options = {}, extraPreventions = []) {
    return function (nativeEvent) {
        let preventions = {'default': false};
        let event = _.extend({}, nativeEvent, options, {
            preventDefault() {
                nativeEvent.preventDefault();
                preventions['default'] = true;
            }
        });

        extraPreventions.forEach((prevention) => {
            preventions[prevention] = false;

            event['is' + prevention.capitalize() + 'Prevented'] = () => preventions[prevention];
            event['prevent' + prevention.capitalize()] = () => (preventions[prevention] = true);
        });

        if (typeof callback === 'function') callback(event);

        if (!preventions['default']) defaultFunction(event);
    };
};