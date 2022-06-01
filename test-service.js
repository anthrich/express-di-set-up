const TestService = (testRepository) => {
  this.testRepository = testRepository;

  this.executeTest = () => {
    const test = this.testRepository.get();
    return test;
  };

  return this;
};

module.exports = TestService;
