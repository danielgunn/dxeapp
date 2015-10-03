angular.module('dxe.controllers', [])

    .controller('AppCtrl', function ($scope, $state, $ionicHistory, $localStorage) {

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
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $state.go('app.news', {chapterId: cid});
        };

    })

    .controller('LoginCtrl', function ($ionicPopup, $ionicHistory, $ionicLoading, $ionicPlatform, $scope, $state, $localStorage, $ionicSideMenuDelegate, $cordovaFacebook ) {

        $scope.progress = "none";

        $scope.updateProgress = function(status) {
            console.debug("progress:" + status);
            $scope.progress = status;
            $ionicLoading.show({
                hideOnStateChange: true,
                template: "<BR><p>" + status + "</p>"
            });
        }

        $scope.hideSpinner = function() {
            $ionicLoading.hide();
        };

        $scope.$on('$ionicView.enter', function(){
            console.debug("view enter");
            $scope.updateProgress("Initializing...");
        });

        var drag = $ionicSideMenuDelegate.canDragContent(false);
        if (drag) {
            console.error(drag);
        }

        // An alert dialog
        $scope.loginFailed = function(error) {
            console.log("loginFailed:" + JSON.stringify(error));
            $scope.hideSpinner();

            var alertPopup = $ionicPopup.alert({
                title: 'Fail!',
                template: "Why? '" + error.errorMessage + " (" + error.errorCode + ")'<BR>When? '" + $scope.progress + "'",
                okText: "Let's try again"
            });

            alertPopup.then(function(res) {
                $timeout(function() {
                    $ionicPlatform.ready(function () {
                        console.debug("initial call to facebookLogin");
                        $scope.freshLogin();
                    });
                });
            }, function(fail) {
                console.log("serious? failed to show dialog: " + JSON.stringify(fail));
            });
        };
        
        $scope.parseLogin = function(userID, accessToken, expiresIn) {
            console.debug("parseLogin called");
            $scope.updateProgress("Logging in...");

            var expiration_date = new Date();
            expiration_date.setSeconds(expiration_date.getSeconds() + expiresIn);
            expiration_date = expiration_date.toISOString();

            var facebookAuthData = {
                "id": userID,
                "access_token": accessToken,
                "expiration_date": expiration_date
            };

            Parse.FacebookUtils.logIn(facebookAuthData, {
                success: function(user) {
                             if (!user.existed()) {
                                 console.debug("User signed up and logged in through Facebook!");
                             } else {
                                 console.debug("User logged in through Facebook!");
                             }
                             $scope.updateProgress("Opening page..");
                             $ionicHistory.nextViewOptions({
                                 historyRoot: true
                             });

                             if ($localStorage.chapter == null) {
                                 $state.go('app.chapter-index');
                             } else {
                                 $state.go('app.news', {chapterId: $localStorage.chapter});
                             }
                         },
                error: function(user, error) {
                           console.log("Parse.FacebookUtils.logIn:" + JSON.stringify(error));
                           console.log(JSON.stringify(user));
                           $scope.loginFailed(error);
                       }
            });

        };

        $scope.freshLogin = function() {
            $scope.updateProgress("Establishing new connection...");
            /* var facebookAuthData = {
                "id":               success.authResponse.userID,
                "access_token":     success.authResponse.accessToken,
                "expiration_date":  expiration_date
            };
            */
            $cordovaFacebook.login(["public_profile"]).then(function(success){

                console.log("success:" + JSON.stringify(success));

                $scope.parseLogin(success.authResponse.userID, success.authResponse.accessToken, success.authResponse.expiresIn);
            }, function(error) {
                console.log("cordovaFacebook.login error: " + JSON.stringify(error));
                $scope.loginFailed(error);
            });
        }

        $scope.facebookLogin = function() {
            $scope.updateProgress("Checking login status..");
            $cordovaFacebook.getLoginStatus().then(function(response){
                console.debug("Already logged in!");
                console.debug("response:");
                console.debug(JSON.stringify(response));

                if (response.status == "connected") {
                    $scope.parseLogin(response.authResponse.userID, response.authResponse.accessToken, response.authResponse.expiresIn);
                } else {
                    $scope.freshLogin();
                }
            }, function(error){
                console.log("facebookLogin fail: " + JSON.stringify(error));
                $scope.loginFailed(error);
            });
        }

        $scope.$on('$ionicView.afterEnter', function(){
            console.debug("view enter");
            $scope.updateProgress("Initializing...");

            $ionicPlatform.ready(function () {
                console.debug("initial call to facebookLogin");
                $scope.facebookLogin();
            });

        });
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
