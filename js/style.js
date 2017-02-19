$('.dropdown').on('show.bs.dropdown', function() {
  $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
});

// Add slideUp animation to Bootstrap dropdown when collapsing.
$('.dropdown').on('hide.bs.dropdown', function() {
  $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
});

//style img upload button
$(document).on('change', ':file', function() {
    label = $(this).val().replace(/\\/g, '/').replace(/.*\//, '');
    $('#fileSelected').html(label);
    $("#formDivider").css("display", "block");
});

//clean up form area after info is submitted
$(document).on('submit', function(){
  $('#fileSelected').empty();
  $('#formContainer > img').remove();
  $('#formDivider').css("display", "none");
});
