import Reflux from 'reflux';
import appConfig from '../config';
import ProjectActions from '../actions/projectActions';
import {UrlGen, Path} from '../../util/urlEnum';
import { checkStatus, getFetchParams } from '../../util/fetchUtil';

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
    fetch(appConfig.baseUrl+UrlGen.routes.apiPrefix+Path.ACCESS_TOKEN+accessToken+'&authentication_service_id='+appConfig.serviceId, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkResponse).then((response) => {
        return response.json()
    }).then((json) => {
        if (json.api_token) {
            MainActions.getApiTokenSuccess(json.api_token);
        } else {
            throw "An error has occurred while trying to authenticate";
        }
    }).catch((ex) => {
        MainActions.getApiTokenError(ex);
        ProjectActions.handleErrors(ex);
    });
};

MainActions.getCurrentUser.preEmit = () => {
    fetch(UrlGen.routes.baseUrl+UrlGen.routes.apiPrefix+Path.CURRENT_USER,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.getCurrentUserSuccess(json);
        })
        .catch((ex) => {
            MainActions.getCurrentUserError(ex);
            ProjectActions.handleErrors(ex);
        });
};

function checkResponse(response) {
    return checkStatus(response, MainActions);
}

export default MainActions;