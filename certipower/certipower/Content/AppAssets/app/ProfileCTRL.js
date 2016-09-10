app.controller("ProfileCTRL", function ($scope, $http, MainService) {
    // =============================== Get Profiles
    $scope.GetProfiles = function () {
        var profileList = [];
        $scope.ProfileList = null;
        var urls = [{ url: baseUrl + "/api/AppApi/GetArtists" }];
        MainService.GetData(urls).then(function (data) {
            for (var i = 0; i < data[0].data.length; i++) {
                profileList.push({
                    ArtistId: data[0].data[i].ArtistID,
                    ShopId: data[0].data[i].ShopID,
                    Name: data[0].data[i].Name,
                    ContactNo: data[0].data[i].ContactNo,
                    Address: data[0].data[i].Address,
                    Email: data[0].data[i].Email,
                    Password: data[0].data[i].Password,
                    Description: data[0].data[i].Bio,
                    ImageUrl: data[0].data[i].ImageUrl,
                    AccountFb: data[0].data[i].Account_FB,
                    AccountTw: data[0].data[i].Account_TW
                });
            }
            $scope.ProfileList = profileList;
        });
    }
    // ===============================
    // =============================== On Document Ready
    angular.element(document).ready(function () {
        $scope.GetProfiles();
    });
    // =============================== End Document Ready
});