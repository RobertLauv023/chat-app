export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const CONTACT_ROUTES = "api/contacts";
export const CHATROOM_ROUTES = "api/chatrooms";
export const MESSAGE_ROUTES = "api/messages";

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const USER_INFO_ROUTE = `${AUTH_ROUTES}/userinfo`;

export const SEARCH = `${CONTACT_ROUTES}/search`;
export const SEARCH_ALL = `${CONTACT_ROUTES}/all-contacts`;

export const CREATE_CHATROOM = `${CHATROOM_ROUTES}/create`;
export const GET_CHATROOMS_ROUTE = `${CHATROOM_ROUTES}/get-chatrooms`;
export const DELETE_CHATROOMS_ROUTE = `${CHATROOM_ROUTES}/delete-chatrooms`;

export const SEND_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/send-message`;
export const GET_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/get-messages`;