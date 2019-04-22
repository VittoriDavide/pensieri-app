const INITIAL_STATE = {
    messages: [],
    errorMessage: '',
    refresh: false,
    idLastMessage: '',
    deleteTokenLastMessage: '',
    submitted: false,
    errorSubmitted: false,
    lastMessage: {},
    searchHashtag: [],
    hourRate: 0,
    lifetime: 0,
    hashes: [],
    memoriaeMessage: []
};

import {
    ADD_SEARCH_HASHTAG,
    DELETE_MESSAGE,
    GET_MESSAGES,
    REFRESHING,
    SUBMIT_MESSAGE,
    SUBMITTING,
    CONFIG_CALL, FILTER_TAGS, DELETE_FILTER_TAGS, END_REFRESHING, SUBMIT_MESSAGE_FAIL, MEMORIAE_MESSAGE
} from "../actions/types";

const Message  =  (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_MESSAGES:
            let messages = JSON.parse(action.payload.messages._bodyInit).messages;
            console.log("messages", messages);

            if(messages !== undefined && messages !== null) {
                return {
                    ...state, messages: action.payload.page === 0 ? messages : [...state.messages, ...messages],
                    refresh: false
                }
            } else return {...state, refresh: false};
        case REFRESHING:
            console.log("starting refreshing")
            return { ...state, refresh: true }
        case END_REFRESHING:
            return { ...state, refresh: false }
        case SUBMITTING:
            return { ...state,  submitted: true }
        case SUBMIT_MESSAGE:
            return { ...state, idLastMessage: JSON.parse(action.payload._bodyInit).id,
                deleteTokenLastMessage: JSON.parse(action.payload._bodyInit).deleteToken,
                lastMessage: JSON.parse(action.payload._bodyInit).requestToResponseMapping, submitted: false }
        case SUBMIT_MESSAGE_FAIL:
            return {...state, submitted: false}
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

        case MEMORIAE_MESSAGE:
            let list = JSON.parse(action.payload._bodyInit).list;
            console.log("oh shit", list);

            if(list !== undefined && list !== null) {
                return { ...state, memoriaeMessage: list}

            }else {
                return { ...state, loadingMemoriae: false }
            }


        default:
            return state;

    }
}

export default Message;