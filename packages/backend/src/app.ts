import express, { Application, json, Request, Response } from 'express'
import cors from 'cors'
import { timeStamp } from 'console'
import TodoItem from '@my-todo-app/shared'
import crypto from "crypto"
import dotenv from "dotenv"
import { fstat, readFile, writeFile } from "fs"


dotenv.config();

const app: Application = express()
app.use(cors()) //TODO Configure the CORS properly to make the app secure.
app.use(json())
const port: number = parseInt(process.env.SERVER_PORT || "3001")

const TODO_FILE = process.env.TODO_FILE || "todos.json"
let TODO_ITEMS: TodoItem[] = [];

readFile(TODO_FILE, (err, data) => {
    if (err) throw err
    TODO_ITEMS = JSON.parse(data.toString()) as unknown as TodoItem[]
    console.log("Loaded todo items:", TODO_ITEMS)
})

function writeTodosToFile(todoItems: TodoItem[]) {
    writeFile(TODO_FILE, JSON.stringify(todoItems), (err) => {
        console.error("Error writing todos to file!", err)
    })
}

app.get('/todos', (req: Request, res: Response<TodoItem[]>) => {
    res.send(TODO_ITEMS)
})

app.post('/todos', (req: Request<TodoItem>, res: Response<TodoItem[]>) => {
    const todoItem = req.body
    todoItem.id = crypto.randomUUID()
    console.log("Got new todo item:", todoItem)
    TODO_ITEMS.push(todoItem)
    writeTodosToFile(TODO_ITEMS)
    res.send(TODO_ITEMS)
})

app.listen(port, async function () {
    console.log(`App is listening on port ${port} !`)
})
