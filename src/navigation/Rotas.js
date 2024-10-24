import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';

import Header from "../components/Header";
import Footer from "../components/Footer";
import Feed from "../screens/Feed/Feed";
import Login from "../screens/Login/Login";
import Section from "../components/Section";
import TelaTeste from '../components/TelaTeste';
import Perfil from "../screens/Perfil/Perfil";
import Usuarios from '../screens/Usuarios/Usuarios';
import Mensagens from "../screens/Mensagens/Mensagens";
import Pesquisa from "../screens/Pesquisa/Pesquisa";
import Notificacoes from "../screens/Notificacoes/Notificacoes";
import Configuracoes from "../screens/Configuracoes/Configuracoes";
import EditInfo from "../screens/EditInfo/EditInfo";
import PrivateRoute from './PrivateRoute';
import StartChat from '../screens/Mensagens/StartChat';
import ChatRoom from '../screens/Mensagens/ChatRoom';

const Stack = createNativeStackNavigator();

export default function Rotas() {

  const withPrivateRoute = (Component) => (props) => {
    return <PrivateRoute component={Component} {...props} />;
  };

  
  return (
      <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, gestureEnabled: false }}
          />

          <Stack.Screen
          name="Header"
          component={Header}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="Footer"
          component={Footer}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="Section"
          component={Section}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="Feed"
          component={withPrivateRoute(Feed)}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="TelaTeste"
          component={withPrivateRoute(TelaTeste)}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="Perfil"
          component={withPrivateRoute(Perfil)}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="Usuarios"
          component={withPrivateRoute(Usuarios)}
          options={{ headerShown: false }}
          />
          
          <Stack.Screen
          name="Mensagens"
          component={withPrivateRoute(Mensagens)}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="Pesquisa"
          component={withPrivateRoute(Pesquisa)}
          options={{ headerShown: false }}
          />
          
          <Stack.Screen
          name="Notificacoes"
          component={withPrivateRoute(Notificacoes)}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="Configuracoes"
          component={withPrivateRoute(Configuracoes)}
          options={{ headerShown: false }}
          />
          
          <Stack.Screen
          name="EditInfo"
          component={withPrivateRoute(EditInfo)}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="StartChat"
          component={withPrivateRoute(StartChat)}
          options={{ headerShown: false }}
          />

          <Stack.Screen
          name="ChatRoom"
          component={withPrivateRoute(ChatRoom)}
          options={{ headerShown: false }}
          />
      </Stack.Navigator>
    
  );

  
}
