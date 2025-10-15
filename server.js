const express = require('express')
const server = express()
require('dotenv').config()

server.use(express.static("public"))
server.use(express.json())

const dbhandler = require('./dbhandler')
const JWT = require('jsonwebtoken')
const PORT = process.env.PORT

server.get('/user', async (req,res) => {
    return res.json(await dbhandler.user.findAll()).end()
})

dbhandler.user.sync({alter: true})
dbhandler.book.sync({alter: true})

const secretKey = "secret"

function Auth(){
    return (req,res,next) =>{
        try{
            const header = req.headers.authorization

            const decodedToken = JWT.verify(header, secretKey)
            req.username = decodedToken.username
            next()
        }
        catch(err){
            console.error()
            return res.status(409).json({message: 'Sikertelen hitelesítés!'}).end()
        }
    }
}

server.post('/login', async (req,res) =>{
    try{
        const { username, password } = req.body
        const oneUser = await dbhandler.user.findOne({
            where: {
                username: username
            }
        })
        if(!oneUser){
            return res.status(401).json({message: 'Nincs ilyen felhasználó!'}).end()
        }
        if(oneUser.password != password){
            return res.status(401).json({message: 'Hibás jelszó!'}).end()
        }
        const encodedToken = JWT.sign({username: oneUser.username}, secretKey, {expiresIn: '1h'})
        res.status(200).json({message: 'Sikeres bejelentkezés!', token: encodedToken}).end()
    }
    catch(err){
        console.error(err)
    }
})

server.post('/register', async (req,res) => {
    const { username, password, age, weight } = req.body
    const oneUser = await dbhandler.user.findOne({
        where: {
            username: username
        }
    })
    if(oneUser){
        return res.status(403).json({message: 'Már van ilyen felhasználó!'}).end()
    }
    await dbhandler.user.create({
        username: username,
        password: password,
        age: age,
        weight: weight
    })
    res.status(201).json({message: 'Sikeres regisztráció!'}).end()
})

server.put('/user/:id', async (req,res) => {
    const id = req.params.id
    if(!id){
        return res.status(400).json({message: 'Nincs felhasználó ID!'}).end()
    }
    const { password, age, weight } = req.body
    const oneUser = await dbhandler.user.findOne({
        where: {
            id: id
        }
    })
    if(oneUser){
        if(password){
            await dbhandler.user.update({
                password: password
            }, {
                where: {
                    id: id
                }
            })
        }
        if(age){
            await dbhandler.user.update({
                age: age
            }, {
                where: {
                    id: id
                }
            })
        }
        if(weight){
            await dbhandler.user.update({
                weight: weight
            }, {
                where: {
                    id: id
                }
            })
        }
        res.status(200).json({message: 'Sikeres felhasználó frissítés!'}).end()
    }
    else{
        return req.status(400).json({message: 'Sikertelen felhasználó frissítés!'}).end()
    }
})

server.get('/book', async (req,res) =>{
    return res.json(await dbhandler.book.findAll()).end()
})

server.post('/book', Auth(), async (req, res) =>{
    const { title, author, publicationYear, pages, genre } = req.body
    const oneBook = await dbhandler.book.findOne({
        where: {
            title: title,
            author: author
        }
    })
    if(oneBook){
        return res.status(403).json({message: 'Már van ilyen könyv!'}).end()
    }
    await dbhandler.book.create({
        title: title,
        author: author,
        publicationYear: publicationYear,
        pages: pages,
        genre: genre
    })
    res.status(201).json({message: 'Sikeres könyv létrehozás!'}).end()
})

server.put('/book/:id', Auth(), async (req,res) => {
    const id = req.params.id
    if(!id){
        return res.status(400).json({message: 'Érvénytelen könyv ID!'}).end()
    }
    const { title, author, publicationYear, pages, genre } = req.body
    const oneBook = await dbhandler.book.findOne({
        where: {
            id: id
        }
    })
    if(oneBook){
        if(title){
            await dbhandler.book.update({
                title: title
            }, {
                where: {
                    id: id
                }
            })
        }
        if(author){
            await dbhandler.book.update({
                author: author
            }, {
                where: {
                    id: id
                }
            })
        }
        if(publicationYear){
            await dbhandler.book.update({
                publicationYear: publicationYear
            }, {
                where: {
                    id: id
                }
            })
        }
        if(pages){
            await dbhandler.book.update({
                pages: pages
            }, {
                where: {
                    id: id
                }
            })
        }
        if(genre){
            await dbhandler.book.update({
                genre: genre
            }, {
                where: {
                    id: id
                }
            })
        }
        res.status(200).json({message: 'Sikeres könyv frissítés!'}).end()
    }
    else{
        return res.status(400).json({message: 'Sikertelen könyv frissítés!'}).end()
    }
})

server.delete('/book/:id', Auth(), async (req,res) =>{
    const id = req.params.id
    const oneBook = await dbhandler.book.findOne({
        where: {
            id: id
        }
    })
    if(oneBook){
        await dbhandler.book.destroy({
            where: {
                id: id
            }
        })
    }
    else{
        return res.status(400).json({message: 'Sikertelen törlés!'}).end()
    }
})

server.listen(PORT, () => {console.log("A szerver fut: localhost:" + PORT)})