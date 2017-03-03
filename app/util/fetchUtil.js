export function checkStatus(response, authStore) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        if(response.status === 401) authStore.handleLogout(); // session expired
        var error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

export function getFetchParams(method, apiToken, body) {
    let obj = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': apiToken ? apiToken : ''
        }
    };
    if(body) obj.body = JSON.stringify(body);
    return obj;
}