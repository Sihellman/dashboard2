import {JetView} from "webix-jet";
import {persons} from "models/persoptions";
import {projects} from "models/projoptions";

export default class NewTaskPopup extends JetView {
	config(){
		const _ = this.app.getService("locale")._;
		return {
			view:"window",
			position:"center",
			modal:true,
			head:_("Add a new task"),
			body:{
				view:"form",
				elementsConfig:{ labelPosition:"top" },
				rows:[
					{
						view:"text", label:_("Task"), name:"task",
						width:500
					},
					{
						cols:[
							{
								view:"combo", label:_("Project"),
								name:"project", options:projects
							},
							{
								view:"combo", label:_("Assignee"),
								name:"user", options:persons
							}
						]
					},
					{
						cols:[
							{
								view:"button", value:_("Cancel"),
								click:() => {
									this.getBack();
								}
							},
							{
								view:"button", value:_("Add"), type:"form",
								click:() => {
									this.saveTask();
								}
							}
						]
					}
				],
				rules:{
					user:webix.rules.isNotEmpty,
					task:webix.rules.isNotEmpty
				}
			}
		};
	}
	showWindow(){
		this.getRoot().show();
	}
	getBack(){
		this.getRoot().hide();
		this.getRoot().getBody().clear();
		this.getRoot().getBody().clearValidation();
	}
	saveTask(){
		const task = this.getRoot().getBody().getValues();
		if (this.getRoot().getBody().validate()){
			this.app.callEvent("add:task",[task]);
			this.getBack();
		}
	}
}