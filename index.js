const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;

const meetings = [
  { id: 1, name: "meeting1" },
  { id: 2, name: "meeting2" },
  { id: 3, name: "meeting3" },
];

const tasks = [
  { id: 1, name: "task1" },
  { id: 2, name: "task2" },
  { id: 3, name: "task3" },
];

app.get("/", (req, res) => {
  res.send("Server läuft 🚀");
});

// Meetings //
// Abfragen sämtlicher Meetings //
app.get("/api/meetings", (req, res) => {
  res.send(meetings);
});

// Abfragen eines bestimmten Meetings //
app.get("/api/meetings/:id", (req, res) => {
  const meeting = meetings.find((c) => c.id === parseInt(req.params.id));
  if (!meeting)
    return res
      .status(404)
      .send("Das Meeting mit der gewünschten ID wurde nicht gefunden");
  res.send(meeting);
});

// Hinzufügen eines Meetings //
app.post("/api/meetings", (req, res) => {
  const { error } = validateMeeting(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const meeting = {
    id: meetings.length + 1,
    name: req.body.name,
  };
  meetings.push(meeting);
  res.send(meeting);
});

// Updaten eines Meetings //
app.put("/api/meetings/:id", (req, res) => {
  const meeting = meetings.find((c) => c.id === parseInt(req.params.id));
  if (!meeting)
    return res
      .status(404)
      .send("Das Meeting mit der gewünschten ID wurde nicht gefunden");

  const { error } = validateMeeting(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  meeting.name = req.body.name;
  res.send(meeting);
});

// Löschen eines Meetings //
app.delete("/api/meetings/:id", (req, res) => {
  const meeting = meetings.find((c) => c.id === parseInt(req.params.id));
  if (!meeting)
    return res
      .status(404)
      .send("Das Meeting mit der gewünschten ID wurde nicht gefunden");

  const index = meetings.indexOf(meeting);
  meetings.splice(index, 1);

  res.send(meeting);
});

// Validierung, ob Meeting-Angaben den Kriterien entsprechen //
function validateMeeting(meeting) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(meeting);
}

// Tasks //
// Abfragen sämtlicher Tasks //
app.get("/api/tasks", (req, res) => {
  res.send(tasks);
});

// Abfragen eines bestimmten Tasks //
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((c) => c.id === parseInt(req.params.id));
  if (!task)
    return res
      .status(404)
      .send("Der Task mit der gewünschten ID wurde nicht gefunden");
  res.send(task);
});

// Hinzufügen eines Tasks //
app.post("/api/tasks", (req, res) => {
  const { error } = validateTask(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const task = {
    id: tasks.length + 1,
    name: req.body.name,
  };
  tasks.push(task);
  res.send(task);
});

// Updaten eines Tasks //
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find((c) => c.id === parseInt(req.params.id));
  if (!task)
    return res
      .status(404)
      .send("Der Task mit der gewünschten ID wurde nicht gefunden");

  const { error } = validateTask(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  task.name = req.body.name;
  res.send(task);
});

// Löschen eines Tasks //
app.delete("/api/tasks/:id", (req, res) => {
  const task = tasks.find((c) => c.id === parseInt(req.params.id));
  if (!task)
    return res
      .status(404)
      .send("Der Task mit der gewünschten ID wurde nicht gefunden");

  const index = tasks.indexOf(task);
  tasks.splice(index, 1);

  res.send(task);
});

// Validierung, ob Task-Angaben den Kriterien entsprechen //
function validateTask(task) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(task);
}

// Terminal-Info, auf welchem Port der Server läuft //
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
