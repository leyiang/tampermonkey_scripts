function slog(...args) {
    console.log("%c" + "[SBili]", "color:red;font-weight:bold;");
    console.log("[SBili] ", ...args);
}

function disableElHover(el) {
    slog("Try to disable: ", el);

    let allowHover = false;
    let open = true;

    el.addEventListener("mouseenter", e => {
        // Click stimulate hover event
        if( allowHover ) return;
        e.stopPropagation();
    }, true);

    el.addEventListener("mouseleave", e => {
        if( allowHover ) return;
        e.stopPropagation();
    }, true);

    el.addEventListener("click", e => {
        const hoverEvent = document.createEvent("MouseEvents");
        hoverEvent.initMouseEvent(open ? "mouseenter" : "mouseleave");
        open = !open;

        allowHover = true;

        setTimeout(() => {
            allowHover = false;
        }, 100 );

        el.dispatchEvent( hoverEvent );
    });
}

function disableHover( sel_list ) {
    slog("Try to disable hover");

    sel_list.forEach( sel => {
         listenForDOM( sel, el => {
             disableElHover(el);
         });
    });
}

function listenForDOM(sel, cb, tryCount = 0) {
    if( tryCount > 20 ) return;

    const el = document.querySelector(sel);

    if( el && el instanceof HTMLElement ) {
        slog("[BILI], Got el", el);
        cb?.( el );
    } else {
        setTimeout(() => listenForDOM(sel, cb, tryCount + 1), 1000 );
    }
}


function disableEnterKey() {
    window.addEventListener("keydown", e => {
        if( e.key === "Enter" ) {
            slog("Try to block enter");

            if( document.activeElement?.tagName === "INPUT" ) {
                // Allow Enter key to work in input
                return;
            }

            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}

function updateNewSearchParam(search) {
    const url = new URL(window.location.href);
    url.search = search;

    const newURL = url.toString();
    slog('location changed! new url:', newURL );
    window.history.replaceState({path:newURL},'',newURL);
}

function modifyURL() {
    let removed = 0;
    const raw = window.location.search;
    const search = new URLSearchParams(raw);
    const remove_list = ["vd_source", "spm_id_from", "from_source", "search_source", "o", "vt"];
    let newSearch = raw;

    remove_list.forEach(key => {
        if( search.get(key) ) {
            search.delete(key);
            removed += 1;
        }
    });

    newSearch = search.toString();

    if( removed > 0 ) {
        updateNewSearchParam( newSearch );
    }
}

function disableTrace() {
    window.navigation.addEventListener("navigate", (event) => {
        console.log("navigate event");
        setTimeout(() => {
            // after navigate event trigger
            // we can't get new url immediately
            // so add a little timeout
            modifyURL();
        }, 100);
    });

    // modify url while page first load
    // first load will not trigger navigate event
    modifyURL();
}

function parseTime(strTime="00:00") {
    const info = strTime.split(":").map(s => Number(s)).reverse();
    let res = 0;

    res += info[0];
    res += info[1] * 60;

    return res;
}

function getTime() {
    const el = document.querySelector(".bpx-player-ctrl-time-current");
    if( ! el ) throw "Time el not found";

    const raw = el.textContent;
    const sec = parseTime( raw );

    const url = new URL( window.location.href );
    const search = new URLSearchParams( window.location.search );

    search.set("t", sec);
    url.search = search;

    const ref = url.toString();
    slog("Ref url: " + ref );
    navigator.clipboard.writeText( ref );
}


function newButtonNode(title) {
    const button = document.createElement("button");
    button.innerText = title;
    return button;
}

function insertButton() {
    listenForDOM(".video-info-detail-list", wrap => {
        const btn = newButtonNode("Get Ref URL");
        btn.addEventListener( "click", getTime );

        // 貌似B站会自动替换Header （什么鬼操作
        // 如果直接添加Button会让B站代码出问题（Header空白
        // 添加500ms延迟以规避
        setTimeout(() => {
            wrap.appendChild( btn );
        }, 6000);
    });
}

function getRandomItem(arr) {
    return arr[
        Math.floor( Math.random() * arr.length )
    ];
}

function insertRandomButton() {
    listenForDOM(".watch-later-list", wrap => {
        const btn = newButtonNode("随机播放");
        btn.addEventListener( "click", getTime );
        btn.className = "s-btn";

        btn.addEventListener("click", () => {
            const list = wrap.querySelectorAll(".av-item");
            const toPlay = getRandomItem(list);

            const link = toPlay.querySelector(".t");
            const del = toPlay.querySelector(".btn-del");
            const bvid = link.href.split("/").pop();
            const newUrl = "https://www.bilibili.com/video/" + bvid;

            window.open( newUrl );
            del.click();
        });

        wrap.querySelector(".r-con").appendChild( btn );
    });
}

function setWidescreen() {
    listenForDOM(".bpx-player-ctrl-wide", el => {
        //
        if( ! document.fullscreen ) {
            el.click();
        }
    });
}
const sel_list = [
    ".up-info--left",
    ".up-detail-top",
    ".bpx-player-ctrl-quality",
    ".bpx-player-ctrl-playbackrate",
    ".bpx-player-ctrl-subtitle",
    ".bpx-player-ctrl-volume",
    ".bpx-player-ctrl-setting",
    ".bpx-player-video-btn-dm",
    ".bpx-player-dm-setting",
];

function updateRole() {
    const selectors = [
        '.bili-dyn-action', '.bili-rich-text-module.at',
        '.video-pod__item', '.toggle-btn', '.bili-rich-text__action',
        '.bili-dyn-up-list__item', '.history-item'
    ];

    selectors.forEach(selector => {
        listenForDOM(selector, _ => {
            document.querySelectorAll(selector).forEach( el => {
                el.setAttribute('role', 'button');
            });
        });
    });

    document.addEventListener("DOMNodeInserted", e => {
        if( e.target instanceof HTMLElement ) {
            selectors.forEach(selector => {
                e.target.querySelectorAll(selector).forEach( el => {
                    el.setAttribute('role', 'button');
                });
            });
        }
    });
}


function inputBlur() {
    function hideSearchSuggestion(hide=false) {
        const panel = document.querySelector(".search-panel");

        if ( panel ) {
            panel.style.display = hide ? "none" : "";
        }
    }

    listenForDOM(".nav-search-input", el => {
        el.addEventListener("blur", (e) => {
            if (event.type === 'blur' && event.relatedTarget && event.relatedTarget.tagName !== "INPUT") {
                console.log('Click blur event', event.relatedTarget);
                return;
            }

            hideSearchSuggestion(true);
        });

        el.addEventListener("focus", () => {
            hideSearchSuggestion();
        });
    });

    listenForDOM(".search-input-el", el => {
        el.addEventListener("blur", (e) => {
            const panel = document.querySelector(".search-panel-popover");
            panel.style.display = "none";
        });
    });
}


function center_player() {
    const el = document.querySelector("video");
    console.log( "vvv", el );

    setTimeout(() => {
        el.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
    }, 100);
    // window.scrollTo(0, 70);
}

// dir = {prev|next}
function navigate_page(dir) {
    const wait = 150;

    // Search Page
    if( window.location.host == "search.bilibili.com" ) {
        const wrap = document.querySelector(".vui_pagenation--btns");

        dir == "prev"
            ? wrap.firstElementChild?.click()
            : wrap.lastElementChild?.click()

        setTimeout(() => {
            document.documentElement.scrollTop = 227;
        }, wait );
    // Space Page
    } else if (window.location.host == "space.bilibili.com") {

        if( dir == "prev" ) {
            document.querySelector(".be-pager-prev")?.click();
        } else {
            document.querySelector(".be-pager-next")?.click();
        }

        setTimeout(() => {
            document.documentElement.scrollTop = 452;
        }, wait );
    }
}

function send_key_press(key="ArrowRight", eventType="keydown") {
    const keyCode = {
        ArrowLeft: 37,
        ArrowRight: 39,
        ArrowUp: 38,
        ArrowDown: 40,
    }[ key ];

    const evt = new KeyboardEvent(eventType, {
        key: key,
        code: key,
        keyCode: keyCode,
        which: keyCode,
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
        metaKey: false,
        repeat: false,
        bubbles: true
    });

    window.dispatchEvent(evt);
}

function key_shortcuts() {
    document.addEventListener('keydown', (e) => {
        console.log( e.key );

        if( e.key === "`" ) {
            let curFull = !!document.fullscreenElement;

            const btn = document.querySelector(".bpx-player-ctrl-full").click()

            if( curFull && document.documentElement.scrollTop < 690 ) {
                // 让播放器在屏幕居中
                center_player()
            }
        } else if ( e.key == "a" || e.key == "s" ) {
            if( document.activeElement.tagName == "INPUT" ) {
                return;
            }

            if( ["search.bilibili.com", "space.bilibili.com"].includes(window.location.host) ) {
                navigate_page(
                    // "1" means prev
                    // "2" means next
                    e.key == "a" ? "prev" : "next"
                );
            } else {
                send_key_press(
                    e.key == "a" ? "ArrowLeft" : "ArrowRight"
                );
            }
        } else if ( e.key == "A" || e.key == "S" ) {
            send_key_press(
                e.key == "A" ? "ArrowDown" : "ArrowUp"
            );
        } else if (e.key == "c" ) {
            // svg-icon 控制字幕打开与关闭
            // -subtitle 控制字幕管理菜单
            // 这里实现: 开关字幕但不显示菜单
            document.querySelector(".bpx-player-ctrl-subtitle .bpx-common-svg-icon").click();
            document.querySelector(".bpx-player-ctrl-subtitle").click();
        }
    });

    document.addEventListener('keyup', (e) => {
        if ( e.key == "a" || e.key == "s" ) {
            send_key_press(
                e.key == "a" ? "ArrowLeft" : "ArrowRight",
                "keyup"
            );
        }
    });

}

(function() {
    'use strict';
    slog("Bili Enter Blocker Started");

    /* Disable Enter Key */
    disableEnterKey();

    /* Disable El Hover */
    disableHover( sel_list );

    /* Disable Bili Generating vd_source */
    // disableTrace();

    /* Insert Buttons */
    insertButton();

    /* Default Wide Screen */
    setWidescreen();

    /* 随即播放按钮 - 稍后再看页面 */
    insertRandomButton();

    inputBlur();

    updateRole();

    key_shortcuts();
})();
