class UnauthError extends Error {
  constructor() {
    super();
    this.name = 'UnauthError';
  }
}

export default UnauthError;
