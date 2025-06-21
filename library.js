class Library {
    constructor() {
        this.books = [];
    }

    //zakladni init promennych
    static books = [];
    static bookInstances = {};

    /**
     * Funkce pro přidání nové knihy do knihovny
     * @param {Book} book - kniha kterou chceme přidat
     */
    static addBook(book) {
        Library.books.push(book); //přidá knihu1

        // Uloží instanci knihy do globálního objektu pro snadný přístup
        const safeKey = book.title.trim();
        window.bookInstances = window.bookInstances || {};
        window.bookInstances[safeKey] = book;

        //přerenderuje karty knih
        Library.renderBookCards();
    }

    static removeBook(title) {
        Library.books = Library.books.filter(book => book.title !== title);
        delete window.bookInstances?.[title];

        Library.renderBookCards();
    }

    /**
     *
     * @param {Array} filteredBooks - vyfiltrovvane knihy ktere chceme zobrazit
     */
    static displayBooks(filteredBooks = null) {
        const booksToDisplay = filteredBooks || Library.books;
        console.clear();
        console.log("Knihy v knihovně:");

        booksToDisplay.forEach(book => {
            console.log(`${book.title} (${book.year}) – ${book.author}, dostupnost: ${book.isAvailable ? "ano" : "ne"}`);
        });
    }

    static renderBookCards(filteredBooks = null) {
        const booksToRender = filteredBooks || Library.books;

        const container = document.getElementById("cardContainer");
        container.innerHTML = "";

        booksToRender.forEach(book => {
            const card = document.createElement("div");
            card.className = "card m-2";
            card.style.width = "18rem";

            card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
                <p class="card-text">Vydáno: ${book.year}<br>Dostupná: ${book.isAvailable ? "Ano" : "Ne"}</p>
                <a href="${book.pdfLink}" class="card-link" target="_blank">📄 Otevřít PDF</a><br>
                <button class="btn btn-danger mt-2 removeBookBtn" data-title="${book.title}">Smazat</button>
            </div>
        `;

            container.appendChild(card);
        });

        document.querySelectorAll(".removeBookBtn").forEach(btn => {
            btn.addEventListener("click", e => {
                const title = e.target.getAttribute("data-title");
                if (confirm(`Opravdu chceš smazat knihu "${title}"?`)) {
                    Library.removeBook(title);
                }
            });
        });
    }

    static initModal() {
        Library.modal();
        Library.dragBook();
    }
    static resetForm() {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("year").value = "";
        document.getElementById("isAvailable").checked = false;

        const pdfLink = document.getElementById("pdf-link");
        pdfLink.href = "";
        pdfLink.textContent = "";
        pdfLink.style.display = "none";
    }

    static enableSearch() {
        const searchInput = document.getElementById("searchInput");

        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();

            if (query === "") {
                Library.renderBookCards(); // zobrazit vše
                return;
            }

            const filtered = Library.books.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query)
            );

            Library.renderBookCards(filtered); // zobrazit jen filtrování
        });
    }

    static modal() {
        const modal = document.getElementById("bookFormMain");
        const openBtn = document.getElementById("openForm");
        const closeBtn = document.getElementById("closeForm");

        openBtn.addEventListener("click", () => {
            modal.style.display = "flex";
        });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    static bookAddition(pdfLinkElement) {
        const addBookBtn = document.getElementById("addBook");

        addBookBtn.addEventListener("click", () => {
            const title = document.getElementById("title").value.trim();
            const year = document.getElementById("year").value.trim();
            const author = document.getElementById("author").value.trim();
            const isAvailable = document.getElementById("isAvailable").checked;
            const pdfUrl = pdfLinkElement.href;

            if (title !== "" && author !== "" && year !== "" && !isNaN(new Date(year).getTime()) && pdfUrl !== "") {
                const book = new Book(title, author, year, pdfUrl, isAvailable);
                Library.addBook(book);
                Library.displayBooks();

                alert("Kniha byla úspěšně přidána.");
                document.getElementById("bookFormMain").style.display = "none";
                Library.resetForm();
            } else {
                alert("Vyplň všechna pole a přetáhni platný PDF soubor.");
            }
        });

        const resetBtn = document.getElementById("resetForm");
        resetBtn.addEventListener("click", () => {
            Library.resetForm();
        });
    }

    static dragBook() {
        const dropzone = document.getElementById('dropzone');
        const pdfLink = document.getElementById('pdf-link');

        document.addEventListener("dragover", e => e.preventDefault());
        document.addEventListener("drop", e => e.preventDefault());

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            dropzone.addEventListener(event, e => e.preventDefault());
        });

        ['dragenter', 'dragover'].forEach(() => {
            dropzone.classList.add('hover');
        });

        ['dragleave', 'drop'].forEach(() => {
            dropzone.classList.remove('hover');
        });

        dropzone.addEventListener('drop', e => {
            const file = e.dataTransfer.files[0];

            if (file && file.type === 'application/pdf') {
                const fileURL = URL.createObjectURL(file);

                pdfLink.href = fileURL;
                pdfLink.textContent = `📄 Otevřít knihu`;
                pdfLink.style.display = 'block';
            } else {
                pdfLink.href = "";
                pdfLink.textContent = "";
                pdfLink.style.display = 'none';
                alert('Prosím přetáhni pouze PDF soubor.');
            }
        });

        Library.bookAddition(pdfLink);
    }
}
