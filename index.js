const express = require('express')
const bodyParser = require('body-parser'); 
const logger = require('./middleware/logger')
const error404 = require('./middleware/err-404')
const userRouter = require('./routes/user')
const booksRouter = require('./routes/books')

const app = express()
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'ejs')

app.use(logger)

// авторизация пользователя
app.use('/', userRouter)
// книги
app.use('/api/books', booksRouter)

app.use(error404)

const PORT = process.env.PORT || 3000
app.listen(PORT)