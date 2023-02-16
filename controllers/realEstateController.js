const admin = (req, res) => {
    res.render('real_estate/admin', {
        page: 'My Real Estate',
        bar: true
    });
}

const create = (req, res) => {
    res.render('real_estate/create', {
        page: 'Post Real Estate',
        bar: true
    });
}

export {
    admin,
    create
}