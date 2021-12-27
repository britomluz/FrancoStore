const app = Vue.createApp({
        data(){
            return{
                allProducts:[],
                producto:[],
                medicina:[],
                juguetes:[],
                destacados:[],                
                cart:[],
                modal:[],
                search:"",
                cantidad:[],
                searchProducts: false,
                total:"",
                nameeditproduct:"",
                totalProduct:"",
                totalQantity:"",
                totalPrice:"",
            }

        },

        created(){
            fetch("https://apipetshop.herokuapp.com/api/articulos")
            .then(res => res.json())
            .then(json =>{
                this.allProducts = json.response
                console.log(this.allProducts)                             
                this.pructsPages()
                //this.addToCart()
                this.mostrarModal()
                
            })
            .catch(err => console.error(err.message))

            //this.localStorage()
            if (localStorage.getItem("cart")) {
                this.cart = JSON.parse(localStorage.getItem("cart"));
                this.totalQantity = JSON.parse(localStorage.getItem("quantity"));
                //this.addToCart();
              }
            
              this.cart.forEach((c) => {
                this.total += c.precio * c.__v;
              });
              this.nameeditproduct = this.allProducts.nombre;
          
              let p = JSON.parse(localStorage.getItem("cart"));
          
              if (p != null) {
                p.forEach(p => {
                  this.totalProduct += p.precio * p.__v
                })
              }
        },
        methods:{
            localStorage(){
                this.cart.forEach((c) => {
                    this.total += c.price * c.quantity;
                  });
                  this.nameeditproduct = this.product.name;
              
                  let p = JSON.parse(localStorage.getItem("cart"));
              
                  if (p != null) {
                    p.forEach(p => {
                      this.totalProduct += p.price * p.quantity
                    })
                  }
            },
            addToCart(id) {
                this.totalPrice = 0;
          
                for (let i = 0; i < this.allProducts.length; i++) {
                  if (this.allProducts[i]._id == id) {
                    // si no esta en el carrito lo agrega
                    if (!this.cart.includes(this.allProducts[i])) {
                        this.allProducts[i].__v++;
                      this.cart.push( this.allProducts[i]);
                      this.totalQantity++
                    } else {
                      // de lo contraria le suma +1 a la cantidad del producto
                      this.allProducts[i].__v++;
                      this.totalQantity++
          
                    }
                    this.totalPrice = this.totalPrice + this.allProducts[i].price;
          
                  }
                }
               

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    //confirmButtonColor: "#098ccf",
                    background: "#eb0064",
                    confirmButtonText: "Continuar",
                    iconColor: "#ffffff",
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer)
                      toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                  })
                  
                  Toast.fire({
                    icon: 'success',
                    title: 'Añadido al carrito'
                  })


                localStorage.setItem("cart", JSON.stringify(this.cart));
                localStorage.setItem("quantity", JSON.stringify(this.totalQantity));
              },
              deleteOne(e) {
                this.cart.forEach((product) => {
                  if (e.target.id == product._id) {
                    product.__v--;
                    product.stock++;
                    this.totalQantity--
                  }
                });
                this.cart.forEach((product, i) => {
                  if (product.__v == 0) {
                    this.cart.splice(i, 1);
                  }
                  localStorage.setItem("cart", JSON.stringify(this.cart));
                  localStorage.setItem("quantity", JSON.stringify(this.totalQantity));
                });
              },
              addOne(e) {                  
                this.cart.forEach((product) => {
                  if (e.target.id == product._id) {
                    product.__v++;
                    product.stock--;
                    this.totalQantity++
                    localStorage.setItem("cart", JSON.stringify(this.cart));
                    localStorage.setItem("quantity", JSON.stringify(this.totalQantity));
                  }
                });
              },
              calculateTotal() {
                let total = 0;
                this.cart.forEach((product) => {
                  total += product.precio * product.__v;
                });
                return total;
              },
              emptyCart() {
                this.cart.forEach(product => product.__v = 0)
                this.cart = [];
                this.totalQantity = 0
                localStorage.setItem("cart", JSON.stringify(this.cart));
                localStorage.setItem("quantity", JSON.stringify(this.totalQantity));
              },
            pructsPages(){
                this.medicina = this.allProducts.filter(products => products.tipo === "Medicamento" || products.nombre === this.search)                                                
                this.juguetes = this.allProducts.filter(products => products.tipo === "Juguete")  
                this.destacados = this.allProducts.slice(6,10)             
            }, 
            filteredProducts(){
                let ascendente = this.medicina.sort((a,b) =>{
                             if(a.precio > b.precio) {
                                 return -1
                             } else if(a.precio < b.precio){
                                 return 1
                             }  else{
                                 return 0
                             }                             
                })
                    console.log(ascendente)
                    console.log("ascendente")
            },           
    
            mostrarModal(id){
                let product = this.allProducts.filter(item => item._id == id)
                this.modal = product                
            },
            searchProduct(e){
                e.preventDefault()
                this.medicina = this.allProducts.filter(products => products.tipo === "Medicamento" || products.nombre === this.search)                                                
                    
            }        

        },
        computed:{
          filterProductsMedicine(){
            return this.medicina.filter(product => product.descripcion.toLowerCase().match(this.search.toLowerCase()))
          },
          filterProductsToys(){
            return this.juguetes.filter(product => product.descripcion.toLowerCase().match(this.search.toLowerCase()))
          }  
            
        }

});

app.mount("#app")