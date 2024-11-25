import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.mjs";

// TODO/JsDoc: Document this function
export async function login(req, res, next) {
   const email = req.body?.email?.toString()?.trim()?.toLowerCase() ?? "";
   const password = req.body?.password?.toString()?.trim() ?? "";
   // TODO: Implement login function
}

// TODO/JsDoc: Document this function
export async function signup(req, res, next) {
   const email = req.body?.email?.toString()?.trim()?.toLowerCase() ?? "";
   const password = req.body?.password?.toString()?.trim() ?? "";
   const { username, first_name, last_name } = req.body;
   // TODO: Implement signup function
}