function Promise(q, urlCalls, deferred) {
    q.all(urlCalls).then
                        (
                            function (results) {
                                deferred.resolve(results);
                            },
                            function (errors) {
                                deferred.reject(errors);
                            },
                            function (updates) {
                                deferred.update(updates);
                            }
                        );
}

var baseUrl = "http://www.mypromakeupartist.co.uk";