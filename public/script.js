    const socket = io()

    //initialize the socket
    socket.on('connect', () => {
        console.log('Socket created ' + socket.id)
    })

$(() =>{
    let $roomFrom = $('#enter-room');
    let $messageForm = $('#message-form');
    let $messageBox = $('#message');
    let $chat = $('#chat');
    let $username = $('#username')
    let $room = $('#room')
    let $roomHead = $('#room-head')

    $roomFrom.submit((f) =>{
        //to make sure that the default actions do not take place
        f.preventDefault();
        //send the entered username and password  to the server
        socket.emit('enter_room', {
            username : $username.val(),
            room : $room.val()
        })
        //clear the message box
        $username.prop("disabled", "true")
        
        })

    

    //actions taking place when the message form is submitted
    $messageForm.submit((e) =>{
        //to make sure that the default actions do not take place
        e.preventDefault();
        //send the entered username and password  to the server
        socket.emit('send_message', {
            message : $messageBox.val(),
        })
        //clear the message box
        $messageBox.val('')
        
    })
    
    socket.on('new_message', (data) =>{
        //when the server send the message to be displayed
        if(data.username == $username.val())
        {   
            
            //if the message is sent by you it goes to the right side of the screen
            $chat.append(
                $('<div>').addClass("container").append(
                    $('<div>').addClass("row").append(
                        $('<div>').addClass("col").append(
                            $('<h4>').css({
                            "float" : "right",
                            "color": "cyan"
                            })
                            .text(
                                `${data.message}`
                            )
                        )
                    )
                )
            )
        }
        else
        {
            //if the message is not sent by you it goes to the left side of the screen
            $chat.append(
                $('<div>').addClass("container").append(
                    $('<div>').addClass("row").append(
                        $('<div>').addClass("col").append(
                            $('<h4>').css("color","palegreen")
                            .text(
                                `${data.username} : ${data.message}`
                            )
                        )
                    )
                )        
            )  
        }  
        }
    )

    socket.on('updatechat', (data) => {
        $chat.append(
            $chat.append(
                $('<div>').addClass("container").append(
                    $('<div>').addClass("row").append(
                        $('<div>').addClass("col").append(
                            $('<h5>').css({
                                "background-color" : "white",
                            })
                            .text(
                                    `${data.username} has entered the room`
                            )
                            )
                        )
                    )        
                )  
            ) 
            }
        )

    socket.on('updatemychat', (data) => {

        if($room.prop("disabled")== false)
            {
                $roomHead.append(
                    $('<h2>').css("text-align", "center").text(
                    `Room ${data.room}`
                    )
                    )
            $room.prop("disabled", "true")
            }


        $chat.append(
            $chat.append(
                $('<div>').addClass("container").append(
                    $('<div>').addClass("row").append(
                        $('<div>').addClass("col").append(
                            $('<h5>').css({
                                "background-color" : "white",
                            })
                            .text(
                                    `You have entered room ${data.room}`
                            )
                            )
                        )
                    )        
                )  
            ) 
            }
        )    
    })
    

