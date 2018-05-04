
//BUDGET CONTROLLER
var budgetController = (function(){

	var Expenses = function(id, description,value){
		this.id = id,
		this.description = description,
		this.value = value;
	}
	var Income = function(id, description,value){
		this.id = id,
		this.description = description,
		this.value = value;
	}

	var data = {
		allItems : {
			exp : [],
			inc : []
		},

		totals: {
			exp: 0,
			inc: 0
		}
	}

	return {
		addItem : function(type,des,value){ //helps to add item to budgetController
			var newItem, ID; 

			//create new ID
			if(data.allItems[type].length > 0)
			{
				//reading the id of exp[] or inc[]
				ID = data.allItems[type][data.allItems[type].length-1].id + 1;
			}
			else{
				ID = 0;
			}

			//create new item based on 'inc' or 'exp' type
			if(type == 'exp'){
				newItem = new Expenses(ID,des,value);
			}
			else if(type == 'inc'){
				newItem = new Income(ID,des,value);	
			}

			//push it into our data structure
			data.allItems[type].push(newItem);
			return newItem;
		},

		testing : function(){
			console.log(data);
		}
	}


})();


//UI controller
var UIcontroller = (function(){

	var DOMStrings = {
		inputType: '.add__type',
		inputDescription : '.add__description',
		inputValue : '.add__value',
		inputBtn : '.add__btn',
		incomeContainer : '.income__list',
		expensesContainer : '.expenses__list'
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
		} , 

		addListItem : function(obj,type){

			var html,newHtml,element;
			//create HTML string with placeholder text
			if(type =='inc'){
				element = DOMStrings.incomeContainer; //area of income insertion
				html ='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else if(type =='exp'){
				element = DOMStrings.expensesContainer; //area of expenses insertion
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'	
			}

			//replace the placeholder text with actual data.
			newHtml = html.replace('%id%',obj.id);
			newHtml = newHtml.replace('%description%',obj.description);
			newHtml = newHtml.replace('%value%',obj.value);

			//insert it into the dom
			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

		}
	}


})();



//GLOBAL CONTROLLER
var controller = (function(budgetCtr, UICtr){

	var setupEventListeners = function(){
		var DOM = UICtr.getDOMStrings();
		document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem); //callback
		document.addEventListener('keypress',function(event){
			if(event.keyCode ==13){
				ctrlAddItem();
			}
		});
	};

	var ctrlAddItem = function(){

		var input, newItem,addItem; //new item is an object heres
		// 1. Get the field input data
		input = UICtr.getInput();
		console.log(input);
		console.log(input.type);

		// 2. Add the item to budget controller.
		newItem = budgetCtr.addItem(input.type, input.description, input.inputValue);
		console.log(newItem);


		// 3. Add the item to UI.
		addItem = UICtr.addListItem(newItem, input.type);


		// 4. Calculate the budget.
		// 5. Display the budget on the UI.

	}

	return {
		init: function(){
			setupEventListeners();
			console.log('application has started');
		}
	};
	
	

})(budgetController,UIcontroller);



controller.init(); //the only line of code outside the modules


/* 

Development lifecycle explanation.

--We have 3 main modules. BudgetController, UIcontroller and the controller.
  the controller integrates the two.

-- All of the modules are IIFE(private). And, the first two are passed into the function controller while invoking it in the end
-- the variables from each module need to be returned to be accessed by the other modules.

   UIcontroller -------- 
						|
						|
						|
				    controller
						|
  						|
						|
Budgetcontroller --------

Steps- 

1) Add the event listeners. That is, on pressing enter and clicking on the check icon, console should respond. ctrlAddItem() is made to
	for the same and to also dry(do not repeat yourself) the code.

2) 	Read the inputType, Description and value. Added all this in UIcontroller.
	--Also, made DOMStrings and passed it to controller so that if something is changed in UI,
	  it only needs to be changed once in JS.
	--Returned getInput and getDOMStrings so that they are available outside their current private scope.
	--Acquired the above through with var input and var DOM respectively.

3) Create init function
	--And put the code which we want to execute as soon as the application starts in it.
	-- In this app, we want the eventListeners to start listening as soon as the application starts.
	-- we return the init function (as controller is iife which makes it private)
	   and then call it outside the module (controller.init());

4) Choosing appropriate DS for BudgetController
	-- Created expenses and incomes constructor
	-- Created an object data which stores
		-- a key 'allitems' which has another object 
					-- inc : empty array
					-- exp : empty arra
		-- a key  'totals' which contains
					--inc : value 0
					--exp : value 0			

		To represent the object data, 
					-data
						-allitems
							inc   --array
							exp   --array
						-totals
							inc
							exp 
	
5) Adding item to our budgetController

	-- Returned an addItem function to controller from budgetController. Created an ID
		in exp[] and inc[] array to make the ids throughout consistent.

6) Adding a new item to the UI

	--Returned an addListItem function to controller from UIcontroller. new methods used-
	 .replace() and .insertAdjacentHTML(). 


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