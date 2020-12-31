var marge_user_id = '5fecb592690ca7935ccfd762'

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    // getAllMessages()
});

function getAllMessages() {
    id = localStorage.getItem('chat_id')
    $.ajax({
        url: `http://127.0.0.1:3000/api/messages/${id}`,
        type: 'GET',
        success: function (chat) {
            console.log(chat);
            displayMessagess(chat);
        }
    });
}

function displayMessagess(chat) {
    messageArray = chat['messages']
    $("#dynamic-chat-list").empty();
    $("#dynamic-chat-name-header").empty();
    $("#dynamic-chat-name-header").append('<h2><b>' + 'OTHER USER NAME' + '</b></h2>');

    messageArray.forEach(message => {
        if (message['senderID'] == marge_user_id)
                message_type = 'outgoing_msg'
            else
                message_type = 'incoming_msg'
            $("#dynamic-chat-list").append(
                '<div class="' + message_type + '">' +
                '<p>' + message['message'] + '</p>' +
                '<span class="time_date">' + message['timestamp'] + '</span>' +
                '</div>'
            )
    });
}
