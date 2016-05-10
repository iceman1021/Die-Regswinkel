//-- AngularJS --//
(function(){
    'use strict';

    var module = angular.module('app', ['onsen', 'ngMap', 'ngSanitize']);

    // form file directive (Assist with file uploads)
    module.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    module.filter('externalLinks', function() {
        return function(text) {
            //return String(text).replace(/href=/gm, "class=\"ex-link\" href=");
            //return String(text).replace(/href=/gm, "ng-click=\"exLink()\" href=");
            //
            // NOTE:
            // can't use ng-click as it is not in Angular Land as $sce and ng-bind-html
            // ALSO - must do filters in this order 'content | externalLinks | to_trusted'
            //        so this string stays in content
            return String(text).replace(/href=/gm, "onclick=\"angular.element(this).scope().exLink(this);return false\" href=");
        };
    });

    module.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

    module.controller('AppController', function ($scope, $http, $window, $timeout) {
        $scope.data = [];
        
        //API URL path
        var apiPath = 'https://solidariteit.co.za/regsapp/';
        
        $scope.username = '';
        $scope.password = '';
        $scope.user_active = '';
        $scope.login_valid = '';
        $scope.homeText = true;
        
        // ra post list
        $scope.ralist = [];
        $scope.rapost = [];
        
        // artikels post list
        $scope.artikelslist = [];
        $scope.artikelspost = [];
        
        // regsvrae post list
        $scope.regsvraelist = [];
        $scope.regsvraepost = [];
        
        // praktyk post list
        $scope.praktyklist = [];
        $scope.praktykpost = [];
        
        // sivieleHulp post list 
        $scope.sivieleHulplist = [];
        $scope.sivieleHulppost = [];
        
        // kontrak post list
        $scope.kontraklist = [];
        $scope.kontrakpost = [];
        
        // wette post list
        $scope.wettelist = [];
        $scope.wettepost = [];
        
        // search results scopes
        $scope.searchTerm = '';
        $scope.resultlist = [];
        $scope.resultpost = [];
        
        // file scope
        $scope.files = [];
        
        //pagination controls
        $scope.pageNum = '';
        $scope.pageCount = '';
        $scope.nextPage = false;
        $scope.nextPageNum = '';
        $scope.prePage = false;
        $scope.prePageNum = '';
        
        $scope.init = function() {
            var user = $window.localStorage.getItem('username'); 
            var pass = $window.localStorage.getItem('password'); 
            
            if (user && pass) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'lookup.php', {"llookup" : "yes", "username" : user, "password" : pass})
                .success(function(data, status){
                    if (data['loginValid'] === 'yes') {
                        $scope.username = user;
                        $scope.password = pass;
                        $scope.user_active = data['active'];
                        $scope.login_valid = data['loginValid'];
                        
                        if (data['active'] === 'yes') {
                            $scope.homeText = false;
                        }
                        
                        $window.localStorage.setItem('username',user); 
                        $window.localStorage.setItem('password',pass); 
                        $window.localStorage.setItem('user_active',data['active']);
                        
                        modal.hide();
                        myNavigator.pushPage('user/home.html', { animation : 'fade' });
                        
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon u nie aanteken nie, probeer asb. weer...';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } 
        }
        
        $timeout($scope.init, 1000);
        
        // process logout
        $scope.logout = function() {
            $window.localStorage.removeItem('username'); 
            $window.localStorage.removeItem('password'); 
            $window.localStorage.removeItem('user_active');
            myNavigator.pushPage('index.html', { animation : 'fade' });
        };
        
        // process login
        $scope.LogIn = function() {
            var user = $scope.data.username;
            var pass = $scope.data.password;
            
            if (user && pass) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'lookup.php', {"llookup" : "yes", "username" : user, "password" : pass})
                .success(function(data, status){
                    if (data['loginValid'] === 'yes') {
                        $scope.username = user;
                        $scope.password = pass;
                        $scope.user_active = data['active'];
                        $scope.login_valid = data['loginValid'];
                        
                        if (data['active'] === 'yes') {
                            $scope.homeText = false;
                        }
                        
                        $window.localStorage.setItem('username',user); 
                        $window.localStorage.setItem('password',pass); 
                        $window.localStorage.setItem('user_active',data['active']);
                        
                        modal.hide();
                        myNavigator.pushPage('user/home.html', { animation : 'fade' });
                        
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon u nie aanteken nie, probeer asb. weer...';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Ons kon u nie aanteken nie, probeer asb. weer...';
                modal.show();
            }
        };
        
        //process forgot
        $scope.recover = function () {
            var recoverEmail = $scope.data.emailRecover;
            
            if (recoverEmail) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'retrieve.php', {"username" : recoverEmail})
                .success(function(data, status){
                    if (data['result'] === 'success') {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-thumbs-up';
                        $scope.data.errorCode = '\'n E-pos is aan u gestuur oor hoe om u besonderhede te herwin.';
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('index.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon nie u besonderhede herwin nie, probeer asb. weer...';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'U moet u e-pos adres invul.';
                modal.show();
            }
        };
        
        // process signup
        $scope.signup = function () {
            var signupUsername = $scope.data.signupUsername;
            var signupName = $scope.data.signupName;
            var signupSurname = $scope.data.signupSurname;
            var signupEmail = $scope.data.signupEmail;
            
            if (signupUsername && signupName && signupSurname && signupEmail) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'signup.php', {"username" : signupUsername, "email" : signupEmail, "fullname" : signupName, "surname" : signupSurname})
                .success(function(data, status){
                    if (data['result'] === 'success') {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-thumbs-up';
                        $scope.data.errorCode = 'Dankie vir jou registrasie hou jou epos dop vir jou aktiverings-skakel';
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('index.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Jou registrasie was onsuksesvol, kontak asb. elektronies@solidariteit.co.za vir bystand';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Vul asb al die velde in.';
                modal.show();
            }
        };
        
        // process register
        $scope.register = function () {
            var regName = $scope.data.regName;
            var regEmail = $scope.data.regEmail;
            var regTel = $scope.data.regTel;
            
            if (regName && regEmail && regTel) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'join.php', {"namesurname" : regName, "number" : regTel, "email" : regEmail})
                .success(function(data, status){
                    if (data['result'] === 'success') {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-thumbs-up';
                        $scope.data.errorCode = 'Dankie dat u wil aansluit, ons sal u kontak met verdere besonderhede.';
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('user/home.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon u nie aansluit nie, probeer asb. weer...';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Vul asb al die velde in.';
                modal.show();
            }
        };
        
        // process meld jou saak aan
        $scope.meldSaak = function () {
            var saakName = $scope.data.saakName;
            var saakEmail = $scope.data.saakEmail;
            var saakTel = $scope.data.saakTel;
            var saakSaak = $scope.data.saakSaak;
            
            if (saakName && saakEmail && saakTel && saakSaak) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'aregquery.php', {"namesurname" : saakName, "number" : saakTel, "email" : saakEmail, "msg" : saakSaak})
                .success(function(data, status){
                    if (data['result'] === 'success') {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-thumbs-up';
                        $scope.data.errorCode = 'Dankie, u saak is aan gemeld.';
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('user/home.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon nie u saak aan meld nie, probeer asb. weer...';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Vul asb al die velde in.';
                modal.show();
            }
        };
        
        // process gesels
        $scope.gesels = function () {
            var geselsName = $scope.data.geselsName;
            var geselsEmail = $scope.data.geselsEmail;
            var geselsTel = $scope.data.geselsTel;
            var geselsSaak = $scope.data.geselsSaak;
            
            if (geselsName && geselsEmail && geselsTel && geselsSaak) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'expquery.php', {"namesurname" : geselsName, "number" : geselsTel, "email" : geselsEmail, "msg" : geselsSaak})
                .success(function(data, status){
                    if (data['result'] === 'success') {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-thumbs-up';
                        $scope.data.errorCode = 'Dankie, u boodskap is gestuur.';
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('user/home.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon nie u boodskap stuur nie, probeer asb. weer...';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Vul asb al die velde in.';
                modal.show();
            }
        };
               
        // load raad page content
        $scope.loadRaPosts = function (pageNum) {
            
            $scope.pageNum = '';
            $scope.pageCount = '';
            $scope.nextPage = false;
            $scope.nextPageNum = '';
            $scope.prePage = false;
            $scope.prePageNum = '';
            
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'raposts.php', {"page" : pageNum})
            .success(function(data, status){
                if (status === 200) {
                    modal.hide();
                    $scope.ralist = data['posts'];
                    $scope.pageNum = pageNum;
                    $scope.pageCount = data['pages'];

                    if ($scope.pageCount > 1 && $scope.pageNum !== $scope.pageCount) {
                        $scope.nextPage = true;
                        $scope.nextPageNum = $scope.pageNum + 1;
                    }

                    if ($scope.pageCount > 1 && $scope.pageNum !== 1) {
                        $scope.prePage = true;
                        $scope.prePageNum = $scope.pageNum - 1;
                    }
                    myNavigator.pushPage('user/raadPage.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load raad post content
        $scope.raPost = function (postId) {
            console.log('Post ID', postId);
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'raposts.php', {"getpost" : postId})
            .success(function(data, status){
                console.log(data);
                if (status === 200 && data) {
                    modal.hide();
                    $scope.rapost.title = data['title'];
                    $scope.rapost.content = data['content'];
                    myNavigator.pushPage('user/raadPost.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load artikels Posts
        $scope.loadArtikelsPosts = function (pageNum) {
            
            $scope.pageNum = '';
            $scope.pageCount = '';
            $scope.nextPage = false;
            $scope.nextPageNum = '';
            $scope.prePage = false;
            $scope.prePageNum = '';
            
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'aposts.php', {"page" : pageNum})
            .success(function(data, status){
                if (status === 200) {
                    modal.hide();
            
                    $scope.artikelslist = data['posts'];
                    $scope.pageNum = pageNum;
                    $scope.pageCount = data['pages'];

                    if ($scope.pageCount > 1 && $scope.pageNum !== $scope.pageCount) {
                        $scope.nextPage = true;
                        $scope.nextPageNum = $scope.pageNum + 1;
                    }

                    if ($scope.pageCount > 1 && $scope.pageNum !== 1) {
                        $scope.prePage = true;
                        $scope.prePageNum = $scope.pageNum - 1;
                    }
                    
                    myNavigator.pushPage('user/artikelsPage.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load artikels Post Content
        $scope.artikelsPosts = function (postId) {
            console.log('Post ID', postId);
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'aposts.php', {"getpost" : postId})
            .success(function(data, status){
                console.log(data);
                if (status === 200 && data) {
                    modal.hide();
                    $scope.artikelspost.title = data['title'];
                    $scope.artikelspost.content = data['content'];
                    myNavigator.pushPage('user/artikelsPost.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load regsvrae Posts
        $scope.loadRegsvraePosts = function (pageNum) {
            
            $scope.pageNum = '';
            $scope.pageCount = '';
            $scope.nextPage = false;
            $scope.nextPageNum = '';
            $scope.prePage = false;
            $scope.prePageNum = '';
            
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'brposts.php', {"page" : pageNum})
            .success(function(data, status){
                if (status === 200) {
                    modal.hide();
                    $scope.regsvraelist = data['posts'];
                    $scope.pageNum = pageNum;
                    $scope.pageCount = data['pages'];

                    if ($scope.pageCount > 1 && $scope.pageNum !== $scope.pageCount) {
                        $scope.nextPage = true;
                        $scope.nextPageNum = $scope.pageNum + 1;
                    }

                    if ($scope.pageCount > 1 && $scope.pageNum !== 1) {
                        $scope.prePage = true;
                        $scope.prePageNum = $scope.pageNum - 1;
                    }
                    myNavigator.pushPage('user/regsvraePage.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load regsvrae Post Content
        $scope.regsvraePosts = function (postId) {
            console.log('Post ID', postId);
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'brposts.php', {"getpost" : postId})
            .success(function(data, status){
                console.log(data);
                if (status === 200 && data) {
                    modal.hide();
                    $scope.regsvraepost.title = data['title'];
                    $scope.regsvraepost.content = data['content'];
                    myNavigator.pushPage('user/regsvraePost.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load praktyk Posts
        $scope.loadParktykPosts = function (pageNum) {
            $scope.pageNum = '';
            $scope.pageCount = '';
            $scope.nextPage = false;
            $scope.nextPageNum = '';
            $scope.prePage = false;
            $scope.prePageNum = '';
            
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'pkposts.php', {"page" : pageNum})
            .success(function(data, status){
                if (status === 200) {
                    modal.hide();
                    $scope.praktyklist = data['posts'];
                    $scope.pageNum = pageNum;
                    $scope.pageCount = data['pages'];
                    if ($scope.pageCount > 1 && $scope.pageNum !== $scope.pageCount) {
                        $scope.nextPage = true;
                        $scope.nextPageNum = $scope.pageNum + 1;
                    }

                    if ($scope.pageCount > 1 && $scope.pageNum !== 1) {
                        $scope.prePage = true;
                        $scope.prePageNum = $scope.pageNum - 1;
                    }
                    myNavigator.pushPage('user/praktykPage.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load praktyk Post Content
        $scope.praktykPosts = function (postId) {
            console.log('Post ID', postId);
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'pkposts.php', {"getpost" : postId})
            .success(function(data, status){
                console.log(data);
                if (status === 200 && data) {
                    modal.hide();
                    $scope.praktykpost.title = data['title'];
                    $scope.praktykpost.content = data['content'];
                    myNavigator.pushPage('user/praktykPost.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // send testament data
        $scope.testament = function() {
            var testaName = $scope.data.testaName;
            var testaEmail = $scope.data.testaEmail;
            var testaID = $scope.data.testaID;
            var testaTel = $scope.data.testaTel;
            
            if (testaName && testaEmail && testaID && testaTel) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'testament.php', {"namesurname" : testaName, "number" : testaTel, "email" : testaEmail , "id" : testaID})
                .success(function(data, status){
                    if (data['result'] === 'success') {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-thumbs-up';
                        $scope.data.errorCode = 'Dankie, ons sal u kontak met verdere besonderhede.';
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('user/home.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon nie die versoek voltooi nie, probeer asb. weer...';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Vul asb al die velde in.';
                modal.show();
            }
        };
        
        // load sivieleHulp Posts
        $scope.loadSivieleHulpPosts = function (pageNum) {
            $scope.pageNum = '';
            $scope.pageCount = '';
            $scope.nextPage = false;
            $scope.nextPageNum = '';
            $scope.prePage = false;
            $scope.prePageNum = '';
            
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'skrposts.php', {"page" : pageNum})
            .success(function(data, status){
                if (status === 200) {
                    modal.hide();
                    $scope.sivieleHulplist = data['posts'];
                    $scope.pageNum = pageNum;
                    $scope.pageCount = data['pages'];

                    if ($scope.pageCount > 1 && $scope.pageNum !== $scope.pageCount) {
                        $scope.nextPage = true;
                        $scope.nextPageNum = $scope.pageNum + 1;
                    }

                    if ($scope.pageCount > 1 && $scope.pageNum !== 1) {
                        $scope.prePage = true;
                        $scope.prePageNum = $scope.pageNum - 1;
                    }
                    myNavigator.pushPage('user/sivieleHulpPage.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load sivieleHulp Post Content
        $scope.sivieleHulpPosts = function (postId) {
            console.log('Post ID', postId);
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'skrposts.php', {"getpost" : postId})
            .success(function(data, status){
                console.log(data);
                if (status === 200 && data) {
                    modal.hide();
                    $scope.sivieleHulppost.title = data['title'];
                    $scope.sivieleHulppost.content = data['content'];
                    myNavigator.pushPage('user/sivieleHulpPost.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load kontrak Posts
        $scope.loadKontrakPosts = function (pageNum) {
            $scope.pageNum = '';
            $scope.pageCount = '';
            $scope.nextPage = false;
            $scope.nextPageNum = '';
            $scope.prePage = false;
            $scope.prePageNum = '';
            
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'akposts.php', {"page" : pageNum})
            .success(function(data, status){
                if (status === 200) {
                    modal.hide();
                    $scope.kontraklist = data['posts'];
                    $scope.pageNum = pageNum;
                    $scope.pageCount = data['pages'];

                    if ($scope.pageCount > 1 && $scope.pageNum !== $scope.pageCount) {
                        $scope.nextPage = true;
                        $scope.nextPageNum = $scope.pageNum + 1;
                    }

                    if ($scope.pageCount > 1 && $scope.pageNum !== 1) {
                        $scope.prePage = true;
                        $scope.prePageNum = $scope.pageNum - 1;
                    }
                    myNavigator.pushPage('user/kontrakDownloadsPage.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load kontrak Post Content
        $scope.kontrakPosts = function (postId) {
            console.log('Post ID', postId);
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'akposts.php', {"getpost" : postId})
            .success(function(data, status){
                console.log(data);
                if (status === 200 && data) {
                    modal.hide();
                    $scope.kontrakpost.title = data['title'];
                    $scope.kontrakpost.content = data['content'];
                    myNavigator.pushPage('user/kontrakDownloadsPost.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // send ccma lid data
        $scope.ccmalid = function() {
            var ccmaName = $scope.data.ccmaName;
            var ccmaEmail = $scope.data.ccmaEmail;
            var ccmaTel = $scope.data.ccmaTel;
            var ccmaSaak = $scope.data.ccmaSaak;
            var ccmaLid = $scope.data.ccmaLid;
            
            if (ccmaName && ccmaEmail && ccmaTel && ccmaSaak && ccmaLid) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'solccma.php', {"namesurname" : ccmaName, "number" : ccmaTel, "email" : ccmaEmail , "saak" : ccmaSaak, "lid" : ccmaLid})
                .success(function(data, status){
                    if (data['result'] === 'success') {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-thumbs-up';
                        $scope.data.errorCode = 'Dankie, ons sal u kontak met verdere besonderhede.';
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('user/home.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon nie die versoek voltooi nie, probeer asb. weer...';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Vul asb al die velde in.';
                modal.show();
            }
        };
        
        $scope.uploadedFile = function(element) {
            $scope.$apply(function($scope) {
                $scope.files = element.files;         
            });
        }

        
        //kontrak upload function
        $scope.uploadKontrak = function () {
            var files = $scope.files;
            var fd = new FormData();
            var url = apiPath + 'dienskontrak.php';
            angular.forEach(files,function(file){
                fd.append('fileToUpload',file);
            });

            fd.append("username", $scope.username);

            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';

            $http.post(url, fd, {
                withCredentials : false,
                headers : {
                    'Content-Type' : undefined
                },
                transformRequest : angular.identity
            })
            .success(function(data) {
                if (data['result'] === 'success') {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-thumbs-up';
                    $scope.data.errorCode = 'Dankie, ons sal u kontak met verdere besonderhede.';
                    modal.show();
                    $timeout(function(){
                        modal.hide();
                        myNavigator.pushPage('user/home.html', { animation : 'fade' });
                    },'2000');
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die versoek voltooi nie, probeer asb. weer...';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load wette posts
        $scope.loadwettePosts = function (pageNum) {
            $scope.pageNum = '';
            $scope.pageCount = '';
            $scope.nextPage = false;
            $scope.nextPageNum = '';
            $scope.prePage = false;
            $scope.prePageNum = '';
            
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'wposts.php', {"page" : pageNum})
            .success(function(data, status){
                if (status === 200) {
                    modal.hide();
                    $scope.wettelist = data['posts'];
                    $scope.pageNum = pageNum;
                    $scope.pageCount = data['pages'];

                    if ($scope.pageCount > 1 && $scope.pageNum !== $scope.pageCount) {
                        $scope.nextPage = true;
                        $scope.nextPageNum = $scope.pageNum + 1;
                    }

                    if ($scope.pageCount > 1 && $scope.pageNum !== 1) {
                        $scope.prePage = true;
                        $scope.prePageNum = $scope.pageNum - 1;
                    }
                    myNavigator.pushPage('user/wettePage.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // load wette Post Content
        $scope.wettePosts = function (postId) {
            console.log('Post ID', postId);
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'wposts.php', {"getpost" : postId})
            .success(function(data, status){
                console.log(data);
                if (status === 200 && data) {
                    modal.hide();
                    $scope.wettepost.title = data['title'];
                    $scope.wettepost.content = data['content'];
                    myNavigator.pushPage('user/wettePost.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // search results
        $scope.searchFiles = function (pageNum) {
            $scope.searchTerm = '';
            $scope.searchTerm = $scope.data.searhFile;
            console.log('Search Term', $scope.searchTerm);
            
            $scope.pageNum = '';
            $scope.pageCount = '';
            $scope.nextPage = false;
            $scope.nextPageNum = '';
            $scope.prePage = false;
            $scope.prePageNum = '';
            
            if ($scope.searchTerm !== '') {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'search.php', {"term" : $scope.searchTerm, "page" : pageNum})
                .success(function(data, status){
                    if (status === 200) {
                        modal.hide();
                        $scope.resultlist = data['posts'];
                        $scope.pageNum = pageNum;
                        $scope.pageCount = data['pages'];
                        
                        if ($scope.pageCount > 1 && $scope.pageNum !== $scope.pageCount) {
                            $scope.nextPage = true;
                            $scope.nextPageNum = $scope.pageNum + 1;
                        }
                        
                        if ($scope.pageCount > 1 && $scope.pageNum !== 1) {
                            $scope.prePage = true;
                            $scope.prePageNum = $scope.pageNum - 1;
                        }
                        
                        myNavigator.pushPage('user/resultsPage.html', { animation : 'fade' });
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Vul asb die soek term in.';
                modal.show();
            }
        }
        
        // search result post
        $scope.resultsPosts = function (postId) {
            console.log('Post ID', postId);
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'search.php', {"getpost" : postId})
            .success(function(data, status){
                console.log(data);
                if (status === 200 && data) {
                    modal.hide();
                    $scope.resultpost.title = data['title'];
                    $scope.resultpost.content = data['content'];
                    myNavigator.pushPage('user/resultsPosts.html', { animation : 'fade' });
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // live chat
        $scope.liveChat = function () {
            modal.show();
            $scope.data.errorIcon = 'refresh';
            $scope.data.errorIconSpin = 'true';
            $scope.data.errorCode = '';
            $http.post(apiPath + 'zopimChat.php', {"cName" : $scope.username, "cEmail" : $scope.username})
            .success(function(data, status){
                console.log(data);
                if (status === 200) {
                    modal.hide();
                } else {
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Ons kon nie die bladsy laai nie.';
                    modal.show();
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                modal.show();
            });
        };
        
        // beroepsgesondheid form submit
        $scope.bgvSubmit = function () {
            var beroepSurname = $scope.data.beroepSurname;
            var beroepName = $scope.data.beroepName;
            var beroepID = $scope.data.beroepID;
            var beroepJob = $scope.data.beroepJob;
            var beroepNumber = $scope.data.beroepNumber;
            var beroepEmail = $scope.data.beroepEmail;
            var beroepFax = $scope.data.beroepFax;
            var beroepNature_1 = $scope.data.beroepNature_1;
            var beroepNature_2 = $scope.data.beroepNature_2;
            var beroepNature_3 = $scope.data.beroepNature_3;
            var beroepNature_4 = $scope.data.beroepNature_4;
            var beroepNature_5 = $scope.data.beroepNature_5;
            var beroepNature_6 = $scope.data.beroepNature_6;
            var beroepNature_7 = $scope.data.beroepNature_7;
            var beroepNature_8 = $scope.data.beroepNature_8;
            var beroepNature_9 = $scope.data.beroepNature_9;
            var beroepNature_10 = $scope.data.beroepNature_10;
            var beroepNature_11 = $scope.data.beroepNature_11;
            var beroepNature_12 = $scope.data.beroepNature_12;
            var beroepNature_13 = '';
            var beroepDscp = $scope.data.beroepDscp;
            
            if (beroepSurname && beroepName && beroepID && beroepNumber && beroepEmail) {
                modal.show();
                $scope.data.errorIcon = 'refresh';
                $scope.data.errorIconSpin = 'true';
                $scope.data.errorCode = '';
                $http.post(apiPath + 'bgv.php', {"surname" : beroepSurname, "fullname" : beroepName, "id" : beroepID, "job" : beroepJob, "number" : beroepNumber, "email" : beroepEmail, "fax" : beroepFax, "nature_1" : beroepNature_1, "nature_2" : beroepNature_2, "nature_3" : beroepNature_3, "nature_4" : beroepNature_4, "nature_5" : beroepNature_5, "nature_6" : beroepNature_6, "nature_7" : beroepNature_7, "nature_8" : beroepNature_8, "nature_9" : beroepNature_9, "nature_10" : beroepNature_10, "nature_11" : beroepNature_11, "nature_12" : beroepNature_12, "nature_13" : beroepNature_13, "dscp" : beroepDscp})
                .success(function(data, status){
                    if (data['result'] === 'success') {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-thumbs-up';
                        $scope.data.errorCode = 'Dankie, ons sal u kontak met verdere besonderhede.';
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('user/home.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        $scope.data.errorIconSpin = 'false';
                        $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                        $scope.data.errorCode = 'Ons kon nie die versoek voltooi nie, probeer asb. weer...';
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                    $scope.data.errorIconSpin = 'false';
                    $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                    $scope.data.errorCode = 'Request failed ' + data + ' ' + status;
                    modal.show();
                });
            } else {
                $scope.data.errorIconSpin = 'false';
                $scope.data.errorIcon = 'fa fa-exclamation-triangle';
                $scope.data.errorCode = 'Vul asb al die velde in.';
                modal.show();
            }
        };
        
        // popover menu
        ons.createPopover('popover.html').then(function(popover) {
            $scope.popover = popover;
        });

        $scope.showMenu = function(e) {
            $scope.popover.show(e);
        };
        
        $scope.hideMenu = function(e) {
            $scope.popover.hide(e);
        };
        
        // external links on dynamic content
        $scope.exLink = function (link){
            var url = link.href;
            window.open(encodeURI(url), '_system', 'location=yes');
        };
    });
    
    module.controller('mapController', function($scope, NgMap, $timeout) {
        console.log("navigator.geolocation works well");
        $scope.diensmap = '';
        $scope.diensKantore = [];
        $scope.naasteKantoor;
        var vm = this;
        var myMapLat;
        var myMapLng;
        
        var onSuccess = function(position) {
            NgMap.getMap().then(function(map) {
                console.log('map', map);
                $scope.diensmap = map;

                //if (!myMapLat && !myMapLng) {
                //    myMapLat = map.getCenter().lat();
                //    myMapLng = map.getCenter().lng();
                //}

                myMapLat = position.coords.latitude;
                myMapLng = position.coords.longitude;

                console.log('My Lat: '+myMapLat+' My Lng: '+myMapLng);

                var kontoorID = find_closest_marker(myMapLat,myMapLng);

                $scope.naasteKantoor = $scope.diensKantore[kontoorID];

                $timeout(function() {
                    map.panTo(map.markers[1].getPosition());
                }, 3000);
            });

            $scope.diensKantore = [
                {'id': "0",'position': [-25.8119589,28.204227],'title': 'Pretoria Dienskantoor','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>C.o. DF Malan & Eendracht street, Kloofsig<br/>Tel: 012 644 4442/8</p>'},
                {'id': "1",'position': [-26.243825,28.246799],'title': 'Boksburg Dienskantoor','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Rondebultweg 232, Libradene, Boksburg<br/>Tel: 011 913 0783/1101</p>'},
                {'id': "2",'position': [-26.349375,27.390351],'title': 'Carletonville Dienskantoor','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Van Zyl Smit Street 74, Oberholzer, Carletonville<br/>Tel: 018 788 4861/018</p>'},
                {'id': "3",'position': [-26.713625,27.823556],'title': 'Vaaldriehoek Dienskantoor','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Rossini-boulevard 130<br/>Tel: 016 931 3160/2/4</p>'},
                {'id': "4",'position': [-23.904832,29.454921],'title': 'Pietersburg (Polokwane)','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Biccard Street 79 (3A)<br/>Tel: 015 297 0287</p>'},
                {'id': "5",'position': [-23.671742,27.741526],'title': 'Ellisras (Lephalale)','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Shop no. 4, Marula Mile Shopping Centre, 35 Louis Botha Road, Ellisras<br/>Tel: 078 802 0343</p>'},
                {'id': "6",'position': [-25.104892,30.451481],'title': 'Lydenburg','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>  Versekeringsforum Building, cnr Viljoen and Maasdorp Streets, Lydenburg<br/>Tel: 013 235 3698 / 013</p>'},
                {'id': "7",'position': [-26.493546,29.189292],'title': 'Secunda','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>First Floor, c.o. Joe Slovo- and Moor street, Extension 22, Secunda<br/>Tel: 017 634 5296</p>'},
                {'id': "8",'position': [-25.888372,29.277138],'title': 'Witbank (EMalahleni)','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Bureau de Paul 2B, Corridor Crescent, Route N4 Business Park, Ben Fleur X11<br/>Tel: 013 656 3871</p>'},
                {'id': "9",'position': [-26.845627,26.673379],'title': 'Klerksdorp','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Buffelspark, Office 2, Buffeldoorn Avenue 48, Flamwood, Klerksdorp<br/>Tel: 018 468 8539</p>'},
                {'id': "10",'position': [-25.669640,27.236803],'title': 'Rustenburg','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>C.o. Heystek- en Thabo Mbekistr. Heystek Ontwikkelaars, Kantoor 4, Total Garage, Rustenburg<br/>Tel: 014 592 4336</p>'},
                {'id': "11",'position': [-27.760639,29.931141],'title': 'Newcastle','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Harding street 79, Sanlampark, Block B, Newcastle<br/>Tel: 034 312 9711/9917</p>'},
                {'id': "12",'position': [-28.786343,32.092822],'title': 'Richards Bay','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Anglers Rod Street 12, Meerensee<br/>Tel: 035 753 1935/6</p>'},
                {'id': "13",'position': [-29.109305,26.211369],'title': 'Bloemfontein','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Street address: Kellner Street 58C, Westdene, Bloemfontein<br/>Tel: 51 430 6152/3</p>'},
                {'id': "14",'position': [-27.979357,26.734328],'title': 'Welkom','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Shop no. 5, First Floor, The Strip, Metro Village, Stateway 312, Welkom<br/>Tel: 057 352 6839</p>'},
                {'id': "15",'position': [-33.943380,25.560267],'title': 'Port Elizabeth','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>52 Sixth Avenue, Newton Park, Port Elizabeth<br/>Tel: (041)364 3219</p>'},
                {'id': "16",'position': [-27.697544,23.045171],'title': 'Kathu','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Shop No. 1B, Prosperitas Building, Rietbok Street<br/>Tel: 053 723 1604</p>'},
                {'id': "17",'position': [-33.898751,18.640014],'title': 'Bellville','icon': 'https://solidariteit.co.za/wp-content/themes/wereld-tuisblad-theme/dienskMarker.png','infoWindow': '<p>Du Toit Street 18, Bellville<br/>Tel: 021 946 4440/4418</p>'}
            ];

            var markers = [
                {'lat': -25.8119589,'lng': 28.204227},
                {'lat': -26.243825,'lng': 28.246799},
                {'lat': -26.349375,'lng': 27.390351},
                {'lat': -26.713625,'lng': 27.823556},
                {'lat': -23.904832,'lng': 29.454921},
                {'lat': -23.671742,'lng': 27.741526},
                {'lat': -25.104892,'lng': 30.451481},
                {'lat': -26.493546,'lng': 29.189292},
                {'lat': -25.888372,'lng': 29.277138},
                {'lat': -26.845627,'lng': 26.673379},
                {'lat': -25.669640,'lng': 27.236803},
                {'lat': -27.760639,'lng': 29.931141},
                {'lat': -28.786343,'lng': 32.092822},
                {'lat': -29.109305,'lng': 26.211369},
                {'lat': -27.979357,'lng': 26.734328},
                {'lat': -33.943380,'lng': 25.560267},
                {'lat': -27.697544,'lng': 23.045171},
                {'lat': -33.898751,'lng': 18.640014}
            ];

            function find_closest_marker( lat1, lon1 ) {    
                var pi = Math.PI;
                var R = 6371; //equatorial radius
                var distances = [];
                var closest = -1;
                var i;


                for( i=0;i<markers.length; i++ ) {  
                    var lat2 = markers[i].lat;
                    var lon2 = markers[i].lng;

                    var chLat = lat2-lat1;
                    var chLon = lon2-lon1;

                    var dLat = chLat*(pi/180);
                    var dLon = chLon*(pi/180);

                    var rLat1 = lat1*(pi/180);
                    var rLat2 = lat2*(pi/180);

                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rLat1) * Math.cos(rLat2); 
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                    var d = R * c;

                    distances[i] = d;
                    if ( closest === -1 || d < distances[closest] ) {
                        closest = i;
                    }
                }

                return closest;
            }
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }
        
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    });
    
    module.controller('ccmaController', function($scope, NgMap, $timeout) {
        $scope.ccmamap = '';
        $scope.ccmaKantore = [];
        $scope.ccmaKantoor;
        console.log("navigator.geolocation works well");
        var vm = this;
        var myMapLat;
        var myMapLng;
        
        var onSuccess = function(position) {
            NgMap.getMap().then(function(map) {
                //console.log('map', map);
                $scope.ccmamap = map;

                myMapLat = position.coords.latitude;
                myMapLng = position.coords.longitude;

                console.log('My Lat: '+myMapLat+' My Lng: '+myMapLng);

                var kontoorID = find_closest_marker(myMapLat,myMapLng);

                $scope.ccmaKantoor = $scope.ccmaKantore[kontoorID];

                $timeout(function() {
                    map.panTo(map.markers[1].getPosition());
                }, 3000);
            });

            $scope.ccmaKantore = [
                {'id': "0",'position': [-26.206451,28.041316],'title': 'Gauteng (National Office)','infoWindow': '<p>28 Harrison Street, Johannesburg 2001<br/>Tel: 0861 16 16 16</p>'},
                {'id': "1",'position': [-26.188769,28.318766],'title': 'Gauteng (Ekurhuleni)','infoWindow': '<p>CCMA Place, Cnr Woburn & Rothsay Street, Benoni 1500<br/>Tel: 0861 16 16 16</p>'},
                {'id': "2",'position': [-26.205826,28.044103],'title': 'Gauteng (Johannesburg)','infoWindow': '<p>CCMA Johannesburg, 127 Fox Street (Cnr. Eloff), Johannesburg 2001<br/>Tel: 0861 16 16 16</p>'},
                {'id': "3",'position': [-25.748877,28.195876],'title': 'Gauteng (Tshwane (Pretoria))','infoWindow': '<p>Metro Park Building, 351 Francis Baard Street, Pretoria 0001 <br/>Tel: 0861 16 16 16</p>'},
                {'id': "4",'position': [-26.671171,27.925780],'title': 'Gauteng (Vaal)','infoWindow': '<p>Cnr Kruger Avenue and Edward Street, Vereeniging, 1930<br/>Tel: 0861 16 16 16</p>'},
                {'id': "5",'position': [-33.021490,27.905665],'title': 'Eastern Cape (East London)','infoWindow': '<p>31 Church Street, East London 5201<br/>Tel: 0861 16 16 16</p>'},
                {'id': "6",'position': [-33.958732,25.621179],'title': 'Eastern Cape (Port Elizabeth)','infoWindow': '<p>CCMA House, 107 Govan Mbeki Avenue, Port Elizabeth 6001<br/>Tel: 0861 16 16 16</p>'},
                {'id': "7",'position': [-29.116772,26.220642],'title': 'Free State (Bloemfontein)','infoWindow': '<p>CCMA House, Cnr. Elizabeth & West-Burger Streets, Bloemfontein 9301<br/>Tel: 0861 16 16 16</p>'},
                {'id': "8",'position': [-27.978149,26.740299],'title': 'Free State (Welkom)','infoWindow': '<p>CCMA House, Phakisa Building, Cnr Ryk and Heeren Street, CBD, Welkom, 9460<br/>Tel: 0861 16 16 16</p>'},
                {'id': "9",'position': [-29.845172,30.990988],'title': 'Kwazulu Natal (Durban)','infoWindow': '<p>Aquasky Towers, 275 Anton Lembede (Smith Street), Durban 4001 <br/>Tel: 0861 16 16 16</p>'},
                {'id': "10",'position': [-29.605413,30.377699],'title': 'Kwazulu Natal (Pietermaritzburg)','infoWindow': '<p>CCMA House, 180 Langalibalele Street <br/>Tel: 0861 16 16 16</p>'},
                {'id': "11",'position': [-30.737003,30.451538],'title': 'Kwazulu Natal (Port Shepstone)','infoWindow': '<p>The Chambers, 68 Nelson Mandela Drive, Port Shepstone 4240<br/>Tel: 0861 16 16 16</p>'},
                {'id': "12",'position': [-27.758500,29.931117],'title': 'Kwazulu Natal (Newcastle)','infoWindow': '<p>71 Scott Street, Newcastle 2940<br/>Tel: 0861 16 16 16</p>'},
                {'id': "13",'position': [-28.752731,32.049248],'title': 'Kwazulu Natal (Richards Bay)','infoWindow': '<p>2nd Floor Absa Building, Lakeview  Terrace, 7 Trinidad Parking Area, Richards Bay 3900<br/>Tel: 0861 16 16 16</p>'},
                {'id': "14",'position': [-23.900800,29.453130],'title': 'Limpopo (Polokwane)','infoWindow': '<p>104 Hans Van Rensburg Street, Polokwane 0699 <br/>Tel: 0861 16 16 16</p>'},
                {'id': "15",'position': [-25.868257,29.216403],'title': 'Mpumalanga (Witbank)','infoWindow': '<p>CCMA House, 69 Kruger Street, Witbank 1035<br/>Tel: 0861 16 16 16</p>'},
                {'id': "16",'position': [-25.464036,30.983496],'title': 'Mpumalanga (Nelspruit)','infoWindow': '<p>7th Floor, Sanlam Centre Building, 25 Samora Machel, Nelspruit<br/>Tel: 0861 16 16 16</p>'},
                {'id': "17",'position': [-28.736043,24.761791],'title': 'Northern Cape (Kimberley)','infoWindow': '<p>CCMA House,5 - 13 Compound Street, Kimberley 8301<br/>Tel: 0861 16 16 16</p>'},
                {'id': "18",'position': [-26.868387,26.667750],'title': 'North West Province (Klerksdorp)','infoWindow': '<p>47-51 Siddle Street, Klerksdorp 2570<br/>Tel: 0861 16 16 16</p>'},
                {'id': "19",'position': [-25.669404,27.244385],'title': 'North West Province (Rustenburg)','infoWindow': '<p>1st Floor, Sanlam Centre, 43-45 Boom Street, Old Sanlam Building, Rustenburg <br/>Tel: 0861 16 16 16</p>'},
                {'id': "20",'position': [-33.927046,18.426174],'title': 'Western Cape (Cape Town)','infoWindow': '<p>CCMA House, 78 Darling Street, Cape Town 8001<br/>Tel: 0861 16 16 16</p>'},
                {'id': "21",'position': [-33.957662,22.459442],'title': 'Western Cape (George)','infoWindow': '<p>62 Cathedral Street, Cathedral Square 2, George, 6529<br/>Tel: 0861 16 16 16</p>'}
            ];

            var markers = [
                {'lat': -26.206451,'lng': 28.041316},
                {'lat': -26.188769,'lng': 28.318766},
                {'lat': -26.205826,'lng': 28.044103},
                {'lat': -25.748877,'lng': 28.195876},
                {'lat': -26.671171,'lng': 27.925780},
                {'lat': -33.021490,'lng': 27.905665},
                {'lat': -33.958732,'lng': 25.621179},
                {'lat': -29.116772,'lng': 26.220642},
                {'lat': -27.978149,'lng': 26.740299},
                {'lat': -29.845172,'lng': 30.990988},
                {'lat': -29.605413,'lng': 30.377699},
                {'lat': -30.737003,'lng': 30.451538},
                {'lat': -27.758500,'lng': 29.931117},
                {'lat': -28.752731,'lng': 32.049248},
                {'lat': -23.900800,'lng': 29.453130},
                {'lat': -25.868257,'lng': 29.216403},
                {'lat': -25.464036,'lng': 30.983496},
                {'lat': -28.736043,'lng': 24.761791},
                {'lat': -26.868387,'lng': 26.667750},
                {'lat': -25.669404,'lng': 27.244385},
                {'lat': -33.927046,'lng': 18.426174},
                {'lat': -33.957662,'lng': 22.459442}
            ];

            function find_closest_marker( lat1, lon1 ) {    
                var pi = Math.PI;
                var R = 6371; //equatorial radius
                var distances = [];
                var closest = -1;
                var i;


                for( i=0;i<markers.length; i++ ) {  
                    var lat2 = markers[i].lat;
                    var lon2 = markers[i].lng;

                    var chLat = lat2-lat1;
                    var chLon = lon2-lon1;

                    var dLat = chLat*(pi/180);
                    var dLon = chLon*(pi/180);

                    var rLat1 = lat1*(pi/180);
                    var rLat2 = lat2*(pi/180);

                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rLat1) * Math.cos(rLat2); 
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                    var d = R * c;

                    distances[i] = d;
                    if ( closest === -1 || d < distances[closest] ) {
                        closest = i;
                    }
                }

                return closest;
            }
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    });
})();