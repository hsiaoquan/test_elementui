import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {Users} from './data/user';

let _Users = Users;

export default{

  bootstrap(){
    let mock = new MockAdapter(axios);

    mock.onGet('/success').reply(200,{
      msg:'success'
    });

    mock.onGet('/error').reply(500,{
      msg:'failure'
    });


    //获取用户列表
    mock.onGet('/user/list').reply(config => {
       console.log(config);
       //config.params 放的是用户输入的name,params是user.vue中传递的
      let {name} = config.params;
      let mockUsers =  _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve,reject) =>{
        setTimeout(() => {
          resolve([200,{
            users:mockUsers
          }]);
        },1000);
      });
    });

    //获取用户列表分页
    mock.onGet('/user/listPage').reply(config =>{
      let {page,name} = config.params;
      let mockUsers = _Users.filter(user =>{
       if(name && user.name.indexOf(name) == -1) return false;
        return true;
      });

      let total  = mockUsers.length;
      mockUsers  = mockUsers.filter((u,index) => index < 20 * page && index >= 20 *(page -1 ));
      return new Promise((resolve, reject) => {
        setTimeout(() =>{
          resolve([200,{
            total:total,
            users:mockUsers

          }]);
        },100);
      });
    });










  }
}
