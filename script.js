const books = []; //membuat array yang digunakan untuk menyimpan data buku
const RENDER_EVENT = "render-book";
const SIMPAN_EVENT = 'saved-book';
const KUNCIKU = "Bookshelf";

// Event Listener yang menjalankan fungsi setelah DOM dimuat
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook"); //Sintaks untuk mendapatkan elemen form input buku
  submitForm.addEventListener("submit", function (event) { // Event Listener untuk submit form
    event.preventDefault();
    addBook();
  });

  // Perintah yang digunakan untuk memeriksa apakah browser mendukung penyimpanan lokal
  if (cekBrowser()) {
    muatData();
  }
});

  // Membuat Fungsi yang digunakan untuk menyimpan data buku ke penyimpanan lokal
function saveData() {
  if (cekBrowser()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(KUNCIKU, parsed);
    document.dispatchEvent(new Event(SIMPAN_EVENT));
  }
}

  // Membuat Fungsi yang digunakan untuk memeriksa penyimpanan lokal pada browser
function cekBrowser() {
  if (typeof Storage === 'undefined') {
    alert('Browser Anda tidak mendukung penyimpanan lokal');
    return false;
  }
  return true;
}

// Membuat fungsi yang digunakan untuk memuat data buku dari penyimpanan lokal
function muatData() {
  const serializedData = localStorage.getItem(KUNCIKU);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    books.length = 0;
    data.forEach((book) => {
      books.push(book);
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

// Event listener yang mencetak data dari penyimpanan lokal ketika disimpan
document.addEventListener(SIMPAN_EVENT, function () {
  console.log(localStorage.getItem(KUNCIKU));
});

// Membuat fungsi untuk menambahkan buku baru
function addBook() {
  // Perintah untuk mendapatkan data dari form yang dimasukkan
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = parseInt(document.getElementById("inputBookYear").value); // Mengubah tahun menjadi number
  const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

  // Perintah yang digunakan untuk membuat ID unik untuk buku
  const generatedID = generateID();
  const bookObject = generateBookObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
  // Perintah fungsi yang digunakan untuk menghasilkan ID unik berdasarkan waktu
function generateID() {
  return +new Date();
}

  // Membuat fungsi yang menghasilkan objek buku dengan properti 
function generateBookObject(id, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete) {
  return {
    id,
    title: inputBookTitle,
    author: inputBookAuthor,
    year: inputBookYear, 
    isComplete: inputBookIsComplete
  };
}

// Fungsi yang digunakan untuk membuat elemen buku dalam DOM
function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const textContainer = document.createElement("article");
  textContainer.classList.add("book_item");
  textContainer.append(textTitle, textAuthor, textYear);
  textContainer.setAttribute("id", bookObject.id);
}

// Fungsi yang digunakan untuk mengganti status selesai / belum selesai
function switchBook(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      if (books[index].isComplete === true) {
        books[index].isComplete = false;
      } else {
        books[index].isComplete = true;
      }
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Fungsi yang digunakan untuk menghapus buku
function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Fungsi yang digunakan untuk menemmukan indeks buku dalam array
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

// Event Listener yang digunakan untuk rendering daftar buku dalam DOM
document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  books.forEach((e) => {
    if (e.isComplete === false) {
      let element = `
        <article class="book_item">
        <h3>${e.title}</h3>
        <p>Penulis: ${e.author}</p>
        <p>Tahun: ${e.year}</p>
        <div>
          <button type="button" onclick="switchBook(${e.id})">Selesai Dibaca</button>
          <button type="button" onclick="deleteBook(${e.id})">Hapus Buku</button>
        </div>
        </article>
      `;

      incompleteBookshelfList.innerHTML += element;
    } else {
      let element = `
        <article class="book_item">
        <h3>${e.title}</h3>
        <p>Penulis: ${e.author}</p>
        <p>Tahun: ${e.year}</p>
        <div>
          <button type="button" onclick="switchBook(${e.id})">Belum Selesai Dibaca</button>
          <button type="button" onclick="deleteBook(${e.id})">Hapus Buku</button>
        </div>
        </article>
      `;

      completeBookshelfList.innerHTML += element;
    }
  });
});
