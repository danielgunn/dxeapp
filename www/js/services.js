angular.module('dxe.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('ChapterService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chapters = 
[
    { id: 0, title: 'Global', fbid: "515856298444724", description: '' },
    { id: 1, title: 'Vancouver', fbid: "1544022332487853", description: 'British Columbia, Canada' },
    { id: 2, title: 'Chicago', fbid: "621335794581141", description: 'Illinois, US' },
    { id: 3, title: 'Tucson', fbid: "1612669425619347", description: 'Arizona, US'},
    { id: 4, title: 'SF Bay Area', fbid: "1377014279263790", description: 'California, US'},
    { id: 5, title: 'Brisbane', fbid: "1540167959561384", description: 'Queensland, Australia'},
    { id: 6, title: 'Melbourne', fbid: "891939984190758", description: 'Victoria, Australia'},
    { id: 7, title: 'Edmonton', fbid: "292519224288943", description: 'Alberta, Canada'},
    { id: 8, title: 'Fraser Valley', fbid: "462415487250958", description: 'British Columbia, Canada'},
    { id: 9, title: 'Montréal', fbid: "506931459445003", description: 'Quebec, Canada'},
    { id: 10, title: 'Ottawa', fbid: "1553448878275877", description: 'Ontario, Canada'},
    { id: 11, title: 'Toronto', fbid: "1563318063911559", description: 'Ontario, Canada'},
    { id: 12, title: 'Denmark', fbid: "256946051173433", description: ''},
    { id: 13, title: 'Chennai', fbid: "1528350530778446", description: 'India'},
    { id: 14, title: 'Italy', fbid: "914956078563803", description: ''},
    { id: 15, title: 'Lisbon', fbid: "694275917305360", description: 'Portugal'},
    { id: 16, title: 'Birmingham', fbid: "615552155223211", description: 'UK'},
    { id: 17, title: 'Bakersfield', fbid: "1629455570611023", description: 'California, US'},
    { id: 18, title: 'Baltimore', fbid: "1042665499078808", description: 'Maryland, US'},
    { id: 19, title: 'Davis', fbid: "1645974262302069", description: 'California, US'},
    { id: 20, title: 'Denver', fbid: "281871055270036", description: 'Colorado, US'},
    { id: 21, title: 'Indiana', fbid: "1556806564533740", description: 'US'},
    { id: 22, title: 'Connecticut/Massuchusetts', fbid: "341098382744673", description: 'US'},
    { id: 23, title: 'New York City', fbid: "749838431757925", description: 'New York, US'},
    { id: 24, title: 'Phoenix', fbid: "351909438339095", description: 'Arizona, US'},
    { id: 25, title: 'Portland', fbid: "100491853621182", description: 'Oregon, US'},
    { id: 26, title: 'Riverside', fbid: "352869214897341", description: 'California, US'},
    { id: 27, title: 'Salt Lake City', fbid: "788921281162791", description: 'Utah, US'},
    { id: 28, title: 'San Luis Obispo', fbid: "995613683786968", description: 'California, US'},
    { id: 29, title: 'North Bay', fbid: "1443156192668793", description: 'California, US'},
    { id: 30, title: 'Washington D.C.', fbid: "1600417690176598", description: 'US'},
    { id: 31, title: 'Edinburgh/Glasgow', fbid: "1559453380977621", description: 'Scotland, UK'},
    { id: 32, title: 'Cleveland', fbid: "605748812863860", description: 'Ohio, US'},
    { id: 33, title: 'Ithaca', fbid: "1131333500217547", description: 'New York, US'},
    { id: 34, title: 'Greater Puget Sound Area', fbid: "608657179235824", description: 'Washington, US'},
    { id: 35, title: 'Sacramento', fbid: "1471212986452302", description: 'California, US'},
    { id: 36, title: 'South Bay', fbid: "1389331911309512", description: 'California, US'}
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
