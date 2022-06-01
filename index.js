const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const diContainer = require("./di-container");

const diInstance = new diContainer();
diInstance.factory("testService", require("./test-service"));
diInstance.factory("testRepository", require("./test-repository"));

var controllersPath = path.join(__dirname, "controllers");

fs.readdirSync(controllersPath).forEach((file) => {
  var controller = require("./controllers/" + file);
  const router = express.Router();

  router.use((request, response, next) => {
    var thisController = diInstance.inject(controller);
    request.controller = thisController;
    next();
  });

  controller.routes.forEach((routeEntry) => {
    router[routeEntry.method](routeEntry.route, async (request, response) => {
      request.controller[routeEntry.key](request, response);
    });
  });

  app.use(router);
});

app.listen(8084, () => {
  console.log("listening on port 8084");
});
