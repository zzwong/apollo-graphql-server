import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import schema from './data/schema';

import compression from 'compression';
import { Engine } from 'apollo-engine';


const GRAPHQL_PORT = 3000;
const ENGINE_API_KEY = 'service:zzwong-1626:Ct7oruD-kRx7HYKfIqkEBQ';

const graphQLServer = express();


const engine = new Engine({
	engineConfig: {
		apiKey: ENGINE_API_KEY,
		// Setup simple embedded cache store
		// Advanced: plug into memcached - https://www.apollographql.com/docs/engine/proto-doc.html#mdg.engine.config.proto.Config.Store.Memcache%5C
		stores: [
			{
				name: 'inMemEmbeddedCache',
				inMemory: {
					cacheSize: 20971520 // 20MB
				}
			}
		],
		// setup query cache
		queryCache: {
			publicFullQueryStore: 'inMemEmbeddedCache'
		}
	},
	graphqlPort: GRAPHQL_PORT
});

engine.start();



// Engine has to be the first middleware!!!
//   - it processes raw requests before they have been modified by other middleware
graphQLServer.use(engine.expressMiddleware());

// Engine & tracing
graphQLServer.use(compression());


graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ 
	schema,
	// Option turns on tracing
	tracing: true,
	// caching speeds query performance
	cacheControl: true 
}));
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));


graphQLServer.listen(GRAPHQL_PORT, () =>
  console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
  )
);
