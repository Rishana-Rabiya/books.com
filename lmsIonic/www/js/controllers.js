angular.module('lmsIonicApp.controllers', [])

.controller('AppCtrl',function ($scope, $rootScope, $ionicModal, $localStorage,$ionicPopup,$state,AuthFactory,CategoryFactory) {

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
      console.log($scope.email);
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
     console.log($scope.resCode);
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
             template: response.message,
             buttons: [
                {
                    text: 'ok',
                    type:'popClose',
                    onTap: function (e) {
                        $scope.closeRegister();
                    }
                }
            ]
         });

         alertPopup.then(function(res) {
             console.log('Registration sucessful!');
         });


    },
    function(response){
      var alertPopup = $ionicPopup.alert({
           title: '<h4>Registration Failed!</h4>',
           template: response.message,
           buttons: [
              {
                  text: 'ok',
                  type:'popClose',
                  onTap: function (e) {
                      $scope.closeRegister();
                  }
              }
          ]
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






})

/*$localStorage.remove(FIRST_BOOK);
$localStorage.remove(SECOND_BOOK);
$localStorage.remove(THIRD_BOOK);
$localStorage.remove(COUNT_KEY);
$localStorage.store(SHOW_FIRST_BOOK,"false");
$localStorage.store(SHOW_SECOND_BOOK,"false");
$localStorage.store(SHOW_THIRD_BOOK,"false");*/


.controller('SearchController',function ($scope, $rootScope,$stateParams,$localStorage,$ionicPopup,$window,$state,AuthFactory,CategoryFactory,BookFactory,OrderFactory,SocketFactory) {
    $scope.books = [];
    $scope.auth = {};
    $scope.SearchByCategory=false;
    $scope.category = '';
    $scope.searchData ={};
    $scope.loggedIn = false;
    $scope.bookss = [];
    $scope.searchFilter = false;
    $scope.notFound = false;
    $scope.count = 0;
    $scope.id ='';
    $scope.email ='';
    var i = 0;
    $scope.book_id = [];
    $scope.search=true;
    $scope.searchPage=true;
    var socket = io.connect('http://localhost:3000');
    var FIRST_BOOK ='firstBook';
    var FIRST_AUTHOR='firstAuthor';
    var SECOND_BOOK ='secondBook';
    var SECOND_AUTHOR='secondAuthor';
    var THIRD_BOOK ='thirdBook';
    var THIRD_AUTHOR='thirdAuthor';
    var COUNT_KEY ='count';
    var SHOW_FIRST_BOOK ='showfirst';
    var SHOW_THIRD_BOOK ='showthird';
    var SHOW_SECOND_BOOK ='showsecond';
    $scope.change = false;
    $scope.isbns=[];
    $scope.show = false;


    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.email = AuthFactory.getEmail();
      }
  $scope.getCount = function(){
     // $localStorage.store(COUNT_KEY,0);
     /* $localStorage.store(SHOW_FIRST_BOOK,false);
      $localStorage.store(SHOW_SECOND_BOOK,false);
      $localStorage.store(SHOW_THIRD_BOOK,false);
      $localStorage.remove(FIRST_BOOK);
      $localStorage.remove(SECOND_BOOK);
      $localStorage.remove(THIRD_BOOK);*/

    $scope.firstBook=$localStorage.getObject(FIRST_BOOK,'{}');
    $scope.secondBook=$localStorage.getObject(SECOND_BOOK,'{}');
    $scope.thirdBook=$localStorage.getObject(THIRD_BOOK,'{}');
    $scope.count=$localStorage.get(COUNT_KEY,0);
    $scope.showFirstBook  =$localStorage.get(SHOW_FIRST_BOOK,"false");
    $scope.showSecondBook=$localStorage.get(SHOW_SECOND_BOOK,"false");
    $scope.showThirdBook =$localStorage.get(SHOW_THIRD_BOOK,"false");


    if($scope.showFirstBook=="false"){
        $scope.showFirstBook=false;

    }
    if($scope.showFirstBook=="true"){
        $scope.showFirstBook=true;
    }
    if($scope.showSecondBook=="true"){
        $scope.showSecondBook=true;

    }
    if($scope.showSecondBook=="false"){
        $scope.showSecondBook=false;

    }
    if($scope.showThirdBook=="true"){
        $scope.showThirdBook=true;

    }
    if($scope.showThirdBook=="false"){
        $scope.showThirdBook=false;

    }

    return($localStorage.get(COUNT_KEY,0));

}
    /*$scope.$on("delete",function(){
    $scope.count=$localStorage.get(COUNT_KEY,0);
});*/




    //getting books
    $scope.$on("$ionicView.beforeEnter", function(event, data){
       // handle event
       $scope.searchPage = true;

       if($scope.loggedIn){
       BookFactory.getBookUrl().get(function(response){
              $scope.books = response.book;
              $scope.change=true;
          },
          function(response){
              console.log("insuccessful category search");
          });
          }

        });



        //category listing
        if($scope.loggedIn){
        CategoryFactory.getCatUrl().get(function(response){
            $scope.categories = response.message;
        });
    }



      //category wise search
        $scope.categoryClick = function(category){
            $rootScope.$broadcast('categoryClick',category);
        }
        $scope.$on('categoryClick',function (event, category){

            $scope.category = category;
            $scope.SearchByCategory = true;
        });

        //cancel the category selection
        $scope.close = function(){
            $scope.SearchByCategory = false;
        }

        //trigger search on pressing enter key
        document.getElementById("searchText")
        .addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                document.getElementById("search").click();
            }
        });




    //search by title,category and author
    $scope.searchMethod = function(){
        $scope.close();
        $scope.notFound = false;
        BookFactory.getBookSearchUrl().save($scope.searchData,function(response){
            $scope.bookss=response.books;
            console.log($scope.bookss);
            if(response.books==''){
                $scope.notFound = true;
            }
            $scope.searchFilter = true;
        },function(response){
            $scope.searchFilter = false;

    });

}


//Adding product to the cart
$scope.addCart = function (id) {
    if($scope.firstBook.isbn==id||$scope.secondBook.isbn==id||$scope.thirdBook.isbn==id){
        var alertPopup = $ionicPopup.alert({
             title: '<h4>Alert</h4>',
             template:'<h4>No two same book can be lended at the same time</h4>',
             buttons: [
                {
                    text: 'ok',
                    type:'popClose'
                }
            ]

         });

         alertPopup.then(function(res) {
             console.log("no duplicates");
         });
         return;

    }

    console.log("insisde the cart");
    $scope.count =$localStorage.get(COUNT_KEY,0);
    if($scope.count<3){

    console.log($scope.count);

    if(!$scope.showFirstBook){

        BookFactory.getBookDetailUrl().get({
            id:id
        },
        function(response){
            $localStorage.storeObject(FIRST_BOOK, response.book);
            $localStorage.store(SHOW_FIRST_BOOK,true);
            $scope.count++;
            $localStorage.store(COUNT_KEY, $scope.count);
            $scope.showFirstBook = true;
            console.log("Added first book to cart");
        },
        function(response){
            console.log("failed to add the first book");
        });
    }
    else if(!$scope.showSecondBook){

        BookFactory.getBookDetailUrl().get({
            id:id
        },
        function(response){
            $localStorage.storeObject(SECOND_BOOK, response.book);
            $localStorage.store(SHOW_SECOND_BOOK,true);
            $scope.showSecondBook = true;
            $scope.count++;
            $localStorage.store(COUNT_KEY, $scope.count);

            console.log("Added second book to cart");
        },
        function(response){
            console.log("failed to add the third book");
        });
    }
    else if(!$scope.showThirdBook){

        BookFactory.getBookDetailUrl().get({
            id:id
        },
        function(response){
            $localStorage.storeObject(THIRD_BOOK, response.book);
            $localStorage.store(SHOW_THIRD_BOOK,true);
            $scope.showThirdBook = true;
            $scope.count++;
            $localStorage.store(COUNT_KEY, $scope.count);
            console.log("Added third book to cart");
        },
        function(response){
            console.log("failed to add the third book");
        });

    }
    else{
        var alertPopup = $ionicPopup.alert({
             title: '<h4>Alert</h4>',
             template:'<h4>Only three books can be added to the cart at a time</h4>',
             buttons: [
                {
                    text: 'ok',
                    type:'popClose'
                }
            ]
         });

         alertPopup.then(function(res) {
             console.log("only three can be added");
         });
    }
}
else{
    var alertPopup = $ionicPopup.alert({
         title: '<h4>Alert</h4>',
         template: '<h4>Only three books can be added to the cart at a time</h4>',
         buttons: [
            {
                text: 'ok',
                type:'popClose'
            }
        ]
     });

     alertPopup.then(function(res) {
         console.log('only three can be added');
     });

}
}
$scope.reload=function(){
$window.location.reload(true);
}


$scope.deleteFirst=function(){
    $scope.count =$localStorage.get(COUNT_KEY,0);
    $scope.count--;
    console.log($scope.count);
    $localStorage.store(COUNT_KEY, $scope.count);
    $localStorage.remove(FIRST_BOOK);
    $localStorage.store(SHOW_FIRST_BOOK,"false");
    $scope.showFirstBook = false;
    //$rootScope.$broadcast("delete");
    //$rootScope.$broadcast("delete");
}
$scope.deleteSecond=function(){
    $scope.count =$localStorage.get(COUNT_KEY,0);
    $scope.count--;
    $localStorage.store(COUNT_KEY, $scope.count);
    $localStorage.remove(SECOND_BOOK);
    $localStorage.store(SHOW_SECOND_BOOK,"false");
    $scope.showSecondBook = false;
    //$rootScope.$broadcast("delete");
}
 $scope.deleteThird=function(){
    $scope.count =$localStorage.get(COUNT_KEY,0);
    $scope.count--;
    $localStorage.store(COUNT_KEY, $scope.count);
    $localStorage.remove(THIRD_BOOK);
    $localStorage.store(SHOW_THIRD_BOOK,"false");
    $scope.showThirdBook = false;
    //$rootScope.$broadcast("delete");
}


//Checking Out
$scope.checkOut = function(){
    OrderFactory.getOrderUrl().get(
        {
            id:$scope.email
        },
        function(res){
            var length = res.count;

            if(length<3){
                if($scope.showFirstBook){
                    $scope.first = $localStorage.getObject(FIRST_BOOK,'{}');
                    $scope.book_id[i]=$scope.first.isbn;
                    i++;
                }
                if($scope.showSecondBook){
                    $scope.second = $localStorage.getObject(SECOND_BOOK,'{}');
                    $scope.book_id[i]=$scope.second.isbn;
                    i++;

                }
                if($scope.showThirdBook){
                    $scope.third = $localStorage.getObject(THIRD_BOOK,'{}');
                    $scope.book_id[i]=$scope.third.isbn;
                    i++;

                }
                $scope.book_id[i] = $scope.email;
                SocketFactory.emitSocket($scope.book_id);
                $scope.$on('socketEmit',function(event,data){
                    console.log(data);
                    if($scope.showFirstBook)
                    $scope.deleteFirst();
                    if($scope.showSecondBook)
                    $scope.deleteSecond();
                    if($scope.showThirdBook)
                    $scope.deleteThird();
                    if(data.status=="ALL_SET"){
                        var alertPopup = $ionicPopup.alert({
                             title: '<h4>Congrats</h4>',
                             template: '<h4>Request has been made successfully</h4>',
                             buttons: [
                                {
                                    text: 'ok',
                                    type:'popClose'
                                }
                            ]
                         });

                         alertPopup.then(function(res) {
                             console.log('success');
                         });
                    }
                    else{
                        $scope.$apply(function(){
                            $scope.isbns = data.array;
                            $scope.show = true;
                            $scope.closeShow = function(){
                                $scope.show = false;
                            }
                        });
                        console.log($scope.isbns);


                    }
                });


            }
            else{
                var alertPopup = $ionicPopup.alert({
                     title: '<h4>Alert</h4>',
                     template: '<h4>You have already reached the maximum of lending books!please go through the instructions in the web portal for more information </h4>',
                     buttons: [
                        {
                            text: 'ok',
                            type:'popClose'
                        }
                    ]
                 });

                 alertPopup.then(function(res) {
                     console.log('only three can be added');
                 });

            }
        },
        function(res){
            console.log("issue");
        }
    );
}


})


.controller('BookDetailController',function ($scope, $rootScope,$stateParams,AuthFactory,BookFactory) {
    $scope.loggedIn = false;
    $scope.book = {};
    $scope.auth = {};
    $scope.book = BookFactory.getBookDetailUrl().get({
            id: $stateParams.id
        },
            function (response) {
                $scope.book = response.book;
                $scope.auth = response.author;
            },
            function (response) {
            }
        );

        console.log($scope.book);
        console.log($scope.auth);



});
