import React from 'react'
import whatsapp from '../../Image/whatsapp.png'
import {Button} from '@mui/material'
import {auth,provider} from '../../firebase'
import { signInWithPopup } from 'firebase/auth'
import {useStateValue} from '../ContextApi/StateProvider'
import {actionType} from '../ContextApi/reducer'
import './login.css'

const Login = () => {

const [state,dispatch]=useStateValue();
console.log(state);
const signIn =()=>{
    signInWithPopup(auth,provider)

    .then((result)=>{
        dispatch({
            type:actionType.SET_USER,
            user:result.user,
        })
        console.log(result);
    }).catch((err)=>{
        alert(err.message)
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