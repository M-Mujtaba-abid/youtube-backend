import express from "express"

import cookieParser from "cookie-parser"
import cors from "cors"


const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

// app.use(express.josn({limit: "16kb"}))
app.use(express.json({ limit: "16kb" }))    

app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
// app.use(express.cookiparser())
app.use(cookieParser())

app.post("/signup", (req, res) => {
  console.log(req.body); // yahan data print hona chahiye
  res.send("Data received");
});


//  import routes
import UserRouter from "./routes/user.Route.js"



// routes declaration -----
app.use("/api/v1/users", UserRouter )




export default app