import { Request } from "express";
export interface GetUserInfoRequest extends Request {
    userId: string;
}
