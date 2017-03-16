/**
 *
 */
function FileLoader(files, callbacks) {

    // ---------------------------------------------------------------------------------------- Preferences & Properties

    var fallbackFiles     = [],
        fallbackCallbacks = {
            onFileLoaded  : function (){},
            onFilesLoaded : function (){},
            onError       : function (){}
        },
        htmlHeadElement;

    // ----------------------------------------------------------------------------------------- Internal module methods

   /*
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

        secureParameters(); // @todo - absichern parameters
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
        var amount = files.length,
            i      = 0;

        for (; i < amount; i++) {
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
        switch (getFileExtension(file).toLowerCase()) {
            case 'css':
                appendElementToDom(getNewLinkElement(file), onFileLoad, onFileError);
                break;
            case 'js':
                appendElementToDom(getNewScriptElement(file), onFileLoad, onFileError);
                break;
            default:
                return;
        }

        function onFileLoad() {
            callbacks.onFileLoaded({
                file : file
            });
        }

        function onFileError() {
            callbacks.onError({
                file : file
            });
        }
    }

    // ----------------------------------------------------------------------------------------------------- Private

    /**
     * Overwrites the default config with the user config if it is valid.
     *
     * @todo - Boolean returns are unnecessary!
     *
     * @private
     * @param  {Object} configuration
     * @return {boolean}
     */
    function secureParameters() {
        var fileList = [],
            i, fileAmount;

        // ----------------------------------------------------------------------------------------- Parameter files

        if (!isArray(files)) {
            files = fallbackFiles;
        }
        else {
            fileAmount = files.length;

            for (i = 0; i < fileAmount; i++) {
                if (isString(files[i])) {
                    fileList.push(files[i]);
                }
                else {
                    console.warn('Parameter: files[' + i + '] is not a valid string!');
                }
            }

            files = fileList;
        }

        // -------------------------------------------------------------------------------------- Parameter callback

        if (!isObject(callbacks)) {
            callbacks = fallbackCallbacks;
        }
        else {
            if (!isFunction(callbacks.onFileLoaded)) {
                callbacks.onFileLoaded = fallbackCallbacks.onFileLoaded;
            }

            if (!isFunction(callbacks.onFilesLoaded)) {
                callbacks.onFilesLoaded = fallbackCallbacks.onFilesLoaded;
            }

            if (!isFunction(callbacks.onError)) {
                callbacks.onError = fallbackCallbacks.onError;
            }
        }
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

    // -------------------------------------------------------------------------------------------------------- Initials

    (init)();

    // --------------------------------------------------------------------------------------------------------- Returns

    return getPublicApi();
}
