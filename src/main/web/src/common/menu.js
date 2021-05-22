import run from '../assets/run.png'
import project from '../assets/layout/project.svg'
import system from '../assets/system.png'
import consumables from '../assets/consumables.png'

export const menuList = [
    {
        id: 'myPage',
        name: '个人信息'
    },
    {
        id: 'user',
        name: '用户管理'
    },
    {
        id: 'employee',
        name: '员工信息管理'
    },
    {
        id: 'system',
        name: '系统管理',
        children: [
            {
                id: 'dept',
                name: '部门管理',
                parentId: 'system'
            },
            {
                id: 'position',
                name: '职位管理',
                parentId: 'system'
            }
        ]
    }
]
