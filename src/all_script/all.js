import { inject_style }          from "./inject_style";
import { injectUtils }           from "./inject";
import { start_up }              from "./startup_code";
import { register_keyshortcuts } from "../keybindings/keys";

(function () {
	'use strict';

	injectUtils();
	inject_style();
	register_keyshortcuts();

	start_up();
})();
