/**
 *
 */
function FileLoader(configuration) {

    // ---------------------------------------------------------------------------------------- Preferences & Properties

    var defaultConfiguration = {
            files         : [],
            onFileLoaded  : function (){},
            onFilesLoaded : function (){},
            onError       : function (){}
        },
        config = defaultConfiguration;

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
        setUserConfiguration(configuration);
        loadFiles();
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


    /**
     * Checks if the given configuration is valid.
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
            if (isObject(configuration.files[i])) {
                if (isString(configuration.files[i].file)) {
                    config.files.push(configuration.files[i]);
                }
                else {
                    console.warn('Parameter: configuration.files[' + i + '] is not a valid string!');
                }
            }
        }

        if (isFunction(configuration.onFileLoaded)) {
            config.onFileLoaded = configuration.onFileLoaded;
        }
        else if (!isUndefined(configuration.onFileLoaded)) { return false; }

        if (isFunction(configuration.onFilesLoaded)) {
            config.onFilesLoaded = configuration.onFilesLoaded;
        }
        else if (!isUndefined(configuration.onFileLoaded)) { return false; }

        if (isFunction(configuration.onError)) {
            config.onError = configuration.onError;
        }
        else if (!isUndefined(configuration.onError)) { return false; }

        return true;
    }

    // --------------------------------------------------------------------------------------------------------- Methods

    function loadFiles() {
        var amount = config.files.length,
            i      = 0;

        for (; i < amount; i++) {
            loadFile(config.files[i].file);
        }
    }


    function loadFile(file) {
        var splitList = file.split('.'),
            ext       = splitList[splitList.length - 1].toLowerCase();

        switch (ext) {
            case 'js':
                addElementToDom(getScriptElement(file));
                break;
            case 'css':
                addElementToDom(getLinkElement(file));
                break;
            default:
                return;
        }
    }


    function getScriptElement(file) {
        var fileObject = document.createElement('script');

        fileObject.type  = 'text/javascript';
        fileObject.async = true;
        fileObject.src   = file;

        return fileObject;
    }


    function getLinkElement(file) {
        var fileObject = document.createElement('link');

        fileObject.rel   = 'stylesheet';
        fileObject.async = true;
        fileObject.href  = file;

        return fileObject;
    }


    function addElementToDom(element) {
        console.log(element);

        var headElement  = document.getElementById('head');

        // @todo - Why it is necessary to create a clone element?
        var elementClone = element.cloneNode(true);

        headElement.appendChild(elementClone);

        if (elementClone.addEventListener) {
            elementClone.addEventListener('load', onFileLoaded, false);
        }
        else if (elementClone.attachEvent) {
            elementClone.attachEvent('load', onFileLoaded);
        }
        else {
            elementClone.onreadystatechange = onLoadCondition;
        }

        elementClone.onerror = onError
    }
    

    function onFileLoaded() {
        config.onFileLoaded();
    }


    function onError() {
        config.onError();
    }

    // -------------------------------------------------------------------------------------------------------- Initials

    (init)();

    // --------------------------------------------------------------------------------------------------------- Returns

    return getPublicApi();
}
