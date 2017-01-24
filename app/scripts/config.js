let appConfig = {
    serviceId: 'be33eb97-3bc8-4ce8-a109-c82aa1b32b23',
    baseUrl: DDS_PORTAL_CONFIG.baseUrl,
    authServiceUri: 'https://oauth.oit.duke.edu/oidc/authorize?response_type=token&client_id=dds_dev',
    authServiceName:  'OIT OpenID',
    securityState: DDS_PORTAL_CONFIG.securityState,
    apiToken: null,
    isLoggedIn: null,
    currentUser: null
};

export default appConfig;