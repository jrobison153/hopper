import restify from 'restify'
import uuid from 'uuid'

const port = 8080
let restifyServer = null

let server = {}

export default server

server.start = function () {

    restifyServer = restify.createServer();

    restifyServer.post('/chromosomes', (req, resp, next) => {

        resp.send({id: uuid.v4()})
    })

    restifyServer.get('/chromosomes/:resourceId', (req, resp, next) => {

        resp.send(['58b3fe41d13742ff314f2a4f'])
    })

    return new Promise((resolve) => {

        restifyServer.listen(port, function () {

            console.log(`${restifyServer.name} listening at ${restifyServer.url}`)
            resolve()
        })
    })
}

server.stop = function () {

    if (restifyServer !== null) {

        console.log(`Stopping server ${restifyServer.name} at ${restifyServer.url}`)

        restifyServer.close()
    }
}