import React, { Component } from 'react'
import { Text, StyleSheet,Dimensions, View,Platform ,Alert,TextInput,Button,KeyboardAvoidingView} from 'react-native'
import Animated, { Easing } from 'react-native-reanimated';
import {TapGestureHandler , State} from 'react-native-gesture-handler';
import Svg,{Image,Circle,ClipPath} from 'react-native-svg';
import Home from './Home';
import Register from './Register';
import LoginForm from '../components/LoginForm';
import axios from 'axios';
import baseUrl, { italics } from '../baseUrl';

axios.defaults.baseURL=baseUrl;

const {width , height}=Dimensions.get('window')
const {Value,event, block,cond,eq,set,Clock,startClock,stopClock,debug,timing,clockRunning,interpolate,Extrapolate,concat}=Animated

function runTiming(clock,value,dest){

    
    const state={
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0),

    };
    const config={
        duration: 1000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease),
    };
    return block([
        cond(clockRunning(clock),0,[
            set(state.finished,0),
            set(state.time,0),
            set(state.position, value),
            set(state.frameTime,0),
            set(config.toValue,dest),
            startClock(clock),
        ]),
        timing(clock,state,config),
        cond(state.finished,debug('stop clock',stopClock(clock))),
        state.position,
    ]);
}


export default class login extends Component {



    constructor(props){
        super(props);
        this.state={
            isdriver:false,
            email:'',
            password:'',
            errorMessage:'',
            isPass:false //changes on 1/16/2021 2 pm
        };
        this.buttonOpacity = new Value(1)
        this.onStateChange= event([
            {
                nativeEvent:({state})=>block([cond(eq(state,State.END),set(this.buttonOpacity,runTiming(new Clock(),1,0)))])
            }
        ]);
        this.onCloseState= event([
            {
                nativeEvent:({state})=>block([cond(eq(state,State.END),set(this.buttonOpacity,runTiming(new Clock(),0,1)))])
            }
        ]);

        this.buttonY =interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[100,0],
            extrapolate: Extrapolate.CLAMP
        });
        this.bgY=interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[-height/3 - 50,0],
            extrapolate:Extrapolate.CLAMP
        });
        this.texInputZindex=interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[1,-1],
            extrapolate:Extrapolate.CLAMP
        });  
        this.textInputY=interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[0,100],
            extrapolate:Extrapolate.CLAMP
        });  
        this.textInputOpacity=interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[1,0],
            extrapolate:Extrapolate.CLAMP
        });
        this.rotateCross=interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[180,360],
            extrapolate:Extrapolate.CLAMP
        });



        this.handleChange=this.handleChange.bind(this);
        this.handleSignIn=this.handleSignIn.bind(this);
    }
    handleChange(name,value){
        this.setState({
            [name]:value
        });
    }
    async handleSignIn(){
        try{
            const {email , password}=this.state;
            const result =await axios.post('/auth/login',{email , password});
            Alert.alert('',result.data.token);//only for debugging showing token
            this.props.handleChangeToken(result.data.token);
             
        }catch(error){
            this.setState({errorMessage: error.response.data.errorMessage});
            Alert.alert('hello')
            
        }
    }

    render() {
        if(this.state.isdriver){
            return<Home/>;
        }
        if(this.state.isPass==true){//changes on 1/16/2021 2 pm
           return <Register></Register>
        }
        return (
            <View style={{flex:1 , backgroundColor:'white',justifyContent:'flex-end'}}>
                <Animated.View style={{...StyleSheet.absoluteFill,transform:[{translateY:this.bgY}]}}>
                    <Svg height={height + 50} width={width}>
                    
                       <ClipPath id='clip'>
                           <Circle r={height + 50} cx={width/2}/>
                       </ClipPath>
                        <Image 
                            href={require('../assets/bg.jpg')}
                            width={width}
                            height={height + 50}
                            preserveAspectRatio='xMidyMid slice'
                            clipPath="url(#clip)"
                            
                        />
                        
                    </Svg> 
                </Animated.View>
                <View style={{height:height/3}}>
                <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                    <Animated.View style={{...styles.button,opacity:this.buttonOpacity,transform:[{translateY:this.buttonY}]}}>
                        <Text style={{fontSize:20 , fontWeight:'bold'}}>Login </Text>
                    </Animated.View>
                </TapGestureHandler>
                <TapGestureHandler onHandlerStateChange={()=>this.setState({isPass:true})}>
                    <Animated.View style={{...styles.button,opacity:this.buttonOpacity,transform:[{translateY:this.buttonY}]}}>
                        <Text style={{fontSize:20 , fontWeight:'bold'}}>Sign Up</Text>
                    </Animated.View>
                
                </TapGestureHandler>
                    <Animated.View style={{zIndex:this.textInputZindex,opacity:this.textInputOpacity,transform:[{translateY:this.textInputY}],height:height/3,...StyleSheet.absoluteFill,top:null,justifyContent:'center',backgroundColor:'white',borderTopLeftRadius:40,borderTopRightRadius:40}} >
                            
                        <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                            <Animated.View style={styles.closeButton}>
                                <Animated.Text style={{fontSize:15,transform:[{rotate:concat(this.rotateCross,'deg')}]}}>
                                X
                                </Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>

                          <TextInput
                                style={styles.textInput}
                               placeholder='xyz@gmail.com'
                                keyboardType='email-address'
                                autoCorrect={false}
                                placeholderTextColor='black'
                                /*value={this.props.email}*/
                                onChangeText={(value)=>this.setState({email:value})}
                                /*email={this.state.email}*/
                            />
                            <TextInput
                                style={styles.textInput}
                               autoCorrect={false}
                                 secureTextEntry 
                                 placeholder='Password'
                                 placeholderTextColor='black'
                                  /*value={this.props.password}*/
                                  onChangeText={(value)=>this.setState({password:value})}
                                 /* password={this.state.password}*/
                                />
                            <Animated.View style={styles.button}>
                                <Button onPress={this.handleSignIn}title='SIGN IN'> </Button>
                            </Animated.View>
                    </Animated.View>
                    <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>

                </View>

                                  
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    errorMessage:{
        marginHorizontal:10,
        fontSize:18,
        color:'red',
        fontWeight:'bold'
    },
    headerText:{
        fontSize:44,
        color:'#C1D76D',
        textAlign:'center',
        fontFamily:Platform.OS==='android'?'sans-serif-light':undefined,
        marginTop: 30,
        fontWeight: '200'
    },
    button:{
        backgroundColor: 'white',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowOffset:{width:40,height:40},
        shadowColor:'black',
        shadowOpacity: 0.2
    },
    closeButton:{
        height:40,
        width:40,
        backgroundColor:'white',
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        top:-20,
        left: width/2 -20,
        shadowOffset:{width:2 , height:2},
        shadowColor:'black',
        shadowOpacity:0.2

    },
    textInput:{
        height:50,
        borderRadius:25,
        borderWidth:0.5,
        marginHorizontal:20,
        paddingLeft:10,
        marginVertical:5,
        borderColor:'rgba(0,0,0,0.2)',
        
        
    }
})
