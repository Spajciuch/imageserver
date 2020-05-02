let fetch = require('node-fetch');
async function start() {

    let fs = require('fs');

    const stats = fs.statSync("foo.txt");
    const fileSizeInBytes = stats.size;
    var {
        createCanvas,
        loadImage
    } = require('canvas')

    const photo = await loadImage("./wallpaper.png")
    var canvas = createCanvas(photo.width, photo.height)
    const ctx = canvas.getContext("2d")
    ctx.drawImage(photo, 0, 0, canvas.width, canvas.height);

    fetch('http://192.168.43.239:4000/r', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                name: "John",
                email: "john@example.com",
                file: `${canvas.toDataURL()}`
            }
        })
    }).then(res => res.json().then(result => {
        console.log(result)
    }))
}
start()