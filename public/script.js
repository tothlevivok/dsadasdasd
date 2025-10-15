const regName = document.getElementById('regName')
const regPass = document.getElementById('regPass')
const regAge = document.getElementById('regAge')
const regWeight = document.getElementById('regWeight')

const loginName = document.getElementById('loginName')
const loginPass = document.getElementById('loginPass')


async function login(){
    const request = await fetch('/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({'username': loginName.value, 'password': loginPass.value})
    })
    const response = await request.json()
    if(request.ok && response.token){
        sessionStorage.setItem('token', response.token)
        console.log("Sikeres bejelentkezés!")
        window.open("./main.html", "_self")
    }
}

async function RegisterUser(){
    const request = await fetch('/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({'username': regAge.value, 'password': regPass.value, 'age': regAge.value, 'weight': regWeight.value})
    })
    const response = await request.json()
    console.log(response)
    window.open("./login.html")
}

function changeToLogin(){
    window.open("./login.html")
}

const loadedBook = document.getElementById('loadedBook')
const makeBook = document.getElementById('makeBook')
const modifyBook = document.getElementById('modifyBook')
const deleteBook = document.getElementById('deleteBook')

async function loadBooks(){
    const response = await fetch("/book")
    const result = await response.json()
    loadedBook.style.lineHeight = '1.8'
    for(let item of result){
        const li = document.createElement('li')
        li.innerText = `id: ${item.id}, title: ${item.title}, author: ${item.author}, publicationYear: ${item.publicationYear}, pages: ${item.pages}, genre: ${item.genre}`
        li.style.listStyle = "none"
        li.style.color = "rgba(255, 255, 255, 0.65)"
        li.style.padding = "0.5em"
        li.style.background = "#202020"
        li.style.borderRadius = "10px"
        li.style.marginTop = "1em"

        li.addEventListener('mouseover', () =>{
            li.style.background = "rgba(232, 229, 229, 0.19)"
        })
        li.addEventListener('mouseleave', () =>{
            li.style.background = "#202020"
        })

        const delButton = document.createElement('button')
        delButton.innerText = "X"
        delButton.style.background = "rgba(255, 0, 0, 0.39)"
        delButton.style.marginLeft = "15px"
        delButton.style.width = "3em"
        delButton.style.float = "right"

        delButton.addEventListener('click', () => {
            li.remove()
            fetch("/book/" + item.id, {
                method: "DELETE",
                headers: {
                    "authorization": sessionStorage.getItem('token')
                }
            })
        })

        li.appendChild(delButton)
        loadedBook.appendChild(li)
    }
}

loadBooks()

const titleInput = document.getElementById('titleInput')
const authorInput = document.getElementById('authorInput')
const publicationInput = document.getElementById('publicationInput')
const pageInput = document.getElementById('pageInput')
const genreInput = document.getElementById('genreInput')

async function AddBook(){
    const request = await fetch('/book', {
        method: "POST",
        headers: {
            "authorization": sessionStorage.getItem('token'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({'title': titleInput.value, 'author': authorInput.value, 'publicationYear': publicationInput.value, 'pages': pageInput.value, 'genre': genreInput.value})
    })
    const response = await request.json()
    console.log(response)
    loadedBook.innerHTML = ""
    loadBooks()
}


const mTitle = document.getElementById('mTitle')
const mAuthor = document.getElementById('mAuthor')
const mPublicationInput = document.getElementById('mPublicationInput')
const mPages = document.getElementById('mPages')
const mGenre = document.getElementById('mGenre')

async function ModifyBook(){
    const id = document.getElementById('mID').value
    const request = await fetch('/book/' + id, {
        method: "PUT",
        headers: {
            "authorization": sessionStorage.getItem('token'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({'title': mTitle.value, 'author': mAuthor.value, 'publicationYear': mPublicationInput.value, 'pages': mPages.value, 'genre': mGenre.value})
    })
    const response = await request.json()
    console.log(response)
    loadedBook.innerHTML = ""
    loadBooks()
}