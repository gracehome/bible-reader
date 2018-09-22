const state = {
  location: {
    version: 1,
    scripture: 1,
    chapter: 1,
    verse: 1,
  },
  scriptures: [],
  scripture: {},
};

const getters = {
  scripture: state => (arg) => {
    const scriptureId = parseInt(arg.scripture, 10) || 1;
    const version = parseInt(arg.version, 10) || 1;
    return state.scriptures.find(sp => sp.version === version && sp.id === scriptureId);
  },
  scriptures: () => state.scriptures,
  oldnew: state => oldnew => state.scriptures.filter(scripture => scripture.oldnew === oldnew),
};

const mutations = {
  setscriptures(state, scriptures) {
    state.scriptures = scriptures || [];
  },
};

export default {
  state,
  getters,
  mutations,
};
