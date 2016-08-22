let BaseUtils = {
        bytesToSize(bytes){
            if (bytes == 0) return '0 Byte';
            var i = Math.floor(Math.log(bytes) / Math.log(1024));
            return ( bytes / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
        },

        getFilePath(ancestors) {
            if (ancestors != undefined) {
                let path = ancestors.map((path)=> {
                    return path.name + ' ' + '>' + ' ';
                });
                return path.join('');
            } else {
                return null
            }
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

        setDialogWidth() {
            let width = '100%';
            if(window.innerWidth > 500){
                width = '';
            }
            return width;
        }
};

export default BaseUtils;
