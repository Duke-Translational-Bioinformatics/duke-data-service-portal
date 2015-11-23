import DDS_PORTAL_CONFIG from '../lib/dds_portal_config.js';

let appConfig = {
    serviceId: DDS_PORTAL_CONFIG.serviceId,
    baseUrl: DDS_PORTAL_CONFIG.baseUrl,
    authServiceUri: DDS_PORTAL_CONFIG.authServiceUri,
    authServiceName:  DDS_PORTAL_CONFIG.authServiceName,
    securityState: DDS_PORTAL_CONFIG.securityState,
    apiToken: null,
    isLoggedIn: null,
    currentUser: null
};

export default appConfig;