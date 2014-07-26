'use strict';
module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
              src: {
                files: ['app/**/*'],
                tasks: ['dev']
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: ['<%= yeoman.dist %>/*', '!<%= yeoman.dist %>/.git*']
                    }
                ]
            },
            tmp: '.tmp'
        },
        //configure usemin to treat our blocks in index.html how we want, note it uses .tmp/index.html NOT app/index.html
        //which is updated and put in this location by our replace block
        useminPrepare: {
            html: '.tmp/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        //let usemin run concat and minify on our assets
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: '*.html',
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        //use replace to update the @@ember and @@ember_data variables in index.html AND copy index.html to .tmp
        //this is so we can use a prod version of ember which gives less verbose error messages in production
        //while the other version gives as much info as it can about problems
        replace: {
            app: {
                options: {
                    variables: {
                        ember: 'bower_components/ember/ember.js',
                        ember_data: 'bower_components/ember-data/ember-data.js'
                    }
                },
                files: [
                    {src: '<%= yeoman.app %>/index.html', dest: '.tmp/index.html'}
                ]
            },
            dist: {
                options: {
                    variables: {
                        ember: 'bower_components/ember/ember.prod.js',
                        ember_data: 'bower_components/ember-data/ember-data.prod.js'
                    }
                },
                files: [
                    {src: '<%= yeoman.app %>/index.html', dest: '.tmp/index.html'}
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dev: {
                files: [
                    {'dist/scripts/main.js': '.tmp/scripts/combined-scripts.js'}
                ]
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        cwd: '<%= yeoman.app %>/bower_components/',
                        dest: '<%= yeoman.app %>/styles/fonts/',
                        src: [
                            'bootstrap/fonts/**' //copy bootstrap fonts to our dist/fonts dir
                        ]
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        //copy all our static assets from the app dir to dest
                        src: [
                            '*.{ico,txt}',
                            '.htaccess',
                            'images/{,*/}*.{webp,gif}',
                            'styles/fonts/*'
                        ]
                    }
                ]
            }
        },
        //preprocess our ember templates, merging them into one file and invoking compile
        emberTemplates: {
            options: {
                templateName: function (sourceFile) {
                    var templatePath = yeomanConfig.app + '/templates/';
                    return sourceFile.replace(templatePath, '');
                }
            },
            dist: {
                files: {
                    '.tmp/scripts/compiled-templates.js': '<%= yeoman.app %>/templates/**/*.hbs'
                }
            }
        },
        //build our Ember JavaScript (controllers etc)into one script file, in the order we "require" them in app.js
        neuter: {
            app: {
                options: {
                    filepathTransform: function (filepath) {
                        return yeomanConfig.app + '/' + filepath;
                    }
                },
                src: '<%= yeoman.app %>/scripts/app.js',
                dest: '.tmp/scripts/combined-scripts.js'
            }
        },
        less: {
            main: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'style.css.map',
                    sourceMapFilename: 'dist/styles/style.css.map'
                },
                files: {
                    '.tmp/styles/style.css': 'app/styles/main.less'
                }
            }
        }
    });

    grunt.registerTask('dev', [
        'clean:dist',
        'less',
        'emberTemplates:dist',
        'replace:app', //use verbose version of ember
        'useminPrepare',
        'concat',
        'neuter:app',
        'copy',
        'htmlmin',
        'usemin',
        'clean:tmp'
    ]);
    grunt.registerTask('dist', [
        'clean:dist',
        'less',
        'emberTemplates:dist',
        'replace:dist', //use prod version of ember
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'neuter:app',
        'copy:fonts',
        'copy:dist',
        'htmlmin',
        'usemin',
        'clean:tmp' //only clean the tmp dir, leaving dist in tact
    ]);

    grunt.registerTask('default',
        [
            'dev'
        ]
    );
    grunt.loadNpmTasks('grunt-contrib-less');
};
