const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const app = express()
const path = require('path');

const userRoute = require('./routes/userRoute')
const eventRoute = require('./routes/eventRoute')
const listRoute = require('./routes/listRoute')
const localeRoute = require('./routes/localeRoute')
const companyRoute = require('./routes/companyRoute')
const qrcodeRoute = require('./routes/qrcodeRoute')
const searchRoute = require('./routes/searchRoute')


const mongoose = require('mongoose')
const User = require('./models/users.model')

const isProd = process.env.NODE_ENV === 'production';
const clientURL = isProd 
    ? 'https://disco-app-angular.vercel.app' 
    : 'http://localhost:4200';
const backendURL = isProd 
    ? 'https://discoappangular-1.onrender.com' 
    : 'http://localhost:3000';


app.use(cors({
    origin: [clientURL],
    credentials: true
}));
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

app.use('/api/users', userRoute)
app.use('/api/companies', companyRoute)
app.use('/api/locali', localeRoute)
app.use('/api/events', eventRoute)
app.use('/api/lists',listRoute)
app.use('/api/qrcodes',qrcodeRoute)
app.use('/api/search',searchRoute)




app.get("/", (req, res)=>{
    res.send("hello babe")
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`listening on port ${process.env.PORT || 3000}`);
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("connected to DB")
})
.catch(()=>{
    console.log("NOT CONNECTED TO DB")
})


app.get("/api/users/:id", async(req, res) =>{
    try{
        const { id } = req.params
        const user = await User.findById(id)
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

