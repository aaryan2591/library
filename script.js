const library = [];

function Book(title,author,pages,status){
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

function addBookToLibrary(title,author,pages,status){  
   let inbook = new Book(title,author,pages,status);
   library.push(inbook);
}

let addBook = document.getElementById("addBook");
let formContainer = document.getElementById("formContainer");
let form = document.getElementById("myform");
let cancelbtn = document.getElementById("cancelbtn");
let editingId = null;

addBook.addEventListener('click',()=>{
    formContainer.showModal();
})

cancelbtn.addEventListener('click',()=>{
    formContainer.close();
    form.reset();
})

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    let intitle = document.getElementById("book").value;
    let inauthor = document.getElementById("author").value;
    let inpages = document.getElementById("pages").value;
    let instatus = document.getElementById("status").value;

    if(editingId){
        let bookUpdating = library.find(book=> book.id === editingId);
        bookUpdating.title = intitle;
        bookUpdating.author = inauthor;
        bookUpdating.pages = inpages;
        bookUpdating.status = instatus;
        editingId = null;
    }
    else{
    addBookToLibrary(intitle,inauthor,inpages,instatus);
    }
    display();
    formContainer.close();
    form.reset();
})

let librarydisplay = document.getElementById("librarydisplay");

function display(){
    librarydisplay.innerHTML = "";

    if(library.length === 0){
    librarydisplay.innerHTML = `
    <div class="empty-state">
        <p class="empty-icon">📚</p>
        <p class="empty-title">Your library is empty!</p>
        <p class="empty-subtitle">Add a book to get started</p>
    </div>
    `;
    return;
    }

    library.forEach((book) => {
        let card = document.createElement("div");
        card.classList.add("book-card");
        card.setAttribute("data-id",book.id);

        card.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Pages: ${book.pages}</p>
        <div>
        <button class="statusbtn ${book.status === "Read" ? 'read' : 'unread'}">${book.status}</button>
        <button class="editbtn">Edit</button>
        </div>
        <button class="removebtn">Remove</button>
        `;

        librarydisplay.appendChild(card);
    });
}

librarydisplay.addEventListener('click', (e) => {
    if (e.target.classList.contains('removebtn')) {
        let confirmDialog = document.createElement('dialog');
        confirmDialog.classList.add("confirm");

        confirmDialog.innerHTML = `
        <p class="remove-ask">Do you wish to remove this book?</p>
        `;
        
        let removeconfirm = document.createElement("button");
        removeconfirm.classList.add("removeconfirm");
        removeconfirm.innerText = "Yes, remove!";
        confirmDialog.appendChild(removeconfirm);

        let removecancel = document.createElement("button");
        removecancel.classList.add("removecancel");
        removecancel.innerText = "Cancel";
        confirmDialog.appendChild(removecancel);

        document.body.appendChild(confirmDialog);
        confirmDialog.showModal();

        removeconfirm.addEventListener('click',()=>{
        let card = e.target.closest('.book-card');
        let idToRemove = card.dataset.id;
        
        let index = library.findIndex(book => book.id === idToRemove);
        if (index !== -1) library.splice(index, 1);

        confirmDialog.close();
        confirmDialog.remove();
        display();
        })

        removecancel.addEventListener('click',()=>{
            confirmDialog.close();
            confirmDialog.remove();
        })  
  }
    if(e.target.classList.contains('statusbtn')){
        let card = e.target.closest('.book-card');
        let id = card.dataset.id;

        let bookToUpdate = library.find(book => book.id === id);
        bookToUpdate.status = bookToUpdate.status === "Read" ? "Unread" : "Read";

        display();
    }

    if(e.target.classList.contains('editbtn')){
        let card = e.target.closest('.book-card');
        let idToEdit = card.dataset.id;

        let bookToEdit = library.find(book=> book.id === idToEdit);
        document.getElementById("book").value = bookToEdit.title;
        document.getElementById("author").value = bookToEdit.author;
        document.getElementById("pages").value = bookToEdit.pages;
        document.getElementById("status").value = bookToEdit.status;

        editingId = idToEdit;
        formContainer.showModal();
    }
})

display();