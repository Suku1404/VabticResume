import express,{Request , Response} from "express"
 import cookieParser from "cookie-parser";
import cors from "cors";
<<<<<<< HEAD
import authRoutes from "./routes/auth.routes"
=======
import authRoutes from './routes/auth.routes'

>>>>>>> d9ceb8d8361590b6fb9d86011619cfb5f579a362

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json())
app.use(cookieParser());
app.use("/api/auth",authRoutes)



app.use('/api/auth',authRoutes)


app.get("/", (req:Request,res:Response) => {
    res.send("server is running")
})
export default app;

