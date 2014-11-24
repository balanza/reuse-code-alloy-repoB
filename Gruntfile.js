/**
 * Gruntfile.js
 *
 * This file collects automated tasks for this Alloy app.
 * Please refer to Grunt for documentation (http://gruntjs.com/)
 *
 * @author Emanuele De Cupis (http://emanuele.decup.is)
 */


module.exports = function(grunt) {

    // you'll need these modules for correctly addressing folders and files
    var path = require('path');
    var fs = require('fs');
    var underscore = require('underscore');

    //root for our submodules
    var submodules = path.join(__dirname, 'submodules');
    var repoA = path.join(submodules, 'repoA');



    grunt.initConfig({


        gitcheckout: {
            repoA: {
                options: {
                    cwd: repoA,
                    verbose: true,
                    branch: '.'
                }
            }
        },
        gitpull: {
            repoA: {
                options: {
                    cwd: repoA,
                    verbose: true,
                    callback: function(done) {

                        mergeFilesFromRepoA();
                        done();
                    }
                }
            }
        }
    });


    /**
     * init grunt plugins
     */

    grunt.loadNpmTasks('grunt-git');


    /**
     * register tasks
     */

    //this task fetches last changes from submodule RepoA's remote master branch, then copy files
    // use 'grunt update-repoa' to run it in terminal
    grunt.registerTask('update-repoa', 'update RepoA submodule and copy files in my app', ['gitcheckout', 'gitpull']);



    /**
     * This function merges all files from submodule RepoA to current project RepoB
     * Here you can implement your custom merge business logic, choosing which files to copy or not.
     *
     */
    function mergeFilesFromRepoA() {

        /**
         * Simple routine to copy files in js
         * @param  {string} srcFile   path for source file
         * @param  {string} destFile  path for destination file
         * @return {object}           reference to the created file
         */
        var copyFile = function(srcFile, destFile) {
            console.log('copying ' + srcFile + ' into ' + destFile);
            var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
            BUF_LENGTH = 64 * 1024;
            buff = ''; // new Buffer(BUF_LENGTH);
            fdr = fs.readFileSync(srcFile);
            fdw = fs.writeFileSync(destFile, fdr);
            return fdw;
        };



        /**
         *  Our simple merge business logic simply copies all files from following folders into our project
         */

        var toBeCopied = ['controllers', 'styles', 'views', 'lib'];

        for (var i = 0; i < toBeCopied.length; i++) {
            var folder = toBeCopied[i];


            var dir = path.join(repoA, 'app', folder);
            // logger.info('copying files from ' + dir);
            var files = fs.readdirSync(dir);
            for (var j = files.length - 1; j >= 0; j--) {


                var file = path.join(dir, files[j]);
                // logger.info('file ' + file);
                var source = file;
                var destination = path.join('./app', folder, files[j]);
                copyFile(source, destination);
            }
        };

        



        console.log('RepoA copied!');
    }



};