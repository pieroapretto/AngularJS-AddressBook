'use strict';

// String >> String
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Retrieves Users from API
// Null >> Null
function getUsers(){
  // Retrieve all users via AJAX
  $.ajax("https://reqres-api.herokuapp.com/api/users", {
    success: writeUsers,
    error: function(){
      console.log("Could not load users...");
    }
  });
}

// Array >> Strings
function writeUsers(users) {
  _.each(users, function(user){

    // Break down string, make it easier to manage
    var userFirstName = capitalizeFirstLetter(user.first_name);
    var userLastName = capitalizeFirstLetter(user.last_name);

    // Build individual cells
    var idCell = '<td><strong>' + user.id + '</strong></td>';
    var firstNameCell = '<td>' + userFirstName + '</td>';
    var lastNameCell = '<td>' + userLastName + '</td>';
    var viewBtn = '<td><a class="btn btn-default" href="#" data-id="' + user.id + '">View</a></td>';

    // Concatenated cells inside of row tags
    var str = '<tr>' + idCell + firstNameCell + lastNameCell + viewBtn + '</tr>';

    // Append to table body
    $("tbody").append(str);
  });
}

// String >> Null
function getDetailedInformation(url){
  // Retrieve the detailed contact information
  $.ajax(url, {
    success: writeDetailedInformation,
    error: function(){
      console.log("Could not retrieve information...");
    }
  });
}

// Obj >> String
function writeDetailedInformation(user){

  // Break down string, easier to manage
  var firstName = capitalizeFirstLetter(user.first_name);
  var lastName = capitalizeFirstLetter(user.last_name);
  var userOccupation = capitalizeFirstLetter(user.occupation);

  // Parse the phone number
  var rawPhNum = String(user.phone);
  var firstNum = rawPhNum[0];
  var areaCode = rawPhNum.substring(1,4);
  var firstThreeNums = rawPhNum.substring(4,7);
  var restOfPhNum = rawPhNum.substring(7);
  var phoneNum = '<p>' + firstNum + "-" + areaCode + "-" + firstThreeNums + "-" + restOfPhNum + '</p>';

  // Build individual item
  var userImg = '<img src="' + user.avatar + '">';
  var firstAndLastName = '<h3>' + firstName + ' ' + lastName + '</h3>';
  var occupationStr = '<h4>' + userOccupation + '</h4>';
  var addressStr = '<p>' + user.address + '</p>';

  // Concat HTML items into one string
  var userDetail = userImg + firstAndLastName + '<hr>' + occupationStr + phoneNum + addressStr;

  // Overwrite #details div with chosen contact info
  $("#details").html(userDetail);

}

$(document).ready(function() {

  getUsers();

  // On click, get the details of that person
  $(document).on('click','[data-id]', function(e){
    e.preventDefault();
    // Location of users
    var allUsers = "https://reqres-api.herokuapp.com/api/users";
    // ID of contact clicked on
    var clickedId = $(this).data('id');
    // Concatinate the url
    var concatUrl = allUsers + "/" + clickedId;

    getDetailedInformation(concatUrl);

  });

});
