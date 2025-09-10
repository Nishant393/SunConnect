import express from "express";
import {  getMyProfile, getUserById, login, logout, newUser } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/admin.js";
import { createClient } from "../controllers/client.js";

const app = express.Router()

app.get("/",(req, res)=>{
    console.log("nkjikh")
    res.json("hello log ")
})
app.post("/login", login);
app.post("/signup", newUser);

app.use(isAuthenticated)

app.post("/logout", logout);
app.get("/me",getMyProfile);
app.get("/byid",getUserById)

app.use(isAdmin)

// app.get("/client",getClient);
app.post('/create',createClient);


export default app;