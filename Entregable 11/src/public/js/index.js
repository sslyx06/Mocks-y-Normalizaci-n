const socket = io();

socket.on('lista',data=>{
    let log = document.getElementById('lista');
    let messages = "";
    Array.from(data).forEach(message => {
       messages = messages+`
        <tr>
            <td>${message.title}</td>
            <td>${message.prices}</td>
            <td> <img src="${message.thumbnail}" alt="El enlace no esta disponible" width="60"></td>
        </tr>`
    });
    log.innerHTML = messages;
})


///CHAT 


let username;
const chatBox = document.getElementById('chatBox')
Swal.fire({
    title: "Registrate",
    html: `<input type="text" id="id" class="swal2-input" placeholder="Gmail">
    <input type="text" id="firts_name" class="swal2-input" placeholder="Nombre">
    <input type="text" id="last_name" class="swal2-input" placeholder="Apellido">
    <input type="number" id="age" class="swal2-input" placeholder="Edad">
    <input type="text" id="alias" class="swal2-input" placeholder="Alias">
    <input type="text" id="avatar" class="swal2-input" placeholder="Avatar(URL)">`,
    inputValidator: (value)=>{
        return !value && "Necesitas identificarte para poder continuar >:c"
    },
    allowOutsideClick:false,
    allowEscapeKey:false,
    preConfirm: () => {

        const id = document.getElementById('id').value
        const firts_name = document.getElementById('firts_name').value
        const last_name = document.getElementById('last_name').value
        const age = document.getElementById('age').value
        const alias = document.getElementById('alias').value
        const avatar = document.getElementById('avatar').value
        if (!id || !firts_name|| !last_name|| !age|| !alias || !avatar) {
            Swal.showValidationMessage(`Rellena todos los campos para continuar >:c`)}
          }
}).then(result=>{
    username = [{
        id: document.getElementById('id').value, 
        nombre: document.getElementById('firts_name').value, 
        apellido: document.getElementById('last_name').value, 
        edad: document.getElementById('age').value, 
        alias: document.getElementById('alias').value,
        avatar: document.getElementById('avatar').value
    }]

}
    
)

//Liseners

chatBox.addEventListener('keyup',evt=>{
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0){
            socket.emit('message',{author:username,text:chatBox.value})
            chatBox.value="";

        }
        document.getElementById("Enter").click();
    }
})
chatBox.addEventListener('submit',evt=>{

        if(chatBox.value.trim().length>0){
            socket.emit('message',{author:username,text:chatBox.value})
            chatBox.value="";
        }
    
})

//Listeners

socket.on('log',data=>{
    let log = document.getElementById('log');
    let messages = "";
    Array.from(data).forEach(message => {
       messages = messages+`<h6><b>${message.author[0].id}</b><h7>  ${message.fecha}: </h7></h6><h8>${message.text}</h8></br>`
    });
    log.innerHTML = messages;
})

