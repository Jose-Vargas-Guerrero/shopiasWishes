

function goTo(page) {
  window.location.href = page;
}

function agregarAlCarrito(nombre, cantidad, precio) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const index = carrito.findIndex(item => item.nombre === nombre);

  if (index >= 0) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({ nombre, cantidad, precio });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`"${nombre}" se agregó al carrito.`);
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const contador = document.getElementById('carrito-contador');
  if (contador) {
    contador.textContent = totalCantidad;
  }
}

function mostrarDescripcion(elemento, descripcion, precio) {
  const contenedor = elemento.querySelector('.descripcion-producto');
  if (!contenedor) return;

  const estaVisible = contenedor.style.display === 'block';

  document.querySelectorAll('.descripcion-producto').forEach(div => {
    div.style.display = 'none';
    div.innerHTML = '';
  });

  if (!estaVisible) {
    contenedor.innerHTML = `
      <p>${descripcion}</p>
      <p><strong>Precio:</strong> L ${precio}</p>
      
    `;
    contenedor.style.display = 'block';
  }
}

function mostrarFormulario() {
  const form = document.getElementById('formulario-cotizacion');
  if (form) form.style.display = 'block';
}

function enviarCotizacion(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const codigo = document.getElementById('codigo').value;
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  let mensaje = `Hola, soy ${nombre}. Mi número es ${telefono}.`;
  if (codigo) {
    mensaje += ` Código de cliente: ${codigo}.`;
  }

  mensaje += "\nProductos:\n";
  carrito.forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad} (L ${item.precio.toFixed(2)})\n`;
  });

  const url = `https://wa.me/50431780133?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");

  localStorage.removeItem('carrito');
  if (document.getElementById('cart-items')) {
    document.getElementById('cart-items').innerHTML = '';
    document.getElementById('total').textContent = 'L 0.00';
  }
  actualizarContadorCarrito();
}

function actualizarCarrito() {
  const tbody = document.getElementById('cart-items');
  const totalSpan = document.getElementById('total');
  if (!tbody || !totalSpan) return;

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  tbody.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    const fila = document.createElement('tr');
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>L ${item.precio.toFixed(2)}</td>
      <td>L ${subtotal.toFixed(2)}</td>
      <td><button onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
    `;
    tbody.appendChild(fila);
  });

  totalSpan.textContent = `L ${total.toFixed(2)}`;
  actualizarContadorCarrito();
}

function eliminarDelCarrito(index) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();
  if (document.getElementById('cart-items')) {
    actualizarCarrito();
  }
});
