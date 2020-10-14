import React from 'react';

export interface UserLayoutProps  {
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  return (
  <div>
    {props.children}
  </div>
  );
};

export default UserLayout;
