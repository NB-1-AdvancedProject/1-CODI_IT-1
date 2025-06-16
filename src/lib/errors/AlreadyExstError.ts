class AlreadyExstError extends Error {
  constructor(modelName: String) {
    super(`${modelName} already exists`);
    this.name = 'AlreadyExstError';
  }
}

export default AlreadyExstError;
