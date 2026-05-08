import dotenv from 'dotenv';
import app from './app';
import pool from "./db/db";
import express from 'express';



app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");

  res.json({
    message: "Server running",
    time: result.rows[0],
  });
});

app.listen(3000, () => {
  console.log("Server started on port 5000");
});