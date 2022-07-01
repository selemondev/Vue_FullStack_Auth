const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { errorMiddleware } = require("./middleware/errorMiddleware");
const userRoute = require("./routes/userRoutes");
const connectDb = require("./config/db");
connectDb();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cors());
app.use("/api/auth", userRoute);
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
});
