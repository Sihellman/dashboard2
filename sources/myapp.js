import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";

export default class MyApp extends JetApp{
	constructor(config){
		const defaults = {
			id		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: "/top/dashboard",
			theme	: webix.storage.local.get("curr_theme_team_progress") || "light"
		};

		super({ ...defaults, ...config });
	}
}

if (!BUILD_AS_MODULE){
	webix.ready(() => {
		if (!webix.env.touch && webix.ui.scrollSize && webix.CustomScroll)
			webix.CustomScroll.init();
		const app = new MyApp();
		app.use(plugins.Locale);
		app.render();
	});
}
