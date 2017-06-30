angular.module('lmsIonicApp.controllers', [])

.controller('AppCtrl',function ($scope, $rootScope, $ionicModal, $localStorage,$ionicPopup,AuthFactory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');
  $scope.loggedIn = false;
  $scope.regFlag = false;
  $scope.registration={};
  $scope.code='';
  $scope.resCode = '';
  $scope.wrong=false;
  var reg = $scope.registration;
  $scope.form =true;
  if(AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.email = AuthFactory.getEmail();
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  $scope.login = function() {
    $scope.modal.show();
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $localStorage.storeObject('userinfo',$scope.loginData);

    AuthFactory.login($scope.loginData);

    $scope.closeLogin();

  };


  //logout
  $scope.logout = function() {
     AuthFactory.logout();
      $scope.loggedIn = false;
      $scope.email = '';

  };




//register

  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.mod = modal;
  });
  //open register
  $scope.register = function() {
    $scope.closeLogin();
    $scope.mod.show();
  };
  //close register
  $scope.closeRegister = function() {
    $scope.wrong=false;
    $scope.regFlag = false;
    $scope.confirm = false;
    $scope.form = true;
    $scope.mod.hide();

  };
  //perform action when user submits registration form

  $scope.doRegister = function(){
    $scope.invalid = false;
    $scope.exist = false;
    var regEmail = reg.email;
     AuthFactory.getRegisterUrl().get({id:regEmail},function(response){
     $scope.resCode= response.status;
     if($scope.resCode=="exist"){
     $scope.exist = true;
    }
    else if($scope.resCode=="invalid")
    {
      $scope.invalid = true;
    }
    else
    {
      $scope.form = false;
      $scope.regFlag=true;

    }


    },function(response){
      console.log("failure");
    });
  };


  $scope.registerCheck = function(){
    console.log("inside the register check");
     $scope.code = reg.active;
     console.log($scope.code);
     console.log($scope.resCode);
     if($scope.resCode==$scope.code){
       $scope.regFlag= false;
       $scope.confirm = true;

     }
     else {
       $scope.wrong = true;
     }
  };

  $scope.passwordCheck = function(){
    if(reg.password==reg.confirmPassword){

        AuthFactory.getRegisterUrl().save($scope.registration,function(response){
        $scope.regSuccess=true;
        var alertPopup = $ionicPopup.alert({
             title: '<h4>Registration Sucessful!</h4>',
             template: response.message
         });

         alertPopup.then(function(res) {
             console.log('Registration sucessful!');
         });


    },
    function(response){
      var alertPopup = $ionicPopup.alert({
           title: '<h4>Registration Failed!</h4>',
           template: response.message
       });

       alertPopup.then(function(res) {
           console.log('Registration Failed!');
       });
  });
  }
  else {
    $scope.pass_wrong = true;
  }
}
  $rootScope.$on('login:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.email = AuthFactory.getEmail();
  });
});
