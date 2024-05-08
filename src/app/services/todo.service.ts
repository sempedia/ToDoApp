// Regular Injectable Service
// The first method that will load data from our simulated backend.

import { Injectable } from "@angular/core";
import { TODOS } from "../model/mock-data";
import { Todo } from "../model/todo.model";

// Our Injectable service will be an app SINGLETON as well.
@Injectable({providedIn: 'root'})
export class TodosService {
    // Define the API of our service that retrive all the to dos 
    // from our mock data backend
    // we will simulate a call to a backend that has a delay of 1 second
    // we make this operation asynchronous and will return a Promise
    // of Todos with the return type automatically inferred as Todos
    // we provide the Loading indicator to the user
    async getTodos() {
        await sleep(1000);
        return TODOS;
    }

    // Simulate the addition of our to dos tasks in our backend moack-data.ts.
// the method will take a Partial todo only because we simulated that 
// the backend automatically generates the identifier ID of a todo,
// we we only need to add the name and state of the todo
// The method will return a Promise of Generic Type <Todo> because we use 
// the async- await for our method and this is a Promise 
// and it will only return a promise back.
// the method will return all the object todo as a Todo type.
// the id will be generated randomly by us.
// we use spread operator ...todo to add the object.
    async addTodo(todo: Partial<Todo>): Promise<Todo> {
        await sleep(1000);
        return {
            id: Math.random().toString(36).substr(2,9),
            ...todo} as Todo;
        
    }

    // define a function for the simulation of the deletion of a todo from our backend
    // add an API called deleteTodo() that will take the id of our todo to delete
    async deleteTodo(id: string) {
        await sleep(500);
    }
    // Define a function for simulating the update of a todo in our backend
    // The API will take in the id of our todo to be updated,
    // the completed flag that we want to update 
    async updateTodo(id: string, completed: boolean) {
        await sleep(1000); // simulate the await for the server
    }
    
}

// Define the delay function as asynchronous also.
// will take the delay in miliseconds as parameter
// will return a new Promise- a manually defined Promise
// after a certain interval of time has been elapsed.
// The promise gets resolved and the delay is completed.
// The new promise will resolve this promise using setTimeout()
// settimeout(resolve, ms) will call the resolve function when 
// it will be completed so it will resolve the Promise and end the delay
async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

    

