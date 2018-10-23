var express = require('express');
var router = express.Router();


//Get category model
var Category = require('../models/category');

/*
 * GET category index
 */
router.get('/', function (req, res) {
    //res.send('category index')
    Category.find(function (err, categories) {
        if (err) return console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    });
});

/*
 * GET add category
 */
router.get('/add-category', function (req, res) {

    var title = "";

    res.render('admin/add_category', {
        title: title,

    });

});


/*
 * Post add category
 */
router.post('/add-category', function (req, res) {

    req.checkBody('title', 'title must have a value...plz assign a value').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title,
        });
    } else {
        //console.log('sucess');
        Category.findOne({ slug: slug }, function (err, category) {
            if (category) {
                req.flash('danger', 'category title already exists, try to choose another');
                res.render('admin/add_category', {
                    title: title,
                });
            } else {
                var category = new Category({
                    title: title,
                    slug: slug,

                });

                category.save(function (err) {
                    if (err)
                        return console.log(err);
                    // to display all the products category in side just like filter
                    Category.find(function (err, categories) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.categories = categories;
                        }
                    });
                    req.flash('success', 'category added sucessfully...');
                    res.redirect('/admin/categories');
                });
            }
        });

    }


});

/*
 * GET edit category
 */
router.get('/edit-category/:id', function (req, res) {
    Category.findById(req.params.id, function (err, category) {
        if (err) return console.log(err);

        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });
    });

});

/*
 * Post edit category
 */
router.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'title must have a value...plz assign a value').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    } else {
        //console.log('sucess');
        Category.findOne({ slug: slug, _id: { '$ne': id } }, function (err, category) {
            if (category) {
                req.flash('danger', 'page category already exists, try to choose another');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            } else {
                Category.findById(id, function (err, category) {
                    if (err) return console.log(err);
                    category.title = title;
                    category.slug = slug;

                    category.save(function (err) {
                        if (err)
                            return console.log(err);
                        // to display all the products category in side just like filter
                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        });
                        req.flash('success', 'category edited sucessfully...');
                        res.redirect('/admin/categories/edit-category/' + id);
                    });
                });


            }
        });

    }


});

/*
 * GET Delete category
 */
router.get('/delete-category/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) return console.log(err);
        // to display all the products category in side just like filter
        Category.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        });
        req.flash('success', 'category deleted sucessfully...');
        res.redirect('/admin/categories/');
    });
});

module.exports = router;