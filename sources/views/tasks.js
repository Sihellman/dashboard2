import {JetView} from "webix-jet";
import {tasks} from "models/tasks";
import {persons} from "models/persons";

export default class TasksView extends JetView {
	config(){
		const _ = this.app.getService("locale")._;
		return {
			view:"datatable",
			gravity:2,
			select:"multiselect",
			editable:true, editaction:"dblclick",
			columns:[
				{
					id:"status", width:40, header:"", sort:"int",
					template: obj => {
						if (obj.status)
							return "<span class='webix_icon mdi mdi-check-circle complete'></span>";
						else
							return "<span class='webix_icon mdi mdi-clock incomplete'></span>";
					}
				},
				{
					id:"task", fillspace:3, header:_("Task"),
					sort:"text", editor:"text",
					template: obj => _(obj.task)
				},
				{
					id:"project", fillspace:1, header:_("Project"),
					sort:"text", editor:"select",
					options:[
						{ id:"Support", value:"Support" },
						{ id:"AutoCat", value:"AutoCat" },
						{ id:"CompuHope", value:"CompuHope" },
						{ id:"Cubebeat", value:"Cubebeat" }
					],
					template: obj => {
						return `<span class="${obj.project.toLowerCase()} 
							tag">&nbsp;${obj.project}&nbsp;</span>`;
					}
				},
				{
					id:"user", fillspace:1, header:_("User"),
					collection:persons, sort:"text", editor:"select"
				},
				{
					id:"start", fillspace:1,
					format:webix.Date.dateToStr("%d %M %y"),
					editor:"date", sort:"date",
					header:_("Start")
				},
				{
					id:"end", fillspace:1, header:_("Completed"),
					sort:"date", template: obj => {
						const format = webix.Date.dateToStr("%d %M %y");
						if (!obj.end)
							return _("incomplete");
						else return format(obj.end);
					}
				}
			],
			on:{
				onAfterSelect:function(row){
					const user = this.$scope.getRoot().getItem(row.id).user;
					this.$scope.app.callEvent("task:select",[user]);
					this.showItem(row.id);
				}
			},
			onClick:{
				"mdi":function(ev,id){
					const new_status = !this.getItem(id.row).status;
					const end_date = new_status ? new Date() : null;
					this.updateItem(id.row,{status:new_status,end:end_date});
				}
			}
		};
	}
	init(view){
		view.sync(tasks);

		this.on(this.app,"person:select",(name,pr,id) => {
			let res = tasks.find((obj) => id == obj.user);
			view.unselect();
			if (res.length){
				for (let i = 0; i < res.length; i++){
					view.select(res[i].id,true)
				}
			}
		});
	}
}
