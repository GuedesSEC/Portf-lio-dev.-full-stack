document.addEventListener('DOMContentLoaded', () => {
    // Inicializar AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Toggle Menu Mobile
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Troca o ícone (hambúrguer / X)
            const icon = menuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Fechar menu ao clicar em um link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    
});
//CARROSEL//
document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carousel-item");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    let currentIndex = 0;
    const totalItems = items.length;

    function updateCarousel() {
        items.forEach((item, index) => {
            // Calcula a posição relativa ao card ativo atual
            let offset = index - currentIndex;
            
            // Tratamento para comportamento circular infinito
            if (offset < -1) offset += totalItems;
            if (offset > 1) offset -= totalItems;

            // Define os estilos 3D baseados na posição
            if (offset === 0) {
                // Card do Centro (Foco)
                item.style.transform = "translateX(0) rotateY(0deg) scale(1) translateZ(0px)";
                item.style.opacity = "1";
                item.style.zIndex = "3";
                item.style.pointerEvents = "auto";
            } else if (offset === 1 || offset === -2) {
                // Card da Direita
                item.style.transform = "translateX(60%) rotateY(-35deg) scale(0.85) translateZ(-150px)";
                item.style.opacity = "0.4";
                item.style.zIndex = "1";
                item.style.pointerEvents = "none";
            } else if (offset === -1 || offset === 2) {
                // Card da Esquerda
                item.style.transform = "translateX(-60%) rotateY(35deg) scale(0.85) translateZ(-150px)";
                item.style.opacity = "0.4";
                item.style.zIndex = "1";
                item.style.pointerEvents = "none";
            } else {
                // Caso existam mais cards no futuro, eles ficam ocultos ao fundo
                item.style.transform = "translateX(0) rotateY(0deg) scale(0.5) translateZ(-300px)";
                item.style.opacity = "0";
                item.style.zIndex = "0";
                item.style.pointerEvents = "none";
            }
        });
    }

    // Eventos dos botões
    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    // Rotação automática a cada 4 segundos (opcional - remova se preferir apenas cliques)
    let autoRotate = setInterval(() => {
        nextBtn.click();
    }, 4000);

    // Pausa a rotação automática se o usuário passar o mouse por cima
    const container = document.getElementById("carousel-track").parentElement;
    container.addEventListener("mouseenter", () => clearInterval(autoRotate));
    container.addEventListener("mouseleave", () => {
        autoRotate = setInterval(() => { nextBtn.click(); }, 4000);
    });

    // Inicializa a posição inicial
    updateCarousel();
});