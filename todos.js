Router.configure({
  layoutTemplate: 'main'
});

Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');

if(Meteor.isClient){
    // client code goes here
    //---- template Todos helpers ------
    Template.todos.helpers({
      'todo': function(){
        var currentList = this._id;
        return Todos.find({listId: currentList}, {sort: {createdAt: -1}});
      }
    });
    //-----end------
    //----- template addTodos events ------
    Template.addTodo.events({
      'submit form':function(e){
        e.preventDefault();
        var todoName = $('[name="todoName"]').val();
        var currentList = this._id;
        Todos.insert({
          name: todoName,
          completed: false,
          createdAt: new Date(),
          listId: currentList
        });
        $('[name="todoName"]').val('');
      }
    });
    //----- end ------
    //------ template todoItem helpers -----
    Template.todoItem.helpers({
      'checked':function(){
        var isCompleted = this.completed;
        return isCompleted ? "checked" : "";
      }
    });
    //------ end ------
    //------ template todoItem events ------
    Template.todoItem.events({
      'click .delete-todo':function(e){
        e.preventDefault();
        var documentId = this._id;
        var confirm = window.confirm("Delete this task?");
        if(confirm){
          Todos.remove({ _id: documentId });
        }
      },
      'keyup [name=todoItem]':function(e){
        if(event.which == 13 || event.which == 27){
          $(e.target).blur();
        } else {
          var documentId = this._id;
          var todoItem = $(e.target).val();
          Todos.update({ _id: documentId }, {$set: {name: todoItem }});
        }
      },
      'change [type=checkbox]':function(){
        var documentId = this._id;
        var isCompleted = this.completed;
        if(isCompleted){
          Todos.update({ _id: documentId }, {$set: {completed: false}});
        } else {
          Todos.update({ _id: documentId }, {$set: {completed: true}});
        }
      }
    });
    //------ end -------
    //------ template todosCount helpers ------
    Template.todosCount.helpers({
      'totalTodos': function(){
        var currentList = this._id;
        return Todos.find({listId: currentList}).count();
      },
      'completedTodos': function(){
        var currentList = this._id;
        return Todos.find({listId: currentList, completed:true}).count();
      }
    });
    //------ end -------
    //------ template Add List events ---------
    Template.addList.events({
      'submit .add-list-form':function(e){
        e.preventDefault();
        var listName = $('.add-list-input').val();
        Lists.insert({
          name: listName
        }, function(err, results){
          Router.go('listPage', {_id:results});
        });
        $('.add-list-input').val('');
      }
    });
    //------- end -------
    //------- template Add List helpers --------
    Template.lists.helpers({
      'list':function(){
        return Lists.find({}, {sort: {name: 1}});
      }
    });
    //-------- end -------
    //-------- template Register events ---------
    Template.register.events({
      'submit form':function(e){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        var fullName = $('[name=fullName]').val();
        Accounts.createUser({
          email: email,
          password: password,
          fullName: fullName
        }, function(err){
          if(err){
            console.log(err.reason);
          } else {
            Router.go('home');
          }
        });
      }
    });
    //-------- end -----------
    //----------- template login events -----------
    Template.login.events({
      'submit form':function(e){
        e.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(err){
          if(err){
            console.log(err.reason);
          } else {
            Router.go('home');
          }
        });
      }
    })
    //-------- end -----------
    //----------- template navigation events --------
    Template.navigation.events({
      'click .logout':function(e){
        e.preventDefault();
        Meteor.logout();
        Router.go('login');
      }
    })
    //--------- end ------------
}

if(Meteor.isServer){
    // server code goes here
}
//---------- Routes ---------
Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/register');
Router.route('/login');
Router.route('/list/:_id', {
  name: 'listPage',
  template:'listPage',
  data: function(){
    var currentList = this.params._id;
    return Lists.findOne({_id: currentList});
  }
});
