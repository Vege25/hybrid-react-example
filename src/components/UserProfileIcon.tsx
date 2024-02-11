const UserProfileIcon = (props: {userInitial: string}) => {
  return (
    // JSX code for your component's UI
    <div className="relative bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center">
      <p className="text-white text-xl">{props.userInitial}</p>
    </div>
  );
};

export default UserProfileIcon;
