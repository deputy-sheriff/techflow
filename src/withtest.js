import React from 'react';
import Testing from './test';
import { Outlet } from 'react-router-dom';

function WithTest() {
  return (
    <>
      <Testing />
      <Outlet />
    </>
  );
}

export default WithTest;
