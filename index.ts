import express from 'express';
import bodyParser from 'body-parser';
import { Cat, Owner } from './interfaces';
import ejs from 'ejs';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const uri = "mongodb+srv://LennyCramm:ProjectPass@projects.okt8xon.mongodb.net/?retryWrites=true&w=majority&appName=Projects";
const client = new MongoClient(uri);

app.set('view engine', 'ejs');
app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const catsUrl = 'https://raw.githubusercontent.com/LennyCra/Webontwikkeling-Katten/main/catsInfo.json';
const ownersUrl = 'https://raw.githubusercontent.com/LennyCra/Webontwikkeling-Katten/main/catsOwnerInfo.json';



const fetchJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.json();
};

async function main() {
    try {
        await client.connect();
        const db = client.db("Projects");
        const catsCollection = db.collection("Cats");
        const ownersCollection = db.collection("Owners");

        const catsCount = await catsCollection.countDocuments();
        const ownersCount = await ownersCollection.countDocuments();

        if (catsCount === 0) {
            const cats: Cat[] = await fetchJson<Cat[]>(catsUrl);
            const catsResult = await catsCollection.insertMany(cats);
            console.log(`${catsResult.insertedCount} new documents(s) created in "Katten" collection.`);
        }

        if (ownersCount === 0) {
            const owners: Owner[] = await fetchJson<Owner[]>(ownersUrl);
            const ownersResult = await ownersCollection.insertMany(owners);
            console.log(`${ownersResult.insertedCount} new documents(s) created in "Owners" collection.`);
        }
    } catch (e) {
        console.error(e);
    }
}

app.get('/', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("Projects");
        const catsCollection = db.collection("Cats");
        const q = req.query.q ? req.query.q.toString().toLowerCase() : '';
        const sortField = req.query.sortField ? req.query.sortField.toString() : 'name';
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'asc';

        let cats = await catsCollection.find().toArray();

        let filteredCats = cats.filter(cat =>
            cat.name.toLowerCase().includes(q) ||
            cat.breed.toLowerCase().includes(q) ||
            cat.age.toString().includes(q)
        );

        filteredCats.sort((a, b) => {
            if (sortField === 'name') {
                return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (sortField === 'age') {
                return sortDirection === 'asc' ? a.age - b.age : b.age - a.age;
            } else if (sortField === 'breed') {
                return sortDirection === 'asc' ? a.breed.localeCompare(b.breed) : b.breed.localeCompare(a.breed);
            }
            return 0;
        });

        res.render('index', { cats: filteredCats, q: q, sortField: sortField, sortDirection: sortDirection });
    } catch (error: any) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});

app.get('/cats', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("Projects");
        const catsCollection = db.collection("Cats");
        const cats = await catsCollection.find().toArray();
        res.json(cats);
    } catch (error: any) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});

app.get('/cat/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("Projects");
        const catsCollection = db.collection("Cats");
        const ownersCollection = db.collection("Owners");
        const catId = parseInt(req.params.id, 10);
        const cat = await catsCollection.findOne({ id: catId });
        if (cat) {
            const owner = await ownersCollection.findOne({ id: cat.owner.id });
            if (owner) {
                res.render('detail', { cat, owner });
            } else {
                res.status(404).send('Owner not found');
            }
        } else {
            res.status(404).send('Cat not found');
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});

app.get('/owners', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("Projects");
        const ownersCollection = db.collection("Owners");
        const catsCollection = db.collection("Cats");
        const owners = await ownersCollection.find().toArray();
        const cats = await catsCollection.find().toArray();
        res.render('owners', { owners, cats });
    } catch (error: any) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});

app.get('/owners/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("Projects");
        const ownerId = parseInt(req.params.id, 10);
        const ownersCollection = db.collection("Owners");
        const catsCollection = db.collection("Cats");
        const owner = await ownersCollection.findOne({ id: ownerId });
        if (owner) {
            const ownerCats = await catsCollection.find({ 'owner.id': ownerId }).toArray();
            res.render('ownerDetail', { owner, ownerCats });
        } else {
            res.status(404).send('Owner not found');
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});


app.post('/cat/:id/edit', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("Projects");
        const catsCollection = db.collection("Cats");
        const catId = parseInt(req.params.id, 10);
        const newName = req.body.newName;

        const updateResult = await catsCollection.updateOne(
            { id: catId },
            { $set: { name: newName } }
        );

        if (updateResult.matchedCount === 0) {
            res.status(404).send('Cat not found');
        } else {
            res.redirect(`/cat/${catId}`);
        }
    } catch (error: any) { 
        res.status(500).send((error as Error).message);
    } finally {
        await client.close();
    }
});







main().catch(console.error);

app.listen(app.get('port'), () =>
    console.log('[server] http://localhost:' + app.get('port'))
);
