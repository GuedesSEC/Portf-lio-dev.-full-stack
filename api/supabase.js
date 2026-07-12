const SUPABASE_URL = "https://cgkdzchttbnlsmnoitcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_mSk3yM7TrroFoCx6AC_oVg_6awgO7Jh";


const banco = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


let usuario = null;






// ============================
// LOGIN GOOGLE
// ============================

async function loginGoogle(){


    const { error } =
        await banco.auth.signInWithOAuth({

            provider: "google",

            options: {

                redirectTo:
                "https://guedessec.github.io/Portf-lio-dev.-full-stack/"

            }

        });



    if(error){

        console.error(
            "Erro login Google:",
            error.message
        );

    }

}








// ============================
// RECUPERAR USUÁRIO LOGADO
// ============================

async function recuperarUsuario(){


    const { data, error } =
        await banco.auth.getSession();



    if(error){

        console.error(
            "Erro sessão:",
            error.message
        );

        return;

    }




    if(data.session){


        usuario =
            data.session.user;



        console.log(
            "Usuário logado:",
            usuario.id
        );



        const botao =
            document.getElementById(
                "login-google"
            );



        if(botao){

            botao.style.display =
                "none";

        }



    }



}









// ============================
// CARREGAR AVALIAÇÕES
// ============================

async function carregarAvaliacoes(){



    const { data, error } =
        await banco
        .from("avaliacoes")
        .select("estrelas");




    if(error){


        console.error(
            "Erro carregando avaliações:",
            error.message
        );


        return;

    }






    let total =
        data.length;



    let soma = 0;




    data.forEach(item=>{


        soma += Number(
            item.estrelas
        );


    });






    let media =
        total > 0
        ? (soma / total).toFixed(1)
        : "0.0";







    const mediaHTML =
        document.getElementById(
            "average"
        );


    const votosHTML =
        document.getElementById(
            "votes"
        );




    if(mediaHTML){

        mediaHTML.textContent =
            media;

    }




    if(votosHTML){

        votosHTML.textContent =
            total;

    }





    console.log(
        "Avaliações:",
        data
    );


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

function mostrarMensagem(texto, erro=false){



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



    mensagem.style.fontWeight =
        "bold";



    mensagem.style.color =
        erro
        ? "#ff4444"
        : "#00ff88";







    const rating =
        document.querySelector(
            ".rating"
        );



    if(rating){

        rating.appendChild(
            mensagem
        );

    }







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
        document.querySelectorAll(
            ".stars i"
        );



    const botaoGoogle =
        document.getElementById(
            "login-google"
        );







    if(botaoGoogle){


        botaoGoogle.addEventListener(
            "click",
            loginGoogle
        );


    }







    await recuperarUsuario();



    await carregarAvaliacoes();









    estrelas.forEach(estrela=>{



        estrela.addEventListener(
        "click",
        async()=>{






            // precisa estar logado

            if(!usuario){



                mostrarMensagem(
                    "Entre com Google para avaliar 🚀",
                    true
                );


                return;


            }







            const nota =
                Number(
                    estrela.dataset.rating
                );








            // impede voto duplicado

            if(await jaVotou()){



                mostrarMensagem(
                    "Você já avaliou este portfólio 🚀"
                );



                return;


            }









            // salva no banco

            const { error } =
                await banco
                .from("avaliacoes")
                .insert({

                    estrelas: nota,

                    user_id:
                    usuario.id

                });









            if(error){



                console.error(
                    "Erro salvar:",
                    error.message
                );



                mostrarMensagem(
                    "Erro ao enviar avaliação",
                    true
                );



                return;


            }







            // resposta imediata

            mostrarMensagem(
                "Obrigado pelo feedback! 🚀"
            );








            // atualiza números

            await carregarAvaliacoes();








            // bloqueia estrelas

            estrelas.forEach(item=>{


                item.style.pointerEvents =
                    "none";



                item.style.opacity =
                    "0.5";



            });







        });



    });




});