const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const guestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
 
  phone: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['invited', 'confirmed', 'declined', 'attended'],
    default: 'invited',
  },
  numberOfFriends: {
    type: Number,
    required: false,
  },
}, { timestamps: true });

const listSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // Assuming lists are associated with companies
    required: true,
  },
  guests: [guestSchema], // Embedding guestSchema as an array
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Optional: link to a specific event
  },
}, { timestamps: true });

// Step 3: Export the Models
const List = mongoose.model('List', listSchema);
const Guest = mongoose.model('Guest', guestSchema);

module.exports = { List, Guest };
