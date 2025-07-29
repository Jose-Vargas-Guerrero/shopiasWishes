
// Redirige al usuario a la página especificada
function goTo(page) {
  window.location.href = page;
}

// Agrega un producto al carrito y lo guarda en localStorage
function agregarAlCarrito(nombre, cantidad, precio) {
  // Obtiene el carrito desde localStorage o crea uno nuevo si no existe
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Busca si el producto ya está en el carrito
  const index = carrito.findIndex(item => item.nombre === nombre);

  if (index >= 0) {
    // Si ya existe, solo aumenta la cantidad
    carrito[index].cantidad += cantidad;
  } else {
    // Si no existe, lo agrega como nuevo producto
    carrito.push({ nombre, cantidad, precio });
  }

  // Guarda el carrito actualizado en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Muestra una alerta de confirmación
  alert(`"${nombre}" se agregó al carrito.`);

  // Actualiza el contador visual del carrito
  actualizarContadorCarrito();
}

// Muestra el total de productos en el carrito al lado del ícono o botón
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Suma la cantidad total de todos los productos
  const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  // Encuentra el contador en el HTML y actualiza su contenido
  const contador = document.getElementById('carrito-contador');
  if (contador) {
    contador.textContent = totalCantidad;
  }
}

// Muestra u oculta la descripción y precio de un producto al hacer clic
function mostrarDescripcion(elemento, descripcion, precio) {
  const contenedor = elemento.querySelector('.descripcion-producto');
  if (!contenedor) return;

  // Verifica si ya está visible
  const estaVisible = contenedor.style.display === 'block';

  // Oculta todas las descripciones visibles
  document.querySelectorAll('.descripcion-producto').forEach(div => {
    div.style.display = 'none';
    div.innerHTML = '';
  });

  // Si no estaba visible, muestra la descripción actual
  if (!estaVisible) {
    contenedor.innerHTML = `
      <p>${descripcion}</p>
      <p><strong>Precio:</strong> L ${precio}</p>;
    `
    contenedor.style.display = 'block';
  }
}

// Muestra el formulario de cotización (normalmente oculto)
function mostrarFormulario() {
  const form = document.getElementById('formulario-cotizacion');
  if (form) form.style.display = 'block';
}

// Envía la cotización por WhatsApp con los datos del cliente y productos
function enviarCotizacion(event) {
  event.preventDefault(); // Evita que se recargue la página al enviar formulario

  // Obtiene los datos del formulario
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const codigo = document.getElementById('codigo').value;

  // Obtiene el carrito desde localStorage
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Arma el mensaje de WhatsApp
  let mensaje = `Hola, soy ${nombre}. Mi número es ${telefono}.`;
  if (codigo) {
    mensaje += ` Código de cliente: ${codigo}.`;
  }

  mensaje += "\nProductos:\n";
  carrito.forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad} (L ${item.precio.toFixed(2)})\n`;
  });

  // Genera el enlace para enviar por WhatsApp
  const url = `https://wa.me/50431780133?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank"); // Abre en nueva pestaña

  // Limpia el carrito luego de enviar
  localStorage.removeItem('carrito');

  // Limpia visualmente la tabla del carrito si está presente
  if (document.getElementById('cart-items')) {
    document.getElementById('cart-items').innerHTML = '';
    document.getElementById('total').textContent = 'L 0.00';
  }

  // Actualiza el contador de productos
  actualizarContadorCarrito();
}

// Actualiza la tabla del carrito con los productos almacenados
function actualizarCarrito() {
  const tbody = document.getElementById('cart-items');
  const totalSpan = document.getElementById('total');

  if (!tbody || !totalSpan) return; // Si no existe el carrito en la página, no hace nada

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  tbody.innerHTML = ''; // Limpia la tabla
  let total = 0;

  // Recorre el carrito y genera filas en la tabla
  carrito.forEach((item, index) => {
    const fila = document.createElement('tr');
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    // Crea el contenido HTML de cada fila
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>L ${item.precio.toFixed(2)}</td>
      <td>L ${subtotal.toFixed(2)}</td>
      <td><button onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
    `;
    tbody.appendChild(fila); // Agrega la fila a la tabla
  });

  // Muestra el total en la parte inferior
  totalSpan.textContent = `L ${total.toFixed(2)}`;

  // Actualiza el contador de productos
  actualizarContadorCarrito();
}

// Elimina un producto del carrito según el índice
function eliminarDelCarrito(index) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Elimina el elemento en la posición indicada
  carrito.splice(index, 1);

  // Guarda el carrito actualizado
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Refresca la tabla del carrito
  actualizarCarrito();
}

// Evento que se ejecuta cuando la página ha terminado de cargarse
document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito(); // Muestra el contador desde el inicio

  // Si está en la página del carrito, actualiza su contenido
  if (document.getElementById('cart-items')) {
    actualizarCarrito();
  }
});

