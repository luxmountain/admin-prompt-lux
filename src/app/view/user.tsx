import { useParams } from 'react-router-dom';

const UserViewPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>User Detail - ID: {id}</h1>
    </div>
  );
};

export default UserViewPage;
