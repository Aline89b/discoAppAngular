const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const app = express()

const userRoute = require('./routes/userRoute')
const eventRoute = require('./routes/eventRoute')
const listRoute = require('./routes/listRoute')
const localeRoute = require('./routes/localeRoute')
const companyRoute = require('./routes/companyRoute')


const mongoose = require('mongoose')
const User = require('./models/users.model')

app.use(cors({ origin: 'http://localhost:4200' }))
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/users', userRoute)
app.use('/api/companies', companyRoute)
app.use('/api/locali', localeRoute)
app.use('/api/events', eventRoute)
/*

app.use('/api/lists',listRoute)

*/

app.get("/", (req, res)=>{
    res.send("hello babe")
})

app.listen(process.env.PORT,()=> {
    console.log("listening on port 3000")
})

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

