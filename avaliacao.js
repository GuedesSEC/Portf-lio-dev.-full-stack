const SUPABASE_URL = "https://cgkdzchttbnlsmnoitcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_mSk3yM7TrroFoCx6AC_oVg_6awgO7Jh";


let banco = null;


if (window.supabase) {

    banco = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    console.log("Supabase conectado");

} else {

    console.error("Biblioteca Supabase não carregou");

}




document.addEventListener("DOMContentLoaded", () => {


    const estrelas = document.querySelectorAll(".stars i");
    const rating = document.querySelector(".rating");


    console.log("Estrelas:", estrelas.length);




    // ============================
    // CARREGAR MÉDIA E AVALIAÇÕES
    // ============================

    async function carregarAvaliacoes() {


        if (!banco) return;



        const { data, error } = await banco
            .from("avaliacoes")
            .select("estrelas");



        if (error) {

            console.error(
                "Erro ao buscar avaliações:",
                error.message
            );

            return;

        }



        console.log(
            "Avaliações recebidas:",
            data
        );



        const total = data.length;


        let soma = 0;



        data.forEach((item) => {

            soma += item.estrelas;

        });



        const media = total > 0
            ? (soma / total).toFixed(1)
            : "0.0";



        const campoMedia =
            document.getElementById("average");


        const campoVotos =
            document.getElementById("votes");



        if (campoMedia) {

            campoMedia.textContent = media;

        }



        if (campoVotos) {

            campoVotos.textContent = total;

        }



    }







    // Carrega ao abrir o site
    carregarAvaliacoes();







    // ============================
    // CLIQUE NAS ESTRELAS
    // ============================

    estrelas.forEach((estrela) => {


        estrela.addEventListener("click", async () => {


            const nota = Number(
                estrela.dataset.rating
            );



            console.log(
                "Nota clicada:",
                nota
            );




            // mensagem

            const mensagemAntiga =
                document.getElementById(
                    "feedback-toast"
                );


            if (mensagemAntiga) {

                mensagemAntiga.remove();

            }




            const mensagem =
                document.createElement("p");



            mensagem.id =
                "feedback-toast";



            mensagem.textContent =
                "Obrigado pelo feedback! 🚀";



            mensagem.style.marginTop =
                "15px";


            mensagem.style.color =
                "#00ff88";


            mensagem.style.fontWeight =
                "bold";



            rating.appendChild(
                mensagem
            );




            setTimeout(() => {

                mensagem.remove();

            }, 3000);






            // SALVAR NO SUPABASE

            if (banco) {



                const { error } =
                    await banco
                        .from("avaliacoes")
                        .insert({
                            estrelas: nota,
                            user_id: usuario.id
                        })





                if (error) {


                    console.error(
                        "Erro ao salvar:",
                        error.message
                    );



                } else {


                    console.log(
                        "Avaliação salva!"
                    );


                    // atualiza números
                    carregarAvaliacoes();


                }


            }



        });


    });



});