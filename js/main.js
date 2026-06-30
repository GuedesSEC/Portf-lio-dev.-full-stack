document.addEventListener("DOMContentLoaded", () => {

    const items = document.querySelectorAll(".card");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");

    let index = 0;
    const total = items.length;

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

    nextBtn?.addEventListener("click", () => {
        index = (index + 1) % total;
        render();
    });

    prevBtn?.addEventListener("click", () => {
        index = (index - 1 + total) % total;
        render();
    });

    render();
});