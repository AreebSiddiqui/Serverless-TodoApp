import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoDelete } from '../models/TodoDelete'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TodosTable = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.TodosTable,
        KeyConditionExpression: '#userId = :i',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':i': userId
        }
      })
      .promise()
    return result.Items as TodoItem[]
  }

  async createTodo(todos: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.TodosTable,
        Item: todos
      })
      .promise()
    return todos
  }

  async deleteTodo(todos: TodoDelete): Promise<TodoDelete> {
    await this.docClient
      .delete({
        TableName: this.TodosTable,
        Key: todos
      })
      .promise()

    return todos
  }

  async updateTodoItem(todos: TodoUpdate): Promise<TodoUpdate> {
    await this.docClient
      .update({
        TableName: this.TodosTable,
        Key: {
          userId: todos.userId,
          todoId: todos.todoId
        },
        UpdateExpression: 'set #nameId= :n, dueDate= :d, done= :dn',
        ExpressionAttributeNames: {
          '#nameId': 'name'
        },
        ExpressionAttributeValues: {
          ':n': todos.name,
          ':d': todos.dueDate,
          ':dn': todos.done
        }
      })
      .promise()
    return todos
  }
}

// Create DynamoDB
function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}
