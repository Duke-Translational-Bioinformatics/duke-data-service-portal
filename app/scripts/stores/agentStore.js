import React from 'react';
import { observable, computed, action, map } from 'mobx';
import transportLayer from '../transportLayer';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import BaseUtils from '../util/baseUtils.js';
import { UrlGen, Kind, Path } from '../util/urlEnum';
import { checkStatus, getFetchParams } from '../util/fetchUtil';

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
        transportLayer.createAgentKey(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                mainStore.addToast('API Key created successfully');
                this.agentKey = json
            }).catch((ex) => {
                mainStore.addToast('Failed to create new API key');
                mainStore.handleErrors(ex)
            })
    }

    @action getAgentKey(id) {
        transportLayer.getAgentKey(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.agentKey = json;
                let formData = new FormData();
                formData.append('agent_key', this.agentKey.key);
                formData.append('user_key', authStore.userKey.key);
                if(this.agentKey.key && authStore.userKey.key) this.getAgentApiToken(this.agentKey.key, authStore.userKey.key, formData);
            }).catch(ex =>mainStore.handleErrors(ex))
    }

    @action getAgentApiToken(agentKey, userKey) {
        transportLayer.getAgentApiToken(agentKey, userKey)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => this.agentApiToken = json)
            .catch((ex) => {
                mainStore.addToast('Failed to generate an API token');
                mainStore.handleErrors(ex)
            })
    }

    @action loadAgents() {
        mainStore.toggleLoading();
        transportLayer.loadAgents()
            .then(this.checkResponse)
            .then(response => response.json())
                .then((json) => {
                this.agents = json.results;
                if(mainStore.loading) mainStore.toggleLoading();
            }).catch(ex =>mainStore.handleErrors(ex))
    }

    @action addAgent(name, desc, repo) {
        transportLayer.addAgent(name, desc, repo)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                mainStore.addToast('New software agent added');
                this.agents = [json, ...this.agents];
            }).catch((ex) => {
                mainStore.addToast('Failed to add new software agent');
                mainStore.handleErrors(ex)
            })
    }

    @action editAgent(id, name, desc, repo) {
        transportLayer.editAgent(id, name, desc, repo)
            .then(checkStatus)
            .then(response => response.json())
            .then((json) => {
                mainStore.addToast('Software Agent Updated');
                mainStore.getEntity(id, Path.AGENT);
            }).catch((ex) => {
                mainStore.addToast('Software Agent Update Failed');
                mainStore.handleErrors(ex)
            });
    }

    @action deleteAgent(id) {
        transportLayer.deleteAgent(id)
            .then(this.checkResponse)
            .then(response => {})
            .then((json) => {
                mainStore.addToast('Software Agent Deleted');
                this.agents = BaseUtils.removeObjByKey(this.agents, {key: 'id', value: id})
            }).catch((ex) => {
                mainStore.addToast('Failed to delete software agent');
                mainStore.handleErrors(ex)
            });
    }

    @action clearApiToken() {
        this.agentApiToken = {};
    }

}

const agentStore = new AgentStore();

export default agentStore;