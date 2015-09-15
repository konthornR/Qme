var app = angular.module('reservationApp', ['ja.qr','ngRoute']);

app.config(function($routeProvider, $locationProvider) {    
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
});

app.factory('socket', function(){
    if(document.location.hostname == "localhost"){
        return io.connect('http://localhost:3000');     
    }else{
        return io.connect('https://murmuring-fjord-5701.herokuapp.com/');
    }   
});

app.controller('tableQueueControl', function($scope, socket,$location){
    $scope.qrCodeString = "TEST";
    if($location.search().companyId){
         socket.emit('join company', {'CompanyId': $location.search().companyId});
    }

    $scope.selectedCustomer = {
                                Id : "",
                                Name : "",
                                QueuePosition : 0,
                                NumberOfSeats : 0
                            };

    socket.on('update table', function(data) {
        $scope.listCustomersQueue = data;
        $scope.$digest();
    });
     socket.on('update calling table', function(data) {
        $scope.listCustomersCalling = data;
        $scope.$digest();
    });

    $scope.nextQueue = function(customer){
        socket.emit('next queue', customer);
    };

    $scope.attend = function(customer){
        socket.emit('customer attend', customer);
    };

    $scope.notAttend = function(customer){
        socket.emit('customer does not attend', customer);
    };

    $scope.selectCustomer = function(customer) {
        $scope.selectedCustomer = customer;
        $scope.qrCodeString = '{"CompanyId" : "' + $location.search().companyId + '", "Id": "' + customer.Id + '"}';
    }

    $scope.getNextQueue = function(index){
        socket.emit('request customer in next queue', {'customerType': index});
    }

    socket.on('respond customer in next queue', function(data) {
        $scope.nextCustomer = data;
        $scope.$digest();
    });

    $scope.callThisQueue = function(){
        if($scope.nextCustomer && $scope.nextCustomer.Id){
            socket.emit('next queue', $scope.nextCustomer);
            $scope.nextCustomer = undefined;
        }
    }

    $scope.searchCustomerByNameAndNumSeats = function(){
        if($scope.searchCustomer && $scope.searchCustomer.Name && $scope.searchCustomer.NumberOfSeats){
            socket.emit('request customer search by name and id', $scope.searchCustomer);
        }
    }
    socket.on('respond customer search by name and id', function(data) {
        $scope.searchResultCustomers = data;
        $scope.$digest();
    });

    //Initial Table
    socket.emit('request initial table');
});

app.controller('reserveQueueControl', function($scope, socket,$location){
    $scope.qrCodeString = "TEST";
    if($location.search().companyId){
         socket.emit('join company', {'CompanyId': $location.search().companyId});
    }
    $scope.reserveSeats = function() {
        var Id = generateUniqueId();
        if($scope.customer && $scope.customer.Name != "" && IsNumeric($scope.customer.NumberOfSeats)){
            socket.emit('request reserve seats', {'Name': $scope.customer.Name, 'NumberOfSeats': $scope.customer.NumberOfSeats, 'Id': Id});
            $scope.customer.Name = "";
            $scope.customer.NumberOfSeats = "";
            $scope.qrCodeString = '{"CompanyId" : "' + $location.search().companyId+ '", "Id": "'+Id+'"}';
        }else{
            alert("Wrong Input Format: Name can not be empty and Number of Seats must be numeric");
        }        
    };

    var generateUniqueId = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
    };

    var IsNumeric = function(num) {
        return (num >=0 || num < 0);
    }
});

app.controller('createOrJoinCompanyControl', function($scope, socket,$window,$http){
    $http.get("/UserAuthentication").success(function (data) {
        if(data.isAuthenticated){
            $scope.isAuthenticated = data.isAuthenticated;
            $scope.userName = data.user.name;
        }
    });
    
    /*$http.post("/dashboard",{companyId:52}).success(function (data) {
        if(data){
            
        }
    });*/

    /*$http({
        method: 'POST',
        url: '/dashboardSectionTwo',
        data: "companyId=" + 52,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data){
        if(data){

        }
    });*/


    socket.emit('global request initial companies');
    $scope.createCompany = function() {
        if($scope.newCompany && $scope.newCompany.Name != ""){
            socket.emit('global create company', {'CompanyName': $scope.newCompany.Name});
            $scope.newCompany.Id = "";
        }    
    };

    socket.on('global update companies', function(data) {
        $scope.companies = data;
        $scope.$digest();
    });

    $scope.selectReserveQueueCompany = function(company){
        //$state.go("reserveQueue", { comapnyId: company.companyId });
        //var url = $state.href('reserveQueue', {comapnyId: company.companyId});
        //window.open(url,'_blank');

        $window.open('/reserveQueue?companyId='+company.companyId);
        //$window.location.href = '/reserveQueue.html?companyId='+company.companyId;
    };
    $scope.selectQueueListsCompany = function(company){
        $window.open('/queueLists?companyId='+company.companyId);
    };
    $scope.selectNextQueueCompany = function(company){
        $window.open('/callQueue?companyId='+company.companyId);
    };
});

app.controller('homePageControl', function($scope,$http){
    $scope.isAuthenticated = false;
    $scope.userName = null;

    $http.get("/UserAuthentication").success(function (data) {
        if(data.isAuthenticated){
            $scope.isAuthenticated = data.isAuthenticated;
            $scope.userName = data.user.name;
        }
    });
    
});

app.controller('userAndCompanyManagerControl', function($scope,$http){
    $http.post("/admin/listUser").success(function (data) {
        $scope.users = data;
    });
    $http.post("/admin/listCompany").success(function (data) {
        $scope.companies = data;
    });
    $http.post("/admin/listLink").success(function (data) {
        $scope.linksBetween = data;
    });

    /*$scope.seachUsernameById = function(userId){
        if($scope.users && $scope.users.length>0){
            for(var i = 0; i<$scope.users.length; i++){
                if($scope.users[i].id == userId){
                    return $scope.users[i].username;
                }
            }
        }
    };
    $scope.searchCompanyNameById = function(companyId){
        if($scope.companies && $scope.companies.length>0){
            for(var i = 0; i<$scope.companies.length; i++){
                if($scope.companies[i].id == companyId){
                    return $scope.companies[i].name;
                }
            }
        }
    };*/

    $scope.linkUserCompany = function(){
        if($scope.newLink && $scope.newLink.userId && $scope.newLink.companyId){
            $http({
                method: 'POST',
                url: '/admin/linkUserCompany',
                data: $scope.newLink,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data){
                    
                });
        }
    }
});


app.controller('backstoreControl', function ($scope, $http) {

    $http.post('/api/getCompaniesByUserId', '').
      then(function (response) {
          $scope.companies = response["data"];
          $scope.selectedCompany = response["data"][0];
        if (window.location.href.indexOf('dashboard') > -1){
            calloutChartSet1($scope.selectedCompany.id, false);
            calloutChartSet2($scope.selectedCompany.id, false);
        }
      }, function (response) {
          $scope.companies = null;
      });

    $scope.changeSelectedCompany = function (selected) {
        $scope.selectedCompany = selected;
        if (window.location.href.indexOf('dashboard') > -1) {
            calloutChartSet1($scope.selectedCompany.id, false);
            calloutChartSet2($scope.selectedCompany.id, false);
        }
    };
});

app.directive('companyDropdown', function () {
    return {
        restrict: 'E',
        templateUrl: '/partials/company-dropdown'
    }
});