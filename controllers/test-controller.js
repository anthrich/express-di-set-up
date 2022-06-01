class TestController {
  constructor(testService) {
    this.testService = testService;
  }

  get = (request, response) => {
    response.send(this.testService.executeTest());
  };
}

TestController.routes = [{ method: "get", route: "/test", key: "get" }];

module.exports = TestController;
