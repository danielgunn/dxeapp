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
            OpenFB.revokePermissions().then(
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

    .controller('LoginCtrl', function ($scope, $state, $window, ngFB, $localStorage) {

        $scope.facebookLogin = function () {

            ngFB.login({scope: 'read_stream'}).then(
                function (response) {
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');
                        if ($localStorage.chapter == null) {
                            $state.go('app.chapter-index');
                            //$location.path('/app/chapters');
                        } else {
                            //$location.path('/app/news/' + $localStorage.chapter);
                            $state.go('app.news', {chapterId: $localStorage.chapter});
                        }
                       if (!$window.sessionStorage['fbAccessToken']) {
                           throw "fbtoken not found after login" || "Assertion failure";
                       }
                    } else {
                        console.error('Facebook login succeeded');
                        alert('Facebook login failed');
                    }
                });
        };

        console.log('logining');
    })

    .controller('ProfileCtrl', function ($scope, ngFB) {
        ngFB.get({path: '/me'}).then(
            function (user) {
                console.log(JSON.stringify(user));
                $scope.user = user;
            },
            function (error) {
                console.error(error.message);
                alert(error.message);
            });
    })

    .controller('ChaptersIndexCtrl', function ($scope, ChapterService) {
        //delete $localStorage.chapter;
        $scope.chapters = ChapterService.all();
    })

    // TODO: fix the following error messages:
    // E/Web Console( 8390): $ionicLoading instance.hide() has been deprecated. Use $ionicLoading.hide().:20306

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
            $scope.loading.hide();
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
            $scope.loading.hide();
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
