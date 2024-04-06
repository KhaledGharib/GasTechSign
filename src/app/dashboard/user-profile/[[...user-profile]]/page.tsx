import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => {
  return (
    <div className="flex justify-center  overflow-auto items-center">
      <UserProfile />
    </div>
  );
};

export default UserProfilePage;
