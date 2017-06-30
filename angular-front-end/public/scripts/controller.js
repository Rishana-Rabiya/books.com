angular.module('lmsProjectApp')
.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.email= '';
    $scope.admin=false;
    $scope.user=false;
    $scope.ex = false;
    $scope.name='';
    if(AuthFactory.isAuthenticated()) {

      $scope.loggedIn = true;
      $scope.email = AuthFactory.getEmail();
      $scope.type = '';
      AuthFactory.url().get({id:$scope.email},
      function(response) {

      $scope.type = response.type;
      $scope.name= response.firstName;
      if($scope.type=="admin"){
        $scope.admin = true;
      }
      else if($scope.type=="user")
      {
        $scope.user = true;
      }
      else if($scope.type=="exUser")
      {
        $scope.ex = true;
      }
        });



    }

    $scope.openCat = function () {
        ngDialog.open({ template: 'views/cat_create.html', scope: $scope, className: 'ngdialog-theme-default', controller:"CategoryController" });
    };


    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };

    $scope.logOut = function() {
        AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.email = '';
        $rootScope.$broadcast('logout',$scope.loggedIn);
};
    $rootScope.$on('login:Successful', function () {

       $scope.loggedIn = AuthFactory.isAuthenticated();
       $scope.email = AuthFactory.getEmail();

      AuthFactory.url().get({id:$scope.email},
        function(response) {
          console.log(response);
       $scope.name= response.firstName;
       $scope.type = response.type;
       if($scope.type=="admin"){
        $scope.admin = true;
       }
       else if($scope.type=="user")
       {
        $scope.user = true;
       }
       else if($scope.type=="exUser")
       {
        $scope.ex = true;
       }
     });

  });

}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

  $scope.loginData = $localStorage.getObject('userinfo','{}');


    $scope.doLogin = function() {

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };

}])

/*.controller('BodyController',['$scope','multipartForm',function($scope,multipartForm){
  $scope.book = '';
  var file = $scope.file;
  console.log(file.upload);
  uploadFile.upload(file);


}])*/

.controller('CategoryController',['$scope','$rootScope','CategoryFactory','AuthFactory',function($scope,$rootScope,CategoryFactory,AuthFactory){

  $scope.loggedIn = false;
  $scope.email = '';
  $scope.catSuccess= false;
  $scope.$on('logout', function (event, data) {
    $scope.loggedIn= data
  });
  if(AuthFactory.isAuthenticated()) {
    $scope.loggedIn = true;
    $scope.email = AuthFactory.getEmail();
  }

 /*$scope.bookCreate = function(){

 var data =$scope.book;
 var fd = new FormData();
 for(var key in data){
   console.log(data[key]);
  fd.append(key, data[key]);
}
}
 console.log(fd);
 multipartForm.Post().save({}, fd).$promise.then(function (res) {
            $scope.newPost = res;
        }).catch(function (err) {
            $scope.newPostError = true;
            throw err;
        });
      }*/

//Category creation
  $scope.cat = {};
 $scope.catCreate = function(){
    CategoryFactory.getCreateUrl().save($scope.cat,function(response){
    console.log("successfully created category");
    $scope.catSuccess = true;
    $scope.cat.name = '';

  },
  function(response){
    console.log("failure");

  }
  );

}

}])
.controller('BookController',['$scope','$rootScope','BookFactory','AuthFactory','CategoryFactory','ngDialog',function($scope,$rootScope,BookFactory,AuthFactory,CategoryFactory,ngDialog){

  $scope.loggedIn = false;
  $scope.categories = [];
  $scope.email = '';
  $scope.book = {};
  $scope.categories = {};
  $scope.$on('logout', function (event, data) {
    $scope.loggedIn= data
  });


  if(AuthFactory.isAuthenticated()) {
    $scope.loggedIn = true;
    $scope.email = AuthFactory.getEmail();
  }

  CategoryFactory.getCategoryUrl().get(function(response){
   console.log(response.message);
   $scope.categories = response.message;
   $(document).ready(function() {
       $('.selectpicker').selectpicker('refresh');
   });
   },
   function(response){
   console.log("failure");
 }
 );
 //tried uploading images
 /*$scope.bookCreate = function(){
   console.log($scope.book.img);
   var uploadUrl = 'http://localhost:3000/books/upload';
  		BookFactory.post(uploadUrl, $scope.book);
}*/

$scope.bookCreate = function(){
  BookFactory.getUrlBook().save($scope.book,function(){
    ngDialog.open({ template: '<p>Sucessfully added books</p>',plain: true});

  },
  function(response){

  });
};
}])

;
