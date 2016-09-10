app.controller("ProfileDetailCTRL", function ($scope, $http, MainService) {

    var artistId;

    // =============================== Get Specific Profile
    $scope.GetProfileById = function () {
        var profileList = [];
        var urls = [{ url: baseUrl + "/api/AppApi/GetArtistById/" + artistId }];

        MainService.GetData(urls).then(function (data) {
            profileList.push({
                ArtistId: data[0].data.ArtistID,
                ShopId: data[0].data.ShopID,
                Name: data[0].data.Name,
                ContactNo: data[0].data.ContactNo,
                Address: data[0].data.Address,
                Email: data[0].data.Email,
                Password: data[0].data.Password,
                Description: data[0].data.Bio,
                ImageUrl: data[0].data.ImageUrl,
                AccountFb: data[0].data.Account_FB,
                AccountTw: data[0].data.Account_TW
            });
            
            $scope.Name = profileList[0].Name;
            $scope.CNo = profileList[0].ContactNo;
            $scope.Address = profileList[0].Address;
            $scope.Email = profileList[0].Email;
            $scope.Description = profileList[0].Description;
            $scope.Facebook = profileList[0].AccountFb;
            $scope.Twitter = profileList[0].AccountTw;
            $scope.ImageUrl = profileList[0].ImageUrl || '/Content/AppAssets/img/bc1.jpg';
        });
    }
    // ===============================

    // =============================== Get Specific Profile
    $scope.GetPortfolio = function () {
        var portfolioList = [];
        $scope.PortfolioInfo = null;
        var urls = [{ url: baseUrl + "/api/AppApi/GetPortfolioById/" + artistId }];

        MainService.GetData(urls).then(function (data) {
            debugger;
            for (var i = 0; i < data[0].data.length; i++) {
                portfolioList.push({
                    Title: data[0].data[i].Title,
                    Description: data[0].data[i].Description,
                    ImageUrl: data[0].data[i].ImageUrl
                });
            }
            $scope.PortfolioInfo = portfolioList;
        });
    }
    // ===============================

    // =============================== On Document Ready
    angular.element(document).ready(function () {

        var urlMdn = window.location.href.split('/');
        if (urlMdn[urlMdn.length - 1] !== undefined && urlMdn[urlMdn.length - 1] !== null) {
            artistId = urlMdn[urlMdn.length - 1];
            $scope.GetProfileById();
            $scope.GetPortfolio();
        } else {
            return;
        }
    });
    // =============================== End Document Ready
});