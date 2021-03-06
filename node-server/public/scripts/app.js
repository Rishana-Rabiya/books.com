'use strict';

angular.module('lmsProjectApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {

                    },
                    'footer': {

                    }
                }

            })

            // route for the book create page
           .state('app.bookCreate', {
                url:'bookcreate',
                views: {
                    'content@': {
                        templateUrl : 'views/books_create.html',
                        controller  : 'BookController'
                    }
                }
            })
            .state('app.catCreate', {
                url:'catcreate',
                views: {
                    'content@': {
                        templateUrl : 'views/cat_create.html',
                        controller  : 'BookController'
                    }
                }
            })
            .state('app.home', {
                url:'home',
                views: {
                    'content@': {
                      //  templateUrl :

                    }
                }
            })

            $urlRouterProvider.otherwise('/');
          });
