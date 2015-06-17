angular.module('sociogram.services', [])

.factory('UserService', [function() {
    var sdo = {
        isLogged: false,
        username: ''
    };
    return sdo;
}])

/**
 * A simple example service that returns some data.
 */
.factory('ChapterService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chapters = [
    { id: 0, title: 'San Jose', fbid: "515856298444724", description: 'The Bay Area and main headquarters' },
    { id: 1, title: 'Vancouver', fbid: "1544022332487853", description: 'The Canada headquarters' },
    { id: 2, title: 'Chicago', fbid: "621335794581141", description: 'The Chicago branch' },
    { id: 3, title: 'Tucson', fbid: "1612669425619347", description: 'The Tucson Branch'}
  ];

  return {
    all: function() {
      return chapters;
    },
    get: function(chapterId) {
      // Simple index lookup
      return chapters[chapterId];
    }
  }
});
