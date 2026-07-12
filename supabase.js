const SUPABASE_URL = "https://cgkdzchttbnlsmnoitcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_mSk3yM7TrroFoCx6AC_oVg_6awgO7Jh";


const banco = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


let usuario = null;



// ============================
// CRIAR / PEGAR USUÁRIO
// ============================

async function criarUsuarioAnonimo() {


    const { data: sessao } =
        await banco.auth.getSession();



    if (sessao.session) {


        usuario = sessao.session.user;


        console.log(
            "Usuário existente:",
            usuario.id
        );


        return;

    }




    const { data, error } =
        await banco.auth.signInAnonymously();



    if(error){


        console.error(
            "Erro usuário:",
            error.message
        );


        return;

    }



    usuario = data.user;



    console.log(
        "Novo usuário:",
        usuario.id
    );


}







// ============================
// BUSCAR AVALIAÇÕES
// ============================

async function carregarAvaliacoes(){


    const { data, error } =
        await banco
        .from("avaliacoes")
        .select("estrelas");



    if(error){


        console.error(
            "Erro ao buscar avaliações:",
            error.message
        );


        return;

    }



    console.log(
        "Dados recebidos:",
        data
    );



    let total =
        data.length;



    let soma = 0;



    data.forEach(item=>{


        soma += item.estrelas;


    });




    let media =
        total > 0
        ? (soma / total).toFixed(1)
        : "0.0";





    const campoMedia =
        document.getElementById("average");



    const campoVotos =
        document.getElementById("votes");





    if(campoMedia){

        campoMedia.textContent =
            media;

    }



    if(campoVotos){

        campoVotos.textContent =
            total;

    }



}









// ============================
// INICIALIZAÇÃO
// ============================

document.addEventListener(
"DOMContentLoaded",
async()=>{


    const estrelas =
        document.querySelectorAll(".stars i");



    const rating =
        document.querySelector(".rating");



    console.log(
        "Estrelas encontradas:",
        estrelas.length
    );



    await criarUsuarioAnonimo();



    await carregarAvaliacoes();







    // ============================
    // CLIQUE NAS ESTRELAS
    // ============================


    estrelas.forEach(estrela=>{


        estrela.addEventListener(
        "click",
        async()=>{


            const nota =
                Number(
                    estrela.dataset.rating
                );



            console.log(
                "Nota escolhida:",
                nota
            );





            // MENSAGEM

            const antiga =
                document.getElementById(
                    "feedback-toast"
                );



            if(antiga){

                antiga.remove();

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




            setTimeout(()=>{


                mensagem.remove();


            },3000);









            // ============================
            // SALVAR NO SUPABASE
            // ============================


            const { error } =
                await banco
                .from("avaliacoes")
                .insert({

                    estrelas: nota,

                    user_id: usuario.id

                });







            if(error){


                console.error(
                    "Erro ao salvar:",
                    error.message
                );


                return;

            }





            console.log(
                "Avaliação salva!"
            );



            // ATUALIZA CONTADOR

            await carregarAvaliacoes();



        });


    });



});