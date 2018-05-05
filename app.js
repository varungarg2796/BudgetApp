
//BUDGET CONTROLLER
var budgetController = (function(){

	var Expenses = function(id, description,value){
		this.id = id,
		this.description = description,
		this.value = value;
		this.percentage = -1;
	}
	var Income = function(id, description,value){
		this.id = id,
		this.description = description,
		this.value = value;
	}


	//calculates the percentage
	Expenses.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome)*100);
		}else{
			this.percentage = -1;
		}

	}


	//returns the percentage
	Expenses.prototype.getPercentage = function(){
		return this.percentage;
	}

	//to calculate the total income and expense from the data array
	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(current){
			sum = sum + current.value;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems : {
			exp : [],
			inc : []
		},

		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0 , 
		percentage : -1
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

		calculateBudget : function(){

			//calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			//calculate the budget : income -- expenses

			data.budget = data.totals.inc - data.totals.exp;

			//calculate the percentage of income  that we spent
			if(data.totals.inc > 0){
				data.percentage =  Math.round ((data.totals.exp / data.totals.inc) * 100);
			}
			else{
				data.percentage = -1 //which means non existent
			}
		},

		testing : function(){
			console.log(data);
		},

		getBudget : function(){
			return {                    // the final results to be passed to be used in controller.
				budget : data.budget,
				totalInc : data.totals.inc,
				totalExp : data.totals.exp,
				percentage : data.percentage

			};
		},

		deleteItem : function(type,id){
			var ids, index;

			ids = data.allItems[type].map(function(current){
				return current.id;
			});

			index = ids.indexOf(id);

			if(index !== -1){
				data.allItems[type].splice( index , 1); //splice(from where to delete, how many elements to delete)  --used for deletion
			}
		},

		calculatePercentages : function(){
			data.allItems.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages : function(){
			var allPerc = data.allItems.exp.map(function(cur){
				return cur.getPercentage(); //the one we created earlier. Making its array through map
			})
			return allPerc;
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
		expensesContainer : '.expenses__list',
		budgetLabel : '.budget__value',
		incomeLabel : '.budget__income--value',
		expensesLabel : '.budget__expenses--value',
		percentageLabel : '.budget__expenses--percentage',
		container : '.container',
		expensesPercLabel : '.item__percentage',
		dateLabel : '.budget__title--month'
	}


	var formatNumber = function(num , type){ //made this private as we are not using this outside the module
		var numSplit, int, dec;
		/* rules 

		1. + or - before number
		2. exactly 2 decimal points
		3. comma seprating thousands
		*/

		num = Math.abs(num);
		num = num.toFixed(2); //adds 2 decimal points and all returns the string

		numSplit = num.split('.'); //dividing the number into dec and int part.

		int = numSplit[0]; //the integer part after spliting the string num


		if(int.length > 3){
			int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
		}
		dec = numSplit[1]; //the decimal part after spliting the string num

		return (type === 'exp' ? '-':'+') + ' ' + int + '.' +dec ;


	}


	return { //these methods will be available to controller.
		getInput: function(){
			return{
				type: document.querySelector(DOMStrings.inputType).value,
				description : document.querySelector(DOMStrings.inputDescription).value,
				inputValue : parseFloat(document.querySelector(DOMStrings.inputValue).value)
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
				html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else if(type =='exp'){
				element = DOMStrings.expensesContainer; //area of expenses insertion
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'	
			}

			//replace the placeholder text with actual data.
			newHtml = html.replace('%id%',obj.id);
			newHtml = newHtml.replace('%description%',obj.description);
			newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));

			//insert it into the dom
			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

		},


		clearFields : function(){
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMStrings.inputDescription + ',' +
			DOMStrings.inputValue); //this returns a list. need to convert it to an array
			fieldsArr = Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(current,index,array){
				current.value = '';
			});
			fieldsArr[0].focus(); //focus back to description
		},

		displayBudget : function(obj) {

			

			obj.budget >= 0 ? type = 'inc' : type = 'exp';
			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget , type);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
			document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');


			if(obj.percentage > 0){
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';

			}

		},

		displayMonth : function(){
			var now,year,month,months;
			now = new Date();

			months = ['January','February','March','April','May','June','July','August',
			'September','October','November','December'];
			month = now.getMonth();
			year = now.getFullYear();
			document.querySelector(DOMStrings.dateLabel).textContent = months[month]+ ' '+ year;
		},

		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},

		displayPercentages : function(percentages){

			var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

			var nodeListForEach = function(list,callback){ //very important. first class function
				for(var i = 0; i<list.length ; i++){
					callback(list[i],i);
				}
			};

			nodeListForEach(fields, function(current,index){ //very important. first class function

				if(percentages[index] > 0){
					current.textContent = percentages[index] + '%';
				}else{
					current.textContent = '---';
				}
			})
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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); //delete event listener
	};


	var updateBudget = function(){

		//1. Calculate the budget.

		budgetController.calculateBudget();

		//2. Return the Budget.

		var budget = budgetController.getBudget(); //this is an object

		//3. Display the budget on the UI
		UIcontroller.displayBudget(budget);


	}

	var updatePercentages = function() {

		// 1. Calculate Percentage
		budgetController.calculatePercentages();

		// 2. Read percentages from the budget controller
		var percentages = budgetController.getPercentages();
		// 3. Update the UI with the new percentages
		UIcontroller.displayPercentages(percentages);
		
	}

	var ctrlDeleteItem = function(event){
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.id;
		

		if(itemID){

			//inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
			

			// 1. Delete the item from data structure.
			budgetController.deleteItem(type,ID);


			// 2. Delete the item from UI
			UIcontroller.deleteListItem(itemID);

			// 3. Update and show the new budget
			updateBudget();

			// 4. Update the percentages too
			updatePercentages();



		}
	}



	var ctrlAddItem = function(){

		var input, newItem,addItem; //new item is an object here

 
		// 1. Get the field input data
		input = UICtr.getInput();
			

		//will only run if description and numbers are legit.


		if (input.description !=="" && !isNaN(input.inputValue) && input.inputValue >0 ){

			// 2. Add the item to budget controller.
			newItem = budgetCtr.addItem(input.type, input.description, input.inputValue);
			//console.log(newItem);


			// 3. Add the item to UI.
			addItem = UICtr.addListItem(newItem, input.type);

			// 4. Clear the fields
			UICtr.clearFields();

			// 5. Calculate and update budget according to the entry
			updateBudget();

			//6. Update the percentage
			updatePercentages();


		}	
 
	}

	return {
		init: function(){
			UIcontroller.displayMonth();
			setupEventListeners();
			console.log('application has started');
			UIcontroller.displayBudget({                    
				budget : 0,
				totalInc : 0,
				totalExp : 0,
				percentage : -1

			}); // to display the normal numbers in the beg
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

7) Clearing the input fields after an item has been added.

	--Returned clearField function to controller from UIcontroller.

8) Created an updateBudget(). Moved the caluclation of budget and dispaly of budget to updateBudget()
	from ctrladdItem(). 
	ParseFloat ed the inputValue so that we get a number
	Also, added a condition that the values should be legit and if not, don't add it to UI.

9)CalculateBudget calls calculateTotal. They both compute the budget,inc,exp and perc.
These parameters are returned to the main by getBudget();

The updateBudget(which is in controller) first calls the calculateBudget() and then calls the getBudget() to get
the parameters in the form of an object. This all is done in updateBudget() which runs after an
entry is made.

10) Displaying the above calculated budget.

-- A function displayBudget(obj) is returned from UIcontroller. It is called in the updateBudget()
	It needs the budget object [which contains all the computed values] which was calculated in (9.)
	 to display the result.

	 ----This marks the completion of the basic app-----

11) Delete the enteries of expense and income

	(i) Create an event listener- An event listener was created for delete in setupeventlisteners()
		and the function it called was created in controller module. This captures the id of clicked
		element

	(ii) Delete an item from BudgetController- 

	(iii) Delete the item from UI- 
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