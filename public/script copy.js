// script.js - sample data + render + interactions
const books = [
  {id:1, title:"The Great Gatsby", author:"F. Scott Fitzgerald", category:"Fiction", image:"images/greatgatsby.jpeg", desc:"A classic about the American dream."},
  {id:2, title:"To Kill a Mockingbird", author:"Harper Lee", category:"Fiction", image:"images/mockingbird.jpeg", desc:"A novel on justice and compassion."},
  {id:3, title:"1984", author:"George Orwell", category:"Dystopia", image:"images/1984.jpeg", desc:"Surveillance and control."},
  {id:4, title:"Pride and Prejudice", author:"Jane Austen", category:"Romance", image:"images/pride.jpeg", desc:"Love and social class."},
  {id:5, title:"The Hobbit", author:"J.R.R. Tolkien", category:"Fantasy", image:"images/The Hobbit.jpeg", desc:"Adventure to the Lonely Mountain."},
  {id:6, title:"Moby-Dick", author:"Herman Melville", category:"Classic", image:"images/moby dick.jpeg", desc:"Obsessions and the sea."},
  {id:7, title:"War and Peace", author:"Leo Tolstoy", category:"History", image:"images/warandpeace.jpeg", desc:"Epic novel of war and life."},
  {id:8, title:"The Odyssey", author:"Homer", category:"Epic", image:"images/download (1).jpeg", desc:"The journey of Odysseus."},
  {id:9, title:"The Catcher in the Rye", author:"J.D. Salinger", category:"Fiction", image:"images/The Catcher in the Rye.jpeg", desc:"Teenage alienation and honesty."},
  {id:10, title:"The Lord of the Rings", author:"J.R.R. Tolkien", category:"Fantasy", image:"images/download (2).jpeg", desc:"Epic fantasy journey."}
];

const recommendRow = document.getElementById('recommendRow');
const bookList = document.getElementById('bookList');
const categoryGrid = document.getElementById('categoryGrid');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const modalDesc = document.getElementById('modalDesc');

function renderRecommend(){
  recommendRow.innerHTML = books.slice(0,4).map(b => `
    <div class="rec-card" data-id="${b.id}">
      <img src="${b.image}" alt="${b.title}">
      <div class="rec-title">${b.title}</div>
    </div>
  `).join('');
  document.querySelectorAll('.rec-card').forEach(el => el.addEventListener('click', ()=> openModal(+el.dataset.id) ));
}

function renderBooks(list){
  bookList.innerHTML = list.map(b=>`
    <div class="book-card" data-id="${b.id}">
      <img src="${b.image}" alt="${b.title}">
      <h4>${b.title}</h4>
      <p class="author">${b.author}</p>
    </div>
  `).join('');
  document.querySelectorAll('.book-card').forEach(el=> el.addEventListener('click', ()=> openModal(+el.dataset.id)));
}

function renderCategories(){
  const cats = [...new Set(books.map(b=>b.category))];
  categoryGrid.innerHTML = cats.map(c=>`<div class="cat-tile" data-cat="${c}">${c}</div>`).join('');
  categoryFilter.innerHTML = `<option value="">All categories</option>` + cats.map(c=>`<option value="${c}">${c}</option>`).join('');
  document.querySelectorAll('.cat-tile').forEach(el=> el.addEventListener('click', ()=> renderBooks(books.filter(b=>b.category===el.dataset.cat)) ));
}

function openModal(id){
  const b = books.find(x=>x.id===id);
  if(!b) return;
  modalImage.src = b.image; modalTitle.innerText = b.title; modalAuthor.innerText = 'by ' + b.author; modalDesc.innerText = b.desc;
  modal.classList.remove('hidden');
}

document.addEventListener('click', (e)=>{
  if(e.target.id==='modalClose' || e.target===modal) modal.classList.add('hidden');
});
searchBtn.addEventListener('click', ()=> {
  const q = searchInput.value.trim().toLowerCase();
  const cat = categoryFilter.value;
  let filtered = books.filter(b=> b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  if(cat) filtered = filtered.filter(b=> b.category===cat);
  renderBooks(filtered);
});
searchInput.addEventListener('keyup', (e)=> e.key==='Enter' && searchBtn.click());

// initial
renderRecommend();
renderBooks(books);
renderCategories();
