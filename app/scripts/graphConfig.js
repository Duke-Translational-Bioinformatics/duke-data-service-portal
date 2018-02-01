export const graphOptions = {
    autoResize: true,
    height: '100%',
    width: '100%',
    edges: {
        width: 0.65,
        smooth: {
            enabled: false,
            type: "dynamic",
            roundness: 0.5
        },
        hoverWidth: .95,
        selectionWidth: .95
    },
    nodes: {
        shape: 'dot',
        size: 14,
        borderWidth: 1,
        borderWidthSelected: 3,
        widthConstraint: {
            maximum: 200
        },
        font: {
            color: '#343434',
            size: 10,
            face: 'roboto'
        }
    },
    interaction: {
        hover: true,
        selectable: true,
        tooltipDelay: 200
    },
    layout: {
        hierarchical: {
            enabled: true,
            levelSeparation: 150,
            nodeSpacing: 100,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'DU',        // UD, DU, LR, RL
            sortMethod: 'directed'   // hubsize, directed
        }
    },
    physics: {
        enabled: false
    }
};

export const shadow = {
    activity: {
        enabled: true,
        color: 'rgba(0,0,0,0.74)',
        size: 3,
        x: 0,
        y: 0
    }
};

export const graphColors = {
    activity: {
        border: '#BDBDBD',
        background: '#FAFAFA',
        highlight: {
            border: '#9E9E9E',
            background: '#FAFAFA'
        },
        hover: {
            border: '#FAFAFA',
            background: '#FAFAFA'
        }
    },
    fileVersion: {
        border: '#64B5F6',
        background: '#64B5F6',
        highlight: {
            border: '#64B5F6',
            background: '#2196F3'
        },
        hover: {
            border: '#2196F3',
            background: '#2196F3'
        }
    },
    noPermissions: {
        border: '#CFD8DC',
        background: '#CFD8DC',
        highlight: {
            border: '#CFD8DC',
            background: '#CFD8DC'
        },
        hover: {
            border: '#BDBDBD',
            background: '#BDBDBD'
        }
    },
    user: {
        border: '#64DD17',
        background: '#64DD17',
        highlight: {
            border: '#64DD17',
            background: '#B2FF59'
        },
        hover: {
            border: '#76FF03',
            background: '#76FF03'
        }
    },
    edges: {
        generated: {
            color: '#1976D2',
            highlight: '#1565C0',
            hover: '#1565C0',
            opacity: 1
        },
        used: {
            color: '#1976D2',
            highlight: '#1565C0',
            hover: '#1565C0',
            opacity: 1
        }
    }
};