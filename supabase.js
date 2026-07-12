const SUPABASE_URL = "https://cgkdzchttbnlsmnoitcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_mSk3yM7TrroFoCx6AC_oVg_6awgO7Jh";


const banco = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


let usuario = null;





// ============================
// CRIAR / PEGAR USUÁRIO ANÔNIMO
// ============================

async function criarUsuarioAnonimo(){


    const { data: sessao } =
        await banco.auth.getSession();



    if(sessao.data.session){


        usuario =
            sessao.data.session.user;


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
            "Erro ao criar usuário:",
            error.message
        );


        return;

    }



    usuario =
        data.user;



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
            "Erro ao buscar:",
            error.message
        );


        return;

    }



    let total =
        data.length;



    let soma = 0;



    data.forEach(item=>{


        soma += Number(item.estrelas);


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
// VERIFICAR SE JÁ VOTOU
// ============================

async function jaVotou(){


    if(!usuario)
        return false;



    const { data, error } =
        await banco
        .from("avaliacoes")
        .select("id")
        .eq(
            "user_id",
            usuario.id
        );



    if(error){


        console.error(
            "Erro verificando voto:",
            error.message
        );


        return false;

    }



    return data.length > 0;


}









// ============================
// MOSTRAR MENSAGEM
// ============================

function mostrarMensagem(texto){


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
        texto;



    mensagem.style.marginTop =
        "15px";



    mensagem.style.color =
        "#00ff88";



    mensagem.style.fontWeight =
        "bold";



    document
    .querySelector(".rating")
    .appendChild(mensagem);




    setTimeout(()=>{


        mensagem.remove();


    },3000);


}









// ============================
// INICIALIZAÇÃO
// ============================

document.addEventListener(
"DOMContentLoaded",
async()=>{


    const estrelas =
        document.querySelectorAll(".stars i");



    console.log(
        "Estrelas:",
        estrelas.length
    );



    await criarUsuarioAnonimo();


    await carregarAvaliacoes();






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






            // VERIFICA DUPLICADO

            if(await jaVotou()){


                mostrarMensagem(
                    "Você já avaliou este portfólio 🚀"
                );


                return;

            }







            // SALVAR

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






            // MOSTRA NA HORA

            mostrarMensagem(
                "Obrigado pelo feedback! 🚀"
            );







            // BLOQUEIA ESTRELAS

            estrelas.forEach(item=>{

                item.style.pointerEvents =
                    "none";


                item.style.opacity =
                    "0.5";

            });







            // ATUALIZA CONTADOR

            await carregarAvaliacoes();




        });


    });


});