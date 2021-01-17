import React, {Component} from 'react';
import{View , Text , StyleSheet,Dimensions,TextInput, Button, KeyboardAvoidingView, Alert, Keyboard} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import {TapGestureHandler , State} from 'react-native-gesture-handler';
import Home from './Home';
import Index from './login';
import Svg,{Image,Circle,ClipPath} from 'react-native-svg';
import axios from 'axios';
import baseUrl, { italics } from '../baseUrl';


axios.defaults.baseURL=baseUrl;
const {width , height}=Dimensions.get('window')
const {Value,event, block,cond,eq,set,Clock,startClock,stopClock,debug,timing,clockRunning,interpolate,Extrapolate,concat}=Animated



const validEmailRegex = RegExp(
	/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateForm = errors => {
	let valid = true;
	Object.values(errors).forEach(val => val.length > 0 && (valid = false));
	return valid;
};


export default class Register extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isIndex:false,
            fname:null,
            lname:'',
            password:'',
            cpassword:' ',
            email:null,
            pnumber:'',
          //  errors: {
			//	fname: "",
			//	email: "",
			//	password: ""
			//}
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSignUp=this.handleSignUp.bind(this);
 
        
    }
    handleChange(name,value){
      //  switch(name){
        //    case "email":
          //      errors.email=validEmailRegex.test(value)? "" :"Email is not valid!";
            //    break;
           // case "password":
             //   errors.password=value.length< 8 ? "Password must be 8 characters long" : "";
               // break;
           // default:
             //   break


        //}
        
        this.setState({
          //  errors,
            [name]:value
        });
    };
    
    async handleSignUp(){
        try{
            const {cpassword ,email,fname,lname,password,pnumber}=this.state;
            console.log(cpassword,email)
            if(cpassword!==password){
                Alert.alert('Password is not same as confirm password ');
               
            }
            else if(!validEmailRegex.test(email)){
                Alert.alert('email invalid type ');
            }
            else if (fname==null){
                
                Alert.alert('Please enter first name ');
            }else{
                Alert.alert(fname);
                const result =await axios.post('/auth/signup',{email ,fname,lname, password});
                console.log(result)

                Alert.alert('User Created Successf')
            }
            Keyboard.dismiss();
    
           // const result =await axios.post('/auth/login',{email , password});
            //Alert.alert('',result.data.token);//only for debugging showing token
            //this.props.handleChangeToken(result.data.token);
             
        }catch(error){
          //  this.setState({errorMessage: error.response.data.errorMessage});
          //  Alert.alert('hello')
          console.log(error)
            
        }
    }
 
  
  render(){
      if(this.state.isIndex){
          return<Index/>
      }
   return (
    
    
    <View style={{flex:1 , backgroundColor:'white',justifyContent:'flex-end'}}>
                  
        <TextInput
            textAlign={'center'}
            /*backgroundColor='white'*/
            placeholder="First Name"
            style={styles.textInput}
            placeholderTextColor='black'
            onChangeText={(value)=>this.setState({fname:value})}
            
        />
        <TextInput
            textAlign={'center'}
            /*backgroundColor='white'*/
            placeholder="Last Name"
            style={styles.textInput}
            placeholderTextColor='black'
            onChangeText={(value)=>this.setState({lname:value})}
        />
        <TextInput
            textAlign={'center'}
            /*backgroundColor='white'*/
            placeholder="Email"
            style={styles.textInput}
            placeholderTextColor='black'
            keyboardType='email-address'
            onChangeText={(value)=>this.setState({email:value})}
        />
        <TextInput
            textAlign={'center'}
            /*backgroundColor='white'*/
            secureTextEntry={true}
            placeholder="Password"
            style={styles.textInput}
            placeholderTextColor='black'    
            onChangeText={(value)=>this.setState({password:value})}
        />
        <TextInput
            textAlign={'center'}
            /*backgroundColor='white'*/
            secureTextEntry={true}
            placeholder="Confirm Password"
            style={styles.textInput}
            placeholderTextColor='black'    
            onChangeText={(value)=>this.setState({cpassword:value})}
        />
        <TextInput
            textAlign={'center'}
            /*backgroundColor='white'*/
           
            placeholder="Phone Number"
            style={styles.textInput}
            placeholderTextColor='black'    
            onChangeText={(value)=>this.setState({pnumber:value})}
        />
        <Animated.View style={styles.button}>
           <Button onPress={this.handleSignUp}title='Create User'> </Button>
        </Animated.View>
        <Animated.View style={styles.button}>
           <Button onPress={()=>this.setState({isIndex:true})}title='Back'> </Button>
        </Animated.View>

      
        </View>
      
        
    );
  }
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
        backgroundColor: 'white',
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        top: -100,
        left: width/2 - 20

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