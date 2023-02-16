const admin = (req, res) => {
    res.render('real_estate/admin', {
        page: 'My Real Estate',
        bar: true
    });

    //res.send('My real estate for you');
}

export {
    admin
}