


const express = require('express')
const app = express()
const path = require('path')
var port = process.env.PORT || 8080;


app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, 'public')))

let inpt = [];

let outp = [];



app.get('/', (req, res) => {
    res.render('home')
})


// app.post('/', (req, res) => {
//     const { mess, nkcode } = req.body;
//     inpt.push({ message: mess, code = nkcode });
//     res.redirect('./')
// })

var server=app.listen(port,function() {
console.log("app running on port 8080"); });

// app.listen(3000, () => {
//     //console.log(`Listening on http://localhost:${port}`)
//     console.log('Running at 3000')
// })


