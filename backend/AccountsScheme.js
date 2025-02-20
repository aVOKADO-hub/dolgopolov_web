import mongoose from 'mongoose'

const account = new mongoose.Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true } 
}, { versionKey: false });

export default mongoose.model('accounts',account)