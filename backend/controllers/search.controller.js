const Company = require("../models/company.model");
const Event = require("../models/event.model");
const { List } = require("../models/list.model");
const Locale = require("../models/locale.model");
const User = require("../models/users.model");


const search = async (req, res) => {
  const query = req.body.query;
console.log(req.body)
  if (!query || query.length < 3) {
    return res.json([]);
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },  
        { email: { $regex: query, $options: 'i' } }  
      ]
    }).limit(10);
    const places = await Locale.find({ name: { $regex: query, $options: 'i' } }).limit(10);
    const events = await Event.find({ name: { $regex: query, $options: 'i' } }).limit(10);
    const companies = await Company.find({ name: { $regex: query, $options: 'i' } }).limit(10);
    const lists = await List.find({ name: { $regex: query, $options: 'i' } }).limit(10);
    if (!users.length && !places.lenght && !events.length && !companies.length && !lists.length) {
      return res.status(404).json({ message: 'No results found' });
    }
    console.log(users)
    res.json([...users, ...places,...events,...companies,...lists]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching search results' });
  }
};

module.exports = search