import RoleManagement from "../../../pages/FamsAdmin/TrainerManagement/RoleManagement/RoleManagement";
import SkillManagement from "../../../pages/FamsAdmin/TrainerManagement/SkillManagement/SkillManagement";
import React from 'react'

const CategoryFamsAdmin = [
    {
        key: "1",
        label: "Role Management",
        children: (
            <div >
                <RoleManagement />
            </div>
        ),
    },
    {
        key: "2",
        label: "Skill Management",
        children: (
            <div >
                <SkillManagement />
            </div>
        ),
    }
];

export default CategoryFamsAdmin