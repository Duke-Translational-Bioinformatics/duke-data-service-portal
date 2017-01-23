import Reflux from 'reflux';
import appConfig from '../config';
import {UrlGen} from '../../util/urlEnum';

var MainActions = Reflux.createActions([
    'getApiToken',
    'getApiTokenSuccess',
    'getApiTokenError',
    'clearErrors',
    'displayErrorModals',
    'failedUpload',
    'setApiToken',
    'getCurrentUser',
    'getCurrentUserSuccess',
    'getCurrentUserError',
    'isLoggedInHandler',
    'addToast',
    'removeToast',
    'closePhiModal',
    'handleLogout',
    'removeLoginCookie',
    'removeFailedUploads',
    'removeErrorModal'
]);

MainActions.getApiToken.preEmit = (appConfig, accessToken) => {
    fetch('https://dukeds-dev.herokuapp.com/api/v1/user/api_token?access_token=' + accessToken+'&authentication_service_id=be33eb97-3bc8-4ce8-a109-c82aa1b32b23', {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        return response.json()
    }).then(function (json) {
        if (json.api_token) {
            MainActions.getApiTokenSuccess(json.api_token)
        } else {
            throw "Error has occurred";
        }
    }).catch(function (ex) {
        MainActions.getApiTokenError(ex)
    });
};

MainActions.getCurrentUser.preEmit = () => {
    fetch(UrlGen.routes.baseUrl + '/api/v1/current_user', {
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