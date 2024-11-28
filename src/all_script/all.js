import { inject_style } from "./inject_style";
import { register_keyshortcuts } from "../keybindings/keys";
import { injectUtils } from "./inject";

(function () {
	'use strict';

	injectUtils();
    inject_style();
	register_keyshortcuts();
})();
