// Firebase configuration (replace with your own config)
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase (you'll need to add Firebase SDK script to HTML)
// For now, we'll use localStorage as a temporary solution

document.addEventListener('DOMContentLoaded', () => {
    
    /* ========================================================
        1. LÓGICA DE NAVEGACIÓN (MENÚ HAMBURGUESA)
       ======================================================== */
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if(mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            // Abre o cierra el menú lateral
            navLinks.classList.toggle('active');
            // Transforma las rayitas en una X (animación CSS)
            mobileMenu.classList.toggle('active');
        });

        // Opcional: Cierra el menú automáticamente si se hace clic en un enlace
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    /* ========================================================
        2. LÓGICA PARA LA PÁGINA DE REGISTRO
       ======================================================== */
    const form = document.getElementById('registroForm');
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');

    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue

            // 1. Capturar los datos
            const nuevoCliente = {
                id: Date.now(), // Genera un ID único basado en la hora
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                sangre: document.getElementById('sangre').value,
                alergias: document.getElementById('alergias').value,
                condiciones: document.getElementById('condiciones').value,
                fecha: new Date().toLocaleDateString(),
                timestamp: new Date().toISOString()
            };

            // 2. Guardar en localStorage (temporal hasta que configures Firebase)
            try {
                // Obtener registros existentes
                let clientes = JSON.parse(localStorage.getItem('brujas_clientes') || '[]');
                clientes.push(nuevoCliente);
                localStorage.setItem('brujas_clientes', JSON.stringify(clientes));
                
                console.log("--- CLIENTE GUARDADO EN LOCALSTORAGE ---");
                console.log("Datos del cliente:", nuevoCliente);
                console.log("Total de clientes:", clientes.length);
                
                // Aquí iría el código real para Firebase:
                // await db.collection('clientes').add(nuevoCliente);

                // 3. Efecto Visual de Carga
                const btn = form.querySelector('button');
                const textoOriginal = btn.innerText;
                btn.innerText = "Procesando...";
                btn.style.opacity = "0.7";
                btn.disabled = true;

                setTimeout(() => {
                    // 4. Mostrar éxito
                    console.log("--- REGISTRO GUARDADO EXITOSAMENTE ---");
                    if(successMsg) successMsg.style.display = 'block';
                    if(errorMsg) errorMsg.style.display = 'none';
                    form.reset();
                    
                    btn.innerText = textoOriginal;
                    btn.style.opacity = "1";
                    btn.disabled = false;
                    
                    // Ocultar mensaje después de 4 segundos
                    setTimeout(() => {
                        if(successMsg) successMsg.style.display = 'none';
                    }, 4000);

                }, 1500); // Simula 1.5 segundos de espera de red

            } catch (error) {
                console.error("Error al guardar cliente:", error);
                
                // Mostrar mensaje de error
                if(errorMsg) {
                    errorMsg.textContent = "❌ Error al guardar. Intenta nuevamente.";
                    errorMsg.style.display = 'block';
                }
                
                const btn = form.querySelector('button');
                btn.innerText = "Guardar Registro";
                btn.style.opacity = "1";
                btn.disabled = false;
            }
        });
    }

    /* ========================================================
        3. FUNCIONES DE ADMINISTRACIÓN GLOBAL
       ======================================================== */
    // Función para ver todos los clientes (para administración en la consola)
    window.verClientes = function() {
        const clientes = JSON.parse(localStorage.getItem('brujas_clientes') || '[]');
        console.log("--- TODOS LOS CLIENTES REGISTRADOS ---");
        console.table(clientes);
        return clientes;
    };
});




/* ========================================================
        LÓGICA DEL ACORDEÓN DE SERVICIOS
       ======================================================== */
    const accordionItems = document.querySelectorAll('.accordion-item');

    // Inicializar el primer elemento abierto SOLO en celulares
    if(window.innerWidth <= 900 && accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
    }

    accordionItems.forEach(item => {
        item.addEventListener('click', () => {
            // El clic SOLO funcionará si la pantalla es de celular/tablet.
            // En PC (escritorio), el efecto se controla 100% con el mouse (hover).
            if(window.innerWidth <= 900) {
                accordionItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });




    /* ========================================================
        LÓGICA DE LA GALERÍA MASONRY (FILTROS Y LIGHTBOX)
       ======================================================== */

// 1. Validamos que 'filterBtns' exista y tenga botones en la página actual
if (typeof filterBtns !== 'undefined' && filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar clase 'active' a todos los botones y ponérsela al que se hizo clic
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Obtener qué filtro eligió el usuario (ej: "tatuajes")
            const filterValue = btn.getAttribute('data-filter');

            // Mostrar u ocultar las fotos según el filtro
            if (typeof masonryItems !== 'undefined') {
                masonryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-categoria');
                    
                    if (filterValue === 'todos' || filterValue === itemCategory) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            }
        });
    });
}

// 2. Validamos que 'masonryItems' exista antes de abrir el lightbox
if (typeof masonryItems !== 'undefined' && masonryItems.length > 0) {
    // Al hacer clic en una foto, abrir el lightbox
    masonryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgElement = item.querySelector('img');
            if (typeof lightboxImg !== 'undefined' && lightboxImg) {
                lightboxImg.src = imgElement.src; // Copia la ruta de la foto clickeada
            }
            if (typeof lightbox !== 'undefined' && lightbox) {
                lightbox.classList.add('active'); // Muestra el panel oscuro
            }
        });
    });
}

// 3. Validamos que exista el botón de cerrar 'closeBtn'
if (typeof closeBtn !== 'undefined' && closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (typeof lightbox !== 'undefined' && lightbox) {
            lightbox.classList.remove('active');
        }
    });
}

// 4. Validamos que exista el 'lightbox' para el clic en el fondo oscuro
if (typeof lightbox !== 'undefined' && lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (typeof lightboxImg !== 'undefined' && e.target !== lightboxImg) {
            lightbox.classList.remove('active');
        }
    });
}





    /* =========================================
    CONTROL DEL FORMULARIO DE REGISTRO
   ========================================= */
const registroForm = document.getElementById('registroForm');
const successMessage = document.getElementById('successMessage');

if (registroForm) {
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault(); // ¡Esta es la magia que detiene la recarga!

        // 1. Mostrar el mensaje de éxito
        successMessage.style.display = 'block';

        // 2. Limpiar todos los campos del formulario
        registroForm.reset();

        // 3. Ocultar el mensaje automáticamente después de 4 segundos
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 4000);
    });
}