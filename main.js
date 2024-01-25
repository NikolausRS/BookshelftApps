const books = [];
const RENDER_EVENT = 'renderEvent'
const SAVED_EVENT = 'savedBook';
const STORAGE_KEY = 'BOOK_APPS';


document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(e){
        e.preventDefault();
        addBooks();
    })

    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        searchBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

function addBooks(){
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = parseInt(document.getElementById('inputBookYear').value, 10);
    const complateBook = document.getElementById('inputBookIsComplete');

    let status;
    if(complateBook.checked){
        status = true;
    }else{
        status = false;
    }

    const generatedID = generateId();

    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, status);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData()
}

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, status){
    return{
        id,
        title,
        author,
        year,
        status
    }
}

function makeTodo (bookObject){
    const textTitle = document.createElement("p");
    textTitle.classList.add("itemTitle");
    textTitle.innerHTML = `${bookObject.title} - ${bookObject.year}`;

    const textAuthor = document.createElement("p");
    textAuthor.classList.add("itemAuthor");
    textAuthor.innerText = bookObject.author;

    const textContainer = document.createElement("div");
    textContainer.classList.add("itemText");
    textContainer.append(textTitle, textAuthor);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
    

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if(bookObject.status){
        const undoButton = document.createElement("button");
        undoButton.classList.add("green");
        undoButton.innerText = 'Belum selesai di Baca';

        undoButton.addEventListener("click", function(){
        undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("red");
        trashButton.innerText = 'Hapus buku';

        trashButton.addEventListener("click", function (){
        removeBookFromCompleted(bookObject.id);
        });

        actionContainer.append(undoButton, trashButton);
        container.append(actionContainer);
    }else{ 
        const checkButton = document.createElement("button");
        checkButton.classList.add("green");
        checkButton.innerText = 'Selesai dibaca';

        checkButton.addEventListener("click", function(){
        addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("red");
        trashButton.innerText = 'Hapus buku';

        trashButton.addEventListener("click", function(){
        removeBookFromCompleted(bookObject.id);
        });

        actionContainer.append(checkButton, trashButton);
        container.append(actionContainer);
    };
    return container;
};


document.addEventListener(RENDER_EVENT, function(){
    console.log(books);
     
    const incomplatebookShelfList = document.getElementById('incompleteBookshelfList');
    incomplatebookShelfList.innerHTML = '';
     
    const complatebookShelfList = document.getElementById('completeBookshelfList');
    complatebookShelfList.innerHTML = '';

    for( const booklist of books ){
            const booklistElement = makeTodo(booklist);
            if(booklist.status){
                complatebookShelfList.append(booklistElement)
            }else{
                incomplatebookShelfList.append(booklistElement)
            }
    } 
})


function addBookToCompleted(bookId){
    const targetBook = findBook(bookId);

    if (targetBook == null) return;

    targetBook.status = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findBook(bookId){
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
        return bookItem;
        }
    }

    return null;
};

function undoBookFromCompleted(bookId){
    const targetBook = findBook(bookId);

    if (targetBook == null) return;

    targetBook.status = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function removeBookFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);

    if(bookTarget === -1) return;
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findBookIndex(bookId){
    for(const index in books){
        if(books[index].id === bookId){
        return index;
        }
    }
    return -1;
}

function searchBook() {
    const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
    const moveBook = document.querySelectorAll(".book_item");

    for (const bookItem of moveBook) {
        const titleElement = bookItem.querySelector(".itemTitle");

        if (titleElement.innerText.toLowerCase().includes(searchInput)) {
            bookItem.style.display = "block";
        } else {
            bookItem.style.display = "none";
        }
    }
}

function isStorageExist(){
    if (typeof (Storage) === undefined) {
        alert("maaf browser kamu tidak cocok di web storage ini");
        return false;
    }
    return true;
};

function saveData(){
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage(){
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if (data !== null) {
        for (const book of data) {
        books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};