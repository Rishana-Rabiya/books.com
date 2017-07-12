'use strict';




angular.module('lmsProjectApp')
.constant("baseURL","https://localhost:3443/")
/*.factory('loginFactory',  ['$resource', 'baseURL', function($resource,baseURL) {
 return $resource(baseURL+"users/login"); // Note the full endpoint address
}]);
*/

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])

.factory('AuthFactory', ['$resource', '$http','$localStorage', '$rootScope', '$window','$state','baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window,$state, baseURL, ngDialog){

    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var email = '';
    var authToken = undefined;


  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.email != undefined) {
      useCredentials(credentials);
    }
  }

  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }

  function useCredentials(credentials) {
    isAuthenticated = true;
    email = credentials.email;
    authToken = credentials.token;
    //console.log(authToken);
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    email = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }

    authFac.login = function(loginData) {
      console.log("here");

        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
            // console.log(response.token);

              storeUserCredentials({email:loginData.email, token: response.token});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){

              isAuthenticated = false;

            var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }

        );

    };
    authFac.logout = function() {
      console.log("log");
      $resource(baseURL+"users/logout").get(function(response){
      destroyUserCredentials();
      $state.go('app',{},{reload:true});

      },function(response){})

    };

    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };

    authFac.getEmail = function() {
        return email;
    };
    authFac.url = function(){

  return  $resource(baseURL + "users/login/:id");
   }

    loadUserCredentials();

    return authFac;

}])

.factory('CategoryFactory', ['$resource','baseURL',function($resource,baseURL){
  var catFac = {};
    catFac.getCreateUrl = function(){
      return  $resource(baseURL + "category/create", null, {
           'update': {
               method: 'PUT'
           }
       });
    }
    catFac.getCategoryUrl = function(){
      return  $resource(baseURL + "category/find/:id");
    }
    catFac.getCategoryAction=function(){
        return $resource(baseURL + "category/action/:id", null, {
             'update': {
                 method: 'PUT'
             }
         });
     }
     catFac.getAllUrl = function(){
          return  $resource(baseURL + "category/all");

     }

  return catFac;

}])
.factory('BookFactory', ['$resource','$rootScope','baseURL',function($resource,$rootScope,baseURL){
  var bookFac={};

  bookFac.getUrlBook = function(){
      return $resource(baseURL+"books/upload/:id", null, {
           'update': {
               method: 'PUT'
           }
       });
  }
  bookFac.getName = function(){
      return $resource(baseURL+"books/find/:id")
  }
  bookFac.getBooks = function(){
      return $resource(baseURL+"books/list/:id")
  }
  bookFac.bookActionUrl=function(){
      return $resource(baseURL + "books/action/:id", null, {
           'update': {
               method: 'PUT'
           }
       });
   }
  bookFac.getAllBooks = function(){
        return $resource(baseURL+"books/all");
  }
  bookFac.getEveryBooks = function(){
        return $resource(baseURL+"books/every");
  }

  bookFac.getInfo = function(){
        return $resource(baseURL+"books/info/:id");
  }

  return bookFac;

}])

.factory('ExecutiveFactory', ['$resource','baseURL',function($resource,baseURL){
  var exFac={};

  exFac.getExUserUrl = function(){
    return $resource(baseURL+"executive/create")
  }
  exFac.getChangeUrl = function(){
    return $resource(baseURL+"executive/")
  }
  return exFac;

}])
.factory('OrderFactory', ['$resource','baseURL',function($resource,baseURL){
  var orFac={};

  orFac.getOrderUrl = function(){
    return $resource(baseURL+"order/")
  }
  return orFac;

}])


.factory('FineFactory', ['$resource','baseURL',function($resource,baseURL){
  var fineFac={};

  fineFac.getFineUrl = function(){
    return $resource(baseURL+"fine/:id");
  }



  return fineFac;

}])



.factory('UserFactory', ['$resource','baseURL',function($resource,baseURL){
  var userFac={};
  userFac.getUserUrl = function(){
      return $resource(baseURL+"norm/:id");
  }
 userFac.userActionUrl=function(){
     return $resource(baseURL + "norm/action/:id", null, {
          'update': {
              method: 'PUT'
          }
      });
 }
 userFac.getOrderStatusUrl= function(){
    return $resource(baseURL+"norm/order/:id");
 }
 userFac.getBookStatusUrl=function(){
      return $resource(baseURL+"norm/book/:id");

 }
  return userFac;

}])








;
