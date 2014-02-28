
module.exports = function (grunt) {
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),

        'jshint': {
            'options': {
                'jshintrc': '.jshintrc'
            },
            'all': ['lib/miss.js']
        },

        'concat': {
            'options': {
                'banner': '/*! <%= pkg.name %> - v<%= pkg.version %> */\n'
            },
            'dist': {
                'src': [
                    'src/intro.js',
                    'src/lang.js',
                    'src/header.js',
                    'src/path.js',
                    'src/util.js',
                    'src/config.js',
                    'src/module.js',
                    'src/request.js',
                    'src/footer.js',
                    'src/outro.js'
                ],
                'dest': 'lib/miss.js'
            }
        },

        'uglify': {
            'options': {
                'mangle': {
                    'except': ['require']
                },
                'banner': '/*! <%= pkg.name %> - v<%= pkg.version %> */\n'
            },
            'target': {
                'files': {
                    'lib/miss.min.js': 'lib/miss.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat']);
    grunt.registerTask('build', ['concat', 'jshint', 'uglify'])
};
