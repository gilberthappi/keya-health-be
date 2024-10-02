import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

const surveySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
    },
    age: {
        type: String,

    },
    height: {
        type: String, // Height in centimeters
       
    },
    weight: {
        type: String, // Weight in kilograms
       
    },
    bloodType: {
        type: String,
       
    },
    bloodPressure: {
        systolic: {
            type: String,
          
        },
        diastolic: {
            type: String,
          
        },
    },
    currentSymptoms: {
        type: String,
     
    },
    medications: {
        type: String,
      
    },
    allergies: {
        type: String,
      
    },
    chronicConditions: {
        type: String,
       
    },
    sleepQuality: {
        type: String,
       
    },
    foodDietRating: {
        type: String, 
        min: 1,
        max: 10,
       
    },
}, {
    timestamps: true
});

surveySchema.plugin(mongoosePaginate);

export const SURVEY = mongoose.model('SURVEY', surveySchema);
