const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

// this is hardcoded list of users
const users = [
    {id: '23', firstName: 'Rahul', age: 20},
    {id: '40', firstName: 'Anjali', age: 22}
];
// Please follow the naming practice to write as GraphQL always by retaining its format.
    const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt}
    }
})
// Here by specifying type: UserType it means that
// if we give Query of user with an argument of id then we simply return a type 'UserType'
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                // this resolve function actually walks into the database and pulls out the actual required results
                // currently we won't use parentValue anywhere whereas
                // args represent the id and args object specified above

                // below we are walking through our users array; finding a user having particular id
                return _.find(users, { id: args.id });
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
