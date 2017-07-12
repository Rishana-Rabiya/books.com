'use strict';

angular.module('lmsProjectApp', ['ui.router','ngResource','ngDialog','ngFileUpload','ui.bootstrap','chart.js'])
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
                        templateUrl : 'views/home.html'

                    },
                    'footer': {
                        templateUrl : 'views/footer.html'


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


            .state('app.updateAbook', {
                 url:'updateBook/:id',
                 views: {
                     'content@': {
                         templateUrl : 'views/updateAbook.html',
                         controller  : 'UpdateController'
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

            .state('app.bookStatus', {
                url:'bookStatus',
                views: {
                    'content@': {
                        templateUrl : 'views/userBookStatus.html',
                        controller  : 'UserController'
                    }
                }
            })
            .state('app.deleteBook', {
                url:'deleteBook',
                views: {
                    'content@': {
                        templateUrl : 'views/deleteBook.html',
                        controller  : 'BookController'
                    }
                }
            })
            .state('app.updateBook', {
                url:'updateBook',
                views: {
                    'content@': {
                        templateUrl : 'views/updateBook.html',
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
            .state('app.bookDisable', {
                url:'bookDisable',
                views: {
                    'content@': {
                       templateUrl :'views/bookDisable.html',
                       controller  :'BookController'

                    }
                }
            })
            .state('app.bookEnable', {
                url:'bookEnable',
                views: {
                    'content@': {
                       templateUrl :'views/bookEnable.html',
                       controller  :'BookController'

                    }
                }
            })

            .state('app.bookHistory', {
                url:'bookHistory',
                    views: {
                        'content@': {
                             templateUrl :'views/UserHistory.html',
                             controller  :'UserController'

                            }
                    }
            })
            .state('app.statistics', {
                url:'statistics',
                views: {
                    'content@': {
                       templateUrl :'views/statistics.html',
                       controller  :'StatisticsController'

                    }
                }
            })
            .state('app.enableUser', {
                url:'enableUser',
                views: {
                    'content@': {
                       templateUrl :'views/normalUser.html',
                       controller  :'UserController'

                    }
                }
            })
            .state('app.disableUser', {
                url:'disableUser',
                views: {
                    'content@': {
                       templateUrl :'views/userDisable.html',
                       controller  :'UserController'

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
          })
          .filter('startFrom',function(){
              return function(data,start){
                  return data.slice(start);
              }
          });
