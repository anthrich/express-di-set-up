const TestRepository = () => {
  this.tests = [{ id: 1, name: "Test 1" }];

  this.get = () => {
    return this.tests;
  };

  return this;
};

module.exports = TestRepository;
