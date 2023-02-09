const _ = require("lodash");
const APIUtils = require("lib-core/APIUtils").default;
import SessionActions from "../actions/session-actions";
import store from "app/store";
import ModalContainer from "app-components/modal-container";
import SessionExpiredModal from "../app-components/session-expired-modal";

const OPEN_MODAL_OPTIONS = {
    outsideClick: true,
    closeButton: {
        showCloseButton: false,
    },
};

const LOG_OUT_DELAY = 750;
const MODAL_DISAPPEAR_DELAY = 3000;

function onSessionExpired(result) {
    if (result.status === "success" && result.data.sessionActive === false) {
        ModalContainer.openModal(<SessionExpiredModal />, OPEN_MODAL_OPTIONS);
        setTimeout(() => {
            store.dispatch(SessionActions.checkSession());
        }, LOG_OUT_DELAY);
        setTimeout(() => {
            ModalContainer.closeModal();
        }, MODAL_DISAPPEAR_DELAY);
    }
}

export default {
    checkSessionOrLogOut() {
        APIUtils.post(apiRoot + "/user/check-session", {}, {})
            .then(onSessionExpired)
            .catch((err) =>
                console.error("An error ocurred when checking session: ", err)
            );
    },
};
