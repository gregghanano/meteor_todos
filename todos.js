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
    //------ template todoItem events ------
    Template.todoItem.events({
      'click .delete-todo':function(e){
        e.preventDefault();
        var documentId = this._id;
        var confirm = window.confirm("Delete this task?");
        if(confirm){
          Todos.remove({ _id: documentId });
        }
      }
    });
    //------ end -------
}

if(Meteor.isServer){
    // server code goes here
}
