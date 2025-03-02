export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const CONTACT_ROUTES = "api/contacts";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const USER_INFO_ROUTE = `${AUTH_ROUTES}/userinfo`;
export const SEARCH = `${CONTACT_ROUTES}/search`;
export const SEARCH_ALL = `${CONTACT_ROUTES}/all-contacts`;