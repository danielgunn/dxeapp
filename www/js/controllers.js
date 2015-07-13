angular.module('dxe.controllers', ['ngOpenFB'])

    .controller('AppCtrl', function ($scope, $state, ngFB, $localStorage) {

        $scope.$storage = $localStorage;

        $scope.logout = function () {
            console.log("logging out");
            delete $localStorage.chapter;
            ngFB.logout().then(
                function(){
                    console.debug("logged out");
                },
                function(error) {
                    console.error(JSON.stringify(error));
                    alert(error);
                });
            $state.go('app.login');
        };

        $scope.launchWall = function(fbid) {
            window.open("https://www.facebook.com/" + fbid + "/", '_blank', 'location=no');
        };

        $scope.revokePermissions = function () {
            ngFB.revokePermissions().then(
                function () {
                    $state.go('app.login');
                },
                function () {
                    console.error("revoke permissions failed");
                    alert('Revoke permissions failed');
                });
        };

        $scope.setChapter = function(cid) {
            $localStorage.chapter = cid;
            console.debug("DXE chapterId set to " + $localStorage.chapter);
            $state.go('app.news', {chapterId: cid});
        };

    })

    .controller('LoginCtrl', function ($scope, $state, $window, ngFB, $localStorage, $ionicSideMenuDelegate) {

        var drag = $ionicSideMenuDelegate.canDragContent(false);
        if (drag) {
            console.error(drag);
        }

        $scope.facebookLogin = function () {

            ngFB.login({scope: 'public_profile'}).then(
                function (response) {
                    var drag = 0;
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');
                        drag = $ionicSideMenuDelegate.canDragContent(true);
                        if (!drag) {
                            console.error(drag);
                        }
                        if ($localStorage.chapter == null) {
                            $state.go('app.chapter-index');
                        } else {
                            $state.go('app.news', {chapterId: $localStorage.chapter});
                        }
                       if (!$window.sessionStorage['fbAccessToken']) {
                           throw "fbtoken not found after login" || "Assertion failure";
                       }
                    } else {
                        console.error('Facebook login failed: ' + JSON.stringify(response));
                        alert('Facebook login failed');
                    }
                });
        };

        console.log('logining');
    })

    .controller('ChaptersIndexCtrl', function ($scope, ChapterService) {
        //delete $localStorage.chapter;
        $scope.chapters = ChapterService.all();
    })

    .controller('ActionsCtrl', function ($scope, $stateParams, ngFB, ChapterService, $localStorage, $ionicLoading) {

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
            window.open("https://www.facebook.com/events/" + eid + "/", '_blank', 'location=no');
        };

        //TODO: just saw ngFB.getLoginStatus.. should use it

        function loadFeed() {
            $scope.show();

            ngFB.api({
                method: 'GET',
                path: '/' + $scope.chapter.fbid + '/events',
                params: {fields: "cover, description, name", limit: 30}}).then(
                function(result) {
                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                },
                function (error) {
                    //TODO: handle session expiry??
                    //example:
                    //{"message":"Error validating access token: Session has expired on Sunday, 12-Jul-15 02:00:00 PDT. The current time is Sunday, 12-Jul-15 02:03:48 PDT.","type":"OAuthException","code":190,"error_subcode":463}(anonymous function) @ controllers.js:175processQueue @ ionic.bundle.js:21888(anonymous function) @ ionic.bundle.js:21904$get.Scope.$eval @ ionic.bundle.js:23100$get.Scope.$digest @ ionic.bundle.js:22916(anonymous function) @ ionic.bundle.js:23139completeOutstandingRequest @ ionic.bundle.js:13604(anonymous function) @ ionic.bundle.js:13984
                    $scope.hide();
                    console.error(JSON.stringify(error));
                    alert(error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    })

    .controller('NewsCtrl', function ($scope, $stateParams, ngFB, ChapterService, $localStorage, $ionicLoading) {

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

            ngFB.api({
                method: 'GET',
                path: '/' + $scope.chapter.fbid + '/posts',
                params: {limit: 30}}
            ).then(
                function(result) {
                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                },
                function (error) {
                    $scope.hide();
                    console.error(JSON.stringify(error));
                    alert(error.message);
                });

        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });
