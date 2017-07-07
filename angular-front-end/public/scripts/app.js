'use strict';

angular.module('lmsProjectApp', ['ui.router','ngResource','ngDialog','ngFileUpload'])
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

            .state('app.exCreate', {
                url:'exCreate',
                views: {
                    'content@': {
                       templateUrl :'views/exCreate.html',
                       controller  :'ExecutiveController'

                    }
                }
            })

            .state('app.liveOrder', {
                url:'liveOrder',
                views: {
                    'content@': {
                       templateUrl :'views/live_order.html',
                       controller  :'ExecutiveController'

                    }
                }
            })
            .state('app.fineManage', {
                url:'fineManage',
                views: {
                    'content@': {
                       templateUrl :'views/fineManagement.html',
                       controller  :'ExecutiveController'

                    }
                }
            })

            $urlRouterProvider.otherwise('/');
          });
