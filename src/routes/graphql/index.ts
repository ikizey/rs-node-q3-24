import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const fastifyPlugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    handler: async (req) => {
      const maxDepth = 5;
      const errors = validate(gqlSchema, parse(req.body.query), [depthLimit(maxDepth)]);

      if (errors.length > 0) {
        return { errors };
      }

      return await graphql({
        source: req.body.query,
        schema: gqlSchema,
        variableValues: req.body.variables,
        contextValue: { prisma: fastify.prisma },
      });
    },
  });
};

export default fastifyPlugin;
