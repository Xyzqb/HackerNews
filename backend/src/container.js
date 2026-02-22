import { createContainer, asClass, asValue } from "awilix";
import NodeCache from "node-cache";
import { HackerNewsService } from "./services/hackerNewsService.js";

const container = createContainer();

container.register({
  cache: asValue(new NodeCache()),
  hackerNewsService: asClass(HackerNewsService).singleton()
});

export default container;