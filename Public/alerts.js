export const hideAlert=()=>{
    const el=document.querySelector('#here-success');
    if(el){
        document.getElementById('data-loaded').innerHTML="";
    }
}
export const showAlert=(type,msg)=>{
    hideAlert();
    const print=`<div id="here-success" class="${type}">
       <h2>${msg}</h2>
      </div>`
      document.getElementById('data-loaded').innerHTML=print;
      window.setTimeout(hideAlert,5000);
}