class Library {
    constructor() {
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    removeBook(title) {
        this.books = this.books.filter(book => book.title !== title);
    }

    static initModal() {
        Library.modal();
        Library.bookAddition();
        Library.dragBook();
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

    static bookAddition() {
        const addBookBtn = document.getElementById("addCard");
        const titleInput = document.getElementById("title");
        const yearInput = document.getElementById("year");
        const pdfLink = document.getElementById("pdf-link");

        addBookBtn.addEventListener("click", () => {
            const title = titleInput.value;
            const year = yearInput.value;
            const pdfUrl = pdfLink.href;

            if (title && pdfUrl && pdfUrl !== "#") {
                const book = new Book(title, "Autor není zadán", year, pdfUrl);
                library.addBook(book);
                Library.displayBooks();
                titleInput.value = "";
                pdfLink.href = "#";
                pdfLink.style.display = "none";
                pdfLink.textContent = "";
            } else {
                alert("Vyplň název a přetáhni PDF.");
            }
        });
    }
    static dragBook() {
        const dropzone = document.getElementById('dropzone');
        const pdfLink = document.getElementById('pdf-link');

        // Zabránění výchozímu chování na celé stránce
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
                pdfLink.style.display = 'none';
                alert('Prosím přetáhni pouze PDF soubor.');
            }
        });
    }

}