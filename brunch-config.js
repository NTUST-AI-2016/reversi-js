module.exports = {
  paths: {
    watched: ['src']
  },

  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!src)/,
        'app.js': /^src/
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },

  npm: {
    enable: true,
    globals: {
      $: 'jquery'
    }
  },

  plugins: {
    babel: {presets: ['es2015']}
  }
};

