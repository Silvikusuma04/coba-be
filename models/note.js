let notes = [
    {
      id: 1,
      title: 'first note',
      content: 'My first note is here.'
    }
  ];
  
  export const listNotes = () => {
    return notes.map(({ id, title }) => ({ id, title }));
  };
  
  export const getNote = (id) => {
    const note = notes.find(n => n.id === id);
    if (!note) {
      throw new Error('Note not found');
    }
    return note;
  };
  
  export const createNote = (title, content) => {
    const lastId = notes.length ? notes[notes.length - 1].id : 0;
  
    const newNote = {
      id: lastId + 1,
      title,
      content
    };
  
    notes.push(newNote);
    return newNote;
  };
  
  export const updateNote = (id, title, content) => {
    const index = notes.findIndex(n => n.id === id);
  
    if (index === -1) {
      throw new Error('Note not found for update');
    }
  
    notes[index] = {
      ...notes[index],
      title,
      content
    };
  
    return notes[index];
  };
  
  export const deleteNote = (id) => {
    const exists = notes.some(n => n.id === id);
  
    if (!exists) {
      throw new Error('Note not found for delete');
    }
  
    notes = notes.filter(n => n.id !== id);
  };