import axios from 'axios'
import { showAlert } from './alerts';
export const login=async(email,password)=>{
    try{
        const res=await axios({
    method:'POST',
    url:'http://127.0.0.1:4000/api/v1/users/login',
    data:{
        email,
        password
    }

    });
    if(res.data.status==='success'){
        showAlert('green','Logged in')
        window.setTimeout(()=>{
            location.assign('/')
        },1500)
    }
}
    
    catch(err){
        showAlert('red',err.response.data.message)
    }

}
export const logout=async()=>{
    try{
    const res=await axios({
        method:'GET',
        url:'http://127.0.0.1:4000/api/v1/users/logout'
      })
      if(res.data.status==='success'){
        location.reload(true)
      }
    }
    catch(err){
        showAlert('red','Error loging out!')
    }
}
export const signUp=async(name,email,password,passwordConfirm)=>{
    try{
        const res=await axios({
    method:'POST',
    url:'http://127.0.0.1:4000/api/v1/users/signup',
    data:{
        name,
        email,
        password,
        passwordConfirm
    }

    });
    if(res.data.status==='success'){
        showAlert('green','Logged in')
        window.setTimeout(()=>{
            location.assign('/')
        },1500)
    }
}
    
    catch(err){
        showAlert('red',err.response.data.message)
    }

}