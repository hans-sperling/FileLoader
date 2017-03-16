/**
 * FileLoader - Async loading of CSS and JS files by appending HTML link- or script-Elements to the HTML Head-Element.
 *
 * @class FileLoader
 *
 * @type     {Object}
 * @property {Function} loadFile  - Appends the given file to the HTML Head-Element if the file exists.
 * @property {Function} loadFiles - Appends all given files to the HTML Head-Element if the files exist.
 * @returns  {Object}
 */
function FileLoader(files, callbacks) {

    // ---------------------------------------------------------------------------------------- Preferences & Properties

    var fallbackFiles     = [],
        fallbackCallbacks = {
            onFileLoaded  : function (){},
            onFilesLoaded : function (){},
            onError       : function (){}
        },
        fileLoadDecrement = null,
        quietOutput       = true,
        htmlHeadElement;

    // ----------------------------------------------------------------------------------------- Internal module methods

    /**
     * Returns the public api.
     *
     * @private
     * @returns {Object}
     */
    function getPublicApi() {
        return {
            loadFile  : loadFile,
            loadFiles : loadFiles
        };
    }


    /**
     * Initialize this module.
     * Determines the HTML Head-Element.
     * Overwrites the default config with the given one from the user.
     * Loads all given files and appends them to the HTML Head-Element.
     *
     * @private
     */
    function init() {
        htmlHeadElement = getHtmlHeadElement();

        loadFiles(files, callbacks);
    }

    // -------------------------------------------------------------------------------------------------- Helper methods

    /**
     * Checks if the type of the given parameter is an array.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isArray(value) {
        return Object.prototype.toString.call(value) == "[object Array]";
    }


    /**
     * Checks if the type of the given parameter is a function.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isFunction(value) {
        return Object.prototype.toString.call(value) == "[object Function]";
    }


    /**
     * Checks if the type of the given parameter is an object.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isObject(value) {
        return Object.prototype.toString.call(value) == "[object Object]";
    }


    /**
     * Checks if the type of the given parameter is a string.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isString(value) {
        return Object.prototype.toString.call(value) == "[object String]";
    }


    /**
     * Checks if the type of the given parameter is undefined.
     *
     * @param  {*} value
     * @return {boolean}
     */
    function isUndefined(value) {
        return Object.prototype.toString.call(value) == "[object Undefined]";
    }

    // --------------------------------------------------------------------------------------------------------- Methods

    // ------------------------------------------------------------------------------------------------------ Public

    /**
     * Iterates through all given files and calls a method to append these files to the HTML Head-Element.
     *
     * @public
     * @param {Array}    files
     * @param {Object}   callbacks
     * @param {Function} callbacks.onFileLoaded
     * @param {Function} callbacks.onFilesLoaded
     * @param {Function} callbacks.onError
     */
    function loadFiles(files, callbacks) {
        var fileAmount, i;

        files      = getProtectedParameterFiles(files);
        fileAmount = files.length;
        i          = 0;

        fileLoadDecrement = fileAmount;

        for (; i < fileAmount; i++) {
            loadFile(files[i], callbacks);
        }
    }


    /**
     * Appends the given file to the HTML Head-Element if the file exists.
     * Callback methods: onFileLoaded, onError
     *
     * @public
     * @param {String}   file
     * @param {Object}   callbacks
     * @param {Function} callbacks.onFileLoaded
     * @param {Function} callbacks.onFilesLoaded
     * @param {Function} callbacks.onError
     */
    function loadFile(file, callbacks) {
        callbacks = getProtectParameterCallbacks(callbacks);

        switch (getFileExtension(file).toLowerCase()) {
            case 'css' :
                appendElementToDom(getNewLinkElement(file), onFileLoad, onFileError);
                break;
            case 'js' :
                appendElementToDom(getNewScriptElement(file), onFileLoad, onFileError);
                break;
            default :
                if (!quietOutput) {
                    console.warn('File ' + file + ' has got an invalid extension.');
                }

                onFileError();
        }

        function onFileLoad() {
            callbacks.onFileLoaded({
                file : file
            });

            handleDecrement();
        }

        function onFileError() {
            callbacks.onError({
                file : file
            });

            handleDecrement();
        }

        function handleDecrement() {
            if (fileLoadDecrement === null) {
                callbacks.onFilesLoaded();
            }
            else {
                fileLoadDecrement--;

                if (fileLoadDecrement <= 0) {
                    callbacks.onFilesLoaded();
                    fileLoadDecrement = null;
                }
            }
        }
    }

    // ----------------------------------------------------------------------------------------------------- Private

    /**
     * Returns a valid version of the given files parameter or an empty array as fallback.
     *
     * @private
     * @param   {Array|*} files
     * @returns {Array}
     */
    function getProtectedParameterFiles(files) {
        var fileList = [],
            i, fileAmount;

        if (!isArray(files)) {
            if (!quietOutput) {
                console.warn('Parameter files is not valid; will be overwritten by fallback value');
            }

            files = fallbackFiles;
        }
        else {
            fileAmount = files.length;

            for (i = 0; i < fileAmount; i++) {
                if (isString(files[i])) {
                    fileList.push(files[i]);
                }
                else if (!quietOutput){
                    console.warn('Parameter: files[' + i + '] is not valid; will be ignored');
                }
            }

            files = fileList;
        }

        return files;
    }


    /**
     * Returns a valid version of the given callbacks parameter or an fallback object.
     *
     * @private
     * @param   {Object|*} callbacks
     * @returns {Object}
     */
    function getProtectParameterCallbacks(callbacks) {
        if (!isObject(callbacks)) {
            if (!quietOutput) {
                console.warn('Parameter callbacks is not valid; will be overwritten by fallback value');
            }

            callbacks = fallbackCallbacks;
        }
        else {
            if (!isFunction(callbacks.onFileLoaded)) {
                if (!isUndefined(callbacks.onError) && !quietOutput) {
                    console.warn('Parameter callbacks.onFileLoaded is not valid; will be overwritten by fallback value');
                }

                callbacks.onFileLoaded = fallbackCallbacks.onFileLoaded;
            }

            if (!isFunction(callbacks.onFilesLoaded)) {
                if (!isUndefined(callbacks.onError) && !quietOutput) {
                    console.warn('Parameter callbacks.onFilesLoaded is not valid; will be overwritten by fallback value');
                }

                callbacks.onFilesLoaded = fallbackCallbacks.onFilesLoaded;
            }

            if (!isFunction(callbacks.onError)) {
                if (!isUndefined(callbacks.onError) && !quietOutput) {
                    console.warn('Parameter callbacks.onError is not valid; will be overwritten by fallback value');
                }

                callbacks.onError = fallbackCallbacks.onError;
            }
        }

        return callbacks;
    }


    /**
     * Returns the HTML Head-Element.
     *
     * @returns {HTMLElement}
     */
    function getHtmlHeadElement() {
        return document.getElementsByTagName('head')[0];
    }


    /**
     * Returns the extension of the given file.
     *
     * @param   {String} file
     * @returns {String}
     */
    function getFileExtension(file) {
        return file.split('.').slice(-1).pop();
    }


    /**
     * Returns an HTML Script-Element with the given file as src attribute.
     *
     * @private
     * @param   {String} file
     * @returns {HTMLElement}
     */
    function getNewScriptElement(file) {
        var fileObject = document.createElement('script');

        fileObject.type  = 'text/javascript';
        fileObject.async = true;
        fileObject.src   = file;

        return fileObject;
    }


    /**
     * Returns an HTML Link-Element with the given file as href attribute.
     *
     * @private
     * @param   {String} file
     * @returns {HTMLElement}
     */
    function getNewLinkElement(file) {
        var fileObject = document.createElement('link');

        fileObject.rel   = 'stylesheet';
        fileObject.async = true;
        fileObject.href  = file;

        return fileObject;
    }


    /**
     * Appends the given HTML Element to the HTML Head-Element.
     * Calls onLoad method if the file has been loaded successfully and
     * calls onError method if there was an error on loading this file.
     *
     * @private
     * @param {HTMLElement} element
     * @param {Function}    onLoad
     * @param {Function}    onError
     */
    function appendElementToDom(element, onLoad, onError) {
        if (element.addEventListener) {
            element.addEventListener('load', onLoad, false);
        }
        else if (element.attachEvent) {
            element.attachEvent('load', onLoad);
        }
        else {
            element.onreadystatechange = onLoad;
        }

        element.onerror = onError;

        htmlHeadElement.appendChild(element);
    }

    // ----------------------------------------------------------------------------- Initial & Constructor call / Return

    (init)();

    return getPublicApi();
}
