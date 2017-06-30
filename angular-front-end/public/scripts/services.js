'use strict';




angular.module('lmsProjectApp')
.constant("baseURL","http://localhost:3000/")
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

.factory('AuthFactory', ['$resource', '$http','$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){

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
/*
.factory('multipartForm', ['$resource','baseURL',function($resource,baseURL){
  var fileFac = {};
    fileFac.Post = function(){


      return  $resource(baseURL + "books/upload",{
        save:
        {
         method :'POST',
			   transformRequest: angular.identity,
			  headers: { 'Content-Type': 'undefined' }
       }
   });
  }
    return fileFac;

}])*/

.factory('CategoryFactory', ['$resource','baseURL',function($resource,baseURL){
  var catFac = {};
    catFac.getCreateUrl = function(){
      return  $resource(baseURL + "category/create");
    }
    catFac.getCategoryUrl = function(){
      return  $resource(baseURL + "category/find");
    }
  return catFac;

}])
.factory('BookFactory', ['$resource','baseURL',function($resource,baseURL){
  var bookFac={};
  //tried uploading images
 	/*bookFac.post = function(uploadUrl, data){
 		var fd = new FormData();
 		for(var key in data)
 			fd.append(key, data[key]);
 		 $http.post(uploadUrl, fd, {
 			transformRequest: angular.identity,
 			headers: { 'Content-Type': undefined }
 		});
 	}*/

  bookFac.getUrlBook = function(){
    return $resource(baseURL+"books/upload")
  }
  return bookFac;

}])



;
