import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function TrainerManagementPage() {
  const { selectMenuItem } = useOutletContext();
  useEffect(() => {
    selectMenuItem('3');
  }, [selectMenuItem]);
  return (
    <div>
      TrainerManagement
    </div>
  )
}

export default TrainerManagementPage;