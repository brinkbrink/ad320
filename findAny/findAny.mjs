import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from "express";
import cors from 'cors';
dotenv.config();
const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;
const uri =
  `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const app = express();
app.use(cors());
app.use(express.json());
app.set('port', process.env.PORT || 3000);
app.post('/findAny', async (req,res) => {
    const {database, collection, filter, options} = req.body;
    try {
        
        await client.connect();
        const options = {projection: projection}
        const db = client.db(database);
        const collect = db.collection(collection);
        const result = await collect.findOne(filter, options);

        res.type('json');
        res.status(200);
        res.json(result);
    } catch (error) {
      console.log(error)  
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    
  });
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});
app.listen(app.get('port'), () => {
    console.log('Express started');
});