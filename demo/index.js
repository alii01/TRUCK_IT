/** @format */
import{AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react'
import{YellowBox} from 'react-native';
import login from './screens/login';
import login from './screens/login'
import Home from './screens/Home'





YellowBox.ignoreWarnings([
    'unrecognized websocket connection option'
]);



AppRegistry.registerComponent(appName , ()=>App)