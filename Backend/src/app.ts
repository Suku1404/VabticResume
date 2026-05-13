import express,{Request , Response} from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes"
import atsRoute from "./routes/ats.route";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json())
app.use(cookieParser());

app.use("/api/ats", atsRoute);



app.use('/api/auth',authRoutes)


app.get("/", (req:Request,res:Response) => {
    res.send("server is running")
})
export default app;

