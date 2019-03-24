

import {
    GET_MESSAGES,
    GET_MESSAGES_FAIL,
    DELETE_MESSAGE,
    SUBMIT_MESSAGE,
    GET_GPS,
    REFRESHING,
    SUBMIT_MESSAGE_FAIL, SUBMITTING, NOTIFY_MESSAGE, ADD_SEARCH_HASHTAG, CONFIG_CALL, FILTER_TAGS, DELETE_FILTER_TAGS
} from "./types";
import Headers from "../../constants/Headers";
import { Localization } from 'expo';

const FETCH_RETRY=3;

function fetch_retry(url, options, n=FETCH_RETRY) {

    console.log("I'm repeating ", n)

    return new Promise(function(resolve, reject) {

            fetch(url, options)
            .then( (res) => {

                console.log("chocolate", res.status);

                if(res.status === 429) {
                    if (n === 1) return reject();

                     setTimeout(() => resolve(fetch_retry(url, options, n - 1)), FETCH_RETRY+1-n * 500)
                }else{
                    resolve(res)
                }
            }).catch(function(error) {
            console.log("errorchocolate", error);

            if (n === 1) return reject(error);
                setTimeout(resolve(fetch_retry(url, options, n - 1)), FETCH_RETRY+1-n*500)
            })

    })
}





function fetchMessages(latitude, longitude, hashtag=[], page=0) {
    let addHashtag = '';

    if(hashtag !== null || hashtag !== undefined){
        addHashtag = "&hashtag[]=" + hashtag.join(",")
    }
    return fetch_retry('http://54.38.65.73/core/get?' + 'latitude=' + latitude + ' &longitude=' + longitude + addHashtag + '&page=' + page, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-App-Version': Headers.AppVersion,
            'X-App-Key': Headers.AppKey
        }
    })
}


function configCallGET(latitude, longitude, hashtag=[]) {
    return fetch_retry('http://54.38.65.73/core/config?' + 'latitude=' + latitude + ' &longitude=' + longitude , {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-App-Version': Headers.AppVersion,
            'X-App-Key': Headers.AppKey
        }
    })
}

function deleteMessagePOST(deleteToken, idMessage) {
    return  fetch_retry('http://54.38.65.73/core/delete', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-App-Version': Headers.AppVersion,
            'X-App-Key': Headers.AppKey
        },
        body: JSON.stringify({
            deleteToken,
            idMessage,

        }),
    })
}

function notifyMessagePOST(idMessage) {
    return  fetch_retry('http://54.38.65.73/core/report', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-App-Version': Headers.AppVersion,
            'X-App-Key': Headers.AppKey
        },
        body: JSON.stringify({
            idMessage,

        }),
    })
}

function sendPOSTSubmit(message, hashtag,  longitude, latitude, idSubmit) {

    console.log("localization ", Localization.locale)
    return  fetch_retry('http://54.38.65.73/core/submit', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-App-Version': Headers.AppVersion,
            'X-App-Key': Headers.AppKey
        },
        body: JSON.stringify({
            message,
            hashtag,
            latitude,
            longitude,
            lang: Localization.locale,
            idSubmit
        }),
    })
}

function filterTagGET(message) {

    return fetch_retry('http://54.38.65.73/core/filtertag?' + 'tag=' + message , {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-App-Version': Headers.AppVersion,
            'X-App-Key': Headers.AppKey
        }
    })
}


export const deleteFilterHashTag = () => {
    return ({
        type: DELETE_FILTER_TAGS
    })
};


const filterHashTag = (messages) => {
    return ({
        type: FILTER_TAGS,
        payload: messages
    })
};


const saveMessages = (messages, page) => {
    return ({
        type: GET_MESSAGES,
        payload: { messages, page}
    })
};

const errorMessage = (error) => {
    return ({
        type: GET_MESSAGES_FAIL,
        payload: error
    })
};


const submitMessage = (message) => {
    return ({
        type: SUBMIT_MESSAGE,
        payload: message
    })
};

const errorSubmitting = (error) => {
    return ({
        type: SUBMIT_MESSAGE_FAIL,
        payload: error
    })
};

const deleteMess = (message) => {
    return ({
        type: DELETE_MESSAGE,
        payload: message
    })
};


const notifyMess = (message) => {
    return ({
        type: NOTIFY_MESSAGE,
        payload: message
    })
};

export const refreshing = () => {
    return ({
        type: REFRESHING,
    })
};

export const submitting = () => {
    return ({
        type: SUBMITTING,
    })
};

export const addSearchHashtag = (searchHashtag) =>{
    return ({
        type: ADD_SEARCH_HASHTAG,
        payload: searchHashtag
    })
};


const config = (config) =>{
    return ({
        type: CONFIG_CALL,
        payload: config
    })
}




export const configCall = (longitude, latitude) => {
    return function (dispatch) {
        return configCallGET(latitude, longitude).then(
            message => dispatch(config(message)),
            error => dispatch(errorMessage(error))
        );
    };
};

export const getMessages = (longitude, latitude, hashtags, page=0) => {

    return function (dispatch) {
        return fetchMessages(latitude, longitude, hashtags, page).then(
            message => {             console.log("shit", message)
                return dispatch(saveMessages(message,page))},
            error => {}
        );
    };
};

export const sendMessage = (message, hashtag, longitude, latitude, idSubmit) => {

    return function (dispatch) {
        return sendPOSTSubmit(message, hashtag, longitude, latitude, idSubmit).then(
            message => dispatch(submitMessage(message)),
            error => dispatch(errorSubmitting(error))
        );
    };
};

export const deleteMessage = (deleteToken, idMessage) => {

    return function (dispatch) {
        return deleteMessagePOST(deleteToken, idMessage).then(
            message => dispatch(deleteMess(message)),
            error => dispatch(errorSubmitting(error))
        );
    };
};


export const reportMessage = (idMessage) => {

    return function (dispatch) {
        return notifyMessagePOST(idMessage).then(
            message => dispatch(notifyMess(message)),
            error => dispatch(errorSubmitting(error))
        );
    };
};


export const filterHash = (message) => {

    return function (dispatch) {
        return filterTagGET(message).then(
            message => dispatch(filterHashTag(message)),
            error => dispatch(errorSubmitting(error))
        );
    };
};






