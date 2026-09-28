// ============================================
// MODAL 1: VIDEO
// ============================================
const modalVideoOverlay = document.getElementById('modalVideoOverlay');
const modalVideoCerrar  = document.getElementById('modalVideoCerrar');
const modalVideoTitulo  = document.getElementById('modalVideoTitulo');
const modalVideoIcono   = document.getElementById('modalVideoIcono');
const modalVideo        = document.getElementById('modalVideo');
const modalVideoPdfBtn  = document.getElementById('modalVideoPdfBtn');

// ============================================
// MODAL 2: PDF FLIPBOOK
// ============================================
const modalPdfOverlay = document.getElementById('modalPdfOverlay');
const modalPdfCerrar  = document.getElementById('modalPdfCerrar');
const modalPdfTitulo  = document.getElementById('modalPdfTitulo');
const modalPdfIcono   = document.getElementById('modalPdfIcono');
const modalFlipbook   = document.getElementById('modalFlipbook');

let flipbookActual = null;    // Instancia del flipbook
let pdfPendiente   = '';      // PDF que se abrirá al pulsar el botón
let tituloPendiente = '';     // Título que se mostrará en el modal PDF
let iconoPendiente  = '';     // Icono que se mostrará en el modal PDF

// ============================================
// ABRIR MODAL DE VIDEO
// ============================================
document.querySelectorAll('.boton-leer').forEach((boton) => {
    boton.addEventListener('click', () => {
        const titulo = boton.dataset.titulo || 'Cuento';
        const icono  = boton.dataset.icono  || '📖';
        const video  = boton.dataset.video  || '';
        const pdf    = boton.dataset.pdf    || '';
        const textoPdf = boton.dataset.textoPdf || '📖 Leer el cuento completo';

        // Guardar datos para el modal PDF
        pdfPendiente    = pdf;
        tituloPendiente = titulo;
        iconoPendiente  = icono;

        // Rellenar el modal de video
        modalVideoTitulo.textContent = titulo;
        modalVideoIcono.textContent  = icono;
        modalVideo.src               = video;
        modalVideoPdfBtn.textContent = textoPdf;

        // Mostrar modal de video
        modalVideoOverlay.classList.add('activo');
        document.body.style.overflow = 'hidden';
    });
});

// ============================================
// BOTÓN DEBAJO DEL VIDEO → CIERRA VIDEO Y ABRE PDF
// ============================================
modalVideoPdfBtn.addEventListener('click', () => {
    // Cerrar modal de video
    cerrarModalVideo();

    // Pequeña espera para que la transición sea suave
    setTimeout(() => {
        abrirModalPdf();
    }, 300);
});

// ============================================
// ABRIR MODAL DE PDF
// ============================================
function abrirModalPdf() {
    // Rellenar el modal PDF
    modalPdfTitulo.textContent = tituloPendiente;
    modalPdfIcono.textContent  = iconoPendiente;

    // Mostrar modal PDF
    modalPdfOverlay.classList.add('activo');
    document.body.style.overflow = 'hidden';

    // Esperar a que el modal sea visible antes de crear el flipbook
    setTimeout(() => {
        crearFlipbook(pdfPendiente);
    }, 150);
}

// ============================================
// CREAR FLIPBOOK CON PDFlipbook (SympleNZ)
// ============================================
function crearFlipbook(pdfUrl) {
    // Destruir instancia anterior si existe
    if (flipbookActual) {
        try {
            flipbookActual.destroy();
        } catch (e) {
            console.warn('No se pudo destruir el flipbook anterior:', e);
        }
        flipbookActual = null;
    }

    // Limpiar contenedor
    modalFlipbook.innerHTML = '';

    if (!pdfUrl) {
        modalFlipbook.innerHTML = '<p style="padding:2rem;color:#aaa;">PDF no disponible</p>';
        return;
    }

    // Crear el div que contendrá el flipbook
    const libroDiv = document.createElement('div');
    libroDiv.setAttribute('data-pdflipbook', pdfUrl);
    libroDiv.style.width = '100%';
    libroDiv.style.height = '100%';
    libroDiv.style.minHeight = '450px';

    modalFlipbook.appendChild(libroDiv);

    // Inicializar PDFlipbook
    try {
        flipbookActual = PDFlipbook.create(libroDiv, {
            url: pdfUrl,
            startPage: 1,
            displayMode: 'auto',
            controls: true,
            shadow: 'fullscreen'
        });
    } catch (e) {
        console.error('Error al crear el flipbook:', e);
        modalFlipbook.innerHTML = '<p style="padding:2rem;color:#aaa;">No se pudo cargar el PDF.</p>';
    }
}

// ============================================
// CERRAR MODAL DE VIDEO
// ============================================
function cerrarModalVideo() {
    modalVideoOverlay.classList.remove('activo');
    modalVideo.src = ''; // Detiene el video
    document.body.style.overflow = '';
}

modalVideoCerrar.addEventListener('click', cerrarModalVideo);

modalVideoOverlay.addEventListener('click', (e) => {
    if (e.target === modalVideoOverlay) {
        cerrarModalVideo();
    }
});

// ============================================
// CERRAR MODAL DE PDF
// ============================================
function cerrarModalPdf() {
    // Destruir el flipbook
    if (flipbookActual) {
        try {
            flipbookActual.destroy();
        } catch (e) { /* ignorar */ }
        flipbookActual = null;
    }

    modalFlipbook.innerHTML = '';
    modalPdfOverlay.classList.remove('activo');
    document.body.style.overflow = '';
}

modalPdfCerrar.addEventListener('click', cerrarModalPdf);

modalPdfOverlay.addEventListener('click', (e) => {
    if (e.target === modalPdfOverlay) {
        cerrarModalPdf();
    }
});

// ============================================
// CERRAR CON ESC (AMBOS MODALES)
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    if (modalPdfOverlay.classList.contains('activo')) {
        cerrarModalPdf();
    } else if (modalVideoOverlay.classList.contains('activo')) {
        cerrarModalVideo();
    }
});