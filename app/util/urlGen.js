let UrlGen = {
    routes: {
        ddsUrl: 'https://dev.dataservice.duke.edu/api/v1/',
        baseUrl: DDS_PORTAL_CONFIG.baseUrl,
        prefix: '/portal/#',
        login: () => '/login',
        home: (id) => '/',
        project: (projectId) => '/project' + projectId,
        folder: (projectId, folderId) => '/project' + projectId + folderId
    }
};

export default UrlGen;