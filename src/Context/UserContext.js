import {createContext} from 'react';

const UserContext = createContext ({
    data: objetoUsuario
});

export default UserContext;

const objetoUsuario = {
    'activo': false,
    'claveUsuarioMovil': '',
    'idTransportista': '',
    'idVehiculo': ''
}