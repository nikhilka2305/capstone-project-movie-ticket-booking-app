import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MoviePreferences from "../../components/user/MoviePreferences";

function Profile({ type, idtype }) {
	const { isAuthenticated, user } = useContext(AuthContext);
	const [userData, setUserData] = useState();
	const navigate = useNavigate();
	console.log(type);
	const [loading, setLoading] = useState(false);
	console.log(user);
	const params = useParams();

	const idValue = params[idtype];
	console.log(idValue);

	useEffect(() => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/${type}/${idValue}/profile`;
		setLoading(true);
		async function getUser() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;
				console.log(responseData);
				setUserData(responseData);
			} catch (err) {
				console.log(err);
				if (!isAuthenticated) navigate("/");
				else if (isAuthenticated && user.role === "User")
					navigate(`/user/${user.loggedUserId}/profile`);
				else if (isAuthenticated && user.role === "TheaterOwner")
					navigate(`/theaterowner/${user.loggedUserId}/profile`);
				else if (isAuthenticated && user.role === "Admin")
					navigate(`/admin/${user.loggedUserId}/profile`);
			}
		}
		setLoading(false);
		getUser();
	}, [idValue, navigate, isAuthenticated, user]);

	return (
		<>
			{loading && <div>Loading..</div>}
			{userData ? (
				<div className="py-8 px-8 w-2/3 min-h-full mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 flex flex-col gap-8 sm:items-center sm:space-y-0 sm:space-x-6 my-16">
					<img
						className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
						src={
							userData.displayImage
								? userData.displayImage
								: "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg"
						}
						alt={`Profile photo of ${userData.username}`}
					/>

					<div className="text-center space-y-2 sm:text-left ">
						<div className="space-y-0.5 flex flex-col gap-4">
							<p className="text-xl text-black font-semibold">
								{userData.username}
							</p>
							<p className="text-slate-500 font-medium">{userData.email}</p>
							<p className="text-slate-500 font-medium">{userData.mobile}</p>
						</div>
						{userData && userData.role === "User" && (
							<MoviePreferences preferenceData={userData.moviePreferences} />
						)}
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}

export default Profile;
