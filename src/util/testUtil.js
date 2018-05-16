export function sleep(ms) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(), ms))
}

export function respond(status, statusText, json) {
    return new Promise((resolve, reject) => resolve({
        status,
        statusText,
        json: () => json,
    }))
}

export function respondOK(json) {
    return respond(200, 'ok', json)
}