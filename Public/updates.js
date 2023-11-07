import axios from 'axios'
import { showAlert } from './alerts';

export const updateUserData=async(data)=>{
    try{
    const res=await axios({
        method:'PATCH',
        url:'http://127.0.0.1:4000/api/v1/users/updateMe',
        data
       
    })
    if(res.data.status==='success'){
        showAlert('green','Logged in')
    }
}
catch(err){
  showAlert('red',err.response.data.message)
}
}
export const updatePassword=async(currentPassword,password,passwordConfirm)=>{
    try{
    const res=await axios({
        method:'PATCH',
        url:'http://127.0.0.1:4000/api/v1/users/changePassword',
        data:{
            currentPassword,password,passwordConfirm
        }
       
    })
    if(res.data.status==='success'){
        showAlert('green','Logged in')
    }
}
catch(err){
  showAlert('red',err.response.data.message)
}
}