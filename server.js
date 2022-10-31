/*********************************************************************************
 * WEB322 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Pusit Treeraganont Student ID: 146566211 Date: 26/10/2022
 *
 * Online (Cyclic) Link: https://real-cow-jumpsuit.cyclic.app
 *
 ********************************************************************************/

const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const exphbs = require('express-handlebars')

const dataService = require('./data-service.js')

const app = express()

const PORT = process.env.PORT || 8080

const storage = multer.diskStorage({
	destination: './public/images/uploaded',
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
	},
})

const upload = multer({ storage: storage })

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'hbs')

app.engine(
	'hbs',
	exphbs.engine({
		extname: 'hbs',
		defaultLayout: 'main',
		helpers: {
			navLink: function (url, options) {
				return (
					'<li' +
					(url == app.locals.activeRoute ? ' class="active" ' : '') +
					'><a href="' +
					url +
					'">' +
					options.fn(this) +
					'</a></li>'
				)
			},
			equal: function (lvalue, rvalue, options) {
				if (arguments.length < 3)
					throw new Error('Handlebars Helper equal needs 2 parameters')
				if (lvalue != rvalue) {
					return options.inverse(this)
				} else {
					return options.fn(this)
				}
			},
		},
	})
)

app.use((req, _, next) => {
	let route = req.baseUrl + req.path
	app.locals.activeRoute = route == '/' ? '/' : route.replace(/\/$/, '')
	next()
})

app.get('/', (_, res) => {
	res.render('home')
})

app.get('/about', (_, res) => {
	res.render('about')
})

app.get('/students', (req, res) => {
	const { status, program, credential } = req.query
	if (status !== undefined) {
		dataService
			.getStudentsByStatus(status)
			.then((data) => {
				res.render('students', { students: data })
			})
			.catch(() => {
				res.render('students', { message: 'no results' })
			})
	} else if (program !== undefined) {
		dataService
			.getStudentsByProgramCode(program)
			.then((data) => {
				res.render('students', { students: data })
			})
			.catch(() => {
				res.render('students', { message: 'no results' })
			})
	} else if (credential !== undefined) {
		dataService
			.getStudentsByExpectedCredential(credential)
			.then((data) => {
				res.render('students', { students: data })
			})
			.catch(() => {
				res.render('students', { message: 'no results' })
			})
	} else {
		dataService
			.getAllStudents()
			.then((data) => {
				res.render('students', { students: data })
			})
			.catch(() => {
				res.render('students', { message: 'no results' })
			})
	}
})

app.get('/student/:value', (req, res) => {
	const { value } = req.params
	dataService
		.getStudentById(value)
		.then((data) => {
			res.render('student', { student: data })
		})
		.catch(() => {
			res.render('student', { message: 'no results' })
		})
})

app.get('/intlstudents', (_, res) => {
	dataService
		.getInternationalStudents()
		.then((data) => {
			res.json(data)
		})
		.catch((err) => {
			res.json({ message: err })
		})
})

app.get('/programs', (_, res) => {
	dataService
		.getPrograms()
		.then((data) => {
			res.render('programs', { programs: data })
		})
		.catch((err) => {
			res.json({ message: err })
		})
})

app.get('/students/add', (_, res) => {
	res.render('addStudent')
})

app.post('/students/add', (req, res) => {
	dataService
		.addStudent(req.body)
		.then(() => {
			res.redirect('/students')
		})
		.catch((err) => {
			res.json({ message: err })
		})
})

app.post('/student/update', (req, res) => {
	dataService.updateStudent(req.body).then(() => {
		res.redirect('/students')
	})
})

app.get('/images/add', (_, res) => {
	res.render('addImage')
})

app.post('/images/add', upload.single('imageFile'), (_, res) => {
	res.redirect('/images')
})

app.get('/images', (_, res) => {
	const images = []
	fs.readdir('./public/images/uploaded', function (err, items) {
		images.push(...items)
		res.render('images', { images })
	})
})

app.get('*', (_, res) => {
	res.status(404).send('Page Not Found')
})

dataService
	.initialize()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Express http server listening on ${PORT}`)
		})
	})
	.catch((err) => {
		console.log(err)
	})
