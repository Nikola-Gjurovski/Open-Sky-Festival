const cards=document.querySelectorAll('.cards')
cards.forEach(card => {
    const cardId=card.getAttribute('data-card-id');
   
    card.addEventListener('mouseover',()=>{
        //console.log(cardId)
        const img= document.getElementById(`img${cardId}`)
        img.style.opacity=0.3;
          //img.style.display='none'
        const info= document.getElementById(`info${cardId}`)
        info.style.display="flex";
       info.style.opacity=1
    })
    card.addEventListener('mouseout',()=>{
        document.getElementById(`img${cardId}`).style.display='block'
        document.getElementById(`img${cardId}`).style.opacity=1
        document.getElementById(`info${cardId}`).style.opacity=0
        document.getElementById(`info${cardId}`).style.display="none";
    })
});
