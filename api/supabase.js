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
}); // Fechamento correto do DOMContentLoaded