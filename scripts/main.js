// document.addEventListener("DOMContentLoaded", () => {
//     fetch()
// })
const pageF = document.getElementById('farmacia')
const productsContainer = document.getElementById('container-products')
const carrito = document.getElementById('farmacia')
//const cartCanvas = document.getElementById('offcanvasRight')



let endpoint = 'https://apipetshop.herokuapp.com/api/articulos'
           
        fetch(endpoint)
        .then(res => res.json())
        .then(data =>{
            allProducts = data.response              
            toys = allProducts.filter(product => product.tipo === "Juguete")
            medicine = allProducts.filter(product => product.tipo === "Medicamento")
            //console.log(allProducts)
            pageF ?  printProducts(medicine) : printProducts(toys) 
            //pageF ? cartCanvas : cartCanvas
            selectedButtons(allProducts)
            printCart()
           
        })
        .catch(err => console.log(err.message))


function printProducts(array){
        const template = document.getElementById('template-products').content
        const fragment = document.createDocumentFragment()
            
        array.forEach(product => {           
            template.querySelector('img').setAttribute('src', product.imagen)
            template.querySelector('h5').textNContent = product.nombre
            template.querySelector('p span').textContent = product.precio
            template.querySelector('button').dataset.id = product._id

            const clone = template.cloneNode(true)
            fragment.appendChild(clone)
        })
    productsContainer.appendChild(fragment)
    }

let cart = {}

function selectedButtons(allProducts){
    const buttons = document.querySelectorAll('.card button')
    buttons.forEach(btn => {
        btn.addEventListener('click', () =>{
           
            let product = allProducts.find(item => item._id == btn.dataset.id)
           
            product.quantity = 1
            if (cart[product._id]){
               //console.log("ya existe")
               product.quantity = cart[product._id].quantity + 1
            }
            cart[product._id] = {...product}
            console.log("cart", cart)
            printCart()
        })
    })
}

let items = document.getElementById('items')

function printCart(){
    items.innerHTML = ''

    const template = document.getElementById('template-cart').content
    const fragment = document.createDocumentFragment() 
    Object.values(cart).forEach(product => {
       
        template.querySelector('img').setAttribute('src', product.imagen)
        template.querySelectorAll('td')[0].textContent = product.nombre
        template.querySelectorAll('td')[1].textContent = product.quantity
        template.querySelector('span').textContent = product.precio * product.quantity
        template.querySelector('.btn-info').dataset.id = product._id
        template.querySelector('.btn-danger').dataset.id = product._id

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    printFooter()
    printFooter()
}

let footer = document.getElementById('footer-cart')

function printFooter(){
    footer.innerHTML=''

    
    const template = document.getElementById('template-footer').content
    const fragment = document.createDocumentFragment() 

    let totalProducts = Object.values(cart).reduce((acumulador, {quantity}) => acumulador + quantity, 0)
    let totalPrice = Object.values(cart).reduce((acumulador, {quantity, precio}) => acumulador + quantity*precio, 0)
    console.log(totalPrice)

    template.querySelectorAll('td')[0].textContent = totalProducts
    template.querySelector('span').textContent = totalPrice

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    let btnCart = document.getElementById('vaciar-carrito')
    btnCart.addEventListener('click', () =>{
        cart = {}
        printCart()
    })
}
function addAndRestButtons(){
    let addButton = document.querySelectorAll('#items .btn-info')
    let restButton = document.querySelectorAll('#items .btn-danger')

    addButton.forEach(btn => {
        btn.addEventListener('click', () =>{
            console.log("add")
        })
    })
}