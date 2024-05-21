const express=require('express')
const path=require('path')
const urlRoute=require('./routes/url')
const {connectToMongoose}=require('./connection')
const URL = require("./models/url");
const app=express();
const staticRoute=require('./routes/staticRouter')
const port=8001
connectToMongoose('mongodb+srv://vurukondasaiteja13:gD5JeCtr40751mQj@cluster1.o7wwi02.mongodb.net/short-url')
.then(()=>{
    console.log("mongodb is connected")
})


app.set('view engine',"ejs")
app.set('views',path.resolve("./views"))

app.use('/',staticRoute)


app.use(express.json())   //to support json data
app.use(express.urlencoded({extended:false}))   //to support form data

app.use('/url',urlRoute)
app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timeStamp: Date.now(),
          },
        },
      }
    );
    res.redirect(entry.redirectURL);
    
  });
app.listen(port,()=>{
    console.log(`server started with port ${port}`)
})  