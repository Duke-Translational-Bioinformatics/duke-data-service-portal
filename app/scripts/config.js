function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
let randString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

let appConfig = {
    //baseUrl: 'https://192.168.99.100:3001',///Todo: Use for local development
    //authServiceUri: 'https://192.168.99.100:3000',///Todo: Use for local development
    baseUrl: 'https://dukeds-dev.herokuapp.com',
    authServiceUri: 'https://dds-dev.duhs.duke.edu/duke_authentication_service',
    serviceId: 'c87de9f2-1690-4523-87dc-6395f665a757',
    authServiceName: 'Duke Authentication Service',
    securityState: randString,
    apiToken: null,
    isLoggedIn: null,
    currentUser: null
};


export default appConfig;