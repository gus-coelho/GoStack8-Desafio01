const express = require('express')
const app = express()
app.use(express.json())
console.log('Initialized Server')

const projects = []
var requestsCount = 0
console.log(`Executed requests: ${requestsCount}`)

// MIDDLEWARE GLOBAL, CONTA REQUISICOES EXECUTADAS
function increaseRequestsCount(req, res, next) {
  requestsCount++
  console.log(`Executed requests: ${requestsCount}`)
  return next()
}

// MIDDLEWARE LOCAL, VERIFICA SE ID CHAMADA EM PARAMS EXISTE
function checkIdExists(req, res, next) {
  const { id } = req.params
  const project = projects.find(p => p.id == id)
  
  if(!project) {
    console.log('No such id')
    return res.status(400).json({ error: 'Project not found'})
  }
  return next()
}

// ROTA PARA DEVOLVER TODOS OS PROJETOS REGISTRADOS
app.get('/projects', increaseRequestsCount, (req, res) => {
  return res.json(projects)
})

/* MOSTRAR APENAS 1 PROJETO (ROTA NAO SOLICITADA PELO DESAFIO) 

app.get('/projects/:id', (req, res) => {
  const { id } = req.params
  return res.json(projects[id])
})

*/


// RECEBER ID E TITLE NO CORPO E REGISTRAR AMBOS EM PROJECTS
app.post('/projects', increaseRequestsCount, (req, res) => {
  const { id, title } = req.body
  const project = {
    id,
    title,
    tasks: []
  }
  projects.push(project)
  return res.json(projects)
})

// RECEBER CAMPO TITLE E ARMAZENAR CAMPO TAREFA DE ACORDO COM ID EM PARAMS
app.post('/projects/:id/tasks', increaseRequestsCount, checkIdExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id == id)
  project.tasks.push(title)
  return res.json(project)
}) 

// ALTERAR APENAS O TITULO DO PROJETO COM ID NOS PARAMS
app.put('/projects/:id', increaseRequestsCount, checkIdExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body
  const project = projects.find(p => p.id == id)
  project.title = title
  return res.json(project)
}) 

// DELETAR PROJETO COMO ID NOS PARAMS
app.delete('/projects/:id', increaseRequestsCount, checkIdExists, (req, res) => {
  const { id } = req.params
  const project = projects.find(p => p.id == id)
  project.splice(project, 1)
  return res.json(project)
}) 

app.listen(3131)