const config = {
  // General configs
  titlePrefix: '',
  online: true,

  // hubdb configuration object (@see https://github.com/mapbox/hubdb)
  hubdb: {
    username: 'smourph',
    repo: 'dnd-character-sheets',
    branch: 'data',
    token: process.env.REACT_APP_GITHUB_PERSONNAL_ACCESS_TOKEN
  }
};

export default config;
