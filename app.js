const notes = document.querySelector(".notes");
let userProgress;
if (localStorage.getItem('notes-progress')) {
    userProgress = JSON.parse(localStorage.getItem('notes-progress'))
    document.querySelector(".example").remove();
    JSON.parse(localStorage.getItem('notes-progress')).forEach(i => {
        let note = document.createElement('div');
        note.className = 'note';
        note.innerHTML = i.split('#$#')[0];
        note.style.borderColor = i.split('#$#')[1];
        notes.append(note);
    })
} else {
    userProgress = [];
}

const app = document.querySelector(".app")
const notesSlide = document.querySelector('.notes-slide')
const modalWindow = document.querySelector('.modal-window')
const modalTitle = document.querySelector(".modal-title")
const addNoteBtn = document.querySelector(".add-note-btn")
const noteTitle = document.querySelector(".note-title");
const nameNote = document.querySelector(".name-note input");
const descNote = document.querySelector(".desc-note textarea");
const createNoteBtn = document.querySelector(".create-note-btn");
const colorNoteBtn = Array.from(document.querySelectorAll(".color-note-btn"));
let toolsNoteBtn = Array.from(document.querySelectorAll(".tools-note-btn"));
let toolsNote = Array.from(document.querySelectorAll(".tools-note"))
let colorNote = 'white';

colorNoteBtn.forEach(el => {
    el.style.background = el.getAttribute('data-color')
    el.addEventListener('click', event => {
        colorNote = event.target.getAttribute('data-color')
        event.target.style.borderColor = '#111';
        colorNoteBtn.forEach(i => i.style.borderColor = 'transparent');
        event.target.style.borderColor = '#111';
    })
    el.addEventListener("mouseover", event => {
        event.target.style.borderColor = '#111';
    })
    el.addEventListener("mouseout", event => {
        if (event.target.getAttribute('data-color')!=colorNote)  event.target.style.borderColor = 'transparent';;
    })
})


function closeNoteTitle() {
    noteTitle.classList.remove('hide-note-title')
    setTimeout(() => modalWindow.classList.remove('hide-modal'), 100);
    toolsNote.forEach(el => el.classList.remove('hide'))
}


function showNewNote() {
    setTimeout(() => {
        modalWindow.classList.add('hide-modal');
    }, 0)
    noteTitle.classList.add('hide-note-title');
    setTimeout(() => nameNote.focus(), 700)
    modalWindow.addEventListener('click', event => {
        if (event.target.classList.contains('modal-window')) {
            closeNoteTitle();
        }

    })
}

addNoteBtn.addEventListener("click", showNewNote);
addNoteBtn.addEventListener("click", () => {
    createNoteBtn.innerText = 'Add a new note';
    modalTitle.innerText = 'Add a new note'
    nameNote.value = '';
    descNote.value = '';
})

function createNote(event) {
    if (!nameNote.value || !descNote.value || event.target.innerText === 'Edit note') return;

    const note = document.createElement("div");
    note.className = 'note';
    note.style.borderColor = colorNote;

    const readyNameNote = document.createElement('p')
    readyNameNote.innerHTML = nameNote.value;
    readyNameNote.className = 'ready-name-note';

    const readyDescNote = document.createElement('p');
    readyDescNote.innerHTML = descNote.value;
    readyDescNote.className = 'ready-desc-note';
    
    const readyDateNote = document.createElement('p');
    readyDateNote.style.borderColor = colorNote;
    readyDateNote.innerHTML = getDate();
    readyDateNote.className = 'ready-date-note';

    note.append(readyNameNote)
    note.append(readyDescNote)
    note.append(readyDateNote);
    note.insertAdjacentHTML('beforeend', '<button class="tools-note-btn" type="button"><i class="fa fa-bars" aria-hidden="true"></i></button>');
    note.querySelector('.tools-note-btn').style.color = colorNote;
    note.insertAdjacentHTML('beforeend', '<div class="tools-note"><button class="edit-note-btn" type="button"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</button> <br><button class="delete-note-btn" type="button"><i class="fa fa-trash-o" aria-hidden="true"></i>Delete</button></div>')
    notes.append(note);

    toolsNoteBtn = Array.from(document.querySelectorAll(".tools-note-btn"));
    toolsNote = Array.from(document.querySelectorAll(".tools-note"))

    clearColorNote();
    closeNoteTitle();
    scrollNote();
 }
createNoteBtn.addEventListener("click", createNote);

function clearColorNote() {
    colorNoteBtn.forEach(i => i.style.borderColor = 'transparent')
    colorNote = 'white'
}

function scrollNote() {
    const countNotes = document.querySelectorAll('.note').length
    if (countNotes > 13 || cont.clientWidth<900) notesSlide.style.overflowY = 'scroll';
    else notesSlide.style.overflowY = 'hidden';
}

function getDate() {
    const date = new Date().toDateString();
    return `${date.slice(4, 7)} ${date.slice(8, 10)}, ${date.slice(-4)}`
}


function showToolsNote(event) {
    if (!event.target.classList.contains('fa-bars')) return 
    toolsNote[toolsNoteBtn.indexOf(event.target.closest('button'))].classList.add('hide');
}

function closeToolsNote(event) {
    if (event.target.classList.contains('fa-bars')) {
        let index = toolsNoteBtn.indexOf(event.target.closest('button'));
        toolsNote.forEach(item => {
            if (toolsNote.indexOf(item)!=index) item.classList.remove("hide")
        })
    }
    else {
        if (event.target.closest('div').classList.contains('tools-note') || modalWindow.classList.contains('hide-modal')) return;
        toolsNote.forEach(el => el.classList.remove('hide'));
    }
}

notesSlide.addEventListener("click", showToolsNote);
notesSlide.addEventListener("click", closeToolsNote);

function editNote(event) {
    if (!event.target.classList.contains('edit-note-btn')) return
    createNoteBtn.innerText = 'Edit note';
    modalTitle.innerText = 'Edit Note';
    showNewNote();
    let element = event.target.closest('.note');
    nameNote.value = element.querySelector('.ready-name-note').innerHTML;
    descNote.value = element.querySelector('.ready-desc-note').innerHTML;
    colorNote = element.style.borderColor;
    colorNoteBtn.forEach(item => {
        if (item.getAttribute('data-color') === element.style.borderColor) {
            item.style.borderColor = '#111';
        }
    })
}

createNoteBtn.addEventListener("click", event => {
    if (!nameNote.value || !descNote.value || event.target.innerText != 'Edit note') return;

    let element;
    toolsNote.forEach(el => {
        if (el.classList.contains('hide')) element = el.closest('.note')
    });
    element.querySelector(".ready-name-note").innerText = nameNote.value;
    element.querySelector(".ready-desc-note").innerText = descNote.value;
    element.style.borderColor = colorNote;
    element.querySelector(".ready-date-note").style.borderColor = colorNote;
    element.querySelector(".tools-note-btn").style.color = colorNote;
    clearColorNote();
    closeNoteTitle();
    element.querySelector('.tools-note').classList.remove('hide')

})

notes.addEventListener("click", editNote)

function deleteNote(event) {
    if (!event.target.classList.contains('delete-note-btn')) return
    event.target.closest('.note').remove();
}

notes.addEventListener("click", deleteNote)

notesSlide.addEventListener("click", () => {
    userProgress = [];
    if (document.querySelectorAll('.note').length === 0) {
        userProgress = [];
        localStorage.setItem('notes-progress', JSON.stringify(userProgress))
    } else {
        Array.from(document.querySelectorAll(".note")).forEach(el => {
            if (!el.classList.contains("example")) {
                userProgress.push(el.innerHTML+`#$#${el.style.borderColor}`);
                localStorage.setItem('notes-progress', JSON.stringify(userProgress));
            }
        })
    }
})





