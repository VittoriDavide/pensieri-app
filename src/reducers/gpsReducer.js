const INITIAL_STATE = {
    longitude: '',
    latitude: ''
};

import { GET_GPS} from "../actions/types";

const Gps  =  (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_GPS:
            return {latitude: action.payload.latitude, longitude: action.payload.longitude}

        default:
            return state;

    }
}

export default Gps;