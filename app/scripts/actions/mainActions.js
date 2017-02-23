import appConfig from '../config';
import ProjectActions from '../actions/projectActions';
import projectStore from '../stores/projectStore';
import mainStore from '../stores/mainStore';
import {UrlGen, Path} from '../../util/urlEnum';
import { checkStatus, getFetchParams } from '../../util/fetchUtil';

const mainActions = {

    getAuthProviders(appConfig) {
        fetch(DDS_PORTAL_CONFIG.baseUrl + UrlGen.routes.apiPrefix + 'auth_providers', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(checkStatus).then((response) => {
            return response.json()
        }).then((json) => {
            if (json.results) {
                mainStore.getAuthProvidersSuccess(json.results);
            } else {
                throw "An error has occurred while trying to authenticate";
            }
        }).catch((ex) => {
            projectStore.handleErrors(ex);
        });
    },

    getApiToken(appConfig, accessToken) {
        fetch(appConfig.baseUrl + UrlGen.routes.apiPrefix + Path.ACCESS_TOKEN + accessToken + '&authentication_service_id=' + appConfig.serviceId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(checkStatus).then((response) => {
            return response.json()
        }).then((json) => {
            if (json.api_token) {
                mainStore.getApiTokenSuccess(json.api_token);
            } else {
                throw "An error has occurred while trying to authenticate";
            }
        }).catch((ex) => {
            mainStore.getError(ex);
            projectStore.handleErrors(ex);
        });
    },

    getCurrentUser() {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER,
            getFetchParams('get', mainStore.appConfig.apiToken))
            .then(checkStatus).then((response) => {
                return response.json()
            }).then((json) => {
                mainStore.getCurrentUserSuccess(json);
            })
            .catch((ex) => {
                mainStore.getError(ex);
                projectStore.handleErrors(ex);
            });
    }
};

export default mainActions;