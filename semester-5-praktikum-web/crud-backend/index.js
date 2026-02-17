import express from "express";
import cors from "cors";
import clientRoute from "./src/routes/clientRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api", clientRoute);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
