import React, { Component } from 'react'
import { Text, StyleSheet, View, TextInput,TouchableOpacity} from 'react-native'
import Animated from 'react-native-reanimated';


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

export default class LoginForm extends Component {
    constructor(){
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

    }
    render() {
        return (
            <View>
                <Animated.View style={{zIndex:this.texInputZindex,opacity:this.textInputOpacity,transform:[{translateY:this.textInputY}],height:height/3,...StyleSheet.absoluteFill,top:null,justifyContent:'center',backgroundColor:'white'}}>    
                    <TextInput style={styles.textInput}
                        placeholder='xyz@gmail.com'
                        keyboardType='email-address'
                        autoCorrect={false}
                        placeholderTextColor='#FFF'
                        value={this.props.email}
                        onChangeText={email=>this.props.handleChange('email',email)}
                    />
                    <TextInput style={styles.input} 
                        autoCorrect={false}
                        secureTextEntry 
                        placeholder='Password'
                        placeholderTextColor='#FFF'
                        value={this.props.password}
                        onChangeText={pw=>this.props.handleChange('password',pw)}
                    />
                    <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Sign In</Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.handleSignIn} style={styles.button}>
                    <Text style={styles.buttonText}>Create Account</Text>

                    </TouchableOpacity>
                </Animated.View>    

            </View>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        height:40,
        padding:10,
        backgroundColor:'#8793A6',
        color:'#FFF',
        marginBottom:10
    },
    button:{
        backgroundColor:'#ABC837',
        paddingVertical:20,
        marginVertical:10,
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

    },
    buttonText:{
        textAlign:'center',
        fontSize:23,
        color:'#000',
        fontWeight: '200'
    }
});
