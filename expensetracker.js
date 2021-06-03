var app = angular.module('expenseApp',[]);


app.controller('ExpenseTrackerController',['$scope','$window','$filter',function($scope,$window,$filter){

//initialize $scope
 $scope.list=[];
 $scope.mlist=[];
 $scope.expenseMonth=getExpenseMonth( $scope.selectMonth);
 var editEntity=null;
 
  var params = new URLSearchParams(location.search);
  var month= params.get('month');
  if(month)
  {
    $scope.selectMonth=month;
  }
  else
{
	 $scope.selectMonth=new Date().getMonth()+1;
	}

 if(localStorage.getItem("list") !== null)
 {
 $scope.list=JSON.parse(localStorage.getItem("list"));
 }

 //function

$scope.Add=function(){
$scope.list.push({id:($scope.list.length +1),expense:$scope.newExpense,amount:parseFloat($scope.amount),date:new Date($scope.date),comment:$scope.comment});
localStorage.setItem("list",JSON.stringify($scope.list));
$scope.resetForm();
$scope.monthExp();
$("#alert").show();
$("#alert").hide(10000);
};

$scope.resetForm = function()
{
$scope.newExpense='';
$scope.amount="";
$scope.date=new Date();
$scope.comment='';
$("#expense"). focus ();
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

$scope.delete=function()
{
 if($window.confirm('Delete expense?'))
 {
  var index= $scope.list.indexOf(editEntity);
  $scope.list.splice(index,1);

  $('#alert').html('<strong>Successful:</strong> Expense deleted');
  $("#alert").show();
  localStorage.clear();
  localStorage.setItem("list",JSON.stringify($scope.list));
  $scope.monthExp();

    $window.setTimeout(function ()
    {
    $window.location.href="index.html";
     },1000);
  
 }
};


//edit function
$scope.editPage=function(id,month){
  $window.location.href="edit.html?id="+id+"&month="+month;
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
$scope.monthExp();
$("#alert").show();
$("#alert").hide(6000);
}

$scope.exportToExcel = function (){
	
  let table = document.getElementsByTagName("table");
  var fileName= getExpenseMonth($scope.selectMonth);
  fileName=fileName.replace(" ","_");
  fileName=fileName.concat(".xlsx");
  TableToExcel.convert(table[0], {
    name:fileName,
    sheet: {
      name: 'Expense List'
    }
  });
}


$scope.loadPage= function (evnt){
	 var pgid=evnt.currentTarget.getAttribute("data-pgid");
	
	 if(pgid==1)
	   $window.location.href="index.html?month="+$scope.selectMonth;
	 else if(pgid==2)
	    $window.location.href="add.html?month="+$scope.selectMonth;
	 else if(pgid==3)
	{
		var id=evnt.currentTarget.getAttribute("data-editid");
	    $window.location.href="edit.html?month="+$scope.selectMonth+"&id="+id;
	}
	 else if(pgid==4)
	    $window.location.href="report.html?month="+$scope.selectMonth;
	 
	   
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
function getExpenseMonth(month)
{
  var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
var date= new Date();
 return months[month-1] + ' ' + date.getFullYear();
}

   //sum up clicked row
function  sumup()
{ 
	var total=0;
	$("tr.chkrow").each(function() {
		var chck=$(this).find("input[type='checkbox']");
		
		if($(chck).is(':checked'))
		{
          total+=parseInt($(chck).val());
         }
});

var format = new Intl.NumberFormat('en-INR', { 

                style: 'currency', 

                currency: 'INR', 

                minimumFractionDigits: 2, 

            }); 


$('#chcksum').text(" - "+ format.format(total));
	
}
