module.exports = {
  paths: {
    watched: ['src']
  },

  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^src/
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },

  npm: {
    globals: {
      $: 'jquery'
    }
  },

  plugins: {
    babel: {presets: ['es2015']}
  }
};

