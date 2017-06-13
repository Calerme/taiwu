/*******************************
 * 品势页 main.js
 *******************************/

window.addEventListener('DOMContentLoaded', function () {

    // Functions
    function showSubMenu(element) {
        element.style.display = 'table';
    }

    function hideSubMenu(element) {
        element.style.display = 'none';
    }

    // MenuLi Click Event
    function clickEvent() {
        [].forEach.call(menuLis, function (element, index, menuLis) {
            element.classList.remove('active');
        });
        this.classList.add('active');

        // hide all submenus
        [].forEach.call(submenus, function (element, index, submenus) {
            element.style.display = 'none';
        });
        // show the submenus
        submenus[this.dataset.index] && (submenus[this.dataset.index].style.display = 'table');
    }

    // Hide All Sections
    function hideSections(sections) {
        // [].forEach.call(sections, function (elem, i, sections) {
        //     elem.style.display = 'none';
        // });
        [].forEach.call(sections, function (elem, i, sections) {
            elem.classList.remove('active');
        });
    }

    // Show Section
    function showSection(i) {
        if (!sections[i]) return;
        // sections[i].style.display = 'block';
        sections[i].classList.add('active');
        // 加载此section下的 iframe
        lazyIframe(sections);
    }

    // Reset Section 防止切换到其它section时，上一个section中的视频还在播放。
    function resetSection(sections) {
        [].forEach.call(sections, function (elem, i, sections) {
            if (elem.classList.contains('active')) {
                var _html = elem.innerHTML;
                elem.innerHTML = '';
                elem.innerHTML = _html;
            }
        });
    }
    // 惰性加载 iframe
        // 判断 iframe 是否进入视口，进入即加载
    function letIframeLoad (iframes) {
        [].forEach.call(iframes, function (elem, i, iframes) {
            // 如果 elem 距离视口顶部的距离小于视口的高度，
            // 且iframe没有被加载，那么将data.original赋给它的src
            if (elem.getBoundingClientRect().top < document.documentElement.clientHeight && !elem.dataset.isload) {
                if (elem.dataset.original) {
                    elem.src = elem.dataset.original;
                    elem.dataset.isload = 'true';
                }
            }

        });
    }
        // 惰性加载函数，内部执行 letIframeLoad
    function lazyIframe (sections) {

        // 检查目前是哪个 Section被显示
        var theSection = null;
        [].forEach.call(sections, function (elem, i, sections) {

            if ( elem.classList.contains('active')) {
                theSection = elem;
            }

        });
        // 找到当前 Section 的所有 iframe
        var iframes = theSection.getElementsByTagName('iframe');
        letIframeLoad(iframes);
    }

    // GetElements
    var menuLis = document.getElementsByClassName('menu')[0].getElementsByTagName('li');
    var submenus = document.getElementsByClassName('submenu');
    var dataSectionIndexs = document.querySelectorAll('[data-section-index]');
    var sections = document.querySelectorAll('section');

    // 使首页 iframe 加载
    lazyIframe(sections);

    // Add Scroll Event to Window
    window.addEventListener('scroll', function () {
       lazyIframe(sections);
    });

    // Add Click Event to menuLis
    [].forEach.call(menuLis, function (element, index, menuLis) {
        element.dataset.index = index;
        element.addEventListener('click', clickEvent);
    });
    // Add Click Event to submenus' Lis
    [].forEach.call(submenus, function (element, index, submenus) {
        var lis = submenus[index].getElementsByTagName('li');
        [].forEach.call(lis, function (element, index, lis) {
            var _lis = lis;
            element.addEventListener('click', function () {
                [].forEach.call(_lis, function (element, index, _lis) {
                    element.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    });
    // Add Click Event to data-section-index
    [].forEach.call(dataSectionIndexs, function (element, index, dataSectionIndexs) {

        element.addEventListener('click', function () {
            resetSection(sections);

            // 如果dataSectionIndex为空，则说明它下面还有二级菜单
            if (!this.dataset.sectionIndex) {
                var submenusLis = submenus[this.dataset.index].getElementsByTagName('li');

                // 找到目前二级菜单中选中的是哪个
                var i = 0;
                while (submenusLis[i]) {
                    if (submenusLis[i].classList.contains('active')) {
                        hideSections(sections);
                        showSection(submenusLis[i].dataset.sectionIndex);
                        break;
                    }
                    i++;
                }
                // 显示二级菜单后此事件就结束
                return;
            } else {
                // 没有二级菜单就显示自身对应的section
                hideSections(sections);
                showSection(this.dataset.sectionIndex);
            }

        });

    });

});