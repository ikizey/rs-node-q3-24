import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
} from 'graphql';
import { MemberTypeId as MemberTypeEnum } from '../../member-types/schemas.js';

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeEnum.BASIC]: { value: MemberTypeEnum.BASIC },
    [MemberTypeEnum.BUSINESS]: { value: MemberTypeEnum.BUSINESS },
  },
});

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(memberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});



