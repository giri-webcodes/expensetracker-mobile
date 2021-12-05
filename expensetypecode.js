var app = angular.module('expenseTypeApp',[]);

app.controller('ExpenseTypeController',['$scope',function($scope){
	
	 $scope.etypelist=[];
	
 if(localStorage.getItem("etypelist") !== null)
 {
 $scope.etypelist=JSON.parse(localStorage.getItem("etypelist"));
 }
 
 $scope.Add=function ()
 {
 	
 	 $scope.etypelist.push({id:($scope.etypelist.length +1), etype: $scope.etype,date: Date.now() });
       localStorage.setItem("etypelist", angular.toJson($scope.etypelist));
       $scope.etype="";
       $("#txtadd"). focus ();
 }
 
 $scope.Clear = function ()
 {
 	      localStorage.removeItem("etypelist");
 }
 
 
}]);