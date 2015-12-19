import Reflux from 'reflux';
import appConfig from '../config';
import urlGen from '../../util/urlGen.js';

var MainActions = Reflux.createActions([
    'authenticationServiceValidate',
    'authenticationServiceValidateSuccess',
    'authenticationServiceValidateError',
    'getDdsApiToken',
    'getDdsApiTokenSuccess',
    'getDdsApiTokenError',
    'setApiToken',
    'getCurrentUser',
    'getCurrentUserSuccess',
    'getCurrentUserError',
    'isLoggedInHandler',
    'addToast',
    'removeToast',
    'closePhiModal',
    'handleLogout'
]);

MainActions.authenticationServiceValidate.preEmit = (appConfig, accessToken) => {

    fetch(appConfig.authServiceUri + '/api/v1/token_info?access_token=' + accessToken, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        return response.json()
    }).then(function (json) {
        if (json.signed_info) {
            MainActions.authenticationServiceValidateSuccess(json.signed_info)
        } else {
            throw "Error has occurred";
        }
    }).catch(function (ex) {
        MainActions.authenticationServiceValidateError(ex)
    });
};

MainActions.getDdsApiToken.preEmit = (appConfig, signedInfo) => {
    fetch(appConfig.baseUrl + '/api/v1/user/api_token?access_token=' + signedInfo, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        return response.json()
    }).then(function (json) {
        if (json && json.api_token) {
            MainActions.setApiToken(json.api_token);
            MainActions.getDdsApiTokenSuccess(json.api_token);
        } else {
            throw error;
        }
    }).catch(function (ex) {
        MainActions.getDdsApiTokenError(ex)
    });
};

MainActions.getCurrentUser.preEmit = () => {
    fetch(urlGen.routes.ddsUrl + 'current_user', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        }).then(function (json) {
            MainActions.getCurrentUserSuccess(json)
        })
        .catch(function (ex) {
            MainActions.getCurrentUserError(ex)
        });
};

export default MainActions;