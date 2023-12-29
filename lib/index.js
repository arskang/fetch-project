const fetchNode = require('node-fetch');

const Fetchuruza = (function() {

    this.debug = false;
    this.cancelToken = undefined;
    this.controllerCancelToken = undefined;

    const GET = "GET";
    const PUT = "PUT";
    const POST = "POST";
    const DELETE = "DELETE";

    const STRING = "string";
    const OBJECT = "object";

    const jsonHeaders = { "Content-Type": "application/json;charset=utf-8" };

    const isRequiredText = (key) => `The ${key} parameter is required`;
    const isRequiredTypeText = (key, txt) => `${isRequiredText(key)} of type ${txt}`;

    function isString(str, key) {
        if(typeof str === STRING) return true;
        throw new Error(isRequiredTypeText(key, STRING));
    }

    // function hasString(str, key) {
    //     if (isString(str, key) && str.trim() !== "") return true;
    //     throw new Error(isRequiredText(key));
    // }

    function areValidStrings(object) {
        isObject(object, "obj");
        for(key in object) { isString(object[key], key); }
    }

    function isObject(obj, key) {
        if(obj && typeof obj === OBJECT && !Array.isArray(obj)) return true;
        throw new Error(isRequiredTypeText(key, OBJECT));
    }

    function areValidObjects(object) {
        isObject(object, "obj");
        for(key in object) { isObject(object[key], key); }
    }
    
    function hasObject(obj, mensaje) {
        if(isObject(obj, "obj") && Object.keys(obj).length > 0) return true;
        throw new Error(mensaje ? mensaje : isRequiredText(key));
    }
    
    function getParams(obj) {
        isObject(obj, "data");
        const params = new URLSearchParams();
        for (let key in obj) { params.append(key, obj[key]); }
        return params;
    }

    function formatData(data, format) {
        switch(format) {
            default: return hasObject(data) ? JSON.stringify(data) : "";
        }
    }

    const FetchProject = function(jsonError) {
        this.error = false;
        this.cancelFetch = false;
        this.errors = null;
        this.response = null;
        this.jsonError = !!jsonError;
    }

    FetchProject.prototype.cleanResponse = function() {
        this.error = false;
        this.cancelFetch = false;
        this.errors = null;
        this.response = null;
    }

    FetchProject.prototype.errorText = function() {
        return `Error ${this.response.status} - ${this.response.statusText}`;
    }

    FetchProject.prototype.getError = function() {
        if(Array.isArray(this.errors) && this.errors.length > 0) {
            return this.errors.reduce((acc, { message }) => (`${acc} ${message}`), "");
        }
        return null;
    }

    FetchProject.prototype.request = async function({
        url, headers, data, params, format, method = GET,
    } = {}, callbackCancel) {
        try {

            this.cleanResponse();
            isString(url, "url");

            const signal = this.cancelToken ? { signal: this.cancelToken } : {};
            if (this.debug) console.debug("signal", signal);

            const urlFormat = params ? `${url}?${getParams(params)}` : url;
            if (this.debug) console.debug("url", urlFormat);

            const body = method === GET ? {} : { body: formatData(data, format) };
            const opts = { headers, method, ...body, ...signal };
            console.debug("options", opts);
            if (this.debug) console.debug("options", opts);

            this.response = await fetchNode(urlFormat, opts);
            if (this.debug) console.debug("response", this.response);

            if(this.response.ok) return this.response;
            if(!this.jsonError) throw new Error(this.errorText());
            this.error = true;
            return await this.response.json();

        } catch({ name, message }) {
            if(name === "AbortError") {
                this.cancelFetch = true;
                this.cleanCancelToken();
                if (callbackCancel && typeof callbackCancel === "function") {
                    callbackCancel(message);
                    return;
                }
            }
            let error = this.getError();
            throw new Error(error || message);
        }
    }
    
    FetchProject.prototype.get = async function({ url, headers, params, data } = {}, callbackCancel) {
        return await this.request({ url, headers, params, data }, callbackCancel);
    }
    
    FetchProject.prototype.getJson = async function(info = {}, callbackCancel) {
        const response = await this.get(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.json();
    }
    
    FetchProject.prototype.getBlob = async function(info = {}, callbackCancel) {
        const response = await this.get(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.blob();
    }
    
    FetchProject.prototype.getText = async function(info = {}, callbackCancel) {
        const response = await this.get(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.text();
    }
    
    FetchProject.prototype.getArrayBuffer = async function(info = {}, callbackCancel) {
        const response = await this.get(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.arrayBuffer();
    }
    
    FetchProject.prototype.getFormData = async function(info = {}, callbackCancel) {
        const response = await this.get(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.formData();
    }

    FetchProject.prototype.post = async function({ url, headers, data, params, format } = {}, callbackCancel) {
        return await this.request({ url, headers, data, format, params, method: POST }, callbackCancel);
    }

    FetchProject.prototype.postJson = async function(info = {}, callbackCancel) {
        const response = await this.post(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.json();
    }

    FetchProject.prototype.postBlob = async function(info = {}, callbackCancel) {
        const response = await this.post(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.blob();
    }

    FetchProject.prototype.postText = async function(info = {}, callbackCancel) {
        const response = await this.post(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.text();
    }

    FetchProject.prototype.postArrayBuffer = async function(info = {}, callbackCancel) {
        const response = await this.post(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.arrayBuffer();
    }

    FetchProject.prototype.postFormData = async function(info = {}, callbackCancel) {
        const response = await this.post(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.formData();
    }

    FetchProject.prototype.put = async function({ url, headers, data, params, format } = {}, callbackCancel) {
        return await this.request({ url, headers, data, format, params, method: PUT }, callbackCancel);
    }

    FetchProject.prototype.putJson = async function(info = {}, callbackCancel) {
        const response = await this.put(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.json();
    }

    FetchProject.prototype.putBlob = async function(info = {}, callbackCancel) {
        const response = await this.put(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.blob();
    }

    FetchProject.prototype.putText = async function(info = {}, callbackCancel) {
        const response = await this.put(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.text();
    }

    FetchProject.prototype.putArrayBuffer = async function(info = {}, callbackCancel) {
        const response = await this.put(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.arrayBuffer();
    }

    FetchProject.prototype.putFormData = async function(info = {}, callbackCancel) {
        const response = await this.put(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.formData();
    }

    FetchProject.prototype.delete = async function({ url, headers, data, params, format } = {}, callbackCancel) {
        return await this.request({ url, headers, data, format, params, method: DELETE }, callbackCancel);
    }

    FetchProject.prototype.deleteJson = async function(info = {}, callbackCancel) {
        const response = await this.delete(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.json();
    }

    FetchProject.prototype.deleteBlob = async function(info = {}, callbackCancel) {
        const response = await this.delete(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.blob();
    }

    FetchProject.prototype.deleteText = async function(info = {}, callbackCancel) {
        const response = await this.delete(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.text();
    }

    FetchProject.prototype.deleteArrayBuffer = async function(info = {}, callbackCancel) {
        const response = await this.delete(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.arrayBuffer();
    }

    FetchProject.prototype.deleteFormData = async function(info = {}, callbackCancel) {
        const response = await this.delete(info, callbackCancel);
        if (this.error || this.cancelFetch) return response;
        return await this.response.formData();
    }

    FetchProject.prototype.graphql = async function(obj, callbackCancel) {
        try {

            this.cleanResponse();

            hasObject(obj, "I need properties in the object");

            const { url, query, variables = {}, headers = {} } = obj;

            areValidStrings({ url, query });
            areValidObjects({ variables, headers });

            const response = await this.postJson({
                url,
                data: { variables, query },
                headers: { ...jsonHeaders, ...headers },
            }, callbackCancel);
            if (!response && callbackCancel) return response;
            const { data, errors } = response;
            if(!errors) return data;

            this.errors = errors;
            throw new Error();

        } catch({ message }) {
            let error = this.getError();
            throw new Error(error || message);
        }
    }

    FetchProject.prototype.activeDebug = function() {
        debug = true;
    }

    FetchProject.prototype.cancelDebug = function() {
        debug = false;
    }

    FetchProject.prototype.setCancelToken = function() {
        const controller = new AbortController();
        const { signal } = controller;
        this.cancelToken = signal;
        this.controllerCancelToken = controller;
    }

    FetchProject.prototype.cleanCancelToken = function() {
        this.cancelToken = undefined;
        this.controllerCancelToken = undefined;
    }

    FetchProject.prototype.cancel = function() {
       if (this.controllerCancelToken) this.controllerCancelToken.abort();
    }

    return FetchProject;

})();

module.exports = Object.freeze(Fetchuruza);