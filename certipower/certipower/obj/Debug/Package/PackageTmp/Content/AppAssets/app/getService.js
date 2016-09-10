app.service("MainService", function ($http, $q) {
    return {
        GetData: function (urls) {
            var deferred = $q.defer();
            var urlCalls = [];
            angular.forEach(urls, function (url) {
                urlCalls.push($http.get(url.url));
            });

            Promise($q, urlCalls, deferred); // Constant Function

            return deferred.promise;
        }
    };
});

