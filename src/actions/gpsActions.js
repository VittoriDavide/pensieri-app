

import {GET_GPS} from "./types";

export const saveGPS = (longitude, latitude) =>{

    return ({
        type: GET_GPS,
        payload: {longitude, latitude}
    })
}