(function () {
'use strict';

angular.module('dashboardApp')
.filter('pullRequests', pullRequests);

function pullRequests() {

  return function (input, pullrequests) {
        var out = [];
        angular.forEach(input, function (issue) {

            // If neither 'Pull Requests' nor 'Issues' is selected, show all.
            if (!pullrequests[0].selected && !pullrequests[1].selected) {
              out.push(issue);
            }

            // If 'Pull Requests' filter is selected AND issue is a PR, then show.
            else if (pullrequests[1].selected && issue.pull_request !== undefined) {
              out.push(issue);
            }

            // Else if 'All Issues' is selected, show all.
            else if (pullrequests[0].selected) {
              out.push(issue);
            }
          });

        return out;
      };
}

})();
