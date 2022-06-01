const parseFunction = require("parse-function");

const app = parseFunction({
  ecmaVersion: 2020,
});

const getClassConstructorParams = (cls) => {
  let match = cls.toString().match(/constructor\((.+)\)/);

  if (match && match[1]) {
    return match[1].split(",");
  }

  return [];
};

const isFunction = (funcOrClass) => {
  const propertyNames = Object.getOwnPropertyNames(funcOrClass);
  return (
    !propertyNames.includes("prototype") || propertyNames.includes("arguments")
  );
};

class DiContainer {
  constructor() {
    this.dependencies = {};
    this.factories = {};
  }

  register = (name, dependency) => {
    this.dependencies[name] = dependency;
  };

  factory = (name, factory) => {
    this.factories[name] = factory;
  };

  get = (name) => {
    if (this.dependencies[name]) return this.dependencies[name];
    const factory = this.factories[name];
    if (!factory) {
      throw new Error(`Cannot find module ${name}`);
    }
    return factory && this.inject(factory);
  };

  inject = (factory) => {
    const factoryIsFunction = isFunction(factory);
    const fnArgs = factoryIsFunction
      ? app.parse(factory).args
      : getClassConstructorParams(factory);
    const mappedArgs = fnArgs.map((dependency) => this.get(dependency));
    var result = factoryIsFunction
      ? factory.apply(null, mappedArgs)
      : new factory(...mappedArgs);
    return result;
  };
}

module.exports = DiContainer;
