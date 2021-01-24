const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load env vars

dotenv.config({path:'./config/config.env'});


//load models 
const BootCamp = require('./models/Bootcamp');
const Course = require('./models/Course');


//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
});

// Read JSON files

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
 
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));



// import into DB
const importData = async () =>{
    try {
        await BootCamp.create(bootcamps);
        await Course.create(courses);
        console.log('DATA imported ...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error();(error)
    }
};


// Delete Data from DB

const deleteData  = async () =>{
    try {
        await BootCamp.deleteMany();  // delete all the documents from the DB
        await Course.deleteMany();  // delete all the documents from the DB
        console.log('DATA destroyed ...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error();(error)
    }
};


// Delete of=or import based on the argument provided
if(process.argv[2] === '-i'){
     importData();
}else if (process.argv[2] === '-d'){
    deleteData();
}  