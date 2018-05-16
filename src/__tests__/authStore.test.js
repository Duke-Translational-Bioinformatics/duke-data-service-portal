import * as fake from "../testData";
import { sleep, respondOK }  from "../util/testUtil";

describe('Auth Store', () => {

    const AUTH_PROVIDER_ID = 'AUTH_PROVIDER_ID';
    const REDIRECT_URL = 'REDIRECT_URL';
    const ACCESS_TOKEN = 'ACCESS_TOKEN';
    const API_TOKEN = 'API_TOKEN';
    const API_KEY = 'API_KEY';

    let transportLayer = null;
    let authStore = null;

    beforeEach(() => {
        authStore = require('../stores/authStore').default;
        transportLayer = {};
        authStore.transportLayer = transportLayer;
    });

    it('@action setLoadingStatus - sets loading status for login flow', () => {
        expect(authStore.authServiceLoading).toBe(false);
        authStore.setLoadingStatus();
        expect(authStore.authServiceLoading).toBe(true);
        authStore.setLoadingStatus();
        expect(authStore.authServiceLoading).toBe(false);
    });

    it('@action setRedirectUrl - sets proper redirect URL in app config', () => {
        authStore.setRedirectUrl(REDIRECT_URL);
        expect(authStore.appConfig.redirectUrl).toBe(REDIRECT_URL);
    });

    it('@action handleLogout 401 - logs user out and clears appConfig when api token expires', () => {
        window.location.assign = jest.fn();
        authStore.handleLogout(401);
        expect(window.location.assign).toHaveBeenCalled();
        expect(authStore.appConfig.isLoggedIn).toBeNull();
        expect(authStore.appConfig.apiToken).toBeNull();
        expect(authStore.appConfig.redirectUrl).not.toBeNull();
    });

    it('@action handleLogout - logs user out and resets appConfig.redirectUrl when user logs out through log out option', () => {
        window.location.assign = jest.fn();
        authStore.handleLogout();
        expect(window.location.assign).toHaveBeenCalled();
        expect(authStore.appConfig.isLoggedIn).toBeNull();
        expect(authStore.appConfig.apiToken).toBeNull();
        expect(authStore.appConfig.redirectUrl).toBeNull();
    });

    it('@action removeLoginCookie - removes temporary logged in cookie', () => {
        authStore.removeLoginCookie();
        expect(authStore.appConfig.isLoggedIn).toBeNull();
    });

    it('@action isLoggedInHandler - sets a temporary logged in cookie', () => {
        authStore.isLoggedInHandler();
        expect(authStore.appConfig.isLoggedIn).toBe(true);
        expect(authStore.authServiceLoading).toBe(true);
    });

    it('@action deleteUserKey - deletes user API key', () => {
        transportLayer.deleteUserKey = jest.fn((id) => respondOK());
        authStore.deleteUserKey();
        return sleep(1).then(() => {
            expect(transportLayer.deleteUserKey).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteUserKey).toHaveBeenCalledWith();
            expect(authStore.userKey).toEqual({});
        });
    });

    it('@action createUserKey - creates user API key', () => {
        transportLayer.createUserKey = jest.fn((id) => respondOK(fake.api_key_json));
        authStore.createUserKey();
        return sleep(1).then(() => {
            expect(transportLayer.createUserKey).toHaveBeenCalledTimes(1);
            expect(transportLayer.createUserKey).toHaveBeenCalledWith();
            expect(authStore.userKey.key).toBe(API_KEY);
        });
    });

    it('@action getUserKey - gets user API key', () => {
        transportLayer.getUserKey = jest.fn((id) => respondOK(fake.api_key_json));
        authStore.getUserKey();
        return sleep(1).then(() => {
            expect(transportLayer.getUserKey).toHaveBeenCalledTimes(1);
            expect(transportLayer.getUserKey).toHaveBeenCalledWith();
            expect(authStore.userKey.key).toBe(API_KEY);
        });
    });

    it('@action getCurrentUser - gets current user details', () => {
        expect(authStore.currentUser).toEqual({});
        transportLayer.getCurrentUser = jest.fn((id) => respondOK(fake.user_json));
        authStore.getCurrentUser();
        return sleep(1).then(() => {
            expect(transportLayer.getCurrentUser).toHaveBeenCalledTimes(1);
            expect(transportLayer.getCurrentUser).toHaveBeenCalledWith();
            expect(authStore.currentUser.id).toBe(fake.user_json.id);
        });
    });

    it('@action getAuthProviders - populate a list of authentication providers and sets appconfig to default', () => {
        transportLayer.getAuthProviders = jest.fn(() => respondOK(fake.auth_providers_json));
        authStore.getAuthProviders();
        return sleep(1).then(() => {
            expect(transportLayer.getAuthProviders).toHaveBeenCalledTimes(1);
            expect(transportLayer.getAuthProviders).toHaveBeenCalledWith();
            expect(authStore.appConfig.authServiceUri).toBe(fake.auth_providers_json.results[1].login_initiation_url);
            expect(authStore.appConfig.authServiceName).toBe(fake.auth_providers_json.results[1].name);
            expect(authStore.appConfig.authServiceId).toBe(fake.auth_providers_json.results[1].id);
            expect(authStore.appConfig.serviceId).toBe(fake.auth_providers_json.results[1].service_id);
        });
    });

    it('@action getApiToken - use the access token to get an API token', () => {
        transportLayer.getApiToken = jest.fn((accessToken) => respondOK(fake.api_token_json));
        authStore.getApiToken(ACCESS_TOKEN);
        return sleep(1).then(() => {
            expect(transportLayer.getApiToken).toHaveBeenCalledTimes(1);
            expect(transportLayer.getApiToken).toHaveBeenCalledWith(ACCESS_TOKEN, authStore.appConfig);
            expect(authStore.appConfig.apiToken).toBe(fake.api_token_json.api_token);
        });
    });
});