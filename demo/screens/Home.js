import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { TextInput,StyleSheet, Text, View,Keyboard, Dimensions, SafeAreaView,TouchableHighlight,TouchableOpacity,ActivityIndicator, Image } from 'react-native';
import socketIO from 'socket.io-client';
import MapView ,{Marker} from "react-native-maps";
import {Container, Header , Content, Form , Item , Picker,Input } from 'native-base';
 import {FontAwesome5} from '@expo/vector-icons'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import apiKey from '../google_api_key';
import PolyLine from "@mapbox/polyline";
import {Polyline} from "react-native-maps";
import BottomButton from '../components/BottomButton';
import axios from 'axios';
import baseUrl, { italics } from '../baseUrl';

axios.defaults.baseURL=baseUrl;

export default class Home extends React.Component {
  constructor(props){
    super(props);
    this.state={
      latitude: 0,
      longitude:0,
      error: null,
      destination: "",
      predictions: [],
      pointCoords: [],
      routeResponse:{},
      lookingForDriver:false,
      driverIsOnTheWay: false,
      selected2: undefined,
      distance:''

    };
    this.handlefareCalculation=this.handlefareCalculation.bind(this);
    this.callingFunction= this.callingFunction.bind(this); 
  }
  
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(position=>{
      this.setState({
        latitude:position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
        
      });
      //this.getRouteDirections();//change at 4:04
      
    },
    error=> this.setState({error:error.message}),
    {enableHighAccuracy:true, timeout:20000 , maximumAge: 2000}
    );
   
  }
  //Direction api call 
  async getRouteDirections(placeId, destinationName){
    try{
      const response= await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${placeId}&key=AIzaSyC4EoCw56S4_heCjca6__gqcAPfgzl8mz4`
      );
      const json = await response.json();
      console.log("temp test");
      console.log(json.routes[0]);
     // JSONObject responseObject = (JSONObject) new JSONTokener(response.toString()).nextValue();
                           var responseString = json.status;
                            var routesArray = json.routes;
                            var route = routesArray[0];
                            var legs;
                            var leg;
                            var steps;
                            var dist;
                            var distance;
                            if (route.hasOwnProperty("legs")) {
                                legs = route.legs;
                                leg = legs[0];
                                steps = leg.steps;
                                console.log("legsss:")
                                console.log(legs[0].distance);
                                var distance= legs[0].distance.text;
                                // var nsteps = steps.length;
                                // for (var i = 0; i < nsteps; i++) {
                                //     var step = steps[i];
                                //     if (step.hasOwnProperty("distance")) {
                                //         dist = step.distance;
                                //         if (dist.hasOwnProperty("value"))
                                //             distance = dist.value;
                                //     }
                                // }
                            } else
                                responseString = "not found";
                            console.log(distance)
                            
                            this.setState({distance:distance})
                            
                            

      if(json.routes.length>0){
        const points = PolyLine.decode(json.routes[0].overview_polyline.points);
        const pointCoords = points.map(point=>{
          return{latitude: point[0],longitude: point[1]};
        });
        this.setState({pointCoords,predictions:[] , destination:destinationName, routeResponse:json});        
        Keyboard.dismiss();
        this.map.fitToCoordinates(pointCoords,{
          edgePadding:{top: 20, bottom: 20, left: 20, right: 20}
        });
      }
      return;

    }catch(error){
      console.error(error)
    }
  }


  async onChangeDestination(destination){
    //place api call
    this.setState({destination});
    const apiUrl=`https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}
    &input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000 `;
    
    try{
      const result = await fetch(apiUrl);
      const json= await result.json();
      this.setState({
      predictions: json.predictions
    })
    }catch (err){
      console.error(err);
    }

  }
  /*componentDidMount(){
    this.socket = io("http://192.168.1.4:3000");
    this.socket.on("chat message",msg=>{
      this.setState({chatMessages: [...this.state.chatMessages,msg]})
    })
  }
  submitChatMessage() {
    this.socket.emit("chat message", this.state.chatMessage);
    this.setState({chatMessage: ""});

  }*/
  onValueChange2(value: string){
    this.setState({
      selected2:value
    });
  }
  // onValueDisChange(value: string){
  //   this.setState({
  //     distance:value
  //   })
  // }
  callingFunction(){
    console.log("inside calling function");
   // this.requestDriver= this.requestDriver.bind(this);
   this.requestDriver();

    //this.handlefareCalculation = this.handlefareCalculation.bind(this);
    this.handlefareCalculation();
  }
  async handlefareCalculation(){
      try{
            const {distance}=this.state;
            console.log("handle fare calc distance");
            console.log(distance);
            const result =await axios.post('/auth/fareCalculation',{'distance':distance.toString()});
            //Alert.alert('',result.data.token);//only for debugging showing token
            //this.props.handleChangeToken(result.data.token);
             
        }catch(error){
            this.setState({errorMessage: error.response.data.errorMessage});
            Alert.alert('hello')
            
        }
  }



  async requestDriver(){
    this.setState({lookingForDriver:true});
    const socket = socketIO.connect("http://192.168.0.121:3000");
    socket.on("connect",()=>{
      console.log("client connection");
      
      //request taxi
      socket.emit("taxiRequest",this.state.routeResponse);
      
    });

    socket.on("driverLocation",driverLocation=>{
      const pointCoords=[...this.state.pointCoords,driverLocation];
      this.map.fitToCoordinates(pointCoords,{
        edgePadding:{top:20,bottom:20,left:20,right:20}
      });


      this.setState({lookingForDriver: false , driverIsOnTheWay: true , driverLocation});

    });

  }
  render(){
    let marker =null;
    //let driverButton = null;
    let getDriver=null;
    let findingDriverActIndicator=null;
    let driverMarker = null;
    if(this.state.driverIsOnTheWay){
      driverMarker=(<Marker
       coordinate={this.state.driverLocation} 
      >
        <Image source={require("../images/caricon.png.png")} style={{width:40 , height:40}}/>
      </Marker>
      )
    }

    if(this.state.lookingForDriver){
      findingDriverActIndicator= (
        <ActivityIndicator
          size="large"
          animating={this.state.lookingForDriver}
          color="#00ff00"

         />
      );
    }


    if(this.state.pointCoords.length>1){
      marker=(<Marker coordinate={this.state.pointCoords[this.state.pointCoords.length-1]}/>);
     //change 4:13
      getDriver=(<Container style={styles.formstyle}>
             
              <Content >
                <Form >
                  <Item picker>
                    <Picker
                      mode ="dropdown"
                     // iosIcon={<Icon name="arrow-down"/>}
                      style={{width:30}}
                      placeholder="Select Vehicle Type"
                      placeholderStyle={{color:"#bfc6ea"}}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.selected2}
                      onValueChange={this.onValueChange2.bind(this)}>

                      <Picker.Item label="Suzuki" value="key0" />
                      <Picker.Item label="Open Roof Suzuki" value="key1" />
                      <Picker.Item label="6 Wheeler Truck" value="key2" />
                      <Picker.Item label="Open Roof 6 Wheeler Truck" value="key3" />
                     


                    </Picker>
                  </Item>
                  <Item rounded>
                    <Input placeholder="Enter Luggage Weight"/>
                  </Item>

                </Form>
              </Content>
               <BottomButton onPressFunction={()=>this.callingFunction()} buttonText="REQUEST 🚗">
          {findingDriverActIndicator}
        </BottomButton>
            
            </Container>

       

      );
    }
    const predictions= this.state.predictions.map(prediction=>(
      <TouchableHighlight onPress={()=> this.getRouteDirections(prediction.place_id,prediction.structured_formatting.main_text)} key={prediction.id}>
      <View>
      <Text style={styles.suggestion} >
        {prediction.structured_formatting.main_text}
        </Text>
      </View>
      </TouchableHighlight>

    ));
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
            initialRegion={{
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
          {driverMarker}
          </MapView>
          <TextInput 
            style={styles.destinationinput}
            placeholder="Enter Destination"
            value={this.state.destination}
            onChangeText={destination=>{
              this.setState({destination,pointCoords:[]});
              this.onChangeDestination(destination)}}
            />
            {predictions}
            {getDriver}
            
            
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
  formstyle: {
    //flex:1,
    backgroundColor: "white",
    //marginTop: "auto",
    marginTop: 400,
    marginBottom: 20,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: "center",

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
