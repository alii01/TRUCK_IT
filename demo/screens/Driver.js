import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { TextInput,StyleSheet, Text, View,Keyboard, Dimensions, SafeAreaView,TouchableHighlight,TouchableOpacity,ActivityIndicator,Image } from 'react-native';
import socketIO from 'socket.io-client';
import MapView ,{Marker} from "react-native-maps";
 import {FontAwesome5} from '@expo/vector-icons'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import apiKey from '../google_api_key';
import PolyLine from "@mapbox/polyline";
import {Polyline} from "react-native-maps";
import BottomButton from '../components/BottomButton';

export default class Driver extends React.Component {
  constructor(props){
    super(props);
    this.state={
      latitude: 0,
      longitude:0,
      error: null,
      
      pointCoords: [],
      lookingForPassenger:false,
      

    };
    this.acceptPassengerRequest=this.acceptPassengerRequest.bind(this);
    this.findPassengers= this.findPassengers.bind(this);
    this.socket=null;
    
  }
  
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(position=>{
      this.setState({
        latitude:position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
        
      });
      // change on 4:13 this.getRouteDirections();
      
    },
    error=> this.setState({error:error.message}),
    {enableHighAccuracy:true, timeout:20000 , maximumAge: 2000}
    );
   
  }
  //Direction api call 
  async getRouteDirections(placeId ){
    try{
      const response= await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${placeId}&key=AIzaSyC4EoCw56S4_heCjca6__gqcAPfgzl8mz4`
      );
      const json = await response.json();
      if(json.routes.length>0){
        const points = PolyLine.decode(json.routes[0].overview_polyline.points);
        const pointCoords = points.map(point=>{
          return{latitude: point[0],longitude: point[1]};
        });
        this.setState({pointCoords,routeResponse:json});        
        
        this.map.fitToCoordinates(pointCoords,{
          edgePadding: { top: 20, bottom: 20, left: 20, right: 20 }
        });
      }
      return;

    }catch(error){
      console.error(error)
    }
  }
  findPassengers(){
     if(!this.state.lookingForPassengers){
      this.setState({
        lookingForPassengers:true
      });
     
    
      this.socket= socketIO.connect("http://192.168.0.121:3000");
      this.socket.on("connect",()=>{
        this.socket.emit("lookingForPassenger");
      });
      this.socket.on("taxiRequest",routeResponse=>{
        console.log(routeResponse);
      
        this.setState({lookingForPassengers:false,passengerFound:true,routeResponse});
        this.getRouteDirections(routeResponse.geocoded_waypoints[0].place_id);
      });

    }
  }
  acceptPassengerRequest(){
    //send driver location to passenger
    this.socket.emit("driverLocation",{
      latitude:this.state.latitude,
      longitude:this.state.longitude
    });

  }

 
  
  render(){
   // let endmarker =null;
    let marker=null;
    let startMarker=null;
    let findingPassengerActIndicator = null;
    let passengerSearchText = "FIND PASSENGERS 👥";
    let bottomButtonFunction = this.findPassengers;




    if (this.state.lookingForPassengers) {
      passengerSearchText = "FINDING PASSENGERS...";
      findingPassengerActIndicator = (
        <ActivityIndicator
          
          animating={this.state.lookingForPassengers}
          size="large"
          color="#00ff00"
        />
      );
    }

    if (this.state.passengerFound) {
      passengerSearchText = "FOUND PASSENGER! ACCEPT RIDE?";
      bottomButtonFunction=this.acceptPassengerRequest;
    }
   
    if(this.state.pointCoords.length>1){
      marker=(<Marker coordinate={this.state.pointCoords[this.state.pointCoords.length-1]}>
        <Image 
          style={{width:40 , height: 40}}
          source={require("../images/person-marker.png")}

        />
      </Marker>);

    }
   
    /*const chatMessages = this.state.chatMessages.map(chatMessage=>(
    <Text key={chatMessage}>{chatMessage}</Text>));*/
   return (
     /* <View style={styles.container}>
        <Text>Open up App.js to start THA THA working on your app!</Text>
        <TextInput 
          style={{height:40 , borderWidth:2 }}
          autoCorrect={false} 
          value={this.state.chatMessage}
          onSubmitEditing={()=> this.submitChatMessage()}
          onChangeText={chatMessage=>{
            this.setState({chatMessage});
          }}
          />
          {chatMessages}
        <StatusBar style="auto" />
        </View>*/
      <View style={styles.container}>  
         <MapView 
          ref={map=>{this.map=map;}}
          style={styles.map}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
              
            }}
            showsUserLocation={true}
          >
           <Polyline
            coordinates={this.state.pointCoords}
            strokeWidth={4}
            strokeColor="red"
          />
          
          {marker}
          {startMarker}
          
          </MapView>
          <BottomButton 
            onPressFunction= {bottomButtonFunction}
             buttonText={passengerSearchText}>
              {findingPassengerActIndicator}
            </BottomButton>
            
      </View>        
       
    );
  }
}

const styles = StyleSheet.create({
  findDriver: {
    backgroundColor: "black",
    marginTop: "auto",
    margin: 20,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: "center"
  },
  findDriverText: {
    fontSize: 20,
    color: "white",
    fontWeight: "600"
  },


  destinationinput:{
    
     height:40 ,
     borderWidth: 0.5,
     marginTop:50,
     marginLeft:5,
     marginRight:5,
     padding:5,
     backgroundColor:'white'
  },
  suggestion:{
    backgroundColor:"white",
    padding:5,
    fontSize:10,
    borderWidth:0.5,
    marginLeft:5,
    marginRight:5

  },
  container: {
    ...StyleSheet.absoluteFillObject  
  },
  map:{
    ...StyleSheet.absoluteFillObject
  },
  text:{
    color:'#161924',
    fontSize:20,
    fontWeight:'500'
  }
 
});
