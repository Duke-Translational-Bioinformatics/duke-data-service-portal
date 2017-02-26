import Reflux from 'reflux';
import { observable, computed, action } from 'mobx';
import cookie from 'react-cookie';

export class MainStore {
    @observable device
    @observable error
    @observable errorModals
    @observable failedUploads
    @observable modalOpen
    @observable screenSize
    @observable toasts

    constructor() {
        this.device = {};
        this.error = null;
        this.errorModals = [];
        this.failedUploads = [];
        this.modalOpen = cookie.load('modalOpen');
        this.screenSize = {};
        this.toasts = [];
    }

    displayErrorModals(error) {
        let err = error && error.message ? {
            msg: error.message,
            response: error.response ? error.response.status : null
        } : null;
        if (err.response === null) {
            this.errorModals.push({
                msg: error.message,
                response: 'Folders can not be uploaded',
                ref: 'modal' + Math.floor(Math.random() * 10000)
            });
        } else {
            if (error && error.response.status !== 404) {
                this.errorModals.push({
                    msg: error.response.status === 403 ? error.message + ': You don\'t have permissions to view or change' +
                    ' this resource' : error.message,
                    response: error.response.status,
                    ref: 'modal' + Math.floor(Math.random() * 10000)
                });
            }
        }
        this.error = err;
    }

    getDeviceType(device) {
        this.device = device;
    }

    getScreenSize(height, width) {
        this.screenSize.height = height;
        this.screenSize.width = width;
    }

    handleErrors(error) {
        this.displayErrorModals(error);
        this.loading = false;
        this.drawerLoading = false;
    }

    addToast(msg) {
        this.toasts.push({
            msg: msg,
            ref: 'toast' + Math.floor(Math.random() * 10000)
        });
    }

    removeToast(refId) {
        for (let i = 0; i < this.toasts.length; i++) {
            if (this.toasts[i].ref === refId) {
                this.toasts.splice(i, 1);
                break;
            }
        }
    }

    closePhiModal() {
        let expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
        this.modalOpen = false;
        cookie.save('modalOpen', this.modalOpen, {expires: expiresAt});
    }

    failedUpload(failedUploads) {
        this.failedUploads = failedUploads;
    }

    removeFailedUploads() {
        this.failedUploads = [];
    }

    clearErrors(error) {
        this.error = {};
    }

    removeErrorModal(refId) {
        for (let i = 0; i < this.errorModals.length; i++) {
            if (this.errorModals[i].ref === refId) {
                this.errorModals.splice(i, 1);
                break;
            }
        }
        this.error = {};
    }

}

const mainStore = new MainStore();

export default mainStore;
