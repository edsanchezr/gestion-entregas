import React,{useEffect,useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import usuarioPreferences from '../../Hook/usuarioPreferences';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getEntregasAsignadas, recuperaCatalogos} from '../../Api/GestionEntregasApi';
import { ListItem, Avatar } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const db = SQLite.openDatabase('gestionentrega.db');

const HomeScreen = (props) => {

  const [listaEntregas, setListaEntregas] = useState ([]);
  const [consultarEntrega, setConsultarEntrega] = useState (true);
  const [cargando, setCargando] = useState (true);
  const [actualizarCatalogos, setActualizarCatalogos] = useState (true);
  const {navigation} = props;

  useEffect (() => {
    db.transaction (tx => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS entregas ( " +
                    "id_entrega TEXT PRIMARY KEY, id_estatus_entrega TEXT)");
      tx.executeSql("CREATE TABLE IF NOT EXISTS catalogos ( " +
                    "id_catalogo TEXT PRIMARY KEY, id_estatus_entrega TEXT, descripcion_catalogo TEXT, " +
                    "estatus_actualizacion TEXT)");
    });
    if (consultarEntrega) {
      recuperaDatos ();
    }
    if (actualizarCatalogos) {
      actualizarCatalogosMovil ();
    }
  });

  console.log(props);

  const actualizarCatalogosMovil = () => {
    recuperaCatalogos ().then ((response) => {
      console.log('Catalogos: ');
      console.log(Object.keys(response));
      console.log(response);

      if (!(Object.keys(response).length === 0)) {
        setActualizarCatalogos (false);
        response.map ((item, index) => (
          db.transaction (tx => {
            tx.executeSql ("INSERT INTO catalogos (id_catalogo,id_estatus_entrega, descripcion_catalogo, estatus_actualizacion) " +
                          " VALUES (?,?,?,?)",[item.idCatalogo,item.idEstatus,item.descripcion,item.codigoCatalogo]);
          })
        ));
      }
    });
    
  }
  
  const recuperaDatos = async () => {
    try {
      const idTransportista = await AsyncStorage.getItem('id_transportista');
      const idVehiculo = await AsyncStorage.getItem('id_vehiculo');
      const idUser = await AsyncStorage.getItem('user_id');
      //console.log(idTransportista);
      //console.log(idVehiculo);
      //console.log(idUser);

      getEntregasAsignadas (idTransportista, idVehiculo).then ((response) => { 
        if (response === 'undefined') {
          setConsultarEntrega (true);
        } else {
          response.map ((item, index) => (
            db.transaction (tx => {
              tx.executeSql ("  INSERT INTO entregas (id_entrega, id_estatus_entrega) VALUES (?,?)",[item.idEntrega,item.isEstatusEntrega]);
            })
          ))
          setListaEntregas (response);
          setConsultarEntrega (false);
        }
      });
    } catch (e) {
      console.log(e);
    }
    setCargando (false);
  }

  function onNavigation (item) {
    //console.log(item)
    navigation.navigate ('entregas', item);
  }

  console.log (listaEntregas);
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 16}}>
        <ScrollView>
          {
            listaEntregas.map ((item, index) => (
              <ListItem key = {index} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title onPress = {() => onNavigation(item) }>
                    {item.idEntrega} {item.estatusEntregas.nombreEstatus}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))
          }
        </ScrollView>
        <Button />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;