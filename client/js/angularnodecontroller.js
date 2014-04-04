'use strict';

var myApp = angular.module('myApp', []);

myApp.config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

/* Controllers */

function UserListCtrl($scope, $http, $templateCache) {

    var method = 'POST';
    var inserturl = 'http://localhost:1212/insertUser';
    /*$scope.codeStatus = {
                    type : "success",
                    class : "alert-success",
                    message : "Testing Message"
                };*/
    $scope.codeStatus = '';
    $scope.newUser = true;
    function resetCurrentUserData(){
        $scope.currentUser = {id:0, username:'',password:'',email:''};
    }
    resetCurrentUserData();
    resetDeleteId();
    $scope.save = function () {
        var formData = {
            'id': this.currentUser.id,
            'username': this.currentUser.name,
            'password': this.currentUser.password,
            'email': this.currentUser.email
        };
        
        var jdata = 'mydata=' + JSON.stringify(formData);

        $http({
            method: method,
            url: inserturl,
            data: jdata,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            cache: $templateCache
        }).
        success(function (response) {
            $scope.codeStatus = {
                type : "success",
                class : "alert-success",
                message : response
            };
            $scope.list();
        }).
        error(function (response) {
            $scope.codeStatus = {
                type : "error",
                class : "alert-error",
                message : response || "Request failed"
            };
        });

        $('#myModal').modal('hide');
        resetCurrentUserData();
        return false;
    };

    $scope.formModal = function(id, currentData){
        if(id && id != 0 && typeof currentData != 'undefined'){
            $scope.newUser = false;
            $scope.currentUser = currentData;
        }else{
            $scope.newUser = true;
            resetCurrentUserData();
        }
        $('#myModal').modal();
    }

    $scope.deleteModal = function(id){
        $scope.currentDeleteId = id;
        $('#deleteModal').modal();
    }

    $scope.getRecord = function(userId){
        if(userId != 0){
            var url = 'http://localhost:1212/getUser/'+userId;
            $http.get(url).success(function (data) {
            });
        }
    }

    $scope.deleteRecord = function(){
        if($scope.currentDeleteId != 0){
            var url = 'http://localhost:1212/deleteUsers/'+$scope.currentDeleteId;
            $http.get(url).success(function (data) {
                $scope.codeStatus = {
                    type : "success",
                    class : "alert-success",
                    message : data
                };
                $scope.list();
            });
            resetDeleteId();
        }
        $('#deleteModal').modal('hide');
    }

    function resetDeleteId(){
        $scope.currentDeleteId = 0;
    }


    $scope.list = function () {
        var url = 'http://localhost:1212/getAllUsers';
        $http.get(url).success(function (data) {
            $scope.users = data;
        });
    };

    $scope.list();
}

myApp.directive('notification', function($timeout){
  return {
     restrict: 'E',
     replace: true,
     scope: {
         ngModel: '='
     },
     template: '<div class="panel-body"><div class="alert {{ngModel.class}}">{{ngModel.message}}</div></div>',
     link: function(scope, element, attrs){
         element.show();
         $timeout(function(){
             element.hide();
         }, 3000);
     }
  }
});
//PhoneListCtrl.$inject = ['$scope', '$http'];