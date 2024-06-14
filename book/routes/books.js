const express = require('express')
const { v4: uuid } = require('uuid')
const axios = require('axios');
const counterUrl = process.env.COUNTER_URL || 'http://counter:3001';
const router = express.Router()
class Book {
  constructor (
    title = '',
    description = '',
    authors = '',
    favorite = '',
    fileCover = '',
    fileName = '',
    fileBook = '',
    id = uuid()
  ) {
    this.title = title
    this.description = description
    this.authors = authors
    this.favorite = favorite
    this.fileCover = fileCover
    this.fileName = fileName
    this.fileBook = fileBook
    this.id = id
  }
};

const stor = {
  book: [
    new Book(),
    new Book()
  ]
}

router.get('/create', (req, res) => {
  res.render('book/create', {
    title: 'Добавить книгу',
    book: {}
  })
})
// создать книгу
router.post('/create',
  (req, res) => {
    const { book } = stor
    const {
      title,
      description
    } = req.body

    const newBook = new Book(title, description)

    book.push(newBook)

    res.redirect('/api/books')
  })

// получить все книги
router.get('/', (req, res) => {
  const { book } = stor
  res.render('book/index', {
    title: 'Просмотр списка книг',
    books: book
  })
})

// получить книгу по ID
router.get('/:id', async(req, res) => {
  const { book } = stor
  const { id } = req.params

   // Увеличить счётчик
   try {
    await axios.post(`${counterUrl}/counter/${id}/incr`);
  } catch (error) {
    console.error('Ошибка при увеличении счётчика:', error);
  }

  // Получить значение счётчика
  try {
    const idx = book.findIndex(el => el.id === id)
    const { data: { count } } = await axios.get(`${counterUrl}/counter/${id}`);

    if (idx !== -1) {
      res.render('book/view', {
        title: `Информация по книге ${book[idx].title}`,
        book: book[idx],
        count: count
      })
    } else {
      res.render('error/404', { title: 'Книга не найдена' });
    }
  
  } catch (error) {
    console.error('Ошибка при получении значения счётчика:', error);
    res.status(500).send('Ошибка сервера');
  }


})

router.get('/update/:id', (req, res) => {
  const { book } = stor
  const { id } = req.params

  const idx = book.findIndex(el => el.id === id)

  if (idx === -1) {
    res.render('error/404', { title: 'Что-то пошло не так' });
  }

  res.render('book/update', {
    title: 'Редактирование',
    book: book[idx]
  })
})

router.post('/update/:id',
  (req, res) => {
    const { book } = stor
    const {
      title,
      description
    } = req.body

    const { id } = req.params
    const idx = book.findIndex(el => el.id === id)

    if (idx !== -1) {
      book[idx] = {
        ...book[idx],
        title,
        description
      }
      res.redirect('/api/books')
    } else {
      res.render('error/404', { title: 'Что-то пошло не так' });
    }
  })


module.exports = router
