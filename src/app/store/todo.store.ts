// This is our NgRx Signal Store Data Model

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Todo } from "../model/todo.model";
import { TodosService } from '../services/todo.service';
import { computed } from '@angular/core';
import { inject } from '@angular/core';

// Define the type of the Todos Fliter:
// The filter tell what to dos should be visible to the user
export type TodosFilter = "all" | "pending" | "completed";



// Define the date type that will be saved inside the store itself
// it will be an object that will contain:
// - a list of to dos as an array of type 'Todo[]'
// - to do state: 'loading' flag of type 'boolean'
// - the current 'filter' of the to dos of type 'TodosFilter'
// Define filter Todos derived property on the store state.
// This will be a derived signal that we will define for filtering the todos
type TodosState = {
    todos: Todo[];
    loading: boolean;
    filter: TodosFilter;  
}

// Define the Initial State of the Store
// - to do list is empty array initially
// - loading flag is set to 'false' so no loading indicator
// displayed to the user
// - filter is set to 'all' to show the user all to dos.
const initialState: TodosState = {
    todos: [],
    loading: false,
    filter: 'all'
};

// Define the Signal Store itself
// we use capital 'T' so this will become an Angular injector
// that we can inject anywhere in our application
// we initialize the signal store using the signalStore() API
// we will provide several arguments to our signaStore() API
// - withState() argument that take the initial state of the store
// Now we have a store injectable and we can:
// - add it as a Provider in our application and inject it
// at the level of component OR
// - we can add it to the 'root' of the dependency injection context
// and use it as a Centralized Global Store: {providedIn: 'root'}
// The store is a SINGLETON
//- add Behaviour to our store also, not only state by 
// using withMethods() that takes is as parameters:
// - factory function that accepts a couple of arguments:
// -- store- needed to define our behaviour
// --todosService that will take as value the inject() function with 
// Todosservice as parameter. The todosService will be injected here practically.
// - factory function will return an Object with few properties that will be infact
// the functions that are the behaviours of the store
 
// Define the Signal Store itself
export const TodosStore = signalStore(
    withState(initialState),
    withMethods((store, todosService = inject(TodosService)) => ({
        // define a function to load the to dos from backend on the frontend
        async loadAll() {
            patchState(store, { loading: true });
            const todos = await todosService.getTodos();
            patchState(store, { todos, loading: false });
        },
// define a function to add the to dos into our backend when the user add a new todo
// will take the input tile from user
// we will await and save the todo in the backend directly using our todosService
// with the function addTodo() that we defined there in todo.service.ts
// we pass in the partial todo object that user adds: {title, completed: false}
async addTodo(title: string) {
    // The todo is added to our backend now
    const todo = await todosService.addTodo({title, completed: false});
    // We apply the todo to our frontend store now using patchState()
    // that will take the store first and a state update function that will take in
    // a current state of the object in the store and will return a new Partial state
    // of the object in the store
    // we have patched the state and we have appended our new todo in the store
    // at the end of the todos array
    patchState(store, (state) => ({ 
        // here we have the current state of todos in store ...state.todosand
        // our new todo added- todo: added at the end of the todos array
        todos: [...state.todos, todo]
    }))

},

// define a function for the deletion of a todo from our backend and frontend store
// add an API called deleteTodo() that will take the id of our todo to delete
async deleteTodo(id: string) {
   // await for the Promise to give a resolution and then 
   // call the todosService directly with the deleteTodo() method
   // that will take the id of the todo to be deleted
   // our todo task is deleted now from backend
   await todosService.deleteTodo(id);

   // we need to patch the state where we pass in the store first and 
   // also an update function that will update the state of our store
   // to a current partial new state after the deletion of one of our todo from the list
   patchState(store, (state) => ({
    // filter the id's and find the one we deleted from backend
    // so the deletion will be done also from frontend store
    // the id of the todo  todo.id need to be different from the deleted id
    todos: state.todos.filter(todo => todo.id !== id)

   }))
},

// define a function for the the update of a todo from our backend and frontend store
// add an API called updateTodo() that will take the id of our todo to update
// and the completed flag to update
async updateTodo(id: string, completed: boolean) {
    // we call the service with the todoupdate() method
    await todosService.updateTodo(id, completed);
    
    patchState(store, (state) => ({
        // pass a new array of todos where we 
        // search for  the current state of todos and 
        // map them by searching for the todo that we want to update
        // and leave the others todos unchanged
        // on map() function we will receive a todo
        // and we want to check if this todo is the todod with the 
        // id we want to update or not.
        // If that is the case  we use ? and we create a copy
        // of the todo ...todo and overwrite the value of the completed flag
        // with the value that we just received
        // IF is not the case : we wil return the aray od todo
        todos: state.todos.map(todo => 
            todo.id == id ? {...todo, completed}: todo )
    }))
},


// Add a new store method for filtering the todos as pending or completed
// Change the currently applied filter from 'all' as it is now to pending or completed
// we use Computed Signals of Derived Signals
// the method it does not have to be an async method because the 
// change of the state from pending to completed and viceversa will be synchronous
// The method will take in the new 'filter' that we want to apply that is
// of type TodosFilter and 
// we patch the state by passing the store and a partial state object 
// that contain the {filter} not a function anymore
updateFilter(filter: TodosFilter) {
    patchState(store, {filter}); 
}


    })),
    // Define filter Todos derived property on the store state.
    // This will be a derived signal that we will define for filtering the todos
    // withComputed() will allow us to derive a new signal property
    // we will pass in a function that will take in the current 'state'
    // The returned value of this function will be an object so we will
    // wrapp it in parentheses
    // This returned object will contain all the derived properties of our store
    // - filteredTodos= a computed/derived signal defined with the computed()
    // function from the Angular API core. This is just like an effect BUT it has
    // a returned type that will be the value of the emitted signal.
    withComputed((state) => ({
        filteredTodos: computed(() => {
            // grab the todos array by accessing the state and the todos() signal
            // we create a dependency between the 2 signals:
            // - whenever the todos array gets changend the filteredTodos gets
            // automatically updated as well
            const todos = state.todos();

            // add a JS switch statement
            // access the state and the filter and
            // do a switch of the value of the filter porperty
            switch(state.filter()) {
                case 'all':
                    return todos;
                case 'pending':
                    return todos.filter(todo => !todo.completed);
                case 'completed':
                    return todos.filter(todo => todo.completed);
            }
            
        })
        
    }))
);