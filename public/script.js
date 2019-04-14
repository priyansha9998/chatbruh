const socket = io()

//initialize the socket
socket.on('connect', () => {
    console.log('Socket created ' + socket.id)
})

$(() =>{
let $signupForm = $('#signup')
let $roomFrom = $('#enter-room')
let $messageForm = $('#message-form')
let $messageBox = $('#message')
let $chat = $('#chat')
let $username = $('#username')
let $room = $('#room')
let $roomHead = $('#room-head')

function showsignup() {
    $signupForm.css("display","block")
    $('#login-sure').css("display","block")
}

function hidesignup() {
    $signupForm.css("display","none")
    $('#login-sure').css("display","none")
}

function showlogin() {
    $roomFrom.css("display","block")
    $room.prop("disable","false")
    $username.prop("disable","false")
    $('#userPass').prop("disable","false")

}

function hidelogin() {
    $roomFrom.css("display","none")
    $room.prop("disable","true")
    $username.prop("disable","true")
    $('#userPass').prop("disable","true")

}

function showchat() {
    $chat.css("display","block")
    $messageForm.css("display","block")
}

function hidechat() {
    $chat.css("display","none")
    $messageForm.css("display","none")
}

$('#loginb').click(()=> {
    showlogin()
    hidesignup()
})

$signupForm.submit((g) =>{
    g.preventDefault();

    if($('#firstName').val() == ""){
        alert('Please enter a valid firstName')
    }
    if($('#lastName').val() == ""){
        alert('Please enter a valid lastName')
    }
    if($('#usernames').val() == ""){
        alert('Please enter a valid username')
    }
    if($('#password').val() == ""){
        alert('Please enter a Password')
    }
    else {
        socket.emit('new_signup', {
            username : $('#usernames').val(),
             firstName : $('#firstName').val(),
             lastName : $('#lastName').val(),
             password : $('#password').val(),
        })

        
    }    
})


$roomFrom.submit((f) =>{
    //to make sure that the default actions do not take place
    f.preventDefault();
    //send the entered username and password  to the server
    socket.emit('enter_room', {
        username : $username.val(),
        password : $('#userPass').val(),
        room : $room.val()
    })
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

socket.on('nouser', (data) => {
    alert(`User ${data.username} does not exist`)
})

socket.on('inpassword', (data) =>{
    alert(`Please type in the correct password to enter ${data.room}`)
})

socket.on('login',(data) => {
    alert(`Welcome ${data.username}`)
    showchat()
    hidelogin()
})

socket.on('new_message', (data) =>{

    $chat.scrollTop($chat[0].scrollHeight);
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

socket.on('signup_done',(data)  =>{
    alert(`${data.username} has successfully Signed Up `)
    hidesignup()
    showlogin()

})   


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
        $room.css("display","none")
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


