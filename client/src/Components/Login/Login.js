import React, { useState } from 'react'
import whatsapp from '../../Image/whatsapp.png'
import {Button} from '@mui/material'
import {auth,provider} from '../../firebase'
import {onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import {useStateValue} from '../ContextApi/StateProvider'
import {actionType} from '../ContextApi/reducer'
import './login.css'




const Login = () => {

const [dispatch]=useStateValue();

// console.log(state);

const [user,setUser]=useState(null)

// console.log(user);
const signIn =()=>{
    signInWithPopup(auth,provider)
    .then((result)=>{
        setUser(result.user)
        dispatch({
            type:actionType.SET_USER,
            user:user,
        })
    })
    .catch((err)=>{
        console.log(err)
    })


}

  return (
    <div className='login'>
        
        <div className='login-container'>
    
        <img src={whatsapp} alt='whatsapp-logo'></img>
        
            <div>
            <Button onClick={signIn}>Sign-In with Google</Button>
            </div>
        </div>

    </div>
  )
}

export default Login