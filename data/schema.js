import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
// import mocks from './mocks';
import resolvers from './resolvers';

const typeDefs = `
type Query {
	testString: String
	author(firstName: String, lastName: String): Author
	allAuthors: [Author]
	getFortuneCookie: String @cacheControl(maxAge: 5)
	getLuckyNumbers: String @cacheControl(maxAge: 5)
	daniel: String @cacheControl(maxAge: 5)
	whatIsShuting: String 
	complimentMe(name: String): String 
}

type Author {
	id: Int
	firstName: String
	lastName: String
	posts: [Post]
}

type Post {
	id: Int
	title: String
	text: String
	views: Int
	author: Author
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Use resolvers instead of mock data
// addMockFunctionsToSchema({ schema, mocks });

export default schema;
