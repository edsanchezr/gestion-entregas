import {
    CONTEXT_WS, 
    END_POINT_REGISTRO, 
    END_POINT_VALIDA_USUARIO, 
    END_POINT_VALIDA_ENTREGA,
    END_POINT_CAMBIA_ESTATUS_ENTREGA,
    END_POINT_UBICACION,
    END_POINT_CATALOGOS} from '../Utils/Constants';

export function getEntregasAsignadas (idTransportista, idVehiculo) {
    const url = `${CONTEXT_WS}${END_POINT_VALIDA_ENTREGA}/transportista/${idTransportista}/vehiculo/${idVehiculo}`;
    console.log(url);
    return fetch (url)
        .then ((response) => {
            return response.json ()
        })
        .then ((result) => {
            return result;
    });
}

export function recuperaCatalogos () {
    const url = `${CONTEXT_WS}${END_POINT_CATALOGOS}`;
    console.log(url);
    return fetch (url, {
        method: 'POST',
        body: JSON.stringify({
        estatus: true
      }),
      headers: {
        //Header Defination
        'Content-Type':
        'application/json',
      },
    })
        .then ((response) => {
            return response.json ()
        })
        .then ((result) => {
            console.log(result);
            return result;
    });
}