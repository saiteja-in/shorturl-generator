const express=require('express')
const urlRoute=require('./routes/url')
const {connectToMongoose}=require('./connection')
const URL = require("./models/url");
const app=express();
const port=8001
connectToMongoose('mongodb+srv://vurukondasaiteja13:gD5JeCtr40751mQj@cluster1.o7wwi02.mongodb.net/short-url')
.then(()=>{
    console.log("mongodb is connected")
})

app.use(express.json())
app.use('/url',urlRoute)
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
    res.redirect(entry.redirectURL);
  });
app.listen(port,()=>{
    console.log(`server started with port ${port}`)
})  