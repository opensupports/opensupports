import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {useBasename} from 'history';
import store from 'app/store';

const history = syncHistoryWithStore(browserHistory, store);

export default useBasename(() => history)({basename: globalIndexPath});
