$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    getAllUserChats()
    listeners()
});

function getAllUserChats() {
    user_id = localStorage.getItem('user_id')
    $.ajax({
        url: `https://task--it.herokuapp.com/api/chats/?userID=${user_id}`,
        type: 'GET',
        success: function (chats) {
            displayChats(chats);
        }
    });
}

function displayChats(chats) {
    user_name = localStorage.getItem('user_name')
    user_id = localStorage.getItem('user_id')
    other_user_names = ''
    userID = ''
    $("#dynamic-message-list").empty();
    chats.forEach(chat => {
        if (chat['userID1'] == user_id)
            userID = 'userID2'
        else
            userID = 'userID2'
        $.ajax({
            url: `https://task--it.herokuapp.com/api/users/${chat[userID]}`,
            type: 'GET',
            success: function (user) {
                other_user_names = (user['firstName'] + ' ' + user['lastName'])
            }
        }).then(() => {
            $('#dynamic-message-list').append(
                '<tr>' +
                '<th><h5>' + other_user_names + '</h5></th>' +
                '<td><button type="button" class="view" title="View Details" data-toggle="tooltip" onclick="goToConversation(\'' + chat._id + '\', \'' + other_user_names + '\')">' +
                '<i class="material-icons">&#xE5C8;</i></button></td>' +
                '</tr>'
            );
        })
    })
}

function goToConversation(chat_id, other_user_name) {
    localStorage.setItem('chat_id', chat_id);
    localStorage.setItem('other_user_name', other_user_name);
    location.replace("chat.html#end-of-messages");
}

function userAutocomplete() {
    const emailArray = []
    $.ajax({
        type: "GET",
        url: "https://task--it.herokuapp.com/api/users",
        success: function (users) {
            users.forEach(user => {
                emailArray.push(user['email'])
            })
        }
    }).then(() => {
        $("#create-chat-user").autocomplete({
            source: emailArray
        });
    });
}

function listeners() {
    $("#submit_create_chat").click(() => {
        new_user = ''
        user_id = localStorage.getItem('user_id')
        if ($("#create-chat-user").val())
            new_user = ($("#create-chat-user").val())
        if (new_user != '') {
            $.ajax({
                url: `https://task--it.herokuapp.com/api/users/?email=${new_user}`,
                type: 'GET',
                success: function (user) {
                    new_chat = {
                        userID1: user_id,
                        userID2: user._id
                    }
                    $.ajax({
                        url: `https://task--it.herokuapp.com/api/chats`,
                        type: 'POST',
                        data: new_chat,
                        success: function () {
                            location.replace('chat_list.html');
                        }
                    });
                }
            });
        }
    });
}