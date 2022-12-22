const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce_userdetails", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
}).then(() =>{
    console.log(`connection successful`)
}).catch((e)=>{
    console.log(`connection failed ${e}`)
})