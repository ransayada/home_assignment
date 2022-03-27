const express = require('express')
var { graphqlHTTP } = require('express-graphql');
//in order to fetch from frontend
const cors = require('cors')

//the app
const app = express()
app.use(cors());

const {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLFloat,
    GraphQLList
} = require('graphql');
const PORT = 8000;

var DB = require('./DB/data.json');
DB = JSON.parse(JSON.stringify(DB));


const NeighborhoodType = new GraphQLObjectType({
    name: 'Neighborhood',
    description: 'A neighborhood represented by its name',
    fields: () => ({
        name: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        averageAge: { type: GraphQLNonNull(GraphQLInt) },
        dfcc: { type: GraphQLNonNull(GraphQLInt) },
        averageIncome: { type: GraphQLNonNull(GraphQLInt) },
        pta: { type: GraphQLNonNull(GraphQLString) },
        latitude: { type: GraphQLNonNull(GraphQLFloat) },
        longitude: { type: GraphQLNonNull(GraphQLFloat) },
    })
});



const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        neighborhoods: {
            type: new GraphQLList(NeighborhoodType),
            description: 'List of all neighborhoods',
            resolve: () => DB
        },
        neighborhood: {
            type: NeighborhoodType,
            description: 'A single neighborhood',
            args: {
                neighborhood: {
                    type: GraphQLString
                }
            },
            resolve: (parent, args) => {
                DB.forEach(neighborhood => {
                    if (neighborhood.name === args.name) {
                        console.log(neighborhood);
                        return neighborhood
                    }
                })
            }

        }
    })
});


const schema = new GraphQLSchema({
    query: RootQueryType,
    // mutation: RootMutation
});

app.use('/graphql', graphqlHTTP({
    schema, //API schema
    graphiql: true //enable graphql GUI sandbox
}))

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})