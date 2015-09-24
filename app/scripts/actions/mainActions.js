import Reflux from 'reflux';

var mockUrl = 'http://localhost:3000/';

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
    'showDialog',
    'setPopupCmp'
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

MainActions.getCurrentUser.preEmit = (appConfig, apiToken, currentUser) => {
    let url = mockUrl + 'db';
    fetch(url)
        .then(function (response) {
            return response.json()
        }).then(function (json) {
            MainActions.getCurrentUserSuccess(json.current_user)
        })
        .catch(function (ex) {
            MainActions.getCurrentUserError(ex)
        });
};

MainActions.showDialog.preEmit = () => {
    //this.refs.deleteProject.show();
    console.log('clicked');
};

//MainActions.setPopupCmp.preEmit = () => {
//
//};


export default MainActions;