    import mongoose from 'mongoose'


    const postSchema = new mongoose.Schema({
        rank: { type: String, required: true },
        name: { type: String, required: true },
        ageGroup: {type:String, required:true},
        exercise3Result: { type: String },
        exercise3: { type: String },
        exercise14Result: { type: String },
        exercise14: { type: String },
        exercise20Result: { type: String },
        exercise20: { type: String },
        exercise25Result: { type: String },
        exercise25: { type: String },
        exercise6aResult: { type: String },
        exercise6a: { type: String },
        exercise9Result: { type: String },
        exercise9: { type: String },
        exercise10Result: { type: String },
        exercise10: { type: String },
        exercise11Result: { type: String },
        exercise11: { type: String },
    }, { versionKey: false });
    export default postSchema;
