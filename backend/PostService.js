import mongoose from 'mongoose';
import DB_URL from './index.js';
import * as path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import postSchema from './PostScheme.js'
import fs from 'fs'
import xlsx from 'xlsx'
import { response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PostService {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await mongoose.connect(DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }
    }

    getModel(collectionName) {
        return mongoose.model(collectionName, postSchema);
    }

    async create(post, collectionName) {
        await this.connect();
        const PostModel =  await this.getModel(collectionName);
        const createdPost = await PostModel.create(post);
        return createdPost;
    }

    async getCollections(req, res) {
        try {
            await this.connect();
            const db = this.connection.connection.db;
            let collections = await db.listCollections().toArray();
            collections.sort((a, b) => a.name.localeCompare(b.name));
            collections = collections.filter(collection => collection.name !== 'accounts'&&collection.name !== 'sessions');
            return collections;
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    async getCollection(collectionName) {
        try {
            await this.connect();
            const db = this.connection.connection.db;
            const collection = await db.collection(collectionName).find().toArray();
            return collection;
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    async getAll(collectionName) {
        await this.connect();
        const PostModel = this.getModel(collectionName);
        const allPosts = await PostModel.find();
        return allPosts;
    }

    async getOne(id, collectionName) {
        if (!id) {
            throw new Error('Id not entered');
        }
        await this.connect();
        const PostModel = this.getModel(collectionName);
        const post = await PostModel.findById(id);
        return post;
    }

    async edit(id, collectionName) {
        await this.connect();
        const PostModel = this.getModel(collectionName);
        const document = await PostModel.findOne({ _id: id }).exec();
        console.log(document);
        return document;
    }

    async update(post, collectionName) {
        const updateData = post;
        delete updateData.id;

        if (!post._id) {
            throw new Error('Wrong ID');
        }
        await this.connect();
        const PostModel = this.getModel(collectionName);
        const updatedPost = await PostModel.findByIdAndUpdate(post._id, post, { new: true });
        return updatedPost;
    }

    async delete(collectionName, id) {
        await this.connect();
        const db = this.connection.connection.db;
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

        return result;
    }
    async export(collectionName) {
    await this.connect();
    const db = this.connection.connection.db;
    const documents = await db.collection(collectionName).find().toArray();

    const fieldLabels = {
        rank: 'Звання',
        name: 'ПІБ',
        ageGroup: 'Вікова група',
        exercise3: '3 км',
        exercise3Result: 'Результат 3 км',
        exercise14: 'Підтягування',
        exercise14Result: 'Результат підтягування',
        exercise20: 'КСВ',
        exercise20Result: 'Результат КСВ',
        exercise25: '100 м',
        exercise25Result: 'Результат 100 м',
        exercise6a: 'Згинання та розгинання рук в упорі лежачи',
        exercise6aResult: 'Результат в упорі лежачи',
        exercise9: 'Біг на 2 км',
        exercise9Result: 'Результат 2 км',
        exercise10: 'Біг на 1 км',
        exercise10Result: 'Результат 1 км',
        exercise11: 'Згинання та розгинання тулуба',
        exercise11Result: 'Результат прес'
    };

    const headers = [
        'rank',
        'name',
        'exercise3Result',
        'exercise3',
        'exercise14Result',
        'exercise14',
        'exercise20Result',
        'exercise20',
        'exercise25Result',
        'exercise25',
        'exercise6aResult',
        'exercise6a',
        'exercise9Result',
        'exercise9',
        'exercise10Result',
        'exercise10',
        'exercise11Result',
        'exercise11'
    ];

    // Map headers to Ukrainian labels
    const headerTranslations = headers.map(field => fieldLabels[field] || field);

    const worksheet = xlsx.utils.json_to_sheet(documents, {
        header: headers,
        skipHeader: true // Avoid default header generation
    });

    // Add Ukrainian labels as the first row (manually set headers)
    xlsx.utils.sheet_add_aoa(worksheet, [headerTranslations], { origin: "A1" });

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const outputFilePath = path.join('test.xlsx');
    xlsx.writeFile(workbook, outputFilePath);

    return { fs, outputFilePath };
}

}

export default new PostService();
