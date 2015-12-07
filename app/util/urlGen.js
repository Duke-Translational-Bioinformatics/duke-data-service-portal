let UrlGen = {
    routes: {
        ddsUrl: 'https://dukeds-dev.herokuapp.com/api/v1/',
        baseUrl: DDS_PORTAL_CONFIG.baseUrl,
        login: () => '/login',
        home: (id) => '/',
        project: (projectId) => '/project' + projectId,
        folder: (projectId, folderId) => '/project' + projectId + folderId
    }
};

export default UrlGen;