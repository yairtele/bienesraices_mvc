import Category from "../models/Category.js";
import Price from "../models/Price.js";

const admin = (req, res) => {
    res.render('property/admin', {
        page: 'My Real Estate',
        bar: true
    });
}

const create = async (req, res) => {

    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ]);

    res.render('property/create', {
        page: 'Post Property',
        bar: true,
        categories: categories,
        prices: prices
    });
}

export {
    admin,
    create
}