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

    .controller('LoginCtrl', function ($scope, $state, $localStorage, $ionicSideMenuDelegate, $cordovaFacebook ) {

        var drag = $ionicSideMenuDelegate.canDragContent(false);
        if (drag) {
            console.error(drag);
        }

        $scope.facebookLogin = function(){

            //Browser Login
            if(!(ionic.Platform.isIOS() || ionic.Platform.isAndroid())){

                Parse.FacebookUtils.logIn(null, {
                    success: function(user) {
                                 console.log(user);
                                 if (!user.existed()) {
                                     alert("User signed up and logged in through Facebook!");
                                 } else {
                                     alert("User logged in through Facebook!");
                                 }
                             },
                    error: function(user, error) {
                               alert("User cancelled the Facebook login or did not fully authorize.");
                           }
                });

            }
            //Native Login
            else {

                $cordovaFacebook.login(["public_profile", "email"]).then(function(success){

                    console.log("success:" + JSON.stringify(success));

                    var expiration_date = new Date();
                    expiration_date.setSeconds(expiration_date.getSeconds() + success.authResponse.expiresIn);
                    expiration_date = expiration_date.toISOString();

                    var facebookAuthData = {
                        "id": success.authResponse.userID,
                        "access_token": success.authResponse.accessToken,
                        "expiration_date": expiration_date
                    };

                    Parse.FacebookUtils.logIn(facebookAuthData, {
                        success: function(user) {
                                     console.log("heres the user:" + JSON.stringify(user));
                                     if (!user.existed()) {
                                         console.log("User signed up and logged in through Facebook!");
                                     } else {
                                         console.log("User logged in through Facebook!");
                                     }

                                     if ($localStorage.chapter == null) {
                                         $state.go('app.chapter-index');
                                     } else {
                                         $state.go('app.news', {chapterId: $localStorage.chapter});
                                     }
                                 },
                        error: function(user, error) {
                                   console.log("User cancelled the Facebook login or did not fully authorize.");
                               }
                    });

                }, function(error){
                    console.log(error);
                });

            }

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
