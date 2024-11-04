import { GraphQLObjectType } from 'graphql/index.js';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { changeUserInput, createUserInput, userType } from './user.js';
import { changePostInput, createPostInput, postType } from './post.js';
import { changeProfileInput, createProfileInput, profileType } from './profile.js';
import { Context, Id } from './shared.js';
import { UUIDType } from './uuid.js';

export const mutation = new GraphQLObjectType<unknown, Context>({
  name: 'MutationType',
  fields: {
    createUser: {
      type: new GraphQLNonNull(userType),
      args: {
        dto: { type: new GraphQLNonNull(createUserInput) },
      },
      resolve(_source, { dto }, { prisma }) {
        return prisma.user.create({ data: dto });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(userType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeUserInput) },
      },
      resolve(_source, { id, dto }, { prisma }) {
        return prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { id }: Id, { prisma }) {
        await prisma.user.delete({ where: { id } });
        return 'Resolve';
      },
    },

    createProfile: {
      type: new GraphQLNonNull(profileType),
      args: {
        dto: { type: new GraphQLNonNull(createProfileInput) },
      },
      resolve(_source, { dto }, { prisma }) {
        return prisma.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(profileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeProfileInput) },
      },
      resolve(_source, { id, dto }, { prisma }) {
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { id }: Id, { prisma }) {
        await prisma.profile.delete({ where: { id } });
        return 'Resolve';
      },
    },

    createPost: {
      type: new GraphQLNonNull(postType),
      args: {
        dto: { type: new GraphQLNonNull(createPostInput) },
      },
      resolve(_source, { dto }, { prisma }) {
        return prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: new GraphQLNonNull(postType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changePostInput) },
      },
      resolve(_source, { id, dto }, { prisma }) {
        return prisma.post.update({ where: { id }, data: dto });
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { id }: Id, { prisma }) {
        await prisma.post.delete({ where: { id } });
        return 'Resolve';
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { userId, authorId }, { prisma }) {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });
        return 'Resolve';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { userId, authorId }, { prisma }) {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });
        return 'Resolve';
      },
    },
  },
});
