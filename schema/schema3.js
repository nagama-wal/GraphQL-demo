const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

// We will introduce new company type to associate with users
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString}
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                //resolve function is needed to return the company of the said user.
                console.log("parentValue", parentValue, "args", args);
                // it prints ==>> parentValue { id: '23', firstName: 'Rahul', age: 20, companyId: '1' } args {}
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data)
                //
            }
        }
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
                // Note that we always have to return a promise from the resolve function
                // We will replace the previous lodash function call into a axios request to our locally setup json server
                // since we are using ES6 syntax below remember to put back ticks in the template string.
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data)
                // here we have to write .then which will transform axios's return format as response to response.data
                // because unfortunately Graphql does not know the that data has been nested inside response.data

                //Resolve function can have any logic of returning data;
                // e.g. Reading file from hard-drive, calling any third party API or just walk into the Database
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
