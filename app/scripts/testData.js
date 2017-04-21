export const projects_json = [
    {
        "results": [
            {
                "kind": "dds-project",
                "id": "TEST_PROJECT_1",
                "name": "TEST PROJECT 1",
                "description": "test project 1 description",
                "is_deleted": false,
                "audit": {}
            },
            {
                "kind": "dds-project",
                "id": "TEST_PROJECT_2",
                "name": "TEST PROJECT 2",
                "description": "test project 2 description",
                "is_deleted": false,
                "audit": {}
            }
        ]
    },
    {
        "map": {
            "x-total": [
                "5"
            ],
            "content-type": [
                "application/json"
            ],
            "cache-control": [
                "max-age=0, private, must-revalidate"
            ],
            "x-per-page": [
                "25"
            ],
            "x-total-pages": [
                "1"
            ],
            "x-page": [
                "1"
            ]
        }
    }
]

export const project_edit_json =  {
    "kind": "dds-project",
    "id": "TEST_PROJECT_1",
    "name": "EDITED_NAME",
    "description": "EDITED_DESCRIPTION",
    "is_deleted": false,
    "audit": {}
}

export const item_edit_json =  {
    "kind": "dds-folder",
    "id": "TEST_FOLDER_1",
    "name": "EDITED_NAME",
    "description": "EDITED_DESCRIPTION",
    "is_deleted": false,
    "audit": {}
}

export const usage_json = {
    "project_count": 1,
    "file_count": 2,
    "storage_bytes": 100
}

export const user_json = {
    "id": "0987654321",
    "username": "TEST01",
    "first_name": "TEST",
    "last_name": "USER",
    "full_name": "TEST USER NAME",
    "email": "test_user@duke.edu",
    "auth_provider": {
        "id": "1234567890",
        "name": "duke",
        "affiliate": {
            "uid": "TEST01"
        }
    },
    "last_login_on": "2015-01-01T12:00:00Z",
    "audit": {}
}

export const user_list_json = {
    "results": [
        {
            "uid": "TEST01",
            "first_name": "TEST",
            "last_name": "USER",
            "full_name": "TEST USER NAME",
            "email": "test_user@duke.edu"
        }
    ]
}

export const grant_project_permission_json = {
    "project": {
        "id": "TEST_PROJECT_1"
    },
    "user": {
        "id": "c1179f73-0558-4f96-afc7-9d251e65b7bb",
        "username": "TEST01",
        "full_name": "TEST USER NAME"
    },
    "auth_role": {
        "id": "project_admin",
        "name": "USER_ROLE",
        "description": "Can view, download, create, update and delete files"
    }
}

export const project_members_json = {
    "results": [
        {
            "project": {
                "id": "TEST_PROJECT_1"
            },
            "user": {
                "id": "TEST01",
                "username": "TEST01",
                "full_name": "TEST USER NAME"
            },
            "auth_role": {
                "id": "USER_ROLE",
                "name": "USER_ROLE",
                "description": "Can view, download, create, update and delete files"
            }
        }
    ]
}

export const folder_json = {
    "kind": "dds-folder",
    "id": "TEST_FOLDER_1",
    "parent": {
        "kind": "dds-folder",
        "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy"
    },
    "name": "TEST FOLDER 1",
    "project": {
        "id": "TEST_PROJECT_1"
    },
    "ancestors": [
        {
            "kind": "dds-project",
            "id": "TEST_PROJECT_1",
            "name": "TEST PROJECT 1"
        },
        {
            "kind": "dds-folder",
            "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy",
            "name": "Sequencing Core"
        }
    ],
    "is_deleted": false,
    "audit": {}
}

export const file_json = {
    "kind": "dds-file",
    "id": "TEST_FILE_1",
    "parent": {
        "kind": "dds-folder",
        "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy"
    },
    "name": "TEST FILE 1",
    "project": {
        "id": "TEST_PROJECT_ID"
    },
    "ancestors": [
        {
            "kind": "dds-project",
            "id": "ca29f7df-33ca-46dd-a015-92c46fdb6fd1",
            "name": "Knockout Mouse Project (KOMP)"
        },
        {
            "kind": "dds-folder",
            "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy",
            "name": "Sequencing Core"
        }
    ],
    "is_deleted": false,
    "current_version": {
        "id": "89ef1e77-1a0b-40a8-aaca-260d13987f2b",
        "version": 1,
        "label": "EDITED_LABEL",
        "upload": {
            "id": "666be35a-98e0-4c2e-9a17-7bc009f9bb23",
            "size": 30024000,
            "hashes": [
                {
                    "value": "cf23df2207d99a74fbe169e3eba035e633b65d94",
                    "algorithm": "md5",
                    "audit": {}
                }
            ],
            "storage_provider": {
                "id": "g5579f73-0558-4f96-afc7-9d251e65bv33",
                "name": "duke_oit_swift",
                "description": "Duke OIT Storage"
            }
        }
    },
    "audit": {}
}

export const file_version_json = {
    "kind": "dds-file-version",
    "id": "TEST_FILE_VERSION_1",
    "file": {
        "id": "TEST_FILE__1",
        "name": "TEST FILE 1",
        "project": {
            "id": "ca29f7df-33ca-46dd-a015-92c46fdb6fd1"
        }
    },
    "version": 2,
    "label": "Initial raw data from device",
    "is_deleted": false,
    "upload": {
        "id": "666be35a-98e0-4c2e-9a17-7bc009f9bb23",
        "size": 30024000,
        "hashes": [
            {
                "value": "cf23df2207d99a74fbe169e3eba035e633b65d94",
                "algorithm": "md5",
                "audit": {}
            }
        ],
        "storage_provider": {
            "id": "g5579f73-0558-4f96-afc7-9d251e65bv33",
            "name": "duke_oit_swift",
            "description": "Duke OIT Storage"
        }
    },
    "audit": {}
}

export const list_item_response_json = {
    "_bodyInit": {},
    "_bodyBlob": {"results": [
        {
            "kind": "dds-file",
            "id": "TEST_FILE_1",
            "parent": {
                "kind": "dds-folder",
                "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy"
            },
            "name": "TEST FILE 1",
            "project": {
                "id": "TEST_PROJECT_ID"
            },
            "ancestors": [
                {
                    "kind": "dds-project",
                    "id": "ca29f7df-33ca-46dd-a015-92c46fdb6fd1",
                    "name": "Knockout Mouse Project (KOMP)"
                },
                {
                    "kind": "dds-folder",
                    "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy",
                    "name": "Sequencing Core"
                }
            ],
            "is_deleted": false,
            "current_version": {
                "id": "89ef1e77-1a0b-40a8-aaca-260d13987f2b",
                "version": 1,
                "label": "Initial raw data from device",
                "upload": {
                    "id": "666be35a-98e0-4c2e-9a17-7bc009f9bb23",
                    "size": 30024000,
                    "hashes": [
                        {
                            "value": "cf23df2207d99a74fbe169e3eba035e633b65d94",
                            "algorithm": "md5",
                            "audit": {}
                        }
                    ],
                    "storage_provider": {
                        "id": "g5579f73-0558-4f96-afc7-9d251e65bv33",
                        "name": "duke_oit_swift",
                        "description": "Duke OIT Storage"
                    }
                }
            },
            "audit": {}
        },
        {
            "kind": "dds-folder",
            "id": "TEST_FOLDER_1",
            "parent": {
                "kind": "dds-folder",
                "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy"
            },
            "name": "TEST FOLDER 1",
            "project": {
                "id": "TEST_PROJECT_1"
            },
            "ancestors": [
                {
                    "kind": "dds-project",
                    "id": "TEST_PROJECT_1",
                    "name": "TEST PROJECT 1"
                },
                {
                    "kind": "dds-folder",
                    "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy",
                    "name": "Sequencing Core"
                }
            ],
            "is_deleted": false,
            "audit": {}
        }

    ]
    },
    "type": "default",
    "url": "https://dukeds-dev.herokuapp.com/api/v1/projects/c628435b-78e8-4e51-82a7-ff8eb1dc255a/children?page=1&per_page=25",
    "status": 200,
    "ok": true,
    "statusText": "OK",
    "headers": {
        "map": {
            "x-total": [
                "17"
            ],
            "x-per-page": [
                "25"
            ],
            "content-type": [
                "application/json"
            ],
            "cache-control": [
                "max-age=0, private, must-revalidate"
            ],
            "x-total-pages": [
                "1"
            ],
            "x-page": [
                "1"
            ]
        }
    }
}

export const list_items_json = {
    "results": [
        {
            "kind": "dds-file",
            "id": "TEST_FILE_1",
            "parent": {
                "kind": "dds-folder",
                "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy"
            },
            "name": "TEST FILE 1",
            "project": {
                "id": "TEST_PROJECT_ID"
            },
            "ancestors": [
                {
                    "kind": "dds-project",
                    "id": "ca29f7df-33ca-46dd-a015-92c46fdb6fd1",
                    "name": "Knockout Mouse Project (KOMP)"
                },
                {
                    "kind": "dds-folder",
                    "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy",
                    "name": "Sequencing Core"
                }
            ],
            "is_deleted": false,
            "current_version": {
                "id": "89ef1e77-1a0b-40a8-aaca-260d13987f2b",
                "version": 1,
                "label": "Initial raw data from device",
                "upload": {
                    "id": "666be35a-98e0-4c2e-9a17-7bc009f9bb23",
                    "size": 30024000,
                    "hashes": [
                        {
                            "value": "cf23df2207d99a74fbe169e3eba035e633b65d94",
                            "algorithm": "md5",
                            "audit": {}
                        }
                    ],
                    "storage_provider": {
                        "id": "g5579f73-0558-4f96-afc7-9d251e65bv33",
                        "name": "duke_oit_swift",
                        "description": "Duke OIT Storage"
                    }
                }
            },
            "audit": {}
        },
        {
                "kind": "dds-folder",
                "id": "TEST_FOLDER_1",
                "parent": {
                "kind": "dds-folder",
                    "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy"
            },
                "name": "TEST FOLDER 1",
                "project": {
                "id": "TEST_PROJECT_1"
            },
                "ancestors": [
                {
                    "kind": "dds-project",
                    "id": "TEST_PROJECT_1",
                    "name": "TEST PROJECT 1"
                },
                {
                    "kind": "dds-folder",
                    "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy",
                    "name": "Sequencing Core"
                }
            ],
                "is_deleted": false,
                "audit": {}
        }

    ]
}

export const object_metadata_json = {
    "results": [
        {
            "object": {
                "kind": "dds-file",
                "id": "b80a2679-f6bf-46da-acaa-b7a4582b1eda"
            },
            "template": {
                "id": "TEMPLATE_ID",
                "name": "TEST_TEMPLATE_1"
            },
            "properties": [
                {
                    "template_property": {
                        "id": "TEST_TEMPLATE_PROPERTY_1",
                        "key": "TEST_TEMPLATE_PROPERTY_KEY_1"
                    },
                    "value": "TEST_TEMPLATE_PROPERTY_VALUE"
                }
            ]
        }
    ]
}

export const tag_labels_json = {
    "results": [
        {
            "label": "TAG_1",
            "count": 1,
            "last_used_on": "2015-01-01T12:10:00Z"
        },
        {
            "label": "TAG_2",
            "count": 2,
            "last_used_on": "2015-01-01T12:05:00Z"
        },
        {
            "label": "TAG_3",
            "count": 3,
            "last_used_on": "2015-01-01T12:00:00Z"
        }
    ]
}

export const tag_json = {
    "id": "TAG_1_ID",
    "object": {
        "kind": "dds-file",
        "id": "TEST_FILE_1"
    },
    "label": "TAG_1",
    "audit": {}
}

export const  file_version_list_json = {
    "results": [
        {
            "kind": "dds-file-version",
            "id": "TEST_FILE_VERSION_1",
            "file": {
                "id": "TEST_FILE__1",
                "name": "TEST FILE 1",
                "project": {
                    "id": "ca29f7df-33ca-46dd-a015-92c46fdb6fd1"
                }
            },
            "version": 2,
            "label": "Initial raw data from device",
            "is_deleted": false,
            "upload": {
                "id": "666be35a-98e0-4c2e-9a17-7bc009f9bb23",
                "size": 30024000,
                "hashes": [
                    {
                        "value": "cf23df2207d99a74fbe169e3eba035e633b65d94",
                        "algorithm": "md5",
                        "audit": {}
                    }
                ],
                "storage_provider": {
                    "id": "g5579f73-0558-4f96-afc7-9d251e65bv33",
                    "name": "duke_oit_swift",
                    "description": "Duke OIT Storage"
                }
            },
            "audit": {}
        }
    ]
}

export const hash_json = {
    "id": "TEST_UPLOAD_1",
    "hash": "MD5"
}

export const download_url_json = {
    "http_verb": "GET",
    "host": "swift.oit.duke.edu",
    "url": "/v1/AUTH_dev/418da9e8-7d01-4761-982c-811d95ac6653/0618a1bc-5042-48d2-af66-ed171354bf6b?temp_url_sig=93b5c5a2c920f0d4962c391d932e4054ec76916c&temp_url_expires=1448918738",
    "http_headers": []
}

export const metadata_templates_json = {
    "results": [
        {
            "id": "TEMPLATE_ID",
            "name": "TEMPLATE_1",
            "label": "TEMPLATE 1",
            "description": "TEMPLATE_1 Description",
            "audit": {
                "created_on": "2015-01-01T12:00:00Z",
            }
        },
        {
            "id": "TEMPLATE_2",
            "name": "TEMPLATE_2",
            "label": "TEMPLATE 2",
            "description": "TEMPLATE_2 Description",
            "audit": {
                "created_on": "2016-01-01T12:00:00Z",
            }
        }
    ]
}

export const edited_metadata_templates_json = {
        "id": "TEMPLATE_ID",
        "name": "EDITED_TEMPLATE_1",
        "label": "EDITED TEMPLATE 1",
        "description": "EDITED TEMPLATE_1 Description",
        "audit": {
            "created_on": "2015-01-01T12:00:00Z",
        }
}


export const template_properties_json = {
    "results": [
        {
            "id": "TEMPLATE_PROPERTY_1",
            "template": {
                "id": "TEMPLATE_ID",
                "name": "TEMPLATE_1"
            },
            "key": "output_type",
            "label": "TEMPLATE 1",
            "description": "The type of data in the sequencing output file.",
            "type": "string",
            "audit": {}
        }
    ]
}

export const template_property_json = {
        "id": "TEMPLATE_PROPERTY_1",
        "template": {
            "id": "TEMPLATE_ID",
            "name": "TEMPLATE_1"
        },
        "key": "TEMPLATE_1_KEY",
        "label": "TEMPLATE 1",
        "description": "TEMPLATE 1 DESCRIPTION",
        "type": "STRING",
        "audit": {}
}

export const metadata_object_json = {
    "object": {
        "kind": "dds-file",
        "id": "TEST_FILE_1"
    },
    "template": {
        "id": "TEMPLATE_ID",
        "name": "TEMPLATE_1"
    },
    "properties": [
        {
            "template_property": {
                "id": "TEMPLATE_PROPERTY_1",
                "key": "TEMPLATE_PROPERTY_1"
            },
            "value": "TEMPLATE PROPERTY 1"
        }
    ]
}

export const modal_json = {
    "id": "MODAL",
    "open": true
}

export const error_json = {
    "response": {
        "_bodyInit": {},
        "_bodyBlob": {},
        "type": "default",
        "url": "https://dukeds-dev.herokuapp.com/api/v1/files/22f4f7f8-a92d-41b6-b76a-f91b63ff70e31/rename",
        "status": 503,
        "ok": false,
        "statusText": "SERVICE UNAVAILABLE",
        "headers": {
            "map": {
                "content-type": [
                    "application/json"
                ],
                "cache-control": [
                    "no-cache"
                ]
            }
        }
    }
}

export const error_404 = {
    "response": {
        "_bodyInit": {},
        "_bodyBlob": {},
        "type": "default",
        "url": "https://dukeds-dev.herokuapp.com/api/v1/files/22f4f7f8-a92d-41b6-b76a-f91b63ff70e31/rename",
        "status": 404,
        "ok": false,
        "statusText": "SERVICE UNAVAILABLE",
        "headers": {
            "map": {
                "content-type": [
                    "application/json"
                ],
                "cache-control": [
                    "no-cache"
                ]
            }
        }
    }
}

export const special_error_json = {
    "code": 8,
    "message": "A requested file or directory could not be found at the time an operation was processed.",
    "name":  "NotFoundError"
}

export const device_type_json = {
    "android":false,
    "ipad":false,
    "iphone":false
}

export const auth_providers_json = {
    "results": [
        {
            "id": "b67d1249-5251-4058-95fd-8b90b809c556",
            "service_id": "342c075a-7aca-4c35-b3f5-29f043884b5b",
            "name": "Duke Authentication Service",
            "is_deprecated": true,
            "is_default": false,
            "login_initiation_url": "https://dds-dev.duhs.duke.edu/duke_authentication_service/authenticate?response_type=token&client_id=090235c0-a87a-4c44-bac7-bcffe57c3340"
        },
        {
            "id": "cfb3bd75-84e8-49ea-b04f-7500b339a093",
            "service_id": "be33eb97-3bc8-4ce8-a109-c82aa1b32b23",
            "name": "OIT OpenID",
            "is_deprecated": false,
            "is_default": true,
            "login_initiation_url": "https://oauth.oit.duke.edu/oidc/authorize?response_type=token&client_id=dds_dev"
        }
    ]
}

export const api_token_json = {
    "api_token": "API_TOKEN",
    "expires_on": 1491856850,
    "time_to_live": 7200
}

export const api_key_json = {
    "key": "API_KEY",
    "created_on": "2015-01-01T12:00:00Z"
}

export const agent_list_json = {
    "results": [
        {
            "id": "AGENT_ID",
            "name": "AGENT_NAME",
            "description": null,
            "repo_url": null,
            "is_deleted": false,
            "audit": {}
        },
        {
            "id": "AGENT_ID_2",
            "name": "AGENT_NAME_2",
            "description": null,
            "repo_url": null,
            "is_deleted": false,
            "audit": {}
        }
    ]
}

export const agent_json = {
    "id": "AGENT_ID_3",
    "name": "AGENT_NAME_3",
    "description": null,
    "repo_url": null,
    "is_deleted": false,
    "audit": {}
}

export const activities_json = {
    "results": [
        {
            "kind": "dds-activity",
            "id": "ACTIVITY_ID",
            "name": "ACTIVITY_NAME",
            "description": "ACTIVITY_DESCRIPTION",
            "started_on": "2015-01-01T12:00:00Z",
            "ended_on": null,
            "is_deleted": false,
            "audit": {}
        },
        {
            "kind": "dds-activity",
            "id": "ACTIVITY_ID_2",
            "name": "ACTIVITY_NAME_2",
            "description": "ACTIVITY_DESCRIPTION_2)",
            "started_on": "2015-01-01T12:00:00Z",
            "ended_on": null,
            "is_deleted": false,
            "audit": {}
        }
    ]
}

export const graph_json = {
    "graph": {
        "nodes": [
                {
                "id": "ACTIVITY_ID",
                "labels": [
                    "Activity"
                ],
                "properties": {
                    "kind": "dds-activity",
                    "id": "ACTIVITY_ID",
                    "name": "ACTIVITY_1",
                    "description": "ACTIVITY_1_DESCRIPTION",
                    "started_on": "2017-04-10T21:17:07.758Z",
                    "ended_on": null,
                    "is_deleted": false,
                    "audit": {
                        "created_on": "2017-04-07T17:28:38.395Z",
                        "created_by": {
                            "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
                            "username": "cc487",
                            "full_name": "Casey Choiniere"
                        },
                        "last_updated_on": null,
                        "last_updated_by": null,
                        "deleted_on": null,
                        "deleted_by": null
                    }
                }
            }, {
                "id": "FILE_NODE_1",
                "labels": [
                    "FileVersion"
                ],
                "properties": {
                    "id": "FILE_NODE_1",
                    "kind": "dds-file-version",
                    "version": 1,
                    "label": null,
                    "is_deleted": false,
                    "audit": {
                        "created_on": "2017-04-07T17:28:38.395Z",
                        "created_by": {
                            "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
                            "username": "cc487",
                            "full_name": "Casey Choiniere"
                        },
                        "last_updated_on": null,
                        "last_updated_by": null,
                        "deleted_on": null,
                        "deleted_by": null
                    },
                    "upload": {},
                    "file": {
                        "id": "847e3285-c8e3-441b-9150-ea885d784522",
                        "name": "FILE_NODE_1",
                        "project": {
                            "id": "c628435b-78e8-4e51-82a7-ff8eb1dc255a",
                            "name": "a"
                        }
                    }
                }
            }
        ],
        "relationships": [
                {
                "id": "EDGE_ID",
                "type": "WasGeneratedBy",
                "start_node": "FILE_NODE_1",
                "end_node": "ACTIVITY_ID",
                "properties": {
                    "kind": "dds-relation-was-generated-by",
                    "id": "8e9e0831-cd9f-4066-814b-b8d4a8850bc0",
                    "audit": {
                        "created_on": "2017-04-10T21:17:27.500Z",
                        "created_by": {
                            "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
                            "username": "cc487",
                            "full_name": "Casey Choiniere"
                        },
                        "last_updated_on": null,
                        "last_updated_by": null,
                        "deleted_on": null,
                        "deleted_by": null
                    },
                    "from": {
                        "id": "FILE_NODE_1",
                        "kind": "dds-file-version",
                        "version": 1,
                        "label": null,
                        "is_deleted": false,
                        "audit": {},
                        "upload": {},
                        "file": {
                            "id": "847e3285-c8e3-441b-9150-ea885d784522",
                            "name": "FILE_NODE_1",
                            "project": {
                                "id": "c628435b-78e8-4e51-82a7-ff8eb1dc255a",
                                "name": "a"
                            }
                        }
                    },
                    "to": {
                        "kind": "dds-activity",
                        "id": "ACTIVITY_ID",
                        "name": "ACTIVITY_1",
                        "description": "ACTIVITY_1_DESCRIPTION",
                        "started_on": "2017-04-10T21:17:07.758Z",
                        "ended_on": null,
                        "is_deleted": false,
                        "audit": {}
                    }
                }
            }
        ]
    }
}

export const relation_json = {
    "kind": "dds-relation-was-generated-by",
    "id": "EDGE_ID_2",
    "audit": {
        "created_on": "2017-04-10T23:42:11.336Z",
        "created_by": {
            "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
            "username": "cc487",
            "full_name": "Casey Choiniere"
        },
        "last_updated_on": null,
        "last_updated_by": null,
        "deleted_on": null,
        "deleted_by": null
    },
    "from": {
        "id": "FILE_NODE_1",
        "kind": "dds-file-version",
        "version": 1,
        "label": null,
        "is_deleted": false,
        "audit": {
            "created_on": "2017-04-07T17:28:38.395Z",
            "created_by": {
                "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
                "username": "cc487",
                "full_name": "Casey Choiniere"
            },
            "last_updated_on": null,
            "last_updated_by": null,
            "deleted_on": null,
            "deleted_by": null
        },
        "upload": {
            "id": "d187e969-3a5b-40ca-84bc-fa5d46e094c1",
            "size": 5120,
            "storage_provider": {
                "id": "e71e2106-2243-4795-a9a0-70de89f68d64",
                "name": "duke_swift",
                "description": "Duke OIT Swift Service"
            },
            "hashes": [{
                "algorithm": "md5",
                "value": "32ca18808933aa12e979375d07048a11",
                "audit": {
                    "created_on": "2017-04-07T17:28:37.446Z",
                    "created_by": {
                        "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
                        "username": "cc487",
                        "full_name": "Casey Choiniere"
                    },
                    "last_updated_on": null,
                    "last_updated_by": null,
                    "deleted_on": null,
                    "deleted_by": null
                }
            }]
        },
        "file": {
            "id": "847e3285-c8e3-441b-9150-ea885d784522",
            "name": "FILE_NODE_1",
            "project": {
                "id": "c628435b-78e8-4e51-82a7-ff8eb1dc255a",
                "name": "a"
            }
        }
    },
    "to": {
        "kind": "dds-activity",
        "id": "ACTIVITY_ID_2",
        "name": "test activity",
        "description": "",
        "started_on": "2016-10-19T19:03:40.065Z",
        "ended_on": null,
        "is_deleted": false,
        "audit": {
            "created_on": "2016-10-19T19:03:40.164Z",
            "created_by": {
                "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
                "username": "cc487",
                "full_name": "Casey Choiniere"
            },
            "last_updated_on": null,
            "last_updated_by": null,
            "deleted_on": null,
            "deleted_by": null
        }
    }
}

export const prov_activity_json = {
    "kind": "dds-activity",
    "id": "ACTIVITY_ID",
    "name": "ACTIVITY_1",
    "description": "ACTIVITY_1_DESCRIPTION",
    "started_on": "2017-04-11T00:04:24.442Z",
    "ended_on": null,
    "is_deleted": false,
    "audit": {
        "created_on": "2017-04-11T00:04:24.590Z",
        "created_by": {
            "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
            "username": "cc487",
            "full_name": "Casey Choiniere"
        },
        "last_updated_on": null,
        "last_updated_by": null,
        "deleted_on": null,
        "deleted_by": null
    }
}

export const prov_file_node_json = {
    "kind": "dds-file",
    "id": "FILE_NODE_1",
    "parent": {
        "kind": "dds-project",
        "id": "c628435b-78e8-4e51-82a7-ff8eb1dc255a"
    },
    "name": "FILE_NODE_1",
    "audit": {
        "created_on": "2017-04-07T17:28:38.488Z",
        "created_by": {
            "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
            "username": "cc487",
            "full_name": "Casey Choiniere"
        },
        "last_updated_on": null,
        "last_updated_by": null,
        "deleted_on": null,
        "deleted_by": null
    },
    "is_deleted": false,
    "current_version": {
        "id": "3ddaf4cb-a11f-4842-a57c-c69be3535915",
        "version": 1,
        "label": null,
        "upload": {
            "id": "3be3b3f9-78a0-42c6-9a6d-483206c73ea6",
            "size": 5120,
            "storage_provider": {
                "id": "e71e2106-2243-4795-a9a0-70de89f68d64",
                "name": "duke_swift",
                "description": "Duke OIT Swift Service"
            },
            "hashes": [
                {
                    "algorithm": "md5",
                    "value": "32ca18808933aa12e979375d07048a11",
                    "audit": {
                        "created_on": "2017-04-07T17:28:37.608Z",
                        "created_by": {
                            "id": "e8aeeeb8-0071-4308-8bfa-e24d08094c1d",
                            "username": "cc487",
                            "full_name": "Casey Choiniere"
                        },
                        "last_updated_on": null,
                        "last_updated_by": null,
                        "deleted_on": null,
                        "deleted_by": null
                    }
                }
            ]
        }
    },
    "project": {
        "id": "c628435b-78e8-4e51-82a7-ff8eb1dc255a",
        "name": "a"
    },
    "ancestors": [
        {
            "kind": "dds-project",
            "id": "c628435b-78e8-4e51-82a7-ff8eb1dc255a",
            "name": "a"
        }
    ]
}

export const scale_position_data = {
    "scale": 2,
    "position": {
        "x": 1,
        "y": 2
    }
}

export const edge_data = {
    "from": "FILE_NODE_1",
    "to": "ACTIVITY_ID"
}