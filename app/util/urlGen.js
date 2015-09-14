let UrlGen = {
    routes: {
        login: () => '/login',
        home: (id) => '/' + id,
        project: (projectId) => '/project' + projectId,
        folder: (projectId, folderId) => '/project' + projectId + folderId,
    }
};

export default UrlGen;