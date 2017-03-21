define(['emby-tabs', 'emby-button'], function () {
    'use strict';

    var tabType;
    var queryScope = document.querySelector('.skinHeader');

    function setTabs(type, selectedIndex, builder) {

        var viewMenuBarTabs;

        if (!type) {
            if (tabType) {

                document.body.classList.remove('withTallToolbar');
                viewMenuBarTabs = queryScope.querySelector('.viewMenuBarTabs');
                viewMenuBarTabs.innerHTML = '';
                viewMenuBarTabs.classList.add('hide');
                tabType = null;
            }
            return;
        }

        viewMenuBarTabs = queryScope.querySelector('.viewMenuBarTabs');

        if (!tabType) {
            viewMenuBarTabs.classList.remove('hide');
        }

        if (tabType != type) {

            var index = 0;

            var indexAttribute = selectedIndex == null ? '' : (' data-index="' + selectedIndex + '"');
            viewMenuBarTabs.innerHTML = '<div is="emby-tabs"' + indexAttribute + ' class="tabs-viewmenubar"><div class="emby-tabs-slider" style="white-space:nowrap;">' + builder().map(function (t) {

                var tabClass = 'emby-tab-button';

                var tabHtml;

                if (t.href) {
                    tabHtml = '<button onclick="Dashboard.navigate(this.getAttribute(\'data-href\'));" type="button" data-href="' + t.href + '" is="emby-button" class="' + tabClass + '" data-index="' + index + '"><div class="emby-button-foreground">' + t.name + '</div></button>';
                } else {
                    tabHtml = '<button type="button" is="emby-button" class="' + tabClass + '" data-index="' + index + '"><div class="emby-button-foreground">' + t.name + '</div></button>';
                }

                index++;
                return tabHtml;

            }).join('') + '</div></div>';

            document.body.classList.add('withTallToolbar');
            tabType = type;
            return true;
        }

        viewMenuBarTabs.querySelector('[is="emby-tabs"]').selectedIndex(selectedIndex);

        tabType = type;
        return false;
    }

    function getTabsElement() {
        return document.querySelector('.tabs-viewmenubar');
    }

    return {
        setTabs: setTabs,
        getTabsElement: getTabsElement
    };
});