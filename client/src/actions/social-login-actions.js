export default {
    changeShowGoogleLoginButton(showGoogleLoginButton) {
        return {
            type: 'SOCIAL_LOGIN_CHANGE_SHOW_GOOGLE_LOGIN_BUTTON',
            payload: showGoogleLoginButton
        }
    },
    changeShowFacebookLoginButton(showFacebookLoginButton) {
        return {
            type: 'SOCIAL_LOGIN_CHANGE_SHOW_FACEBOOK_LOGIN_BUTTON',
            payload: showFacebookLoginButton
        }
    },
    changeShowLinkedInLoginButton(showLinkedInLoginButton) {
        return {
            type: 'SOCIAL_LOGIN_CHANGE_SHOW_LINKEDIN_LOGIN_BUTTON',
            payload: showLinkedInLoginButton
        }
    }
}