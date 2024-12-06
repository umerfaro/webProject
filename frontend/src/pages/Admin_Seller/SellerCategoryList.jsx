// import { useState } from "react";
// import {
//   useCreateCategoryMutation,
//   useUpdateCategoryMutation,
//   useDeleteCategoryMutation,
//   useFetchCategoriesQuery,
// } from "../../redux/api/categoryApiSlice";

// import { toast } from "react-toastify";
// import CategoryForm from "../../components/CategoryForm";
// import Modal from "../../components/Modal";
// import AdminMenu from "./AdminMenu";

// const CategoryList = () => {
//   const { data: categories, refetch } = useFetchCategoriesQuery();
//   const [name, setName] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [updatingName, setUpdatingName] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);

//   const [createCategory] = useCreateCategoryMutation();
//   const [updateCategory] = useUpdateCategoryMutation();
//   const [deleteCategory] = useDeleteCategoryMutation();

//   const handleCreateCategory = async (e) => {
//     e.preventDefault();

//     if (!name) {
//       toast.error("Category name is required");
//       return;
//     }

//     try {
//       const result = await createCategory({ name }).unwrap();
//       if (result.error) {
//         toast.error(result.error);
//       } else {
//         setName("");
//         toast.success(`${result.name} is created.`);
        
//         // Force a refetch of categories to show the newly created category
//         refetch();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Creating category failed, try again.");
//     }
//   };

//   const handleUpdateCategory = async (e) => {
//     e.preventDefault();

//     if (!updatingName) {
//       toast.error("Category name is required");
//       return;
//     }

//     try {
//       const result = await updateCategory({
//         categoryId: selectedCategory._id,
//         updatedCategory: {
//           name: updatingName,
//         },
//       }).unwrap();

//       if (result.error) {
//         toast.error(result.error);
//       } else {
//         toast.success(`${result.name} is updated`);
//         setSelectedCategory(null);
//         setUpdatingName("");
//         setModalVisible(false);

//         // Refetch categories after update
//         refetch();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDeleteCategory = async () => {
//     try {
//       const result = await deleteCategory(selectedCategory._id).unwrap();

//       if (result.error) {
//         toast.error(result.error);
//       } else {
//         toast.success(`${result.name} is deleted.`);
//         setSelectedCategory(null);
//         setModalVisible(false);

//         // Refetch categories after delete
//         refetch();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Category deletion failed. Try again.");
//     }
//   };

//   return (
//     <div className="ml-[10rem] flex flex-col md:flex-row">
//       <AdminMenu />
//       <div className="md:w-3/4 p-3">
//         <div className="h-12">Manage Categories</div>
//         <CategoryForm
//           value={name}
//           setValue={setName}
//           handleSubmit={handleCreateCategory}
//         />
//         <br />
//         <hr />

//         <div className="flex flex-wrap">
//           {categories?.map((category) => (
//             <div key={category._id}>
//               <button
//                 className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none foucs:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
//                 onClick={() => {
//                   setModalVisible(true);
//                   setSelectedCategory(category);
//                   setUpdatingName(category.name);
//                 }}
//               >
//                 {category.name}
//               </button>
//             </div>
//           ))}
//         </div>

//         <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
//           <CategoryForm
//             value={updatingName}
//             setValue={(value) => setUpdatingName(value)}
//             handleSubmit={handleUpdateCategory}
//             buttonText="Update"
//             handleDelete={handleDeleteCategory}
//           />
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CategoryList;


// components/CategoryList.js
import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories, refetch, isLoading, isError, error } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      setName("");
      toast.success(`${result.name} is created.`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err.data?.error || "Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      toast.success(`${result.name} is updated`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err.data?.error || "Updating category failed, try again.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedCategory.name}?`)) {
      return;
    }

    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`${selectedCategory.name} is deleted.`);
      setSelectedCategory(null);
      setModalVisible(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err.data?.error || "Deleting category failed. Try again.");
    }
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (isError) return <div>Error: {error.data?.error || "Failed to load categories"}</div>;

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <AdminMenu />
      <div className="md:w-3/4 p-3">
        <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
          buttonText="Add Category"
        />
        <hr className="my-4" />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        {modalVisible && selectedCategory && (
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <CategoryForm
              value={updatingName}
              setValue={setUpdatingName}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
