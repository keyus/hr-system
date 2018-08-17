import axios from 'axios'
import router from '../router/index'
import cookie from '../util/cookie'

axios.defaults.baseURL = '/api';
// try {
//     if (process.env.NODE_ENV === 'development') {
//         axios.defaults.baseURL = '';
//     }
// }
// catch (e) {
// }
axios.defaults.withCredentials = true;
axios.interceptors.response.use(response => {
    return response;
}, (err) => {
    switch (err.response.status) {
        case 403:
            cookie.keys().forEach(key => cookie.removeItem(key));
            router.push('/error/403');
            break;
        case 504:
            router.push('/dashboard/error/500');
            break;
        case 500:
            router.push('/dashboard/error/500');
            break;
    }
    return Promise.reject(err);
});

export const login = (data) => {
    return axios.post('/account/login', data);
}

//----------------------------------------------------------------------

//添加管理员
export const createUser = (data) => {
    return axios.post('/account/addAccount', data);
}

//修改管理员
export const updateUser = (data, isChangeState) => {
    let op = Object.assign({}, data);
    isChangeState && (op.state = op.state ? 0 : 1);
    return axios.post('/account/updateAccount', op);
}

//删除管理员
export const deleteUser = (guid) => {
    return axios.post('/account/deleteAccount', {guid});
}

//管理员列表
export const userList = (data) => {
    return axios.get('/account/findAllAccount', {params: data});
}

//----------------------------------------------------------------------

//部门列表
export const departList = (data) => {
    return axios.get('/department/all', {params: data});
    // return axios.get('/department/allDepartment', { params : data } );
}

//新增部门
export const createDepart = (data) => {
    return axios.post('/department/add', data);
}

//修改部门
export const updateDepart = (data) => {
    return axios.post('/department/update', data);
}

//删除部门
export const deleteDepart = (guid) => {
    return axios.post('/department/delete', {guid});
}

//----------------------------------------------------------------------

//系统日志
export const log = (data) => {
    return axios.get('/log/systemLog', {params: data});
}

//----------------------------------------------------------------------

//登陆策略
export const loginstList = (data) => {
    return axios.get('/loginPolicy/findLoginPolicy', {params: data});
}

export const createLoginst = (data) => {
    return axios.post('/loginPolicy/addAddress', data);
}
export const deleteLoginst = (id) => {
    return axios.get('/loginPolicy/deleteAddress', {
        params: {
            guid: id
        }
    });
}

export const updateLoginst = (id, state) => {
    return axios.post('/loginPolicy/updateAddress', {
        guid: id,
        state
    });
}

//----------------------------------------------------------------------成员

//成员变更列表
export const memberChangeList = (data) => {
    return axios.get('/employeelog/employeelog', {params: data});
}

//成员列表
export const memberList = (data) => {
    return axios.get('/employee/findEmployee', {params: data});
}

//添加成员
export const addMember = (data) => {
    return axios.post('/employee/addEmployee', data);
}

//修改成员
export const updateMember = (data) => {
    return axios.post('/employee/updateEmployee', data);
}

//删除成员
export const deleteMember = (guid) => {
    return axios.post('/employee/deleteEmployee', {guid});
}

//成员离职
export const updateMemberState = (data) => {
    return axios.post('/employee/updateEmployeeState', data);
}

//成员离职
export const rollUpMemberState = (data) => {
    return axios.post('/employee/recoveryEmployeeState', data);
}


//成员转移
export const transferMember = (data) => {
    return axios.post('/employee/transferEmployee', data);
}

//部门-项目 树
export const dpList = () => {
    return axios.get('/department/dpList');
}

//----------------------------------------------------------------------

//项目列表
export const projectList = (data) => {
    return axios.get('/project/allProjects', {params: data});
}

//所有项目组名
export const projectGroup = () => {
    return axios.get('/project/allGroupName');
}

//新建项目
export const createProject = (data) => {
    return axios.post('/project/add', data);
}

//更新项目
export const updateProject = (data) => {
    return axios.post('/project/update', data);
}

//删除项目
export const deleteProject = (guid) => {
    return axios.post('/project/delete', {guid});
}

//获取图片
export const getfile = (fileName) => {
    return axios.get('/employee/getfile', {params: {fileName}});
}

//上传图片
export const uploadFile = (file) => {
    return axios.post('/employee/uploadFile', {file});
}

//上传图片地址
export const uploadFileUrl = '/api/employee/uploadFile';

//获取图片地址
export const getFileUrl = '/api/employee/getfile?fileName=';
