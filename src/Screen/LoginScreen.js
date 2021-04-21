import React, {useState, createRef, useMemo} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from './Components/Loader';
import UserContext from '../Context/UserContext';

const LoginScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [data, setData] = useState(objetoUsuario);
  const passwordInputRef = createRef();

  //console.log('Navigation');
  //console.log(navigation);

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    setLoading(true);
    let dataToSend = {email: userEmail, password: userPassword};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('http://localhost:8080/monitor-entregas/wsrest/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({
        nombreUsuarioMovil: userEmail,
        claveUsuarioMovil: userPassword
      }),
      headers: {
        //Header Defination
        'Content-Type':
        'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        setData (responseJson);
        // If server response message same as Data Matched
        if (responseJson.codigo === '200' && responseJson.activo) {
          AsyncStorage.setItem('user_id', responseJson.idUsuarioMovil);
          AsyncStorage.setItem('id_transportista', responseJson.idTransportista);
          AsyncStorage.setItem('id_vehiculo', responseJson.idVehiculo);
          //console.log(responseJson.idUsuarioMovil);
          console.log(navigation);
          //navigation.setParams(data);
          navigation.replace('DrawerNavigationRoutes');
          
        } else {
          setErrortext(responseJson.msg);
          console.log('Please check your email id or password');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  //console.log(data);

  const userPref = useMemo (
    () => ({
      data
    }),
    [data]
  );

  return (
    <UserContext.Provider value = {userPref}>
      <View style={styles.mainBody}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View>
            <KeyboardAvoidingView enabled>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../Image/logoProspectiva.png')}
                  style={{
                    width: '50%',
                    height: 100,
                    resizeMode: 'contain',
                    margin: 30,
                  }}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserEmail) =>
                    setUserEmail(UserEmail)
                  }
                  placeholder="Usuario" //dummy@abc.com
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    passwordInputRef.current &&
                    passwordInputRef.current.focus()
                  }
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserPassword) =>
                    setUserPassword(UserPassword)
                  }
                  placeholder="Contraseña" //12345
                  placeholderTextColor="#8b9cb5"
                  keyboardType="default"
                  ref={passwordInputRef}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  secureTextEntry={true}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
              </View>
              {errortext != '' ? (
                <Text style={styles.errorTextStyle}>
                  {errortext}
                </Text>
              ) : null}
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>LOGIN</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </View>
    </UserContext.Provider>
  );
};
export default LoginScreen;

const objetoUsuario = {
  'activo': false,
  'claveUsuarioMovil': '',
  'idTransportista': '',
  'idVehiculo': ''
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});