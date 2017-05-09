import * as fake from "../app/scripts/testData";
import { sleep, respond, respondOK }  from "../app/scripts/util/testUtil";

describe('Agent Store', () => {

    const AGENT_ID = 'AGENT_ID';
    const AGENT_NAME = 'AGENT_NAME';
    const AGENT_DESC = 'AGENT_DESC';
    const AGENT_REPO = 'AGENT_REPO';
    const API_KEY = 'API_KEY';
    const API_TOKEN = 'API_TOKEN';
    const AGENT_KEY = 'AGENT_KEY';
    const USER_KEY = 'USER_KEY';

    let transportLayer = null;
    let agentStore = null;

    beforeEach(() => {
        agentStore = require('../app/scripts/stores/agentStore').default;
        transportLayer = {};
        agentStore.transportLayer = transportLayer;
    });

    it('@action clearApiToken - clears software agent api token from store', () => {
        agentStore.agentApiToken = fake.api_token_json;
        expect(agentStore.agentApiToken.api_token).toBe(fake.api_token_json.api_token);
        agentStore.clearApiToken();
        expect(agentStore.agentApiToken).toEqual({});
    });

    it('@action deleteAgent - deleteAgent a software agent', () => {
        transportLayer.deleteAgent = jest.fn((id) => respondOK());
        agentStore.deleteAgent(AGENT_ID);
        return sleep(1).then(() => {
            expect(transportLayer.deleteAgent).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteAgent).toHaveBeenCalledWith(AGENT_ID);
        });
    });

    it('@action editAgent - edits a software agent details', () => {
        transportLayer.editAgent = jest.fn((id, name, desc, repo) => respondOK(fake.agent_list_json.results[0]));
        agentStore.editAgent(AGENT_ID, AGENT_NAME, AGENT_DESC, AGENT_REPO);
        return sleep(1).then(() => {
            expect(transportLayer.editAgent).toHaveBeenCalledTimes(1);
            expect(transportLayer.editAgent).toHaveBeenCalledWith(AGENT_ID, AGENT_NAME, AGENT_DESC, AGENT_REPO);
        });
    });

    it('@action addAgent - adds a new software agent', () => {
        agentStore.agents = fake.agent_list_json.results;
        expect(agentStore.agents.length).toBe(2);
        transportLayer.addAgent = jest.fn((name, desc, repo) => respondOK(fake.agent_json));
        agentStore.addAgent(AGENT_NAME, AGENT_DESC, AGENT_REPO);
        return sleep(1).then(() => {
            expect(transportLayer.addAgent).toHaveBeenCalledTimes(1);
            expect(transportLayer.addAgent).toHaveBeenCalledWith(AGENT_NAME, AGENT_DESC, AGENT_REPO);
            expect(agentStore.agents.length).toBe(3);
            expect(agentStore.agents[0].id).toBe(fake.agent_json.id);
            expect(agentStore.agents[0].name).toBe(fake.agent_json.name);
        });
    });

    it('@action loadAgents - loads a list of software agents', () => {
        let mainStore = require('../app/scripts/stores/mainStore').default;
        mainStore.loading = false;
        transportLayer.loadAgents = jest.fn(() => respondOK(fake.agent_list_json));
        agentStore.loadAgents();
        expect(mainStore.loading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.loadAgents).toHaveBeenCalledTimes(1);
            expect(transportLayer.loadAgents).toHaveBeenCalledWith();
            expect(agentStore.agents.length).toBe(2);
            expect(agentStore.agents[0].id).toBe(AGENT_ID);
            expect(agentStore.agents[0].name).toBe(AGENT_NAME);
            expect(mainStore.loading).toBe(false);
        });
    });

    it('@action getAgentKey - gets an agent key', () => {
        let authStore = require('../app/scripts/stores/authStore').default;
        authStore.userKey = fake.api_key_json;
        transportLayer.getAgentKey = jest.fn((id) => respondOK(fake.api_key_json));
        agentStore.getAgentKey(AGENT_ID);
        return sleep(1).then(() => {
            expect(transportLayer.getAgentKey).toHaveBeenCalledTimes(1);
            expect(transportLayer.getAgentKey).toHaveBeenCalledWith(AGENT_ID);
            expect(agentStore.agentKey.key).toBe(API_KEY);
        });
    });

    it('@action getAgentApiToken - creates an agent api token', () => {
        transportLayer.getUserKey = jest.fn(() => respond(201, 'ok', fake.api_key_json));
        transportLayer.getAgentKey = jest.fn((id) => respond(201, 'ok',fake.api_key_json));
        transportLayer.getAgentApiToken = jest.fn((agentKey, userKey) => respond(201, 'ok', fake.api_token_json));
        agentStore.getAgentApiToken(AGENT_ID);
        return sleep(1).then(() => {
            expect(transportLayer.getUserKey).toHaveBeenCalledTimes(1);
            expect(transportLayer.getAgentKey).toHaveBeenCalledTimes(1);
            expect(transportLayer.getAgentApiToken).toHaveBeenCalledTimes(1);
            expect(transportLayer.getAgentKey).toHaveBeenCalledWith(AGENT_ID);
            expect(transportLayer.getAgentApiToken).toHaveBeenCalledWith(API_KEY, API_KEY);
            expect(agentStore.agentApiToken.api_token).toBe(API_TOKEN);
        });
    });

    it('@action createAgentKey - creates an agent key', () => {
        transportLayer.createAgentKey = jest.fn((id) => respondOK(fake.api_key_json));
        agentStore.createAgentKey(AGENT_ID);
            return sleep(1).then(() => {
                expect(transportLayer.createAgentKey).toHaveBeenCalledTimes(1);
                expect(transportLayer.createAgentKey).toHaveBeenCalledWith(AGENT_ID);
                expect(agentStore.agentKey.key).toBe(API_KEY);
            });
    });
});