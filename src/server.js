import http from 'node:http'

const users = []

const server = http.createServer( async (req, res) => {
    const {method, url} = req

    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

    if (method === "GET" && url === '/users') {
        return res
        .setHeader('Content-Type', 'application/json')
        .end(JSON.stringify(users))
    }

        if (method === "POST" && url === '/users') {
        if (!req.body) {
            return res
                .writeHead(400)
                .end(JSON.stringify({ error: 'Corpo da requisição inválido ou ausente' }))
        }

        const { name, email, endereco } = req.body

        users.push({
            id: users.length + 1,
            name,
            email,
            endereco,
        })

        return res.writeHead(201).end()
    }

    return res.writeHead(404).end()
})

server.listen(3333)
