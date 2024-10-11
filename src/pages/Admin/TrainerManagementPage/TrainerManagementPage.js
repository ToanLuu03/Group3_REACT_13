import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import TagMenu from '../../../components/Admin/TagMenu/TagMenu';

function TrainerManagementPage() {
    const { selectMenuItem } = useOutletContext();
    useEffect(() => {
        selectMenuItem('3');
    }, [selectMenuItem]);
    return (
        <div>
            <TagMenu/>
        </div>
    )
}

export default TrainerManagementPage;