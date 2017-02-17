var app = angular.module('app', []);

var bannerImage = document.getElementById('bannerImg');
var result = document.getElementById('res');
var img = document.getElementById('tableBanner');
var addContact = document.getElementById('submitContact');
var picCount = 0;
var numContacts = 1;

bannerImg.addEventListener('change', handleFileSelect, false);
addContact.addEventListener('submit', handleAddContact, false);


window.onload = function() { init() };

function init() {
  const keys = Object.keys(localStorage);
  var i = keys.length;

  while (i--) {
     var profilePic = null;
     var imageData = localStorage.getItem(keys[i]);
     profilePic = document.createElement('div');
     profilePic.innerHTML += ['<img class="thumb" src="', imageData,'" />'].join('');
     result.insertBefore(profilePic, null);
  }
}

function handleAddContact(evt) {
  var comma = ", "
  var newContact = {
    "id": numContacts++,
    "first_name": addContact.firstName,
    "last_name": addContact.lastName,
    "address" : addContact.Address.value +comma+ addContact.City.value +comma+ addContact.State.value +' '+ addContact.Zip.value,
    "phone": addContact.Phone.value.replace(/\D/g,''),
    "occupation": addContact.Occupation.value
  }
  JSON.stringify(newContact);
  console.log(newContact);
}

function handleFileSelect(evt) {
   var files = evt.target.files; // FileList object

   for (var i = 0, f; f = files[i]; i++) {

     // Only process image files.
     if (!f.type.match('image.*')) { continue;}

     var reader = new FileReader();
     reader.onload = (function(theFile) {
       return function(e) {
         var randomKey = Math.random().toString(36).substr(2, 5);
         localStorage.setItem(randomKey, e.target.result);
       };
     })(f);

     // Read in the image file as a data URL.
     reader.readAsDataURL(f);
   }
 }

app.controller('repoCtrl', function($scope, $http) {

  var mainURL = "https://reqres-api.herokuapp.com/api/users/";

  $http.get(mainURL)
    .then(function successAll(response) {

      //capitalize first letter of names being passed to $scope.people
      response.data.forEach(function(person) {
        person.first_name = $scope.Capitalize(person.first_name);
        person.last_name = $scope.Capitalize(person.last_name);
        person.id = numContacts;
        numContacts++;
      });

      $scope.people = response.data;

    }, function errorAll(response) {
      console.log(response.statusText);
  });

  $scope.ViewAllInfo = function(personID) {
    $http.get(mainURL + personID)
      .then(function successOne(response){
        $scope.details = response.data;

        // convert 11 digit numberical value to phone number syntax
        var rawPhoneNum = String($scope.details.phone);
        $scope.details.phoneNum = rawPhoneNum[0] + "-" + rawPhoneNum.substring(1,4) + "-" +
                                  rawPhoneNum.substring(4,7) + "-" + rawPhoneNum.substring(7);

        //capitalize first letter in JSON being passed through
        $scope.details.first_name = $scope.Capitalize($scope.details.first_name);
        $scope.details.last_name = $scope.Capitalize($scope.details.last_name);
        $scope.details.occupation = $scope.Capitalize($scope.details.occupation);

        //remove placeholder text in details DOM element and display detailed information
        document.getElementById('detailsView').style.display = 'block';
        var detailsInstr = document.getElementById('detailsInstr');
        if(detailsInstr){ detailsInstr.parentNode.removeChild(detailsInstr)};

      }, function clickError(response) {
        console.log(response.statusText);
    });
  }

  $scope.Capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
