
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface UserSelectProps{
  defaultValue:string
}

const UserSelect: React.FC<UserSelectProps> = (props) => {

  function handleChange(value:any) {
    console.log(`selected ${value}`);
  }

  const {defaultValue}=props;
  return (
    <div>
    <Select defaultValue='' style={{ width: 120 }} onChange={handleChange} >
     <Option value=''>{defaultValue}</Option>
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
      <Option value="Yiminghe">yiminghe</Option>
    </Select>
    </div>
  );
};

export default UserSelect;
