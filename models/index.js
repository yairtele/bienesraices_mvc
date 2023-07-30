import Property from './Property.js';
import Price from './Price.js';
import Category from './Category.js';
import User from './User.js';

Property.belongsTo(Price, {foreignKey: 'price'}); //Property has a price

export {
    Property,
    Price,
    Category,
    User
}