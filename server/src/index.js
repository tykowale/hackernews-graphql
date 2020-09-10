const { GraphQLServer } = require("graphql-yoga");
const _ = require("lodash");

let links = [{
  id: "link-0",
  url: "www.howtographql.com",
  description: "Fullstack tutorial for GraphQL",
}];
let idCount = links.length;

function findLink(id) {
  return _.find(links, (i) => {
    return i.id === id;
  });
}

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => {
      return findLink(args.id);
    },
  },
  Mutation: {
    // 2
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };

      links.push(link);

      return link;
    },
    updateLink: (parent, args) => {
      const link = findLink(args.id);
      if (args.url) {
        link.url = args.url;
      }
      if (args.description) {
        link.description = args.description;
      }

      return link;
    },
    deleteLink: (parent, args) => {
      return _.remove(links, (i) => {
        return i.id === args.id;
      })[0];
    },
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
