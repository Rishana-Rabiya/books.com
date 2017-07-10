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
        $scope.user=false;
        $scope.ex = false;
      }
      else if($scope.type=="user")
      {  $scope.admin = false;
         $scope.ex=false;
         $scope.user = true;

      }
      else if($scope.type=="exUser")
      { $scope.user = false;
        $scope.admin = false;
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
        $scope.admin = false;
        $scope.user=false;
        $scope.exUser=false;
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
          console.log($scope.name);
          $scope.type = response.type;
       if($scope.type=="admin"){
           $scope.exUser=false;
           $scope.user = false;
           $scope.admin = true;
       }


       else if($scope.type=="user")
       {

           $scope.admin = false;
           $scope.exUser = false;
           $scope.user = true;

       }
       else if($scope.type=="exUser")
       {   $scope.admin = false;
           $scope.user = false;
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

  //logout
  $scope.$on('logout', function (event, data) {
    $scope.loggedIn= data
  });
  //authenticate
  if(AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.email = AuthFactory.getEmail();
  }
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

     });

 }

}])
.controller('BookController',['$scope','$rootScope','$state','BookFactory','AuthFactory','CategoryFactory','ngDialog',function($scope,$rootScope,$state,BookFactory,AuthFactory,CategoryFactory,ngDialog){

  $scope.loggedIn = false;
  $scope.categories = [];
  $scope.email = '';
  $scope.book = {};
  $scope.categories = {};
  $scope.bookSuccess = false;
  $scope.liveSuccess=false;
  $scope.success = false;
  $scope.books = [];
  $scope.nbooks =[];
  $scope.currentPage = 1;
  $scope.pageSize= 7;
  $scope.enable ="enable";
  $scope.disable ="disable";

  $scope.$on('logout', function (event, data) {
      $scope.loggedIn= data
  });


  if(AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.email = AuthFactory.getEmail();
  }

//var socket = io.connect('http://localhost:3000');
//var uploader = new SocketIOFileUpload(socket);
//uploader.listenOnInput(document.getElementById("siofu_input"));

  CategoryFactory.getCategoryUrl().get(function(response){
      console.log(response.message);
      $scope.categories = response.message;
      $(document).ready(function() {
          $('.selectpicker').selectpicker('refresh');
      });
    },
    function(response){
        console.log("failure");
    });
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



//book listing
BookFactory.getBooks().get({id:"available"},function(response){
    $scope.books = response.books;

},function(response){
    ngDialog.open({ template: '<p>something went wrong</p>',plain: true});
});
BookFactory.getBooks().get({id:"not available"},function(response){
    $scope.nbooks = response.books;

},function(response){
    ngDialog.open({ template: '<p>something went wrong</p>',plain: true});
});
$rootScope.$on("bookAction",function(event){
    BookFactory.getBooks().get({id:"available"},function(response){
        $scope.books = response.books;

    },function(response){
        ngDialog.open({ template: '<p>something went wrong</p>',plain: true});
    });
    BookFactory.getBooks().get({id:"not available"},function(response){
        $scope.nbooks = response.books;

    },function(response){
        ngDialog.open({ template: '<p>something went wrong</p>',plain: true});
    });

});


//enable/disable a book
$scope.ActionBook = function(id,flag){
    if (confirm('Are you sure you want to perform this Action?')) {
        BookFactory.bookActionUrl().update({id:id,flag:flag},function(res){
            ngDialog.open({ template: '<p>The action has performed successfully!</p>',plain: true});
            $rootScope.$broadcast("bookAction");
        },
        function(res){
            console.log("something went wrong");
            ngDialog.open({ template: '<p>The action counld not be performed!</p>',plain: true});
        });

    }
}

}])
.controller('ExecutiveController',['$scope','$state','$rootScope','ExecutiveFactory','AuthFactory','OrderFactory','FineFactory','BookFactory','ngDialog',function($scope,$state,$rootScope,ExecutiveFactory,AuthFactory,OrderFactory,FineFactory,BookFactory,ngDialog){
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
$scope.currentPage = 1;
$scope.pageSize= 7;



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
    $scope.orders = response.order;
    $scope.success = true;
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
    if(dat){
    var m = new Date(dat);
    return (m.toDateString());
    }
}
$scope.getFineValue=function(dat){

    if(dat<0){
        return 0;
    }
    else
    {
        return dat;
    }
}
var order = {};
$scope.status = '';
$scope.res = {};

//update the status
$scope.updateStatus=function(status,order_id,id,book_id,email){


    $scope.status = status;
    order = {
        id:id,
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
//delete Fine

$scope.closeFine = function(id) {
    if (confirm('Are you sure you want to delete this?')) {

    FineFactory.getFineUrl().delete({id: id},function(response){
        console.log(response);
        $state.go($state.current, {}, {reload: true});

    },
function(response){

});
}

};
}])

.controller('StatisticsController',['$scope','$state','$rootScope','ExecutiveFactory','AuthFactory','ngDialog',function($scope,$state,$rootScope,ExecutiveFactory,AuthFactory,Dialog){
    $scope.data =[];
    $scope.reCount=0;
    $scope.rejCount=0;
    $scope.appCount=0;
    $scope.reqCount =0;
    $scope.acCount =0;
    var date = new Date();
    $scope.loggedIn=false;
    if(AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.email = AuthFactory.getEmail();
    }


    $scope.date = date.toDateString();
    ExecutiveFactory.getChangeUrl().get(function(response){
        $scope.reqCount = response.count;
        console.log($scope.reqCount);
        var array = response.ary;
        for(var i=0;i<array.length;i++){
            if(array[i].status=="Approved"){
                $scope.appCount = array[i].count;
            }
            else if(array[i].status=="Rejected"){
                $scope.rejCount = array[i].count;
            }
            else if(array[i].status=="Returned"){
                $scope.reCount = array[i].count;
            }
            else if(array[i].status=='Accepted'){
                $scope.acCount = array[i].count;
            }
        }

            $scope.labels = ["Pending-Request","Approved", "Accepted","Returned","Rejected"];
              $scope.data.push($scope.reqCount);
              $scope.data.push($scope.appCount);
              $scope.data.push($scope.acCount);
              $scope.data.push($scope.reCount);
              $scope.data.push($scope.rejCount);

    },
function(response){
    console.log("something went wrong");

});
console.log($scope.reqCount);
console.log($scope.reCount);
console.log($scope.rejCount);
console.log($scope.appCount);


}])
.controller('UserController',['$scope','$state','$rootScope','AuthFactory','UserFactory','ngDialog',function($scope,$state,$rootScope,AuthFactory,UserFactory,ngDialog){
$scope.users = [];
$scope.eusers = [];
$scope.currentPage = 1;
$scope.pageSize= 7;
$scope.loggedIn = false;
$scope.enable ="enable";
$scope.disable ="disable";
$scope.bookings = [];
$scope.books = [];

$scope.email = '';
if(AuthFactory.isAuthenticated()) {
    $scope.loggedIn = true;
    $scope.email = AuthFactory.getEmail();
}
//status of the books

UserFactory.getOrderStatusUrl().get({id:$scope.email},function(res){
    console.log(res.order);
    $scope.bookings = res.order;
},
function(){
   ngDialog.open({ template: '<p>Something went wrong!</p>',plain: true});
});

//history of the bookings
UserFactory.getBookStatusUrl().get({id:$scope.email},function(res){
    console.log(res.order);
    $scope.books = res.order;
},
function(){
   ngDialog.open({ template: '<p>Something went wrong!</p>',plain: true});
});
//date of the history
$scope.getDate=function(dat){
    if(dat){
    var m = new Date(dat);
    return (m.toDateString());
    }
}





$scope.$on("action",function(){
UserFactory.getUserUrl().get({id:"enable"},function(res){
    $scope.eusers = res.user;

},
function(res){
    ngDialog.open({ template: '<p>The Action could not be performed</p>',plain: true});


});
UserFactory.getUserUrl().get({id:"disable"},function(res){
    $scope.users = res.user;
},
function(res){
    ngDialog.open({ template: '<p>The Action could not be performed</p>',plain: true});


});

});

UserFactory.getUserUrl().get({id:"enable"},function(res){
    $scope.eusers = res.user;

},
function(res){
    ngDialog.open({ template: '<p>The Action could not be performed</p>',plain: true});


});
UserFactory.getUserUrl().get({id:"disable"},function(res){
    $scope.users = res.user;
},
function(res){
    ngDialog.open({ template: '<p>The Action could not be performed</p>',plain: true});


});




$scope.ActionUser=function(id,flag){
    if (confirm('Are you sure you want to perform this Action?')) {
        UserFactory.userActionUrl().update({id:id,flag:flag},function(res){
            ngDialog.open({ template: '<p>The action has performed successfully!</p>',plain: true});
            $rootScope.$broadcast("action");


        },
    function(res){
        console.log("something went wrong");
        ngDialog.open({ template: '<p>The action counld not be performed!</p>',plain: true});
    });


    }
}

}]);





;
