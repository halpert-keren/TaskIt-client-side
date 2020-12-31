var marge_user_id = '5fecb592690ca7935ccfd762'

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    getAllUserChats()
});

function getAllUserChats() {
    $.ajax({
        url: `http://127.0.0.1:3000/api/messages`,
        type: 'GET',
        success: function (messages) {
            console.log(messages);
            displayChats(messages);
        }
    });
}

function displayChats(messages) {
    $("#dynamic-message-list").empty();
    messages.forEach(message => {
        $('#dynamic-message-list').append(
            '<tr>' +
            '<th><h5>'+ message +'</h5></th>' +
            '<td><button type="button" class="view" title="View Details" data-toggle="tooltip" onclick="goToConversation(\''+ message._id +'\')">'+
            '<i class="material-icons">&#xE5C8;</i></button></td>' +
            '</tr>'
        );
    });
}

function goToConversation(message_id) {
    localStorage.clear();
    localStorage.setItem('chat_id', message_id);
    location.replace("chat.html");
}