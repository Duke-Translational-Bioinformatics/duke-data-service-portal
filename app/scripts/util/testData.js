export const error_404 = {
    "error": "404",
    "reason": "Project does not exist",
    "suggestion": "You may have chosen the wrong ID."
}

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
        "id": "USER_ROLE",
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
    "name": "RSEM_Normalized_PI3K_RNASeq_Matrix.Rdata",
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

export const list_items_json = {
    "results": [
        {
            "kind": "dds-file",
            "id": "TEST_FILE_1",
            "parent": {
                "kind": "dds-folder",
                "id": "552be8c5-209d-4e3b-afaf-cb66686ffbyy"
            },
            "name": "RSEM_Normalized_PI3K_RNASeq_Matrix.Rdata",
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
                "id": "TEST_TEMPLATE_ID",
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