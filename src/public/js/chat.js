let user = '';
const chatBox = document.querySelector('#chatBox');
const userNameText = document.querySelector('.userNameText');

const socket = io({
    autoConnect: false
});
document.addEventListener('DOMContentLoaded',() => {

    user = sessionStorage.getItem('user') || '';

    if (user == '') {
        Swal.fire({
            title: "Introduce tu usuario",
            input: "text",
            text: "Ingresa el usuario con el que te identificarás en el chat",
            inputValidator: (value) => {
                return !value && "Necesitas identificarte para poder continuar"
            },
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(result => {
            user = result.value;
            sessionStorage.setItem('user', user);
            userNameText.textContent = `Tu nombre de usuario: ${user}`
            socket.connect();
            socket.emit('userConnected');
        })
    } else {
        userNameText.textContent = `Tu nombre de usuario: ${user}`;
        socket.connect();
        socket.emit('userConnected');
    }
})

chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            let dateNow = new Date();
            let day = dateNow.getDate();
            let month = dateNow.getMonth();
            let year = dateNow.getFullYear();
            let hour = dateNow.getHours();
            let minute = dateNow.getMinutes();
            let second = dateNow.getSeconds();
            
            let textDate = `${day}/${month + 1}/${year} a las ${hour}:${minute}:${second}`;
            socket.emit('message', { user, message: chatBox.value, date: textDate })
            chatBox.value = "";
        }
    }
})

socket.on('log', data => {
    const log = document.querySelector('#log');

    log.textContent = '';

    data.forEach(message => {
        const userText = document.createElement('h4');
        const userMessage = document.createElement('p');
        const dateText = document.createElement('small');
        const textContainer = document.createElement('div');
        const div = document.createElement('div');

        if (message.user == user) {
            div.classList.add('contUsuario')
        }

        userText.textContent = `${message.user}`;
        userMessage.textContent = `${message.message}`;
        dateText.textContent = `${message.date}`

        textContainer.append(userText);
        textContainer.append(userMessage);
        textContainer.append(dateText);
        div.append(textContainer);
        log.append(div);
    })
})

socket.on('newUser', data => {
    if (user) {
        Swal.fire({
            text:"Nuevo usuario en el chat",
            toast:true,
            position:"top-right",
            timer: 5000
        })
    }
})