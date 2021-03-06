angular.module('lmsIonicApp.controllers', [])

.controller('AppCtrl',function ($scope, $rootScope, $state,$ionicModal,$localStorage,$ionicPopup,$state,AuthFactory,CategoryFactory) {

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
  $scope.email = "";
  $scope.name ="";



  if(AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.email = AuthFactory.getEmail();
      console.log($scope.email);
  }

  //geting name
  $rootScope.$on('login:Successful',function(){

  AuthFactory.getName().get({id:$scope.loginData.email},function(response){
      console.log(response.firstName);
      $scope.fname = response.firstName;
      $scope.lname = response.lastName;
      console.log($scope.lname);
  },
  function(response){
    console.log("something went wrong");
});

});
if($scope.loggedIn){
AuthFactory.getName().get({id:$scope.email},function(response){
    console.log(response.firstName);
    $scope.fname = response.firstName;
    $scope.lname = response.lastName;
    console.log($scope.name);
},
function(response){
  console.log("something went wrong");
});
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
    $scope.$on('login:Successful', function(){
        $scope.closeLogin();
    });


    $rootScope.$on("un-successful",function(){
        $scope.closeLogin();

    });
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
    $scope.registration={};
    reg ={};

    $scope.resCode = '';

    $scope.mod.hide();

  };
  //perform action when user submits registration form

  $scope.doRegister = function(){
      $scope.reg = $scope.registration;
    $scope.invalid = false;
    $scope.exist = false;
    var regEmail = $scope.reg.email;
    var load = $ionicPopup.show({
    				title: 'Please Wait....'});

     AuthFactory.getRegisterUrl().get({id:regEmail},function(response){
     load.close();
     $scope.resCode= response.status;
     console.log($scope.resCode);
     if($scope.resCode=="exist"){
         var alertPopup = $ionicPopup.alert({
              title: '<h4>Alert</h4>',
              template:'<h4>Email id already exist</h4>',
              buttons: [
                 {
                     text: 'ok',
                     type:'popClose'
                 }
             ]

          });

          alertPopup.then(function(res) {
              console.log("exist");
          });
    }
    else if($scope.resCode=="invalid")
    {
        var alertPopup = $ionicPopup.alert({
             title: '<h4>Alert</h4>',
             template:'<h4>Not a valid email id</h4>',
             buttons: [
                {
                    text: 'ok',
                    type:'popClose'
                }
            ]

         });

         alertPopup.then(function(res) {
             console.log("exist");
         });
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
     $scope.code = $scope.reg.active;
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
    if($scope.reg.password==$scope.reg.confirmPassword){

        AuthFactory.getRegisterUrl().save($scope.registration,function(response){
        $scope.regSuccess=true;

        var alertPopup = $ionicPopup.alert({
             title: '<h4>Done!</h4>',
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
     // $state.go('app.search',{},{reload:true});

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


.controller('SearchController',function ($scope,$rootScope,$stateParams,$localStorage,$ionicPopup,$window,$state,baseURL,AuthFactory,CategoryFactory,BookFactory,OrderFactory,SocketFactory) {

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
    $scope.books =[];
    $scope.book_id = [];
    $scope.search=true;
    $scope.searchPage=true;
    $scope.moredata = false;
    $scope.moresdata = false;
    $scope.moreddata = false;
    //var socket = io.connect('http://localhost:3000');
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
    var SIMILAR ='similar';
    $scope.change = false;
    $scope.isbns=[];
    $scope.show = false;
    $scope.baseURL = baseURL;
    $scope.moredata =false;
    $scope.similar = false;
    $scope.numberOfItemsToDisplay1 = 3;
    $scope.numberOfItemsToDisplay2 = 3;
    $scope.numberOfItemsToDisplay3 = 3;
    $scope.fi = 0;







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
    $scope.similar = false;


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


    $scope.$on("$ionicView.beforeEnter", function(event, data){


       // handle event
       $scope.searchPage = true;

       if($scope.loggedIn){
       BookFactory.getBookUrl().get(function(response){
              $scope.books = response.book;
              $scope.change=true;
              $scope.length1 = $scope.books.length;



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
            $scope.length2 = $scope.bookss.length;
            console.log($scope.bookss);
            if(response.books==''){
                $scope.notFound = true;
            }
            $scope.searchFilter = true;
        },function(response){
            $scope.searchFilter = false;

    });

}




$scope.loadMoreData1 = function() {

    if ($scope.length1 > $scope.numberOfItemsToDisplay1)
    $scope.numberOfItemsToDisplay1 +=1;
    $scope.$broadcast('scroll.infiniteScrollComplete');
};
$scope.loadMoreData2 = function() {
    if ($scope.length2 > $scope.numberOfItemsToDisplay2)
    $scope.numberOfItemsToDisplay2 +=1;
    $scope.$broadcast('scroll.infiniteScrollComplete');

};
$scope.loadMoreData3 = function() {
    if ($scope.length1 > $scope.numberOfItemsToDisplay3)
    $scope.numberOfItemsToDisplay3 +=1;
    $scope.$broadcast('scroll.infiniteScrollComplete');

};






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
    var tem = {isbn:id,
        email:$scope.email}
        console.log(tem);

    OrderFactory.sameOrderUrl().save(tem,function(response){
        console.log(response);
        if(response.flag =="exist"){

                    var alertPopup = $ionicPopup.alert({
                         title: '<h4>Alert</h4>',
                         template:'<h4>Sorry !You already have a order in progress on the same book!</h4>',
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

        }
        else{


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


    },
        function(response){
            console.log("something went wrong");
        }
    );





}



$rootScope.$on('logout',function(){
    $localStorage.store(COUNT_KEY, 0);
    $localStorage.remove(FIRST_BOOK);
    $localStorage.store(SHOW_FIRST_BOOK,"false");
    $scope.showFirstBook = false;
    $scope.showSecondBook = false;
    $scope.showThirdBook = false;

    $localStorage.remove(SECOND_BOOK);
    $localStorage.store(SHOW_SECOND_BOOK,"false");
    $localStorage.remove(THIRD_BOOK);
    $localStorage.store(SHOW_THIRD_BOOK,"false");

});

/*$scope.reload=function(){
$window.location.reload(true);
}*/


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
    $scope.count =$localStorage.get(COUNT_KEY,0);
    OrderFactory.getOrderUrl().get(
        {
            id:$scope.email
        },
        function(res){
            var length = res.count;
            console.log(length);
            var len = parseInt(length);
            console.log(len);
            var con = parseInt($scope.count);
            var tot = len + con;
            console.log(tot);

            if((tot)<=3&&len!=3){
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
            else if((len<3)&&(tot>3))

            {   console.log(tot);
                var alertPopup = $ionicPopup.alert({
                     title: '<h4>Alert</h4>',
                     template: '<h4>You already have some book pending!Adding this to cart cause the list to exeed 3 </h4>',
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


.controller('BookDetailController',function ($scope, $rootScope,$stateParams,baseURL,AuthFactory,BookFactory) {
    $scope.loggedIn = false;
    $scope.book = {};
    $scope.auth = {};
    $scope.baseURL = baseURL;
    $scope.book = BookFactory.getBookDetailUrl().get({
            id: $stateParams.id
        },
            function (response) {
                $scope.book = response.book;

            },
            function (response) {
            }
        );

        console.log($scope.book);
        console.log($scope.auth);



});
