import Reducer from 'reducers/reducer';

class socialLoginReducer extends Reducer {

    getInitialState() {
        return {
            showGoogleLoginButton: false,
            showFacebookLoginButton: false,
            showLinkedInLoginButton: false,
        };
    }

    getTypeHandlers() {
        return {
            'SOCIAL_LOGIN_CHANGE_SHOW_GOOGLE_LOGIN_BUTTON': this.changeShowGoogleLoginButton,
            'SOCIAL_LOGIN_CHANGE_SHOW_FACEBOOK_LOGIN_BUTTON': this.changeShowFacebookLoginButton,
            'SOCIAL_LOGIN_CHANGE_SHOW_LINKEDIN_LOGIN_BUTTON': this.changeShowLinkedInLoginButton,
        };
    }

    changeShowGoogleLoginButton(state, payload) {
        return {
            ...state,
            showGoogleLoginButton: payload
        }
    }

    changeShowFacebookLoginButton(state, payload) {
        return {
            ...state,
            showFacebookLoginButton: payload
        }
    }

    changeShowLinkedInLoginButton(state, payload) {
        return {
            ...state,
            showLinkedInLoginButton: payload
        }
    }
}

export default socialLoginReducer.getInstance();
