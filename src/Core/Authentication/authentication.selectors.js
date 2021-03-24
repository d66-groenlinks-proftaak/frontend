export const getAuthState = store => store.auth;

export const getAuthAuthenticating = store => getAuthState(store).authenticating;
export const getAuthAuthenticated = store => getAuthState(store).authenticated;
export const getAuthToken = store => getAuthState(store).token;
export const getAuthEmail = store => getAuthState(store).email;
export const getAuthId = store => getAuthState(store).id;

