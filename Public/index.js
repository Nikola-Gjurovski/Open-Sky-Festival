import{ login,logout,signUp } from './login'
import { updateUserData,updatePassword } from './updates';

import '@babel/polyfill'

const loginForm=document.querySelector('.main-block');
const signupForm=document.querySelector('.main-block2');
const logoutForm=document.querySelector('#logout');
const formUpdate=document.getElementById('form101');
const formUpdate2=document.getElementById('form102');
if(loginForm){
document.querySelector('.main-block').addEventListener('submit',e=>{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    login(email,password);

})
}
if(logoutForm){
    document.querySelector('#logout').addEventListener('click',logout)
}
if(formUpdate){
    formUpdate.addEventListener('submit',(e)=>{
        e.preventDefault();
        const form=new FormData();
        form.append('name',document.getElementById('textt').value);
        form.append('email',document.getElementById('emaill').value);
        form.append('photo',document.getElementById('photo-user').files[0])
        console.log(document.getElementById('photo-user').files[0]);
        updateUserData(form)
        document.getElementById('textt').value="";
        document.getElementById('emaill').value=""

    })
}
if(formUpdate2){
    formUpdate2.addEventListener('submit',async (e)=>{
        e.preventDefault();
        const currentPassword=document.getElementById('cp').value;
        const password=document.getElementById('np').value;
        const passwordConfirm=document.getElementById('cnp').value;
        console.log(currentPassword,password,passwordConfirm)
       await updatePassword(currentPassword,password,passwordConfirm)
        document.getElementById('cp').value="";
        document.getElementById('np').value=""
        document.getElementById('cnp').value=""

    })
}
if(signupForm){
    document.querySelector('.main-block2').addEventListener('submit',e=>{
        e.preventDefault();
        const name=document.getElementById('name2').value;
        const email=document.getElementById('email2').value;
        const password=document.getElementById('password2').value;
        const passwordConfirm=document.getElementById('confirmpassword2').value;
        signUp(name,email,password,passwordConfirm);
    })
}