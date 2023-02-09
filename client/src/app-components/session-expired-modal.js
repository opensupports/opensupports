import React from "react";
import _ from "lodash";

import i18n from "lib-app/i18n";

import Header from "core-components/header";

class SessionExpiredModal extends React.Component {
    render() {
        return (
            <Header
                title={i18n("SESSION_EXPIRED")}
                description={i18n("SESSION_EXPIRED_DESCRIPTION")}
            />
        );
    }
}

export default SessionExpiredModal;
