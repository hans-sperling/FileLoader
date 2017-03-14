module.exports = function(grunt) {
    'use strict';

    // ---------------------------------------------------------------------------------------------------------- Banner

    function getBanner() {
        return '/*! <%= pkg.name %> - <%= pkg.description %> - Version: <%= pkg.version %> */\n';
    }

    // ----------------------------------------------------------------------------------------------------------- Grunt

    grunt.initConfig({
        pkg    : grunt.file.readJSON('package.json'),
        concat : {
            dist : {
                options : {
                    banner : getBanner()
                },
                src  : ['src/js/fileLoader.js'],
                dest : 'dist/js/fileLoader.js'
            }
        },
        jsdoc : {
            dist : {
                options: {
                    private   : false,
                    template  : "node_modules/ink-docstrap/template",
                    configure : "jsdoc.json"
                },
                src  : ['src/js/fileLoader.js'],
                dest : 'doc'
            }
        },
        uglify : {
            dist : {
                options : {
                    banner : getBanner()
                },
                src  : 'src/js/fileLoader.js',
                dest : 'dist/js/fileLoader.min.js'
            }
        }
    });

    // ----------------------------------------------------------------------------------------------- Plugins

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');

    // ------------------------------------------------------------------------------------------------- Tasks

    grunt.registerTask('build',   ['concat:dist', 'uglify:dist', 'jsdoc']);
    grunt.registerTask('doc',     ['jsdoc']);
};
