//已通过cdn引入axios不需要在import导入，否则webpack又会打包axios导致文件app.js等文件过大，进而影响用户体验时间
//import axios from 'axios';

///注意axios的get和post发送请求参数格式不一样
// get请求
///axios.get(`${base}/user/updatePwd`, {params: params})

// post请求
//axios.post(`${base}/login`, params)

//设置请求的地址即URL(可以在main.js设置)
let base = '';

export const requestLogin  = params => {return axios.post('${base}/login',params).then(res => res.data);};

//用户信息
export const getUserList = params => {return axios.post(`${base}/user/list`,{params:params});};

export const getUserListPage = params => {return axios.get(`${base}/user/listPage`,{params:params});};

export const removeUser = params => { return axios.get(`/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`/user/add`, { params: params }); };

//商家信息
//参数名要在对应的xxx.vue声明，要保持一致的
export const getStoreList = params => {return axios.post(`${base}/store/list`,params);};

//具体要看xxx.vue文件定义函数有没有设置返回值（即有没有.then()内容)
export const getStoreListPage = params => {return axios.post(`${base}/store/listPage`,params);};

export const removeStore = params => { return axios.get(`/store/remove`, { params: params }); };

export const batchRemoveStore = params => { return axios.get(`/store/batchremove`, { params: params }); };

export const editStore = params => { return axios.get(`/store/edit`, { params: params }); };

export const addStore = params => { return axios.get(`/store/add`, { params: params }); };
