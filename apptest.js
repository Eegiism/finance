// Ð”ÑÐ»Ð³ÑÑ†Ñ‚ÑÐ¹ Ð°Ð¶Ð¸Ð»Ð»Ð°Ñ… ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // exp, inc
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    getDOMstrings: function() {
      return DOMstrings;
    },

    addListItem: function(item, type) {
      // ÐžÑ€Ð»Ð¾Ð³Ð¾ Ð·Ð°Ñ€Ð»Ð°Ð³Ñ‹Ð½ ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ð¸Ð¹Ð³ Ð°Ð³ÑƒÑƒÐ»ÑÐ°Ð½ html-Ð¸Ð¹Ð³ Ð±ÑÐ»Ñ‚Ð³ÑÐ½Ñ.
      var html, list;
      if (type === "inc") {
        list = ".income__list";
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
      } else {
        list = ".expenses__list";
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Ð¢ÑÑ€ HTML Ð´Ð¾Ñ‚Ñ€Ð¾Ð¾ Ð¾Ñ€Ð»Ð¾Ð³Ð¾ Ð·Ð°Ñ€Ð»Ð°Ð³Ñ‹Ð½ ÑƒÑ‚Ð³ÑƒÑƒÐ´Ñ‹Ð³ REPLACE Ð°ÑˆÐ¸Ð³Ð»Ð°Ð¶ Ó©Ó©Ñ€Ñ‡Ð¸Ð»Ð¶
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);

      // Ð‘ÑÐ»Ñ‚Ð³ÑÑÑÐ½ HTML ÑÑ DOM Ñ€ÑƒÑƒ Ñ…Ð¸Ð¹Ð¶ Ó©Ð³Ð½Ó©.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    }
  };
})();

// Ð¡Ð°Ð½Ñ…Ò¯Ò¯Ñ‚ÑÐ¹ Ð°Ð¶Ð¸Ð»Ð»Ð°Ñ… ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€
var financeController = (function() {
  // private data
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // private data
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
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
    }
  };

  return {
    addItem: function(type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },

    seeData: function() {
      return data;
    }
  };
})();

// ÐŸÑ€Ð¾Ð³Ñ€Ð°Ð¼Ñ‹Ð½ Ñ…Ð¾Ð»Ð±Ð¾Ð³Ñ‡ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€
var appController = (function(uiController, financeController) {
  var ctrlAddItem = function() {
    // 1. ÐžÑ€ÑƒÑƒÐ»Ð°Ñ… Ó©Ð³Ó©Ð³Ð´Ð»Ð¸Ð¹Ð³ Ð´ÑÐ»Ð³ÑÑ†ÑÑÑ Ð¾Ð»Ð¶ Ð°Ð²Ð½Ð°.
    var input = uiController.getInput();

    // 2. ÐžÐ»Ð¶ Ð°Ð²ÑÐ°Ð½ Ó©Ð³Ó©Ð³Ð´Ð»Ò¯Ò¯Ð´ÑÑ ÑÐ°Ð½Ñ…Ò¯Ò¯Ð³Ð¸Ð¹Ð½ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ñ‚ Ð´Ð°Ð¼Ð¶ÑƒÑƒÐ»Ð¶ Ñ‚ÑÐ½Ð´ Ñ…Ð°Ð´Ð³Ð°Ð»Ð½Ð°.
    var item = financeController.addItem(
      input.type,
      input.description,
      input.value
    );

    // 3. ÐžÐ»Ð¶ Ð°Ð²ÑÐ°Ð½ Ó©Ð³Ó©Ð³Ð´Ð»Ò¯Ò¯Ð´ÑÑ Ð²ÑÐ± Ð´ÑÑÑ€ÑÑ Ñ‚Ð¾Ñ…Ð¸Ñ€Ð¾Ñ… Ñ…ÑÑÑÐ³Ñ‚ Ð½ÑŒ Ð³Ð°Ñ€Ð³Ð°Ð½Ð°
    uiController.addListItem(item, input.type);

    // 4. Ð¢Ó©ÑÐ²Ð¸Ð¹Ð³ Ñ‚Ð¾Ð¾Ñ†Ð¾Ð¾Ð»Ð½Ð¾
    // 5. Ð­Ñ†ÑÐ¸Ð¹Ð½ Ò¯Ð»Ð´ÑÐ³Ð´ÑÐ», Ñ‚Ð¾Ð¾Ñ†Ð¾Ð¾Ð³ Ð´ÑÐ»Ð³ÑÑ†ÑÐ½Ð´ Ð³Ð°Ñ€Ð³Ð°Ð½Ð°.
  };

  var setupEventListeners = function() {
    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function() {
      console.log("Application started...");
      setupEventListeners();
    }
  };
})(uiController, financeController);

appController.init();