import React from 'react';
import moment from 'moment';
import { Color } from '../theme/customTheme';

let BaseUtils = {

        timeConversion(millisec) {
            let seconds = (millisec / 1000).toFixed(0);
            let minutes = (millisec / (1000 * 60)).toFixed(1);
            let hours = (millisec / (1000 * 60 * 60)).toFixed(1);
            let days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
            if (seconds < 60) return `${seconds} seconds`;
            else if (minutes < 60) return `${minutes} minutes`;
            else if (hours < 24) return `${hours} hours`;
            else return  `${days} days`
        },

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
                    return '/folder/';
                }
                return '/project/';
            };
            return ancestors !== null ? ancestors.map((obj)=>{
                let kind = getKind(obj.kind);
                return <span key={obj.id}><a href={'#'+kind+obj.id} className='external link' style={{fontWeight: 400, color: Color.blue}}>{obj.name}</a><span style={{fontSize: '1.2em', verticalAlign: '-1px'}}> / </span></span>;
            }) : '';
        },

        getUrlPath (parentKind, toNavigator) {
            let urlPath = '';
            if (toNavigator) {
                if (parentKind === 'dds-project') {
                    urlPath = 'navigator/projects/'
                } else {
                    urlPath = 'navigator/folders/'
                }
            } else {
                if (parentKind === 'dds-project') {
                    urlPath = 'project/'
                } else {
                    urlPath = 'folder/'
                }
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
            } else {
                newArray = [ ...array, id ];
            }
            return newArray;
        },

        generateUniqueKey() {
            var i, random;
            var uuid = '';
            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }
            return uuid;
        },

        formatDate(date) {
            date !== null ? date = moment(date).format("MMMM Do, YYYY") : '';
            return date;
        },

        formatLongDate(date) {
            date !== null ? date = moment(date).format("LLL") : '';
            return date;
        },

        toTitleCase(str) {
            return str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
        }
};

export default BaseUtils;
