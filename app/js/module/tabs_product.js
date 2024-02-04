function changeTabsColor(tabs, active) {
    const tab = document.querySelectorAll(tabs);
    tab.forEach((item) => {
        item.addEventListener('click', () => {
            tab.forEach((itemTab) => {
                itemTab.classList.remove(active);
            });
            item.classList.add(active);
        });
    });
}

function changeForms(elem, card, active) {
    const elemsTab = document.querySelectorAll(elem);
    const elemsCards = document.querySelectorAll(card);
    if (elemsTab.length === 0 || elemsCards.length === 0) {
        console.log('no element');
        return;
    }

    elemsTab.forEach((item) => {
        item.addEventListener('click', () => {
            if (item.hasAttribute('data-list')) {
                elemsCards.forEach((cardItem) => {
                    cardItem.classList.add(active);
                })
            } else {
                elemsCards.forEach((cardItem) => {
                    cardItem.classList.remove(active);
                });
            }
        })
    });
}

changeForms('.shop-content__filter-btn', '.product-item', 'list-active');
changeTabsColor('.svg-tab', 'svg-btn--active');