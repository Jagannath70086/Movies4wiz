import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: new Date()
    }
});

export const Data = mongoose.models.Data || mongoose.model('Data', UserSchema, 'dummy');