    const socket = io()

    socket.on('connect', () => {
        console.log('Socket created ' + socket.id)
    })

$(() =>{

    let $messageForm = $('#message-form');
    let $messageBox = $('#message');
    let $chat = $('#chat');
    let $username = $('#username')
    

    $messageForm.submit((e) =>{
        e.preventDefault();
        socket.emit('send_message', {
            username : $username.val(),
            message : $messageBox.val() 
        })
        $messageBox.val('');
    })

    socket.on('new_message', (data) =>{

        if(data.username == $username.val())
        {
            $chat.append(
                $('<h4>').css({
                    "color":"green",
                    "float" : "right"
                })
                .text(
                    `${data.message}`
                )
            )
            $chat.append($('<br>'))
        }
        else
        {
            $chat.append(
                $('<h4>').css("color","red")
                .text(
                    `${data.username} : ${data.message}`
                )
            )   
        }  
    })
})