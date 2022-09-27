const empty = document.querySelector('.empty');
const filter = document.querySelector("#filter");
const modal = document.querySelector(".modal-content");
const storedValue = localStorage.getItem("filter");

filter.value = storedValue;
let array = [];
let description = [];
let title = [];

filter.addEventListener("input", (event) => {
    console.log(event.target.value)
    localStorage.setItem("filter", event.target.value);
    loadImages(event.target.value);

})

new Sortable.create(list, {
    swap: true,
    animation: 150,
    dataIdAttr: 'id',
    store: {
        /**
         * Get the order of elements. Called once during initialization.
         * @param   {Sortable}  sortable
         * @returns {Array}
         */
        get: function (sortable) {
            var order = localStorage.getItem("order");
            return order ? order.split(',') : [];

        },

        /**
         * Save the order of elements. Called onEnd (when the item is dropped).
         * @param {Sortable}  sortable
         */
        set: function (sortable) {
            var order = sortable.toArray();
            localStorage.setItem("order", order.join(','));
        }
    },
});

const loadImages = (filterString) => {
    array = []
    description = [];
    title = [];
    empty.innerHTML = "";
    modal.innerHTML = `<!-- Next/previous controls -->

                <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
                <a class="next" onclick="plusSlides(1)">&#10095;</a>

                <!-- Caption text -->

                <div class="caption-container">
                    <p id="caption"></p>
                </div>
`
    let idNumber = 1;

    fetch('./images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("photos.json not found");
            }
            return response.json();
        })
        .then(json => {

            const order = localStorage.getItem('order')?.split(",") || []

            let dataOrdered = json.photos;

            if (order.length !== null) {
                dataOrdered = [];
                for (const itemId of order) {
                    if (json.photos.find(({id}) => id === itemId))
                        dataOrdered.push(json.photos.find(({ id }) => id === itemId));
                }

                if (order.length < json.photos.length) {
                   const leftImgs = json.photos.filter(({ id }) => !order.includes(id));
                   leftImgs.forEach((i) => dataOrdered.push(i));
               }

           }

            dataOrdered.forEach((image) => {
                if (image.title.indexOf(filterString) !== -1){
                    const gallery = document.createElement("div");
                    const mySlides = document.createElement("div");
                    gallery.id = image.id;
                    gallery.draggable = true
                    mySlides.className = "mySlides";

                    const img = document.createElement("img");
                    img.id = image.id;
                    img.src = image.filename;
                    title.push(image.title);
                    description.push(image.description);

                    const imgModal = document.createElement("img");
                    imgModal.src = image.filename;
                    img.draggable = true;
                    gallery.setAttribute("onclick", "openModal();currentSlide(" + idNumber + ")")

                    empty.appendChild(gallery);
                    gallery.appendChild(img);
                    modal.appendChild(mySlides);
                    mySlides.appendChild(imgModal);
                    idNumber++;
                }

            })
        })
}

loadImages(storedValue === null ? "" : storedValue);

function openModal() {
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    const captionText = document.getElementById("caption");

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    if (n > slides.length) {
        slideIndex = 1
        console.log("obrazok "+ slideIndex)
        slides[slideIndex-1].style.display = "block";
        captionText.innerHTML = `${title[slideIndex-1]}
                             <br>${description[slideIndex-1]}`;
    }

    else if (n < 1) {
        slideIndex = slides.length
        console.log("obrazok "+ slideIndex)
        slides[slideIndex-1].style.display = "block";
        captionText.innerHTML = `${title[slideIndex-1]}
                             <br>${description[slideIndex-1]}`;
    }

    else {
        console.log("obrazok "+ slideIndex)
        slides[slideIndex-1].style.display = "block";
        captionText.innerHTML = `${title[slideIndex-1]}
                             <br>${description[slideIndex-1]}`;
    }

}

//Auto slide-show
function playShow(){

    slideIndex--;

    console.log("started")
    const pause = document.querySelector(".glyphicon-pause");
    const close = document.querySelector(".close");
    const captionText = document.getElementById("caption");
    captionText.innerHTML = "";

    showSlides();

    function showSlides(){
        const slides = document.getElementsByClassName("mySlides");

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        slideIndex++;

        if (slideIndex > slides.length){
            slideIndex = 1;
        }

        slides[slideIndex-1].style.display = "block";
        captionText.innerHTML = `${title[slideIndex-1]}
                             <br>${description[slideIndex-1]}`;

        const slideShow = setTimeout(showSlides, 2000);
        pause.addEventListener("click", () => {
            clearInterval(slideShow);
            console.log("stopped")
        });
        close.addEventListener("click", () => {
            clearInterval(slideShow);
        })
    }
}



