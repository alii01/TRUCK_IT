import React, {Component} from 'react';
import{View , Text , StyleSheet,Dimensions,TextInput, Button, KeyboardAvoidingView} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import {TapGestureHandler , State} from 'react-native-gesture-handler';
import Home from './Home';
import Register from './Register'
import Svg,{Image,Circle,ClipPath} from 'react-native-svg';
const {width , height}=Dimensions.get('window')
const {Value,event, block,cond,eq,set,Clock,startClock,stopClock,debug,timing,clockRunning,interpolate,Extrapolate,concat}=Animated


export default class loginform extends Component{

    render(){
        return(
            <View>
                <TextInput
                                textAlign={'center'}
                                /*backgroundColor='white'*/
                                placeholder="Email"
                                keyboardType='email-address'
                                style={styles.textInput}
                                placeholderTextColor='black'
                                value={this.props.email}
                                onChangeText={(email)=>this.props.han}
                                

                            />
                            <TextInput
                                textAlign={'center'}
                                /*backgroundColor='white'*/
                                secureTextEntry={true}
                                placeholder="Password"
                                style={styles.textInput}
                                placeholderTextColor='black'
                                value={this.props.password}
                                
                                
                            />
                            <Animated.View style={styles.button}>
                                <Button onPress={()=>this.setState({isDriver:true})}title='SIGN IN'> </Button>
                            </Animated.View>


            </View>

        );
    }


}
const styles=StyleSheet.create({
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
    textInput:{
        height:50,
        borderRadius:25,
        borderWidth:0.5,
        marginHorizontal:20,
        paddingLeft:10,
        marginVertical:5,
        borderColor:'rgba(0,0,0,0.2)',
        
        
    }
});