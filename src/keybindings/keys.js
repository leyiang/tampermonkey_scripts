import { is_host } from "../utils/url_check";
import { bili_keys } from "./bili_keys";
import { ytp_keys }  from "./ytp_keys";

export function register_keyshortcuts() {
    if( is_host("ytp") ) {
		ytp_keys();
    }


    if( is_host("bili") ) {
		bili_keys();
    }


    if( is_host("live_bili") ) {
        document.addEventListener('keydown', (e) => {
            if (e.key === "`") {
                document.fullscreenElement ?
                    document.exitFullscreen() :
                    document.querySelector('video').requestFullscreen()
            }
        });
    }
}
