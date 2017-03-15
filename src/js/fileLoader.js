/**
 *
 */
function FileLoader(configuration) {

    // ---------------------------------------------------------------------------------------- Preferences & Properties

    var defaultConfiguration = {
            files     : [],
            callbacks : {
                onFileLoaded  : function (){},
                onFilesLoaded : function (){},
                onError       : function (){}
            }
        },
        config = defaultConfiguration,
        htmlHeadElement;

    // ----------------------------------------------------------------------------------------- Internal module methods

   /*
    * Returns the public api.
    *
    * @private
    * @returns {Object}
    */
    function getPublicApi() {
        return {};
    }


    /**
     *
     */
    function init() {
        htmlHeadElement = getHtmlHeadElement();

        setUserConfiguration(configuration);
        loadFiles(config.files, config.callbacks);
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

    /**
     * Overwrites the default config with the user config if it is valid
     *
     * @param  {Object} configuration
     * @return {boolean}
     */
    function setUserConfiguration(configuration) {
        var i, amount;

        if (!isObject(configuration)) { return false; }
        if (!isArray(configuration.files)) { return false; }

        amount = configuration.files.length;

        for (i = 0; i < amount; i++) {
            if (isString(configuration.files[i])) {
                config.files.push(configuration.files[i]);
            }
            else {
                console.warn('Parameter: configuration.files[' + i + '] is not a valid string!');
            }
        }

        if (!isObject(configuration.callbacks)) { return false; }

        if (isFunction(configuration.callbacks.onFileLoaded)) {
            config.callbacks.onFileLoaded = configuration.callbacks.onFileLoaded;
        }
        else if (!isUndefined(configuration.callbacks.onFileLoaded)) { return false; }

        if (isFunction(configuration.callbacks.onFilesLoaded)) {
            config.callbacks.onFilesLoaded = configuration.callbacks.onFilesLoaded;
        }
        else if (!isUndefined(configuration.callbacks.onFileLoaded)) { return false; }

        if (isFunction(configuration.callbacks.onError)) {
            config.callbacks.onError = configuration.callbacks.onError;
        }
        else if (!isUndefined(configuration.callbacks.onError)) { return false; }

        return true;
    }


    /**
     * Returns the HTML Head-Element.
     *
     * @returns {*}
     */
    function getHtmlHeadElement() {
        return document.getElementsByTagName('head')[0];
    }


    /**
     * Iterates through all given files and calls a method to append these files to the HTML Head-Element.
     *
     * @param {Object} callbacks
     * @param {Array} files
     */
    function loadFiles(files, callbacks) {
        var amount = files.length,
            i      = 0;

        for (; i < amount; i++) {
            loadFile(config.files[i], callbacks);
        }
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


    function getNewScriptElement(file) {
        var fileObject = document.createElement('script');

        fileObject.type  = 'text/javascript';
        fileObject.async = true;
        fileObject.src   = file;

        return fileObject;
    }


    function getNewLinkElement(file) {
        var fileObject = document.createElement('link');

        fileObject.rel   = 'stylesheet';
        fileObject.async = true;
        fileObject.href  = file;

        return fileObject;
    }


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
