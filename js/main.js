const SUPABASE_URL = "https://cgkdzchttbnlsmnoitcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_mSk3yM7TrroFoCx6AC_oVg_6awgO7Jh";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const estrelas = document.querySelectorAll(".stars i");
    let mediaAtual = 0;

    // Função para puxar as notas da nuvem
    async function carregarAvaliacoes() {
        const { data, error } = await supabase
            .from("avaliacoes") 
            .select("estrelas");

        if (error) {
            console.error("Erro ao carregar dados:", error.message);
            return;
        }

        const total = data.length;
        let soma = 0;
        data.forEach(item => soma += item.estrelas);

        mediaAtual = total ? (soma / total) : 0;
        const mediaFormatada = mediaAtual.toFixed(1);

        document.getElementById("average").textContent = mediaFormatada;
        document.getElementById("votes").textContent = total;

        // Pinta as estrelas inicialmente com base na média real do banco
        atualizarEstrelasVisuais(Math.round(mediaAtual));
    }

    // Função auxiliar para mudar a cor das estrelas
    function atualizarEstrelasVisuais(nota) {
        estrelas.forEach((star, i) => {
            if (i < nota) {
                star.style.color = "#ffc107"; // Amarelo/Dourado para as acesas
            } else {
                star.style.color = "#555"; // Cinza para as apagadas
            }
        });
    }

    // Inicializa o contador ao abrir a página
    carregarAvaliacoes();

    // Eventos do mouse e clique nas estrelas
    estrelas.forEach((star, index) => {
        
        // Efeito Hover: passa o mouse e elas acendem dinamicamente
        star.addEventListener("mouseenter", () => {
            atualizarEstrelasVisuais(index + 1);
        });

        // Tirar o mouse: volta a exibir a média real gravada no banco
        star.addEventListener("mouseleave", () => {
            atualizarEstrelasVisuais(Math.round(mediaAtual));
        });

        // Clique: Grava o voto na nuvem
        star.addEventListener("click", async () => {
            const nota = Number(star.dataset.rating);
            
            // Força a pintura visual do clique imediato
            atualizarEstrelasVisuais(nota);

            const { error } = await supabase
                .from("avaliacoes")
                .insert({ estrelas: nota });

            if (error) {
                console.error("Erro detalhado do Supabase:", error.message);
                alert("O banco recusou o voto. Verifique se o RLS está desativado!");
                carregarAvaliacoes(); // Desfaz a pintura visual voltando ao real
                return;
            }

            alert("Avaliação enviada com sucesso! 🚀");
            carregarAvaliacoes(); // Atualiza os números na tela
        });
    });

    // ESCUTA EM TEMPO REAL (Se outra pessoa votar em outro PC, atualiza a sua tela na hora)
    supabase
      .channel('mudancas-avaliacoes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'avaliacoes' }, () => {
          carregarAvaliacoes();
      })
      .subscribe();
});


document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".card");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const track = document.getElementById("carousel-track");

    let index = 0;
    const total = items.length;
    let startX = 0;
    let dragging = false;

    function render() {
        items.forEach((item, i) => {
            item.classList.remove("active", "next", "prev", "hidden");

            if (i === index) {
                item.classList.add("active");
            }
            else if (i === (index + 1) % total) {
                item.classList.add("next");
            }
            else if (i === (index - 1 + total) % total) {
                item.classList.add("prev");
            }
            else {
                item.classList.add("hidden");
            }
        });
    }

    function goNext() {
        index = (index + 1) % total;
        render();
    }

    function goPrev() {
        index = (index - 1 + total) % total;
        render();
    }

    nextBtn?.addEventListener("click", goNext);
    prevBtn?.addEventListener("click", goPrev);

    track?.addEventListener("pointerdown", (e) => {
        dragging = true;
        startX = e.clientX;
        track.classList.add("dragging");
    });

    track?.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const delta = e.clientX - startX;
        track.style.setProperty("--drag-offset", `${delta}px`);
    });

    const endDrag = (e) => {
        if (!dragging) return;
        const delta = e.clientX - startX;
        if (delta < -60) {
            goNext();
        } else if (delta > 60) {
            goPrev();
        }
        track.style.removeProperty("--drag-offset");
        track.classList.remove("dragging");
        dragging = false;
    };

    track?.addEventListener("pointerup", endDrag);
    track?.addEventListener("pointerleave", endDrag);
    track?.addEventListener("pointercancel", endDrag);

    render();

    const contactContainers = document.querySelectorAll('.tooltip-container');

    contactContainers.forEach((container) => {
        const iconLink = container.querySelector('.icon');

        iconLink?.addEventListener('click', (event) => {
            if (!container.classList.contains('open')) {
                event.preventDefault();
                document.querySelectorAll('.tooltip-container.open').forEach((other) => {
                    if (other !== container) {
                        other.classList.remove('open');
                    }
                });
                container.classList.add('open');
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.tooltip-container')) {
            document.querySelectorAll('.tooltip-container.open').forEach((container) => {
                container.classList.remove('open');
            });
        }
    });
});