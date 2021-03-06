const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');


// Load Env Vars
dotenv.config({ path: './config/config.env' });

//  Load Models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
//  Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);


// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Bootcamps Imported...'.yellow.inverse);
    await Course.create(courses);
    console.log('Courses Imported...'.yellow.inverse);
    console.log('All Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete into DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('No argv provided:'.yellow.bold, 'Enter -i or -d'.green.bold)
  process.exit()
}
