const mongoose = require("mongoose");

const ticketModel = mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  timestamps: { type: String },
});

const TicketModel = mongoose.model("ticket", ticketModel);

module.exports = TicketModel;
