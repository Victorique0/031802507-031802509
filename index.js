var teacher = {};
var student = {};
function submit() {
    var list = document.getElementById("text").value.split("\n");
    for(var i = 0;i<list.length;i++)
    {
        var str = list[i];
        if(str.includes("导师"))
        {
            var teacher_name = str.substring(str.indexOf("：")+1);
            if(!teacher[teacher_name])
                teacher[teacher_name] = {};
            i += 1;
            while(list[i]!=="")
            {
                //"级博士生："，"级硕士生："，"级本科生："
                var stu_msg = list[i];
                if(stu_msg.includes("级博士生：")||stu_msg.includes("级硕士生：")||stu_msg.includes("级本科生："))
                {
                    var type = stu_msg.substring(0,stu_msg.indexOf("："));
                    var stu_list = stu_msg.substring(stu_msg.indexOf("：")+1).split("、");
                    if(!teacher[teacher_name].hasOwnProperty(type))
                            teacher[teacher_name][type] = stu_list;
                    else
                        {
                            var pre_stu_list = teacher[teacher_name][type];
                            for(var stu_id = 0;stu_id<stu_list.length;stu_id++)
                                {
                                    var flag = 0;
                                    var now_stu = stu_list[stu_id];
                                    for(var pre_stu_id = 0;pre_stu_id<pre_stu_list.length;pre_stu_id++)
                                        {
                                            if(pre_stu_list[pre_stu_id]===now_stu)
                                                {
                                                    console.log(now_stu);
                                                    flag = 1;
                                                    break;
                                                }
                                        }
                                    if(flag===0)
                                        pre_stu_list[pre_stu_list.length] = now_stu;
                                }
                        }

                }
                i++;
            }
        }
        else if(str.length)
        {
            var stu_name = str.substring(0,str.indexOf("："));
            var skill_list = str.substring(str.indexOf("：")+1).split("、");
            if(!student.hasOwnProperty(stu_name))
                student[stu_name] = skill_list;
            else
            {
                var pre_skill_list = student[stu_name];
                for(var skill_id = 0;skill_id<skill_list.length;skill_id++)
                {
                    var flag = 0;
                    var now_skill = skill_list[skill_id];
                    for(var pre_skill_id = 0;pre_skill_id<pre_skill_list.length;pre_skill_id++)
                    {
                        if(pre_skill_list[pre_skill_id]===now_skill)
                        {
                            flag = 1;
                            break;
                        }
                    }
                    if(flag===0)
                        pre_skill_list[pre_skill_list.length] = now_skill;
                }
            }

        }
    }
    //menu显示
    var menu = document.getElementById("menu");
    for(var item in teacher){
        if(teacher[item]["in_menu"]!=="true")
            {
                var new_node = document.createElement("div");
                new_node.innerHTML = item;
                new_node.setAttribute("id","menu_name");
                new_node.setAttribute("onclick","menu_name_click(this.innerHTML,this)");
                new_node.setAttribute("onmouseover","menu_name_over(this)");
                new_node.setAttribute("onmouseout","menu_name_out(this)");
                new_node.setAttribute("chose","no");
                menu.appendChild(new_node);
                teacher[item]["in_menu"] = "true";
            }
    }
    var tree = document.getElementById("tree");
    while(tree.children.length!==0)
        tree.removeChild(tree.children[0]);
}

function menu_name_over(obj) {
    if(obj.getAttribute("chose")==="no")
        obj.setAttribute("style","background-color:orange;");
}

function menu_name_out(obj) {
    if(obj.getAttribute("chose")==="no")
        obj.setAttribute("style","background-color:lightgoldenrodyellow;")
}

function menu_name_click(name,obj){
    var tree = document.getElementById("tree");
    while(tree.children.length!==0)
        tree.removeChild(tree.children[0]);
    var new_teacher_node = document.createElement("div");
    var inner = document.createElement("div");
    inner.innerHTML = name;
    inner.setAttribute("onclick","ShowType(this)");
    inner.setAttribute("id","teacher_name");
    new_teacher_node.appendChild(inner);

    new_teacher_node.setAttribute("id","teacher_area");
    new_teacher_node.setAttribute("name",name);
    tree.appendChild(new_teacher_node);

    var menu_name = document.getElementById("menu").children;
    console.log(menu_name);
    for(var i = 0;i<menu_name.length;i++)
        {
            menu_name[i].setAttribute("style","background-color:lightgoldenrodyellow;");
            menu_name[i].setAttribute("chose","no");
        }
    obj.setAttribute("style","background-color:red;");
    obj.setAttribute("chose","yes;");
}

function ShowType(obj) {
    event.stopPropagation();
    if(obj.getAttribute("open")==="yes")
    {
        obj.setAttribute("open","no");
        obj.removeAttribute("style");
        var parent = obj.parentNode;
        while(parent.children.length>1)
            parent.removeChild(parent.children[1]);
    }
    else
    {
        obj.setAttribute("open","yes");
        obj.setAttribute("style","border-left:aqua 5px solid");
        var stu_type_list = teacher[obj.innerHTML];
        if(stu_type_list.length===0)
            return;
        for(var type_name in stu_type_list)
        {
            if(type_name==="in_menu")
                continue;
            var new_type_node = document.createElement("div");
            var inner = document.createElement("div");
            inner.innerHTML = type_name;
            inner.setAttribute("onclick","ShowStudent(this)");

            new_type_node.appendChild(inner);
            new_type_node.setAttribute("teacher",obj.parentNode.getAttribute("name"));
            new_type_node.setAttribute("type",type_name);
            new_type_node.setAttribute("id","type");
            obj.parentNode.appendChild(new_type_node);
        }
    }
}

function ShowStudent(obj){
    event.stopPropagation();
    //console.log(teacher);
    if(obj.getAttribute("open")==="yes")
    {
        obj.setAttribute("open","no");
        obj.removeAttribute("style");
        var parent = obj.parentNode;
        while(parent.children.length>1)
            parent.removeChild(parent.children[1]);
    }
    else
    {
        obj.setAttribute("open","yes");
        obj.setAttribute("style","border-left:aqua 5px solid");
        var stu_list = teacher[obj.parentNode.getAttribute("teacher")][obj.innerHTML];
        //console.log(stu_list);
        if(stu_list.length===0)
            return;
        for(var i=0;i<stu_list.length;i++)
        {
            var stu_name = stu_list[i];
            var new_stu_node = document.createElement("div");
            var inner = document.createElement("div");
            inner.innerHTML = stu_name;
            inner.setAttribute("onclick","ShowSkill(this)");
            new_stu_node.appendChild(inner);

            new_stu_node.setAttribute("name",stu_name);
            new_stu_node.setAttribute("id","student");
            new_stu_node.setAttribute("teacher",obj.parentNode.getAttribute("teacher"));
            new_stu_node.setAttribute("type",obj.parentNode.getAttribute("type"));
            obj.parentNode.appendChild(new_stu_node);
        }
    }
}

function ShowSkill(obj) {
    event.stopPropagation();
    if(obj.getAttribute("open")==="yes")
    {
        obj.setAttribute("open","no");
        obj.removeAttribute("style");
        var parent = obj.parentNode;
        while(parent.children.length>1)
            parent.removeChild(parent.children[1]);
    }
    else
    {
        obj.setAttribute("open","yes");
        obj.setAttribute("style","border-left:aqua 5px solid;");
        var skill_list = student[obj.innerHTML];
        if(!skill_list||skill_list.length===0)
            return;
        for(var i=0;i<skill_list.length;i++)
        {
            var skill_name = skill_list[i];
            var new_skill_node = document.createElement("div");
            new_skill_node.innerHTML = skill_name;
            new_skill_node.setAttribute("name",skill_name);
            new_skill_node.setAttribute("open","no");
            new_skill_node.setAttribute("id","skill");
            new_skill_node.setAttribute("onclick","f()");
            obj.parentNode.appendChild(new_skill_node);
        }
    }
}

function f(){event.stopPropagation();}
