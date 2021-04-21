import React, { useState, useEffect } from 'react';
import {View, Text, ScrollView, Platform} from 'react-native';
import { BottomSheet } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gestionentrega.db');

export default function Entrega (props) {

    const {route} = props;
    const {params} = route;
    //const {idEntrega} = params;
    const [catalogoBoton, setCatalogoBoton] = useState ([]);
    const [parametrosActualizacion, setParametrosActualizacion] = useState ();
    const [idEntrega, setIdEntrega] = useState ();
    const [estatusEntrega, setEstatusEntrega] = useState ();
    const [variableEntrega, setVariableEntrega] = useState (objetoActualizacion);
    const [consultaCatalogos, setConsultaCatalogos] = useState ([]);
    const [listaOpciones, setListaOpciones] = useState ([]);
    const [tieneOpciones, setTieneOpciones] = useState (false);

    console.log(props);
    useEffect (() => {
        db.transaction (tx => {
            tx.executeSql("SELECT * FROM entregas WHERE id_entrega = (?)",[params.idEntrega],(_,{rows}) => setVariableEntrega(JSON.stringify(rows[0])));
            //tx.executeSql("SELECT * FROM catalogos WHERE id_estatus is null AND id_estatus = ?",[props.params])
        });

        actualizaOpciones();
        
    },[]);

    const actualizaOpciones = () => {
        //console.log('actualizaOpciones')
        //console.log(variableEntrega);
        db.transaction (tx => {
            var temp = [];
            tx.executeSql ("SELECT * FROM catalogos",[],(txObj,{rows}) => {
                for (let i = 0; i < rows.length; i ++) {
                    //temp.push (rows.item (i));
                    let opciones = rows.item (i);
                    console.log(opciones);
                    console.log(variableEntrega.id_estatus_entrega);
                    if (opciones.id_estatus_entrega === variableEntrega.id_estatus_entrega) {
                        temp.push(opciones);
                    } else if (opciones.id_estatus_entrega === ' ') {
                        temp.push (opciones);
                    } else if (opciones.id_estatus_entrega === null) {
                        temp.push (opciones);
                    }
                }
            });

            setConsultaCatalogos (temp);
        });
        setTieneOpciones (true);
    }

    const generaListaOpciones = () => {
        console.log(consultaCatalogos);
        setTieneOpciones (false);
    }

    console.log(consultaCatalogos);

    return (
        <View>
            <Text>Entrega</Text>
            <BottomSheet
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>

            </BottomSheet>
        </View>
    );
}

const objetoActualizacion = {
    'id_entrega': '',
    'id_estatus_entrega': ''
}