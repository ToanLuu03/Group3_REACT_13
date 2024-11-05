import React from 'react'
import GeneralData from '../../../pages/Statistics/GeneralData/GeneralData';
import ModuleStatitic from '../../../pages/Statistics/ModuleStatitic/ModuleStatitic';
import Feedback from '../../../pages/Statistics/Feedback/Feedback';
import GPA from '../../../pages/Statistics/GPA/GPA';

const CategoryStatistics = [
    {
        key: "1",
        label: "General data",
        children: (
            <div >
                <GeneralData />
            </div>
        ),
    },
    {
        key: "2",
        label: "Module Statistics",
        children: (
            <div >
                <ModuleStatitic />
            </div>
        ),
    },
    {
        key: "3",
        label: "Feedback",
        children: (
            <div >
                <Feedback/>
            </div>
        ),
    },
    {
        key: "4",
        label: "GPA",
        children: (
            <div >
                <GPA />
            </div>
        ),
    },
];

export default CategoryStatistics