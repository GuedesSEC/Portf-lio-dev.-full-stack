const SUPABASE_URL = "https://cgkdzchttbnlsmnoitcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_mSk3yM7TrroFoCx6AC_oVg_6awgO7Jh";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const estrelas = document.querySelectorAll(".stars i");
    const containerRating = document.querySelector(".rating"); // Seleciona o card principal
    let mediaAtual = 0;
    let mensagemTimeout; // Controla o tempo da mensagem na tela

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

    // FUNÇÃO PARA MOSTRAR O AGRADECIMENTO NA TELA
    function mostrarAgradecimento(texto, erro = false) {
        // Se já tiver uma mensagem na tela, remove ela antes de criar outra
        const mensagemAntiga = document.getElementById("feedback-toast");
        if (mensagemAntiga) mensagemAntiga.remove();
        clearTimeout(mensagemTimeout);

        // Cria o elemento de parágrafo para a mensagem
        const p = document.createElement("p");
        p.id = "feedback-toast";
        p.textContent = texto;
        
        // Estilização dinâmica para combinar com seu vidro/neon
        p.style.marginTop = "15px";
        p.style.fontSize = "14px";
        p.style.fontWeight = "bold";
        p.style.transition = "all 0.3s ease";
        p.style.color = erro ? "#ff4a4a" : "#00ff88"; // Vermelho se der erro, Verde Neon se der certo

        // Adiciona o texto no final do bloco de avaliação
        containerRating.appendChild(p);

        // Remove a mensagem da tela após 3 segundos
        mensagemTimeout = setTimeout(() => {
            p.style.opacity = "0";
            setTimeout(() => p.remove(), 300); // Espera o efeito de sumir terminar
        }, 3000);
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
                mostrarAgradecimento("Erro ao enviar. Verifique o RLS!", true);
                carregarAvaliacoes(); 
                return;
            }

            // EXIBE A MENSAGEM DO SEU FEEDBACK DIRETO NA TELA!
            mostrarAgradecimento("Obrigado pelo seu feedback! 🚀");
            carregarAvaliacoes(); // Atualiza os números na tela
        });
    });

    // ESCUTA EM TEMPO REAL
    supabase
      .channel('mudancas-avaliacoes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'avaliacoes' }, () => {
          carregarAvaliacoes();
      })
      .subscribe();
});