FROM node:lts as dependencies
WORKDIR /miyagi
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /miyagi
COPY . .
COPY --from=dependencies /miyagi/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /miyagi
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /miyagi/next.config.js ./
COPY --from=builder /miyagi/public ./public
COPY --from=builder /miyagi/.next ./.next
COPY --from=builder /miyagi/node_modules ./node_modules
COPY --from=builder /miyagi/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]
