import { Request, Response } from "express";
import pool from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const RegisterUser = async (req: Request, res: Response) => {


    const { name, email, password } = req.body;

    const isUserAlreadyExists = await pool.query(
        "SELECT * FROM USERS WHERE email = $1",
        [email]
    );

    if (isUserAlreadyExists.rows.length > 0) {
        return res.status(400).json({
            message: "User Exists"
        })
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await pool.query(
        "INSERT INTO USERS (name, email,password) VALUES($1,$2,$3) RETURNING *",
        [name, email, hashedPassword]
    );

    const token = jwt.sign(
        { id: newUser.rows[0].id, name: newUser.rows[0].name, email: newUser.rows[0].email },
        process.env.JWT_SECRET as string
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
       
    });

    res.status(201).json({
        message: "User Registerd Successful",
        user: newUser.rows[0],
        token
    });
}

const LoginUser = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM USERS WHERE email = $1",
        [email]
    )

    if (user.rows.length === 0) {

        return res.status(400).json({
            message: "User Not Found "
        });
    }


    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {

        return res.status(400).json({
            message: "Invalid email and password"
        })
    }


    const token = jwt.sign(
        { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email },
        process.env.JWT_SECRET as string
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,

    });

    res.status(201).json({
        message: "User Login Successful",
        user: user.rows[0],
        token
    });

}

const GetProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await pool.query("SELECT id, name, email, created_at FROM USERS WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const UpdateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    const result = await pool.query(
      "UPDATE USERS SET name = $1 WHERE id = $2 RETURNING id, name, email, created_at",
      [name.trim(), userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET as string
    );
    res.json({ user, token });
  } catch (error: any) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export default {
    RegisterUser,
    LoginUser,
    GetProfile,
    UpdateProfile
}