// Project dependecies
const express = require('express');

// Server instance
const server = express();
server.use(express.json());

// number of calls
let calls = 0;

// middleware log
function log(req, res, next) {
  calls++;
  console.log(`Number of calls:${calls}`);
  next();
}

server.use(log);

// Memory pseudo database
let projects = [];

// encontrarProjeto
function findProjectById(id) {
  return projects.findIndex(predicate => predicate.id == id)
}

// Middleware verificaId
function verificaProjectId(req, res, next) {
  if (findProjectById(req.params.id) < 0) {
    return res.status(404).json({ error: "Project does not exist" })
  }
  next();
}

// GET all projects
function getProjects(req, res) {
  return res.json(projects);
}

// Delete a project
function deleteProjectById(req, res) {
  const { id } = req.params;
  const index = projects.findIndex(predicate => predicate.id == id);

  projects.splice(index, 1);
  return res.json(projects);
}

// Add a new project
function postProject(req, res) {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  return res.json(projects);
}

// Update a project
function putProjectById(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(predicate => predicate.id == id);

  projects[index].title = title;
  return res.json(projects);
}

// Add a task to a existing project
function postTaskByProjectId(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(predicate => predicate.id == id);

  projects[index].tasks.push(title);
  return res.json(projects);
}

// Routes
server.get("/projects", getProjects);
server.put("/projects/:id", verificaProjectId, putProjectById);
server.delete("/projects/:id", verificaProjectId, deleteProjectById);
server.post("/projects", postProject);
server.post("/projects/:id/tasks", verificaProjectId, postTaskByProjectId);

server.listen(3001);