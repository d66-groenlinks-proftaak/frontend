export const getGlobalState = store => store.global;

export const getGlobalConnection = store => getGlobalState(store).connection;
export const getDarkMode = store => getGlobalState(store).darkmode;
export const getPermissions = store => getGlobalState(store).permissions;

