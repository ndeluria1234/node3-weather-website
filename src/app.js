const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express();
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../public/template/views')
const partialsPath = path.join(__dirname, '../public/template/partials')

app.set('view engine' , 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


app.use(express.static(publicDirectoryPath));

app.get('' , (req,res) => {
    res.render('index', {
        weather: 'Weather App',
        name: 'Neil'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        name: 'Neil'
    })
})
app.get('/help' , (req,res) => {
    res.render('help' , {
        title: 'Help me!!!',
        name: 'Neil'
    })
})
app.get('/weather', (req,res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must input an address!!'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
            })
        })
    })
})

app.get('/product' , (req,res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        product: []
    })
})

app.get('/help/*' , (req, res) => {
    res.render('404', {
        errormessage:'Help not working'
    })
})
app.get('*' , (req,res) => {
    res.render('404', {
        errormessage: '404 page'
    })
})
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})