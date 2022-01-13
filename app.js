const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
dotenv = require("dotenv/config");
const app = express();

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const subRoutes = require("./routes/sub");
const brandRoutes = require("./routes/brand");
const colorRoutes = require("./routes/color");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const couponRoutes = require("./routes/coupon");
const stripeRoutes = require("./routes/stripe");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/admin");

app.use(cors());
app.options("*", cors());

app.use(morgan("dev"));
app.use(express.json({ limit: "20MB" }));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/sub", subRoutes);
app.use("/brand", brandRoutes);
app.use("/color", colorRoutes);
app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/coupon", couponRoutes);
app.use("/stripe", stripeRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);

const db = process.env.DB;
mongoose
  .connect(db, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB ' ye başarılı şekilde bağlanıldı"));

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`nodejs server ${port} portundan başarılı şekilde ayaklandı`)
);
