class EmptyUploadError extends Error {
  constructor() {
    super();
    this.name = 'EmptyUploadError';
  }
}

export default EmptyUploadError;
