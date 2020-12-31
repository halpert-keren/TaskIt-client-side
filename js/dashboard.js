
var marge_user_id = '5fecb592690ca7935ccfd762'

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    getUserName()
    getAllUserTasks()
});

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function getUserName() {
    $.ajax({
        url: `http://127.0.0.1:3000/api/users/${marge_user_id}`,
        type: 'GET',
        success: function (user) {
            $("#user-name").empty();
            $("#user-name").append('<h2>' + user['firstName'] + '\'s <b>Tasks</b></h2>');  
        }
    });
}

function getAllUserTasks() {
    $.ajax({
        url: `http://127.0.0.1:3000/api/tasks`,
        type: 'GET',
        success: function (tasks) {
            console.log(tasks);
            displayTasks(tasks);
        }
    });
}

function displayTasks(tasks) {
    $("#dynamic-task-list").empty();
    tasks.forEach(task => {
        if (task.status)
            status_string = 'checked'
        else
            status_string = ''
        $('#dynamic-task-list').append(
            '<tr><th>' + task.name + '</th>' +
            '<td>' + task.category + '</td>' +
            '<td class="status-td"><input class="form-check-input" type="checkbox" value="" onclick="updateTaskStatus(\'' + task._id + '\', \'' + status_string + '\')" ' + status_string + '></td>' +
            "<td><button type='button' class='view' title='View Details' data-toggle='tooltip' onclick='goToTaskId(\"" + task._id + "\")' >" +
            '<i class="material-icons">&#xE5C8;</i></button></td>'
        );
    });
}

function goToTaskId(task_id) {
    localStorage.clear();
    localStorage.setItem('task_id', task_id);
    location.replace("task.html");
}

function updateTaskStatus(task_id, checked) {
    status = true
    if (checked == 'checked')
        status = false
    updated_task = { "status": status }
    $.ajax({
        url: `http://127.0.0.1:3000/api/tasks/${task_id}`,
        type: 'PUT',
        data: updated_task,
        success: function () {
            location.replace('dashboard.html');
        }
    });
}
