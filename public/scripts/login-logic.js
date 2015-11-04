
$(document).ready(function () {
    $('#login-submit').click(loginSubmitEvent);
    $('#login-username').focus(function () {
        $('#username-div').removeClass('has-error');
    });
    $('#login-password').focus(function () {
        $('#pwd-div').removeClass('has-error');
    });
});

function validateIsEmpty() {
    var passValidate = true;
    if ($('#login-username').val().length == 0) {
        $('#username-div').addClass('has-error');
        passValidate = false;
    }
    if ($('#login-password').val().length == 0) {
        $('#pwd-div').addClass('has-error');
        passValidate = false;
    } 
    if (!passValidate) {
        $('#login-fail-validation').css('display', 'block');
        $('#login-fail-validation').addClass('animated bounceInDown delayp1');
        return false;
    }
}

function loginSubmitEvent() {
    $('#login-fail-validation, #login-error').css('display', 'none');
    validateIsEmpty();
    $(this).addClass('processing-quick');
    $(this).css('height', '34px');
    $(this).prop('disabled', true);
    $(this).text('');
    $(this).unbind('click');
    var username = $('#login-username').val();
    var password = $('#login-password').val();
    ajaxLoginSubmit(username, password);
}
function ajaxLoginSubmit(username, password) {
    $.ajax({
        method: "post",
        data: { username: username, password: password },
        success: function () {
            $('#login-success').css('display', 'block');
            $('#login-success').addClass('animated bounceInDown delayp1');
            window.location.href = "account/index";
        },
        statusCode: {
            401: function () {
                $('#login-error').css('display', 'block');
                $('#login-error').addClass('animated bounceInDown delayp1');
            }
        },
        complete: function () {
            $('#login-submit').removeClass('processing-quick');
            $('#login-submit').css('height', 'auto');
            $('#login-submit').prop('disabled', false);
            $('#login-submit').text('ล็อกอิน');
            $('#login-submit').click(loginSubmitEvent);
        }
    });
}
$('#login-error').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
    $('#login-error').removeClass('animated bounceInDown delayp3');
});
$('#login-fail-validation').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
    $('#login-fail-validation').removeClass('animated bounceInDown delayp3');
});
$('#login-password').keydown(function (e) {
    if (e.keyCode == 13) {
        $('#login-submit').trigger('click');
    }
});