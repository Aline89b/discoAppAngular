const Company = require("../models/company.model");
const Event = require("../models/event.model");
const { List } = require("../models/list.model");
const Locale = require("../models/locale.model");
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");



const search = async (req, res) => {
  const query = req.body.query;
console.log(req.body)
  if (!query || query.length < 3) {
    return res.json([]);
  }
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

 
  const decoded = jwt.verify(token, process.env.JWT_SECRET); 
 const userId = decoded.userId
const userRole = decoded.role
let companyId
  try {
    const user = await User.findById(userId);
if (!user) {
  return res.status(404).json({ message: 'User not found' });
}

companyId = user.companyId; 
    const baseFilter = { $regex: query, $options: 'i' };
   const companyFilter = userRole === 'admin' ? {} : { companyId: companyId };

    const users = await User.find({
      $or: [
        { name: baseFilter },  
        { email: baseFilter }
      ],
      ...companyFilter
    }).limit(10);

    const places = await Locale.find({
      name: baseFilter,
      ...companyFilter
    }).limit(10);

    const events = await Event.find({
      name: baseFilter,
      ...companyFilter
    }).limit(10);

    const companies = await Company.find({
      name: baseFilter,
      ...companyFilter
    }).limit(10);

    const lists = await List.find({
      name: baseFilter,
      ...companyFilter
    }).limit(10);

    if (!users.length && !places.length && !events.length && !companies.length && !lists.length) {
      return res.status(404).json({ message: 'No results found' });
    }
    console.log('events:',events)
    res.json([...users, ...places,...events,...companies,...lists]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching search results' });
  }
};

const getSearchDetail = async (req, res) => {
  const { id } = req.params; 
console.log(id)
  try {
    let item;

   
    item = await Event.findById(id);
    if (item) return res.json(item);

  
    item = await User.findById(id);
    if (item) return res.json(item);

    
    item = await Company.findById(id);
    if (item) return res.json(item);

    item = await Locale.findById(id);
    if (item) return res.json(item);

    item = await List.findById(id);
    if (item) return res.json(item);

    return res.status(404).json({ message: 'Item not found' });
   
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while fetching item details' });
  }
};


module.exports = {search, getSearchDetail}