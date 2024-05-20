const express=require('express')
const path=require('path')
const urlRoute=require('./routes/url')
const {connectToMongoose}=require('./connection')
const URL = require("./models/url");
const app=express();
const port=8001
connectToMongoose('mongodb+srv://vurukondasaiteja13:gD5JeCtr40751mQj@cluster1.o7wwi02.mongodb.net/short-url')
.then(()=>{
    console.log("mongodb is connected")
})


app.set('view engine',"ejs")
app.set('views',path.resolve("./views"))

app.get("/test",async(req,res)=>{
  const allUrls=await URL.find({})
  return res.render("home",{
    urls:allUrls
  })
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