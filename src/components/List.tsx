import React from "react";

interface ListProps {
  title: string;
  number: number;
}

const List: React.FC<ListProps> = ({ title, number }) => {
  return (
    <div className="flex flex-col w-100 h-32 border rounded-md shadow  dark:bg-gray-800">
      <p className="p-2 border-b  bg-gray-200 rounded-t  dark:bg-gray-900 ">
        {title}
      </p>
      <div className="flex justify-center items-center flex-grow text-4xl">
        <p>{number}</p>
      </div>
    </div>
  );
};

export default List;
