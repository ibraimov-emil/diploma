// import { Injectable } from "@nestjs/common";
// import { CreateRequestDto } from "./dto/create-request.dto";
// import { JwtService } from "@nestjs/jwt";
// import { UsersService } from "../users/users.service";
//
// @Injectable()
// export class RequestsService {
//   constructor(
//     private userService: UsersService,
//     private jwtService: JwtService
//   ) {}
//
//   private requests: Request[] = []; // Предполагается, что Request - модель данных для заявки
//
//   getAllRequests() {
//     // Логика получения всех заявок
//     return this.requests;
//   }
//
//   getRequestById(id: number) {
//     // Логика получения заявки по ID
//     return this.requests.find((request) => request.id === id);
//   }
//
//   createRequest(requestDto: CreateRequestDto) {
//     // Логика создания заявки
//     // Преобразование requestDto в модель данных Request
//     const request: Request = { ...requestDto, id: this.generateId() };
//     this.requests.push(request);
//     return request;
//   }
//
//   updateRequest(id: number, requestDto: CreateRequestDto) {
//     // Логика обновления заявки по ID
//     const index = this.requests.findIndex((request) => request.id === id);
//     if (index !== -1) {
//       // Преобразование requestDto в модель данных Request
//       const updatedRequest: Request = { ...CreateRequestDto, id };
//       this.requests[index] = updatedRequest;
//       return updatedRequest;
//     }
//     return null;
//   }
//
//   deleteRequest(id: number) {
//     // Логика удаления заявки по ID
//     const index = this.requests.findIndex((request) => request.id === id);
//     if (index !== -1) {
//       const deletedRequest = this.requests.splice(index, 1);
//       return deletedRequest;
//     }
//     return null;
//   }
//
//   private generateId() {
//     // Генерация уникального ID для заявки
//     return this.requests.length + 1;
//   }
// }
