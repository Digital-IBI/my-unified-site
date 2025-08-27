exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Netlify Functions are working!',
      path: event.path,
      method: event.httpMethod,
      timestamp: new Date().toISOString()
    })
  }
}
