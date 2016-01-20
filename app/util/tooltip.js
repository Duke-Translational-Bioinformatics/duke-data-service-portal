var Tooltip = {
    tooltip: undefined,
    target: undefined,
    bindEvents: function () {
        Tooltip.tooltip = document.getElementById('tooltip');
        var targets = document.querySelectorAll('[rel=tooltip]');
        for (var i = 0; i < targets.length; ++i) {
            targets[i].addEventListener('mouseover', Tooltip.show);
            targets[i].addEventListener('mouseleave', Tooltip.hide);
        }
    },

    show: function () {
        Tooltip.target = this;
        var tip = Tooltip.target['title'];
        if (!tip || tip == '') {
            return false;
        }
        Tooltip.tooltip.innerHTML = tip;
        if (window.innerWidth < Tooltip.tooltip.offsetWidth * 1.5) {
            Tooltip.tooltip.style.maxWidth = (window.innerWidth / 2) + 'px';
        }
        else {
            Tooltip.tooltip.style.maxWidth = 320 + 'px';
        }

        var pos_left = Tooltip.target.offsetLeft + ( Tooltip.target.offsetWidth / 2 ) - ( Tooltip.tooltip.offsetWidth / 2 ),
            pos_top = Tooltip.target.offsetTop - Tooltip.tooltip.offsetHeight - 20;
        Tooltip.tooltip.className = '';
        if (pos_left < 0) {
            pos_left = Tooltip.target.offsetLeft + Tooltip.target.offsetWidth / 2 - 20;
            Tooltip.tooltip.className += ' left';
        }

        if (pos_left + Tooltip.tooltip.offsetWidth > window.innerWidth) {
            pos_left = Tooltip.target.offsetLeft - Tooltip.tooltip.offsetWidth + Tooltip.target.offsetWidth / 2 + 20;
            Tooltip.tooltip.className += ' right';
        }

        if (pos_top < 0) {
            var pos_top = Tooltip.target.offsetTop + Tooltip.target.offsetHeight;
            Tooltip.tooltip.className += ' top';
        }

        Tooltip.tooltip.style.left = pos_left + 'px';
        Tooltip.tooltip.style.top = pos_top + 'px';
        Tooltip.tooltip.className += ' show';
    },
    hide: function () {
        Tooltip.tooltip.className = Tooltip.tooltip.className.replace('show', '');
    }
};

export default Tooltip;