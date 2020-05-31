import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import {getAllTodos} from '../../bussinessLogic/Todo'
import {createLogger} from '../../utils/logger';
import {getUserId} from '../utils';

const logger = createLogger('getTodos.ts')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Hello from /http/getTodos', event)
  const user = getUserId(event);
  const items = await getAllTodos(user)

  return{
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
