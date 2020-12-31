$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    getSingleTask()
    listeners();
});

function getSingleTask() {
    id = localStorage.getItem('task_id')
    $.ajax({
        url: `http://127.0.0.1:3000/api/tasks/${id}`,
        type: 'GET',
        success: function (task) {
            getShareList(task)
        }
    });
}

function getShareList(task) {
    shareList = []
    shareArray = task['share']
    console.log("shareArray: ", shareArray)
    if (shareArray.length != 0) {
        const bar = new Promise((resolve) => {
            shareArray.forEach(share => {
                $.ajax({
                    url: `http://127.0.0.1:3000/api/users/${share}`,
                    type: 'GET',
                    success: function (user) {
                        shareList.push(user['firstName'] + ' ' + user['lastName'])
                        resolve()
                    }
                });
            });
        });
        bar.then(() => {
            displaySingleTasks(task, shareList)
        });
    }
    else
        displaySingleTasks(task, shareList)
}

function displaySingleTasks(task, shareList) {
    $("#dynamic-task-name-header").empty();
    $("#dynamic-task-name-header").append('<h2><b>' + task['name'] + '</b></h2>');

    $("#dynamic-task-name").empty();
    $("#dynamic-task-name").append('<h3>' + task['name'] + '</h3>');

    $("#dynamic-task-category").empty();
    $("#dynamic-task-category").append('<h4>' + task['category'] + '</h4>');

    $("#dynamic-share-list").empty();
    if (shareList.length != 0) {
        shareList.forEach(share => {
            $("#dynamic-share-list").append(
                '<div class="col-2">' + share + '</div>'
            )
        })
    }
    else
        $("#share-section").empty();

    $("#dynamic-subtask-list").empty();
    subTaskArray = task.subTask
    if (subTaskArray != null && subTaskArray.length != 0) {
        subTaskArray.forEach(subtask => {
            if (subtask['status'])
                status_string = 'checked'
            else
                status_string = ''
            $("#dynamic-subtask-list").append(
                '<tr class="row"><td class="col">' + subtask['name'] +
                '</td><td class="col">' +
                '<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"' + status_string + ' onclick="updateSubaskStatus(\'' + subtask._id + '\',\'' + status_string + '\')"></input>' +
                '</td><td class="col">' +
                '<button class="edit" type="button" data-toggle="tooltip" data-bs-toggle="modal" data-bs-target="#edit-subtask"><i class="material-icons">&#xE254;</i></button>' +
                '<button class="delete" type="button" data-toggle="tooltip"  data-bs-toggle="modal" data-bs-target="#delete-subtask"><i class="material-icons">&#xE872;</i></button>' +
                '</td></tr>'
            )
        })
    }
    else {
        $("#subtask-card").empty();
    }
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
        $("#task_share").autocomplete({
            source: emailArray
        });
    });
}

function updateSubaskStatus(subtask_id, checked) {
    task_id = localStorage.getItem('task_id')
    status = true
    if (checked == 'checked')
        status = false
    updated_task = { "status": status }
    $.ajax({
        url: `http://127.0.0.1:3000/api/subtasks/${task_id}/${subtask_id}`,
        type: 'PUT',
        data: updated_task,
        success: function () {
            location.replace('dashboard.html');
        }
    });
}


function listeners() {
    $("#submit_edit_task").click(() => {
        task_id = localStorage.getItem('task_id')
        new_name = ''
        new_category = ''
        new_share = ''
        share_list = []
        if ($("#task_name_edit").val())
            new_name = $("#task_name_edit").val()
        if ($("#task_category_edit").val())
            new_category = $("#task_category_edit").val()
        if ($("#task_share").val())
            new_share = ($("#task_share").val())

        if (new_share != '') {
            $.ajax({
                url: `http://127.0.0.1:3000/api/users/?email=${new_share}`,
                type: 'GET',
                success: function (user) {
                    share_list.push(user._id)
                    updated_task = {
                        "name": new_name,
                        "category": new_category,
                        "share": share_list
                    }
                    $.ajax({
                        url: `http://127.0.0.1:3000/api/tasks/${task_id}`,
                        type: 'PUT',
                        data: updated_task,
                        success: function () {
                            location.replace('task.html');
                        }
                    });
                }
            });
        }
        else {
            updated_task = {
                "name": new_name,
                "category": new_category
            }
            $.ajax({
                url: `http://127.0.0.1:3000/api/tasks/${task_id}`,
                type: 'PUT',
                data: updated_task,
                success: function () {
                    location.replace('task.html');
                }
            });
        }
    });

    $("#submit_delete_task").click(() => {
        task_id = localStorage.getItem('task_id')
        $.ajax({
            url: `http://127.0.0.1:3000/api/tasks/${task_id}`,
            type: 'DELETE',
            success: function () {
                location.replace('dashboard.html');
            }
        });

    });

    $("#submit_create_subtask").click(() => {
        task_id = localStorage.getItem('task_id')
        new_subtask = {
            "name": $("#task_name_create").val()
        }
        console.log(task_id, " ", new_subtask)
        $.ajax({
            url: `http://127.0.0.1:3000/api/subtasks/${task_id}`,
            type: 'POST',
            data: new_subtask,
            success: function () {
                location.replace("task.html");
            }
        });
    });

    $("#submit_edit_subtask").click(() => {
        task_id = localStorage.getItem('task_id')
        new_name = ''
        subtask_id = 0
        if ($("#subtask_name_edit").val())
            new_name = $("#task_name_edit").val()
        updaetd_subtask = {
            "name": new_name,
        }
        $.ajax({
            url: `http://127.0.0.1:3000/api/subtasks/${task_id}/${subtask_id}`,
            type: 'PUT',
            data: new_subtask,
            success: function (data) {
                getSingleTask()
            }
        });

    });

    $("#submit_delete_subtask").click(() => {
        task_id = localStorage.getItem('task_id')
        subtask_id = 0
        $.ajax({
            url: `http://127.0.0.1:3000/api/subtasks/${task_id}/${subtask_id}`,
            type: 'DELETE',
            success: function (data) {
                getSingleTask()
            }
        });

    });
}