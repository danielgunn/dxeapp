angular.module('dxe.controllers', [])

    .controller('AppCtrl', function ($scope, $state, $localStorage) {

        $scope.$storage = $localStorage;

        $scope.logout = function () {
            console.log("logging out");
            delete $localStorage.chapter;
            Parse.User.logOut();
            $state.go('app.login');
        };

        $scope.launchWall = function(fbid) {
            window.open("fb://profile/" + fbid, '_system');
        };

        $scope.setChapter = function(cid) {
            $localStorage.chapter = cid;
            console.debug("DXE chapterId set to " + $localStorage.chapter);
            $state.go('app.news', {chapterId: cid});
        };

    })

    .controller('LoginCtrl', function ($scope, $state, $localStorage, $ionicSideMenuDelegate ) {

        var drag = $ionicSideMenuDelegate.canDragContent(false);
        if (drag) {
            console.error(drag);
        }

        var fbLogged = new Parse.Promise();

        var fbLoginSuccess = function(response) {
            if (!response.authResponse){
                fbLoginError("Cannot find the authResponse");
                return;
            }
            var expDate = new Date(
                new Date().getTime() + response.authResponse.expiresIn * 1000
                ).toISOString();

            var authData = {
                id: String(response.authResponse.userID),
                access_token: response.authResponse.accessToken,
                expiration_date: expDate
            }
            fbLogged.resolve(authData);
            console.log(response);
        };

        var fbLoginError = function(error){
            fbLogged.reject(error);
        };

        $scope.facebookLogin = function() {
            console.log('Login');
            if ((!window.cordova) || cordova.platformId == "browser") {
                facebookConnectPlugin.browserInit('630915116944951', 'v2.3');
            }
            facebookConnectPlugin.login(['email'], fbLoginSuccess, fbLoginError);

            fbLogged.then( function(authData) {
                console.log('Promised');
                return Parse.FacebookUtils.logIn(authData);
            })
            .then( function(userObject) {
                facebookConnectPlugin.api('/me', null,
                    function(response) {
                        console.log(response);
                        userObject.set('name', response.name);
                        userObject.set('email', response.email);
                        userObject.save();
                    },
                    function(error) {
                        console.log(error);
                    }
                    );
                if ($localStorage.chapter == null) {
                    $state.go('app.chapter-index');
                } else {
                    $state.go('app.news', {chapterId: $localStorage.chapter});
                }
            }, function(error) {
                console.log(error);
            });
        };
    })

    .controller('ChaptersIndexCtrl', function ($scope, ChapterService) {
        //delete $localStorage.chapter;
        $scope.chapters = ChapterService.all();
    })

    .controller('ActionsCtrl', function ($scope, $stateParams, ChapterService, $localStorage, $ionicLoading) {

        if ($localStorage.chapter == null) {
            console.error("DXE chapterId is null");
        } else {
            console.debug("DXE chapterId is " + $localStorage.chapter);
        }

        $scope.chapter = ChapterService.get($localStorage.chapter);

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading actions...'
            });
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };

        $scope.launchEvent = function(eid) {
            //window.open("https://www.facebook.com/events/" + eid + "/", '_blank', 'location=no');
            window.open("fb://event/" + eid, '_system');
        };

        function loadFeed() {
            $scope.show();

            var path = $scope.chapter.fbid + "/events?fields=cover,description,name&limit=10";
            console.log("calling " + path);
            facebookConnectPlugin.api(path, ["public_profile"],
                    function (result) {
                        $scope.hide();
                        $scope.items = result.data;
                        $scope.$broadcast('scroll.refreshComplete');
                    },
                    function (error) {
                        console.error("Error: " + JSON.stringify(error));
                        alert("Failed: " + error);
                    });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    })

    .controller('NewsCtrl', function ($scope, $stateParams, ChapterService, $localStorage, $ionicLoading) {

        if ($localStorage.chapter == null) {
            console.error("DXE chapterId is null");
        } else {
            console.debug("DXE chapterId is " + $localStorage.chapter);
        }

        $scope.chapter = ChapterService.get($localStorage.chapter);

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };

        function loadFeed() {
            $scope.show();

            var path = $scope.chapter.fbid + "/posts?limit=10";
            console.log("calling " + path);
            facebookConnectPlugin.api(path, ["public_profile"],
                    function (result) {
                        $scope.hide();
                        $scope.items = result.data;
                        $scope.$broadcast('scroll.refreshComplete');
                    },
                    function (error) {
                        console.error("Error: " + JSON.stringify(error));
                        alert("Failed: " + error);
                    });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });
