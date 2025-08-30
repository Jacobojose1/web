// ===== CARGAR PRODUCTOS + BUSCADOR INTELIGENTE =====
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("store-container");
  const searchInput = document.getElementById("searchInput");

  if (!container) return;

  let productos = [];

  // Cargar productos desde JSON
  fetch('productos.json')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar productos.json');
      return response.json();
    })
    .then(data => {
      productos = data;
      mostrarProductos(productos); // Mostrar todos al inicio
    })
    .catch(err => {
      container.innerHTML = `<p style="color: red; text-align: center;">Error: ${err.message}</p>`;
      console.error("Error cargando productos:", err);
    });

  // === BUSCADOR CON FUZZY SEARCH (tolerancia a errores) ===
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query === '') {
        mostrarProductos(productos); // Mostrar todos si está vacío
      } else {
        // Filtrar con coincidencia aproximada
        const resultados = productos.filter(prod => 
          fuzzyMatch(query, prod.nombre.toLowerCase()) ||
          fuzzyMatch(query, prod.descripcion.toLowerCase())
        );
        mostrarProductos(resultados);
      }
    });
  }

  // Mostrar productos en el contenedor
  function mostrarProductos(lista) {
    if (lista.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #777;">
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      `;
      return;
    }

    // Generar grid para PC
    const gridHTML = `
      <div class="store-cards">
        ${lista.map(prod => `
          <div class="store-card">
            <div class="product-image">
              <img src="${prod.imagen}" alt="${prod.nombre}">
            </div>
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion}</p>
            <p><strong>$${prod.precio.toLocaleString()}</strong></p>
            <p class="stock">Stock: ${prod.stock} unidades</p>
            <a href="https://wa.me/5491130114206?text=Hola,%20quiero%20comprar%20${encodeURIComponent(prod.nombre)}" 
               target="_blank" class="btn-comprar">comprar</a>
          </div>
        `).join('')}
      </div>
    `;

    // Generar carrusel para móvil
    const carouselHTML = `
      <div class="store-carousel-container">
        <button class="carousel-btn prev-btn" id="prevBtn">←</button>
        <div class="store-carousel" id="storeCarousel">
          ${lista.map(prod => `
            <div class="store-card">
              <div class="product-image">
                <img src="${prod.imagen}" alt="${prod.nombre}">
              </div>
              <h3>${prod.nombre}</h3>
              <p>${prod.descripcion}</p>
              <p><strong>$${prod.precio.toLocaleString()}</strong></p>
              <p class="stock">Stock: ${prod.stock} unidades</p>
              <a href="https://wa.me/5491130114206?text=Hola,%20quiero%20comprar%20${encodeURIComponent(prod.nombre)}" 
                 target="_blank" class="btn-comprar">comprar</a>
            </div>
          `).join('')}
        </div>
        <button class="carousel-btn next-btn" id="nextBtn">→</button>
      </div>
    `;

    container.innerHTML = gridHTML + carouselHTML;

    // Reiniciar carrusel solo si hay productos
    setupCarousel();
  }

  // === BUSQUEDA FLEXIBLE (Fuzzy Search) ===
  function fuzzyMatch(search, text) {
    search = search.replace(/\s+/g, ''); // Quitar espacios
    text = text.replace(/\s+/g, '');
    
    let i = 0, j = 0;
    while (i < search.length && j < text.length) {
      if (search[i] === text[j]) {
        i++;
      }
      j++;
    }
    return i === search.length; // Si encontró todas las letras en orden
  }

  // === CARRUSEL (igual que antes) ===
  function setupCarousel() {
    const carousel = document.getElementById("storeCarousel");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (!carousel || !nextBtn || !prevBtn) return;

    const cardWidth = 260;
    const gap = 15;
    const scrollAmount = cardWidth + gap;
    let currentIndex = 0;
    const totalCards = carousel.children.length;
    const maxIndex = totalCards - 1;

    function updateButtons() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    function handleResize() {
      if (window.innerWidth <= 768) {
        carousel.parentElement.style.display = "flex";
        nextBtn.style.display = "flex";
        prevBtn.style.display = "flex";
        updateButtons();
      } else {
        carousel.parentElement.style.display = "none";
        nextBtn.style.display = "none";
        prevBtn.style.display = "none";
      }
    }

    handleResize();

    nextBtn.addEventListener("click", () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        carousel.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
        updateButtons();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        carousel.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
        updateButtons();
      }
    });

    window.addEventListener("resize", handleResize);
  }
});
