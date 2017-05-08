import {observable} from 'mobx';
import * as fake from "../app/scripts/testData";
import { sleep, respondOK, respond, respondPromiseAll }  from "../app/scripts/util/testUtil";

describe('Main Store', () => {

    const AUTH_PROVIDER_ID = 'AUTH_PROVIDER_ID';
    const EDITED_LABEL = 'EDITED_LABEL';
    const EDITED_NAME = 'EDITED_NAME';
    const EDITED_DESCRIPTION = 'EDITED_DESCRIPTION';
    const PAGE = 2;
    const PROJECT_ID = 'TEST_PROJECT_1';
    const FOLDER_ID = 'TEST_FOLDER_1';
    const FILE_ID = 'TEST_FILE_1';
    const UPLOAD_ID = 'TEST_UPLOAD_1';
    const FILE_VERSION_ID = 'TEST_FILE_VERSION_1';
    const DDS_PROJECT = 'dds-project';
    const DDS_FOLDER = 'dds-folder';
    const DDS_FILE = 'dds-file';
    const FOLDER_PATH = 'folders/';
    const FILE_PATH = 'files/';
    const TEMPLATE_ID = 'TEMPLATE_ID';
    const TEMPLATE_NAME = 'TEMPLATE_1';
    const TEMPLATE_DESCRIPTION = 'TEMPLATE 1 DESCRIPTION';
    const TEMPLATE_LABEL = 'TEMPLATE 1';
    const TEST_USER_NAME = 'TEST USER NAME';
    const TEST_UID = 'TEST01';
    const USER_ROLE = 'USER_ROLE';
    const SEARCH_TEXT = 'TEST FILE 1';
    const STRING = 'STRING';

    let transportLayer = null;
    let mainStore = null;
    let provenanceStore = null;

    beforeEach(() => {
        mainStore = require('../app/scripts/stores/mainStore').default;
        transportLayer = {};
        mainStore.transportLayer = transportLayer;
        mainStore.listItems = [];
    });

    it('@action toggleLoading - should change loading status', () => {
        mainStore.toggleLoading();
        expect(mainStore.loading).toBe(true);
        mainStore.toggleLoading();
        expect(mainStore.loading).toBe(false);
    });

    it('@action toggleTagManager - toggles the tag manager bool', () => {
        mainStore.toggleTagManager();
        expect(mainStore.openTagManager).toBe(true);
        mainStore.toggleTagManager();
        expect(mainStore.openTagManager).toBe(false);
    });
  
    it('@action toggleTagCloud - toggles the tag cloud of recently used tags', () => {
        mainStore.toggleTagCloud();
        expect(mainStore.showTagCloud).toBe(true);
        mainStore.toggleTagCloud();
        expect(mainStore.showTagCloud).toBe(false);
    });

    it('@action toggleUploadManager - toggles the upload manager manager bool', () => {
        mainStore.toggleUploadManager();
        expect(mainStore.openUploadManager).toBe(true);
        mainStore.toggleUploadManager();
        expect(mainStore.openUploadManager).toBe(false);
    });

    it('@action processFilesToUpload - sets accepted and rejected files from dropzone', () => {
        mainStore.processFilesToUpload([FILE_ID], [FOLDER_ID]);
        expect(mainStore.filesToUpload[0]).toBe(FILE_ID);
        expect(mainStore.filesRejectedForUpload[0]).toBe(FOLDER_ID);
    });

    it('@action removeFileFromUploadList - removes a selected file from upload list based on index', () => {
        mainStore.filesToUpload  = [FILE_ID, FOLDER_ID];
        expect(mainStore.filesToUpload.length).toBe(2);
        expect(mainStore.filesToUpload[0]).toBe(FILE_ID);
        mainStore.removeFileFromUploadList(0);
        expect(mainStore.filesToUpload.length).toBe(1);
        expect(mainStore.filesToUpload[0]).toBe(FOLDER_ID);
    });

    it('@action defineTagsToAdd - define tags that will be added', () => {
        mainStore.defineTagsToAdd([FILE_ID,FOLDER_ID]);
        expect(mainStore.tagsToAdd[0]).toBe(FILE_ID);
        expect(mainStore.tagsToAdd[1]).toBe(FOLDER_ID);
    });

    it('@action getTagAutoCompleteList - populate a list of tag labels for the autocomplete', () => {
        transportLayer.getTagAutoCompleteList = jest.fn((text) => respondOK(fake.tag_labels_json));
        mainStore.getTagAutoCompleteList(fake.tag_labels_json.results[0].label);
        return sleep(1).then(() => {
            expect(transportLayer.getTagAutoCompleteList).toHaveBeenCalledTimes(1);
            expect(transportLayer.getTagAutoCompleteList).toHaveBeenCalledWith('&label_contains='+fake.tag_labels_json.results[0].label);
            expect(mainStore.tagAutoCompleteList[0]).toBe(fake.tag_labels_json.results[0].label);
            expect(mainStore.tagAutoCompleteList[2]).toBe(fake.tag_labels_json.results[2].label);
        });
    });

    it('@action getTagLabels - get all recent tag labels', () => {
        transportLayer.getTagLabels = jest.fn(() => respondOK(fake.tag_labels_json));
        mainStore.getTagLabels();
        return sleep(1).then(() => {
            expect(transportLayer.getTagLabels).toHaveBeenCalledTimes(1);
            expect(transportLayer.getTagLabels).toHaveBeenCalledWith();
            expect(mainStore.tagLabels[0].label).toBe(fake.tag_labels_json.results[0].label);
            expect(mainStore.tagLabels[2].label).toBe(fake.tag_labels_json.results[2].label);
        });
    });

    it('@action getTags - get all tags for a file', () => {
        transportLayer.getTags = jest.fn((id, kind) => respondOK(fake.tag_labels_json));
        mainStore.getTags(FILE_ID, DDS_FILE);
        return sleep(1).then(() => {
            expect(transportLayer.getTags).toHaveBeenCalledTimes(1);
            expect(transportLayer.getTags).toHaveBeenCalledWith(FILE_ID, DDS_FILE);
            expect(mainStore.tagLabels[0].label).toBe(fake.tag_labels_json.results[0].label);
            expect(mainStore.tagLabels[2].label).toBe(fake.tag_labels_json.results[2].label);
        });
    });

    it('@action addNewTag - adds a single tag to a file', () => {
        mainStore.toasts = [];
        transportLayer.addNewTag = jest.fn((id, kind, tag) => respondOK(fake.tag_json));
        mainStore.addNewTag(FILE_ID, DDS_FILE, fake.tag_json);
        return sleep(1).then(() => {
            expect(transportLayer.addNewTag).toHaveBeenCalledTimes(1);
            expect(transportLayer.addNewTag).toHaveBeenCalledWith(FILE_ID, DDS_FILE, fake.tag_json);
            it('@action getTags - get all tags for a file', () => {
                transportLayer.getTags = jest.fn((id, kind) => respondOK(fake.tag_labels_json));
                mainStore.getTags(FILE_ID, DDS_FILE);
                return sleep(1).then(() => {
                    expect(transportLayer.getTags).toHaveBeenCalledTimes(1);
                    expect(transportLayer.getTags).toHaveBeenCalledWith(FILE_ID, DDS_FILE);
                    expect(mainStore.toasts.length).toBe(1);
                    expect(mainStore.tagLabels[0].label).toBe(fake.tag_labels_json.results[0].label);
                    expect(mainStore.tagLabels[2].label).toBe(fake.tag_labels_json.results[2].label);
                });
            });
        });
    });

    it('@action appendTags - appends array of tags to a file', () => {
        transportLayer.appendTags = jest.fn((id, kind, tag) => respondOK(fake.tag_labels_json));
        mainStore.appendTags(FILE_ID, DDS_FILE, [fake.tag_json, fake.tag_json]);
        return sleep(1).then(() => {
            expect(transportLayer.appendTags).toHaveBeenCalledTimes(1);
            expect(transportLayer.appendTags).toHaveBeenCalledWith(FILE_ID, DDS_FILE, [fake.tag_json, fake.tag_json]);
            it('@action getTags - get all tags for a file', () => {
                transportLayer.getTags = jest.fn((id, kind) => respondOK(fake.tag_labels_json));
                mainStore.getTags(FILE_ID, DDS_FILE);
                return sleep(1).then(() => {
                    expect(transportLayer.getTags).toHaveBeenCalledTimes(1);
                    expect(transportLayer.getTags).toHaveBeenCalledWith(FILE_ID, DDS_FILE);
                });
            });
        });
    });

    it('@action deleteTag - deletes tag from a file', () => {
        transportLayer.deleteTag = jest.fn((id, label, tag) => respondOK());
        mainStore.deleteTag(fake.tag_json.id);
        return sleep(1).then(() => {
            expect(transportLayer.deleteTag).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteTag).toHaveBeenCalledWith(fake.tag_json.id);
            it('@action getTags - get all tags for a file', () => {
                transportLayer.getTags = jest.fn((id, kind) => respondOK(fake.tag_labels_json));
                mainStore.getTags(FILE_ID, DDS_FILE);
                return sleep(1).then(() => {
                    expect(transportLayer.getTags).toHaveBeenCalledTimes(1);
                    expect(transportLayer.getTags).toHaveBeenCalledWith(FILE_ID, DDS_FILE);
                });
            });
        });
    });

    it('@action deleteTag - deletes tag from a file', () => {
        transportLayer.deleteTag = jest.fn((id, label, tag) => respond(404, 'not found', {}));
        mainStore.deleteTag(fake.tag_json.id);
        return sleep(1).then(() => {
            expect(transportLayer.deleteTag).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteTag).toHaveBeenCalledWith(fake.tag_json.id);
        });
    });

    it('@action addFile - adds new file', () => {
        transportLayer.addFile = jest.fn((uploadId, parentId, parentKind) => respondOK(fake.file_json));
        mainStore.addFile(UPLOAD_ID, PROJECT_ID, DDS_PROJECT);
        return sleep(1).then(() => {
            expect(transportLayer.addFile).toHaveBeenCalledTimes(1);
            expect(transportLayer.addFile).toHaveBeenCalledWith(UPLOAD_ID, PROJECT_ID, DDS_PROJECT);
            it('@action addFileSuccess - adds new file', () => {
                mainStore.addFileSuccess = jest.fn((parentId, parentKind, uploadId, jsonid) => respondOK());
                mainStore.addFileSuccess(PROJECT_ID, DDS_PROJECT, UPLOAD_ID, fake.file_json.id);
                return sleep(1).then(() => {
                    expect(mainStore.addFileSuccess).toHaveBeenCalledTimes(1);
                    expect(mainStore.addFileSuccess).toHaveBeenCalledWith(PROJECT_ID, DDS_PROJECT, UPLOAD_ID, fake.file_json.id);
                });
            });
        });
    });

    it('@action addFileVersion - adds new file version', () => {
        provenanceStore = require('../app/scripts/stores/provenanceStore').default;
        provenanceStore.transportLayer = transportLayer;
        mainStore.entityObj = null;

        transportLayer.addFileVersion = jest.fn((uploadId, label, fileId) => respondOK());
        mainStore.addFileVersion(UPLOAD_ID, EDITED_LABEL, FILE_ID);
        return sleep(1).then(() => {
            expect(transportLayer.addFileVersion).toHaveBeenCalledTimes(1);
            expect(transportLayer.addFileVersion).toHaveBeenCalledWith(UPLOAD_ID, EDITED_LABEL, FILE_ID);
            expect(provenanceStore.showProvAlert).toBe(true);
            expect(mainStore.entityObj).toBeDefined();
        });
    });

    it('@action getFileVersions - gets list of file versions for a file', () => {
        transportLayer.getFileVersions = jest.fn((fileId) => respondOK(fake.file_version_list_json));
        mainStore.getFileVersions(FILE_ID);
        return sleep(1).then(() => {
            expect(transportLayer.getFileVersions).toHaveBeenCalledTimes(1);
            expect(transportLayer.getFileVersions).toHaveBeenCalledWith(FILE_ID);
            expect(mainStore.fileVersions[0].id).toBe(fake.file_version_list_json.results[0].id);
        });
    });

    it('@action uploadError - sets an array of failed uploads that can be retried', () => {
        mainStore.uploads = observable.map();
        mainStore.uploads.set(UPLOAD_ID);
        expect(mainStore.uploads.has(UPLOAD_ID)).toBe(true);
        mainStore.uploadError(UPLOAD_ID, fake.file_json.name, PROJECT_ID);
        expect(mainStore.failedUploads.length).toBe(1);
        expect(mainStore.failedUploads[0].id).toBe(UPLOAD_ID);
        expect(mainStore.uploads.has(UPLOAD_ID)).toBe(false);
        mainStore.failedUploads = [];
    });

    it('@action removeFailedUploads - removes failed uploads', () => {
        mainStore.uploads = observable.map();
        mainStore.uploads.set(UPLOAD_ID);
        expect(mainStore.uploads.has(UPLOAD_ID)).toBe(true);
        mainStore.uploadError(UPLOAD_ID, fake.file_json.name, PROJECT_ID);
        expect(mainStore.failedUploads.length).toBe(1);
        mainStore.removeFailedUploads();
        expect(mainStore.failedUploads.length).toBe(0);
    });

    it('@action cancelUpload - cancels selected upload', () => {
        mainStore.uploads = observable.map();
        mainStore.uploads.set(UPLOAD_ID);
        mainStore.uploads.set(FILE_ID);
        expect(mainStore.uploads.has(UPLOAD_ID)).toBe(true);
        expect(mainStore.uploads.has(FILE_ID)).toBe(true);
        mainStore.cancelUpload(UPLOAD_ID, fake.file_json.name);
        expect(mainStore.uploads.has(UPLOAD_ID)).toBe(false);
        expect(mainStore.uploads.has(FILE_ID)).toBe(true);
    });

    it('@action getDownloadUrl - gets the temporary download url for a file', () => {
        transportLayer.getDownloadUrl = jest.fn((id, kind) => respondOK(fake.download_url_json));
        mainStore.getDownloadUrl(FILE_ID, DDS_FILE);
        return sleep(1).then((json) => {
            expect(transportLayer.getDownloadUrl).toHaveBeenCalledTimes(1);
            expect(transportLayer.getDownloadUrl).toHaveBeenCalledWith(FILE_ID, DDS_FILE);
        });
    });

    it('@action getDownloadUrl ERROR - file can not be found', () => {
        transportLayer.getDownloadUrl = jest.fn((id, kind) => respond(404, 'not found', {}));
        mainStore.getDownloadUrl(FILE_ID, DDS_FILE);
        return sleep(1).then(() => {
            expect(transportLayer.getDownloadUrl).toHaveBeenCalledTimes(1);
            expect(transportLayer.getDownloadUrl).toHaveBeenCalledWith(FILE_ID, DDS_FILE);
        });
    });

    it('@action getUser - gets current user details', () => {
        expect(mainStore.currentUser).toEqual({});
        transportLayer.getUser = jest.fn((id) => respondOK(fake.user_json));
        mainStore.getUser();
        return sleep(1).then(() => {
            expect(transportLayer.getUser).toHaveBeenCalledTimes(1);
            expect(transportLayer.getUser).toHaveBeenCalledWith();
        });
    });

    it('@action getPermissions - gets current user project permissions', () => {
        transportLayer.getPermissions = jest.fn((id, userId) => respondOK(fake.grant_project_permission_json));
        mainStore.getPermissions(PROJECT_ID, TEST_UID);
        return sleep(1).then(() => {
            expect(transportLayer.getPermissions).toHaveBeenCalledTimes(1);
            expect(transportLayer.getPermissions).toHaveBeenCalledWith(PROJECT_ID, TEST_UID);
            expect(mainStore.projectRole).toBe('project_admin');
            expect(mainStore.projPermissions).toBe('prjCrud');
        });
    });

    it('@action searchFiles - populates an autocomplete list with file names', () => {
        transportLayer.searchFiles = jest.fn((text, id) => respondOK(fake.list_items_json));
        mainStore.searchFiles(SEARCH_TEXT, PROJECT_ID);
        expect(mainStore.autoCompleteLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.searchFiles).toHaveBeenCalledTimes(1);
            expect(transportLayer.searchFiles).toHaveBeenCalledWith(SEARCH_TEXT, PROJECT_ID);
            expect(mainStore.searchFilesList.length).toBe(1);
            expect(mainStore.searchFilesList[0].name).toBe(SEARCH_TEXT);
            expect(mainStore.autoCompleteLoading).toBe(false);
        });
    });

    it('@action loadMetadataTemplates - loads a list of metadata templates and sorts by most recent', () => {
        transportLayer.loadMetadataTemplates = jest.fn((text) => respondOK(fake.metadata_templates_json));
        mainStore.loadMetadataTemplates(SEARCH_TEXT);
        return sleep(1).then(() => {
            expect(transportLayer.loadMetadataTemplates).toHaveBeenCalledTimes(1);
            expect(transportLayer.loadMetadataTemplates).toHaveBeenCalledWith('?name_contains='+SEARCH_TEXT);
            expect(mainStore.metaTemplates.length).toBe(2);
            //test sorting by date
            expect(mainStore.metaTemplates[0].id).toBe('TEMPLATE_2');
            expect(mainStore.metaTemplates[1].id).toBe(TEMPLATE_ID);
        });
    });

    it('@action createMetadataTemplate - creates a new metadata template', () => {
        transportLayer.createMetadataTemplate = jest.fn((name, label, desc) => respondOK(fake.metadata_templates_json.results[1]));
        mainStore.createMetadataTemplate(fake.metadata_templates_json.results[1].name, fake.metadata_templates_json.results[1].label, fake.metadata_templates_json.results[1].description);
        expect(mainStore.drawerLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.createMetadataTemplate).toHaveBeenCalledTimes(1);
            expect(transportLayer.createMetadataTemplate).toHaveBeenCalledWith(fake.metadata_templates_json.results[1].name, fake.metadata_templates_json.results[1].label, fake.metadata_templates_json.results[1].description);
            expect(mainStore.metadataTemplate.id).toBe(fake.metadata_templates_json.results[1].id);
            //Test that template was added to the beginning of the array
            expect(mainStore.metaTemplates[0].id).toBe(fake.metadata_templates_json.results[1].id);
            expect(mainStore.showTemplateCreator).toBe(false);
            expect(mainStore.showTemplateDetails).toBe(true);
            expect(mainStore.drawerLoading).toBe(false);
        });
    });

    it('@action getMetadataTemplateDetails - gets metadata template details', () => {
        transportLayer.getMetadataTemplateDetails = jest.fn((id) => respondOK(fake.metadata_templates_json.results[1]));
        mainStore.getMetadataTemplateDetails(fake.metadata_templates_json.results[1].id);
        expect(mainStore.drawerLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.getMetadataTemplateDetails).toHaveBeenCalledTimes(1);
            expect(transportLayer.getMetadataTemplateDetails).toHaveBeenCalledWith(fake.metadata_templates_json.results[1].id);
            expect(mainStore.metadataTemplate.id).toBe(fake.metadata_templates_json.results[1].id);
            expect(mainStore.openMetadataManager).toBe(true);
            expect(mainStore.showTemplateCreator).toBe(false);
            expect(mainStore.showTemplateDetails).toBe(true);
            expect(mainStore.drawerLoading).toBe(false);
        });
    });

    it('@action getMetadataTemplateProperties - gets metadata template properties', () => {
        transportLayer.getMetadataTemplateProperties = jest.fn((id) => respondOK(fake.template_properties_json));
        mainStore.getMetadataTemplateProperties(fake.metadata_templates_json.results[0].id);
        expect(mainStore.drawerLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.getMetadataTemplateProperties).toHaveBeenCalledTimes(1);
            expect(transportLayer.getMetadataTemplateProperties).toHaveBeenCalledWith(fake.metadata_templates_json.results[0].id);
            expect(mainStore.templateProperties[0].id).toBe(fake.template_properties_json.results[0].id);
            expect(mainStore.templateProperties[0].name).toBe(fake.template_properties_json.results[0].name);
            expect(mainStore.drawerLoading).toBe(false);
        });
    });

    it('@action updateMetadataTemplate - updates label and description of metadata template', () => {
        transportLayer.updateMetadataTemplate = jest.fn((id, name, label, desc) => respondOK(fake.edited_metadata_templates_json));
        mainStore.updateMetadataTemplate(fake.edited_metadata_templates_json.id, fake.edited_metadata_templates_json.name, fake.edited_metadata_templates_json.label, fake.edited_metadata_templates_json.description);
        expect(mainStore.drawerLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.updateMetadataTemplate).toHaveBeenCalledTimes(1);
            expect(transportLayer.updateMetadataTemplate).toHaveBeenCalledWith(fake.edited_metadata_templates_json.id, fake.edited_metadata_templates_json.name, fake.edited_metadata_templates_json.label, fake.edited_metadata_templates_json.description);
            expect(mainStore.metadataTemplate.id).toBe(fake.edited_metadata_templates_json.id);
            expect(mainStore.metadataTemplate.name).toBe(fake.edited_metadata_templates_json.name);
            expect(mainStore.showTemplateCreator).toBe(false);
            expect(mainStore.showTemplateDetails).toBe(true);
            expect(mainStore.drawerLoading).toBe(false);
        });
    });

    it('@action deleteTemplate - deletes metadata template', () => {
        transportLayer.deleteTemplate = jest.fn((id) => respondOK());
        mainStore.deleteTemplate(fake.edited_metadata_templates_json.id);
        return sleep(1).then(() => {
            expect(transportLayer.deleteTemplate).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteTemplate).toHaveBeenCalledWith(fake.edited_metadata_templates_json.id);
            expect(mainStore.metadataTemplate.id).toBe(fake.edited_metadata_templates_json.id);
            expect(mainStore.templateProperties.length).toBe(0);
            expect(mainStore.openMetadataManager).toBe(false);
            expect(mainStore.showPropertyCreator).toBe(false);
            expect(mainStore.showTemplateCreator).toBe(true);
            expect(mainStore.showTemplateDetails).toBe(false);
        });
    });

    it('@action deleteMetadataProperty - deletes metadata property', () => {
        mainStore.toasts = [];
        mainStore.templateProperties = fake.template_properties_json.results;
        expect(mainStore.templateProperties.length).toBe(1);
        transportLayer.deleteMetadataProperty = jest.fn((id) => respondOK());
        mainStore.deleteMetadataProperty(fake.template_property_json.id, EDITED_LABEL);
        return sleep(1).then(() => {
            expect(mainStore.toasts[0].msg).toBe('The '+EDITED_LABEL+' property has been deleted');
            expect(transportLayer.deleteMetadataProperty).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteMetadataProperty).toHaveBeenCalledWith(fake.template_property_json.id);
            expect(mainStore.metadataTemplate.id).toBe(fake.edited_metadata_templates_json.id);
            expect(mainStore.templateProperties.length).toBe(0);
        });
    });

    it('@action deleteMetadataProperty ERROR FORBIDDEN- fails to delete metadata property', () => {
        mainStore.errorModals = [];
        transportLayer.deleteMetadataProperty = jest.fn((id) => respond(403, 'forbidden', {}));
        mainStore.deleteMetadataProperty(fake.template_property_json.id, EDITED_LABEL);
        return sleep(1).then(() => {
            expect(transportLayer.deleteMetadataProperty).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteMetadataProperty).toHaveBeenCalledWith(fake.template_property_json.id);
            expect(mainStore.errorModals.length).toBe(1);
        });
    });

    it('@action createMetadataObject - creates a new metadata object for a file', () => {
        transportLayer.createMetadataObject = jest.fn((kind, fileId, templateId, properties) => respondOK(fake.metadata_object_json));
        mainStore.createMetadataObject(DDS_FILE, FILE_ID, TEMPLATE_ID, fake.template_properties_json.results);
        expect(mainStore.drawerLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.createMetadataObject).toHaveBeenCalledTimes(1);
            expect(transportLayer.createMetadataObject).toHaveBeenCalledWith(DDS_FILE, FILE_ID, TEMPLATE_ID, fake.template_properties_json.results);
            expect(mainStore.metadataTemplate.id).toBe(fake.metadata_templates_json.results[1].id);
        });
    });

    it('@action createMetadataObject ERROR 409 Already exists - Should still run but will call updateMetadataObject instead', () => {
        transportLayer.createMetadataObject = jest.fn((kind, fileId, templateId, properties) => respond(409, 'conflict', fake.metadata_object_json));
        mainStore.createMetadataObject(DDS_FILE, FILE_ID, TEMPLATE_ID, fake.template_properties_json.results);
        expect(mainStore.drawerLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.createMetadataObject).toHaveBeenCalledTimes(1);
            expect(transportLayer.createMetadataObject).toHaveBeenCalledWith(DDS_FILE, FILE_ID, TEMPLATE_ID, fake.template_properties_json.results);
            expect(mainStore.metadataTemplate.id).toBe(fake.metadata_templates_json.results[1].id);
        });
    });

    it('@action updateMetadataObject - updates an existing metadata object for a file', () => {
        transportLayer.updateMetadataObject = jest.fn((kind, fileId, templateId, properties) => respondOK(fake.metadata_object_json));
        mainStore.updateMetadataObject(DDS_FILE, FILE_ID, TEMPLATE_ID, fake.template_properties_json.results);
        return sleep(1).then(() => {
            expect(transportLayer.updateMetadataObject).toHaveBeenCalledTimes(1);
            expect(transportLayer.updateMetadataObject).toHaveBeenCalledWith(DDS_FILE, FILE_ID, TEMPLATE_ID, fake.template_properties_json.results);
            expect(mainStore.metadataTemplate.id).toBe(fake.metadata_templates_json.results[1].id);
        });
    });

    it('@action createMetadataObjectSuccess - creates a new metadata object for a file', () => {
        mainStore.objectMetadata = [];
        mainStore.createMetadataObjectSuccess(FILE_ID, DDS_FILE, fake.metadata_object_json);
        expect(mainStore.drawerLoading).toBe(false);
        expect(mainStore.showBatchOps).toBe(false);
        expect(mainStore.showTemplateDetails).toBe(false);
        expect(mainStore.objectMetadata.length).toBe(1);
    });

    it('@action createMetadataProperty - creates a new metadata property for a template', () => {
        mainStore.templateProperties = [];
        transportLayer.createMetadataProperty = jest.fn((id, name, label, desc, type) => respondOK(fake.template_property_json));
        mainStore.createMetadataProperty(TEMPLATE_ID, TEMPLATE_NAME, TEMPLATE_LABEL, TEMPLATE_DESCRIPTION, STRING);
        return sleep(1).then(() => {
            expect(transportLayer.createMetadataProperty).toHaveBeenCalledTimes(1);
            expect(transportLayer.createMetadataProperty).toHaveBeenCalledWith(TEMPLATE_ID, TEMPLATE_NAME, TEMPLATE_LABEL, TEMPLATE_DESCRIPTION, STRING);
            expect(mainStore.templateProperties.length).toBe(1);
            expect(mainStore.templateProperties[0].template.id).toBe(TEMPLATE_ID);
        });
    });

    it('@action createMetaPropsList - creates a list of metadata properties', () => {
        mainStore.metaProps = [];
        mainStore.createMetaPropsList(fake.template_properties_json.results);
        expect(mainStore.metaProps[0].label).toBe(TEMPLATE_LABEL);
    });

    it('@action showTemplatePropManager - toggles the template property manager', () => {
        mainStore.showPropertyCreator = false;
        mainStore.showTemplateCreator = true;
        mainStore.showTemplateDetails = true;
        mainStore.showTemplatePropManager();
        expect(mainStore.showPropertyCreator).toBe(true);
        expect(mainStore.showTemplateCreator).toBe(false);
        expect(mainStore.showTemplateDetails).toBe(false);
    });

    it('@action showMetadataTemplateList - toggles off the template details list', () => {
        mainStore.showTemplateDetails = true;
        mainStore.showMetadataTemplateList();
        expect(mainStore.showTemplateDetails).toBe(false);
    });

    it('@action toggleMetadataManager - toggles the metadata manager', () => {
        mainStore.templateProperties = [];
        mainStore.templateProperties.push(fake.template_property_json);
        mainStore.showPropertyCreator = true;
        mainStore.showTemplateCreator = false;
        mainStore.showTemplateDetails = true;
        expect(mainStore.templateProperties.length).toBe(1);
        mainStore.toggleMetadataManager();
        expect(mainStore.templateProperties.length).toBe(0);
        expect(mainStore.showPropertyCreator).toBe(false);
        expect(mainStore.showTemplateCreator).toBe(true);
        expect(mainStore.showTemplateDetails).toBe(false);
    });

    it('@action showMetaDataTemplateDetails - shows the template details', () => {
        mainStore.showMetaDataTemplateDetails();
        expect(mainStore.showPropertyCreator).toBe(false);
        expect(mainStore.showTemplateCreator).toBe(false);
        expect(mainStore.showTemplateDetails).toBe(true);
    });

    // it('@action searchObjects - searches files and folders', () => {
    //  Todo: This service is being rebuilt. Implement tests after new service is in place
    // });

    it('@action toggleSearch - toggles search field', () => {
        mainStore.toggleSearch();
        expect(mainStore.searchValue).toBeNull();
        expect(mainStore.showSearch).toBe(true);
        mainStore.toggleSearch();
        expect(mainStore.showSearch).toBe(false);
    });

    //Todo: These methods may not be used with the new search service. Write tests after new service is implemented.
    // @action setIncludedSearchKinds(includeKinds) {
    //     this.includeKinds = includeKinds;
    //     this.searchObjects(this.searchValue, this.includeKinds, this.searchFilters);
    // }
    //
    // @action setIncludedSearchProjects(includeProjects) {
    //     this.includeProjects = includeProjects;
    //     this.setSearchFilters();
    // }
    //
    // @action setSearchFilters() {
    //     this.searchFilters = [];
    //     this.includeProjects.forEach((projectId) => {this.searchFilters.push({"match":{"project.id": projectId}})});
    //     this.searchObjects(this.searchValue, this.includeKinds, this.searchFilters);
    // }
    //
    // @action clearSearchFilesData() {
    //     this.searchFilesList = [];
    //}
    // Todo: ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    it('@action toggleModals - toggles a modal', () => {
        mainStore.toggleModals(fake.modal_json.id);
        expect(mainStore.toggleModal.open).toBe(true);
        mainStore.toggleModals(fake.modal_json.id);
        expect(mainStore.toggleModal.open).toBe(false);
    });

    it('@action toggleSearchFilters - toggles search filters', () => {
        mainStore.toggleSearchFilters();
        expect(mainStore.showFilters).toBe(true);
        mainStore.toggleSearchFilters();
        expect(mainStore.showFilters).toBe(false);
    });

    it('@action displayErrorModals - creates an array of errors to be displayed as modals', () => {
        mainStore.errorModals = [];
        mainStore.displayErrorModals(fake.error_json);
        mainStore.displayErrorModals(fake.special_error_json);
        expect(mainStore.errorModals.length).toBe(2);
        expect(mainStore.errorModals[0].response).toBe(503);
        expect(mainStore.errorModals[1].response).toBe('Folders can not be uploaded through the web portal.');
    });

    it('@action toggleUserInfoPanel - toggles user info panel', () => {
        expect(mainStore.showUserInfoPanel).toBe(false);
        mainStore.toggleUserInfoPanel();
        expect(mainStore.showUserInfoPanel).toBe(true);
        mainStore.toggleUserInfoPanel();
        expect(mainStore.showUserInfoPanel).toBe(false);
    });

    it('@action getDeviceType - sets users device type', () => {
        mainStore.getDeviceType(fake.device_type_json);
        expect(mainStore.device.android).toBe(false);
        expect(mainStore.device.ipad).toBe(false);
        expect(mainStore.device.iphone).toBe(false);
    });

    it('@action getScreenSize - gets screen height and width', () => {
        mainStore.getScreenSize(900, 1080);
        expect(mainStore.screenSize).not.toBeNull();
        expect(mainStore.screenSize.height).toBe(900);
        expect(mainStore.screenSize.width).toBe(1080);
    });

    it('@action addToast - adds toast to display', () => {
        mainStore.toasts = [];
        mainStore.addToast('TOAST_MSG');
        expect(mainStore.toasts.length).toBe(1);
        expect(mainStore.toasts[0].ref).not.toBeNull();
        mainStore.addToast('TOAST_MSG');
        expect(mainStore.toasts.length).toBe(2);
    });

    it('@action handleBatch - sets itemsSelected to all checked items in listItem view. Sets checked folders and files to array of IDs', () => {
        mainStore.handleBatch([FILE_ID], [FOLDER_ID]);
        expect(mainStore.filesChecked.length).toBe(1);
        expect(mainStore.foldersChecked.length).toBe(1);
        expect(mainStore.filesChecked[0]).toBe(FILE_ID);
        expect(mainStore.foldersChecked[0]).toBe(FOLDER_ID);
        expect(mainStore.itemsSelected).toBe(2);
    });

    it('@action clearSelectedItems - should clear checked list items', () => {
        mainStore.filesChecked = [FILE_ID];
        mainStore.foldersChecked = [FOLDER_ID];
        expect(mainStore.filesChecked.length).toBe(1);
        expect(mainStore.foldersChecked.length).toBe(1);
        mainStore.clearSelectedItems();
        expect(mainStore.filesChecked.length).toBe(0);
        expect(mainStore.foldersChecked.length).toBe(0);
    });

    it('@action getUsageDetails - initially should return account usage details', () => {
        transportLayer.getUsageDetails = jest.fn((page) => respondOK(fake.usage_json));
        mainStore.getUsageDetails();
        return sleep(1).then(() => {
            expect(mainStore.usage).toEqual(fake.usage_json);
            expect(transportLayer.getUsageDetails).toHaveBeenCalledTimes(1);
        });
    });

    it('@action getProjectMembers - should return list of project members', () => {
        transportLayer.getProjectMembers = jest.fn((ID) => respondOK(fake.project_members_json));
        mainStore.getProjectMembers(PROJECT_ID);
        expect(transportLayer.getProjectMembers).toBeCalledWith(PROJECT_ID);
        return sleep(1).then(() => {
            expect(mainStore.projectMembers.length).toBe(1);
            expect(mainStore.projectMembers[0].project.id).toBe(PROJECT_ID);
            expect(mainStore.projectMembers[0].user.full_name).toBe(TEST_USER_NAME);
        });
    });

    it('@action getProjects - initially should return an empty list of projects', () => {
        transportLayer.getProjects = jest.fn((page) => respondOK([]));
        mainStore.getProjects(PAGE);
        return sleep(1).then(() => {
            expect(transportLayer.getProjects).toHaveBeenCalledTimes(1);
            expect(transportLayer.getProjects.mock.calls[0][0]).toBe(PAGE);
            expect(mainStore.projects.length).toBe(0);
        });
    });

    it('@action addProject - should add a project', () => {
        transportLayer.addProject = jest.fn((name, description) => respondOK(fake.projects_json[0].results[0]));
        mainStore.addProject(fake.projects_json[0].results[0].name, fake.projects_json[0].results[0].description);
        expect(mainStore.loading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.addProject).toHaveBeenCalledTimes(1);
            expect(mainStore.loading).toBe(false);
            expect(mainStore.projects.length).toBe(1);
            expect(mainStore.projects[0].id).toBe('TEST_PROJECT_1');
        });
    });

    it('@action editProject - should change the project name and description', () => {
        transportLayer.editProject = jest.fn((PROJECT_ID, name, description) => respondOK(fake.project_edit_json));
        mainStore.editProject(PROJECT_ID, EDITED_NAME, EDITED_DESCRIPTION);
        return sleep(1).then(() => {
            expect(transportLayer.editProject).toHaveBeenCalledTimes(1);
            expect(transportLayer.editProject).toBeCalledWith(PROJECT_ID, EDITED_NAME, EDITED_DESCRIPTION);
            expect(mainStore.project.name).toBe('EDITED_NAME');
            expect(mainStore.project.description).toBe('EDITED_DESCRIPTION');
            expect(mainStore.project.id).toBe('TEST_PROJECT_1');
        });
    });

    it('@action deleteProject - should remove a project', () => {
        mainStore.projects = fake.projects_json[0].results;
        expect(mainStore.projects.length).toBe(2);
        transportLayer.deleteProject = jest.fn((PROJECT_ID) => respondOK());
        mainStore.deleteProject(PROJECT_ID);
        return sleep(1).then(() => {
            expect(transportLayer.deleteProject).toHaveBeenCalledTimes(1);
            expect(mainStore.projects.length).toBe(1);
        });
    });

    it('@action deleteProject - should throw 404 error', () => {
        mainStore.error = null;
        mainStore.projects = fake.projects_json[0].results;
        expect(mainStore.projects.length).toBe(2);
        transportLayer.deleteProject = jest.fn((PROJECT_ID) => respond(404, 'not found', fake.error_404));
        mainStore.deleteProject(PROJECT_ID);
        return sleep(1).then(() => {
            expect(transportLayer.deleteProject).toHaveBeenCalledTimes(1);
            expect(mainStore.projects.length).toBe(2);
            expect(mainStore.error).toBeDefined();
        });
    });

    it('@action addFolder - should add a folder', () => {
        transportLayer.addFolder = jest.fn((id, parentKind, name) => respondOK(fake.folder_json));
        mainStore.addFolder(PROJECT_ID, DDS_PROJECT, fake.folder_json.name);
        expect(mainStore.loading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.addFolder).toBeCalledWith(PROJECT_ID, DDS_PROJECT, fake.folder_json.name);
            expect(transportLayer.addFolder).toHaveBeenCalledTimes(1);
            expect(mainStore.loading).toBe(false);
            expect(mainStore.listItems.length).toBe(1);
            expect(mainStore.listItems[0].id).toBe('TEST_FOLDER_1');
        });
    });

    it('@action deleteFolder - should delete the folder', () => {
        mainStore.listItems.push(fake.folder_json);
        expect(mainStore.listItems.length).toBe(1);
        transportLayer.deleteFolder = jest.fn((FOLDER_ID) => respondOK([]));
        mainStore.deleteFolder(FOLDER_ID);
        return sleep(1).then(() => {
            expect(transportLayer.deleteFolder).toBeCalledWith(FOLDER_ID);
            expect(transportLayer.deleteFolder).toHaveBeenCalledTimes(1);
            expect(mainStore.listItems.length).toBe(0);
        });
    });

    it('@action deleteFile - should delete the file', () => {
        mainStore.listItems.push(fake.file_json);
        expect(mainStore.listItems.length).toBe(1);
        transportLayer.deleteFile = jest.fn((FILE_ID) => respondOK([]));
        mainStore.deleteFile(FILE_ID);
        return sleep(1).then(() => {
            expect(transportLayer.deleteFile).toBeCalledWith(FILE_ID);
            expect(transportLayer.deleteFile).toHaveBeenCalledTimes(1);
            expect(mainStore.listItems.length).toBe(0);
        });
    });

    it('@action batchDeleteItems - should delete all selected items', () => { // Todo: get this test to run
        mainStore.listItems = fake.list_items_json.results;
        mainStore.filesChecked = [FILE_ID];
        mainStore.foldersChecked = [FOLDER_ID];
        expect(mainStore.listItems.length).toBe(2);
        for (let i = 0; i < mainStore.filesChecked.length; i++) {
            it('@action deleteFile - should delete the file', () => {
                transportLayer.deleteFile = jest.fn((FILE_ID) => respondOK([]));
                mainStore.deleteFile(FILE_ID);
                return sleep(1).then(() => {
                    expect(transportLayer.deleteFile).toBeCalledWith(FILE_ID);
                    expect(transportLayer.deleteFile).toHaveBeenCalledTimes(1);
                });
            });
        }
        for (let i = 0; i < mainStore.foldersChecked.length; i++) {
            it('@action deleteFolder - should delete the folder', () => {
                transportLayer.deleteFolder = jest.fn((FOLDER_ID) => respondOK([]));
                mainStore.deleteFolder(FOLDER_ID);
                return sleep(1).then(() => {
                    expect(transportLayer.deleteFolder).toBeCalledWith(FOLDER_ID);
                    expect(transportLayer.deleteFolder).toHaveBeenCalledTimes(1);
                });
            });
        }
        mainStore.handleBatch([],[]);
        return sleep(1).then(() => {
            expect(mainStore.filesChecked.length).toBe(0);
            expect(mainStore.foldersChecked.length).toBe(0);
        });
    });

    it('@action editItem - should edit a file or folder name', () => {
        mainStore.listItems = [fake.folder_json];
        expect(mainStore.listItems.length).toBe(1);
        transportLayer.editItem = jest.fn((id, name, path) => respondOK(fake.item_edit_json));
        mainStore.editItem(FOLDER_ID, EDITED_NAME, EDITED_DESCRIPTION);
        return sleep(1).then(() => {
            expect(transportLayer.editItem).toHaveBeenCalledTimes(1);
            expect(transportLayer.editItem).toBeCalledWith(FOLDER_ID, EDITED_NAME, EDITED_DESCRIPTION);
            expect(mainStore.listItems[0].name).toBe(EDITED_NAME);
            expect(mainStore.listItems[0].description).toBe(EDITED_DESCRIPTION);
            expect(mainStore.listItems[0].id).toBe(FOLDER_ID);
        });
    });

    it('@action editVersionLabel - should edit version label', () => {
        transportLayer.editVersionLabel = jest.fn((id, label) => respondOK(fake.file_json));
        mainStore.editVersionLabel(FILE_ID, EDITED_LABEL);
        return sleep(1).then(() => {
            expect(transportLayer.editVersionLabel).toHaveBeenCalledTimes(1);
            expect(transportLayer.editVersionLabel).toBeCalledWith(FILE_ID, EDITED_LABEL);
            expect(mainStore.entityObj.current_version.label).toBe(EDITED_LABEL);
            expect(mainStore.entityObj.id).toBe(FILE_ID);
            mainStore.entityObj = {};
        });
    });

    it('@action deleteVersion - should delete the file version', () => {
        mainStore.entityObj = fake.file_version_json;
        expect(mainStore.entityObj.id).toBe(FILE_VERSION_ID);
        transportLayer.deleteVersion = jest.fn((FILE_VERSION_ID) => respondOK([]));
        mainStore.deleteVersion(FILE_VERSION_ID);
        return sleep(1).then(() => {
            expect(transportLayer.deleteVersion).toBeCalledWith(FILE_VERSION_ID);
            expect(transportLayer.deleteVersion).toHaveBeenCalledTimes(1);
            mainStore.entityObj = {};
        });
    });

    it('@action getChildren - gets a list of folder or project children', () => {
        mainStore.listItems = fake.list_items_json.results;
        expect(mainStore.listItems.length).toBe(2);
        transportLayer.getChildren = jest.fn(() => respond(201, 'ok', fake.list_item_response_json));
        mainStore.getChildren(FOLDER_ID, FOLDER_PATH, PAGE);
        expect(mainStore.listItems.length).toBe(2);
        return sleep(1).then(() => {
            expect(transportLayer.getChildren).toHaveBeenCalledTimes(1);
            expect(transportLayer.getChildren).toHaveBeenCalledWith(FOLDER_ID, FOLDER_PATH, PAGE);
        });
    });

    it('@action getMoveItemList - should return a list of items', () => {
        transportLayer.getMoveItemList = jest.fn((id, path) => respondOK(fake.list_items_json));
        mainStore.getMoveItemList(FOLDER_ID, FOLDER_PATH);
        expect(mainStore.moveItemLoading).toBe(true)
        return sleep(1).then(() => {
            expect(transportLayer.getMoveItemList).toHaveBeenCalledTimes(1);
            expect(transportLayer.getMoveItemList).toHaveBeenCalledWith(FOLDER_ID, FOLDER_PATH);
            expect(mainStore.moveItemList.length).toBe(2);
            expect(mainStore.moveItemLoading).toBe(false)
        });
    });

    it('@action selectMoveLocation - set the location where an item will be moved', () => {
        mainStore.selectMoveLocation(FOLDER_ID, DDS_FOLDER);
        expect(mainStore.destination).toBe(FOLDER_ID);
        expect(mainStore.destinationKind).toBe(DDS_FOLDER);
    });

    it('@action moveItem - should move an item to another location and remove item from current list', () => {
        mainStore.isListItem = true;
        mainStore.listItems = fake.list_items_json.results;
        expect(mainStore.listItems.length).toBe(2);
        transportLayer.moveItem = jest.fn((id, kind, destination, destinationKind) => respondOK(fake.file_json));
        mainStore.moveItem(FILE_ID, DDS_FILE, FOLDER_ID, DDS_FOLDER);
        expect(mainStore.loading).toBe(true)
        return sleep(1).then(() => {
            expect(transportLayer.moveItem).toHaveBeenCalledTimes(1);
            expect(transportLayer.moveItem).toHaveBeenCalledWith(FILE_ID, FILE_PATH, FOLDER_ID, DDS_FOLDER);
            expect(mainStore.listItems.length).toBe(1);
            expect(mainStore.loading).toBe(false)
        });
    });

    it('@action getEntity - should return a file or folder object', () => {
        transportLayer.getEntity = jest.fn((id, path, requester) => respondOK(fake.file_json));
        mainStore.getEntity(FILE_ID, FILE_PATH, undefined);
        return sleep(1).then(() => {
            expect(transportLayer.getEntity).toHaveBeenCalledTimes(1);
            expect(transportLayer.getEntity).toHaveBeenCalledWith(FILE_ID, FILE_PATH);
            expect(mainStore.entityObj.id).toBe(FILE_ID);
        });
    });

    it('@action setSelectedEntity - should return a file or folder object', () => {
        transportLayer.setSelectedEntity = jest.fn((id, path) => respondOK(fake.file_json));
        mainStore.setSelectedEntity(FILE_ID, FILE_PATH);
        return sleep(1).then(() => {
            expect(transportLayer.setSelectedEntity).toHaveBeenCalledTimes(1);
            expect(transportLayer.setSelectedEntity).toHaveBeenCalledWith(FILE_ID, FILE_PATH);
            expect(mainStore.selectedEntity.id).toBe(FILE_ID);
        });
    });

    it('@action setSelectedEntity - should return `null` because no ID was provided', () => {
        transportLayer.setSelectedEntity = jest.fn((id, path) => respondOK(fake.file_json));
        mainStore.setSelectedEntity(null, FILE_PATH);
        return sleep(1).then(() => {
            expect(transportLayer.setSelectedEntity).toHaveBeenCalledTimes(0);
            expect(mainStore.selectedEntity).toBeNull();
        });
    });

    it('@action setSelectedEntity - should return a file or folder object and set isListItem to true', () => {
        mainStore.isListItem = false;
        expect(mainStore.isListItem).toBe(false);
        transportLayer.setSelectedEntity = jest.fn((id, path) => respondOK(fake.file_json));
        mainStore.setSelectedEntity(FILE_ID, FILE_PATH, true);
        return sleep(1).then(() => {
            expect(transportLayer.setSelectedEntity).toHaveBeenCalledTimes(1);
            expect(mainStore.selectedEntity.id).toBe(FILE_ID);
            expect(mainStore.isListItem).toBe(true);
        });
    });

    it('@action getObjectMetadata - should return object metadata and all metadata object properties for file', () => {
        transportLayer.getObjectMetadata = jest.fn((id, kind) => respondOK(fake.object_metadata_json));
        mainStore.getObjectMetadata(FILE_ID, DDS_FILE);
        return sleep(1).then(() => {
            expect(transportLayer.getObjectMetadata).toHaveBeenCalledTimes(1);
            expect(transportLayer.getObjectMetadata).toHaveBeenCalledWith(FILE_ID, DDS_FILE);
            expect(mainStore.objectMetadata.length).toBe(1);
            expect(mainStore.objectMetadata[0].object.kind).toBe(DDS_FILE);
            expect(mainStore.objectMetadata[0].template.id).toBe(TEMPLATE_ID);
            expect(mainStore.objectMetadata[0]).toHaveProperty('properties');
            expect(mainStore.metaObjProps[0][0].key).toBe('TEST_TEMPLATE_PROPERTY_KEY_1');
            expect(mainStore.metaObjProps[0][0].value).toBe('TEST_TEMPLATE_PROPERTY_VALUE');
        });
    });

    it('@action getUserNameFromAuthProvider - should return user names that partially match search text', () => {
        transportLayer.getUserNameFromAuthProvider = jest.fn((text, id) => respondOK(fake.user_list_json));
        mainStore.getUserNameFromAuthProvider(TEST_USER_NAME, AUTH_PROVIDER_ID);
        expect(mainStore.drawerLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.getUserNameFromAuthProvider).toHaveBeenCalledTimes(1);
            expect(mainStore.users.length).toBe(1);
            expect(mainStore.users[0].full_name).toBe(TEST_USER_NAME);
            expect(mainStore.drawerLoading).toBe(false);
        });
    });

    it('@action registerNewUser - should register a new user to DDS', () => {
        transportLayer.registerNewUser = jest.fn((id) => respondOK(fake.user_json));
        mainStore.registerNewUser(TEST_UID);
        return sleep(1).then(() => {
            expect(transportLayer.registerNewUser).toHaveBeenCalledTimes(1);
            expect(transportLayer.registerNewUser).toHaveBeenCalledWith(TEST_UID);
        });
    });

    it('@action registerNewUser - should not fail even with a 409 error. User already registered', () => {
        mainStore.error = null;
        transportLayer.registerNewUser = jest.fn((id) => respond(409, 'conflict', {}));
        mainStore.registerNewUser(TEST_UID);
        return sleep(1).then(() => {
            expect(transportLayer.registerNewUser).toHaveBeenCalledTimes(1);
            expect(transportLayer.registerNewUser).toHaveBeenCalledWith(TEST_UID);
            expect(mainStore.error).toBeNull();
        });
    });

    it('@action getUserId - should return user id', () => {
        transportLayer.getUserId = jest.fn((fullName, id, role) => respondOK(fake.user_json));
        mainStore.getUserId(TEST_USER_NAME, TEST_UID, USER_ROLE);
        return sleep(1).then(() => {
            expect(transportLayer.getUserId).toHaveBeenCalledTimes(1);
            expect(transportLayer.getUserId).toHaveBeenCalledWith(TEST_USER_NAME);
            it('@action addProjectMember - should grant project permissions to user', () => {
                transportLayer.addProjectMember = jest.fn((projectId, userId, role, name) => respondOK(fake.grant_project_permission_json));
                mainStore.addProjectMember(PROJECT_ID, TEST_UID, USER_ROLE, TEST_USER_NAME);
                return sleep(1).then(() => {
                    expect(transportLayer.addProjectMember).toHaveBeenCalledTimes(1);
                    expect(transportLayer.addProjectMember).toHaveBeenCalledWith(PROJECT_ID, TEST_UID, USER_ROLE);
                    it('@action getProjectMembers - should return list of project members', () => {
                        transportLayer.getProjectMembers = jest.fn((ID) => respondOK(fake.project_members_json));
                        mainStore.getProjectMembers(PROJECT_ID);
                        expect(transportLayer.getProjectMembers).toBeCalledWith(PROJECT_ID);
                        return sleep(1).then(() => {
                            expect(mainStore.projectMembers.length).toBe(1);
                            expect(mainStore.projectMembers[0].project.id).toBe(PROJECT_ID);
                            expect(mainStore.projectMembers[0].user.full_name).toBe(TEST_USER_NAME);
                        });
                    });
                });
            });
        });
    });

    it('@action deleteProjectMember - should remove user from a project', () => {
        transportLayer.deleteProjectMember = jest.fn((id, userId) => respondOK());
        mainStore.deleteProjectMember(PROJECT_ID, TEST_UID);
        return sleep(1).then(() => {
            expect(transportLayer.deleteProjectMember).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteProjectMember).toHaveBeenCalledWith(PROJECT_ID, TEST_UID);
            expect(mainStore.error).toBeNull();
            it('@action getProjectMembers - should return list of project members', () => {
                transportLayer.getProjectMembers = jest.fn((ID) => respondOK(fake.project_members_json));
                mainStore.getProjectMembers(PROJECT_ID);
                expect(transportLayer.getProjectMembers).toBeCalledWith(PROJECT_ID);
                return sleep(1).then(() => {
                    expect(mainStore.projectMembers.length).toBe(1);
                    expect(mainStore.projectMembers[0].project.id).toBe(PROJECT_ID);
                    expect(mainStore.projectMembers[0].user.full_name).toBe(TEST_USER_NAME);
                });
            });
        });
    });

});