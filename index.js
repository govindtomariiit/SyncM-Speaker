const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('homepage.ejs')
})

app.get('/:roomId', (req, res) => {
    console.log('IN THE ROOM NOW.')
    res.render('room')
})

app.listen(3000, () => {
    console.log('SERVER HAS STARTED')
})