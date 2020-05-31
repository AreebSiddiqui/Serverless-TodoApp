import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { getUploadUrl } from '../../bussinessLogic/Todo'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

const logger = createLogger('generateUploadUrl.ts')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Going to event: ', event)

  const todoId = event.pathParameters.todoId
  const uploadUrl = await getUploadUrl(todoId)
  logger.info('Generated URL: ', uploadUrl)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
