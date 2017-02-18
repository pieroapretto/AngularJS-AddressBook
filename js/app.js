var app = angular.module('app', []);

var bannerImage = document.getElementById('bannerImg');
var result = document.getElementById('res');
var img = document.getElementById('tableBanner');
var addContact = document.getElementById('submitContact');
var picCount = 0;
var numContacts = 1;
var avatarUrl = "";
var localList = [];
var DeletedList = JSON.parse(localStorage.getItem('deleted')) || [];

bannerImg.addEventListener('change', handleFileUpload, false);
addContact.addEventListener('submit', handleAddContact, false);


window.onload = function() { init() };

function init() {
  const keys = Object.keys(localStorage);
  var i = keys.length;

  while (i--) {
     var profilePic = null;
     if (keys[i] !== "deleted") {
       localList.push(JSON.parse(localStorage.getItem(keys[i])));
     }
  }
}

function handleAddContact(evt) {
  var comma = ", "
  var newContact = {
    "id": Math.floor((Math.random() * 999999999) + 1),
    "Number": numContacts++,
    "first_name": addContact.firstName.value,
    "last_name": addContact.lastName.value,
    "address" : addContact.Address.value +comma+ addContact.City.value +comma+ addContact.State.value +' '+ addContact.Zip.value,
    "phone": addContact.Phone.value.replace(/\D/g,''),
    "occupation": addContact.Occupation.value,
    "avatar": avatarUrl
  }

  localStorage.setItem(newContact.id, JSON.stringify(newContact));
  localList.push(newContact);
  updateController(newContact);
  addContact.reset();
}

function updateController(newContact) {
  var appElement = document.querySelector('[ng-app=app]');
  var $scope = angular.element(appElement).scope();
  $scope = $scope.$$childHead; // add this and it will work
  $scope.$apply(function() {
      $scope.people.push(newContact);
  });
}

function handleFileUpload(evt) {
   var files = evt.target.files; // FileList object

   for (var i = 0, f; f = files[i]; i++) {

     // Only process image files.
     if (!f.type.match('image.*')) { continue;}

     var reader = new FileReader();
     reader.onload = (function(theFile) {
       return function(e) {
         avatarUrl = e.target.result;
      //    var randomKey = Math.random().toString(36).substr(2, 5);
      //    localStorage.setItem(randomKey, avatarUrl);
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

      var allContacts = response.data.concat(localList);

      //capitalize first letter of names being passed to $scope.people
      allContacts.forEach(function(person) {
        if(DeletedList.indexOf(person.id) > -1) {
          allContacts.splice(allContacts[person.id - 1], 1);
        }
        else {
          person.first_name = $scope.Capitalize(person.first_name);
          person.last_name = $scope.Capitalize(person.last_name);
          person.Number = numContacts;
          numContacts++;
        }
      });

      $scope.people = allContacts;
      console.log(allContacts);

    }, function errorAll(response) {
      console.log(response.statusText);
  });

  $scope.ViewAllInfo = function(personID) {
    if (personID < 13) {
      $http.get(mainURL + personID)
        .then(function successOne(response){
          $scope.ScrubData(response.data);

        }, function clickError(response) {
          console.log(response.statusText);
      });
   }
   else {
     var obj = localList.filter(function (obj) { return obj.id === personID;})[0];
     $scope.ScrubData(obj);
   }
  }

  $scope.ScrubData = function(details) {

    // convert 11 digit numberical value to phone number syntax
    var rawPhoneNum = String(details.phone);

    if(rawPhoneNum.length < 10) { rawPhoneNum.slice(1);}

    details.phoneNum = rawPhoneNum.substring(0,3) + "-" +
                       rawPhoneNum.substring(3,6) + "-" + rawPhoneNum.substring(6);

    //capitalize first letter in JSON being passed through
    details.first_name = $scope.Capitalize(details.first_name);
    details.last_name = $scope.Capitalize(details.last_name);
    details.occupation = $scope.Capitalize(details.occupation);

    //remove placeholder text in details DOM element and display detailed information
    document.getElementById('detailsView').style.display = 'block';
    var detailsInstr = document.getElementById('detailsInstr');
    if(detailsInstr){ detailsInstr.parentNode.removeChild(detailsInstr)};

    $scope.details = details;
  }

  $scope.Capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  $scope.RemoveInfo = function(personIndex, personID) {
    var voidContact = $scope.people[personIndex];
    if(localStorage[personID]) { localStorage.removeItem(personID); }
    DeletedList.push(voidContact.id);
    localStorage.setItem('deleted', JSON.stringify(DeletedList));
    $scope.people.splice(personIndex, 1);
  }
});
