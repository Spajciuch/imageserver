const express = require('express')
const fileUpload = require('express-fileupload')
const uuidv4 = require('uuid/v4')
const app = express()
const fs = require("fs")
let bodyParser = require("body-parser")
const imageDataURI = require("image-data-uri")
app.use(fileUpload())

app.set('view engine', 'ejs')
app.use(express.urlencoded())

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}))
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}))

app.use(express.json())
app.get('/', (req, res) => {
    res.render('index', {
        foo: 'FOO'
    })
})

app.post("/r", async (request, response) => {

    console.log(Date.now() + " Ping Received")
    console.log("GOT AN REQUEST")

    var {
        createCanvas,
        loadImage
    } = require('canvas')

    // console.log(imageDataURI.decode(request.body.user.file).dataBuffer)

    const name = uuidv4()
    fs.writeFile("./images/" + name + '.png', imageDataURI.decode(request.body.user.file).dataBuffer, (err) => {
        if (err) throw err
        console.log('The file has been saved!')
        response.json(JSON.parse(`{"url": "${name}"}`))
    })


})

app.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.')
    }

    let sampleFile = req.files.sampleFile
    const name = uuidv4()
    sampleFile.mv("./images/" + name + ".png", function (err) {
        if (err)
            return res.status(500).send(err)

        res.send('File uploaded! -> ' + name)
    })
})

app.get("/read/:name", function (req, res) {
    let name = req.params.name
    if (!name.includes(".png")) name += ".png"
    name.replace("jpg", "png")

    fs.exists("./images/" + name, function (result, error) {
        if (result == false) {
            fs.readFile('x.png', function (err, data) {
                if (err) throw err
                res.write(data)
                res.end()
            })
        } else {
            fs.readFile("./images/" + name, function (err, data) {
                if (err) throw err
                res.write(data)
                res.end()
            })
        }
    })

})

app.listen(4000, () => console.log('Express app started on port 4000'))