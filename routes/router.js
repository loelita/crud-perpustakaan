const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId

app.get('/', function (req, res) {
    res.render('./index', {
        tittle: 'XIR6'
    })
})

app.get('/detail/:id', function (req, res, next) {
    var o_id = new ObjectId(req.params.id)
    req.db.collection('buku').find({
        "_id": o_id
    }).toArray(function (err, result) {
        if (err) return console.log(err)

        if (!result) {
            req.flash('error', 'User not found with id = ' + req.params.id)
            res.redirect('/users')
        } else {
            res.render('user/detail', {
                title: 'Daftar Buku',
                data: result
            })

        }
    })
})



app.get('/tampil', function (req, res, next) {
    req.db.collection('buku').find().sort({
        "_id": -1
    }).toArray(function (err, result) {
        if (err) {
            req.flash('error', err)
            res.render('user/list', {
                title: 'Daftar Buku',
                data: ''
            })
        } else {
            res.render('user/list', {
                title: 'Daftar Buku',
                data: result
            })
        }
    })
})

app.get('/add', function (req, res, next) {
    res.render('user/add', {
        title: 'DATA BUKU',
        judul: '',
        stok: '',
        harga: ''
    })
})

app.post('/add', function (req, res, next) {
    req.assert('judul', 'Judul is required').notEmpty()
    req.assert('stok', 'Stok is required').notEmpty()
    req.assert('harga', 'Harga is required').notEmpty()

    var errors = req.validationErrors()

    if (!errors) {
        var user = {
            judul: req.sanitize('judul').escape().trim(),
            stok: req.sanitize('stok').escape().trim(),
            harga: req.sanitize('harga').escape().trim()
        }

        req.db.collection('buku').insert(user, function (err, result) {
            if (err) {
                req.flash('error', err)

                res.render('user/add', {
                    title: 'TAMBAH DATA',
                    judul: user.judul,
                    stok: user.stok,
                    harga: user.harga
                })
            } else {
                req.flash('Berhasil', 'Data berhasil ditambahkan!')

                res.redirect('/tampil')
            }
        })
    } else {
        var error_msg = ''
        error.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('user/add', {
            title: 'TAMBAH DATA',
            judul: req.body.judul,
            stok: req.body.stok,
            harga: req.body.harga
        })
    }

})

app.get('/edit/(:id)', function (req, res, next) {
    var o_id = new ObjectId(req.params.id)
    req.db.collection('buku').find({
        "_id": o_id
    }).toArray(function (err, result) {
        if (err) return console.log(err)

        if (!result) {
            req.flash('error', 'User not found with id = ' + req.params.id)
            res.redirect('/router')
        } else {
            res.render('user/edit', {
                title: 'EDIT DATA',
                id: result[0]._id,
                judul: result[0].judul,
                stok: result[0].stok,
                harga: result[0].harga
            })
        }
    })
})
app.put('/edit/(:id)', function (req, res, next) {
    req.assert('judul', 'Judul is required').notEmpty()
    req.assert('stok', 'Stok is required').notEmpty()
    req.assert('harga', 'Harga is required').notEmpty()

    var errors = req.validationErrors()

    if (!errors) {
        var user = {
            judul: req.sanitize('judul').escape().trim(),
            stok: req.sanitize('stok').escape().trim(),
            harga: req.sanitize('harga').escape().trim()
        }

        var o_id = new ObjectId(req.params.id)
        req.db.collection('buku').update({
            "_id": o_id
        }, user, function (err, result) {
            if (err) {
                req.flash('error', err)
                res.render('user/edit', {
                    title: 'EDIT DATA',
                    id: req.params.id,
                    judul: req.body.judul,
                    stok: req.body.stok,
                    harga: req.body.harga
                })
            } else {
                req.flash('Berhasil', 'Data berhasil diupdate')
                res.redirect('/tampil')
            }
        })
    } else {
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })

        req.flash('error', error_msg)

        res.render('user/edit', {
            title: 'EDIT DATA',
            id: req.params.id,
            judul: req.body.judul,
            stok: req.body.stok,
            harga: req.body.harga
        })
    }
})


app.delete('/delete/(:id)', function (req, res, next) {
    var o_id = new ObjectId(req.params.id)
    req.db.collection('buku').remove({
        "_id": o_id
    }, function (err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/router')
        } else {
            req.flash('Berhasil', 'Data berhasil dihapus')
            res.redirect('/tampil')
        }
    })
})

module.exports = app