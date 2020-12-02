import {MongoClient} from 'mongodb';


// mongo_user mongo_user_fdhsafiusadhi
const user = 'mongo_user';
const userPassword = 'mongo_user_fdhsafiusadhi';
const cluster = 'cluster0.kumpe';
const url = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/<dbname>?retryWrites=true&w=majority`

export const connectDatabase = async () => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, /* useUnifiedTopology: true */ });
    const db = client.db('main');
    return {
        listings: db.collection('test_listings')
    };
};