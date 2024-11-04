import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { memberTypeId, memberType } from './member.js';
import { userType } from './user.js';
import { postType } from './post.js';
import { profileType } from './profile.js';
import { UUIDType } from './uuid.js';
import { Context } from './shared.js';

type Id = {
  id: string;
};

export const baseQueryType = new GraphQLObjectType<unknown, Context>({
  name: 'BaseQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberType))),
      resolve(_source, _args, { prisma }) {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: memberType,
      args: {
        id: { type: new GraphQLNonNull(memberTypeId) },
      },
      resolve(_source, { id }: Id, { prisma }) {
        return prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve(_source, _args, { prisma }) {
        return prisma.user.findMany();
      },
    },
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve(_source, { id }: Id, { prisma }) {
        return prisma.user.findUnique({ where: { id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve(_source, _args, { prisma }) {
        return prisma.post.findMany();
      },
    },
    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve(_source, { id }: Id, { prisma }) {
        return prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
      resolve(_source, _args, { prisma }) {
        return prisma.profile.findMany();
      },
    },
    profile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve(_source, { id }: Id, { prisma }) {
        return prisma.profile.findUnique({ where: { id } });
      },
    },
  },
});
