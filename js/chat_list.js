var marge_user_id = '5fecb592690ca7935ccfd762'

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    getAllUserChats()
    listeners()
});

function getAllUserChats() {
    $.ajax({
        url: `http://127.0.0.1:3000/api/chats/?userID=${marge_user_id}`,
        type: 'GET',
        success: function (chats) {
            console.log("chats: ", chats);
            displayChats(chats);
        }
    });
}

function displayChats(chats) {
    user_name = localStorage.getItem('user_name')
    user_id = localStorage.getItem('user_id')
    let other_user_names = ''
    userID = ''
    $("#dynamic-message-list").empty();
    chats.forEach(chat => {
        console.log("chat: ", chat)
        if (chat['userID1'] == user_id)
            userID = 'userID2'
        else
            userID = 'userID2'
        console.log("user place: ", userID)
        $.ajax({
            url: `http://127.0.0.1:3000/api/users/${chat[userID]}`,
            type: 'GET',
            success: function (user) {
                other_user_names = (user['firstName'] + ' ' + user['lastName'])
            }
        }).then(() => {
            console.log("other_user_names: ", other_user_names)
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
        url: "http://127.0.0.1:3000/api/users",
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
                url: `http://127.0.0.1:3000/api/users/?email=${new_user}`,
                type: 'GET',
                success: function (user) {
                    new_chat = {
                        userID1: user_id,
                        userID2: user._id
                    }
                    $.ajax({
                        url: `http://127.0.0.1:3000/api/chats`,
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