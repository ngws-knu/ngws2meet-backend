const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const embeddedUserSchema = new Schema({
  id:           { type: String, required: true },
  name:         { type: String, required: true },
  passwordHash: { type: String, required: true },
  isHost:       { type: Boolean, default: false }
});

const eventSchema = new Schema(
  {
    event_name: { type: String, required: true, minlength: 3 },
    users:      { type: [embeddedUserSchema], required: true },
    start_date: { type: String, required: true },
    end_date:   { type: String, required: true },
    start_time: { type: String, required: true },
    end_time:   { type: String, required: true },
    availability:{ type: Object },
    metaEnd: { type: Number, required: true },
  },
  { timestamps: true }
);
eventSchema.index({ _id: 1, "users.name": 1 }, { unique: true });
module.exports = mongoose.model("Event", eventSchema);
