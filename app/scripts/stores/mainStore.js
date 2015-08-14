import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import appConfig from '../config';

var MainStore = Reflux.createStore({

    listenables: MainActions,

    init() {
        this.appConfig = appConfig;
        this.asValidateLoading = false;
        this.ddsApiTokenLoading = false;
        this.signedInfo = null;
    },

    authenticationServiceValidate(appConfig, accessToken) {
        console.log(accessToken);
        this.asValidateLoading = true;
        this.trigger({
            asValidateLoading: this.asValidateLoading
        });
    },
    authenticationServiceValidateSuccess (signedInfo) {
        this.signedInfo = signedInfo;
        this.asValidateLoading = false;
        this.trigger({
            asValidateLoading: this.asValidateLoading,
            signedInfo: this.signedInfo
        });

    },
    authenticationServiceValidateError (error) {
        let msg = error && error.message ? error.message : 'An error occurred.';
        this.trigger({
            error: msg,
            asValidateLoading: false
        });
    },

    getDdsApiToken(appConfig, signedInfo) {
        this.ddsApiTokenLoading = true;
        this.trigger({
            ddsApiTokenLoading: this.ddsApiTokenLoading
        });
    },

    getDdsApiTokenSuccess (apiToken) {
        this.appConfig.apiToken = apiToken;
        this.ddsApiTokenLoading = false;
        this.trigger({
            ddsApiTokenLoading: false,
            appConfig: this.appConfig
        });
    },
    getDdsApiTokenError (error) {
        let msg = error && error.message ? error.message : 'An error occurred.';
        this.trigger({
            error: msg,
            asValidateLoading: false
        });
    },
    setApiToken (apiToken) {
        this.appConfig.apiToken = apiToken;
        this.trigger({
            appConfig: this.appConfig
        });
    }
});

export default MainStore;