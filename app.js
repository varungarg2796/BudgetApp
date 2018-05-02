
//BUDGET CONTROLLER
var budgetController = (function(){


})();


//UI controller
var UIcontroller = (function(){

	var DOMStrings = {
		inputType: '.add__type',
		inputDescription : '.add__description',
		inputValue : '.add__value',
		inputBtn : '.add__btn'
	}



	return { //these methods will be available to controller.
		getInput: function(){
			return{
				type: document.querySelector(DOMStrings.inputType).value,
				description : document.querySelector(DOMStrings.inputDescription).value,
				inputValue : document.querySelector(DOMStrings.inputValue).value
			}
		} , //when returning different methods, DO ADD A comma.

		getDOMStrings: function(){
			return DOMStrings;
		}
	}


})();



//GLOBAL CONTROLLER
var controller = (function(budgetCtr, UICtr){

	var DOM = UICtr.getDOMStrings();

	var ctrlAddItem = function(){

		// 1. Get the field input data

		var input = UICtr.getInput();
		console.log(input);
		console.log(input.type);


		// 2. Add the item to budget controller.
		// 3. Add the item to UI.
		// 4. Calculate the budget.
		// 5. Display the budget on the UI.

		console.log('lol')

	}

	document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem); //callback
	document.addEventListener('keypress',function(event){
		if(event.keyCode ==13){
			ctrlAddItem();
		}
	})
	

})(budgetController,UIcontroller);







/* 

Development lifecycle explanation.

--We have 3 main modules. BudgetController, UIcontroller and the controller.
  the controller integrates the two.

-- All of the modules are IIFE. And, the first two are passed into the function controller while invoking it in the end

Steps- 

1) Add the event listeners. That is, on pressing enter and clicking on the tick, console should respond. ctrlAddItem() is made to
	for the same and to dry the code.

2) 	Read the inputType, Description and value. Added all this in UIcontroller.
	--Also, made DOMStrings and passed it to controller so that if something is changed in UI,
	  it only needs to be changed once in JS.
	--Returned getInput and getDOMStrings so that they are available outside their current private scope.
	--Acquired the above through with var input and var DOM respectively.

*/
















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