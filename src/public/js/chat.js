let user = '';
let email = '';
const chatBox = document.querySelector('#chatBox');
const userNameText = document.querySelector('.userNameText');

const socket = io({
    autoConnect: false
});
document.addEventListener('DOMContentLoaded', () => {

    user = sessionStorage.getItem('user') || '';
    email = sessionStorage.getItem('email') || '';

    if (user == '') {
        Swal.fire({
            title: "Introduce tus datos",
            html:
            '<input id="swal-input1" class="swal2-input" placeholder="Nombre de usuario">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Email">'
            ,
            inputValidator: (value) => {
                return !value && "Necesitas identificarte para poder continuar"
            },
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(result => {
            user = document.querySelector('#swal-input1').value;
            email = document.querySelector('#swal-input2').value;
            sessionStorage.setItem('user', user);
            sessionStorage.setItem('email', email);
            socket.connect();
            socket.emit('userConnected');
            userNameText.textContent = `Tu nombre de usuario: ${user}`;
        })
    } else {
        socket.connect();
        socket.emit('userConnected');
        userNameText.textContent = `Tu nombre de usuario: ${user}`;

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
            socket.emit('message', { user: {id: email, name: user, last_name: "Lavalle", age: 20, alias: "Franacho", avatar: "imagenPerfil.com"}, message: chatBox.value, date: textDate })
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

        if (message.user.name == user) {
            div.classList.add('contUsuario')
        }

        userText.textContent = `${message.user.name}`;
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
            text: "Nuevo usuario en el chat",
            toast: true,
            position: "top-right",
            timer: 5000
        })
    }
})