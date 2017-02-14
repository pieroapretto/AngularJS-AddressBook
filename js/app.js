var app = angular.module('app', []);

app.controller('repoCtrl', function($scope, $http) {

  var mainURL = "https://reqres-api.herokuapp.com/api/users/";

  $http.get(mainURL)
    .then(function successAll(response) {

      //capitalize first letter of names being passed to $scope.people
      response.data.forEach(function(person) {
        person.first_name = $scope.Capitalize(person.first_name);
        person.last_name = $scope.Capitalize(person.last_name);
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
