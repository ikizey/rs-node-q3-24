import { PrismaClient } from '@prisma/client';
import { type DataLoaders } from '../loader.js';

export type Context = {
  prisma: PrismaClient;
  dataLoaders: DataLoaders;
};

export type Id = {
  id: string;
};
