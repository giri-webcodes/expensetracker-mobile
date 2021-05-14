var app = angular.module('expenseApp',[]);

app.controller('ExpenseTrackerController',['$scope','$window','$filter',function($scope,$window,$filter){

//initialize $scope
 $scope.list=[];
 $scope.mlist=[];
 $scope.selectMonth=new Date().getMonth()+1;
 $scope.expenseMonth=getExpenseMonth( $scope.selectMonth);
 var editEntity=null;
 

 if(localStorage.getItem("list") !== null)
 {
 $scope.list=JSON.parse(localStorage.getItem("list"));
 }

 //function

$scope.Add=function(){
$scope.list.push({id:($scope.list.length +1),expense:$scope.newExpense,amount:parseFloat($scope.amount),date:new Date($scope.date),comment:$scope.comment});
localStorage.setItem("list",JSON.stringify($scope.list));
$scope.newExpense='';
$scope.amount='';
$scope.date=new Date();
$scope.comment='';
document.getElementById("alert").style.display=null;
};

$scope.resetForm = function()
{
$scope.newExpense='';
$scope.amount="";
$scope.date=new Date();
$scope.comment='';

};

$scope.monthExp = function() {
$scope.mlist=[];
$scope.totalExpense=0;
$scope.totalIncome=0;

 $scope.expenseMonth=getExpenseMonth( $scope.selectMonth);
angular.forEach($scope.list,function(item)
   {
      var month =new Date(item.date).getMonth()+1;
      if(month== $scope.selectMonth)
      {
      	 $scope.mlist.push(item);
     
     	if(item.expense !=='Income')
   {
      $scope.totalExpense += parseFloat(item.amount);
    }
    else
{
	      $scope.totalIncome += parseFloat(item.amount);
	}
      }
   });

};

$scope.formatAmount= function(row){
    var color='black';
    
    if(row.amount >2000)
    {  
    	 color='red';
    }
    
      if(row.expense ==='Income')
    {  
    	 color='green';
    }
    
    return {
    	"color": color
    	}
};



$scope.sumup=function(){
 
  $scope.totalExpense=0;
  $scope.totalIncome=0;
   angular.forEach($scope.mlist,function(item)
   {
   	if(item.expense !=='Income')
   {
      $scope.totalExpense += parseFloat(item.amount);
    }
    else
{
	      $scope.totalIncome += parseFloat(item.amount);
	}
  return true;
       
   });
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

$scope.delete=function()
{
 if($window.confirm('Delete expense?'))
 {
  var index= $scope.list.indexOf(editEntity);
  $scope.list.splice(index,1);
  $('#alert').show();
  $('#alert').html('<strong>Successful:</strong> Expense deleted');
  localStorage.clear();
  localStorage.setItem("list",JSON.stringify($scope.list));
 }
};


//edit function
$scope.editPage=function(id){
  $window.location.href="edit.html?id="+id;
};

$scope.loadEditData=function()
{
  const params = new URLSearchParams(location.search);
  var id= params.get('id');
  var item= $filter('filter')($scope.list, {'id':id});
 if(item.length){
  editEntity=item[0];
 $scope.newExpense=item[0].expense;
$scope.amount=item[0].amount;
$scope.date=new Date(item[0].date);
$scope.comment=item[0].comment;
 }
};

$scope.update=function(){
var index=  $scope.list.indexOf(editEntity);
$scope.list.splice(index,1);
$scope.list.push({id:editEntity.id,expense:$scope.newExpense,amount:parseFloat($scope.amount),date:new Date($scope.date),comment:$scope.comment});
localStorage.clear();
localStorage.setItem("list",JSON.stringify($scope.list));
document.getElementById("alert").style.display=null;
}

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
   
function getExpenseMonth(month)
{
  var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
var date= new Date();
 return months[month-1] + ' ' + date.getFullYear();
}
