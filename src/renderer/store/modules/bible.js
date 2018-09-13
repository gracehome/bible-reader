const state = {
  location: {
    version: 1,
    book: 1,
    chapter: 1,
    verse: 1,
  },
  books: [],
  book: {},
};

const getters = {
  book: state => (arg) => {
    const bookId = parseInt(arg.book, 10) || 1;
    const version = parseInt(arg.version, 10) || 1;
    return state.books.find(book => book.version === version && book.id === bookId);
  },
  books: () => state.books,
  oldnew: state => oldnew => state.books.filter(book => book.oldnew === oldnew),
};

const mutations = {
  setbooks(state, books) {
    state.books = books || [];
  },
};

export default {
  state,
  getters,
  mutations,
};
