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

function listenForDOM(sel, cb) {
    const el = document.querySelector(sel);

    if( el && el instanceof HTMLElement ) {
        slog("[BILI], Got el", el);
        cb?.( el );
    } else {
        setTimeout(() => listenForDOM(sel, cb), 1000 );
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
        '.video-pod__item'
    ];

    selectors.forEach(selector => {
        listenForDOM(selector, _ => {
            document.querySelectorAll(selector).forEach( el => {
                el.setAttribute('role', 'button');
            });
        });
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
            if (event.type === 'blur' && event.relatedTarget) {
                console.log('Click blur event');
            } else if (event.type === 'blur' && !event.relatedTarget) {
                hideSearchSuggestion(true);
            }
        });

        el.addEventListener("focus", () => {
            hideSearchSuggestion();
        });
    });
}

function key_shortcuts() {
    document.addEventListener('keydown', (e) => {
        console.log( e.key )
        if( e.key === "`" ) {
            document.querySelector(".bpx-player-ctrl-full").click()
            console.log( document.querySelector(".bpx-player-ctrl-full") )
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
