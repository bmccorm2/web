# stage build
FROM node:lts as build
WORKDIR /app
RUN npm i -g pnpm
# copy everything to the container
COPY . .
# clean install all dependencies
RUN pnpm i
# remove potential security issues
RUN pnpm audit fix
# build SvelteKit app
RUN pnpm run build


# stage run
FROM node:lts
WORKDIR /app
RUN npm i -g pnpm
# copy dependency list
COPY --from=build /app/package*.json ./
# clean install dependencies, no devDependencies, no prepare script
RUN pnpm i --production --ignore-scripts
# remove potential security issues
RUN pnpm audit fix
# copy built SvelteKit app to /app
COPY --from=0 /app/build ./
EXPOSE 3000
CMD ["node", "./index.js"]
