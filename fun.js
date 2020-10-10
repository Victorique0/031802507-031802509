function submit(msg,input_teacher,input_student) {
    var teacher = {};
    var student = {};
    var list = msg.split("\n");
    var error_type = 0;
    for(var i = 0;i<list.length;i++)
    {
        var str = list[i];
        if(str.includes("导师"))
        {
            var teacher_name = str.substring(str.indexOf("：")+1);
            if(!teacher[teacher_name])
                teacher[teacher_name] = {};
            i += 1;
            while(list[i]!==""&&i<list.length)
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
                                    //console.log(now_stu);
                                    flag = 1;
                                    break;
                                }
                            }
                            if(flag===0)
                                pre_stu_list[pre_stu_list.length] = now_stu;
                        }
                    }

                }
                else{
                    //show_menu();
                    //alert("输入格式错误！\n若有多组输入，中间空一行。上半部分是人员信息，下半部分是技能树或所在公司历程。\n输入正确的部分已经记录完成")
                    //console.log(teacher);
                    //return;
                    error_type = 1;
                    break;
                }
                i++;
                if(error_type!==0)
                    break;
            }
            if(error_type!==0)
                break;
        }
        else if(str.includes("级博士生：")||str.includes("级硕士生：")||str.includes("级本科生："))
        {
            //show_menu();
            //alert("输入格式错误！\n人员信息和导师信息之间不能存在空行\n输入正确的部分已经记录完成");
            //return;
            //console.log("eroosakljdhashdlkashdkasdas\n");
            //input_student = {};
            //student = {};
            error_type = 2;
            break;
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

    //验证导师
    if(teacher.length!==input_teacher.length||student.length!==input_student.length)
        return 0;
    for(var teacher_name in teacher)
    {
        if(!input_teacher.hasOwnProperty(teacher_name))
        {
            console.log("teacher name error\n");
            return 0;
        }
        var type = teacher[teacher_name];
        var input_type = input_teacher[teacher_name];
        //console.log(type);
        //console.log(input_type);
        if(type.length!==input_type.length)
        {
            console.log("type length error\n");
            return 0;
        }
        for(var type_name in type)
        {
            if(input_teacher.hasOwnProperty(type_name))
            {
                //console.log(type_name);
                console.log("type name error\n");
                return 0;
            }
            var stu_list = type[type_name];
            var input_stu_list = input_type[type_name];
            if(stu_list.length!==input_stu_list.length)
            {
                console.log("stu_list length error");
                return 0;
            }
            for(var item = 0;item<stu_list.length;item++)
            {
                var now_stu = stu_list[item];
                for(var input_item = 0;input_item<input_stu_list.length;input_item++)
                {
                    var flag = 0;
                    var now_input_stu = input_stu_list[input_item];
                    if(now_stu!==now_input_stu)
                        continue;
                    if(now_stu===now_input_stu)
                    {
                        flag = 1;
                        break;
                    }
                }
                if(flag===0)
                {
                    console.log("student name error in teacher list\n");
                    return 0;
                }
            }
        }
    }
    if(student.length!==input_student.length)
    {
        console.log("student skill length error\n");
        return 0;
    }
    //console.log(error_type);
    //console.log(input_student);
    //console.log(student);
    if(student.length===0)
        return 1;
    for(var stu_name in student) {
        if (!input_student.hasOwnProperty(stu_name))
        {
            console.log("student name error in student list\n");
            return 0;
        }
        if(student[stu_name].length!==input_student[stu_name].length)
        {
            console.log("skill length error\n");
            return 0;
        }
        for(var skill_name_item  = 0;skill_name_item<student[stu_name].length;skill_name_item++)
        {
            var now_skill = student[stu_name][skill_name_item];
            for(var input_skill_name_item = 0;input_skill_name_item<input_student[stu_name].length;input_skill_name_item++)
            {
                var flag = 0;
                if(input_student[stu_name][input_skill_name_item]!==now_skill)
                    continue;
                if(input_student[stu_name][input_skill_name_item]===now_skill)
                {
                    flag = 1;
                    break;
                }
            }
            if(flag===0)
            {
                console.log("skill name error\n");
                return 0;
            }
        }
    }

    return 1;
}

module.exports = submit;