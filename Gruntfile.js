module.exports = function(grunt) {
    
  require('grunt-task-loader')(grunt);  
  grunt.initConfig({
     jshint: {
         files: ['Gruntfile.js','test/**/*.js']
     },
     mochaTest: {
         test: {
             src: ['test/**.js']
         }
     }
  });
  
  grunt.registerTask('default', ['jshint','mochaTest']);
};