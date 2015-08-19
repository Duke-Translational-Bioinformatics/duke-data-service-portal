import Reflux from 'reflux';
//import checkStatus from '../util/fetchUtils';

var MainActions = Reflux.createActions([
    'authenticationServiceValidate',
    'authenticationServiceValidateSuccess',
    'authenticationServiceValidateError',
    'getDdsApiToken',
    'getDdsApiTokenSuccess',
    'getDdsApiTokenError',
    'getCurrentUser'
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
            console.log(json.signed_info);
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
            MainActions.getDdsApiTokenSuccess(json.api_token)
        } else {
            throw error;
        }
    }).catch(function (ex) {
        MainActions.getDdsApiTokenError(ex)
    });
};
//
//MainActions.getCurrentUser.preEmit = (appConfig, currentUser) => {
//    fetch("https://raw.githubusercontent.com/caseychoiniere/duke-data-service-portal/develop/test-utils/mock-json/current-user.json", {
//        method: 'get',
//        headers: {
//            'Accept': 'application/json',
//            'Content-Type': 'application/json'
//        }
//    }).then(function (response) {
//        return response.json()
//    }).then(function (json) {
//        if (json && json.user) {
//            MainActions.getCurrentUserSuccess(json.user)
//        } else {
//            throw error;
//        }
//    }).catch(function (ex) {
//        MainActions.getCurrentUserError(ex)
//    });
//};


export default MainActions;