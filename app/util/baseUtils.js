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
                return <a href={'#'+kind+obj.id} key={obj.id} className='external link'>{obj.name + ' > '}</a>;
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

        getTemplatePropertyType(type) {
            let propType = null;
            if(type === 'long') {
                propType = 'number';
            } else if(type === 'double') {
                propType = 'decimal';
            } else {
                propType = type;
            }
            return propType;
        }
};

export default BaseUtils;
