class CommonError extends Error {
  status: number;
  constructor(message: string, code: number) {
    super();
    this.name = 'CommonError';
    this.message = message;
    this.status = code;
  }
}

export default CommonError;
