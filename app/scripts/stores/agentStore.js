import React from 'react';
import { observable, action } from 'mobx';
import transportLayer from '../transportLayer';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import BaseUtils from '../util/baseUtils.js';
import { Path } from '../util/urlEnum';
import { checkStatus } from '../util/fetchUtil';

export class AgentStore {

    @observable agentApiToken
    @observable agentKey
    @observable agents
    @observable userKey

    constructor() {
        this.agentApiToken = {};
        this.agentKey = {};
        this.agents = [];
        this.userKey = {};

        this.transportLayer = transportLayer;
    }

    checkResponse(response) {
        return checkStatus(response, authStore);
    }

    @action createAgentKey(id) {
        this.transportLayer.createAgentKey(id)
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
        this.transportLayer.getAgentKey(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then(json => this.agentKey = json)
            .catch(ex =>mainStore.handleErrors(ex))
    }

    @action getAgentApiToken(id) {
        mainStore.toggleLoading();
        this.transportLayer.getUserKey()
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.userKey = json;
                authStore.userKey = json;
                this.transportLayer.getAgentKey(id)
                    .then(this.checkResponse)
                    .then(response => response.json())
                    .then((json) => {
                        this.agentKey = json;
                        agentStore.transportLayer.getAgentApiToken(this.agentKey.key, this.userKey.key)
                            .then(agentStore.checkResponse)
                            .then(response => response.json())
                            .then((json) => {
                                agentStore.agentApiToken = json;
                                mainStore.toggleModals('agentCred');
                                if (mainStore.loading) mainStore.toggleLoading();
                            })
                            .catch((ex) => {
                                mainStore.addToast('Failed to generate an API token');
                                mainStore.handleErrors(ex);
                            })
                    })
                    .catch(ex => mainStore.handleErrors(ex));
            })
            .catch((ex) => {
                if (ex.response.status !== 404) {
                    mainStore.handleErrors(ex)
                } else {
                    this.transportLayer.createUserKey()
                        .then(mainStore.checkResponse)
                        .then(response => response.json())
                        .then((json) => {
                            this.userKey = json;
                            authStore.userKey = json;
                            agentStore.getAgentApiToken(id)
                        }).catch((ex) => {
                        mainStore.addToast('Failed to create new User key');
                        mainStore.handleErrors(ex)
                    })
                }
            });
    }

    @action loadAgents() {
        mainStore.toggleLoading();
        this.transportLayer.loadAgents()
            .then(this.checkResponse)
            .then(response => response.json())
                .then((json) => {
                this.agents = json.results;
                if(mainStore.loading) mainStore.toggleLoading();
            }).catch(ex =>mainStore.handleErrors(ex))
    }

    @action addAgent(name, desc, repo) {
        this.transportLayer.addAgent(name, desc, repo)
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
        this.transportLayer.editAgent(id, name, desc, repo)
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
        this.transportLayer.deleteAgent(id)
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