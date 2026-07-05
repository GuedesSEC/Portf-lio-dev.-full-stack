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