const Sequelize = require('sequelize')

/**
 * @type {Sequelize.Sequelize}
 */
var sequelize = new Sequelize(
	'venbfcaj',
	'venbfcaj',
	'SEA9jM4hYAF0JBEOcU81WsmKzInr_PDW',
	{
		host: 'peanut.db.elephantsql.com',
		dialect: 'postgres',
		port: 5432,
		dialectOptions: {
			ssl: { rejectUnauthorized: false },
		},
		query: { raw: true },
	}
)

sequelize
	.authenticate()
	.then(function () {
		console.log('Connection has been established successfully.')
	})
	.catch(function (err) {
		console.log('Unable to connect to the database:', err)
	})

const Student = sequelize.define('Student', {
	studentID: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	email: Sequelize.STRING,
	phone: Sequelize.STRING,
	addressStreet: Sequelize.STRING,
	addressCity: Sequelize.STRING,
	addressState: Sequelize.STRING,
	addressPostal: Sequelize.STRING,
	isInternationalStudent: Sequelize.BOOLEAN,
	expectedCredential: Sequelize.STRING,
	status: Sequelize.STRING,
	registrationDate: Sequelize.STRING,
})

const Program = sequelize.define('Program', {
	programCode: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	programName: Sequelize.STRING,
})

Program.hasMany(Student, { foreignKey: 'program' })

const initialize = () =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				resolve()
			})
			.catch(() => reject('https://www.f0nt.com/release/th-sarabun-new/'))
	})

const getAllStudents = () =>
	new Promise((resolve, reject) => {
		Student.findAll()
			.then((res) => resolve(res))
			.catch(() => reject('no results returned'))
	})

const getInternationalStudents = () =>
	new Promise((resolve, reject) => {
		Student.findAll({ where: { isInternationalStudent: true } })
			.then((res) => resolve(res))
			.catch(() => reject('no results returned'))
	})

const getPrograms = () =>
	new Promise((resolve, reject) => {
		Program.findAll()
			.then((res) => resolve(res))
			.catch(() => reject('no results returned'))
	})

const addStudent = (studentData) =>
	new Promise((resolve, reject) => {
		studentData.isInternationalStudent = studentData.isInternationalStudent
			? true
			: false
		for (key in studentData) {
			if (key === '') {
				studentData[key] = null
			}
		}
		Student.create(studentData)
			.then((res) => resolve(res))
			.catch(() => reject('unable to create student'))
	})

const getStudentsByStatus = (status) =>
	new Promise((resolve, reject) => {
		Student.findAll({ where: { status } })
			.then((res) => resolve(res))
			.catch(() => reject('no results returned'))
	})

const getStudentsByProgramCode = (programCode) =>
	new Promise((resolve, reject) => {
		Student.findAll({ where: { programCode } })
			.then((res) => resolve(res))
			.catch(() => reject('no results returned'))
	})

const getStudentsByExpectedCredential = (credential) =>
	new Promise((resolve, reject) => {
		Student.findAll({ where: { expectedCredential: credential } })
			.then((res) => resolve(res))
			.catch(() => reject('no results returned'))
	})

const getStudentById = (sid) =>
	new Promise((resolve, reject) => {
		Student.findAll({ where: { studentID: sid } })
			.then((res) => resolve(res[0]))
			.catch(() => reject('no results returned'))
	})

const updateStudent = (studentData) =>
	new Promise((resolve, reject) => {
		studentData.isInternationalStudent = studentData.isInternationalStudent
			? true
			: false
		for (key in studentData) {
			if (key === '') {
				studentData[key] = null
			}
		}
		Student.update(studentData, { where: { studentID: studentData.studentID } })
			.then((res) => resolve(res))
			.catch(() => reject('unable to update student'))
	})

const addProgram = (programData) =>
	new Promise((resolve, reject) => {
		for (key in programData) {
			if (key === '') {
				programData[key] = null
			}
		}
		Program.create(programData)
			.then((res) => resolve(res))
			.catch(() => reject('unable to create program'))
	})

const updateProgram = (programData) =>
	new Promise((resolve, reject) => {
		for (key in programData) {
			if (key === '') {
				programData[key] = null
			}
		}
		Program.update(programData)
			.then((res) => resolve(res))
			.catch(() => reject('unable to update program'))
	})

const getProgramByCode = (pcode) =>
	new Promise((resolve, reject) => {
		Program.findAll({ where: { programCode: pcode } })
			.then((res) => resolve(res[0]))
			.catch(() => reject('no results returned'))
	})

const deleteProgramByCode = (pcode) =>
	new Promise((resolve, reject) => {
		Program.destroy({ where: { programCode: pcode } })
			.then(() => resolve('destroyed'))
			.catch((err) => reject(err))
	})

const deleteStudentById = (id) =>
	new Promise((resolve, reject) => {
		Student.destroy({ where: { studentID: id } })
			.then(() => resolve('destroyed'))
			.catch((err) => reject(err))
	})

module.exports = {
	initialize,
	getAllStudents,
	getInternationalStudents,
	getPrograms,
	addStudent,
	getStudentsByStatus,
	getStudentsByProgramCode,
	getStudentsByExpectedCredential,
	getStudentById,
	updateStudent,
	addProgram,
	updateProgram,
	getProgramByCode,
	deleteProgramByCode,
	deleteStudentById,
}
