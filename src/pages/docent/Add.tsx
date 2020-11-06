import React, { useState } from 'react';
import DocentForm from "../../components/Docent/Form";
interface DocentAddProps {}


const DocentAdd: React.FC<DocentAddProps> = (props) => {
  return (
    <div>
     <DocentForm/>
    </div>
  );
};

export default DocentAdd;
