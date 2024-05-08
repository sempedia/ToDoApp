// Create our Data Model
// We will use mock data with to do tasks
// The data will comming from the Signal Store and go 
// to a Todo Component that will display the data on acreen.

// This is how our ToDo will look like:
// We create a new type model called Todo for our to do list.

export type Todo = {
    id: string;
    title: string;
    completed: boolean;
}