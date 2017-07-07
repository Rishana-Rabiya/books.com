angular.module('lmsProjectApp')
.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.email= '';
    $scope.admin=false;
    $scope.user=false;
    $scope.ex = false;
    $scope.name='';
    $scope.message={};
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
      //$rootScope.$broadcast('type',$scope.type);
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
        $scope.admin = false;
       }
       else if($scope.type=="exUser")
       {
        $scope.ex = true;
        $scope.admin = false;
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
  $scope.bookSuccess = false;
  $scope.liveSuccess=false;
  $scope.success = false;
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
  BookFactory.getUrlBook().save($scope.book,function(response){
    ngDialog.open({ template: '<p>Sucessfully added books</p>',plain: true});
    $scope.book={};
    $scope.bookSuccess=true;

  },
  function(response){
      ngDialog.open({ template: '<p>Book is not added</p>',plain: true});

  });
};
}])
.controller('ExecutiveController',['$scope','$state','$rootScope','ExecutiveFactory','AuthFactory','OrderFactory','FineFactory','ngDialog',function($scope,$state,$rootScope,ExecutiveFactory,AuthFactory,OrderFactory,FineFactory,ngDialog){
$scope.exData = {};
$scope.exist = false;
$scope.invalid = false;
$scope.loggedIn = false;
$scope.liveData = [];
$scope.orders =[];
$scope.order_id = '';
$scope.dat = {};
$scope.fines = [];
$scope.success = false;

var socket = io.connect('http://localhost:3000');
$scope.$on('logout', function (event, data) {
 $scope.loggedIn= data
});
if(AuthFactory.isAuthenticated()) {
  $scope.loggedIn = true;
  $scope.email = AuthFactory.getEmail();
}
$scope.$on("change",function(){
OrderFactory.getOrderUrl().get(function(response){
    $scope.success = true;
    $scope.orders = response.order;
    console.log($scope.orders);
},
function(response){
    console.log("no orders");

});
});
OrderFactory.getOrderUrl().get(function(response){
    $scope.success = true;
    $scope.orders = response.order;
    console.log($scope.orders);
},
function(response){
    console.log("no orders");

});
FineFactory.getFineUrl().get(function(response){
    $scope.fines = response.fine;
    console.log($scope.fines);
})




$scope.userCreate = function(){

ExecutiveFactory.getExUserUrl().save($scope.exData,function(response){
    if(response.message=="exist"){
        ngDialog.open({ template: '<p>Same email id exist</p>',plain: true});
        $scope.exist = true;
    }
    else if(response.message=="invalid"){
        $scope.invalid=true;
        ngDialog.open({ template: '<p>Invalid email id</p>',plain: true});
    }
    else {
        ngDialog.open({ template: '<p>Sucessfully added executive user</p>',plain: true});
    }
},
function(response){
    console.log("something went wrong");

});
}


socket.on('order', function(data){
    $scope.$apply(function () {
        console.log("inside");
            $scope.sucess=true;
            len = data.length;
            for(i=0;i<len;i++){
                $scope.orders.push(data[i]);
            }
        });

});
//fine date

$scope.getFine=function(dat){
    var m = new Date(dat);
    return (m.toDateString());
}

var order = {};
$scope.status = '';
$scope.res = {};

//update the status
$scope.updateStatus=function(status,order_id,book_id,email){
    $scope.status = status;
    order = {
        status:status,
        books_id:book_id,
        order_id:order_id,
        email:email
    }
    console.log(order);
    //socket.emit('status',order);
   ExecutiveFactory.getChangeUrl().save(order,function(response){

       console.log(response);
        if($scope.status!=response.status){
            ngDialog.open({ template: '<p>Invalid action</p>',plain: true});
        }
        else {

                ngDialog.open({ template: '<p>The status has been changed</p>',plain: true});
        }
        $rootScope.$broadcast("change");


    },
    function(response){
        ngDialog.open({ template: '<p>The Action could not be performed</p>',plain: true});

    });
}
/*$scope.closeFine = function(id){
    FineFactory.getFineUrl.delete({id:id});
}*/

}]);
