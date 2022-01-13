export class HttpErrorOutputDto {
  readonly code: string;
  readonly message: string;
  readonly timestamp: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
