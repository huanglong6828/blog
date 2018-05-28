//配置符合当权限的数据表
export const constantButtonPermission = [
{
  name: 'person_details',
  title: '管理员详情',
  meta: {
    roles: ['m1', 'm2', 'm3'],
    types: ['maintenance']
  }
},
{
  name: 'elevator_delete',
  title: '删除按钮',
  meta: {
    roles: ['m1', 'm2', ],
    types: ['maintenance']
  }
}, ]