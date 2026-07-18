import cors from "cors";
import express from "express";
import { env } from "./env";
import { requireAuth } from "./middlewares/auth";
import { flashcardsRouter } from "./routes/flash-card";
import {chatRouter} from "./routes/chat"
import { summaryRouter } from "./routes/summary";
import { sourcesRouter } from "./routes/sources";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use(requireAuth);
app.use("/sources", sourcesRouter);
app.use("/study-sets", summaryRouter);
app.use("/study-sets", flashcardsRouter);
app.use("/conversations", chatRouter);

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});