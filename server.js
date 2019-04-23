const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema4');

const app = express();

app.use('/graphql',expressGraphQL({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log("Listening");
})


