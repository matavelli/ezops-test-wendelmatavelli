const socket = io();
socket.on('message', addMessages);

$(() => {

    socket.on('user-ok', (list) => {
        $('#div_input_name').hide();
        $('.div_chat_page').show();

        userList = list;
        getMessages();
        scrollDownChat();
        renderUserList(list);
    });

    $('#confirmar_nome').click(() => {
        if ($.trim($('#input_name').val()) != '') {
            $('#name').val($('#input_name').val());

            socket.emit('join-request', $('#name').val());
            getMessages();
            scrollDownChat();
        } else {
            alert('Insira seu nome antes de continuar.');
        }
    });

    $('#enviar_msg').click(() => {
        if ($.trim($('#message').val()) != '') {
            sendMessage({ name: $('#name').val(), message: $('#message').val() });
            scrollDownChat();
            $('#message').val('');
        }
    });

    $('#message').keyup((e) => {
        if (e.keyCode == 13) {
            if ($.trim($('#message').val()) != '') {
                sendMessage({ name: $('#name').val(), message: $('#message').val() });
                scrollDownChat();
                $('#message').val('');
            }
        }
    });
});

socket.on('list-update', (data) => {
    userList = data.list;
    renderUserList(data);
});

function renderUserList(typeUpdate) {
    if (typeUpdate.joined) {
            $('#messages').append(`<h4> ${typeUpdate.joined} entrou na sala! </h4>`);
    } else {
            $('#messages').append(`<h4> ${typeUpdate.left} saiu na sala! </h4>`);
    }

    scrollDownChat();
}

function addMessages(data) {
    $('#messages').append(`<h4> ${data.name} </h4> <p> ${data.message} </p>`);
}

function getMessages() {
    $.get('/messages', (data) => {
        data.forEach(addMessages);
    });
}

function sendMessage(message) {
    $.post('/messages', message)
}

function scrollDownChat() {
    let $target = $('#div_chat_page');
    $target.animate({
        scrollTop: $target.height()
    }, 1000);
}