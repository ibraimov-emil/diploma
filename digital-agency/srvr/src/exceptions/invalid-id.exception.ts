import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIdException extends HttpException {
  constructor(id: string) {
    super(`Invalid ID format: ${id}`, HttpStatus.BAD_REQUEST);
  }
} 