(function () {
'use strict';

angular.module('dashboardApp')
.controller('FeedController', FeedController);

FeedController.$inject = ['$scope', '$http', '$q', 'IssueFeedService'];
function FeedController($scope, $http, $q, IssueFeedService) {
  var _this = this;

  // Time for 'Last Updated'.
  _this.time = new Date();

  // Conver Hex colors to RGB
  $scope.labelBackground = function (hex) {
      if (hex === undefined) return null;
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result === null) return null;
      var rgb = {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          };
      return {
        background: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.5)',
      };
    };
    
  // Toggle Repos
  $scope.toggleRepos = function (repos) {
    var toggle;
    if(repos[0].state) toggle = false;
    else toggle = true;
    angular.forEach(repos, function (repo) {
      repo.state = toggle;
    });
  };

  // Assigned filter
  $scope.assigned =  [
    { name: 'Assigned', selected: false },
    { name: 'Unassigned', selected: false },
  ];

  // Pull Requests / Issues Filter
  $scope.pullrequests =  [
    { name: 'All Issues', selected: true },
    { name: 'Pull Requests', selected: false },
  ];

  // Ensure only 'Issues' OR 'Pull Requests' is selectd, never both
  $scope.toggleCheckbox = function (index) {
      var otherCheckbox = Math.abs(index - 1);
      $scope.pullrequests[otherCheckbox].selected = false;
    };

  // Label filters
  $scope.labels = [];
  $scope.selectedLabels = [];

  //Uncheck all filters
  $scope.uncheckAll = function (input) {
      angular.forEach(input, function (value, key) {
          value.selected = false;
        });
    };

  var promise = IssueFeedService.getRepoList();

  // Fetch list of repositories from config.json.
  promise.then(function (response) {
      _this.repos = response.data.repos;
      _this.apiToken = response.data.apiToken;

      // Get issues for each repository.
      angular.forEach(_this.repos, function (repo) {
          var promise = IssueFeedService.getIssues(repo.owner, repo.name, _this.apiToken);

          promise.then(function (response) {

              // Only add 'issues' array if open issues exist.
              if (response.data.length > 0) {
                repo.issues = response.data;

                // Populate Labels array with found Labels
                for (var i = 0; i < response.data.length; i++) {
                  var curr = response.data[i];
                  if (curr.labels) {
                    var labels = curr.labels;
                    for (var j = 0; j < labels.length; j++) {
                      if ($scope.labels.indexOf(labels[j].name) < 0) {
                        $scope.labels.push(labels[j].name);
                        $scope.selectedLabels.push({
                          name: labels[j].name,
                          selected: false,
                        });
                      }
                    }
                  }
                }
              }
            },

            function error(response) {
              console.log('An error has occurred while fetching repository issues.');
            });

        });

      console.log(_this.repos);
    },

    function error(response) {
      console.log('An error has occurred while fetching list of repositories.');
    });

}

})();
