
//BUDGET CONTROLLER
var budgetController = (function(){


})();


//UI controller
var UIcontroller = (function(){


})();



//GLOBAL CONTROLLER
var controller = (function(budgetCtr, UICtr){

	document.querySelector('.add__btn').addEventListener('click',function(){
		// 1. Get the field input data
		// 2. Add the item to budget controller.
		// 3. Add the item to UI.
		// 4. Calculate the budget.
		// 5. Display the budget on the UI.
	});

	

})(budgetController,UIcontroller);

















//HOW MODULES WORK IN GENERAL

// var budgetController = (function(){
// 	var x = 20;

// 	var add = function(a){
// 		return x+a;
// 	}

// 	return {
// 		publicTest: function(b){
// 			return add(b)
// 		}
// 	}
// })();


// var control = (function(bc){
// 	var z = bc.publicTest(5);

// 	return {
// 		another: function(){
// 			console.log(z);
// 		}
// 	}

// })(budgetController);