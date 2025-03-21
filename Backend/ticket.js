// ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  // user: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'User', 
  //   required: true 
  // },
  startLocation: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
