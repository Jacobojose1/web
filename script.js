// ===== VALIDACIÓN DEL FORMULARIO Y CARRUSEL RESPONSIVE =====
document.addEventListener("DOMContentLoaded", function () {
  // ✅ Validación del formulario
  const form = document.querySelector('.form-container');
  if (form) {
    form.addEventListener('submit', function (e) {
      const nombre = document.querySelector('input[name="nombre"]').value;
      const email = document.querySelector('input[name="email"]').value;

      if (nombre.trim() === '') {
        e.preventDefault();
        alert('Por favor, ingresa tu nombre.');
        return;
      }

      if (!email.includes('@')) {
        e.preventDefault();
        alert('Por favor, ingresa un correo válido.');
        return;
      }
    });
  }

  // 🛒 CARRUSEL: Solo se activa en pantallas pequeñas
  const carousel = document.getElementById("storeCarousel");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  // Si no existen los elementos, no hacer nada
  if (!carousel || !nextBtn || !prevBtn) return;

  // Solo inicializar carrusel si estamos en móvil
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Variables del carrusel
  let currentIndex = 0;
  const cardWidth = 260;
  const gap = 15;
  const scrollAmount = cardWidth + gap;
  const totalCards = carousel.children.length;
  const maxIndex = totalCards - 1; // solo 1 visible

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  // Solo activar carrusel si es móvil
  function handleResize() {
    if (isMobile()) {
      // Activar carrusel
      carousel.parentElement.style.display = "flex";
      nextBtn.style.display = "flex";
      prevBtn.style.display = "flex";
      updateButtons();
    } else {
      // En PC: desactivar carrusel
      carousel.parentElement.style.display = "none";
      nextBtn.style.display = "none";
      prevBtn.style.display = "none";
    }
  }

  // Inicializar estado
  handleResize();

  // Botón → Siguiente
  nextBtn.addEventListener("click", function () {
    if (currentIndex < maxIndex) {
      currentIndex++;
      carousel.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
      updateButtons();
    }
  });

  // Botón ← Anterior
  prevBtn.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      carousel.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
      updateButtons();
    }
  });

  // Revisar tamaño al cambiar ventana
  window.addEventListener("resize", handleResize);
});