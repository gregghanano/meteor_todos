Router.configure({
  layoutTemplate: 'main'
})
Todos = new Mongo.Collection('todos');
if(Meteor.isClient){
    // client code goes here
    //---- template Todos helpers ------
    Template.todos.helpers({
      'todo': function(){
        return Todos.find({}, {sort: {createdAt: -1}});
      }
    });
    //-----end------
    //----- template addTodos events ------
    Template.addTodo.events({
      'submit form':function(e){
        e.preventDefault();
        var todoName = $('[name="todoName"]').val();
        Todos.insert({
          name: todoName,
          completed: false,
          createdAt: new Date()
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
        return Todos.find().count();
      },
      'completedTodos': function(){
        return Todos.find({completed:true}).count();
      }
    })
    //------ end -------
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
