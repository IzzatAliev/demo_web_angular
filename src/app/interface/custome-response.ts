import { Course } from './course';

export interface CustomResponse {
  timeStamp: Date;
  statusCode: number;
  status: string;
  reason: string;
  message: string;
  developerMessage: string;
  data: { courses?: Course[]; course?: Course };
}
