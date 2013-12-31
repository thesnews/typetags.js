module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },

            build: {
                src: 'src/<%= pkg.name %>.jquery.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        less: {
            build: {
                src: 'src/<%= pkg.name %>.less',
                dest: 'build/<%= pkg.name %>.css'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'less']);

};
