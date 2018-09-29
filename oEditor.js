/**
 * Created by Ivan Mokrotovarov on 10.09.2018.
 *
 */

'use strict';

class oEditor {

    constructor(obj,target,options = {}){
        this.obj=obj;
        this.target = target;
        this.options = {};
        Object.assign(this.options,options);
        this.prefix = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    }
    getFieldDescription(fieldName){
        return (typeof this.options.fields !== 'undefined'?(this.options.fields[fieldName]?this.options.fields[fieldName]:fieldName):fieldName);
    }
    getFormHeader(){
        let title="Editing";
        if (typeof this.options.title !== 'undefined')
            title = this.options.title;
        return "<div class='panel panel-default'><div class='panel-heading'>"+title+"</div><div class='panel-body'>";
    }
    getSelectFieldHtml(tag){
        let name = this.getFieldDescription(tag)
        let value = this.obj[tag];
        let html = "<div class='form-group' id='div"+this.prefix+"_"+tag+"'><label for='"+this.prefix+"_"+tag+"'>"+name+"</label><select class='form-control' id='"+this.prefix+"_"+tag+"'>";
        let list= this.options.selectfields[tag];
        for(let val in list){
            let sel = "";
            let id = "";
            let text = list[val];
            let d = text;
            if (typeof list[val] == "object") {
                d = Object.entries(list[val])[0][0];
                id = " value = '" + d + "'";
                text = Object.entries(list[val])[0][1];
            }
            html += "<option " + id + ">" + text + "</option>";

        }
        html+="</select></div>";
        return html;
    }
    getFieldHtml(tag){
        let name = this.getFieldDescription(tag)
        let value = this.obj[tag];
        return "<div class='form-group' id='div"+this.prefix+"_"+tag+"'><label for='"+this.prefix+"_"+tag+"'>"+name+"</label><input class='form-control' id='"+this.prefix+"_"+tag+"' value='"+value+"'></div>";
    }
    getFormFooter(){
        let html="<div class='panel-footer'><div class='btn-group text-right'> ";
        let click="";
        // if (typeof this.options.click!=='undefined')
        //     click = " onclick='" + this.options.click + "'";
        html+="<button type='submit' id='btn"+this.prefix+"_submit' class='btn btn-success' "+click+">"+this.getFieldDescription("submit")+"</button>";
        if (this.options.showDelete){
            // if (typeof this.options.onDelete!=='undefined')
            //     click = " onclick='" + this.options.onDelete+ "'";
            html+="<button type='button' id='btn"+this.prefix+"_delete' class='btn btn-danger'>"+this.getFieldDescription("delete")+"</button>";
        }
        if (this.options.showCancel){
            html+="<button type='reset' id='btn"+this.prefix+"_reset' class='btn btn-warning'>"+this.getFieldDescription("cancel")+"</button>";
        }
        html+="</div></div>";
        return html;
    }

    errorParse(errors){
        this.clearErrors();
        for (let e in errors){
            let inp = $("#div"+this.getFieldId(e));
            inp.addClass("has-error");
            inp.addClass("has-feedback");
            $("#"+this.getFieldId(e)).after("<span class='help-block'>"+errors[e]+"</span>")
            $("#"+this.getFieldId(e)).after("<span class='glyphicon glyphicon-warning-sign form-control-feedback'></span>")

        }
    }

    clearErrors(){
        $("#"+this.target+" .form-control-feedback").remove();
        $("#"+this.target+" .help-block").remove();
        $("#"+this.target+" .has-error").removeClass("has-error");
        $("#"+this.target+" .has-feedback").removeClass("has-feedback");
    }

    createForm(){
        let trg = $("#"+this.target);
        trg.empty();
        let html=this.getFormHeader();
        for (let tag in this.obj){
            if (typeof this.options.hidefields !== "undefined" && jQuery.inArray(tag,this.options.hidefields)>=0)
                continue;
            if (typeof this.options.selectfields !== "undefined" && this.options.selectfields[tag])
            {
                html+=this.getSelectFieldHtml(tag);
            }else
                html+=this.getFieldHtml(tag);
        }
        html+="</div>";
        if (this.options.showFooter || this.options.showSubmit|| this.options.showCancel || this.options.showReset ) {
            html += this.getFormFooter();
        }
        html+="</div>";
        trg.append(html);
        // change selected value
        if (typeof this.options.selectfields !== "undefined"){
            for (let tag in this.options.selectfields){
                $("#"+this.prefix+"_"+tag).val(this.obj[tag]);
            }
        }
        if (typeof this.options.events !== "undefined" ) {
            for (let e in this.options.events) {
                let ev = this.options.events[e];
                $("#" + this.prefix + "_" + e).on(ev.type, this, ev.handler);
            }
        }

        // assign button events
        if (typeof this.options.onDelete!=='undefined'){
            $("#btn"+this.prefix+"_delete").on("click",this,$.proxy(this.onDelete,this));
        }
        if (typeof this.options.onSubmit!=='undefined'){
            $("#btn"+this.prefix+"_submit").on("click",this,$.proxy(this.onSubmit,this));
        }
        if (typeof this.options.onReset!=='undefined'){
            $("#btn"+this.prefix+"_reset").on("click",this,$.proxy(this.onReset,this));
        }
    }

    onReset(e){
        if (this.options.onDelete){
            this.options.onDelete(this);
        }
        else
            this.createForm();
    }

    onDelete(e){
        if (this.options.onDelete){
            this.options.onDelete(this);
        }
    }

    onSubmit(e){
        if (this.options.onSubmit){
            this.options.onSubmit(this);
        }
    }

    getFieldId(tag){
        return this.prefix + "_" + tag;
    }
    getChangedObject(){
        let result = {};
        Object.assign(result,this.obj);
        for (let tag in result){
            let inp = $("#"+this.prefix + "_"+tag);
            if (inp.length>0)
                result[tag]=inp.val();
        }
        return result;
    }
    hide(){
        let trg = $("#"+this.target);
        trg.empty();
    }

}