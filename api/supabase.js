const SUPABASE_URL = "https://cgkdzchttbnlsmnoitcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_mSk3yM7TrroFoCx6AC_oVg_6awgO7Jh";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


document.addEventListener("DOMContentLoaded", () => {

    console.log("Sistema de avaliação carregado");


    const estrelas = document.querySelectorAll(".stars i");
    const containerRating = document.querySelector(".rating");

    let mediaAtual = 0;
    let mensagemTimeout;


    console.log("Estrelas encontradas:", estrelas.length);



    // ===============================
    // CARREGAR AVALIAÇÕES DO BANCO
    // ===============================
    async function carregarAvaliacoes() {


        const { data, error } = await supabase
            .from("avaliacoes")
            .select("estrelas");


        if (error) {

            console.error(
                "Erro ao carregar avaliações:",
                error.message
            );

            return;
        }



        const total = data.length;


        let soma = 0;


        data.forEach(item => {

            soma += item.estrelas;

        });



        mediaAtual = total ? soma / total : 0;



        const media = mediaAtual.toFixed(1);



        const campoMedia = document.getElementById("average");
        const campoVotos = document.getElementById("votes");



        if (campoMedia)
            campoMedia.textContent = media;


        if (campoVotos)
            campoVotos.textContent = total;



        atualizarEstrelasVisuais(
            Math.round(mediaAtual)
        );

    }




    // ===============================
    // PINTAR ESTRELAS
    // ===============================
    function atualizarEstrelasVisuais(nota) {


        estrelas.forEach((star, index) => {


            if(index < nota){

                star.style.color = "#ffc107";

            }else{

                star.style.color = "#555";

            }


        });


    }





    // ===============================
    // MENSAGEM DE FEEDBACK
    // ===============================
    function mostrarAgradecimento(texto, erro = false) {



        const antiga =
            document.getElementById(
                "feedback-toast"
            );



        if(antiga)
            antiga.remove();



        clearTimeout(mensagemTimeout);



        const mensagem =
            document.createElement("p");



        mensagem.id =
            "feedback-toast";



        mensagem.textContent =
            texto;



        mensagem.style.marginTop =
            "15px";

        mensagem.style.fontSize =
            "14px";

        mensagem.style.fontWeight =
            "bold";

        mensagem.style.color =
            erro ? "#ff4444" : "#00ff88";



        containerRating.appendChild(
            mensagem
        );



        mensagemTimeout =
            setTimeout(() => {


                mensagem.style.opacity = "0";


                setTimeout(() => {

                    mensagem.remove();

                },300);


            },3000);


    }





    // ===============================
    // CLIQUE NAS ESTRELAS
    // ===============================
    estrelas.forEach((star, index) => {



        star.addEventListener(
            "mouseenter",
            () => {

                atualizarEstrelasVisuais(
                    index + 1
                );

            }
        );




        star.addEventListener(
            "mouseleave",
            () => {

                atualizarEstrelasVisuais(
                    Math.round(mediaAtual)
                );

            }
        );





        star.addEventListener(
            "click",
            async () => {


                const nota =
                    Number(
                        star.dataset.rating
                    );



                console.log(
                    "Nota escolhida:",
                    nota
                );



                // mostra na hora
                mostrarAgradecimento(
                    "Obrigado pelo feedback! 🚀"
                );



                atualizarEstrelasVisuais(
                    nota
                );



                const { error } =
                    await supabase
                    .from("avaliacoes")
                    .insert({
                        estrelas: nota
                    });



                if(error){


                    console.error(
                        "Erro Supabase:",
                        error.message
                    );


                    mostrarAgradecimento(
                        "Erro ao enviar avaliação!",
                        true
                    );


                    return;

                }



                carregarAvaliacoes();


            }
        );



    });




    // inicia carregamento
    carregarAvaliacoes();




    // Atualização em tempo real
    supabase
    .channel("mudancas-avaliacoes")
    .on(
        "postgres_changes",
        {
            event:"INSERT",
            schema:"public",
            table:"avaliacoes"
        },
        () => {

            carregarAvaliacoes();

        }
    )
    .subscribe();



});