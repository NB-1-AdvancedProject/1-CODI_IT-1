class OptimisticLockFailedError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = "OptimisticLockFailedError";
  }
}

export default OptimisticLockFailedError;
