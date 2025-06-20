class ForbiddenError extends Error {
  constructor() {
    super();
    this.name = "ForbiddenError";
    this.message = "이메일 또는 비밀번호를 확인해주세요."
  }
}

export default ForbiddenError;
