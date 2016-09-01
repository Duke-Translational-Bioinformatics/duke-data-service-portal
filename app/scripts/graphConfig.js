export const graphOptions = {
    autoResize: true,
    height: '100%',
    width: '100%',
    edges: {
        width: 0.15,
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

export const graphColors = {
    activity : {
        border: '#64DD17',
        background: '#64DD17',
        highlight: {
            border: '#64DD17',
            background: '#B2FF59'
        },
        hover: {
            border: '#B2FF59',
            background: '#B2FF59'
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
        color:'#1976D2',
        highlight:'#1565C0',
        hover: '#1565C0',
        opacity:1
    }
};