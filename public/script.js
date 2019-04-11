    const socket = io()

    socket.on('connect', () => {
        console.log('Socket created ' + socket.id)
    })

$(() =>{

    let $messageForm = $('#message-form');
    let $messageBox = $('#message');
    let $chat = $('#chat');
    

    $messageForm.submit((e) =>{
        e.preventDefault();
        socket.emit('send_message', data)
        $messageBox.val('');
    })

    socket.on('new_message', (data) =>{
        $chat.append(
            $('<h6>').text(
                `${data}`
            )
        )
    })


})