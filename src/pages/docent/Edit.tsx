import React, { useState } from 'react';
import DocentForm from "../../components/Docent/Form";
interface DocentEditProps {}


const DocentEdit: React.FC<DocentEditProps> = (props) => {
  return (
    <div>
     <DocentForm/>
    </div>
  );
};

export default DocentEdit;
