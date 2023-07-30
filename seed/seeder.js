import {exit} from 'node:process';
import categories from './categories.js';
import prices from './prices.js';
import db from '../config/db.js';
import {Category, Price} from '../models/index.js';

const importData = async () => {
    try {
        //Authenticate
        const result = await db.authenticate;

        //Generate columns
        await db.sync();

        //Insert data
        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices)
        ]);

        exit();

    } catch (error) {
        console.log(error);
        exit(1);
    }
}

const deleteData = async () => {
    try {
        /*await Promise.all([
            Category.destroy({where: {}, truncate: true}),
            Price.destroy({where: {}, truncate: true})
        ]);*/

        await db.sync({force: true})
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if(process.argv[2] === "-i"){
    importData();
}

if(process.argv[2] === "-d"){
    deleteData();
}