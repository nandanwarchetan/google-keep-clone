class App {
  constructor() {
    this.notes = [];
    this.labels = [];
    this.title = '';
    this.text = '';
    this.id = '';
    this.color= '';
    this.label= '';

    this.$placeholder = document.querySelector('#placeholder');
    this.$form = document.querySelector('#form');
    this.$notes = document.querySelector('#notes');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$noteLabel = document.querySelector('#note-label');
    this.$noteColor = document.querySelector('#note-color');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$formCloseButton = document.querySelector('#form-close-button');
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalColor = document.querySelector('.modal-color');
    this.$modalLabel = document.querySelector('.modal-label');
    this.$modalCloseButton = document.querySelector('.modal-close-button');
    this.$modalDeleteButton = document.querySelector('.modal-delete-button');

    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', (event) => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
    });

    this.$form.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const color = this.$noteColor.value;
      const label = this.$noteLabel.value;
      const hasNote = title || text;
      if (hasNote) {
        // add note
        this.addNote({ title, text, color, label });
      }
    });

    this.$formCloseButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseButton.addEventListener('click', (event) => {
      this.closeModal(event);
    });

    this.$modalDeleteButton.addEventListener('click', (event) => {
      this.deleteNote(event);
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);

    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const label = this.$noteLabel.value;
    const color = this.$noteColor.value;
    const hasNote = title || text;

    if (isFormClicked) {
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text, color, label });
    } else {
      this.closeForm();
    }
  }

  
  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteTitle.value = '';
    this.$noteText.value = '';
    this.$noteLabel.value = '';
  }

  openModal(event) {
    console.log(this.notes)
    if (event.target.closest('.note')) {
      this.$modal.classList.toggle('open-modal');
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
      this.$modalColor.value = this.color;
      this.$modalLabel.value = this.label;
      console.log(this.color)
    }
  }

  closeModal(event) {
    this.editNote();
    this.$modal.classList.toggle('open-modal');
  }

  

  addNote({ title, text, color, label }) {
    const newNote = {
      title,
      text,
      color,
      label,
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };
    this.notes = [...this.notes, newNote];
    this.displayNotes();
    this.closeForm();
  }

  editNote() {
   
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    const color = this.$modalColor.value;
    const label = this.$modalLabel.value;
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, title, text, color, label } : note
    );
    this.displayNotes();
  }

  deleteNote(event) {
    const removeIndex = this.notes.findIndex( item => item.id === this.id );
    this.notes.splice( removeIndex, 1 );
    this.editNote();
    this.$modal.classList.toggle('open-modal');
  }

  selectNote(event) {
    const $selectedNote = event.target.closest('.note');
    if (!$selectedNote) return;
    const [$noteTitle, $noteText, $noteLabel, $noteColor] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.color = window.getComputedStyle($selectedNote, null).getPropertyValue("background-color");
    this.color = this.RGBToHex(this.color);
    this.label = $noteLabel.innerText;

    console.log(this.color)
    this.id = $selectedNote.dataset.id;
  }

  RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

    this.$notes.innerHTML = this.notes
      .map(
        (note) => `
        <div style="background-color: ${note.color};" class="note" data-id="${
          note.id
        }">
          <div class="${note.title && 'note-title'}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="note-label">${note.label}</div>
          <div class="toolbar-container">
            <div class="toolbar">
            </div>
          </div>
        </div>
     `
      )
      .join('');
  }
}

new App();
