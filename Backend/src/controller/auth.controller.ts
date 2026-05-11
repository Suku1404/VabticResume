import { Request, Response } from "express";
import pool from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const RegisterUser = async (req: Request, res: Response) => {


    const { Name, email, password } = req.body;

    const isUserAlreadyExists = await pool.query(
        "SELECT * FROM USERS WHERE email = $1",
        [email]
    );

    if (isUserAlreadyExists.rows.length > 0) {
        return res.status(400).json({
            message: "user is already exist"
        })
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await pool.query(
        "INSERT INTO USERS (Name, email,password) VALUES($1,$2,$3) RETURNING *",
        [Name, email, hashedPassword]
    );

    const token = jwt.sign(
        { id: newUser.rows[0].id },
        process.env.JWT_SECRET as string,


    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
       
    });

    res.status(201).json({
        message: "user registerd Successful",
        user: newUser.rows[0]
    });
}

const LoginUser = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM USERS WHERE email = $1",
        [email]
    )

    if (user.rows.length === 0) {

        return res.status(400).json({
            message: "user not found "
        });
    }


    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {

        return res.status(400).json({
            message: "invalid email and password"
        })
    }


    const token = jwt.sign(
        { id: user.rows[0].id },
        process.env.JWT_SECRET as string,

    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,

    });

    res.status(201).json({
        message: "user login  Successful",
        user: user.rows[0]
    });

}

export default{
    RegisterUser,
    LoginUser
}