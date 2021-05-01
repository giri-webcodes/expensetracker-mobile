var app = angular.module('expenseApp',[]);

app.controller('ExpenseTrackerController',['$scope','$window',function($scope,$window){

//initialize $scope
 $scope.list=[];
 $scope.expenseMonth=getExpenseMonth();
 $scope.masterTemplate="master.html";

 if(localStorage.getItem("list") !== null)
 {
 $scope.list=JSON.parse(localStorage.getItem("list"));
 }

 //function

$scope.Add=function(){
$scope.list.push({id:($scope.list.length +1),expense:$scope.newExpense,amount:parseFloat($scope.amount),date:new Date($scope.date),comment:$scope.comment});
localStorage.setItem("list",JSON.stringify($scope.list));
$scope.newExpense='';
$scope.amount=0.0;
$scope.date=new Date();
$scope.comment='';
document.getElementById("savealert").style.display=null;
};

$scope.resetForm = function()
{
$scope.newExpense='';
$scope.amount="";
$scope.date=new Date();
$scope.comment='';

};

$scope.formatDate = function(date){
    var dateOut = new Date(date);
    return dateOut;
};

$scope.sumup=function(){
  var totalExpense=0;
   angular.forEach($scope.list,function(item)
   {
    totalExpense += parseFloat(item.amount);
   });

   return totalExpense;
 
}

$scope.getExpense=function()
{
    var jsonse = JSON.stringify($scope.list);
    var blob = new Blob([jsonse], {
      type: "application/json"
    });
    $scope.filename = "expense_2021.json";
    saveAs(blob, $scope.filename);
};

$scope.delete=function(item)
{
 if($window.confirm('Delete expense?'))
 {
  var index= $scope.list.indexOf(item);
  $scope.list.splice(index,1);
  $window.alert('Expense deleted');
  localStorage.clear();
  localStorage.setItem("list",JSON.stringify($scope.list));
 }
};

}]);



app.directive('selectOnClick', ['$window', function ($window) {
  return {
      restrict: 'A',
      link: function (scope, element, attrs) {
          element.on('click', function () {
              if (!$window.getSelection().toString()) {                
                  this.setSelectionRange(0, this.value.length)
              }
          });
      }
  };
}]);

//javascript

function exportToExcel() {
  let table = document.getElementsByTagName("table");
  var fileName= getExpenseMonth();
  fileName=fileName.replace(" ","_");
  fileName=fileName.concat(".xlsx");
  TableToExcel.convert(table[0], {
    name:fileName,
    sheet: {
      name: 'Expense List'
    }
  });
}

function clearData()
{
  localStorage.clear();
}
   
function getExpenseMonth()
{
  var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];;
  var date = new Date();

 return months[date.getMonth()] + ' ' + date.getFullYear();
}

