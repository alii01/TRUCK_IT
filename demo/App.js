import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { TextInput,StyleSheet, Text, View, Button,Dimensions } from 'react-native';
import Home from './screens/Home';
import {Asset} from "expo-asset";
import { AppLoading } from 'expo';
import Login from './screens/login';
import Driver from './screens/Driver';




function cacheImages(images){
  return images.map(image=>{
    if(typeof image ==='string'){
      return Image.prefetch(image);
    }else{
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
     isDriver: null,
     isPassenger: false,
     isReady:false,  /** to check if it ready to show the picture   */
      token:''
    };
    this.handleChangeToken=this.handleChangeToken.bind(this);
   // this.handeChangeDriver=this.handleChangeDriver.bind(this);
  }
  handleChangeToken(token){
    console.log(token.token)
    this.setState({token:token.token});
    this.setState({isDriver:token.driverstat});
    
  }
  // handleChangeDriver(isDriver){
  //   console.log('yaha tk to aja yar ');
  //   this.setState({isDriver});
  // }
  
  async _loadAssetsAsync(){
    const imageAssets= cacheImages([
      
      require('./assets/bg.jpg')
    ]);
    await Promise.all([...imageAssets])
  }
  
  render(){
    if(!this.state.isReady){
      return(
        <AppLoading 
          startAsync={this._loadAssetsAsync}
          onFinish={()=>this.setState({isReady:true})}
          onError={console.warn}
        />
      );
    }
    if(this.state.token===''){
      return <Login handleChangeToken={this.handleChangeToken}/>
    }

    //change 2:21 1/15/2021
    if(this.state.token==='email does not exist '){
      return <Login handleChangeToken={this.handleChangeToken}/>
    }
    if(this.state.token==='Password is Incorrect Please Enter again '){
      return <Login handleChangeToken={this.handleChangeToken}/>
    }
    

    if(this.state.isDriver){
      
      return<Driver props={true} propName={'tempVar'}/>;
    }else if(!this.state.isDriver){
      return<Home/>;
    }
   return (
     <View style={styles.container}>
       <Button
         onPress={()=>this.setState({isDriver:true})}
         title="Driver"
       />
        <Button
         onPress={()=>this.setState({isPassenger:true})}
         title="Passenger"
       />
     </View>
     
    
    );
   // 
  }
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:50
  }
  
 
});
