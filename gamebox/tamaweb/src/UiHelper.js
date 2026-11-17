const UI = {
    specialProps: [
        'componentType',
        'parent',
        'children',
        'onClick',
        '_mount',
        'attributes',
    ],
    create: (props) => UI.ce(props),
    ce: (props) => {
        const e = document.createElement(props?.componentType || 'div');

        Object.keys(props).forEach(propName => {

            if(UI.specialProps.includes(propName)){
                switch(propName){
                    case 'children':
                        props.children?.forEach((child) => {
                            UI.ce({
                                ...child,
                                parent: e
                            })
                        })
                        break
                    case 'parent':
                        if(props.parentInsertBefore)
                            props.parent.insertBefore(e, props.parent.firstChild)
                        else
                            props.parent.appendChild(e);
                        break;
                    case 'onClick':
                        e.onclick = () => props.onClick(e)
                        break;
                    case '_mount':
                        e._mount = () => props._mount(e);
                        e._mount();
                        break;
                    case 'attributes':
                        props.attributes?.forEach(attr => {
                            e.setAttribute(attr[0], attr[1]);
                        })
                        break;
                }
                return;
            }
            e[propName] = props[propName];
        })
        return e;
    },
    genericButton: (props) => {
        return UI.ce({
            ...props,
            componentType: 'button',
            className: 'cila-btn',
        })
    },
    genericFlexContainer: (props) => {
        const element = UI.ce({
            classList: ['cila-generic-flex-container'],
            parent: document.querySelector('.screen-wrapper'),
        })
        element.close = () => element.remove();
        return element;
    },
    empty: (className) => {
        const e = document.createElement('div');
        if(className) e.className = className;
        return e;
    },
    genericListContainer: (backFn, backFnTitle) => {
        let backBtnName = 'Back';
        const activeListContainers = [...document.querySelectorAll('.screen-wrapper .generic-list-container')];
        const previousListItem = activeListContainers?.at(-1);
        if(activeListContainers.length > 0){ // to make sure it always display "back" when only one layer deep in the interaction tree
            backBtnName = backFnTitle
            || UI.lastClickedButton?.textContent?.trim()?.replace(' new!', '')
            || previousListItem?._listItems?.at(0)?.name
            || backBtnName;
        }
        UI.lastClickedButton = null;

        const list = document.querySelector('.cloneables .generic-list-container').cloneNode(true);
        // list.style['z-index'] = 3;
        list.close = function(){
            list.remove();
        }
        list.transitionAnim = () => {
            list.classList.remove('menu-animation');
            list.offsetWidth;
            list.classList.add('menu-animation');
        }
        if(backFn !== false){
            list.style.paddingTop = '0';
            UI.create({
                parent: list,
                componentType: 'button',
                innerHTML: ellipsis(backBtnName, 13),
                className: 'back-btn generic-btn solid primary bold sticky-top no-anim',
                onclick: () => {
                    if(backFn) backFn();
                    list.close();
                    // if(previousListItem && previousListItem.transitionAnim) previousListItem.transitionAnim();
                },
                children: [
                    {
                        componentType: 'i',
                        className: 'fa-solid fa-arrow-left',
                        style: `
                            margin-right: 4px;
                        `,
                        parentInsertBefore: true,
                    }
                ]
            })
        }
        UI.attachScrollableIndicator(list);
        document.querySelector('.screen-wrapper').appendChild(list);
        return list;
    },
    clearLastClicked: () => {
        UI.lastClickedButton = null;
    },
    genericListContainerContent: (contentString, listContainer) => {
        const content = UI.empty();
        content.innerHTML = contentString;
        listContainer?.appendChild(content);
        return content;
    },
    fadeOut: (element, timeMs, onEnd) => {
        if(!timeMs) timeMs = 300;
        element.classList.add('fade-out');
        element.style['animation-duration'] = `${timeMs}ms`;
        setTimeout(() => {
            UI.hide(element);
            if(onEnd) onEnd(element);
        }, timeMs);
    },
    attachScrollableIndicator: (element) => {
        if(!element) return;

        setTimeout(() => {
            const isScrollable = element.scrollHeight > element.clientHeight + 4;
            if(isScrollable){
                element.classList.add('scrollable-indicator');
            }
            element.addEventListener('scroll', () => {
                if (element.scrollTop > 0) {
                    element.classList.remove('scrollable-indicator')
                }
            })
        }, 2)
    },
    hide: (element) => {
        element.style.display = 'none';
    },
    show: (element) => {
        element.style.display = '';
    },
}

const GenericUIDef = {
    binaryConfirm: ({
        onAccept = () => {},
        onDecline = () => {},
        acceptLabel = 'Yes',
        declineLabel = 'No',
        text = 'Are you sure?',
    } = {}) => {
        return [text, [
            {
                name: acceptLabel,
                onclick: onAccept,
            },
            {
                name: declineLabel,
                onclick: onDecline,
                class: 'back-btn'
            }
        ]]
    },
    singleConfirm: (text, {
        onAccept = () => {},
        acceptLabel = 'Ok',
    } = {}) => {
        return [text, [
            {
                name: acceptLabel,
                onclick: onAccept
            }
        ]]
    }
}

const UIComponent = {
    PetDefMessageHead: ({ friendDef }) => `
        <div class="flex flex-gap-1 align-center">
            <div class="persona-avatar width-fit">
                ${friendDef.getCSprite(true)}
            </div>
            <small class="bold">${friendDef.name}</small>
        </div>
    `
}
