import { CreateTodoRequest } from './../../requests/CreateTodoRequest';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
// import * as AWS from 'aws-sdk'
// import * as uuid from 'uuid' 
import {getUserId} from '../utils'
import {createLogger} from '../../utils/logger'
import {create} from '../../bussinessLogic/Todo'
const logger = createLogger('createTodo.ts')
// const docClient = new AWS.DynamoDB.DocumentClient()
// const groupTable = process.env.GROUP_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', event);
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const user  = getUserId(event);
  
  // TODO: Implement creating a new TODO item
 
  const newItem = await create(newTodo,user);
  logger.info('Form newItem', event);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body:JSON.stringify( {
      item: {...newItem}
    })
  }
}
