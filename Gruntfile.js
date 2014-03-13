var fs = require('fs');

module.exports = function (grunt) {
    var config = {
        'pkg': grunt.file.readJSON('package.json'),

        'clean': ['lib/*.js']
    };

    var tasks = fs.readdirSync('./tasks');

    if (!tasks.length) {
        return;
    }

    tasks.forEach(function (task) {
        var json = JSON.parse(fs.readFileSync('./tasks/' + task, 'utf-8'));
        for (var key in json) {
            config[key] = json[key];
        }
    });

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean', 'concat', 'jshint', 'uglify', 'copy'])
};
