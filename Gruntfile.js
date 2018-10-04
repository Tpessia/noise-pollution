module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/styles',
                    src: ['*.scss'],
                    dest: 'assets/styles/css/',
                    ext: '.css'
                }]
            }
        },

        uglify: {
            options: {
                mangle: false, // angular fix
                sourceMap: true
            },
            my_target: {
                files: {
                    'app/app.min.js': ['app/app.js', 'app/_directives/*/*.js', 'app/_services/*.js', 'app/*/*.controller.js']
                }
            }
        },

        'string-replace': {
            dist: {
                files: {
                    'index.php': 'index.php',
                },
                options: {
                    saveUnchanged: false,
                    replacements: [{
                        pattern: /\?v=(.*?)!/g,
                        replacement: '?v=' + '<%= pkg.version %>' + '!'
                    }]
                }
            }
        },

        watch: {
            sass: {
                files: ['assets/styles/*.scss'],
                tasks: ['sass','string-replace']
            },

            uglify: {
                files: ['app/**/*.js', '!app/app.min.js'],
                tasks: ['uglify','string-replace']
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-string-replace');

    // Default task(s).
    grunt.registerTask('default', ['encapsulator']);

    grunt.registerTask('encapsulator', [
        'sass',
        'uglify',
        'string-replace',
        'watch'
    ]);

};