import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

const loaders = (prisma: PrismaClient) => {
  return {
    profileLoader: new DataLoader<string, unknown>(async (ids) => {
      const data = await prisma.profile.findMany({
        where: {
          userId: {
            in: [...ids],
          },
        },
      });

      const dataMap: Record<string, (typeof data)[number]> = {};
      data.forEach((item) => {
        dataMap[item.userId] = item;
      });
      return ids.map((id) => dataMap[id]);
    }),

    postsLoader: new DataLoader<string, unknown>(async (ids) => {
      const data = await prisma.post.findMany({
        where: {
          authorId: {
            in: [...ids],
          },
        },
      });

      const dataMap: Record<string, typeof data> = {};
      data.forEach((item) => {
        if (dataMap[item.authorId]) {
          dataMap[item.authorId].push(item);
        } else {
          dataMap[item.authorId] = [item];
        }
      });

      return ids.map((id) => dataMap[id] || []);
    }),

    memberTypeLoader: new DataLoader<string, unknown>(async (ids) => {
      const data = await prisma.memberType.findMany({
        where: {
          profiles: {
            some: {
              memberTypeId: { in: [...ids] },
            },
          },
        },
      });

      const dataMap: Record<string, (typeof data)[number]> = {};
      data.forEach((item) => {
        dataMap[item.id] = item;
      });

      return ids.map((id) => dataMap[id]);
    }),

    userSubscribedToLoader: new DataLoader<string, unknown>(async (ids) => {
      const data = await prisma.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: {
                in: [...ids],
              },
            },
          },
        },
        include: {
          subscribedToUser: true,
        },
      });

      return ids.map((id) =>
        data.filter((item) =>
          item.subscribedToUser.some((item) => item.subscriberId === id),
        ),
      );
    }),

    subscribedToUserLoader: new DataLoader<string, unknown>(async (ids) => {
      const data = await prisma.user.findMany({
        where: {
          userSubscribedTo: {
            some: {
              authorId: { in: [...ids] },
            },
          },
        },
        include: {
          userSubscribedTo: true,
        },
      });

      return ids.map((id) =>
        data.filter((item) => item.userSubscribedTo.some((item) => item.authorId === id)),
      );
    }),
  };
};

export default loaders;

export type DataLoaders = ReturnType<typeof loaders>;