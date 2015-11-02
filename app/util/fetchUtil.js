export function checkStatus(response, AppActions) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        if(response.status === 401) AppActions.logout(); // session expired
        var error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

export function getAuthenticatedFetchParams(method, apiToken, body) {
    let obj = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiToken
        }
    };
    if(body) obj.body = JSON.stringify(body);
    return obj;
}