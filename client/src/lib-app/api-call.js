const _ = require("lodash");
const APIUtils = require("lib-core/APIUtils").default;
const SessionStore = require("lib-app/session-store").default;
import expiredSessionUtils from "./expired-session-utils";

function processData(data, dataAsForm = false) {
    let newData;

    if (dataAsForm) {
        newData = new FormData();

        _.each(data, (value, key) => {
            newData.append(key, value);
        });

        newData.append("csrf_token", SessionStore.getSessionData().token);
        newData.append("csrf_userid", SessionStore.getSessionData().userId);
    } else {
        newData = _.extend(
            {
                csrf_token: SessionStore.getSessionData().token,
                csrf_userid: SessionStore.getSessionData().userId,
            },
            data
        );
    }

    return newData;
}


const randomString = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
export default {
    call: function ({ path, data, plain, dataAsForm }) {
        const callId = randomString(3);
        const boldStyle = 'font-weight: bold;';
        const normalStyle = 'font-weight: normal;';
        if (showLogs) {
            console.log(`▶ Request %c${path}%c [${callId}]: `, boldStyle, normalStyle, data);
        }
        return new Promise(function (resolve, reject) {
            APIUtils.post(apiRoot + path, processData(data, dataAsForm), dataAsForm)
                .then(function (result) {
                    if (showLogs) {
                        console.log(`▶ Result %c${path}%c [${callId}]: `, boldStyle, normalStyle, result);
                    }
                    const { status, message } = result;
                    if (plain || status === "success") {
                        resolve(result);
                    } else if (reject) {
                        if (status === "fail" && message === "NO_PERMISSION") {
                            expiredSessionUtils.checkSessionOrLogOut();
                        }
                        reject(result);
                    }
                })
                .catch(function (result) {
                    console.log("INVALID REQUEST to: " + path);
                    console.log(result);
                    reject({
                        status: "fail",
                        message: "Internal server error",
                    });
                });
        });
    },

    getFileLink(filePath) {
        return apiRoot + "/system/download?file=" + filePath;
    },

    getAPIUrl() {
        return apiRoot;
    },

    getURL() {
        return root;
    },
};
