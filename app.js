// Дэлгэцтэй ажиллах контроллер
var uiController =  (function(){
	var DomStrings = {
		inputType: ".add__type",
		inputDescription: ".add__description",
		inputAmount: ".add__value",
		addBtn: ".add__btn",
		incomeList: ".income__list",
		expenseList: ".expenses__list",
		tusuvLabel: ".budget__value",
		incomeLabel: ".budget__income--value",
		expenseLabel: ".budget__expenses--value",
		percentageLabel: ".budget__expenses--percentage",
		containerDiv: ".container",
		dateLabel: ".budget__title--month"
	}

	return {

		displayDate: function() {
			var unuudur = new Date();
			document.querySelector(DomStrings.dateLabel).textContent = unuudur.getFullYear() + " оны " + unuudur.getMonth() + " сар ";
		},

		getInput: function(){
			return{
				type: document.querySelector(DomStrings.inputType).value,
				description: document.querySelector(DomStrings.inputDescription).value,
				amount: parseInt(document.querySelector(DomStrings.inputAmount).value)
			};
		},

		getDomStrings: function(){
			return DomStrings;
		},

		clearFields: function(){
			var fields = document.querySelectorAll(
				DomStrings.inputDescription + ", " + DomStrings.inputAmount	
			);

			//Convert list to Array
			var fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(el, index, array){
				el.value = "";
			}),

			fieldsArr[0].focus();
		},

		tusuvUzuuleh: function(tusuv) {
			document.querySelector(DomStrings.tusuvLabel).textContent = tusuv.tusuv;
			document.querySelector(DomStrings.incomeLabel).textContent = tusuv.totalInc;
			document.querySelector(DomStrings.expenseLabel).textContent = tusuv.totalExp;
			document.querySelector(DomStrings.percentageLabel).textContent = tusuv.huvi + "%";
		},

		deleteListItem: function(id) {
			var el = document.getElementById(id);
			console.log("id ---> " + el);
			el.parentNode.removeChild(el);
		},

		addListItem: function(item, type) {

			var html, listType;

			if(type === 'inc'){
				listType = DomStrings.incomeList;
				html = '<div class="item clearfix" id="inc-$ID$"><div class="item__description">$DESCTIPTION$</div><div class="right clearfix"><div class="item__value">$AMOUNT$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else {
				listType = DomStrings.expenseList; 
				html = '<div class="item clearfix" id="exp-$ID$"><div class="item__description">$DESCTIPTION$</div><div class="right clearfix"><div class="item__value">$AMOUNT$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			html = html.replace('$ID$', item.id);		
			html = html.replace('$DESCTIPTION$', item.description);	
			html = html.replace('$AMOUNT$', item.amount);	

			document.querySelector(listType).insertAdjacentHTML('beforeend', html);
		}
	};
})();

// Санхүүтэй ажиллах контроллер
var financeController =  (function(){

	var Income = function(id, description, amount){
		this.id = id,
		this.description = description,
		this.amount = amount
	};

	var Expense = function(id, description, amount){
		this.id = id,
		this.description = description,
		this.amount = amount,
		this.percentage = -1
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if(totalIncome > 0) 
			this.percentage = Math.round((this.amount / totalIncome) * 100);
		else this.percentage = 0;
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.items[type].forEach(function(el){
			sum = sum + el.amount;
		}) 

		data.totals[type] = sum;
	};

  // private data
	var data = {
		items: {
		inc: [],
		exp: []
		},

		totals: {
		inc: 0,
		exp: 0
		},

		tusuv: 0,
		huvi: 0
  	};

	return {

		tusuvTootsooloh: function(){
			calculateTotal("inc");
			calculateTotal("exp");

			data.tusuv = data.totals.inc - data.totals.exp;
			data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
		},

		tusuvAvah: function() {
			return {
				tusuv: data.tusuv,
				huvi: data.huvi,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp
			}
		},
		
		deleteItem: function(type, id) {
			var ids = data.items[type].map(function(el) {
				return el.id;
			});

			var index = ids.indexOf(id);

			if(index !== -1) {
				data.items[type].slice(index, 1);
			}

		},
		

		addItem: function(type, desc, amount){	
			var item, id;

			if (data.items[type].length === 0) id = 1;
			else {
				id = data.items[type][data.items[type].length - 1].id + 1;
			}

			if(type === "inc"){
				item = new Income(id, desc, amount);
			} else {
				item = new Expense(id, desc, amount);
			}

			data.items[type].push(item);

			return item;
		},

		seeData: function(){
			return data;
		}
	};
	
})();

// Програмын холбогч контроллер
var appController =  (function(uiController,financeController){

	var ctrlAddItem = function(){
		// 1 Оруулах өгөгдлийг дэлгэцэээс олж авна
		var input = uiController.getInput();

		if(input.description !== "" && input.amount !== "")
		{
			// 2 Олж авсан өгөгдөлүүдээ санхүүгийн контроллерт дамжуулж хадгална
			var item = financeController.addItem(input.type, input.description, input.amount);

			// 3 Олж авсан өгөгдөлүүдээ тохирох хэсэгт нь гаргана
			uiController.addListItem(item, input.type);
			uiController.clearFields();
	
			updateTusuv();
	
		}
	};

	var updateTusuv = function() {
		// 4 Төсвийг тооцоолно
		financeController.tusuvTootsooloh();
	
		// 5 Эцсийн үлдэгдэл авах 
		var tusuv = financeController.tusuvAvah();

	   // 6 тооцоог дэлгэцэнд гаргана
	   uiController.tusuvUzuuleh(tusuv);
	};

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

		document.querySelector(DOM.containerDiv).addEventListener('click', function(event) {
			var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
			if(id) {
				var arr = id.split("-");
				var type = arr[0];
				var itemId = parseInt(arr[1]);

				financeController.deleteItem(type, itemId);
				console.log("original ID ----> " + id);
				uiController.deleteListItem(id);
				updateTusuv();
			}
		});
	};

	return {
		init: function() {
			uiController.displayDate();
			uiController.tusuvUzuuleh( {
				tusuv: 0,
				huvi: 0,
				totalInc: 0,
				totalExp: 0
			});
			
			setUpEventListeners();
		}
	};
	
})(uiController, financeController);

appController.init();