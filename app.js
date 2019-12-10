
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express()

// connect to mongodb cluster
const { MONGO_USER, MANGO_PASSWORD, MONGO_DB } = process.env
mongoose.connect(`mongodb+srv://${MONGO_USER}:${MANGO_PASSWORD}@travelx-tuxf0.mongodb.net/${MONGO_DB}?retryWrites=true`, { useNewUrlParser: true }).then(() => {
  // app can listen from port 8000, 3000 is used by front end
  app.listen(8000)
}).catch(err => {
  console.log(err)
})


app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  
  next()
})


app.use(isAuth)


app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}))
