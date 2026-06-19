//alert("Bienvenido a la Pagina")
    //let Nombre="Hola Usuario "
//alert(Nombre)

const btnMenu=document.getElementById("btnMenu")
const menuContent= document.querySelector(".menu-content")

btnMenu.onclick=function(){
    if (menuContent.style.display==="block"){
        menuContent.style.display="none";
    }
    else{ 
        menuContent.style.display="block";
    }
}


// ==========================================
// 1. CONFIGURACIÓN Y LOGICA GLOBAL DEL CARRITO
// ==========================================

// Función única para obtener el carrito actualizado desde localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

// Función única para guardar el carrito en localStorage
function guardarCarrito(nuevoCarrito) {
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
}
// Función para actualizar el número del contador visual (funciona en cualquier página)
function actualizarContador() {
    const contador = document.getElementById('contador-articulos');
    if (contador) {
        const carritoActual = obtenerCarrito();
        const totalArticulos = carritoActual.reduce((total, producto) => total + producto.cantidad, 0);
        contador.innerText = totalArticulos;
    }
}


// Escuchar los clics en los botones de "Agregar al carrito"
// Usamos delegación de eventos para asegurarnos de que capture siempre los clics
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('btn-agregar-carrito')) {
        const boton = event.target;
        const nombre = boton.getAttribute('data-nombre');
        const precio = parseFloat(boton.getAttribute('data-precio'));

        let carrito = obtenerCarrito();

        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.nombre === nombre);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }

        // Guardar cambios y actualizar contador visual al instante
        guardarCarrito(carrito);
        actualizarContador();
        alert(`Se añadió "${nombre}" al carrito.`);
    }
});

// Registrar el contador inmediatamente al cargar la página actual
document.addEventListener('DOMContentLoaded', actualizarContador);



// Si estamos en la página de Compra.html, renderizar el resumen
const listaCompra = document.getElementById('lista-carrito-compra');
const totalCompra = document.getElementById('total-compra');

function renderizarResumenCompra() {
    if (!listaCompra) return; // Si no estamos en la página de compra, salir
    
    listaCompra.innerHTML = '';
    let total = 0;
     // SOLUCIÓN: Definimos los datos frescos leyendo del localStorage directamente
    const carritoActual = obtenerCarrito(); 

    if (carritoActual.length === 0) {
        listaCompra.innerHTML = '<p>El carrito está vacío.</p>';
        totalCompra.innerText = '0';
        return;
    }

    carritoActual.forEach((item,indice) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        listaCompra.innerHTML += 
            `<div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #bce0ff; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="display:block; color:#333;">${item.nombre}</strong>
                    <span style="color:#666; font-size:14px;">$${item.precio} c/u - Subtotal: $${subtotal}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button type="button" class="btn-modificar-cantidad" onclick="cambiarCantidad(${indice}, -1)" style="padding: 2px 8px; background:#ffc107; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">-</button>
                    
                    <span style="font-weight:bold; min-width:20px; text-align:center;">${item.cantidad}</span>
                    
                    <button type="button" class="btn-modificar-cantidad" onclick="cambiarCantidad(${indice}, 1)" style="padding: 2px 8px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">+</button>
                    
                    <button type="button" onclick="eliminarProducto(${indice})" style="padding: 2px 6px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px; margin-left:5px;">🗑️</button>
                </div>
            </div>

    
        `;
    });

    if (totalCompra) totalCompra.innerText = total;
}
// Función para sumar o restar cantidad
function cambiarCantidad(indice, cambio) {
    let carritoActual = obtenerCarrito();
    
    // Aplicamos el cambio (puede ser +1 o -1)
    carritoActual[indice].cantidad += cambio;
    
    // Si la cantidad llega a 0 o menos, eliminamos el producto automáticamente
    if (carritoActual[indice].cantidad <= 0) {
        carritoActual.splice(indice, 1);
    }
    
    // Guardamos los cambios, actualizamos el resumen en pantalla y el contador de la cabecera
    guardarCarrito(carritoActual);
    renderizarResumenCompra();
    actualizarContador();
}

// Función para borrar el producto completo sin importar la cantidad
function eliminarProducto(indice) {
    let carritoActual = obtenerCarrito();
    carritoActual.splice(indice, 1); // Remueve el elemento del array
    
    guardarCarrito(carritoActual);
    renderizarResumenCompra();
    actualizarContador();
}
// Registrar el resumen inmediatamente al cargar si corresponde
document.addEventListener('DOMContentLoaded', renderizarResumenCompra);
// Modificación del envío de WhatsApp con los datos del carrito
const formCompra = document.getElementById('formCompra');
if (formCompra) {
    formCompra.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const carritoActual = obtenerCarrito(); // CORRECCIÓN: Cambiado por carritoActual

        if (carritoActual.length === 0) {
            alert("Tu carrito está vacío. Agrega productos antes de confirmar.");
            return;
        }

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const celularCliente = document.getElementById('celular').value; 
        const tuTelefono = "5491137780214"; // <--- Pon tu WhatsApp real acá

        // 1. Armar la lista de productos comprados para el texto de WhatsApp
        let listaProductosTexto = '';
        let total = 0;
        
        carritoActual.forEach(item => {
            listaProductosTexto += `- ${item.cantidad}x ${item.nombre} ($${item.precio * item.cantidad})%0A`;
            total += item.precio * item.cantidad;
        });

        // 2. Redactar el mensaje completo
        const mensaje = `Hola! Quiero confirmar mi compra.%0A%0A` +
                        `*DATOS DEL CLIENTE:*%0A` +
                        `*Nombre:* ${encodeURIComponent(nombre)}%0A` +
                        `*Email:* ${encodeURIComponent(email)}%0A` +
                        `*Celular:* ${encodeURIComponent(celularCliente)}%0A%0A` +
                        `*DETALLE DEL PEDIDO:*%0A${listaProductosTexto}%0A` +
                        `*TOTAL A PAGAR:* $${total}%0A%0A` +
                        `Quedo a la espera de las instrucciones de pago.`;

        const urlWhatsapp = `https://wa.me/${tuTelefono}?text=${mensaje}`;
        
        // Vaciar carrito después de enviar la orden
        localStorage.removeItem('carrito');
        
        window.open(urlWhatsapp, '_blank');
         // Actualizar la pantalla por si el usuario regresa
        renderizarResumenCompra();
        actualizarContador();
    });
}





