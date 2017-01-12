import React from 'react';

let BaseUtils = {
        bytesToSize(bytes){
            if (bytes == 0) return '0 Byte';
            var i = Math.floor(Math.log(bytes) / Math.log(1024));
            return ( bytes / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
        },

        getFilePath(ancestors) {
            let getKind = (kind) => {
                if(kind === 'dds-file') {
                    return '/file/';
                } else if(kind === 'dds-folder') {
                    return '/folder/'
                }
                return '/project/'
            };
            return ancestors !== null ? ancestors.map((obj)=>{
                let kind = getKind(obj.kind);
                return <a href={'#'+kind+obj.id} key={obj.id} className='external link' style={{fontWeight: 400}}>{obj.name + ' > '}</a>;
            }) : '';
        },

        getUrlPath (parentKind) {
            let urlPath = '';
            if (parentKind === 'dds-project') {
                urlPath = 'project/'
            } else {
                urlPath = 'folder/'
            }
            return urlPath;
        },

        removeObjByKey(array, obj){
            array.some((item, index) => {
                return (array[index][obj.key] === obj.value) ? !!(array.splice(index, 1)) : false;
            });
            return array;
        },

        removeDuplicates(originalArray, prop) {
            var newArray = [];
            var lookupObject  = {};
            for(var i in originalArray) {
                lookupObject[originalArray[i][prop]] = originalArray[i];
            }
            for(i in lookupObject) {
                newArray.push(lookupObject[i]);
            }
            return newArray;
        },

        objectPropInArray(list, prop, val) {
            if (list.length > 0 ) for (let i in list) {if (list[i][prop] === val) {return true;}}
            return false;
        },

        setDialogWidth() {
            let width = '100%';
            if(window.innerWidth > 500){
                width = '';
            }
            return width;
        },

        hasWhiteSpace(s) {
            return /\s/g.test(s);
        },

        validateTemplateName(s) {
            return /^\w+$/.test(s);
        },

        validatePropertyDatatype(v,t) {
            switch (t) {
                case 'number':
                    return /^\d+$/.test(v);
                    break;
                case 'decimal':
                    return /^[-+]?[0-9]+\.[0-9]+$/.test(v);
                    break;
                case 'boolean':
                    return /^(true|false|1|0)$/i.test(v);
                    break;
                case 'text':
                    return true;
                    break;
                case 'date':
                    return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(v);
                    break;
            }
        },

        getTemplatePropertyType(type) {
            let propType = null;
            if(type === 'long') {
                propType = 'number';
            } else if(type === 'double') {
                propType = 'decimal';
            } else if(type === 'string') {
                propType = 'text';
            } else {
                propType = type;
            }
            return propType;
        },

        removeDuplicatesFromArray(array, id){
            let found = array.includes(id);//Array.includes not supported in IE. See polyfills.js
            let newArray = [];
            if (found) {
                newArray = array.filter(x => x !== id);
                //ProjectActions.setIncludedSearchKinds(includeKinds);
            } else {
                newArray = [ ...array, id ];
                //ProjectActions.setIncludedSearchKinds(includeKinds);
            }
            return newArray;
        }
};

export default BaseUtils;
