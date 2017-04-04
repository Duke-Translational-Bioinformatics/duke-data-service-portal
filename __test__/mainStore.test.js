jest.unmock("../app/scripts/stores/mainStore")
import BaseUtils from "../app/scripts/util/baseUtils";
import { projects_json } from "../app/scripts/util/testData";
import { mockFetch, sleep, respondOK, respond }  from "../app/scripts/util/testUtil";

describe('Main Store', () => {
    let mainStore = null;

    beforeEach(() => {
        mainStore = require('../app/scripts/stores/mainStore').default;
    });

    it('@action toggleLoading() - should change loading status', () => {
        mainStore.toggleLoading();
        expect(mainStore.loading).toBe(true);
        mainStore.toggleLoading();
        expect(mainStore.loading).toBe(false);
    });

    it('@action getProjects() - initially should return an empty list of projects', () => {
        mainStore.getProjects = respondOK([]).then(json => {
            mainStore.projects = json;
            expect(mainStore.projects.length).toBe(0);
        });
    });

    it('@action getProjects() - should return a list of projects', () => {
        mainStore.getProjects = respondOK(projects_json).then(json => {
            mainStore.projects = json;
            expect(mainStore.projects.length).toBe(1);
            expect(mainStore.projects[0].id).toBe('PROJECT_1_ID');
            expect(mainStore.projects[0].is_deleted).toBe(false);
            expect(mainStore.projects[0].audit).toEqual({});
        });
    });

    it('@action getProjectDetails() - should return project details', () => {
        expect(mainStore.project).toEqual({});
        mainStore.getProjectDetails = mockSpy(projects_json[0])
            return mainStore.getProjectDetails()
            .then(data => {
                mainStore.project = data;
                expect(mainStore.project.name).toBe(projects_json[0].name);
                expect(mainStore.project.id).toBe(projects_json[0].id);
            });
    });

    it('@action addProject() - should add a project', () => {
        mainStore.addProject = respond(201, 'created', projects_json[1]).then(json => {
                mainStore.projects.push(json[0]);
                expect(mainStore.projects.length).toBe(2);
                expect(mainStore.projects[1].id).toBe('PROJECT_2_ID');
                expect(mainStore.projects[1].is_deleted).toBe(false);
                expect(mainStore.projects[1].audit).toEqual({});
            });
    });

    it('@action deleteProject() - should remove a project', () => {
        mainStore.deleteProject = respond(204, 'No Content', projects_json[1]).then(json => {
            expect(mainStore.projects.length).toBe(2);
            mainStore.projects = BaseUtils.removeObjByKey(mainStore.projects, {key: "id", value: "PROJECT_2_ID"});
            expect(mainStore.projects.length).toBe(1);
            expect(mainStore.projects[0].id).toBe('PROJECT_1_ID');
            });
    });

    it('@action editProject() - should change the project name and description', () => {
        mainStore.editProject = respondOK([
            {
                "kind": "dds-project",
                "id": "PROJECT_1_ID",
                "name": "test project 1_CHANGED",
                "description": "test 1_CHANGED",
                "is_deleted": false,
                "audit": {}
            }
        ]).then(json => {
            expect(mainStore.projects.length).toBe(1);
            mainStore.projects = BaseUtils.removeObjByKey(mainStore.projects, {key: "id", value: "PROJECT_1_ID"});
            expect(mainStore.projects.length).toBe(0);
            mainStore.projects.push(json[0]);
            expect(mainStore.projects.length).toBe(1);
            expect(mainStore.projects[0].name).toBe("test project 1_CHANGED");
            expect(mainStore.projects[0].description).toBe("test 1_CHANGED");
            });
    });
});