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



    estrelas.forEach((estrela) => {


        estrela.addEventListener("click", async () => {


            const nota = Number(
                estrela.dataset.rating
            );


            console.log(
                "Nota clicada:",
                nota
            );



            // mensagem visual
            const mensagemAntiga =
                document.getElementById(
                    "feedback-toast"
                );


            if(mensagemAntiga){
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

            },3000);





            // SALVAR NO SUPABASE

            if(banco){


                const { error } =
                    await banco
                    .from("avaliacoes")
                    .insert({
                        estrelas: nota
                    });



                if(error){

                    console.error(
                        "Erro ao salvar:",
                        error.message
                    );

                }else{

                    console.log(
                        "Avaliação salva!"
                    );

                }


            }



        });


    });


});