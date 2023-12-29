(function (exports) {
  "use strict";
  function View(template) {
    console.log("view created");
    this.template = template;

    this.$todoList = document.querySelector("#todo-list");
    this.$newTodo = document.querySelector("#new-todo");
    this.$clearCompleted = document.querySelector(".clear-completed");
  }

  View.prototype.bind = function (event, handler) {
    var self = this;
    if (event === "newTodo") {
      console.log("View.bind.newTodo execute!");
      var temp = self.$newTodo;
      temp.addEventListener("change", function () {
        handler(self.$newTodo.value);
      });
    }
    if (event === "itemRemove") {
      var todo = self.$todoList;
      todo.addEventListener("click", function (event) {
        var target = event.target;
        if (target.className === "destroy") {
          handler({ id: self._getItemId(target.parentNode, "li") });
        }
      });
    }

    if (event === "itemToggle") {
      var todo = self.$todoList;
      todo.addEventListener("click", function (event) {
        var target = event.target;
        if (target.className === "toggle") {
          handler({ id: self._getItemId(target), completed: target.checked });
        }
      });
    }
    if (event === "itemEdit") {
      var todo = self.$todoList;

      todo.addEventListener("dblclick", function (event) {
        var target = event.target;
        if (target.tagName.toLowerCase() === "label") {
          handler({ id: self._getItemId(target) });
        }
      });
    }
    if (event === "itemEditDone") {
      var todo = self.$todoList;
      todo.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
          var target = event.target;
          handler({ id: self._itemId(target), title: target.value });
        }
      });
    }

    if (event === "removeCompleted") {
      self.$clearCompleted.addEventListener("click", function () {
        handler();
      });
    }
  };

  View.prototype._itemId = function (element) {
    var li = element.parentNode;
    return parseInt(li.dataset.id, 10);
  };

  View.prototype._elementComplete = function (id, completed) {
    var listItem = document.querySelector('[data-id="' + id + '"');
    if (listItem) {
      listItem.className = completed ? "completed" : "";
    }
  };

  View.prototype.render = function (viewCmd, data) {
    var self = this;
    var viewCommands = {
      showEntries: function () {
        self._addItem(data);
      },
      clearNewTodo: function () {
        self.$newTodo.value = "";
      },
      removeItem: function () {
        self._removeItem(data);
      },
      elementComplete: function () {
        self._elementComplete(data.id, data.completed);
      },
      editItem: function () {
        self._editItem(data.id, data.title);
      },
      editItemDone: function () {
        self._editItemDone(data.id, data.title);
      },
    };
    viewCommands[viewCmd]();
  };

  View.prototype._editItem = function (id, title) {
    var listItem = document.querySelector('[data-id="' + id + '"]');
    if (listItem) {
      listItem.className = listItem.className + "editing";

      var input = document.createElement("input");
      input.className = "edit";

      listItem.appendChild(input);
      input.focus();
      input.value = title;
    }
  };
  View.prototype._editItemDone = function (id, title) {
    var listItem = document.querySelector('[data-id="' + id + '"]');

    if (listItem) {
      var input = document.querySelector("input.edit", listItem);
      listItem.removeChild(input);
      listItem.className = listItem.className.replace("editing", "");

      var label = document.querySelectorAll("label");
      label.forEach(function (label) {
        if (label.parentNode.parentNode === listItem) {
          label.textContent = title;
        }
      });
    }
  };
  View.prototype._removeItem = function (id) {
    var elem = document.querySelector('[data-id="' + id + '"]');
    if (elem) {
      this.$todoList.removeChild(elem);
    }
  };
  View.prototype._addItem = function (id) {
    this.$todoList.innerHTML = this.template.insert(id);
  };

  View.prototype._getItemId = function (element, tagName) {
    var li;
    if (tagName) {
      if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
        li = element.parentNode;
      }
    } else {
      li = element.parentNode.parentNode;
    }

    return parseInt(li.dataset.id, 10);
  };
  exports.app = exports.app || {};
  exports.app.View = View;
})(this);
