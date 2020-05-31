import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

//Importing logic for dataLayer
import { TodoAccess } from '../dataLayer/TodoAccess'

//Importing logger for generating logs
import { createLogger } from '../utils/logger'
const logger = createLogger('Todos.ts')

//Importing interfaces
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import { TodoItem } from '../models/TodoItem'
import { TodoDelete } from '../models/TodoDelete'
import { TodoUpdate } from '../models/TodoUpdate'

//Setting environment variables
const bucketName = process.env.S3_BUCKET_NAME
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const todoAccess = new TodoAccess()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

//Create
export async function create(
  createTodoRequest: CreateTodoRequest,
  user: string
): Promise<TodoItem> {
  logger.info('Hello! from create function.')

  const todoId = uuid.v4()
  const todo = await todoAccess.createTodo({
    userId: user,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  })
  return todo
}

//Get
export async function getAllTodos(user: string): Promise<TodoItem[]> {
  logger.info('Hello! from getAllTodos.')
  return await todoAccess.getAllTodos(user)
}

//Delete

export async function deleteTodoItem(
  user: string,
  todoId: string
): Promise<TodoDelete> {
  logger.info('Hello! from deleteTodoItem function')
  return await todoAccess.deleteTodo({
    userId: user,
    todoId: todoId
  })
}


//generate URL
export async function getUploadUrl(todoId: string) {
  logger.info('Function getUploadUrl', todoId)

  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  })
}

//Update
export async function updateTodoItem(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  user: string
): Promise<TodoUpdate> {
  logger.info('In function: updateTodoItem()')

  return await todoAccess.updateTodoItem({
    todoId: todoId,
    userId: user,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}
