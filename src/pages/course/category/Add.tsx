import React, { useState } from 'react';
import CategoryForm from "../../../components/Categroy/Form";
interface CategoryEditProps {}


const CategoryEdit: React.FC<CategoryEditProps> = (props) => {
  return (
    <div>
     <CategoryForm/>
    </div>
  );
};

export default CategoryEdit;
