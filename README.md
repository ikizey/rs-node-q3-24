## Assignment: Graphql

Steps to get started:

0. Switch to branch: `git switch graphql`
1. Install dependencies: `npm ci`
2. Create .env file (based on .env.example): ./.env
3. Apply pending migrations: `npx prisma migrate deploy`
4. Seed db: `npx prisma db seed`
5. Start server: `npm run start`

Tests:

0. integrity: `npm run test-integrity`
1. queries: `npm run test-queries`
2. mutations: `npm run test-mutations`
3. rule: `npm run test-rule`
4. loader: `npm run test-loader`
5. loader-prime: `npm run test-loader-prime`

Swagger:

http://localhost:8000/docs
