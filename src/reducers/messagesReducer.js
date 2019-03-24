const INITIAL_STATE = {
    messages: [],
    errorMessage: '',
    refresh: false,
    idLastMessage: '',
    deleteTokenLastMessage: '',
    submitted: false,
    lastMessage: {},
    searchHashtag: [],
    hourRate: 0,
    lifetime: 0,
    hashes: []
};

import {
    ADD_SEARCH_HASHTAG,
    DELETE_MESSAGE,
    GET_MESSAGES,
    REFRESHING,
    SUBMIT_MESSAGE,
    SUBMITTING,
    CONFIG_CALL, FILTER_TAGS, DELETE_FILTER_TAGS
} from "../actions/types";

const Message  =  (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_MESSAGES:
            let messages =JSON.parse(action.payload.messages._bodyInit).messages;
            if(messages !== undefined && messages !== null) {
                return {
                    ...state, messages: action.payload.page === 0 ? messages : [...state.messages, ...messages],
                    errorMessage: JSON.parse(action.payload.messages._bodyInit).errorMessage, refresh: false
                }
            } else return {...state, refresh: false} ;
        case REFRESHING:
            return { ...state, refresh: true }
            case SUBMITTING:
        return { ...state,  submitted: true }
        case SUBMIT_MESSAGE:
            return { ...state, idLastMessage: JSON.parse(action.payload._bodyInit).id,
                deleteTokenLastMessage: JSON.parse(action.payload._bodyInit).deleteToken,
                lastMessage: JSON.parse(action.payload._bodyInit).requestToResponseMapping, submitted: false }
        case DELETE_MESSAGE:
            return { ...state, lastMessage: {}, deleteTokenLastMessage: '', idLastMessage: ''}
        case ADD_SEARCH_HASHTAG:
            return {...state, searchHashtag: action.payload}
        case CONFIG_CALL:
            return {...state, hourRate: JSON.parse(action.payload._bodyInit).serverInfo.costoOrario, lifetime: JSON.parse(action.payload._bodyInit).serverInfo.lifetime}

        case FILTER_TAGS:
            let hashes = JSON.parse(action.payload._bodyInit);
            if(hashes !== undefined && hashes !== null && Array.isArray(hashes)) {
                return {
                    ...state, hashes
                }
            } else return state ;

        case DELETE_FILTER_TAGS:
            return {...state, hashes: []}


        default:
            return state;

    }
}

export default Message;