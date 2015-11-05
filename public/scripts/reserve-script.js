$('#num-seat-input').keydown(function (e) {
    if (e.keyCode == 13) {
        $('#reservequeue-submit').trigger('click');
    }
});