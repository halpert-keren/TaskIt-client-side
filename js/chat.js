var marge_user_id = '5fecb592690ca7935ccfd762'

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    getAllMessages()
});

function getAllMessages() {
    id = localStorage.getItem('chat_id')
    $.ajax({
        url: `http://127.0.0.1:3000/api/chats/${id}`,
        type: 'GET',
        success: function (chat) {
            console.log(chat);
            displayMessagess(chat);
        }
    });
}

function displayMessagess(chat) {
    other_user_name = localStorage.getItem('other_user_name')
    messageArray = chat['messages']
    $("#dynamic-chat-list").empty();
    $("#dynamic-chat-name-header").empty();
    $("#dynamic-chat-name-header").append('<h2><b>' + other_user_name + '</b></h2>');

    messageArray.forEach(message => {
        end = ''
        if (messageArray[messageArray.length - 1] == message) {
            end = '<div id="end-of-messages"></div>'

        }
        if (message['senderID'] == marge_user_id) {
            message_type1 = 'outgoing_msg'
            message_type2 = 'outgoing'
        }
        else {
            message_type1 = 'incoming_msg'
            message_type2 = 'incoming'
        }
        $("#dynamic-chat-list").append(
            '<div class="' + message_type1 + '">' +
            '<div class="' + message_type2 + '">' +
            '<p>' + message['message'] + '</p>' +
            '<span class="time_date">' + message['timestamp'] + '</span>' +
            '<br></div></div>' + end
        )
    });
}

function sendMessage() {
    user_id = localStorage.getItem('user_id')
    chat_id = localStorage.getItem('chat_id')
    new_message = {
        "senderID": user_id,
        "message": $("#message-to-send").val()
    }
    $.ajax({
        url: `http://127.0.0.1:3000/api/chats/messages/${chat_id}`,
        type: 'POST',
        data: new_message,
        success: function() {
            location.replace("chat.html");
        }
    });
}
