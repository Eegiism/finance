// Дэлгэцтэй ажиллах контроллер
var uiController =  (function(){

	var DomStrings = {
		inputType: ".add__type",
		inputDescription: ".add__description",
		inputAmount: ".add__value",
		addBtn: ".add__btn"
	}

	return {
		getInput: function(){
			return{
				type: document.querySelector(DomStrings.inputType).value,
				description: document.querySelector(DomStrings.inputDescription).value,
				amount: document.querySelector(DomStrings.inputAmount).value
			};
		},

		getDomStrings: function(){
			return DomStrings;
		}
	}
})();

// Санхүүтэй ажиллах контроллер
var financeController =  (function(){

	var Income = function(id, description, amount){
		this.id = id,
		this.description = description,
		this.amount = amount
	}

	var Expense = function(id, description, amount){
		this.id = id,
		this.description = description,
		this.amount = amount
	}

	var data = {
		items: {
			inc: [],
			exp: [] 
		},

		totals: {
			inc: 0,
			exp: 0
		}
	}

	return {
		addItem: function(type, desc, amount){
			
			var item, id;

			if(data.items[type].lenght === 0) id = 1;
			else {
				id = data.items[type][data.items[type].lenght - 1].id + 1;
			}

			if(type === 'inc'){
				item = new Income(id, desc, amount);
			} else {
				item = new Expense(id, desc, amount);
			}

			data.items[type].push(item);
		}
	}
	
})();

// Програмын холбогч контроллер
var appController =  (function(uiController,financeController){

	var ctrlAddItem = function(){
		// 1 Оруулах өгөгдлийг дэлгэцэээс олж авна
		var input = uiController.getInput();

		// 2 Олж авсан өгөгдөлүүдээ санхүүгийн контроллерт дамжуулж хадгална
		financeController.addItem(input.type, input.description, input.amount);
		// 3 Олж авсан өгөгдөлүүдээ тохирох хэсэгт нь гаргана

		// 4 Төсвийг тооцоолно

		// 5 Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана

	}

	var setUpEventListeners = function(){
		var DOM = uiController.getDomStrings();
	
		document.querySelector(DOM.addBtn).addEventListener('click', function(){
			ctrlAddItem();
		});

		document.addEventListener('keypress', function(event){
			if(event.keyCode === 13 || event.which === 13) 
			{
				ctrlAddItem();
			}
		});
	}

	return {
		init: function(){
			setUpEventListeners();
		}
	}
	
})(uiController, financeController);

appController.init();