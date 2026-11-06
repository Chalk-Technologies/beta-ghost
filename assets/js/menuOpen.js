// Toggle the menu open and close when on mobile
export default function menuOpen() {
    const burgerButton = document.querySelector('.gh-burger');
    burgerButton.addEventListener('click', function () {
        document.body.classList.toggle('gh-head-open');
        const isSmallWindow = window.innerWidth <= 900
        // mae sure to reset styles on small window
        if (isSmallWindow) {
            document.getElementById("gh-head").style = "";
        }
    });
}
