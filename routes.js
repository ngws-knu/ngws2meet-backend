const express = require("express");
const user = require("./Models/Event.js");
const { IDGenerator, generateAvailability } = require("./utils.js");
const bcrypt = require("bcryptjs");
const moment = require("moment");

var router = express.Router()

router.get("/", function (req, res) {
  //Show all users
  user
    .find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/:id", function (req, res) {
  //Finds users by ID
  user
    .findById(req.params.id)
    .then((doc) => res.json(doc))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/add", function (req, res) {
  //Add a new user
  console.log(req.body)
  const event_name = req.body.event_name;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const start_time = req.body.start_time;
  const end_time = req.body.end_time;
  const availability = generateAvailability(
    start_date,
    end_date,
    start_time,
    end_time
  );
  const endUnix = Math.floor(
    new Date(`${end_date}T${end_time}:00`).getTime() / 1000
  );

  const newUser = new user({
    event_name,
    start_date,
    end_date,
    users: [],
    start_time,
    end_time,
    availability,
    metaEnd: endUnix,
  });
  //Create users_time_object
  newUser
    .save()
    .then(() => res.json(newUser.id))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/:id/adduser", async (req, res) => {
  try {
    const { user: userName, password } = req.body;
    if (!userName || !password)
      return res.status(400).json({ message: "name 과 password 모두 필요합니다." });

    const eventDoc = await user.findById(req.params.id);
    if (!eventDoc)
      return res.status(404).json({ message: "event not found" });

    const existing = eventDoc.users.find(u => u.name === userName);

    if (existing) {
      const ok = await bcrypt.compare(password, existing.passwordHash || "");
      if (!ok)
        return res.status(401).json({ message: "password incorrect" });
      return res.json({ message: "welcome back", id: existing.id });
    }

    // 3) 새 사용자
    const ID = IDGenerator();
    const passwordHash = await bcrypt.hash(password, 10);
    const isHost = eventDoc.users.length === 0;
    const newUserObj = { id: ID, name: userName, passwordHash, isHost };

    await user.updateOne(
      { _id: req.params.id },
      { $push: { users: newUserObj } },
      { runValidators: true }
    );

    return res.json({ message: "user created", id: ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});


router.put("/:id/update", async (req, res) => {

  const { availability, userId } = req.body;

  const eventDoc = await user.findById(req.params.id);
  if (!eventDoc) return res.status(404).json({ message: "event not found" });
  if (!eventDoc.users.some(u => u.id === userId))
    return res.status(403).json({ message: "forbidden" });


  eventDoc.availability = availability;
  await eventDoc.save();
  res.json({ message: "availability saved" });
});

module.exports = router;