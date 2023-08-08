import { NextFunction, Response } from "express";
import { GetUserInfoRequest } from "../interfaces/request";
import jwt from "jsonwebtoken";
import IToken from "../interfaces/token";
import User, { IUserModel } from "../models/user.model";

/**
 * @function authorise
 * @type {Middleware}
 * @description This middleware is used to authorise the user
 * @returns Response of type express
 */
export const authorise = async (req: GetUserInfoRequest, res: Response, next: NextFunction) => {
  const jwtsecret = process.env.JWT_SECRET;
  let token: string = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided.'
    });
  }
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, jwtsecret, (err: Error, decoded: IToken) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Token'
        });
      }
      req.user = decoded;
      req.userId = decoded.id;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Invalid Token'
    });
  }
};

export const authoriseAdmin = async (req: GetUserInfoRequest, res: Response, next: NextFunction) => {
  const jwtsecret = process.env.JWT_SECRET;
  let token: string = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided.'
    });
  }
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, jwtsecret, (err: Error, decoded: IToken) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Token'
        });
      }
      req.user = decoded;
      req.userId = decoded.id;
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Invalid Token'
    });
  }
  const user: IUserModel = await User.findOne({_id:req.userId});
  if (user.role == 0) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'You are not an admin!'
    });
  }
};

export const authoriseApprover = async (req: GetUserInfoRequest, res: Response, next: NextFunction) => {
  const jwtsecret = process.env.JWT_SECRET;
  let token: string = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided.'
    });
  }
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, jwtsecret, (err: Error, decoded: IToken) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Token'
        });
      }
      req.user = decoded;
      req.userId = decoded.id;
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Invalid Token'
    });
  }
  const user: IUserModel = await User.findOne({_id:req.userId});
  if (user.role == 1) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'You are not an approver!'
    });
  }
};

export const authoriseRequester = async (req: GetUserInfoRequest, res: Response, next: NextFunction) => {
  const jwtsecret = process.env.JWT_SECRET;
  let token: string = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided.'
    });
  }
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, jwtsecret, (err: Error, decoded: IToken) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Token'
        });
      }
      req.user = decoded;
      req.userId = decoded.id;
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Invalid Token'
    });
  }
  const user: IUserModel = await User.findOne({_id:req.userId});
  if (user.role == 2) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'You are not a requester!'
    });
  }
};
