import { GraphQLNonNull, GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { memberType } from './member.js';
import { Context } from './shared.js';

type Source = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
};

export const profileType = new GraphQLObjectType<Source, Context>({
  name: 'profileType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(memberType),
      resolve({ memberTypeId }, _args, { prisma }) {
        return prisma.memberType.findUnique({ where: { id: memberTypeId } });
      },
    },
  }),
});
