import DDS_PORTAL_CONFIG from './ddsPortalConfig';

let appConfig = {
    authServiceId: null,
    serviceId: null,
    baseUrl: DDS_PORTAL_CONFIG.baseUrl,
    authServiceUri: null,
    authServiceName:  null,
    securityState: DDS_PORTAL_CONFIG.securityState,
    apiToken: null,
    isLoggedIn: null,
    redirectUrl: null,
    currentUser: null
};

export default appConfig;