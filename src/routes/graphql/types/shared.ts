import {
  type FastifyBaseLogger,
  type FastifyInstance,
  type RawServerDefault,
} from 'fastify';
import { type IncomingMessage, type ServerResponse } from 'node:http';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export type Context = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

export type Id = {
  id: string;
};
