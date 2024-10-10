const mongoose = require("mongoose");
try {
  mongoose.connect("mongodb+srv://ashutoshkumar:MzkMRCcOiaM80KSB@cluster0.aid5m.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log("Database Connected Successfully");
} catch (err) {
  console.log("Database Not Connected");
}