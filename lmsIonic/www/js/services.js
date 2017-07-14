'use strict';

angular.module('lmsIonicApp.services', ['ngResource'])
.constant("baseURL", "https://192.168.1.102:3443/")
// .constant("baseURL", "https://localhost:3443/")

.factory('$localStorage', ['$window', function($window) {
  return {
    store: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function (key) {
      $window.localStorage.removeItem(key);
    },
    storeObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key,defaultValue) {
      return JSON.parse($window.localStorage[key] || defaultValue);
    }
  }
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', 'baseURL', '$ionicPopup', function($resource, $http, $localStorage, $rootScope, baseURL, $ionicPopup){

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

    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    email = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
    console.log("here");
    $rootScope.$broadcast('logout');


  }

    authFac.login = function(loginData) {


        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({email:loginData.email, token: response.token});
              $rootScope.$broadcast('login:Successful');


           },
           function(response){
              isAuthenticated = false;


              var message = '<div><p>' +  response.data.err.message +
                  '</p></div>';

               var alertPopup = $ionicPopup.alert({
                    title: '<h4>Login Failed!</h4>',
                    template: message
                });

                alertPopup.then(function(res) {
                    console.log('Login Failed!');
                     $rootScope.$broadcast("un-successful");
                });


           }

        );

    };

    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };



    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };

    authFac.getEmail = function() {
        return email;
    };
   authFac.getRegisterUrl=function(){
     return  $resource(baseURL + "users/register/:id");
     };


    loadUserCredentials();
    authFac.getName = function(){
        return $resource(baseURL+"users/login/:id");
    };

    return authFac;

}])


.factory('CategoryFactory', ['$resource', 'baseURL', function($resource, baseURL){
    var catFac = {};
    catFac.getCatUrl = function(){
        return  $resource(baseURL + "category/find");
    }
    return catFac;
}])



.factory('BookFactory', ['$resource', 'baseURL', function($resource, baseURL){
    var bookFac = {};
    bookFac.getBookUrl = function(){
        return  $resource(baseURL + "books/");
    }
    bookFac.getBookSearchUrl = function(){
        return  $resource(baseURL + "books/find/");
    }
    bookFac.getBookDetailUrl = function(){
        return $resource(baseURL+"books/find/:id")
    }
    return bookFac;
}])


.factory('OrderFactory', ['$resource', 'baseURL', function($resource, baseURL){
    var orderFac = {};
    orderFac.getOrderUrl = function(){
        return  $resource(baseURL + "order/check/:id");
    }
    orderFac.sameOrderUrl = function(){
        return $resource(baseURL + "books/same/:id");
    }

    return orderFac;
}])




.factory('SocketFactory',['$rootScope',function($rootScope){
    var socket = io.connect('http://192.168.1.102:3000');
    var socketFac ={};
    socketFac.emitSocket=function(book_id)
    {
        socket.emit('order',book_id);
    }
    socket.on('response',function(data){
        $rootScope.$broadcast('socketEmit',data);
    });
    return socketFac;

}])
;
