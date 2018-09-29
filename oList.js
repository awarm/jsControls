/**
 * Created by Ivan Mokrotovarov on 11.09.2018.
 */


class oList{
    constructor(list,target,options = {}){
        this.list=list;
        this.target = target;
        this.options = {};
        Object.assign(this.options,options);
    }

    static filter(list_id, input_id) {
        let input, filter, ul, li, a, i;
        input = document.getElementById(input_id);
        filter = input.value.toUpperCase();
        ul = document.getElementById(list_id);
        li = ul.getElementsByClassName('list-group-item');

        for (i = 0; i < li.length; i++) {
            a = li[i];//.getElementsByTagName("a");
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
    getFieldDescription(fieldName){
        return (typeof this.options.fields!=='undefined'?(this.options.fields[fieldName]?this.options.fields[fieldName]:fieldName):fieldName);
    }

    getFormHeader(){
        let title="List";
        if (typeof this.options.title!=='undefined')
            title = this.options.title;
        let html =  "<div class='panel panel-default'><div class='panel-heading'>"+title;
        if (typeof this.options.titleButtons!=='undefined')
            html +=this.options.titleButtons;
        html +="</div><div class='panel-body'>";
        return html;

    }
    getSearchBlock(){
        let html = "<div class='input-group ' style='width:100%'>";
        html += "<input id='"+this.target+"_search' type='search'  onkeyup='oList.filter(\""+this.target+"_list\",\""+this.target+"_search\")' class='form-control ' placeholder="+this.getFieldDescription("search")+">";
        html += '</div>';
        return html;
    }
    getItemHtml(tag,text){
        return "<a href='#' class='list-group-item pad5' data-alias='" + tag + "'>" + text + "</a>";
         //"<div class='form-group'><label for='af_"+tag+"'>"+name+"</label><input class='form-control' id='af_"+tag+"' value='"+value+"'></div>";
    }
    getFormFooter(){
        let html="<div class='panel-footer'><div class='btn-group'> ";
        let click="";
        if (typeof this.options.click!=='undefined')
            click = " onclick='" + this.options.click + "'";
        if (this.options.showSubmit) {
            html += "<button type='submit' class='btn btn-success' " + click + ">" + this.getFieldDescription("submit") + "</button>";
        }
        if (this.options.showCancel){
            html+="<button type='reset' class='btn btn-warning'>"+this.getFieldDescription("cancel")+"</button>";
        }
        html+="</div></div>";
        return html;
    }
    createForm(){
        let trg = $("#"+this.target);
        trg.empty();
        let html=this.getFormHeader();
        if (this.options.showSearch)
            html+=this.getSearchBlock();
        html += "<div class='list-group ' id='"+this.target+"_list'>";
        for (let tag in this.list){
            let item = this.list[tag];
            html+=this.getItemHtml(this.getId(item),this.getText(item));
        }
        html+="</div></div>";
        if (this.options.showFooter || this.options.showSubmit || this.options.showCancel) {
            html += this.getFormFooter();
        }
        html+="</div>";
        trg.append(html);
        $(('#'+this.target)).on('click',"a.list-group-item", $.proxy(this.onSelect,this));
    }



    onSelect(e){
        var $this = $(e.target);
            var $alias = $this.data('alias');
            $("#"+$this.parent()[0].id+" > .active").removeClass('active');
            $this.addClass('active')
            if (this.options.onSelect){
                this.options.onSelect($this);
            }
            return false;
    }
    getId(item){
        if (this.options.getId){
            return this.options.getId(item);
        }else
        {
            return item.id;
        }
    }

    getText(item){
        if (this.options.getText){
            return this.options.getText(item);
        }else
        {
            return item.name;
        }
    }


    onSubmit(){
        if (this.options.onSubmit){
            this.options.onSubmit(this);
        }
    }


}