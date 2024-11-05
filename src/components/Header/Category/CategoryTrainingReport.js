import React from 'react'
import ClassInfo from '../../../pages/TrainingReport/ClassInfo/ClassInfo'
import TraineeList from '../../../pages/TrainingReport/TraineeList/TraineeList'
import Calender from '../../../pages/TrainingReport/Calender/Calender'
import BOI from '../../../pages/TrainingReport/BOI/BOI'
import Activities from '../../../pages/TrainingReport/Activities/Activities'
import ScheduleTracker from '../../../pages/Trainer/TrainerManagement/ScheduleTracker/ScheduleTracker'
import ScheduleTraining from '../../../pages/Trainer/TrainerManagement/ScheduleTracker/ScheduleTraining/ScheduleTraining'
// import ScheduleTracker from '../../../pages/TrainingReport/ScheduleTracker/ScheduleTracker'

const CategoryTrainingReport = [
    {
        key: '1',
        label: "Class Info",
        children: (
            <div className='container-tracker'>
                <ClassInfo />
            </div>
        )
    },
    {
        key: '2',
        label: "Trainee List",
        children: (
            <div className='container-tracker'>
                <TraineeList />
            </div>
        )
    },
    {
        key: '3',
        label: "Calender",
        children: (
            <div className='container-tracker'>
                <Calender />
            </div>
        )
    },
    {
        key: '4',
        label: "Budget & Operation Info",
        children: (
            <div className='container-tracker'>
                <BOI />
            </div>
        )
    },
    {
        key: '5',
        label: "Activities",
        children: (
            <div className='container-tracker'>
                <Activities />
            </div>
        )
    },
    {
        key: '6',
        label: "Schedule Tracker",
        children: (
            <div className=''>
                {/* <ScheduleTracker />*/}
                <ScheduleTraining />

            </div>
        )
    },

]

export default CategoryTrainingReport
