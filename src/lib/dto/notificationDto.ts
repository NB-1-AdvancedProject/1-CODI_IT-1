import { AlarmData } from "../../types/notificationType";

export class AlarmDTO {
  id: string;
  userId: string;
  content: string;
  isChecked: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(data: AlarmData) {
    this.id = data.id;
    this.userId = data.userId;
    this.content = data.content;
    this.isChecked = data.isChecked;
    this.createdAt = data.createdAt.toISOString();
    this.updatedAt = data.updatedAt.toISOString();
  }
}
