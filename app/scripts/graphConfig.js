let graphOptions = {
    autoResize: true,
    height: '100%',
    width: '100%',
    edges: {
        color: {
            color:'#1976D2',
            highlight:'#1565C0',
            hover: '#1565C0',
            opacity:1
        },
        smooth: {
            enabled: false,
            type: "dynamic",
            roundness: 0.5
        }
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
        },
        color: {
            border: '#1565C0',
            background: '#64B5F6',
            highlight: {
                border: '#1565C0',
                background: '#2196F3'
            },
            hover: {
                border: '#1565C0',
                background: '#2196F3'
            }
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

export default graphOptions;