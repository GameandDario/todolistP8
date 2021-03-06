/*jshint eqeqeq:false */
(function (window) {
  "use strict";

  /**
   * Creates a new client side storage object and will create an empty
   * collection if no collection already exists.
   *
   * @param {string} name The name of our DB we want to use
   * @param {function} callback Our fake DB uses callbacks because in
   * real life you probably would be making AJAX calls
   */
  function Store(name, callback) {
    callback = callback || function () {};

    this._dbName = name;

    if (!localStorage[name]) {
      var data = {
        todos: [],
      };

      localStorage[name] = JSON.stringify(data);
    }

    callback.call(this, JSON.parse(localStorage[name]));
  }

  /**
   * Finds items based on a query given as a JS object
   *
   * @param {object} query The query to match against (i.e. {foo: 'bar'})
   * @param {function} callback	 The callback to fire when the query has
   * completed running
   *
   * @example
   * db.find({foo: 'bar', hello: 'world'}, function (data) {
   *	 // data will return any items that have foo: bar and
   *	 // hello: world in their properties
   * });
   */
  Store.prototype.find = function (query, callback) {
    if (!callback) {
      return;
    }

    var todos = JSON.parse(localStorage[this._dbName]).todos;

    callback.call(
      this,
      todos.filter(function (todo) {
        for (var q in query) {
          if (query[q] !== todo[q]) {
            return false;
          }
        }
        return true;
      })
    );
  };

  /**
   * Will retrieve all data from the collection
   *
   * @param {function} callback The callback to fire upon retrieving data
   */
  Store.prototype.findAll = function (callback) {
    callback = callback || function () {};
    callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
  };

  /**
   * Will save the given data to the DB. If no item exists it will create a new
   * item, otherwise it'll simply update an existing item's properties
   *
   * @param {object} updateData The data to save back into the DB
   * @param {function} callback The callback to fire after saving
   * @param {number} id An optional param to enter an ID of an item to update
   */
  Store.prototype.save = function (updateData, callback, id) {
    var data = JSON.parse(localStorage[this._dbName]);
    var todos = data.todos;

    callback = callback || function () {};
    // Generate an ID
    let newId;
    let index = 0;

    //G??n??rer un id al??atoire
    const setNewId = () => {
      newId = "";
      for (var i = 0; i < 6; i++) {
        var charset = "0123456789";
        newId += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      index++;
      //console.log("newId : " + newId + index);
    };
    setNewId();
    // Test avec ID identique existant dans storage
    // newId = 194208;
    // R??sultat : il n'y a pas d'emp??chement pour un item ?? l'id identique ?? une idexistante => n??cessit?? de relever et corriger l'erreur

    //V??rifier que newId n'est pas identique ?? une id stock??e dans le localStorage via la variable todos
    todos.forEach(function (todo, index, array) {
      //console.log(todo.id, index);
      if (todo.id == newId) {
        console.log("Probl??me Id Existe", todo.id + newId);
        setNewId();
      } //else console.log("ok nouvelle Id", todo.id + newId);
    });
    //V??rifier les id dans localStorage['todos-vanillajs']

    //If an ID was actually given, find the item and update each property

    if (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          for (var key in updateData) {
            todos[i][key] = updateData[key];
          }
          break;
        }
      }

      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, todos);
    } else {
      // Assign an ID
      updateData.id = parseInt(newId);
      console.log("updateData", updateData);
      todos.push(updateData);
      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, [updateData]);
    }
  };

  /**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   * @param {function} callback The callback to fire after saving
   */
  Store.prototype.remove = function (id, callback) {
    var data = JSON.parse(localStorage[this._dbName]);
    var todos = data.todos;
    //var todoId;
    // Ici doublon via interm??diaire variable todoID donc possibilit?? de se passer de la premi??re condition.
    /* for (var i = 0; i < todos.length; i++) {
      if (todos[i].id == id) {
        todoId = todos[i].id;
      }
      if (todos[i].id == todoId) {
        todos.splice(i, 1);
      }
    } */
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id == id) {
        todos.splice(i, 1);
      }
    }
    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, todos);
  };

  /**
   * Will drop all storage and start fresh
   *
   * @param {function} callback The callback to fire after dropping the data
   */
  Store.prototype.drop = function (callback) {
    var data = { todos: [] };
    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, data.todos);
  };

  // Export to window
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
