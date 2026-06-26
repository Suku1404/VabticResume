import express,{Request , Response} from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes"
import atsRoute from "./routes/ats.route";
import resumeRoutes from "./routes/resume.routes";
import interviewRoutes from "./routes/interview.routes";
import copilotRoutes from "./routes/copilot.routes";
import analyticsRoutes from "./routes/analytics.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json())
app.use(cookieParser());

app.use("/api/ats", atsRoute);
app.use('/api/auth', authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req:Request,res:Response) => {
    res.send("server is running")
})
export default app;

