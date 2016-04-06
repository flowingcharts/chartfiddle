module.exports = function (grunt) 
{
    // Project configuration.
    grunt.initConfig(
    {
        // Fetch the package file.
        // We can use properties of this file in our code eg <%= pkg.name %> <%= pkg.version %>.
        pkg: grunt.file.readJSON('package.json'),

        // Concatenates and bundles the JavaScript module files in 'src/js/' into 'gen_build/<%= pkg.name %>.js'.
        // Adds a banner displaying the project name, version and date to 'gen_build/<%= pkg.name %>.js'.
        concat: 
        {
            options: 
            {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            build: 
            {
                src: 
                [
                    'src/js/**/*.js'
                ],
                dest: 'gen_build/<%= pkg.name %>.js'
            }
        },
        // Detects errors and potential problems in the JavaScript module and test files.
        // 'gruntfile.js' This file.
        // 'src/js/**/*.js' The JavaScript module files.
        // 'test/js/**/*.js' The JavaScript test files.
        jshint: 
        {
            all: ['gruntfile.js', 'src/js/**/*.js', 'test/js/**/*.js']
        },
        // Remove console statements, debugger and specific blocks of code.
        // Removes blocks of code surrounded by //<validation>...//</validation>
        // Generates 'gen_build/<%= pkg.name %>.min.js' from 'gen_build/<%= pkg.name %>.js'.
        groundskeeper: 
        {
            compile: 
            {
                files: 
                {
                    'gen_build/<%= pkg.name %>.min.js': 'gen_build/<%= pkg.name %>.js', // 1:1 compile
                }
            }
        },
        // Minimises the JavaScript source code file 'gen_build/<%= pkg.name %>.min.js' into 'gen_build/<%= pkg.name %>.min.js'.
        // Adds a banner displaying the project name, version and date to the minimised file.
        // Creates a source map file 'gen_build/<%= pkg.name %>.map' for debugging the minimised code file.
        // Removes DEBUG code from minimised code file.
        uglify: 
        {
            options: 
            {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */',
                /*sourceMap: true,
                sourceMapName: "gen_build/<%= pkg.name %>.map"*/
                compress: 
                {
                    // Remove debug code from minimised code.
                    global_defs: 
                    {
                        "DEBUG": false
                    },
                    dead_code: true
                }
            },
            build: 
            {
                files: 
                {
                    'gen_build/<%= pkg.name %>.min.js': ['gen_build/<%= pkg.name %>.min.js']
                }
            }
        },
        // Minify all contents of the css release directory and add a .min.css extension.
        cssmin: 
        {
            target: 
            {
                files: [
                {
                    expand: true,
                    cwd: 'gen_release/<%= pkg.name %>-<%= pkg.version %>/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'gen_release/<%= pkg.name %>-<%= pkg.version %>/css/',
                    ext: '.min.css'
                }]
            }
        },
        // Deletes directories.
        clean: 
        {
            // Deletes JavaScript API documentation.
            doc: {src: ['gen_doc']},
            // Deletes test coverage.
            coverage: {src: ['gen_test_coverage/']},
            // Deletes release.
            release: {src: ['gen_release/']},
            // Deletes build.
            build: {src: ['gen_build/']}
        },
        // Copies files/directories.
        copy: 
        {
            // Copies files to a release directory 'gen_release/<%= pkg.name %>-<%= pkg.version %>/'.
            release: 
            {
                files: 
                [
                    // Copies the JavaScript source file 'gen_build/<%= pkg.name %>.js' and 
                    // minimised file 'gen_build/<%= pkg.name %>.min.js' to 'gen_release/<%= pkg.name %>-<%= pkg.version %>/js/'.
                    {
                        expand: true, 
                        flatten: true, // Flattens results to a single level so directory structure isnt copied.
                        src: 
                        [
                            'gen_build/<%= pkg.name %>.js', 
                            'gen_build/<%= pkg.name %>.min.js'
                        ], 
                        dest: 'gen_release/<%= pkg.name %>-<%= pkg.version %>/js/'
                    }, 
                    // Copies the css source file 'src/css/<%= pkg.name %>.css' to 'gen_release/<%= pkg.name %>-<%= pkg.version %>/css/'.
                    {
                        expand: true, 
                        flatten: true, // Flattens results to a single level so directory structure isnt copied.
                        src: ['src/css/<%= pkg.name %>.css'], 
                        dest: 'gen_release/<%= pkg.name %>-<%= pkg.version %>/css/'
                    },
                    // Copies the external JavaScript library files 'lib/', to 'gen_release/<%= pkg.name %>-<%= pkg.version %>/lib/'.
                    {
                        expand: true,
                        cwd: 'lib/', // Makes the src relative to cwd so that the full file path is not copied into release.    
                        src: '**/*',
                        dest: 'gen_release/<%= pkg.name %>-<%= pkg.version %>/lib/'
                    },
                    // Copies the JavaScript API documentation 'gen_doc/', to 'gen_release/<%= pkg.name %>-<%= pkg.version %>/doc/'.
                    {
                        expand: true,
                        cwd: 'gen_doc/',
                        src: '**/*',
                        dest: 'gen_release/<%= pkg.name %>-<%= pkg.version %>/doc/'
                    }
                ]
            },
            // Copies the JavaScript test files 'test/js/' to 'gen_test_coverage/test/js/' for testing coverage.
            coverage: 
            {
                files: 
                [
                    {
                        expand: true,
                        cwd: 'test/js/',
                        src: '**/*',
                        dest: 'gen_test_coverage/test/js/'
                    }
                ]
            }
        },
        // Used for test coverage alongside mochaTest.
        // Copies the JavaScript module files 'src/js/' to 'gen_test_coverage/src/js/' for testing coverage.
        blanket: 
        {
            coverage: 
            {
                src: ['src/js/'],
                dest: 'gen_test_coverage/src/js/'
            }
        },   
        // Unit testing.
        mochaTest: 
        {
            // Runs unit tests 'gen_test_coverage/test/js/' on the JavaScript module files in 'gen_test_coverage/src/js/'.
            test: 
            {
                options: 
                {
                    reporter: 'spec',
                },
                src: ['gen_test_coverage/test/js/**/*.js']
            },
            // Creates a test coverage file 'gen_test_coverage/coverage.html'.
            // This file helps highlight areas where more testing is required.
            coverage: 
            {
                options: 
                {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'gen_test_coverage/coverage.html'
                },
                src: ['gen_test_coverage/test/js/**/*.js']
            }
        },
        // Generates documentation for the JavaScript module files 'src/js/**/*.js' in 'gen_doc'.
        // Uses template and config files from ink-docstrap.
        jsdoc: 
        {
            doc: 
            {
                src: ['src/js/**/*.js'],
                options: 
                {
                    destination: 'gen_doc',
                    //template : 'doc/template',
                    //configure : 'doc/template/jsdoc.conf.json'
                }
            }
        },
        // Browserify bundles up all of the project dependencies into a single JavaScript file.
        // Generates a bundled file 'gen_build/<%= pkg.name %>.js' from the starting point 'src/js/main.js'.
        // Adds a banner displaying the project name, version and date to 'gen_build/<%= pkg.name %>.js'.
        browserify: 
        {
            build: 
            {
                options: 
                {
                    banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    browserifyOptions: 
                    {
                        // Generates inline source maps as a comment at the bottom of 'gen_build/<%= pkg.name %>.js' 
                        // to enable debugging of original JavaScript module files.
                        debug: true
                    },
                    transform: [['babelify', {presets: ['react']}]] // Convert jsx to js. 
                },        
                src: ['src/js/main.js'],
                dest: 'gen_build/<%= pkg.name %>.js'
            }
        },
        // Processes and copies the demo files 'index.html', to 'gen_release/<%= pkg.name %>-<%= pkg.version %>/index.html'.
        // Adds a banner displaying the project name, version and date.
        // Replaces source paths in html files with minimised versions.
        processhtml: 
        {
            options:
            {
                data: 
                {
                    banner: '<!-- <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> -->'
                }
            },
            release: 
            {
                files: 
                [
                    {
                        expand: true,   
                        cwd: 'src/', 
                        src: ['index.html'],
                        dest: 'gen_release/<%= pkg.name %>-<%= pkg.version %>/',
                        ext: '.html'
                    }
                ]
            }
        }, 
        // Extracts and lists TODOs and FIXMEs from code.
        todos: 
        {
            all: 
            {
                src: ['gruntfile.js', 'src/js/**/*.js', 'test/js/**/*.js'],
                options: 
                {
                    verbose: false,
                    reporter: 
                    {
                        fileTasks: function (file, tasks) 
                        {
                            if (!tasks.length) 
                            {
                                return '';
                            }
                            var result = '';
                            result += file + '\n';
                            tasks.forEach(function (task) 
                            {
                                result += task.lineNumber + ': ' + task.line + '\n';
                            });
                            result += '\n';
                            return result;
                        }
                    }
                }
            }
        },
        // Zips up release files into 'gen_release/<%= pkg.name %>-<%= pkg.version %>.zip'.
        compress: 
        {
            main: 
            {
                options: 
                {
                    archive: 'gen_release/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                expand: true,
                cwd: 'gen_release/<%= pkg.name %>-<%= pkg.version %>/',
                src: ['**/*'],
                dest: ''
            }
        },
        // Opens the specified files.
        open : 
        {
            dev : 
            {
                path: 'file:///C:/Work/GitHub/<%= pkg.name %>/src/index.html',
                app: 'Chrome'
            },
            release : 
            {
                path : 'file:///C:/Work/GitHub/<%= pkg.name %>/gen_release/<%= pkg.name %>-<%= pkg.version %>/index.html',
                app: 'Chrome'
            }
        },
        // '>grunt watch' Runs the 'build' task if changes are made to the JavaScript source files 'src/js/**/*.js'.
        // Enable by typing '>grunt watch' into a command prompt.
        watch:
        {
            // livereload reloads any html pages that contain <script src="http://localhost:35729/livereload.js"></script>
            // see http://stackoverflow.com/a/16430183
            options: { livereload: true },
            files: ['src/js/**/*.js'],
            tasks: ['build']
        }
    });

    // Load the plugins that provide the tasks.
    grunt.loadNpmTasks('grunt-blanket');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-groundskeeper');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-todos');

    // Tasks that can be run from the command line.
    // Open command prompt in this directory (shift + right click > Open command window here) to run tasks.

    // '>grunt watch' Runs the 'build' task if changes are made to the JavaScript source files 'src/js/**/*.js'.

    // '>grunt todos' Extracts and lists TODOs and FIXMEs from code.

    // '>grunt doc' 
    // Generate API documentation in 'gen_doc'. 
    grunt.registerTask('doc', ['clean:doc','jsdoc:doc']);           

    // '>grunt build' 
    // Run this to rebuild the repo during development.
    //grunt.registerTask('build', ['clean:build', 'jshint', 'browserify:build', 'groundskeeper', 'uglify']);      
    grunt.registerTask('build', ['clean:build', 'browserify:build', 'groundskeeper', 'uglify']);      

    // '>grunt test' 
    // Carry out unit testing on the JavaScript module files and generate a test coverage file at 'gen_test_coverage/coverage.html'.
    //grunt.registerTask('test', ['clean:coverage', 'copy:coverage', 'blanket:coverage', 'mochaTest']);

    // '>grunt publish' 
    // Publish a release version to 'gen_release/<%= pkg.name %>-<%= pkg.version %>/'.
    grunt.registerTask('publish', ['clean:release', 'doc', 'copy:release', 'cssmin', 'processhtml', 'compress', 'open:release']);      

    // '>grunt' 
    // Run this after installation to generate 'gen_build', 'gen_doc', 'gen_release' and 'gen_test_coverage' directories.              
    //grunt.registerTask('default', ['build', 'test', 'publish']);    
    grunt.registerTask('default', ['build', 'publish']);    
};