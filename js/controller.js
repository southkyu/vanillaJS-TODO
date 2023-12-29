(function (exports) {
  "use strict";
  function Controller(model, view) {
    console.log("controller created");
    this.model = model;
    this.view = view;

    var self = this;
    //bind를 통해 레코드 변경을 자동적으로 view에 반영한다.
    this.view.bind("newTodo", function (title) {
      self.addItem(title);
    });
    this.view.bind("itemRemove", function (item) {
      self.removeItem(item.id);
    });
    this.view.bind("itemToggle", function (item) {
      self.toggleCompleted(item.id, item.completed);
    });
    this.view.bind("itemEdit", function (item) {
      self.editItem(item.id);
    });
    this.view.bind("itemEditDone", function (item) {
      self.editItemSave(item.id, item.title);
    });
    this.view.bind("removeCompleted", function () {
      self.removeCompletedItems();
    });
    this.showAll();
  }
  Controller.prototype.removeCompletedItems = function () {
    var self = this;
    self.model.read({ completed: true }, function (data) {
      data.forEach(function (item) {
        if (item.completed) {
          self.removeItem(item.id);
        }
      });
    });
  };
  Controller.prototype.editItem = function (id) {
    var self = this;
    self.model.read(id, function (data) {
      self.view.render("editItem", { id: id, title: data[0].title });
    });
  };
  Controller.prototype.editItemSave = function (id, title) {
    var self = this;
    title = title.trim();

    if (title.length !== 0) {
      self.model.update(id, { title: title }, function () {
        self.view.render("editItemDone", { id: id, title: title });
      });
    } else {
      self.removeItem(id);
    }
  };
  Controller.prototype.toggleCompleted = function (id, completed) {
    var self = this;
    self.model.update(id, { completed: completed }, function () {
      self.view.render("elementComplete", {
        id: id,
        completed: completed,
      });
    });
  };
  Controller.prototype.removeItem = function (id) {
    var self = this;
    self.model.remove(id, function () {
      self.view.render("removeItem", id);
    });
  };
  Controller.prototype.showAll = function () {
    var self = this;
    this.model.read(function (data) {
      self.view.render("showEntries", data);
    });
  };
  Controller.prototype.addItem = function (title) {
    var self = this;
    if (title.trim() === "") {
      return;
    }
    self.model.create(title, function () {
      self.view.render("clearNewTodo", title);
    });
    this.showAll();
  };
  exports.app = exports.app || {};
  exports.app.Controller = Controller;
})(this);
