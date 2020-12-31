var marge_user_id = '5fecb592690ca7935ccfd762'

$(function () {
    getTemplates();
    listeners();
});

function getTemplates() {
    $.ajax({
        url: `http://127.0.0.1:3000/api/tasks/?templates=1`,
        type: 'GET',
        success: function (templates) {
            displayTemplates(templates);
        }
    });
}

function displayTemplates(templates) {
    subtaskString = ''
    templates.forEach(template => {
        subTaskArray = template['subTask']
        if (subTaskArray) {
            subTaskArray.forEach(subtask => {
                subtaskString += '<li class="list-group-item">' + subtask['name'] + '</li>'
            })
        }
        $('#dynamic-template-list').append(
            '<div class="card" style="width: 18rem;">' +
            '<div class="card-header d-flex justify-content-between">' +
            '<h5>' + template.name + '</h5>' +
            '<button class="btn btn-primary" onclick="createFromTemplate(\'' + template.templateID + '\')">Choose</button>' +
            '</div>' +
            '<ul class="list-group list-group-flush">' +
            subtaskString +
            '</ul>' +
            '</div>'
        );
        subtaskString = ''
    });
}

function createFromTemplate(template_id) {
    new_task = {
        "userID": marge_user_id,                    // TEMP user id for Marge Simpson
    }
    $.ajax({
        url: `http://127.0.0.1:3000/api/tasks/${template_id}`,
        type: 'POST',
        data: new_task,
        success: function () {
            location.replace("dashboard.html");
        }
    });
}

function listeners() {
    $("#submit").click(() => {
        new_task = {
            "templateID": null,
            "userID": marge_user_id,                    // TEMP user id for Marge Simpson
            "share": [null],
            "name": $("#task_name").val(),
            "category": $("#task_category").val(),
            "status": false,
            "subTask": null
        }
        $.ajax({
            url: 'http://127.0.0.1:3000/api/tasks/',
            type: 'POST',
            data: new_task,
            success: function () {
                location.replace("dashboard.html");
            }
        });
    });
}
