import React from 'react';
import { observable, computed, action, map } from 'mobx';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import { UrlGen, Kind, Path } from '../../util/urlEnum';
import { checkStatus, getFetchParams } from '../../util/fetchUtil';

export class AgentStore {

    @observable agentApiToken
    @observable agentKey
    @observable agents

    constructor() {
        this.agentApiToken = {};
        this.agentKey = {};
        this.agents = [];
    }

    checkResponse(response) {
        return checkStatus(response, authStore);
    }

    @action createAgentKey(id) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id + '/api_key',
            getFetchParams('put', authStore.appConfig.apiToken)
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                mainStore.addToast('API Key created successfully');
                this.agentKey = json
            }).catch((ex) => {
                mainStore.addToast('Failed to create new API key');
                mainStore.handleErrors(ex)
            })
    }

    @action getAgentKey(id) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id + '/api_key',
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.agentKey = json;
                let formData = new FormData();
                formData.append('agent_key', this.agentKey.key);
                formData.append('user_key', authStore.userKey.key);
                if(this.agentKey.key && authStore.userKey.key) this.getAgentApiToken(this.agentKey.key, authStore.userKey.key, formData);
            }).catch((ex) => {
                mainStore.handleErrors(ex)
            });
    }

    @action getAgentApiToken(agentKey, userKey) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + 'api_token',
            getFetchParams('post', authStore.appConfig.apiToken, {
                'agent_key': agentKey,
                'user_key': userKey
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.agentApiToken = json;
            }).catch((ex) => {
                mainStore.addToast('Failed to generate an API token');
                mainStore.handleErrors(ex)
            })
    }

    @action loadAgents() {
        mainStore.toggleLoading();
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.agents = json.results;
                mainStore.toggleLoading();
            }).catch((ex) => {
                mainStore.handleErrors(ex)
            })
    }

    @action addAgent(name, desc, repo) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT,
            getFetchParams('post', authStore.appConfig.apiToken, {
                "name": name,
                "description": desc,
                "repo_url": repo
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                mainStore.addToast('New software agent added');
                this.agents = [json, ...this.agents];
            }).catch((ex) => {
                mainStore.addToast('Failed to add new software agent');
                mainStore.handleErrors(ex)
            })
    }

    @action editAgent(id, name, desc, repo) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id,
            getFetchParams('put', authStore.appConfig.apiToken, {
                "name": name,
                "description": desc,
                "repo_url": repo
            })
        ).then(checkStatus).then((response) => {
                return response.json()
            }).then((json) => {
                mainStore.addToast('Software Agent Updated');
                mainStore.getEntity(id, Path.AGENT);
            }).catch((ex) => {
                mainStore.addToast('Software Agent Update Failed');
                mainStore.handleErrors(ex)
            });
    }

    @action deleteAgent(id) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id,
            getFetchParams('delete', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
            }).then((json) => {
                mainStore.addToast('Software Agent Deleted');
            }).catch((ex) => {
                mainStore.addToast('Failed to delete software agent');
                mainStore.handleErrors(ex)
            });
    }

    clearApiToken() {
        this.agentApiToken = {};
    }

}

const agentStore = new AgentStore();

export default agentStore;