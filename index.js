var teacher = {};
var student = {};
function submit() {
    var list = document.getElementById("text").value.split("\n");
    for(var i = 0;i<list.length;i++)
    {
        var str = list[i];
        //如果此行中包含“导师”关键字，则连续读取下一行直到读取到空行为止
        if(str.includes("导师"))
        {
            var teacher_name = str.substring(str.indexOf("：")+1);
            if(!teacher[teacher_name])
                teacher[teacher_name] = {};
            i += 1;
            //当此行不为空的时候执行
            while(list[i]!==""&&i<list.length)
            {
                //"级博士生："，"级硕士生："，"级本科生："
                var stu_msg = list[i];
                if(stu_msg.includes("级博士生：")||stu_msg.includes("级硕士生：")||stu_msg.includes("级本科生："))
                {
                    //获取学生的类型
                    var type = stu_msg.substring(0,stu_msg.indexOf("："));
                    //获取学生姓名的数组
                    var stu_list = stu_msg.substring(stu_msg.indexOf("：")+1).split("、");
                    //如果目前的数据中这个导师没有这个类型的学生，则直接将数组赋值
                    if(!teacher[teacher_name].hasOwnProperty(type))
                            teacher[teacher_name][type] = stu_list;
                    //如果目前的数据中这个导师有这个类型的学生，则将学生数组中的学生插入到已有的数组中，同时过滤掉同名学生
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
                //如果这行不是空行且内容中不包含"级博士生："，"级硕士生："，"级本科生："等关键字，说明有其他信息混进人员信息了，格式错误
                else{
                    show_menu();
                    alert("输入格式错误！\n若有多组输入，中间空一行。上半部分是人员信息，下半部分是技能树或所在公司历程。\n输入正确的部分已经记录完成")
                    console.log(teacher);
                    return;
                }
                i++;
            }
        }
        //如果该行没有“导师”关键字但是又包含"级博士生："，"级硕士生："，"级本科生："等关键字，说明前面有多余的空格，格式错误
        else if(str.includes("级博士生：")||str.includes("级硕士生：")||str.includes("级本科生："))
            {
                show_menu();
                alert("输入格式错误！\n人员信息和导师信息之间不能存在空行\n输入正确的部分已经记录完成");
                return;
            }
        //如果该行不包含“导师”，"级博士生："，"级硕士生："，"级本科生："等关键字，说明改行表示的是技能树或公司历程，将数据读取到 student 中
        else if(str.length)
        {
            //获取学生姓名
            var stu_name = str.substring(0,str.indexOf("："));
            //获取学生技能树或公司历程
            var skill_list = str.substring(str.indexOf("：")+1).split("、");
            //如果 student 中没有该学生的记录的话就直接在 student 中创建一个新的元素，key 为学生名， value 为技能树或公司历程
            if(!student.hasOwnProperty(stu_name))
                student[stu_name] = skill_list;
            //如果存在，则将新的技能树或公司历程数组插入到原有的数组中，并过滤已存在的元素。
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
    show_menu();
    console.log(teacher);
    console.log(student);
}

function show_menu(){
    //menu显示
    var menu = document.getElementById("menu");
    //在属性为 menu 的节点下创建子节点，节点的文本内容为各个导师的名字，并添加各种事件
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

//点击 menu 中的导师名字所触发的事件
function menu_name_click(name,obj){
    //阻止事件冒泡
    event.stopPropagation();
    //根据点击的节点的属性得出导师的名字，并以这个名字为文本内容在 tree 中创建新的子节点，并为子节点添加各种点击事件
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

    //处理 menu 菜单的样式变化
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


//点击导师名触发的事件
function ShowType(obj) {
    //阻止事件冒泡
    event.stopPropagation();
    //根据该节点缩放状态进行不同的操作
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
        //通过该节点的属性获取到导师的名字，根据导师名字在 teacher 中获取到学生类型的数组，并以每一个学生类型为文本内容在该节点下创建子节点
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


//点击学生类型节点触发的事件
function ShowStudent(obj){
    //阻止事件冒泡
    event.stopPropagation();
    //根据该节点缩放状态进行不同的操作
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
        //根据该节点的属性获取到导师和学生类型的信息，并根据这两个数据获取到一个学生列表，以这个学生列表内各个学生的名字为文本内容创建新的节点
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

//点击学生节点触发的事件
function ShowSkill(obj) {
    //阻止事件冒泡
    event.stopPropagation();
    //根据该节点缩放状态进行不同的操作
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
        //根据该节点的属性获取到学生名字，并根据学生名字在 student 中获取到该学生的技能树和公司历程列表，以这个列表内各个学生的名字为文本内容创建新的节点
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

//点击技能树或公司历程触发的事件
function f(){event.stopPropagation();}
