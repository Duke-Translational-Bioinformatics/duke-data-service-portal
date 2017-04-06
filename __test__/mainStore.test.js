jest.unmock("../app/scripts/stores/mainStore")
import * as fake from "../app/scripts/util/testData";
import { sleep, respondOK, respond }  from "../app/scripts/util/testUtil";

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
    const TEST_TEMPLATE_ID = 'TEST_TEMPLATE_ID';
    const TEST_USER_NAME = 'TEST USER NAME';
    const TEST_UID = 'TEST01';
    const USER_ROLE = 'USER_ROLE';

    let transportLayer = null;
    let mainStore = null;

    beforeEach(() => {
        mainStore = require('../app/scripts/stores/mainStore').default;
        transportLayer = {};
        mainStore.transportLayer = transportLayer;
        mainStore.listItems = [];
        return mainStore;
    });

    it('@action toggleTagManager - toggles the tag manager bool', () => {
        mainStore.toggleTagManager();
        expect(mainStore.openTagManager).toBe(true);
        mainStore.toggleTagManager();
        expect(mainStore.openTagManager).toBe(false);
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
        mainStore.toasts = []
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
        mainStore.error = null;
        transportLayer.deleteTag = jest.fn((id, label, tag) => respond(404, 'not found', {}));
        mainStore.deleteTag(fake.tag_json.id);
        return sleep(1).then(() => {
            expect(transportLayer.deleteTag).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteTag).toHaveBeenCalledWith(fake.tag_json.id);
            expect(mainStore.error).not.toBeNull()
            expect(mainStore.error.response.status).toBe(404)
        });
    });

    // @action addFile(uploadId, parentId, parentKind, fileName) {
    //     this.transportLayer.addFile(uploadId, parentId, parentKind)
    //         .then(this.checkResponse)
    //         .then(response => response.json())
    //         .then((json) => {
    //             this.addToast(fileName + ' uploaded successfully');
    //             this.addFileSuccess(parentId, parentKind, uploadId, json.id)
    //         }).catch((ex) => {
    //         this.addToast('Failed to upload ' + fileName + '!');
    //         this.handleErrors(ex)
    //     })
    // }

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

    // @action getChildren(id, path, page) {
    //     this.loading = true;
    //     if (page == null) page = 1;
    //     this.transportLayer.getChildren(id, path, page)
    //         .then(this.checkResponse)
    //         .then((response) => {
    //             const results = response.json();
    //             const headers = response.headers;
    //             return Promise.all([results, headers]);
    //         })
    //         .then((json) => {
    //             let results = json[0].results;
    //             let headers = json[1].map;
    //             if(page <= 1) {
    //                 this.listItems = results;
    //             } else {
    //                 this.listItems = [...this.listItems, ...results];
    //             }
    //             this.responseHeaders = headers;
    //             this.loading = false;
    //         }).catch(ex =>this.handleErrors(ex))
    // }

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

    it('@action toggleLoading - should change loading status', () => {
        mainStore.toggleLoading();
        expect(mainStore.loading).toBe(true);
        mainStore.toggleLoading();
        expect(mainStore.loading).toBe(false);
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

    // it('@action getProjects() - should return a list of projects', () => { // Todo: Fix this test to work with Promise.all
    //     transportLayer.getProjects = jest.fn((page) => respondOK(fake.projects_json));
    //     mainStore.getProjects();
    //     return sleep(1).then(() => {
    //         expect(mainStore.loading).toBe(true);
    //         console.log(mainStore.projects.length)
    //         expect(mainStore.projects.length).toBe(2);
    //         expect(transportLayer.getProjects.mock.calls.length).toBe(1);
    //         expect(transportLayer.getProjects.mock.calls[0][0]).toBe(1);
    //     });
    // });

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

    it('@action getObjectMetadata - should return object metadata and all metadata object properties for file', () => {
        transportLayer.getObjectMetadata = jest.fn((id, kind) => respondOK(fake.object_metadata_json));
        mainStore.getObjectMetadata(FILE_ID, DDS_FILE);
        return sleep(1).then(() => {
            expect(transportLayer.getObjectMetadata).toHaveBeenCalledTimes(1);
            expect(transportLayer.getObjectMetadata).toHaveBeenCalledWith(FILE_ID, DDS_FILE);
            expect(mainStore.objectMetadata.length).toBe(1);
            expect(mainStore.objectMetadata[0].object.kind).toBe(DDS_FILE);
            expect(mainStore.objectMetadata[0].template.id).toBe(TEST_TEMPLATE_ID);
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