import {ApiProperty, PartialType} from "@nestjs/swagger";
import {CreateChatDto} from "./create-chat.dto";

export class UpdateChatDto extends PartialType(CreateChatDto) {}

