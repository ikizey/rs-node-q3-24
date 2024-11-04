import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql } from 'graphql';

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
