import express from 'express';
import mongoose from 'mongoose';
import router from './Router.js'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_URL = 'mongodb://localhost:27017/Diplom_Physical';
const PORT = 5000;

const app = express();

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: DB_URL }),
    cookie: { secure: false }
}));

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

app.use('/api', router);

async function startApp() {
    try {
        await mongoose.connect(DB_URL);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

startApp();

export default DB_URL