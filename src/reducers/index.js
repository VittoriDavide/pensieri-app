import {combineReducers } from 'redux';

import Gps from './gpsReducer';
import Message from './messagesReducer';


export default combineReducers({
    Gps,
    Message
});