const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;

const meetings = [
  {
    id: 1,
    name: "Führungsteam-Meeting",
    kategorie: "FTM",
    datum: "2026-01-31",
    zeit: "14.00 bis 17.00 Uhr",
    lead: "Bereichsleiter Publishing",
    teilnehmende: "Person 1, Person 2, Person 3, Person 4",
    entschuldigte: "Person 5",
    gäste: "Person 6",
    protokoll: "Person 3",
  },
  {
    id: 2,
    name: "Verleger-Dialog",
    kategorie: "VD",
    datum: "2026-05-04",
    zeit: "14.00 bis 16.30 Uhr",
    lead: "CEO",
    teilnehmende: "Person 1, Person 2, Person 3, Person 4",
    entschuldigte: "Person 5",
    gäste: "Person 6",
    protokoll: "Person 3",
  },
  {
    id: 3,
    name: "Town-Hall Publishing",
    kategorie: "THP",
    datum: "2026-03-06",
    zeit: "11.00 bis 13.00 Uhr",
    lead: "Bereichsleiter Publishing",
    teilnehmende: "Person 1, Person 2, Person 3, Person 4",
    entschuldigte: "Person 5",
    gäste: "Person 6",
    protokoll: "Person 3",
  },
];

const tasks = [
  {
    id: 1,
    name: "task1",
    thema: "Zustellung",
    erfasst: "2025-12-08",
    verantwortlich: "Person 2",
    fällig: "2026-02-24",
    status: "erfasst",
    auftragsbeschrieb: "",
  },
  {
    id: 2,
    name: "task1",
    thema: "Einzelverkauf",
    erfasst: "2025-06-30",
    verantwortlich: "Person 6",
    fällig: "2026-02-24",
    status: "erfasst",
    auftragsbeschrieb: "",
  },
  {
    id: 3,
    name: "task1",
    thema: "Zustellung",
    erfasst: "2026-01-10",
    verantwortlich: "Person 5",
    fällig: "2026-05-24",
    status: "in Arbeit",
    auftragsbeschrieb: "",
  },
];

app.get("/", (req, res) => {
  res.send("Server läuft 🚀");
});

// Meetings //
// Abfragen sämtlicher Meetings //
app.get("/api/meetings", (req, res) => {
  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(a.datum) - new Date(b.datum),
  );
  res.send(sortedMeetings);
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
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  const meeting = {
    id: meetings.length + 1,
    name: req.body.name,
    kategorie: req.body.kategorie,
    datum: req.body.datum,
    zeit: req.body.zeit,
    lead: req.body.lead,
    teilnehmende: req.body.teilnehmende,
    entschuldigte: req.body.entschuldigte,
    gäste: req.body.gäste,
    protokoll: req.body.protokoll,
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
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
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
    kategorie: Joi.string().required(),
    datum: Joi.date().iso().required(),
    zeit: Joi.string().required(),
    lead: Joi.string().required(),
    teilnehmende: Joi.string().required(),
    entschuldigte: Joi.string().allow(""),
    gäste: Joi.string().allow(""),
    protokoll: Joi.string().required(),
  });

  return schema.validate(meeting, { abortEarly: false });
}

// Tasks //
// Abfragen sämtlicher Tasks //
app.get("/api/tasks", (req, res) => {
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(b.fällig) - new Date(a.fällig),
  );
  res.send(sortedTasks);
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
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  const task = {
    id: tasks.length + 1,
    name: req.body.name,
    thema: req.body.thema,
    erfasst: req.body.erfasst,
    verantwortlich: req.body.verantwortlich,
    fällig: req.body.fällig,
    status: req.body.status,
    auftragsbeschrieb: req.body.auftragsbeschrieb,
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
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
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
    thema: Joi.string().required(),
    erfasst: Joi.date().iso().required(),
    verantwortlich: Joi.string().required(),
    fällig: Joi.date().iso().required(),
    status: Joi.string().required(),
    auftragsbeschrieb: Joi.string().allow(""),
  });

  return schema.validate(task, { abortEarly: false });
}

// Terminal-Info, auf welchem Port der Server läuft //
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
