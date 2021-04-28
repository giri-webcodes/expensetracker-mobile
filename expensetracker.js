angular.module('expenseApp',[]).controller('ExpenseTrackerController',function(){
 var exp=this;
 exp.list=[];

 //localStorage.clear();
 if(localStorage.getItem("list") !== null)
 {
 exp.list=JSON.parse(localStorage.getItem("list"));
 }

 //function
exp.Add=function(){
exp.list.push({id:(exp.list.length +1),expense:exp.newExpense,amount:exp.amount,date:exp.date});
localStorage.setItem("list",JSON.stringify(exp.list));
exp.newExpense='';
exp.amount='';
exp.date='';
document.getElementById("savealert").style.display=null;
};

exp.formatDate = function(date){
    var dateOut = new Date(date);
    return dateOut;
};

exp.sumup=function(){
  var totalExpense=0;
   angular.forEach(exp.list,function(item)
   {
    totalExpense += parseFloat(item.amount);
   });

   return totalExpense;
 
}

exp.getExpense=function()
{
    var jsonse = JSON.stringify(exp.list);
    var blob = new Blob([jsonse], {
      type: "application/json"
    });
    exp.filename = "expense_2021.json";
    saveAs(blob, exp.filename);
};


});
   