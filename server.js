const express = require('express')
const app = express()
app.use(express.static("./dist"))

app.get('/', (req, res) => { 
    res.send('hello world')
})

app.listen(3000, () => { 
    console.log("app listening on port 3000")
})