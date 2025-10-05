let scrollBtn = document.querySelector(".scrollBtn");

scrollBtn.addEventListener('click',()=>{
    window.scrollTo({
        top : 0 ,
        behavior : "smooth"
    })
})
function scrollUp(){
    window.scrollY > 100 ? scrollBtn.classList.add('active') : scrollBtn.classList.remove('active'); 
}
window.addEventListener("scroll", ()=>{
    scrollUp()
})
scrollUp()

const installBtn = document.getElementById("install");
let btnPrompt; 

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installBtn.style.display = "block";
    btnPrompt = event;
});

installBtn.addEventListener("click", () => {
    if (btnPrompt) {
        btnPrompt.prompt();
        btnPrompt.userChoice.then((choice) => {
            if (choice.outcome === "accepted") {
                console.log("User accepted");
                installBtn.style.display = "none";
            } else {
                console.log("User refused");
            }
            btnPrompt = null; 
        });
    }
});

if(navigator.serviceWorker){
    navigator.serviceWorker.register("../sw.js")
    .then((reg) => {
        console.log(reg)
    })
    .catch((err) => console.log(err))
}