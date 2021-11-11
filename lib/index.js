const fetchNode = require('node-fetch');

const Caperuza = (function() {

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

    function hasString(str, key) {
        if (isString(str, key) && str.trim() !== "") return true;
        throw new Error(isRequiredText(key));
    }

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

    const FetchProject = function(jsonError = true) {
        this.error = false;
        this.errors = null;
        this.response = null;
        this.jsonError = jsonError;
    }

    FetchProject.prototype.cleanResponse = function() {
        this.error = false;
        this.errors = null;
        this.response = null;
    }

    FetchProject.prototype.errorText = function() {
        return `Error ${this.response.status} - ${this.response.statusText}`;
    }

    FetchProject.prototype.getError = function() {
        let error = "";
        if(Array.isArray(this.errors) && this.errors.length > 0) {
            this.errors.forEach(({ message }) => { error += `${message}`; });
        }
        return error.trim() === "" ? null : error;
    }
    
    FetchProject.prototype.get = async function({ url, headers, data } = {}) {
        this.cleanResponse();
        isString(url, "url");
        let urlFormat = data ? `${url}?${getParams(data)}` : url;
        this.response = await fetchNode(urlFormat, { headers });
        if(this.response.ok) return this.response;
        if(!this.jsonError) throw new Error(this.errorText());
        this.error = true;
        return await this.response.json();
    }
    
    FetchProject.prototype.getJson = async function(info = {}) {
        const response = await this.get(info);
        if(this.error) return response;
        return await this.response.json();
    }
    
    FetchProject.prototype.getBlob = async function(info = {}) {
        const response = await this.get(info);
        if(this.error) return response;
        return await this.response.blob();
    }
    
    FetchProject.prototype.getText = async function(info = {}) {
        const response = await this.get(info);
        if(this.error) return response;
        return await this.response.text();
    }
    
    FetchProject.prototype.getArrayBuffer = async function(info = {}) {
        const response = await this.get(info);
        if(this.error) return response;
        return await this.response.arrayBuffer();
    }
    
    FetchProject.prototype.getFormData = async function(info = {}) {
        const response = await this.get(info);
        if(this.error) return response;
        return await this.response.formData();
    }

    FetchProject.prototype.request = async function({ url, headers, data, method, format } = {}) {
        this.cleanResponse();
        isString(url, "url");
        const opts = { headers, method, body: formatData(data, format) };
        this.response = await fetchNode(url, opts);
        if(this.response.ok) return this.response;
        if(!this.jsonError) throw new Error(this.errorText());
        this.error = true;
        return await this.response.json();
    }

    FetchProject.prototype.post = async function({ url, headers, data, format } = {}) {
        this.cleanResponse();
        isString(url, "url");
        const opts = { headers, body: formatData(data, format), method: POST };
        this.response = await fetchNode(url, opts);
        if(this.response.ok) return this.response;
        if(!this.jsonError) throw new Error(this.errorText());
        this.error = true;
        return await this.response.json();
    }

    FetchProject.prototype.postJson = async function(info = {}) {
        const response = await this.post(info);
        if(this.error) return response;
        return await this.response.json();
    }

    FetchProject.prototype.postBlob = async function(info = {}) {
        const response = await this.post(info);
        if(this.error) return response;
        return await this.response.blob();
    }

    FetchProject.prototype.postText = async function(info = {}) {
        const response = await this.post(info);
        if(this.error) return response;
        return await this.response.text();
    }

    FetchProject.prototype.postArrayBuffer = async function(info = {}) {
        const response = await this.post(info);
        if(this.error) return response;
        return await this.response.arrayBuffer();
    }

    FetchProject.prototype.postFormData = async function(info = {}) {
        const response = await this.post(info);
        if(this.error) return response;
        return await this.response.formData();
    }

    FetchProject.prototype.graphql = async function(obj) {
        try {

            this.cleanResponse();

            hasObject(obj, "I need properties in the object");

            let { url, query, variables = {}, headers = {} } = obj;

            areValidStrings({ url, query });
            areValidObjects({ variables, headers });

            let { data, errors } = await this.postJson({
                url,
                data: { variables, query },
                headers: { ...jsonHeaders, ...headers },
            });
            if(!errors) return data;

            this.errors = errors;
            throw new Error();

        } catch({ message }) {

            let error = this.getError();
            throw new Error(error ? error : message);

        }
    }

    return FetchProject;

})();

module.exports = Object.freeze(Caperuza);